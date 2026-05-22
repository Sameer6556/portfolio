/* ============================================
   SAMEER SINGH — PORTFOLIO
   Particle wave 3D + GSAP for white theme
   ============================================ */

(function () {
    'use strict';

    const state = { mx: 0, my: 0, tx: 0, ty: 0, scroll: 0 };

    /* ── Loader ────────────────────────────── */
    function bootLoader() {
        window.addEventListener('load', function () {
            setTimeout(function () {
                document.getElementById('loader').classList.add('done');
                runHeroEntrance();
            }, 1800);
        });
    }

    /* ── Three.js: Particle Wave ───────────── */
    function bootScene() {
        var canvas = document.getElementById('bg-canvas');
        if (!canvas) return;

        var W = window.innerWidth, H = window.innerHeight;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
        camera.position.set(0, 12, 45);
        camera.lookAt(0, 0, 0);

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);

        /* Particle wave grid */
        var cols = 48, rows = 32, spacing = 1.3;
        var total = cols * rows;
        var positions = new Float32Array(total * 3);
        var basePositions = new Float32Array(total * 3);

        for (var ix = 0; ix < cols; ix++) {
            for (var iy = 0; iy < rows; iy++) {
                var idx = (ix * rows + iy) * 3;
                var x = (ix - cols / 2) * spacing;
                var y = (iy - rows / 2) * spacing;
                positions[idx] = x;
                positions[idx + 1] = y;
                positions[idx + 2] = 0;
                basePositions[idx] = x;
                basePositions[idx + 1] = y;
                basePositions[idx + 2] = 0;
            }
        }

        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        var mat = new THREE.PointsMaterial({
            size: 1.6,
            color: 0xc8c8cc,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true,
            depthWrite: false
        });

        var wave = new THREE.Points(geo, mat);
        wave.rotation.x = -Math.PI * 0.45;
        scene.add(wave);

        /* Floating accent shapes */
        var wireMat = function (c, o) {
            return new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: o });
        };

        var ring1 = new THREE.Mesh(
            new THREE.TorusGeometry(5, 0.04, 16, 100),
            wireMat(0xd0d0d4, 0.12)
        );
        ring1.position.set(18, 6, -15);
        ring1.rotation.x = Math.PI * 0.3;
        scene.add(ring1);

        var ring2 = new THREE.Mesh(
            new THREE.TorusGeometry(3.5, 0.03, 16, 80),
            wireMat(0xc0c0c8, 0.08)
        );
        ring2.position.set(-16, -4, -12);
        ring2.rotation.y = Math.PI * 0.5;
        scene.add(ring2);

        var ico = new THREE.Mesh(
            new THREE.IcosahedronGeometry(2, 1),
            wireMat(0xd4d4d8, 0.06)
        );
        ico.position.set(-18, 8, -18);
        scene.add(ico);

        var octa = new THREE.Mesh(
            new THREE.OctahedronGeometry(1.8, 0),
            wireMat(0xc8c8d0, 0.06)
        );
        octa.position.set(14, -6, -20);
        scene.add(octa);

        /* Mouse */
        document.addEventListener('mousemove', function (e) {
            state.tx = (e.clientX / W - 0.5) * 2;
            state.ty = (e.clientY / H - 0.5) * 2;
        });

        window.addEventListener('scroll', function () {
            state.scroll = window.scrollY;
        });

        /* Animate */
        var clock = new THREE.Clock();

        function tick() {
            requestAnimationFrame(tick);
            var t = clock.getElapsedTime();

            state.mx += (state.tx - state.mx) * 0.03;
            state.my += (state.ty - state.my) * 0.03;

            /* Wave displacement */
            var arr = geo.attributes.position.array;
            for (var ix = 0; ix < cols; ix++) {
                for (var iy = 0; iy < rows; iy++) {
                    var idx = (ix * rows + iy) * 3;
                    var bx = basePositions[idx];
                    var by = basePositions[idx + 1];
                    var dist = Math.sqrt(bx * bx + by * by);
                    arr[idx + 2] = Math.sin(dist * 0.18 - t * 0.7) * 2.2
                        + Math.cos(bx * 0.12 + t * 0.5) * 0.8
                        + Math.sin(by * 0.14 + t * 0.4) * 0.6;
                }
            }
            geo.attributes.position.needsUpdate = true;

            /* Shapes */
            ring1.rotation.z += 0.002;
            ring1.rotation.x += 0.001;
            ring1.position.y = 6 + Math.sin(t * 0.3) * 1.5;

            ring2.rotation.z -= 0.0015;
            ring2.position.y = -4 + Math.cos(t * 0.35) * 1.2;

            ico.rotation.x += 0.002;
            ico.rotation.y += 0.003;
            ico.position.y = 8 + Math.sin(t * 0.4) * 1;

            octa.rotation.y += 0.003;
            octa.rotation.z += 0.001;

            /* Camera parallax */
            camera.position.x += (state.mx * 3 - camera.position.x) * 0.012;
            camera.position.y = 12 + (-state.my * 2 - (camera.position.y - 12)) * 0.012 + camera.position.y - 12;

            var sf = Math.min(state.scroll * 0.002, 10);
            camera.position.z = 45 + sf;

            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
        }

        tick();

        window.addEventListener('resize', function () {
            W = window.innerWidth;
            H = window.innerHeight;
            camera.aspect = W / H;
            camera.updateProjectionMatrix();
            renderer.setSize(W, H);
        });
    }

    /* ── Hero entrance ─────────────────────── */
    function runHeroEntrance() {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to('.hero-name', { opacity: 1, y: 0, duration: 0.9, delay: 0.05 })
          .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
          .to('.hero-cta', { opacity: 1, y: 0, duration: 0.75 }, '-=0.4')
          .to('.hero-meta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
          .to('.scroll-indicator', { opacity: 1, duration: 0.9 }, '-=0.3');
    }

    /* ── Scroll reveals ────────────────────── */
    function bootScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('.section:not(.hero-section)').forEach(function (sec) {
            var els = sec.querySelectorAll('.reveal');
            if (!els.length) return;
            gsap.to(els, {
                opacity: 1, y: 0, duration: 0.8,
                stagger: 0.09, ease: 'power3.out',
                scrollTrigger: { trigger: sec, start: 'top 82%', toggleActions: 'play none none none' }
            });
        });

        document.querySelectorAll('.project-card').forEach(function (c, i) {
            gsap.to(c, {
                opacity: 1, y: 0, duration: 0.85,
                delay: i * 0.1, ease: 'power3.out',
                scrollTrigger: { trigger: c, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        document.querySelectorAll('.stat-card').forEach(function (c, i) {
            gsap.to(c, {
                opacity: 1, y: 0, scale: 1, duration: 0.6,
                delay: i * 0.07, ease: 'back.out(1.2)',
                scrollTrigger: { trigger: c, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });

        document.querySelectorAll('.skill-group').forEach(function (g) {
            var tags = g.querySelectorAll('.tag');
            gsap.fromTo(tags,
                { opacity: 0, scale: 0.85, y: 6 },
                { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.02, ease: 'back.out(1.6)',
                  scrollTrigger: { trigger: g, start: 'top 86%', toggleActions: 'play none none none' } }
            );
        });

        ScrollTrigger.create({
            start: 160,
            onUpdate: function () {
                var el = document.querySelector('.scroll-indicator');
                if (el) {
                    var gone = window.scrollY > 160;
                    el.style.opacity = gone ? '0' : '1';
                    el.style.pointerEvents = gone ? 'none' : 'auto';
                }
            }
        });
    }

    /* ── Navigation ────────────────────────── */
    function bootNav() {
        var nav = document.getElementById('main-nav');
        var toggle = document.getElementById('nav-toggle');
        var menu = document.getElementById('mobile-menu');
        var last = 0;

        window.addEventListener('scroll', function () {
            var s = window.scrollY;
            nav.classList.toggle('scrolled', s > 50);

            if (s > 350) {
                if (s > last + 3) nav.style.transform = 'translateY(-100%)';
                else if (s < last - 3) nav.style.transform = 'translateY(0)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            last = s;
        });

        if (toggle && menu) {
            toggle.addEventListener('click', function () {
                var on = toggle.classList.toggle('active');
                menu.classList.toggle('active');
                toggle.setAttribute('aria-expanded', on);
                document.body.style.overflow = on ? 'hidden' : '';
            });
            menu.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', function () {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
        }

        /* Smooth scroll — only for #hash links */
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    var offset = nav.offsetHeight + 16;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
                }
            });
        });

        /* Active link highlight */
        var sections = document.querySelectorAll('section[id]');
        var links = document.querySelectorAll('.nav-link');
        window.addEventListener('scroll', function () {
            var cur = '';
            sections.forEach(function (s) {
                if (window.scrollY >= s.offsetTop - 130) cur = s.id;
            });
            links.forEach(function (l) {
                l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
            });
        });
    }

    /* ── Tilt on cards ─────────────────────── */
    function bootTilt() {
        if (window.matchMedia('(hover: none)').matches) return;
        document.querySelectorAll('.project-card, .stat-card, .contact-card').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = 'perspective(600px) rotateX(' + (y * -3) + 'deg) rotateY(' + (x * 3) + 'deg) translateY(-5px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    /* ── Boot ──────────────────────────────── */
    function init() {
        bootLoader();
        bootScene();
        bootNav();

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            bootScrollAnimations();
        } else {
            window.addEventListener('load', bootScrollAnimations);
        }

        window.addEventListener('load', bootTilt);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
