import { motion, AnimatePresence } from 'framer-motion';
import Header from './LayoutComponents/Header';

const ExploreCommunityLayout = ({ children }) => {
    return (
        <div className="min-h-screen">
            <Header />
                <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="border-t border-gray-200 mt-12 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <span>© 2025 Tap Academy</span>
                            <span>•</span>
                            <span>Community Explorer</span>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Accessibility</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ExploreCommunityLayout;