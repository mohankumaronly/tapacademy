import React from 'react';
import { motion } from 'framer-motion';
import ProfileCard from './ProfileCard';

const LeftSidebar = () => {
    return (
        <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
        >
            <ProfileCard />
        </motion.aside>
    );
};

export default LeftSidebar;