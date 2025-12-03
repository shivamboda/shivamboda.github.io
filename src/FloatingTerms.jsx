import React, { useEffect, useRef } from 'react';

const FloatingTerms = () => {
    const canvasRef = useRef(null);
    const termsRef = useRef([]);
    const rafId = useRef(null);

    const termsList = [
        'Machine Learning',
        'Deep Learning',
        'Neural Networks',
        'Generative AI',
        'Prompt Engineering',
        'RAG',
        'Transformers',
        'NLP',
        'Computer Vision',
        'MLOps',
        'LLMs',
        'Fine-tuning',
        'Embeddings',
        'Reinforcement Learning',
        'CNN',
        'RNN',
        'BERT',
        'GPT',
        'Diffusion Models',
        'Transfer Learning',
        'Data Augmentation',
        'Feature Engineering',
        'Model Training',
        'Inference',
        'Big Data',
        'Spark',
        'Hive',
        'HDFS',
        'ETL',
        'Data Pipelines',
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const isMobile = window.innerWidth < 768;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Use fewer terms on mobile for less chaos
        const displayTerms = isMobile ? termsList.slice(0, 15) : termsList;

        // Initialize terms with random positions and velocities
        termsRef.current = displayTerms.map((term) => ({
            text: term,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: isMobile ? Math.random() * 4 + 10 : Math.random() * 8 + 12,
            opacity: isMobile ? Math.random() * 0.15 + 0.1 : Math.random() * 0.2 + 0.2,
        }));

        // Helper to get current accent color
        const getAccentColor = (opacity = 1) => {
            const style = getComputedStyle(document.documentElement);
            const color = style.getPropertyValue('--accent-primary').trim();
            // Convert hex to rgb if needed, or just return if it's already usable
            // Assuming hex for now, but canvas needs explicit handling if we want opacity
            // Simple hack: use the hex and let canvas handle it, or parse it.
            // Since our vars are hex, we need to convert to rgba for opacity support.

            let r = 92, g = 68, b = 56; // Default fallback
            if (color.startsWith('#')) {
                const hex = color.substring(1);
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw terms
            termsRef.current.forEach((term) => {
                // Update position
                term.x += term.vx;
                term.y += term.vy;

                // Bounce off edges
                if (term.x < 0 || term.x > canvas.width) term.vx *= -1;
                if (term.y < 0 || term.y > canvas.height) term.vy *= -1;

                // Keep within bounds
                term.x = Math.max(0, Math.min(canvas.width, term.x));
                term.y = Math.max(0, Math.min(canvas.height, term.y));

                // Draw term
                ctx.font = `bold ${term.size}px Lato, sans-serif`;
                ctx.fillStyle = getAccentColor(term.opacity);
                ctx.fillText(term.text, term.x, term.y);
            });

            // Draw connections
            termsRef.current.forEach((term1, i) => {
                termsRef.current.slice(i + 1).forEach((term2) => {
                    const dx = term1.x - term2.x;
                    const dy = term1.y - term2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 200) {
                        const opacity = (1 - distance / 200) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(term1.x, term1.y);
                        ctx.lineTo(term2.x, term2.y);
                        ctx.strokeStyle = getAccentColor(opacity);
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            rafId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default FloatingTerms;
