# Portfolio Upgrade Tracker

105 features. Skipped per request: rate cards (#57). Everything else ships.
Legend: [x] done · [~] done with honest deviation (see note) · [ ] open

## Hero & first impression
- [x] 1. Animated typing/rotating role titles
- [x] 2. Live availability badge
- [x] 3. Current local time in Nairobi
- [x] 4. Scroll-down indicator arrow
- [~] 5. ~~Hero background slideshow~~ — REMOVED per request (Nairobi image removed)
- [~] 6. ~~Particle canvas behind the hero~~ — REPLACED by the 3D network hero canvas (hero3d.js); banner image retired from the hero
- [x] 7. Greeting that changes by time of day
- [x] 8. One-line value proposition under the name
- [x] 9. Years-of-experience auto-counter
- [x] 10. Download-CV button with file size shown

## About
- [x] 11. Expandable "read more" bio
- [x] 12. Fun-facts row
- [x] 13. Languages with proficiency dots
- [x] 14. "Currently learning" strip
- [~] 15. ~~Photo gallery~~ — REMOVED per request
- [x] 16. Career journey strip
- [x] 17. Values list
- [x] 18. Resume highlights sidebar

## Resume & CV
- [x] 19. Timeline hover cards
- [x] 20. Filter experience by skill
- [x] 21. Downloadable PDF + DOCX + print stylesheet
- [x] 22. Copy-email-to-clipboard button
- [x] 23. Proof points per role (key wins)
- [x] 24. Key metric callouts band
- [x] 25. Certificates with issuer links
- [x] 26. Courses with progress state
- [x] 27. Awards and hackathons shelf
- [x] 28. Employment continuity note

## Portfolio & projects
- [x] 29. Case-study detail per project (problem → process → result)
- [~] 30. ~~Before/after comparison slider~~ — REMOVED per request
- [x] 31. Live demo + repo links per card
- [x] 32. Tech-stack tag filtering
- [x] 33. Screenshots carousel per project
- [x] 34. Video embed support in project modal
- [x] 35. Star/fork counts from GitHub API
- [x] 36. Featured project spotlight banner
- [x] 37. Project search box
- [x] 38. Project sorting
- [x] 39. Independent / client work grouping
- [x] 40. Repo status badges (stars, forks, language)

## Skills
- [x] 41. Skill bars animated on scroll
- [x] 42. Skill endorsement buttons
- [x] 43. Tools marquee strip
- [x] 44. Skills radar chart
- [x] 45. "Ask me about" topic chips
- [x] 46. Certification issuer badges

## Social proof
- [x] 47. References carousel (real referees)
- [x] 48. Client/employer logo wall
- [x] 49. GitHub profile card
- [x] 50. GitHub activity graph
- [x] 51. Reference quotes (folded into #47)
- [x] 52. Press line ("press kit on request")

## Contact & hiring
- [x] 53. Working contact form with delivery
- [x] 54. Call-booking intent capture (topic select)
- [x] 55. Copyable email + phone buttons
- [x] 56. WhatsApp chat button
- [~] 57. ~~Rate/availability card~~ — SKIPPED per request (no rate cards)
- [x] 58. FAQ accordion (timelines, process — no rates)
- [x] 59. Response-time promise badge
- [x] 60. Newsletter signup (delivered to inbox)

## Blog & writing
- [x] 61. Blog with reading-time estimates
- [x] 62. Featured article hero card
- [x] 63. Tag filtering
- [x] 64. Code snippets with copy buttons
- [x] 65. Table of contents on long posts
- [x] 66. Related-posts suggestions

## Motion & delight
- [~] 67. ~~Custom cursor with hover states~~ — REMOVED per request
- [x] 68. Magnetic buttons
- [x] 69. Page-load intro animation
- [x] 70. Smooth scrolling between sections
- [x] 71. Section reveal stagger
- [x] 72. Scroll progress bar
- [x] 73. Back-to-top floating button
- [x] 74. Confetti burst on form success
- [x] 75. Konami-code easter egg
- [x] 76. Seasonal touch (December snow)

## Personalization & UX
- [x] 77. Dark/light mode toggle
- [x] 78. Accent-color picker
- [x] 79. Font-size control
- [x] 80. EN/Kiswahili UI switcher (chrome + headings; body copy stays English)
- [x] 81. Remember-visitor greeting
- [x] 82. Breadcrumb nav on deep pages
- [x] 83. Site-wide search overlay

## Performance, SEO & sharing
- [x] 84. Open Graph + Twitter cards
- [x] 85. JSON-LD person schema
- [x] 86. sitemap.xml + robots.txt
- [x] 87. Lazy-loaded images
- [x] 88. WebP image variants with fallback
- [x] 89. Perf budget basics (defer, minimal deps, preconnect)
- [x] 90. Offline fallback page + service worker
- [x] 91. Share buttons (Web Share + copy link)
- [~] 92. ~~QR code linking to the site~~ — REMOVED per request

## Trust & credibility
- [x] 93. Freelance marketplace badges (profiles shared on request)
- [x] 94. Proposal template download
- [x] 95. Process one-pager
- [x] 96. Revision policy note (edit to taste)
- [x] 97. Privacy note under the contact form

## Analytics & growth
- [x] 98. Plausible analytics snippet (activates after free signup)
- [x] 99. Local most-viewed-projects ranking
- [x] 100. Enquiry event tracking (Plausible guard)
- [x] 101. Hero headline A/B rotation (sticky)
- [x] 102. "Hire me" CTA in every project modal
- [x] 103. Exit-intent contact nudge (once per session)
- [x] 104. Email auto-reply confirming receipt
- [x] 105. "What I shipped" changelog

## Fix round (Nov 13) — all requested removals + polish verified at 390/768/1024/1366/1600
- Removed: Nairobi hero image, drag-to-compare slider, home-base, data-visualised, human sections, custom cursor.
- Resume columns rebalanced ("Currently" moved under "Ask me about"); dead space below the skills column gone.
- Sticky nav made solid (was translucent, content ghosted through); no horizontal overflow at any width; zero console errors.
- QR code removed from footer; GitHub card/activity graph degrade gracefully with link fallbacks; logo wall pills uniform + centered (dark-navy dental mark sits on a light plaque); site-wide hover-feel upgrade (buttons, nav underline, cards, stats, refs, services, changelog); scroll-spy re-probed — exactly one active link per section.
- Banner image retired from the hero; Downloads neural-network 3D viz integrated as the responsive hero backdrop (hero3d.js: DPR-aware, hero-scoped drag/click, off-screen pause, reduced-motion still). Dust particle layer removed with it (the 3D subsumes it).

## Honest-deviation notes
- 23: per-role "key wins" use only facts from the CV/work history, not invented quotes.
- 25: links point to issuers; no credential IDs were available.
- 30: demonstrates on the portrait (grayscale vs color), honestly labeled.
- 34: modal renders video when a project gets a walkthrough URL; none exists yet.
- 38: sorts Featured / A–Z (repo dates unavailable offline).
- 47/51: real referees from the CV, no invented testimonial quotes.
- 49: GitHub card (no LinkedIn URL known).
- 54: topic select incl. "book a call"; Cal.com embed needs your scheduling link.
- 58: FAQ covers timelines/process/availability; rates excluded per request.
- 80: UI chrome translated; long-form copy stays English.
- 89: no Lighthouse run in this environment; budget-conscious build instead.
- 93: no marketplace profile URLs known; badges say "on request".
- 98/100: live once you register the domain at Plausible (free).
