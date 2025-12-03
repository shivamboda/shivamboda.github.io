import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from '../hooks/useSound';
import coffeeIcon from '../assets/icons/coffee-bean.png';
import saturnIcon from '../assets/icons/saturn.png';

const ThemeToggle = () => {
    const [isCoffee, setIsCoffee] = useState(true);
    const { toggle } = useSound();

    useEffect(() => {
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'space') {
            setIsCoffee(false);
            document.documentElement.classList.add('space-mode');
        } else {
            setIsCoffee(true);
            document.documentElement.classList.remove('space-mode');
        }
    }, []);

    const toggleTheme = () => {
        toggle();
        if (isCoffee) {
            // Switch to Space
            document.documentElement.classList.add('space-mode');
            localStorage.setItem('theme', 'space');
            setIsCoffee(false);
        } else {
            // Switch to Coffee
            document.documentElement.classList.remove('space-mode');
            localStorage.setItem('theme', 'coffee');
            setIsCoffee(true);
        }
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative p-2 rounded-full transition-colors duration-300 ${isCoffee ? 'bg-[#5C4438]/20 hover:bg-[#5C4438]/30' : 'bg-[#A16CFF]/20 hover:bg-[#A16CFF]/30'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <div className="relative w-8 h-8 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {isCoffee ? (
                        <motion.div
                            key="coffee"
                            initial={{ y: -30, opacity: 0, rotate: -90 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 30, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <img
                                src={coffeeIcon}
                                alt="Coffee Mode"
                                className="w-6 h-6 object-contain opacity-80"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="space"
                            initial={{ y: -30, opacity: 0, rotate: -90 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 30, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <img
                                src={saturnIcon}
                                alt="Space Mode"
                                className="w-7 h-7 object-contain"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    );
};

export default ThemeToggle;
