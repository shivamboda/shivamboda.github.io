import { useCallback, useRef, useEffect } from 'react';
import swooshSound from '../assets/sounds/swoosh.wav';
import emailSound from '../assets/sounds/email.wav';
import linkSound from '../assets/sounds/opening other links.wav';

const useSound = () => {
    const audioContextRef = useRef(null);
    const isMutedRef = useRef(() => {
        // Check localStorage for mute preference, default to false (UNMUTED)
        const stored = localStorage.getItem('soundsMuted');
        return stored === null ? false : stored === 'true';
    });

    // Create audio objects for custom sounds
    const swooshAudioRef = useRef(null);
    const emailAudioRef = useRef(null);
    const linkAudioRef = useRef(null);

    useEffect(() => {
        // Initialize AudioContext on first user interaction
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
        };

        // Initialize custom audio files
        swooshAudioRef.current = new Audio(swooshSound);
        swooshAudioRef.current.volume = 0.4;

        emailAudioRef.current = new Audio(emailSound);
        emailAudioRef.current.volume = 0.4;

        linkAudioRef.current = new Audio(linkSound);
        linkAudioRef.current.volume = 0.4;

        document.addEventListener('click', initAudio, { once: true });
        return () => document.removeEventListener('click', initAudio);
    }, []);

    const playSound = useCallback((frequency, duration, type = 'sine', volume = 0.25) => {
        if (isMutedRef.current()) return;
        if (!audioContextRef.current) return;

        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        //Envelope for smoother sound
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }, []);

    const hover = useCallback(() => {
        playSound(1000, 0.08, 'sine', 0.2);
    }, [playSound]);

    const click = useCallback(() => {
        playSound(600, 0.1, 'sine', 0.25);
        setTimeout(() => playSound(700, 0.08, 'sine', 0.15), 50);
    }, [playSound]);

    const swoosh = useCallback(() => {
        if (isMutedRef.current()) return;
        if (swooshAudioRef.current) {
            swooshAudioRef.current.currentTime = 0;
            swooshAudioRef.current.play().catch(e => console.log('Swoosh play failed:', e));
        }
    }, []);

    const success = useCallback(() => {
        if (isMutedRef.current()) return;
        if (emailAudioRef.current) {
            emailAudioRef.current.currentTime = 0;
            emailAudioRef.current.play().catch(e => console.log('Email play failed:', e));
        }
    }, []);

    const openLink = useCallback(() => {
        if (isMutedRef.current()) return;
        if (linkAudioRef.current) {
            linkAudioRef.current.currentTime = 0;
            linkAudioRef.current.play().catch(e => console.log('Link play failed:', e));
        }
    }, []);

    const toggleMute = useCallback(() => {
        const currentValue = isMutedRef.current();
        const newValue = !currentValue;
        isMutedRef.current = () => newValue;
        localStorage.setItem('soundsMuted', newValue.toString());
        return newValue;
    }, []);

    const isMuted = useCallback(() => {
        return isMutedRef.current();
    }, []);

    return { hover, click, swoosh, success, openLink, toggleMute, isMuted };
};

export default useSound;
