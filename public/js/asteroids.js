/**
 * Servantium Asteroids Game
 * A hidden easter egg game that can be triggered by double-clicking a designated element.
 *
 * Usage:
 * 1. Include this script on your page
 * 2. Add game arena HTML (see initAsteroidsGame for required elements)
 * 3. Call initAsteroidsGame(triggerSelector, arenaSelector, containerSelector)
 */

(function() {
    'use strict';

    // Game state
    const gameState = {
        active: false,
        score: 0,
        lives: 3,
        level: 1,
        ship: null,
        bullets: [],
        asteroids: [],
        keys: {},
        lastShot: 0,
        shotCooldown: 150,
        invulnerable: false,
        invulnerableTime: 0,
        gameOver: false,
        hintTimeout: null,
        gameStartTime: 0,
        gracePeriod: 60000,
        playerHasMoved: false
    };

    // Game dimensions (will be set during init)
    let GAME_WIDTH = 500;
    let GAME_HEIGHT = 500;
    let gameContainer = null;
    let gameArena = null;
    let hintArrow = null;

    // Touch state for mobile controls
    const touchState = {
        moveTouch: null,
        fireTouch: null,
        autoFireInterval: null
    };

    // Asteroid color palette
    const asteroidColors = [
        { bg: 'linear-gradient(135deg, #4C82A7 0%, #3a6a8a 50%, #2d5570 100%)', shadow: '#4C82A7' },
        { bg: 'linear-gradient(135deg, #26A899 0%, #1e8a7d 50%, #176b61 100%)', shadow: '#26A899' },
        { bg: 'linear-gradient(135deg, #00C26D 0%, #00a35c 50%, #00844b 100%)', shadow: '#00C26D' },
        { bg: 'linear-gradient(135deg, #FFB02E 0%, #e09a28 50%, #c08420 100%)', shadow: '#FFB02E' },
        { bg: 'linear-gradient(135deg, #FF5C70 0%, #e04d5f 50%, #c03d4e 100%)', shadow: '#FF5C70' },
        { bg: 'linear-gradient(135deg, #64748B 0%, #536275 50%, #42505f 100%)', shadow: '#64748B' }
    ];

    // Ship class
    class Ship {
        constructor() {
            this.x = GAME_WIDTH / 2;
            this.y = GAME_HEIGHT / 2;
            this.vx = 0;
            this.vy = 0;
            this.angle = -Math.PI / 2;
            this.rotationSpeed = 0.18;  // Slower rotation
            this.thrust = 0.15;          // Slower acceleration
            this.friction = 0.988;       // Slightly more friction
            this.maxSpeed = 4.5;         // Slower max speed (was 7)
            this.element = document.getElementById('game-ship');
        }

        update() {
            if (gameState.keys['ArrowLeft'] || gameState.keys['ArrowRight'] || gameState.keys['ArrowUp']) {
                gameState.playerHasMoved = true;
            }

            if (gameState.keys['ArrowLeft']) this.angle -= this.rotationSpeed;
            if (gameState.keys['ArrowRight']) this.angle += this.rotationSpeed;

            if (gameState.keys['ArrowUp']) {
                this.vx += Math.cos(this.angle) * this.thrust;
                this.vy += Math.sin(this.angle) * this.thrust;
                this.element.classList.add('thrusting');
            } else {
                this.element.classList.remove('thrusting');
            }

            this.vx *= this.friction;
            this.vy *= this.friction;

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > this.maxSpeed) {
                this.vx = (this.vx / speed) * this.maxSpeed;
                this.vy = (this.vy / speed) * this.maxSpeed;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen
            if (this.x < -20) this.x = GAME_WIDTH + 20;
            if (this.x > GAME_WIDTH + 20) this.x = -20;
            if (this.y < -20) this.y = GAME_HEIGHT + 20;
            if (this.y > GAME_HEIGHT + 20) this.y = -20;

            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.transform = `translate(-50%, -50%) rotate(${this.angle + Math.PI / 2}rad)`;
        }

        shoot() {
            const now = performance.now();
            if (now - gameState.lastShot < gameState.shotCooldown) return;
            gameState.lastShot = now;
            gameState.playerHasMoved = true;

            const bullet = new Bullet(
                this.x + Math.cos(this.angle) * 15,
                this.y + Math.sin(this.angle) * 15,
                Math.cos(this.angle) * 8 + this.vx * 0.5,  // Slower bullets
                Math.sin(this.angle) * 8 + this.vy * 0.5
            );
            gameState.bullets.push(bullet);
        }

        reset() {
            this.x = GAME_WIDTH / 2;
            this.y = GAME_HEIGHT / 2;
            this.vx = 0;
            this.vy = 0;
            this.angle = -Math.PI / 2;
        }
    }

    // Bullet class
    class Bullet {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.life = 60;
            this.element = document.createElement('div');
            this.element.className = 'game-bullet';
            gameContainer.appendChild(this.element);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life--;

            // Wrap around
            if (this.x < 0) this.x = GAME_WIDTH;
            if (this.x > GAME_WIDTH) this.x = 0;
            if (this.y < 0) this.y = GAME_HEIGHT;
            if (this.y > GAME_HEIGHT) this.y = 0;

            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
        }

        destroy() {
            this.element.remove();
        }
    }

    // Asteroid class
    class GameAsteroid {
        constructor(x, y, size, vx, vy) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.vx = vx || (Math.random() - 0.5) * 2;  // Slower asteroids
            this.vy = vy || (Math.random() - 0.5) * 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
            this.colorIndex = Math.floor(Math.random() * asteroidColors.length);

            this.element = document.createElement('div');
            this.element.className = `game-asteroid ${size}`;
            const color = asteroidColors[this.colorIndex];
            this.element.style.background = color.bg;
            this.element.style.boxShadow = `0 0 10px ${color.shadow}, inset -2px -2px 4px rgba(0,0,0,0.3)`;
            gameContainer.appendChild(this.element);

            this.radius = size === 'large' ? 25 : size === 'medium' ? 15 : 8;
            this.points = size === 'large' ? 20 : size === 'medium' ? 50 : 100;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;

            // Wrap around
            if (this.x < -30) this.x = GAME_WIDTH + 30;
            if (this.x > GAME_WIDTH + 30) this.x = -30;
            if (this.y < -30) this.y = GAME_HEIGHT + 30;
            if (this.y > GAME_HEIGHT + 30) this.y = -30;

            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.transform = `translate(-50%, -50%) rotate(${this.rotation}deg)`;
        }

        destroy() {
            this.element.remove();
        }

        split() {
            const newAsteroids = [];
            if (this.size === 'large') {
                for (let i = 0; i < 2; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 1 + Math.random() * 0.5;  // Slower splits
                    newAsteroids.push(new GameAsteroid(
                        this.x, this.y, 'medium',
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    ));
                }
            } else if (this.size === 'medium') {
                for (let i = 0; i < 2; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 1.2 + Math.random() * 0.5;
                    newAsteroids.push(new GameAsteroid(
                        this.x, this.y, 'small',
                        Math.cos(angle) * speed,
                        Math.sin(angle) * speed
                    ));
                }
            }
            return newAsteroids;
        }
    }

    // Create explosion effect
    function createExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 / 8) * i;
            const speed = 30 + Math.random() * 30;
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 3px;
                height: 3px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 25;
            `;
            gameContainer.appendChild(particle);

            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            let px = x, py = y, opacity = 1;

            const animate = () => {
                px += vx * 0.03;
                py += vy * 0.03;
                opacity -= 0.03;
                particle.style.left = px + 'px';
                particle.style.top = py + 'px';
                particle.style.opacity = Math.max(0, opacity);
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            requestAnimationFrame(animate);
        }
    }

    // Check if in grace period
    function isInGracePeriod() {
        const now = performance.now();
        const timeSinceStart = now - gameState.gameStartTime;
        return timeSinceStart < gameState.gracePeriod && !gameState.playerHasMoved;
    }

    // Spawn asteroids
    function spawnAsteroids(count) {
        const exclusionRadius = isInGracePeriod() ? 180 : 100;
        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;

        for (let i = 0; i < count; i++) {
            let x, y, vx, vy;
            do {
                x = Math.random() * GAME_WIDTH;
                y = Math.random() * GAME_HEIGHT;
            } while (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) < exclusionRadius);

            if (isInGracePeriod()) {
                const angleFromCenter = Math.atan2(y - centerY, x - centerX);
                const speed = 0.8 + Math.random();  // Slower initial asteroids
                const velocityAngle = angleFromCenter + (Math.random() - 0.5) * Math.PI * 0.5;
                vx = Math.cos(velocityAngle) * speed;
                vy = Math.sin(velocityAngle) * speed;
            } else {
                vx = (Math.random() - 0.5) * 2;
                vy = (Math.random() - 0.5) * 2;
            }

            gameState.asteroids.push(new GameAsteroid(x, y, 'large', vx, vy));
        }
    }

    // Update lives display
    function updateLivesDisplay() {
        const livesEl = document.getElementById('game-lives');
        if (!livesEl) return;
        livesEl.innerHTML = '';
        for (let i = 0; i < gameState.lives; i++) {
            const life = document.createElement('div');
            life.className = 'game-life';
            livesEl.appendChild(life);
        }
    }

    // Update score
    function updateScore(points) {
        gameState.score += points;
        const scoreEl = document.getElementById('game-score-value');
        if (scoreEl) scoreEl.textContent = gameState.score;
    }

    // Check collisions
    function checkCollisions() {
        // Bullets vs asteroids
        for (let i = gameState.bullets.length - 1; i >= 0; i--) {
            const bullet = gameState.bullets[i];
            for (let j = gameState.asteroids.length - 1; j >= 0; j--) {
                const asteroid = gameState.asteroids[j];
                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < asteroid.radius) {
                    bullet.destroy();
                    gameState.bullets.splice(i, 1);

                    const color = asteroidColors[asteroid.colorIndex].shadow;
                    createExplosion(asteroid.x, asteroid.y, color);
                    updateScore(asteroid.points);

                    const newAsteroids = asteroid.split();
                    asteroid.destroy();
                    gameState.asteroids.splice(j, 1);
                    gameState.asteroids.push(...newAsteroids);
                    break;
                }
            }
        }

        // Ship vs asteroids
        if (!gameState.invulnerable && gameState.ship && !isInGracePeriod()) {
            for (const asteroid of gameState.asteroids) {
                const dx = gameState.ship.x - asteroid.x;
                const dy = gameState.ship.y - asteroid.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < asteroid.radius + 10) {
                    shipHit();
                    break;
                }
            }
        }
    }

    // Ship hit
    function shipHit() {
        gameState.lives--;
        updateLivesDisplay();
        createExplosion(gameState.ship.x, gameState.ship.y, '#00C26D');

        if (gameState.lives <= 0) {
            gameOver();
        } else {
            gameState.ship.reset();
            gameState.invulnerable = true;
            gameState.invulnerableTime = performance.now();
            gameState.ship.element.classList.add('invulnerable');
        }
    }

    // Game over
    function gameOver() {
        gameState.gameOver = true;
        gameState.ship.element.classList.remove('active');
        const msgEl = document.getElementById('game-message');
        if (msgEl) msgEl.classList.add('active');
        const hintEl = document.getElementById('game-exit-hint');
        if (hintEl) hintEl.classList.remove('visible');
        if (gameState.hintTimeout) clearTimeout(gameState.hintTimeout);
    }

    // Next level
    function nextLevel() {
        gameState.level++;
        spawnAsteroids(4 + gameState.level);
    }

    // Start game
    function startGame() {
        if (!gameArena || !gameContainer) return;

        gameArena.classList.add('active');
        if (hintArrow) hintArrow.style.display = 'none';

        // Show touch controls on touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const touchControls = document.getElementById('touch-controls');
        if (isTouchDevice && touchControls) {
            touchControls.style.display = 'block';
            const joystick = document.getElementById('touch-joystick');
            const fireIndicator = document.getElementById('touch-fire-indicator');
            if (joystick) joystick.classList.add('visible');
            if (fireIndicator) fireIndicator.classList.add('visible');
        }

        // Reset game state
        gameState.active = true;
        gameState.score = 0;
        gameState.lives = 3;
        gameState.level = 1;
        gameState.gameOver = false;
        gameState.invulnerable = true;
        gameState.invulnerableTime = performance.now();
        gameState.gameStartTime = performance.now();
        gameState.playerHasMoved = false;

        // Clean up old objects
        gameState.bullets.forEach(b => b.destroy());
        gameState.bullets = [];
        gameState.asteroids.forEach(a => a.destroy());
        gameState.asteroids = [];

        // Create/reset ship
        if (!gameState.ship) {
            gameState.ship = new Ship();
        }
        gameState.ship.reset();
        gameState.ship.element.classList.add('active', 'invulnerable');

        // Update UI
        const scoreEl = document.getElementById('game-score-value');
        if (scoreEl) scoreEl.textContent = '0';
        updateLivesDisplay();
        const msgEl = document.getElementById('game-message');
        if (msgEl) msgEl.classList.remove('active');

        // Show exit hint after delay
        const hint = document.getElementById('game-exit-hint');
        if (hint) {
            hint.classList.remove('visible');
            if (gameState.hintTimeout) clearTimeout(gameState.hintTimeout);
            gameState.hintTimeout = setTimeout(() => {
                if (gameState.active && !gameState.gameOver) {
                    hint.classList.add('visible');
                }
            }, 7000);
        }

        spawnAsteroids(5);
    }

    // End game
    function endGame() {
        if (!gameArena) return;

        gameArena.classList.remove('active');
        if (hintArrow) hintArrow.style.display = 'flex';
        const touchControls = document.getElementById('touch-controls');
        if (touchControls) touchControls.style.display = 'none';
        gameState.active = false;

        // Clean up
        gameState.bullets.forEach(b => b.destroy());
        gameState.bullets = [];
        gameState.asteroids.forEach(a => a.destroy());
        gameState.asteroids = [];

        if (gameState.ship) {
            gameState.ship.element.classList.remove('active', 'thrusting', 'invulnerable');
        }

        const msgEl = document.getElementById('game-message');
        if (msgEl) msgEl.classList.remove('active');
        const hintEl = document.getElementById('game-exit-hint');
        if (hintEl) hintEl.classList.remove('visible');
        if (gameState.hintTimeout) clearTimeout(gameState.hintTimeout);
    }

    // Game loop
    function gameLoop() {
        if (!gameState.active || gameState.gameOver) return;

        gameState.ship.update();

        if (gameState.keys[' ']) {
            gameState.ship.shoot();
        }

        // Update bullets
        for (let i = gameState.bullets.length - 1; i >= 0; i--) {
            gameState.bullets[i].update();
            if (gameState.bullets[i].life <= 0) {
                gameState.bullets[i].destroy();
                gameState.bullets.splice(i, 1);
            }
        }

        // Update asteroids
        gameState.asteroids.forEach(a => a.update());
        checkCollisions();

        // Check invulnerability
        if (gameState.invulnerable && performance.now() - gameState.invulnerableTime > 2000) {
            gameState.invulnerable = false;
            gameState.ship.element.classList.remove('invulnerable');
        }

        // Check level complete
        if (gameState.asteroids.length === 0) {
            nextLevel();
        }
    }

    // Animation loop
    function gameAnimationLoop() {
        if (gameState.active) {
            gameLoop();
        }
        requestAnimationFrame(gameAnimationLoop);
    }

    // Setup touch controls
    function setupTouchControls() {
        const touchJoystick = document.getElementById('touch-joystick');
        const touchJoystickKnob = document.getElementById('touch-joystick-knob');
        const touchFireIndicator = document.getElementById('touch-fire-indicator');
        const touchThrustIndicator = document.getElementById('touch-thrust-indicator');
        const touchZoneMove = document.getElementById('touch-zone-move');
        const touchZoneFire = document.getElementById('touch-zone-fire');

        if (!touchZoneMove || !touchZoneFire) return;

        function getJoystickCenter() {
            const rect = touchJoystick.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        function processJoystickTouch(touch) {
            const center = getJoystickCenter();
            const dx = touch.clientX - center.x;
            const dy = touch.clientY - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 35;
            const inputRadius = 120;

            const clampedDist = Math.min(distance, maxDistance);
            const angle = Math.atan2(dy, dx);
            const knobX = Math.cos(angle) * clampedDist;
            const knobY = Math.sin(angle) * clampedDist;

            if (touchJoystickKnob) {
                touchJoystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
            }

            const normalizedDist = Math.min(distance / inputRadius, 1);
            const normalizedX = (dx / inputRadius);
            const normalizedY = (dy / inputRadius);

            // Rotation
            if (normalizedX < -0.2) {
                gameState.keys['ArrowLeft'] = true;
                gameState.keys['ArrowRight'] = false;
            } else if (normalizedX > 0.2) {
                gameState.keys['ArrowRight'] = true;
                gameState.keys['ArrowLeft'] = false;
            } else {
                gameState.keys['ArrowLeft'] = false;
                gameState.keys['ArrowRight'] = false;
            }

            // Thrust
            const isThrusting = normalizedY < -0.2 || normalizedDist > 0.5;
            gameState.keys['ArrowUp'] = isThrusting;

            if (touchThrustIndicator) {
                touchThrustIndicator.classList.toggle('active', isThrusting);
            }
        }

        // Move zone handlers
        touchZoneMove.addEventListener('touchstart', (e) => {
            if (!gameState.active || gameState.gameOver) return;
            e.preventDefault();

            for (const touch of e.changedTouches) {
                if (touchState.moveTouch === null) {
                    touchState.moveTouch = touch.identifier;
                    if (touchJoystick) touchJoystick.classList.add('active');
                    processJoystickTouch(touch);
                    break;
                }
            }
        }, { passive: false });

        touchZoneMove.addEventListener('touchmove', (e) => {
            if (!gameState.active || gameState.gameOver) return;
            e.preventDefault();

            for (const touch of e.changedTouches) {
                if (touch.identifier === touchState.moveTouch) {
                    processJoystickTouch(touch);
                }
            }
        }, { passive: false });

        function handleMoveEnd(e) {
            for (const touch of e.changedTouches) {
                if (touch.identifier === touchState.moveTouch) {
                    touchState.moveTouch = null;
                    if (touchJoystick) touchJoystick.classList.remove('active');
                    if (touchJoystickKnob) touchJoystickKnob.style.transform = 'translate(-50%, -50%)';

                    gameState.keys['ArrowLeft'] = false;
                    gameState.keys['ArrowRight'] = false;
                    gameState.keys['ArrowUp'] = false;

                    if (touchThrustIndicator) {
                        touchThrustIndicator.classList.remove('active');
                    }
                }
            }
        }

        touchZoneMove.addEventListener('touchend', handleMoveEnd);
        touchZoneMove.addEventListener('touchcancel', handleMoveEnd);

        // Fire zone handlers
        touchZoneFire.addEventListener('touchstart', (e) => {
            if (!gameState.active || gameState.gameOver) return;
            e.preventDefault();

            for (const touch of e.changedTouches) {
                if (touchState.fireTouch === null) {
                    touchState.fireTouch = touch.identifier;
                    if (touchFireIndicator) touchFireIndicator.classList.add('active');

                    if (gameState.ship) {
                        gameState.ship.shoot();
                    }

                    // Auto-fire
                    touchState.autoFireInterval = setInterval(() => {
                        if (gameState.ship && gameState.active && !gameState.gameOver) {
                            gameState.ship.shoot();
                        }
                    }, 150);
                    break;
                }
            }
        }, { passive: false });

        touchZoneFire.addEventListener('touchmove', (e) => {
            if (!gameState.active || gameState.gameOver) return;
            e.preventDefault();
            for (const touch of e.changedTouches) {
                if (touch.identifier === touchState.fireTouch && gameState.ship) {
                    gameState.ship.shoot();
                }
            }
        }, { passive: false });

        function handleFireEnd(e) {
            for (const touch of e.changedTouches) {
                if (touch.identifier === touchState.fireTouch) {
                    touchState.fireTouch = null;
                    if (touchFireIndicator) touchFireIndicator.classList.remove('active');

                    if (touchState.autoFireInterval) {
                        clearInterval(touchState.autoFireInterval);
                        touchState.autoFireInterval = null;
                    }
                }
            }
        }

        touchZoneFire.addEventListener('touchend', handleFireEnd);
        touchZoneFire.addEventListener('touchcancel', handleFireEnd);
    }

    // Initialize the game
    window.initAsteroidsGame = function(triggerSelector, arenaSelector, containerSelector, hintSelector) {
        const trigger = document.querySelector(triggerSelector);
        gameArena = document.querySelector(arenaSelector);
        gameContainer = document.querySelector(containerSelector);
        hintArrow = hintSelector ? document.querySelector(hintSelector) : null;

        if (!trigger || !gameArena || !gameContainer) {
            console.warn('Asteroids: Could not find required elements');
            return;
        }

        // Set dimensions
        GAME_WIDTH = gameContainer.offsetWidth || 500;
        GAME_HEIGHT = gameContainer.offsetHeight || 500;

        // Double-click to start
        let lastClick = 0;
        function handleActivation(e) {
            const now = performance.now();
            if (now - lastClick < 500) {
                e.stopPropagation();
                e.preventDefault();
                startGame();
                lastClick = 0;
            } else {
                lastClick = now;
            }
        }

        trigger.addEventListener('click', handleActivation);
        trigger.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleActivation(e);
        }, { passive: false });

        // Double-click game arena to restart
        gameArena.addEventListener('dblclick', (e) => {
            if (gameState.gameOver) {
                startGame();
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                if (gameState.active) {
                    e.preventDefault();
                }
                gameState.keys[e.key] = true;
            }
            if (e.key === 'Escape' && gameState.active) {
                endGame();
            }
        });

        document.addEventListener('keyup', (e) => {
            gameState.keys[e.key] = false;
        });

        // Prevent default touch on game container
        gameContainer.addEventListener('touchstart', (e) => {
            if (gameState.active) {
                e.preventDefault();
            }
        }, { passive: false });

        // Setup touch controls
        setupTouchControls();

        // Start animation loop
        gameAnimationLoop();
    };
})();
