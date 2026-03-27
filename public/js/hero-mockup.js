        // ── Hero Mockup: Interactive Page Switching ──
        (function() {
            var mockup = document.getElementById('hero-mockup');
            if (!mockup) return;

            var navItems = mockup.querySelectorAll('.mockup-nav-item[data-page]');
            var pages = mockup.querySelectorAll('.mockup-page[data-page]');
            var dots = mockup.querySelectorAll('.mockup-auto-dot[data-page]');
            var urlEl = document.getElementById('mockup-url');
            var pageNames = {
                dashboard: 'app.servantium.com',
                engagement: 'app.servantium.com/engagements/kvwn-salesforce',
                resources: 'app.servantium.com/resources',
                notes: 'app.servantium.com/engagements/kvwn-salesforce/notes',
                documents: 'app.servantium.com/engagements/kvwn-salesforce/documents',
                learning: 'app.servantium.com/intelligence'
            };
            var pageOrder = ['notes', 'engagement', 'documents', 'resources', 'dashboard', 'learning'];
            var currentIndex = 0;
            var cycleTimer = null;
            var pauseTimer = null;
            var resViewTimer = null;
            var engHighlightTimer = null;
            var docScrollTimer = null;
            var learnTimers = [];
            var noteTypeTimers = [];
            var CYCLE_MS = 12000;
            var PAUSE_MS = 20000;

            function switchTo(pageName) {
                navItems.forEach(function(n) { n.classList.toggle('active', n.dataset.page === pageName); });
                pages.forEach(function(p) { p.classList.toggle('active', p.dataset.page === pageName); });
                dots.forEach(function(d) { d.classList.toggle('active', d.dataset.page === pageName); });
                if (urlEl) urlEl.textContent = pageNames[pageName] || 'app.servantium.com';
                currentIndex = pageOrder.indexOf(pageName);

                // Notes page: typewriter animation
                var noteChunks = mockup.querySelectorAll('#note-typewriter .note-chunk');
                var noteCursor = document.getElementById('note-cursor');
                var noteInsight = document.getElementById('note-insight');
                if (noteTypeTimers) { noteTypeTimers.forEach(clearTimeout); noteTypeTimers = []; }
                if (pageName === 'notes') {
                    // First hide all chunks immediately
                    noteChunks.forEach(function(c) { c.classList.add('typing'); });
                    if (noteCursor) noteCursor.style.display = 'inline-block';
                    if (noteInsight) { noteInsight.classList.remove('note-visible'); noteInsight.classList.add('note-hidden'); }
                    // Small delay to ensure DOM is ready before starting animation
                    noteTypeTimers.push(setTimeout(function() {
                        noteChunks.forEach(function(c, i) {
                            noteTypeTimers.push(setTimeout(function() { c.classList.remove('typing'); }, i * 350));
                        });
                        // Hide cursor and show insight bar after all chunks
                        noteTypeTimers.push(setTimeout(function() {
                            if (noteCursor) noteCursor.style.display = 'none';
                            if (noteInsight) { noteInsight.classList.remove('note-hidden'); noteInsight.classList.add('note-visible'); }
                        }, noteChunks.length * 350 + 300));
                    }, 100));
                } else {
                    noteChunks.forEach(function(c) { c.classList.add('typing'); });
                    if (noteCursor) noteCursor.style.display = 'none';
                    if (noteInsight) { noteInsight.classList.remove('note-visible'); noteInsight.classList.add('note-hidden'); }
                }

                // Resources page: switch from Month to Week view mid-display
                if (resViewTimer) { clearTimeout(resViewTimer); resViewTimer = null; }
                var resPage = mockup.querySelector('.mockup-page[data-page="resources"]');
                var monthView = resPage.querySelector('.res-month-view');
                var weekView = resPage.querySelector('.res-week-view');
                var toggleBtns = resPage.querySelectorAll('.mock-res-toggle span');
                if (pageName === 'resources') {
                    // Start on month view
                    monthView.style.display = '';
                    weekView.style.display = 'none';
                    toggleBtns.forEach(function(b) { b.classList.toggle('active', b.textContent === 'Month'); });
                    // Switch to week view after 3.5s
                    resViewTimer = setTimeout(function() {
                        monthView.style.display = 'none';
                        weekView.style.display = '';
                        toggleBtns.forEach(function(b) { b.classList.toggle('active', b.textContent === 'Week'); });
                    }, 3500);
                } else {
                    monthView.style.display = '';
                    weekView.style.display = 'none';
                    toggleBtns.forEach(function(b) { b.classList.toggle('active', b.textContent === 'Month'); });
                }

                // Engagement page: highlight Implementation group after 2s
                if (engHighlightTimer) { clearTimeout(engHighlightTimer); engHighlightTimer = null; }
                var estGroups = mockup.querySelectorAll('.est-group');
                estGroups.forEach(function(g) { g.classList.remove('est-group-highlight'); });
                if (pageName === 'engagement' && estGroups.length >= 2) {
                    engHighlightTimer = setTimeout(function() {
                        estGroups[1].classList.add('est-group-highlight');
                        setTimeout(function() { estGroups[1].classList.remove('est-group-highlight'); }, 1500);
                    }, 2000);
                }

                // Documents page: scroll SOW preview after 1.5s
                if (docScrollTimer) { clearTimeout(docScrollTimer); docScrollTimer = null; }
                var docPreview = mockup.querySelector('.mockup-page[data-page="documents"] .mock-doc-preview');
                if (docPreview) {
                    docPreview.scrollTop = 0;
                    if (pageName === 'documents') {
                        docPreview.classList.add('doc-scrolling');
                        docScrollTimer = setTimeout(function() {
                            docPreview.scrollTop = docPreview.scrollHeight;
                        }, 1500);
                    } else {
                        docPreview.classList.remove('doc-scrolling');
                    }
                }

                // Learning page: stagger card appearance
                if (learnTimers.length) { learnTimers.forEach(clearTimeout); learnTimers = []; }
                var learnCards = mockup.querySelectorAll('.mockup-page[data-page="learning"] .mock-learn-card');
                var learnFeed = mockup.querySelector('.mockup-page[data-page="learning"] .mock-learn-feed');
                if (pageName === 'learning') {
                    learnCards.forEach(function(c) { c.classList.add('learn-hidden'); c.classList.remove('learn-visible'); });
                    if (learnFeed) { learnFeed.classList.add('learn-hidden'); learnFeed.classList.remove('learn-visible'); }
                    learnCards.forEach(function(c, i) {
                        learnTimers.push(setTimeout(function() {
                            c.classList.remove('learn-hidden');
                            c.classList.add('learn-visible');
                        }, 1000 + i * 600));
                    });
                    if (learnFeed) {
                        learnTimers.push(setTimeout(function() {
                            learnFeed.classList.remove('learn-hidden');
                            learnFeed.classList.add('learn-visible');
                        }, 1000 + learnCards.length * 600));
                    }
                } else {
                    learnCards.forEach(function(c) { c.classList.remove('learn-hidden', 'learn-visible'); });
                    if (learnFeed) learnFeed.classList.remove('learn-hidden', 'learn-visible');
                }
            }

            function cycleNext() {
                currentIndex = (currentIndex + 1) % pageOrder.length;
                switchTo(pageOrder[currentIndex]);
            }

            function startCycle() {
                stopCycle();
                cycleTimer = setInterval(cycleNext, CYCLE_MS);
            }

            function stopCycle() {
                if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
            }

            function pauseAndResume() {
                stopCycle();
                if (pauseTimer) clearTimeout(pauseTimer);
                pauseTimer = setTimeout(startCycle, PAUSE_MS);
            }

            // Nav item clicks
            navItems.forEach(function(item) {
                item.addEventListener('click', function() {
                    switchTo(item.dataset.page);
                    pauseAndResume();
                });
            });

            // Dot clicks
            dots.forEach(function(dot) {
                dot.addEventListener('click', function() {
                    switchTo(dot.dataset.page);
                    pauseAndResume();
                });
            });

            // Initialize first page (notes) and start auto-cycle
            switchTo('notes');
            startCycle();
        })();

        // ── Hero Rotating Words — 3D revolving door ──
        (function() {
            document.querySelectorAll('.hero-rotating').forEach(function(container) {
                var words = container.querySelectorAll('.hero-rotating-word');
                if (words.length < 2) return;
                var idx = 0;
                setInterval(function() {
                    var current = words[idx];
                    current.classList.remove('active');
                    current.classList.add('exit');
                    idx = (idx + 1) % words.length;
                    var next = words[idx];
                    next.classList.remove('exit');
                    next.classList.add('active');
                    // Clean exit class after transition
                    setTimeout(function() { current.classList.remove('exit'); }, 700);
                }, 3500);
            });
        })();

        // Lifecycle panel data
        const lifecycleData = [
            {
                title: "Discovery",
                description: "Understand client needs, pain points, and desired outcomes. Capture context that will inform every downstream decision—from pricing to resource allocation to success metrics.",
                image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
            },
            {
                title: "Estimation",
                description: "Transform discovery insights into structured scope and pricing. Draw from encoded service definitions and historical engagement data to build accurate, defensible estimates.",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
            },
            {
                title: "Proposal",
                description: "Generate proposals that reflect your actual service architecture—not copy-pasted templates. Scope, pricing, and deliverables flow directly from your estimation work.",
                image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
            },
            {
                title: "Activation",
                description: "Win the deal, assign the team, and activate the engagement. Resources, timelines, and deliverables align automatically from your scoped work.",
                image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&h=400&fit=crop"
            },
            {
                title: "Delivery",
                description: "Execute against the engagement scope with real-time visibility into progress, utilization, and margin. Delivery teams work from the same context that sales created.",
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop"
            },
            {
                title: "Learning",
                description: "Capture what actually happened—variance from estimate, delivery lessons, client feedback. This intelligence feeds back into how you price and scope future work.",
                image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=400&fit=crop"
            }
        ];

        let activeStep = null;

        // Check if mobile
        function isMobile() {
            return window.innerWidth <= 768;
        }

        // Mobile: expand/collapse inline content
        function toggleMobileStep(step) {
            const wasExpanded = step.classList.contains('expanded');
            // Collapse all steps first
            document.querySelectorAll('.lifecycle-step').forEach(s => s.classList.remove('expanded'));
            // If it wasn't expanded, expand it
            if (!wasExpanded) {
                step.classList.add('expanded');
            }
            // Hide the tap hint after first interaction
            const hint = document.querySelector('.mobile-tap-hint');
            if (hint) hint.style.display = 'none';
        }

        // Panel show/hide on hover and click (desktop)
        document.querySelectorAll('.lifecycle-step').forEach(step => {
            const index = parseInt(step.dataset.index);

            step.addEventListener('mouseenter', () => {
                if (!isMobile()) {
                    showPanel(index, step);
                }
            });

            // Handle both click and keyboard activation
            function activateStep() {
                if (isMobile()) {
                    toggleMobileStep(step);
                } else {
                    if (activeStep === index) {
                        hidePanel();
                        activeStep = null;
                        step.setAttribute('aria-expanded', 'false');
                    } else {
                        showPanel(index, step);
                        activeStep = index;
                        // Update aria-expanded on all steps
                        document.querySelectorAll('.lifecycle-step').forEach(s => {
                            s.setAttribute('aria-expanded', s === step ? 'true' : 'false');
                        });
                    }
                }
            }

            step.addEventListener('click', activateStep);

            // Keyboard support: Enter and Space
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateStep();
                }
            });
        });

        function showPanel(index, step) {
            const panel = document.getElementById('lifecycle-panel');
            const data = lifecycleData[index];

            document.getElementById('panel-image').src = data.image;
            document.getElementById('panel-image').alt = data.title + ' phase illustration';
            document.getElementById('panel-title').textContent = data.title;
            document.getElementById('panel-description').textContent = data.description;

            // Remove active from all steps
            document.querySelectorAll('.lifecycle-step').forEach(s => s.classList.remove('active'));
            step.classList.add('active');

            panel.classList.add('active');
        }

        function hidePanel() {
            document.getElementById('lifecycle-panel').classList.remove('active');
            document.querySelectorAll('.lifecycle-step').forEach(s => s.classList.remove('active'));
        }

        // Keep panel visible when mouse leaves if clicked (desktop only)
        document.querySelector('.core-concept').addEventListener('mouseleave', () => {
            if (!isMobile() && activeStep === null) {
                hidePanel();
            }
        });

        // Collapse mobile steps when scrolling away from section
        const lifecycleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && isMobile()) {
                    // Collapse all steps when section leaves view
                    document.querySelectorAll('.lifecycle-step').forEach(s => s.classList.remove('expanded'));
                    // Show the tap hint again
                    const hint = document.querySelector('.mobile-tap-hint');
                    if (hint) hint.style.display = 'block';
                }
            });
        }, { threshold: 0.1 });

        const conceptSection = document.querySelector('.core-concept');
        if (conceptSection) {
            lifecycleObserver.observe(conceptSection);
        }

        // Section fade-in
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(24px)';
            section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            observer.observe(section);
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // HERO MOCKUP — Interactive Page Switching
        (function() {
            var mockup = document.getElementById('hero-mockup');
            if (!mockup) return;

            var navItems = mockup.querySelectorAll('.mockup-nav-item[data-page]');
            var pages = mockup.querySelectorAll('.mockup-page[data-page]');
            var dots = mockup.querySelectorAll('.mockup-auto-dot[data-page]');
            var urlEl = document.getElementById('mockup-url');
            var pageNames = { dashboard: 'app.servantium.com', engagement: 'app.servantium.com/engagements/kvwn-salesforce', resources: 'app.servantium.com/resources', notes: 'app.servantium.com/engagements/kvwn-salesforce/notes' };
            var pageOrder = ['dashboard', 'engagement', 'resources', 'notes'];
            var currentIdx = 0;
            var autoTimer = null;
            var userPaused = false;
            var resumeTimer = null;

            function switchTo(pageName) {
                navItems.forEach(function(n) { n.classList.toggle('active', n.getAttribute('data-page') === pageName); });
                pages.forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-page') === pageName); });
                dots.forEach(function(d) { d.classList.toggle('active', d.getAttribute('data-page') === pageName); });
                if (urlEl && pageNames[pageName]) urlEl.textContent = pageNames[pageName];
                currentIdx = pageOrder.indexOf(pageName);
            }

            function autoAdvance() {
                currentIdx = (currentIdx + 1) % pageOrder.length;
                switchTo(pageOrder[currentIdx]);
            }

            function startAuto() {
                stopAuto();
                autoTimer = setInterval(autoAdvance, 4000);
            }

            function stopAuto() {
                if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
            }

            function onUserInteract(pageName) {
                userPaused = true;
                stopAuto();
                if (resumeTimer) clearTimeout(resumeTimer);
                switchTo(pageName);
                resumeTimer = setTimeout(function() { userPaused = false; startAuto(); }, 12000);
            }

            navItems.forEach(function(item) {
                item.addEventListener('click', function() {
                    var pg = this.getAttribute('data-page');
                    if (pg) onUserInteract(pg);
                });
            });

            dots.forEach(function(dot) {
                dot.addEventListener('click', function() {
                    var pg = this.getAttribute('data-page');
                    if (pg) onUserInteract(pg);
                });
            });

            startAuto();
        })();
