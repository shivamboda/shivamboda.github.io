const AntiGravityHero = () => {
    const canvasRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const particles = useRef([]);
    const explosionParticles = useRef([]);
    const rafId = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const setCanvasSize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Initialize particles with orbital motion
        const particleCount = 300;
        particles.current = Array.from({ length: particleCount }, () => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.4;
            const centerX = canvas.offsetWidth / 2;
            const centerY = canvas.offsetHeight / 2;

            return {
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                angle: angle,
                distance: distance,
                speed: 0.0005 + Math.random() * 0.001,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                pulseOffset: Math.random() * Math.PI * 2
            };
        });

        // Mouse/touch event handlers
        const handlePointerMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            mousePos.current = {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        // Click/touch to create explosion
        const createExplosion = (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            // Create explosion particles
            for (let i = 0; i < 30; i++) {
                const angle = (Math.PI * 2 * i) / 30;
                const speed = 2 + Math.random() * 3;
                explosionParticles.current.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    radius: Math.random() * 3 + 1,
                    color: `hsl(${Math.random() * 60 + 260}, 100%, ${Math.random() * 30 + 60}%)`
                });
            }
        };

        canvas.addEventListener('mousemove', handlePointerMove);
        canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
        canvas.addEventListener('click', createExplosion);
        canvas.addEventListener('touchstart', createExplosion, { passive: false });

        let time = 0;

        // Animation loop - continuous infinite rotation
        const animate = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            const centerX = canvas.offsetWidth / 2;
            const centerY = canvas.offsetHeight / 2;
            time += 0.01;

            // Update and draw explosion particles
            explosionParticles.current = explosionParticles.current.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.98;
                p.vy *= 0.98;
                p.life -= 0.02;

                if (p.life > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color.replace(')', `, ${p.life})`).replace('hsl', 'hsla');
                    ctx.fill();
                    return true;
                }
                return false;
            });

            particles.current.forEach((p) => {
                // Continuous orbital rotation
                p.angle += p.speed;

                // Add a gentle pulsing effect to the distance
                const pulse = Math.sin(time + p.pulseOffset) * 10;
                const currentDistance = p.distance + pulse;

                // Calculate position based on angle and distance
                const baseX = centerX + Math.cos(p.angle) * currentDistance;
                const baseY = centerY + Math.sin(p.angle) * currentDistance;

                // Smooth transition to new position
                p.x = baseX;
                p.y = baseY;

                // Distance to mouse for color shift
                const mdx = p.x - mousePos.current.x;
                const mdy = p.y - mousePos.current.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                // Repel from mouse with smooth interpolation
                if (mdist < 150 && mdist > 0) {
                    const force = (150 - mdist) / 150;
                    const repelAmount = force * 30;
                    p.x += (mdx / mdist) * repelAmount;
                    p.y += (mdy / mdist) * repelAmount;
                }

                // Dynamic color based on proximity to mouse
                let color = { r: 124, g: 92, b: 255 };
                if (mdist < 200) {
                    const proximity = 1 - (mdist / 200);
                    color.r = 124 + (34 - 124) * proximity; // Shift to cyan
                    color.g = 92 + (193 - 92) * proximity;
                    color.b = 255 + (195 - 255) * proximity;
                }

                // Pulsing opacity
                const opacityPulse = Math.sin(time * 2 + p.pulseOffset) * 0.2;
                const currentOpacity = Math.max(0.2, Math.min(0.8, p.opacity + opacityPulse));

                // Draw particle with dynamic color
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity})`;
                ctx.fill();

                // Draw connections
                particles.current.forEach((p2) => {
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < 80) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${(1 - dist2 / 80) * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            rafId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            canvas.removeEventListener('mousemove', handlePointerMove);
            canvas.removeEventListener('touchmove', handlePointerMove);
            canvas.removeEventListener('click', createExplosion);
            canvas.removeEventListener('touchstart', createExplosion);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            style={{ display: 'block', touchAction: 'none' }}
        />
    );
};
