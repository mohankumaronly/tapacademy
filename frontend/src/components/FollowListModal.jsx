import { motion, AnimatePresence } from "framer-motion";
import { X, Users, UserPlus, MapPin, Briefcase, ChevronRight, Loader2 } from "lucide-react";

const FollowListModal = ({ title, users, onClose, onOpenProfile, loading = false }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white w-[480px] rounded-3xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-xl p-2.5">
                  <Users size={22} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {loading ? (
                      <span className="flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `${users?.length || 0} ${users?.length === 1 ? 'member' : 'members'}`
                    )}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-xl p-2.5 text-gray-400 hover:text-gray-600 transition-all"
                disabled={loading}
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 text-sm mt-4">Loading {title.toLowerCase()}...</p>
              </div>
            ) : (!users || users.length === 0) ? (
              <div className="text-center py-16 px-6">
                <div className="bg-gray-50 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-900 font-medium text-lg">No users yet</p>
                <p className="text-gray-400 text-sm mt-1 max-w-[250px] mx-auto">
                  {title === "Followers" 
                    ? "When people follow you, they'll appear here"
                    : "When you follow people, they'll appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {users.map((user, index) => {
                  const userId = user._id || user.id || user.userId?._id || user.userId;
                  
                  const userData = user.userId || user;
                  const firstName = userData?.firstName || user.firstName || "User";
                  const lastName = userData?.lastName || user.lastName || "";
                  const fullName = `${firstName} ${lastName}`.trim();
                  const avatarUrl = userData?.avatarUrl || user.avatarUrl || "/api/placeholder/40/40";
                  const headline = userData?.headline || user.headline || "";
                  const location = userData?.location || user.location || "";
                  const company = userData?.company || user.company || "";
                  const batchName = userData?.batchName || user.batchName || "";
                  
                  return (
                    <motion.div
                      key={userId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onOpenProfile(userId)}
                      className="group relative cursor-pointer"
                    >
                      <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-all">
                        <div className="relative flex-shrink-0">
                          <img
                            src={avatarUrl}
                            alt={fullName}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
                            }}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-base truncate group-hover:text-gray-700">
                            {fullName}
                          </h4>
                          
                          {headline && (
                            <p className="text-sm text-gray-500 truncate mt-0.5">{headline}</p>
                          )}
                          
                          {(location || company || batchName) && (
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {location && (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <MapPin size={12} className="text-gray-300" />
                                  <span className="truncate max-w-[100px]">{location}</span>
                                </p>
                              )}
                              {company && (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <Briefcase size={12} className="text-gray-300" />
                                  <span className="truncate max-w-[100px]">{company}</span>
                                </p>
                              )}
                              {batchName && (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  Batch '{batchName}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#e5e7eb' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                            title="Follow user"
                          >
                            <UserPlus size={18} />
                          </motion.button>
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {users && users.length > 0 && !loading && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => {
                  console.log("View all clicked");
                }}
                className="w-full py-2.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors rounded-xl hover:bg-gray-100"
              >
                View all {users.length} members
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowListModal;