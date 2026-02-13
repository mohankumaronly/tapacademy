import React from 'react';
import { motion } from 'framer-motion';

const InputText = ({ 
    type = "text", 
    placeholder, 
    name, 
    value, 
    onChange, 
    label,
    icon: Icon,
    error
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col gap-1.5 w-full'
        >
            <label 
                htmlFor={name} 
                className='text-sm font-bold text-slate-700 ml-1 flex items-center gap-1'
            >
                {Icon && <Icon size={14} className="text-[#0a66c2]" />}
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
                        w-full border-2 px-4 py-3 rounded-xl outline-none 
                        transition-all duration-300
                        placeholder:text-slate-400 text-slate-800 font-medium
                        ${error 
                            ? 'border-red-300 bg-red-50 focus:ring-red-100' 
                            : 'border-slate-200 bg-white focus:border-[#0a66c2] focus:ring-4 focus:ring-blue-100'
                        }
                    `} 
                />
                {error && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>
                )}
            </div>
        </motion.div>
    );
};

export default InputText;