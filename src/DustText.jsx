import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useMobile from './hooks/useMobile';

const DustText = ({ text, className = '' }) => {
    const { scrollY } = useScroll();
    const isMobile = useMobile();

    // Split text into words to prevent mid-word breaking
    const words = useMemo(() => {
        return text.split(' ').map((word, wordIndex) => ({
            word,
            id: wordIndex,
            // Word-level physics for mobile
            randomX: Math.random() * 100 - 50, // Less scatter for words
            randomY: Math.random() * -100 - 20,
            randomRotate: Math.random() * 60 - 30,
            chars: word.split('').map((char, charIndex) => ({
                char,
                id: `${wordIndex}-${charIndex}`,
                randomX: Math.random() * 200 - 100,
                randomY: Math.random() * -150 - 50,
                randomRotate: Math.random() * 180 - 90,
                randomDelay: Math.random() * 0.2,
            }))
        }));
    }, [text]);

    if (isMobile) {
        // Mobile: Scatter words instead of characters (better performance)
        return (
            <span className={`inline ${className}`}>
                {words.map((word, idx) => (
                    <span key={word.id} className="inline-block" style={{ marginRight: idx < words.length - 1 ? '0.25em' : '0' }}>
                        <DustChar
                            item={{
                                char: word.word,
                                randomX: word.randomX,
                                randomY: word.randomY,
                                randomRotate: word.randomRotate
                            }}
                            scrollY={scrollY}
                        />
                    </span>
                ))}
            </span>
        );
    }

    // Desktop: Full Dust Effect (Character level)
    return (
        <span className={`inline ${className}`}>
            {words.map((word, idx) => (
                <span key={word.id} className="inline-block" style={{ marginRight: idx < words.length - 1 ? '0.25em' : '0' }}>
                    {word.chars.map((item) => (
                        <DustChar key={item.id} item={item} scrollY={scrollY} />
                    ))}
                </span>
            ))}
        </span>
    );
};

const DustChar = ({ item, scrollY }) => {
    // Map scroll position [0, 300] to animation values
    const x = useTransform(scrollY, [0, 300], [0, item.randomX]);
    const y = useTransform(scrollY, [0, 300], [0, item.randomY]);
    const rotate = useTransform(scrollY, [0, 300], [0, item.randomRotate]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0]);
    const blur = useTransform(scrollY, [0, 200], ["0px", "4px"]);

    return (
        <motion.span
            style={{
                x,
                y,
                rotate,
                opacity,
                scale,
                filter: useTransform(blur, (b) => `blur(${b})`),
                display: 'inline-block',
            }}
            className="relative"
        >
            {item.char}
        </motion.span>
    );
};

export default DustText;
