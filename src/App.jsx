import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, Download, Menu, X, ExternalLink, ChevronRight, ChevronLeft, Copy, Check, Activity, Music, Scan, Bot, Search, GraduationCap } from 'lucide-react';
import Lenis from 'lenis';
import logo from './assets/logo.svg';
import oceanSplitImg from './assets/oceansplit.png';
import chirpSenseImg from './assets/chirpsense.png';
import faceMeshImg from './assets/3drendering.png';
import travelBuddyImg from './assets/travelbuddy.png';
import crackDetectImg from './assets/crack.png';
import courseBotImg from './assets/coursehelp.png';
import FloatingTerms from './FloatingTerms';
import DustText from './DustText';
import DustElement from './DustElement';

// ============================================================================
// UTILITY HOOKS & HELPERS
// ============================================================================

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return reducedMotion;
};

// Custom Animated Cursor Component
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Smooth follow animation
    const animate = () => {
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;

      cursorPos.current.x += dx * 0.2;
      cursorPos.current.y += dy * 0.2;

      if (cursorRef.current && cursorDotRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 10}px, ${cursorPos.current.y - 10}px)`;
        cursorDotRef.current.style.transform = `translate(${mousePos.current.x - 3}px, ${mousePos.current.y - 3}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? 'hover' : ''}`} />
      <div ref={cursorDotRef} className="custom-cursor-dot" />
    </>
  );
};

// Animated Counter Hook
const useAnimatedCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && count === start) {
            let startTime = null;
            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);

              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setCount(Math.floor(start + (end - start) * easeOutQuart));

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, start, count]);

  return [count, countRef];
};

// WEBGL HERO COMPONENT (Anti-Gravity Particles)
// ============================================================================

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
        speed: 0.002 + Math.random() * 0.003,
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



// ============================================================================
// HEADER COMPONENT
// ============================================================================

const Header = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  const navItems = ['About', 'Projects', 'Experience', 'Skills', 'Research', 'Contact'];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-2xl' : 'bg-transparent'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="text-2xl font-bold bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] bg-clip-text text-transparent flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <img src={logo} alt="Logo" className="w-8 h-8" />
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`px-4 py-2 rounded-full transition-colors relative ${activeSection === item.toLowerCase()
                ? 'text-white'
                : 'text-[#94A3B8] hover:text-white'
                }`}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {activeSection === item.toLowerCase() && (
                <motion.div
                  className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
                  layoutId="activeSection"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-[#0F172A]/90 backdrop-blur-2xl border-b border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-[#94A3B8] hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// ============================================================================
// HERO SECTION
// ============================================================================

const SocialLink = ({ icon: Icon, href, action, label }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    if (action) {
      action();
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else if (href) {
      window.open(href, '_blank');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`p-3 bg-white/5 border border-white/10 rounded-full transition-all duration-300 ${isCopied
        ? 'text-green-400 border-green-400/50 bg-green-400/10'
        : 'text-[#94A3B8] hover:text-white hover:bg-white/10'
        }`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Check size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="icon"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Icon size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const Hero = ({ reducedMotion }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20; // Tilt range
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0F172A] pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* Background Texture & Gradient */}
      <div className="absolute inset-0 z-0">
        <FloatingTerms />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C5CFF]/20 rounded-full blur-[120px] animate-gradient-shift"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#22C1C3]/20 rounded-full blur-[120px] animate-gradient-shift" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 flex flex-col gap-12 items-center relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col justify-center items-center text-center z-20"
        >


          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <DustText text="Hi — I'm" /> <br />
            <DustElement className="relative inline-block">
              <span className="bg-gradient-to-r from-[#7C5CFF] via-[#22C1C3] to-[#7C5CFF] bg-clip-text text-transparent whitespace-nowrap animate-gradient-shift bg-[length:200%_auto] drop-shadow-lg">
                Shivam Boda
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
              />
            </DustElement>
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-[#94A3B8] mb-2 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-white font-semibold"><DustText text="Machine Learning" /></span> <DustText text="&" /> <span className="text-white font-semibold"><DustText text="Big Data Engineer" /></span>
          </motion.div>

          <motion.div
            className="text-lg text-[#7C5CFF] mb-8 font-medium italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <DustText text='"Turning data into intelligent systems."' />
          </motion.div>

          <motion.p
            className="text-lg text-[#94A3B8]/80 mb-10 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <DustText text="Building scalable machine learning systems and enterprise-grade data pipelines. Specializing in applied AI, big-data engineering, and high-performance model development." />
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <DustElement>
              <motion.a
                href="#projects"
                className="group relative px-8 py-4 bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] text-white rounded-full font-bold text-lg inline-flex items-center gap-3 shadow-[0_0_20px_rgba(124,92,255,0.4)] animate-slow-pulse overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124, 92, 255, 0.6)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">See Projects</span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ChevronRight size={20} />
                </motion.span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              </motion.a>
            </DustElement>
            <DustElement>
              <div className="flex items-center gap-4">
                <SocialLink icon={Github} href="https://github.com/shivamboda" label="GitHub" />
                <SocialLink icon={Linkedin} href="https://www.linkedin.in/shivamboda/" label="LinkedIn" />
                <SocialLink
                  icon={Mail}
                  action={() => navigator.clipboard.writeText('shivamboda@gmail.com')}
                  label="Email"
                />
              </div>
            </DustElement>
          </motion.div>
        </motion.div>
      </div>

      {/* Soft Glow Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F172A] to-transparent z-20 pointer-events-none" />
    </section>
  );
};

// ============================================================================
// ABOUT SECTION
// ============================================================================

const About = () => {
  return (
    <section id="about" className="pt-0 pb-12 bg-[#0F172A] relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">About Me</h2>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">
              I'm Shivam Boda, an <span className="font-bold bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] bg-clip-text text-transparent">AI and ML engineer</span> who genuinely enjoys figuring out how things work. Whether it’s a complex machine learning problem, an oddly satisfying data pipeline, or a good puzzle, I’m driven by curiosity and the thrill of solving challenges that connect ideas to real-world impact.
            </p>

            <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">
              My work spans machine learning, deep learning, computer vision, and big-data engineering. I’ve designed high-accuracy models, built distributed data solutions with Spark, Hive, and HDFS, and taken projects from rough concepts all the way to production-ready systems. I care a lot about <span className="font-bold bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] bg-clip-text text-transparent">clean engineering</span>, <span className="font-bold bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] bg-clip-text text-transparent">scalability</span>, and building things that feel seamless and intelligent rather than just “smart on paper.”
            </p>

            <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">
              Outside of engineering, I’m endlessly fascinated by how the world works, especially physics, biology, and chemistry. That curiosity naturally feeds into my work, where I enjoy experimenting, learning, and pushing what’s possible with applied AI and large-scale systems.
            </p>

            <p className="text-lg text-[#94A3B8] leading-relaxed mb-8">
              At my core, I love building things that are <span className="font-bold bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] bg-clip-text text-transparent">thoughtful, precise, and genuinely useful</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// PROJECTS SECTION
// ============================================================================

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{
        y: -12,
        rotateY: 2,
        rotateX: 2,
        scale: 1.03
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glow Effect on Hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(124, 92, 255, 0.4), rgba(34, 193, 195, 0.4))',
          zIndex: -1
        }}
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      />

      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 overflow-hidden shadow-2xl hover:shadow-[0_20px_60px_rgba(124,92,255,0.3)] transition-all duration-500">

        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
          background: 'linear-gradient(135deg, #7C5CFF, #22C1C3, #7C5CFF)',
          backgroundSize: '200% 200%',
          animation: 'gradient 3s ease infinite',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }} />

        {/* Shine Effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          }}
          animate={isHovered ? { x: ['-100%', '200%'] } : { x: '-100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Icon + Tags Row */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-5xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            {project.icon}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {project.tags.map((tag, idx) => (
              <motion.span
                key={tag}
                className="px-3 py-1.5 bg-gradient-to-r from-[#7C5CFF]/30 to-[#22C1C3]/30 border border-[#7C5CFF]/40 text-[#7C5CFF] rounded-full text-xs font-semibold backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 + idx * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:bg-gradient-to-r group-hover:from-[#7C5CFF] group-hover:to-[#22C1C3] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-[#94A3B8] mb-6 leading-relaxed text-[15px] min-h-[80px]">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2.5 mb-6 min-h-[60px]">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-[#22C1C3]/10 text-[#22C1C3] rounded-lg text-sm font-medium border border-[#22C1C3]/20 hover:bg-[#22C1C3]/20 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* GitHub Link */}
        <motion.a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-[0_10px_30px_rgba(124,92,255,0.4)] transition-all group/btn relative overflow-hidden"
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">View on GitHub</span>
          <ExternalLink size={16} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </motion.a>

        {/* Floating Particles Effect */}
        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#7C5CFF] rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: '100%',
                  opacity: 0
                }}
                animate={{
                  y: '-100%',
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const projects = [
    {
      icon: Activity,
      image: oceanSplitImg,
      title: 'OceanSplit',
      subtitle: 'Bioacoustic Source Separation',
      description: 'Lightweight pipeline separating marine life from noise using Mel spectrograms, NMF, and compact MLP. Achieves 94.87% accuracy.',
      tags: ['ML', 'Audio', 'Signal Processing'],
      stack: ['Python', 'NMF', 'Mel Spectrograms', 'MLP'],
      link: 'https://github.com/shivamboda/Bioacoustic-Separation-using-BSS'
    },
    {
      icon: Music,
      image: chirpSenseImg,
      title: 'ChirpSense',
      subtitle: 'Bird Audio Classification',
      description: 'Endangered bird audio classification system achieving 92% accuracy. Leverages Python, librosa, TensorFlow, data augmentation, and custom CNN architecture.',
      tags: ['ML', 'Audio', 'CNN'],
      stack: ['Python', 'TensorFlow', 'librosa', 'Data Augmentation'],
      link: 'https://github.com/shivamboda/ChirpSense'
    },
    {
      icon: Scan,
      image: faceMeshImg,
      title: '2D to 3D',
      subtitle: 'Face Reconstruction',
      description: 'Accurate 3D reconstruction for tracking; demonstrates geometry-aware networks and optimization-based refinement. Enables precise facial tracking from single 2D images.',
      tags: ['CV', 'ML', '3D'],
      stack: ['Python', 'Computer Vision', 'Geometry Networks'],
      link: 'https://github.com/shivamboda/Face_Reconstruction'
    },
    {
      icon: Bot,
      image: travelBuddyImg,
      title: 'TravelBuddy',
      subtitle: 'AI Itinerary Chatbot',
      description: 'AI-powered chatbot that generates comprehensive, personalized trip itineraries. Simply input your destination and preferences, and receive a detailed travel plan.',
      tags: ['AI', 'NLP', 'Chatbot'],
      stack: ['Python', 'OpenAI API', 'Flask', 'NLP'],
      link: 'https://github.com/shivamboda/Itinerary_ChatBot'
    },
    {
      icon: Search,
      image: crackDetectImg,
      title: 'Crack Detection',
      subtitle: 'Infrastructure Safety',
      description: 'TensorFlow ML pipeline for wall crack detection with 99.4% accuracy; deployed as inference pipeline. Practical application for structural safety inspection.',
      tags: ['ML', 'CV'],
      stack: ['TensorFlow', 'Python', 'Computer Vision', 'CNN'],
      link: 'https://github.com/shivamboda/Crack_Detection'
    },
    {
      icon: GraduationCap,
      image: courseBotImg,
      title: 'Course Chatbot',
      subtitle: 'Smart Recommendations',
      description: 'Course recommendation chatbot built using Flask and OpenAI\'s GPT API. Allows users to ask questions and get relevant course recommendations intelligently.',
      tags: ['AI', 'NLP', 'Chatbot'],
      stack: ['Python', 'Flask', 'OpenAI GPT API', 'NLP'],
      link: 'https://github.com/shivamboda/Internship_Chatbot'
    }
  ];

  return (
    <section id="projects" className="py-32 bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#7C5CFF]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#22C1C3]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#7C5CFF] via-[#22C1C3] to-[#7C5CFF] bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              Featured Projects
            </span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Hover to explore each project in detail
          </p>
        </motion.div>

        {/* Minimal Hover-Reveal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
              className="group relative bg-[#0F172A] border border-white/10 rounded-3xl overflow-hidden hover:border-[#7C5CFF]/50 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_30px_rgba(124,92,255,0.2)] flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent z-10 opacity-60" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Floating Icon Badge */}
                <div className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                  {(() => {
                    const Icon = project.icon;
                    return <Icon size={20} className="text-[#7C5CFF]" />;
                  })()}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#7C5CFF] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#22C1C3] text-sm font-medium mb-3">{project.subtitle}</p>

                <p className="text-[#94A3B8] text-sm mb-4 line-clamp-3 flex-grow">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-[#1E293B] text-[#94A3B8] rounded text-xs border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stack & CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex -space-x-2">
                    {/* Stack Icons/Dots placeholder */}
                    <div className="w-6 h-6 rounded-full bg-[#7C5CFF]/20 border border-[#7C5CFF]/30 flex items-center justify-center text-[10px] text-[#7C5CFF]">
                      AI
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#22C1C3]/20 border border-[#22C1C3]/30 flex items-center justify-center text-[10px] text-[#22C1C3]">
                      ML
                    </div>
                  </div>

                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 3 }}
                    className="text-sm text-white hover:text-[#7C5CFF] flex items-center gap-1 transition-colors"
                  >
                    View <ExternalLink size={14} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section >
  );
};

// ============================================================================
// EXPERIENCE SECTION
// ============================================================================

const Experience = () => {
  const experiences = [
    {
      title: 'Big Data Engineer',
      company: 'TCS (Apple Project)',
      location: 'Bengaluru, India',
      period: 'July 2025 – Present',
      description: [
        'Completed project onboarding, environment setup, and access configuration',
        'Gaining hands-on experience with Spark, Hive, HDFS, and SQL',
        'Participating in KT sessions on data pipelines and architecture',
        'Preparing to contribute to ETL workflows and large-scale processing'
      ],
      current: true
    },
    {
      title: 'Business Developer (Intern)',
      company: 'GAO Tek',
      location: 'Remote',
      period: 'Nov 2023 – Feb 2024',
      description: [
        'Created detailed reports on real-world applications of GAO Tek\'s products',
        'Collaborated with content teams for technical documentation',
        'Assisted squad leadership to streamline project execution'
      ],
      current: false
    },
    {
      title: 'Software Engineer (Intern)',
      company: 'Innovate2Automate',
      location: 'Remote',
      period: 'Jun 2022 – Aug 2022',
      description: [
        'Built ML-based wall crack detection system achieving 99.4% accuracy',
        'Developed ML pipelines using TensorFlow',
        'Gained strong experience in computer vision and applied AI'
      ],
      current: false
    }
  ];

  return (
    <section id="experience" className="py-24 bg-[#1E293B]">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
        >
          Experience
        </motion.h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 50 }}
              className="relative pl-8 border-l-2 border-[#7C5CFF]/30"
            >
              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#7C5CFF]" />

              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/10 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <div className="flex flex-wrap items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-[#22C1C3] font-semibold">{exp.company}</p>
                    <p className="text-[#94A3B8] text-sm">{exp.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[#94A3B8]">{exp.period}</span>
                    {exp.current && (
                      <span className="px-3 py-1 bg-[#22C1C3]/20 text-[#22C1C3] rounded-full text-sm">
                        Currently Working
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-[#94A3B8] flex items-start gap-2">
                      <span className="text-[#7C5CFF] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SKILLS SECTION
// ============================================================================

const Skills = () => {
  const skillCategories = [
    {
      title: 'Machine Learning',
      skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Reinforcement Learning', 'Computer Vision']
    },
    {
      title: 'Big Data & Cloud',
      skills: ['Spark', 'Hive', 'HDFS', 'SQL', 'ETL Pipelines']
    },
    {
      title: 'Programming',
      skills: ['Python', 'Java', 'Scala', 'Spark', 'SQL']
    },
    {
      title: 'Certifications',
      skills: ['Google Cloud Foundations', 'Microsoft Power App Maker (PL-100)']
    }
  ];

  return (
    <section id="skills" className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
        >
          Skills & Certifications
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 50 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1 bg-gradient-to-r from-[#7C5CFF]/20 to-[#22C1C3]/20 border border-[#7C5CFF]/30 text-white rounded-full text-sm"
                    whileHover={{ scale: 1.1, borderColor: '#7C5CFF' }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// RESEARCH & PATENTS SECTION
// ============================================================================

const Research = () => {
  const achievements = [
    {
      type: 'Research Paper',
      title: 'Presented at 2nd ICDEC 2023',
      description: 'Research paper presentation at the International Conference on Data Engineering and Communication'
    },
    {
      type: 'Patent',
      title: 'Bird Audio Classification System (ChirpSense)',
      description: 'Application No: 202541023487 A',
      link: '#'
    },
    {
      type: 'Patent',
      title: 'Smart Inventory Management System',
      description: 'Application No: 202541023323 A',
      link: '#'
    }
  ];

  return (
    <section id="research" className="py-24 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white mb-16 text-center"
        >
          Research & Patents
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 50 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl hover:bg-white/10 transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <div className="text-[#22C1C3] font-semibold mb-2">{achievement.type}</div>
              <h3 className="text-xl font-bold text-white mb-3">{achievement.title}</h3>
              <p className="text-[#94A3B8] text-sm">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



// ============================================================================
// FOOTER
// ============================================================================

// ============================================================================
// CONTACT SECTION
// ============================================================================

const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('shivamboda@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="py-24 bg-[#0F172A] relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In <span className="bg-gradient-to-r from-[#7C5CFF] to-[#22C1C3] bg-clip-text text-transparent">Touch</span>
          </h2>

          <p className="text-lg text-[#94A3B8] mb-12 max-w-2xl mx-auto">
            I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to reach out!
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* GitHub Card */}
            <motion.a
              href="https://github.com/shivamboda"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
              whileHover={{ y: -5, borderColor: 'rgba(124, 92, 255, 0.5)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Github className="w-12 h-12 text-[#22C1C3] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">GitHub</h3>
              <p className="text-[#94A3B8] text-sm">@Hac-2002</p>
            </motion.a>

            {/* LinkedIn Card */}
            <motion.a
              href="https://www.linkedin.com/in/shivamboda"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
              whileHover={{ y: -5, borderColor: 'rgba(124, 92, 255, 0.5)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Linkedin className="w-12 h-12 text-[#22C1C3] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">LinkedIn</h3>
              <p className="text-[#94A3B8] text-sm">in/shivamboda</p>
            </motion.a>

            {/* Email Card with Copy */}
            <motion.button
              onClick={handleCopyEmail}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer"
              whileHover={{ y: -5, borderColor: 'rgba(124, 92, 255, 0.5)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {copiedEmail ? (
                <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
              ) : (
                <Mail className="w-12 h-12 text-[#22C1C3] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              )}
              <h3 className="text-white font-semibold mb-2">
                {copiedEmail ? 'Copied!' : 'Email'}
              </h3>
              <p className="text-[#94A3B8] text-sm flex items-center justify-center gap-2">
                shivamboda@gmail.com
                {!copiedEmail && <Copy size={14} />}
              </p>
            </motion.button>
          </div>
        </div>
      </div>
    </section >
  );
};

// ============================================================================
// FOOTER
// ============================================================================

const Footer = () => {
  return (
    <footer className="py-12 bg-[#0F172A] border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[#94A3B8] text-center md:text-left">
            © {new Date().getFullYear()} Shivam Boda. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <motion.a
              href="https://github.com/shivamboda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] hover:text-white transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Github size={24} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/shivamboda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94A3B8] hover:text-white transition-colors"
              whileHover={{ scale: 1.2, rotate: -5 }}
            >
              <Linkedin size={24} />
            </motion.a>
            <motion.a
              href="mailto:shivamboda@gmail.com"
              className="text-[#94A3B8] hover:text-white transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Mail size={24} />
            </motion.a>
          </div>


        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'projects', 'experience', 'skills', 'research', 'contact'];
      const scrollPosition = window.scrollY + 200;

      // Check if we're near the bottom of the page (for last section)
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      if (isNearBottom) {
        setActiveSection('contact');
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll(); // Call immediately on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0F172A] min-h-screen">
      <Header activeSection={activeSection} />
      <Hero reducedMotion={reducedMotion} />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Research />
      <Contact />
      <Footer />
    </div>
  );
}
