/* Hero 3D backdrop: projected neural-network particles scoped to #home.
   Adapts the standalone visualization: canvas tracks the hero box (DPR aware),
   pointer input is hero-scoped, the loop pauses off-screen and honors
   prefers-reduced-motion with a single static frame. */
(function () {
  'use strict';
  var canvas = document.getElementById('hero3d');
  var hero = document.getElementById('home');
  if (!canvas || !hero || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var width = 0, height = 0, dpr = 1;
  var nodeCount = 220, bokehCount = 35, streakCount = 10;
  var connectionRadius = 170;

  function fit() {
    var r = hero.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  fit();
  // Fewer particles on narrow screens; counts stay fixed after init.
  if (width < 700) { nodeCount = 120; bokehCount = 16; streakCount = 6; }
  window.addEventListener('resize', function () {
    fit();
    if (RM) frame();
  });

  var nodes = [];
  var bokehCircles = [];
  var lightStreaks = [];

  var mouse = { x: -1000, y: -1000, active: false, isDown: false, lastX: 0, lastY: 0 };
  var cameraAngleX = 0, cameraAngleY = 0, targetAngleX = 0, targetAngleY = 0;

  // Sky blue, cyan, navy and sparkling white color palette
  var nodePalettes = [
    { r: 56, g: 189, b: 248, weight: 0.40 },
    { r: 255, g: 255, b: 255, weight: 0.25 },
    { r: 6, g: 182, b: 212, weight: 0.20 },
    { r: 14, g: 116, b: 144, weight: 0.10 },
    { r: 30, g: 58, b: 138, weight: 0.05 }
  ];

  function pickColor() {
    var rand = Math.random(), cumulative = 0;
    for (var i = 0; i < nodePalettes.length; i++) {
      cumulative += nodePalettes[i].weight;
      if (rand <= cumulative) return nodePalettes[i];
    }
    return nodePalettes[0];
  }

  function Node3D(x, y, z, isBurst) {
    this.x = x !== undefined ? x : (Math.random() - 0.5) * width * 0.85;
    this.y = y !== undefined ? y : (Math.random() - 0.5) * height * 0.85;
    this.z = z !== undefined ? z : (Math.random() - 0.5) * 600;
    var angle = Math.random() * Math.PI * 2;
    var speed = (Math.random() * 1.0 + 0.3) * (isBurst ? 3.0 : 1.0);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.vz = (Math.random() - 0.5) * 1.2;
    this.baseRadius = Math.random() * 2.6 + 1.2;
    this.color = pickColor();
    this.pulseSpeed = Math.random() * 0.05 + 0.02;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.isBurst = !!isBurst;
    this.life = isBurst ? 1.0 : 999;
  }
  Node3D.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    var boundX = width * 0.5, boundY = height * 0.5, boundZ = 400;
    if (this.x < -boundX) this.x = boundX;
    if (this.x > boundX) this.x = -boundX;
    if (this.y < -boundY) this.y = boundY;
    if (this.y > boundY) this.y = -boundY;
    if (this.z < -boundZ) this.z = boundZ;
    if (this.z > boundZ) this.z = -boundZ;
    if (this.isBurst) {
      this.life -= 0.012;
      this.baseRadius *= 0.99;
    }
    this.pulsePhase += this.pulseSpeed;
  };
  Node3D.prototype.project = function () {
    var cosY = Math.cos(cameraAngleY), sinY = Math.sin(cameraAngleY);
    var x1 = this.x * cosY - this.z * sinY;
    var z1 = this.z * cosY + this.x * sinY;
    var cosX = Math.cos(cameraAngleX), sinX = Math.sin(cameraAngleX);
    var y1 = this.y * cosX - z1 * sinX;
    var z2 = z1 * cosX + this.y * sinX;
    var focalLength = 500;
    var distance = focalLength + z2;
    var scale = distance > 0 ? focalLength / distance : 0.001;
    return {
      x: width / 2 + x1 * scale,
      y: height / 2 + y1 * scale,
      scale: scale,
      depth: z2,
      alpha: Math.max(0.1, Math.min(1.0, (z2 + 400) / 800))
    };
  };
  Node3D.prototype.draw = function () {
    var p = this.project();
    if (p.scale <= 0) return;
    var currentRadius = this.baseRadius * p.scale * (1 + 0.3 * Math.sin(this.pulsePhase));
    var alpha = (this.isBurst ? this.life : 0.85) * p.alpha;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 14 * p.scale;
    ctx.shadowColor = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
    ctx.fill();
    ctx.restore();
  };

  function BokehParticle() { this.reset(); }
  BokehParticle.prototype.reset = function () {
    this.x = (Math.random() - 0.5) * width * 1.6;
    this.y = (Math.random() - 0.5) * height * 1.6;
    this.z = (Math.random() - 0.5) * 800;
    this.radius = Math.random() * 60 + 25;
    this.color = pickColor();
    this.alpha = Math.random() * 0.05 + 0.01;
    this.vx = (Math.random() - 0.5) * 0.1;
    this.vy = (Math.random() - 0.5) * 0.1;
  };
  BokehParticle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
  };
  BokehParticle.prototype.draw = function () {
    var cosY = Math.cos(cameraAngleY * 0.3), sinY = Math.sin(cameraAngleY * 0.3);
    var x1 = this.x * cosY - this.z * sinY;
    var z1 = this.z * cosY + this.x * sinY;
    var focalLength = 600;
    var scale = focalLength / (focalLength + z1);
    if (scale <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(width / 2 + x1 * scale, height / 2 + this.y * scale, this.radius * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ')';
    ctx.fill();
    ctx.restore();
  };

  function LightStreak() { this.reset(true); }
  LightStreak.prototype.reset = function (anywhere) {
    this.x = Math.random() * width;
    this.y = anywhere ? Math.random() * height : -100;
    this.length = Math.random() * 350 + 120;
    this.speed = Math.random() * 2.0 + 0.8;
    this.angle = (Math.random() - 0.5) * 0.4 - 0.2;
    this.alpha = Math.random() * 0.1 + 0.02;
  };
  LightStreak.prototype.update = function () {
    this.y += this.speed;
    this.x += Math.sin(this.angle) * 1.2;
    if (this.y > height + 200) this.reset(false);
  };
  LightStreak.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    var gradient = ctx.createLinearGradient(this.x, this.y,
      this.x - Math.sin(this.angle) * this.length, this.y - this.length);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.sin(this.angle) * this.length, this.y - this.length);
    ctx.stroke();
    ctx.restore();
  };

  function initSimulation() {
    var i;
    nodes = [];
    for (i = 0; i < nodeCount; i++) nodes.push(new Node3D());
    bokehCircles = [];
    for (i = 0; i < bokehCount; i++) bokehCircles.push(new BokehParticle());
    lightStreaks = [];
    for (i = 0; i < streakCount; i++) lightStreaks.push(new LightStreak());
  }
  initSimulation();

  function local(e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  hero.addEventListener('mousedown', function (e) {
    mouse.isDown = true;
    var p = local(e);
    mouse.lastX = p.x; mouse.lastY = p.y;
  });
  hero.addEventListener('mousemove', function (e) {
    var p = local(e);
    mouse.x = p.x; mouse.y = p.y; mouse.active = true;
    if (mouse.isDown) {
      targetAngleY += (p.x - mouse.lastX) * 0.005;
      targetAngleX -= (p.y - mouse.lastY) * 0.005;
      mouse.lastX = p.x; mouse.lastY = p.y;
    }
  });
  window.addEventListener('mouseup', function () { mouse.isDown = false; });
  hero.addEventListener('mouseleave', function () {
    mouse.active = false; mouse.isDown = false; mouse.x = -1000; mouse.y = -1000;
  });
  hero.addEventListener('touchstart', function (e) {
    if (e.touches.length > 0) {
      mouse.isDown = true;
      var r = canvas.getBoundingClientRect();
      mouse.lastX = e.touches[0].clientX - r.left;
      mouse.lastY = e.touches[0].clientY - r.top;
    }
  }, { passive: true });
  hero.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
      mouse.active = true;
      if (mouse.isDown) {
        targetAngleY += (mouse.x - mouse.lastX) * 0.005;
        targetAngleX -= (mouse.y - mouse.lastY) * 0.005;
        mouse.lastX = mouse.x; mouse.lastY = mouse.y;
      }
    }
  }, { passive: true });
  hero.addEventListener('touchend', function () { mouse.isDown = false; mouse.active = false; });
  hero.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a,button,input,select,textarea')) return;
    var p = local(e);
    for (var i = 0; i < 24; i++) nodes.push(new Node3D(p.x - width / 2, p.y - height / 2, 0, true));
    if (nodes.length > 380) nodes.splice(0, 24);
  });

  var connRadSq = connectionRadius * connectionRadius;
  function frame() {
    if (!mouse.isDown) targetAngleY += 0.0012;
    cameraAngleX += (targetAngleX - cameraAngleX) * 0.08;
    cameraAngleY += (targetAngleY - cameraAngleY) * 0.08;

    // Deep navy blue & pitch black radial atmospheric gradient
    var bgGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) * 0.8);
    bgGradient.addColorStop(0, '#0a1128');
    bgGradient.addColorStop(0.5, '#030712');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    var i, j;
    for (i = 0; i < lightStreaks.length; i++) {
      lightStreaks[i].update();
      lightStreaks[i].draw();
    }
    for (i = 0; i < bokehCircles.length; i++) {
      bokehCircles[i].update();
      bokehCircles[i].draw();
    }

    var projected = new Array(nodes.length);
    for (i = 0; i < nodes.length; i++) {
      nodes[i].update();
      projected[i] = { node: nodes[i], proj: nodes[i].project() };
    }
    projected.sort(function (a, b) { return b.proj.depth - a.proj.depth; });

    ctx.lineWidth = 0.8;
    for (i = 0; i < projected.length; i++) {
      var item1 = projected[i];
      if (item1.proj.scale <= 0) continue;
      for (j = i + 1; j < projected.length; j++) {
        var item2 = projected[j];
        if (item2.proj.scale <= 0) continue;
        var dx = item1.node.x - item2.node.x;
        var dy = item1.node.y - item2.node.y;
        var dz = item1.node.z - item2.node.z;
        var distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < connRadSq) {
          var alpha = (1 - (Math.sqrt(distSq) / connectionRadius)) * 0.35 *
            Math.min(item1.proj.alpha, item2.proj.alpha);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.beginPath();
          ctx.moveTo(item1.proj.x, item1.proj.y);
          ctx.lineTo(item2.proj.x, item2.proj.y);
          ctx.stroke();
          ctx.restore();
        }
      }
      if (mouse.active) {
        var mdx = item1.proj.x - mouse.x;
        var mdy = item1.proj.y - mouse.y;
        var mDistSq = mdx * mdx + mdy * mdy;
        if (mDistSq < connRadSq * 1.5) {
          var mAlpha = (1 - (Math.sqrt(mDistSq) / (connectionRadius * 1.2))) * 0.45;
          ctx.save();
          ctx.globalAlpha = mAlpha;
          ctx.strokeStyle = 'rgba(125, 211, 252, 0.9)';
          ctx.beginPath();
          ctx.moveTo(item1.proj.x, item1.proj.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    for (i = 0; i < projected.length; i++) {
      projected[i].node.draw();
      if (projected[i].node.isBurst && projected[i].node.life <= 0) {
        var idx = nodes.indexOf(projected[i].node);
        if (idx !== -1) nodes.splice(idx, 1);
      }
    }
    while (nodes.length < nodeCount) nodes.push(new Node3D());
  }

  if (RM) {
    frame();
    return;
  }
  var raf = 0, visible = true;
  function tick() {
    raf = 0;
    if (!visible) return;
    frame();
    raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (!raf && visible) raf = requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      kick();
    }).observe(hero);
  }
  kick();
})();
