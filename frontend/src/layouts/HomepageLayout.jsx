import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebar from './LayoutComponents/LeftSidebar';
import RightSidebar from './LayoutComponents/RightSidebar';
import Header from './LayoutComponents/Header';

const HomePageLayout = ({ children }) => {
    return (
        <div className="min-h-screen">
            <Header />
            
            <main className="max-w-6xl mx-auto pt-20 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <LeftSidebar />
                    <div className="lg:col-span-6 space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <RightSidebar />
                </div>
            </main>
        </div>
    );
};

export default HomePageLayout;