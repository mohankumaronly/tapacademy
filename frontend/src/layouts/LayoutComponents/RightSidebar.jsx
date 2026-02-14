import React from 'react';
import { motion } from 'framer-motion';
import NewsSection from './NewsSection';
import FooterLinks from './FooterLinks';

const RightSidebar = () => {
    return (
        <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-4"
        >
            <NewsSection />
            <FooterLinks />
        </motion.aside>
    );
};

export default RightSidebar;