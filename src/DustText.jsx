import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DustText = ({ text, className = '' }) => {
    const { scrollY } = useScroll();

    // Split text into characters, preserving spaces
    const characters = useMemo(() => {
        return text.split('').map((char, index) => ({
            char,
            id: index,
            // Generate random values for each character's "dust" trajectory
            randomX: Math.random() * 200 - 100, // Scatter left/right
            randomY: Math.random() * -150 - 50, // Float up
            randomRotate: Math.random() * 180 - 90, // Spin
            randomDelay: Math.random() * 0.2, // Stagger start slightly
        }));
    }, [text]);

    return (
        <span className={`inline-block ${className}`}>
            {characters.map((item) => (
                <DustChar key={item.id} item={item} scrollY={scrollY} />
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
                whiteSpace: 'pre', // Preserve spaces
            }}
            className="relative"
        >
            {item.char}
        </motion.span>
    );
};

export default DustText;
