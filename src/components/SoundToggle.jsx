import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import useSound from '../hooks/useSound';

const SoundToggle = () => {
    const { toggleMute, isMuted } = useSound();
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        setMuted(isMuted());
    }, [isMuted]);

    const handleToggle = () => {
        const newMutedState = toggleMute();
        setMuted(newMutedState);
    };

    return (
        <motion.button
            onClick={handleToggle}
            className="fixed bottom-6 right-6 z-50 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[#D6CBB8] hover:text-white hover:bg-white/10 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            title={muted ? "Enable sound effects" : "Disable sound effects"}
        >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
    );
};

export default SoundToggle;
