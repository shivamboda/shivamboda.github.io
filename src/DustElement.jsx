import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DustElement = ({ children, className = '' }) => {
    const { scrollY } = useScroll();

    // Generate random values for the element's "dust" trajectory
    const dustPhysics = useMemo(() => ({
        randomX: Math.random() * 200 - 100, // Scatter left/right
        randomY: Math.random() * -150 - 50, // Float up
        randomRotate: Math.random() * 90 - 45, // Spin
    }), []);

    // Map scroll position [0, 300] to animation values
    const x = useTransform(scrollY, [0, 300], [0, dustPhysics.randomX]);
    const y = useTransform(scrollY, [0, 300], [0, dustPhysics.randomY]);
    const rotate = useTransform(scrollY, [0, 300], [0, dustPhysics.randomRotate]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.5]);
    const blur = useTransform(scrollY, [0, 200], ["0px", "4px"]);

    return (
        <motion.div
            style={{
                x,
                y,
                rotate,
                opacity,
                scale,
                filter: useTransform(blur, (b) => `blur(${b})`),
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default DustElement;
