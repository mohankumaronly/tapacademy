import React from 'react';
import { motion } from 'framer-motion';

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
    <motion.div 
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex flex-col items-center cursor-pointer group px-2 py-1 rounded-lg transition-colors ${
            active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'group-hover:text-gray-700'}`} />
        <span className="text-xs mt-1 hidden xl:block">{label}</span>
        {active && (
            <motion.div 
                layoutId="activeNav"
                className="h-0.5 w-full bg-blue-600 mt-1 rounded-full"
            />
        )}
    </motion.div>
);

export default NavItem;