/* ==========================================================================
   AESTHETIC INTERACTIONS & ENGINE
   Project: Nur Azyyati Amalin Binti Ahmad Termizi • 22.09.2026 Birthday Wish Web App
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. STATE & GLOBAL CONFIG
    // ==========================================================================
    const CORRECT_PIN = '392610';
    let inputPin = '';
    let currentImageIndex = 0;
    let isEnvelopeOpen = false;
    let isCandleLit = true;
    let typingActive = false;
    let isMuted = false;

    // Image assets definition (9 files from Public/Image)
    const galleryImages = [
        { url: "./Public/Image/WhatsApp Image 2026-07-20 at 09.40.02.jpeg", caption: "a quiet warmth." },
        { url: "./Public/Image/WhatsApp Image 2026-07-20 at 09.40.03.jpeg", caption: "laughter in the air." },
        { url: "./Public/Image/WhatsApp Image 2026-07-21 at 09.40.02.jpeg", caption: "cherished memories." },
        { url: "./Public/Image/WhatsApp Image 2026-07-22 at 09.40.02.jpeg", caption: "soft light." },
        { url: "./Public/Image/WhatsApp Image 2026-07-23 at 09.40.02.jpeg", caption: "timeless moments." },
        { url: "./Public/Image/WhatsApp Image 2026-07-24 at 09.40.01.jpeg", caption: "simply beautiful." },
        { url: "./Public/Image/WhatsApp Image 2026-07-25 at 09.40.01.jpeg", caption: "pure joy." },
        { url: "./Public/Image/WhatsApp Image 2026-07-26 at 09.40.01.jpeg", caption: "golden days." },
        { url: "./Public/Image/WhatsApp Image 2026-07-29 at 09.40.00.jpeg", caption: "always smiling." }
    ];

    // ==========================================================================
    // 2. PASSCODE LOCK VERIFICATION
    // ==========================================================================
    const lockscreen = document.getElementById('lockscreen');
    const passcodeDots = document.querySelector('.passcode-dots');
    const dots = document.querySelectorAll('.passcode-dots .dot');
    const keypadButtons = document.querySelectorAll('.key-btn[data-key]');
    const btnClear = document.getElementById('btn-clear');
    const btnDelete = document.getElementById('btn-delete');
    const mainContent = document.getElementById('main-content');

    // Update Dots visualization
    function updatePasscodeDots() {
        dots.forEach((dot, index) => {
            if (index < inputPin.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        });
    }

    // Shake animation on error
    function triggerPasscodeError() {
        passcodeDots.classList.add('error');
        lockscreen.querySelector('.lockscreen-card').classList.add('shake');
        
        setTimeout(() => {
            inputPin = '';
            updatePasscodeDots();
            passcodeDots.classList.remove('error');
            lockscreen.querySelector('.lockscreen-card').classList.remove('shake');
        }, 600);
    }

    // Unlock page
    function unlockApp() {
        lockscreen.classList.add('unlocked');
        document.body.classList.remove('locked');
        mainContent.classList.remove('hidden');
        
        setTimeout(() => {
            mainContent.classList.add('visible');
            // Trigger music
            ambientSynth.start();
            document.querySelector('.navbar').classList.add('playing');
            document.querySelector('.music-player-container').classList.add('playing');
            playPauseBtn.querySelector('#icon-play').classList.add('hidden');
            playPauseBtn.querySelector('#icon-pause').classList.remove('hidden');
            
            // Render polaroid gallery
            initGallery();
            
            // Start countdown
            startCountdownTimer();
        }, 300);
    }

    // Number Typing Handler
    function handleType(num) {
        if (inputPin.length < 6) {
            inputPin += num;
            updatePasscodeDots();
            
            if (inputPin.length === 6) {
                if (inputPin === CORRECT_PIN) {
                    unlockApp();
                } else {
                    triggerPasscodeError();
                }
            }
        }
    }

    // Keypad Click Handlers
    keypadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleType(btn.getAttribute('data-key'));
        });
    });

    btnClear.addEventListener('click', () => {
        inputPin = '';
        updatePasscodeDots();
    });

    btnDelete.addEventListener('click', () => {
        if (inputPin.length > 0) {
            inputPin = inputPin.slice(0, -1);
            updatePasscodeDots();
        }
    });

    // Keyboard support for unlocking
    document.addEventListener('keydown', (e) => {
        if (!lockscreen.classList.contains('unlocked')) {
            if (e.key >= '0' && e.key <= '9') {
                handleType(e.key);
            } else if (e.key === 'Backspace') {
                if (inputPin.length > 0) {
                    inputPin = inputPin.slice(0, -1);
                    updatePasscodeDots();
                }
            } else if (e.key === 'Escape') {
                inputPin = '';
                updatePasscodeDots();
            }
        }
    });


    // ==========================================================================
    // 3. BACKGROUND MUSIC (HTML5 AUDIO PLAYER ENGINE)
    // ==========================================================================
    class AudioPlayerEngine {
        constructor() {
            this.audio = new Audio("./Public/Music/Gellen Martadinata - Selamat Ulang Tahun ( Unofficial Music Video & Lyric ).mp3");
            this.audio.loop = true;
            this.audio.volume = 0.5;
            this.isPlaying = false;
            
            // Bind progress updates
            this.audio.addEventListener('timeupdate', () => {
                this.updateProgress();
            });
            
            this.audio.addEventListener('loadedmetadata', () => {
                const totalMin = Math.floor(this.audio.duration / 60);
                const totalSec = Math.floor(this.audio.duration % 60);
                const totalTimeEl = document.getElementById('total-time');
                if (totalTimeEl) {
                    totalTimeEl.textContent = `${totalMin}:${totalSec < 10 ? '0' : ''}${totalSec}`;
                }
            });
        }

        start() {
            this.isPlaying = true;
            this.audio.play().catch(err => {
                console.log("Audio playback blocked/waiting user interaction:", err);
            });
        }

        stop() {
            this.isPlaying = false;
            this.audio.pause();
        }

        seek(percentage) {
            if (this.audio.duration) {
                this.audio.currentTime = percentage * this.audio.duration;
            }
        }

        updateProgress() {
            const currentMin = Math.floor(this.audio.currentTime / 60);
            const currentSec = Math.floor(this.audio.currentTime % 60);
            const currentTimeEl = document.getElementById('current-time');
            const progressFill = document.getElementById('progress-bar-fill');
            
            if (currentTimeEl) {
                currentTimeEl.textContent = `${currentMin}:${currentSec < 10 ? '0' : ''}${currentSec}`;
            }
            
            if (this.audio.duration && progressFill) {
                const percent = (this.audio.currentTime / this.audio.duration) * 100;
                progressFill.style.width = `${percent}%`;
            }
        }
    }

    const ambientSynth = new AudioPlayerEngine();

    // Sound button toggle in Header
    const musicToggleBtn = document.getElementById('music-toggle');
    musicToggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            ambientSynth.stop();
            document.querySelector('.navbar').classList.remove('playing');
            document.querySelector('.music-player-container').classList.remove('playing');
            musicToggleBtn.querySelector('.music-label').textContent = "Play Music";
            playPauseBtn.querySelector('#icon-play').classList.remove('hidden');
            playPauseBtn.querySelector('#icon-pause').classList.add('hidden');
        } else {
            ambientSynth.start();
            document.querySelector('.navbar').classList.add('playing');
            document.querySelector('.music-player-container').classList.add('playing');
            musicToggleBtn.querySelector('.music-label').textContent = "Mute Music";
            playPauseBtn.querySelector('#icon-play').classList.add('hidden');
            playPauseBtn.querySelector('#icon-pause').classList.remove('hidden');
        }
    });

    // Custom Player Play/Pause Btn
    const playPauseBtn = document.getElementById('btn-play-pause');
    playPauseBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            ambientSynth.stop();
            document.querySelector('.navbar').classList.remove('playing');
            document.querySelector('.music-player-container').classList.remove('playing');
            musicToggleBtn.querySelector('.music-label').textContent = "Play Music";
            playPauseBtn.querySelector('#icon-play').classList.remove('hidden');
            playPauseBtn.querySelector('#icon-pause').classList.add('hidden');
        } else {
            ambientSynth.start();
            document.querySelector('.navbar').classList.add('playing');
            document.querySelector('.music-player-container').classList.add('playing');
            musicToggleBtn.querySelector('.music-label').textContent = "Mute Music";
            playPauseBtn.querySelector('#icon-play').classList.add('hidden');
            playPauseBtn.querySelector('#icon-pause').classList.remove('hidden');
        }
    });

    // Custom Player Prev/Next skips (seek 10s backward/forward)
    document.getElementById('btn-prev').addEventListener('click', () => {
        ambientSynth.audio.currentTime = Math.max(0, ambientSynth.audio.currentTime - 10);
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        if (ambientSynth.audio.duration) {
            ambientSynth.audio.currentTime = Math.min(ambientSynth.audio.duration, ambientSynth.audio.currentTime + 10);
        }
    });

    // Custom player progress bar scrub
    const progressBarContainer = document.getElementById('progress-bar-container');
    progressBarContainer.addEventListener('click', (e) => {
        const rect = progressBarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        ambientSynth.seek(percentage);
    });


    // ==========================================================================
    // 4. COUNTDOWN TIMER (TARGET: 22.09.2026)
    // ==========================================================================
    let countdownInterval = null;

    function startCountdownTimer() {
        const targetDate = new Date("2026-09-22T00:00:00+08:00").getTime();
        
        function updateTimer() {
            const now = new Date().getTime();
            const difference = targetDate - now;
            
            if (difference <= 0) {
                // Celebration mode!
                clearInterval(countdownInterval);
                document.getElementById('countdown-heading').textContent = "HAPPY BIRTHDAY, AMALIN!";
                document.getElementById('countdown').innerHTML = `
                    <div style="font-family: var(--font-serif); font-size: 2.2rem; font-style: italic; text-align: center; width:100%; letter-spacing: 1px;">
                        It is her special day today. ✨
                    </div>
                `;
                // Start persistent gentle party sparkles
                setInterval(() => {
                    createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 8);
                }, 3000);
                return;
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days < 10 ? '0' + days : days;
            document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
        }
        
        updateTimer();
        countdownInterval = setInterval(updateTimer, 1000);
    }


    // ==========================================================================
    // 5. INTERACTIVE POLAROID GALLERY
    // ==========================================================================
    const polaroidGallery = document.getElementById('polaroid-gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    function initGallery() {
        polaroidGallery.innerHTML = '';
        
        galleryImages.forEach((imgData, index) => {
            const polaroid = document.createElement('div');
            polaroid.classList.add('polaroid');
            
            // Random tilt angle for aesthetic scattered effect (-6 to +6 degrees)
            const angle = (Math.random() * 12 - 6).toFixed(1);
            polaroid.style.transform = `rotate(${angle}deg)`;
            
            polaroid.innerHTML = `
                <div class="polaroid-img-wrapper">
                    <img src="${imgData.url}" alt="${imgData.caption}" loading="lazy">
                </div>
                <div class="polaroid-caption">${imgData.caption}</div>
                <div class="polaroid-number">${(index + 1).toString().padStart(2, '0')}</div>
            `;
            
            // Click opens lightbox
            polaroid.addEventListener('click', () => {
                openLightbox(index);
            });
            
            polaroidGallery.appendChild(polaroid);
        });
    }

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = galleryImages[index].url;
        lightboxCaption.textContent = galleryImages[index].caption;
        lightbox.classList.add('visible');
    }

    // Lightbox Nav
    document.getElementById('lightbox-close').addEventListener('click', () => {
        lightbox.classList.remove('visible');
    });

    document.getElementById('lightbox-prev').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentImageIndex);
    });

    document.getElementById('lightbox-next').addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox(currentImageIndex);
    });

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            lightbox.classList.remove('visible');
        }
    });


    // ==========================================================================
    // 6. ENVELOPE & HEARTFELT TYPEWRITER LETTER
    // ==========================================================================
    const envelope = document.getElementById('envelope');
    const typewriterElement = document.getElementById('typewriter-text');
    const letterRawText = typewriterElement.innerHTML; // Get formatted HTML
    typewriterElement.innerHTML = ''; // Empty for typing

    envelope.addEventListener('click', () => {
        if (!isEnvelopeOpen) {
            envelope.classList.add('open');
            isEnvelopeOpen = true;
            
            // Start typewriter after flip animation completes
            setTimeout(() => {
                startTypewriter();
            }, 600);
        } else {
            envelope.classList.remove('open');
            isEnvelopeOpen = false;
        }
    });

    // Safe typewriter handling tags (like <br>)
    function startTypewriter() {
        if (typingActive) return;
        typingActive = true;
        
        typewriterElement.classList.add('typing');
        
        let i = 0;
        const length = letterRawText.length;
        
        function type() {
            if (i < length) {
                // If tag, output full tag at once
                if (letterRawText.substr(i, 4) === '<br>') {
                    typewriterElement.innerHTML += '<br>';
                    i += 4;
                } else {
                    typewriterElement.innerHTML += letterRawText.charAt(i);
                    i++;
                }
                
                // Type speed (25ms per char, slightly random for realism)
                setTimeout(type, 20 + Math.random() * 20);
            } else {
                typewriterElement.classList.remove('typing');
            }
        }
        
        type();
    }


    // ==========================================================================
    // 7. VIRTUAL CANDLE BLOW ENGINE & SPARKLE CANVAS PARTICLES
    // ==========================================================================
    const btnBlow = document.getElementById('btn-blow');
    const candle = document.getElementById('candle');
    const wishStatus = document.getElementById('wish-status');
    const blowText = document.getElementById('blow-text');

    btnBlow.addEventListener('click', blowOutCandle);

    function blowOutCandle() {
        if (!isCandleLit) return;
        isCandleLit = false;
        
        // Extinguish candle classes
        candle.classList.add('extinguished');
        btnBlow.classList.add('disabled');
        blowText.textContent = "Wish Sent 🤍";
        
        wishStatus.textContent = "Cast into the cosmos. May all your dreams come true, Amalin.";
        wishStatus.classList.add('highlighted');
        
        // Find candle flame center relative to window
        const flameElement = document.getElementById('candle-flame');
        const rect = flameElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Play audio puff / chime sound
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        } catch(e) {}
        
        // Trigger explosion of grey/silver/white particles
        createSparkleBurst(x, y, 150);
    }

    // Canvas Sparks System
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let backgroundParticles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Classes
    class SparkConfetti {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 8;
            
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - (1 + Math.random() * 3); // initial pop upwards
            
            this.radius = 1.5 + Math.random() * 3.5;
            
            // Grey aesthetic shade selector
            const shades = ['#ffffff', '#f2f2f7', '#e5e5ea', '#d1d1d6', '#aeaeb2', '#8e8e93', '#48484a'];
            this.color = shades[Math.floor(Math.random() * shades.length)];
            
            this.opacity = 1;
            this.decay = 0.008 + Math.random() * 0.015;
            this.gravity = 0.18;
            this.drag = 0.985;
        }

        update() {
            this.vx *= this.drag;
            this.vy *= this.drag;
            this.vy += this.gravity;
            
            this.x += this.vx;
            this.y += this.vy;
            
            this.opacity -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#ffffff';
            ctx.fill();
            ctx.restore();
        }
    }

    // Gentle slow drifting background dust
    class BackgroundDrift {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.vy = -(0.2 + Math.random() * 0.6);
            this.vx = (Math.random() * 0.4 - 0.2);
            this.radius = 0.5 + Math.random() * 1.5;
            this.opacity = 0.1 + Math.random() * 0.4;
            this.color = Math.random() > 0.5 ? '#ffffff' : '#8e8e93';
        }

        update() {
            this.y += this.vy;
            this.x += this.vx;
            
            if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize background floating dust particles
    for (let k = 0; k < 60; k++) {
        backgroundParticles.push(new BackgroundDrift());
    }

    function createSparkleBurst(x, y, count) {
        for (let i = 0; i < count; i++) {
            particles.push(new SparkConfetti(x, y));
        }
    }

    // Particle rendering loop
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Draw slow background dust
        backgroundParticles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // 2. Draw confetti sparks
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            
            if (p.opacity <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(loop);
    }
    
    // Start animation frame loop
    loop();

});
