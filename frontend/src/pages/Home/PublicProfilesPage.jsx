import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCircle2, MapPin, ChevronRight, Users2, X } from "lucide-react";

import Loading from "../../components/Loading";
import ExploreCommunityLayout from "../../layouts/ExploreCommunityLayout";
import { getPublicProfiles } from "../../services/profile.service";
import { useAuth } from "../../context/AuthContext";

let debounceTimer;

const PublicProfilesPage = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchProfiles("");
  }, []);

  const fetchProfiles = async (query) => {
    setLoading(true);
    try {
      const res = await getPublicProfiles(query);
      setProfiles(res.data.data);
    } catch (err) {
      console.error("Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    clearTimeout(debounceTimer);

    if (!value.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      fetchProfiles("");
      return;
    }

    setLoading(true);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await getPublicProfiles(value);
        setSuggestions(res.data.data.slice(0, 5));
        setShowDropdown(true);
        setProfiles(res.data.data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
    setShowDropdown(false);
    fetchProfiles("");
  };

  const openProfile = (id) => {
    setShowDropdown(false);
    setSearch("");
    navigate(`/profile/${id}`);
  };

  if (loading && profiles.length === 0) return <Loading />;

  return (
    <ExploreCommunityLayout>
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-block p-3 bg-blue-50 rounded-full mb-4"
          >
            <Users2 className="text-blue-600" size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Explore Community
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Connect with professionals, mentors, and fellow learners from around the world
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative" ref={dropdownRef}>
            <div className="relative group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                showDropdown ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              <input
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => search.trim() && setShowDropdown(true)}
                placeholder="Search by name, email, headline, or skills..." 
                className="w-full bg-white border border-gray-200 rounded-full pl-12 pr-12 py-4 text-base outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:shadow-lg transition-all"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              )}
              {loading && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {showDropdown && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute w-full bg-white border border-gray-200 shadow-xl rounded-2xl mt-2 z-50 overflow-hidden"
                >
                  {suggestions.map((profile, index) => (
                    <motion.div
                      key={profile._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => openProfile(profile.userId._id)}
                      className="flex items-center gap-4 p-4 cursor-pointer border-b last:border-none"
                    >
                      <img
                        src={profile.avatarUrl || "/avatar-placeholder.png"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        alt={profile.userId?.firstName || 'User'}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {profile.userId?.firstName} {profile.userId?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {profile.headline || "No headline updated"}
                        </p>
                        {profile.location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin size={12} /> {profile.location}
                          </p>
                        )}
                      </div>
                      <ChevronRight size={20} className="text-gray-300" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-sm text-gray-400">Popular:</span>
            {["Mohankumar", "Ganesh", "Govind", "Nandkumar", "Amar"].map((term) => (
              <button
                key={term}
                onClick={() => handleSearchChange(term)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Profiles Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-8"
        >
          {profiles.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  {profiles.length} {profiles.length === 1 ? 'Professional' : 'Professionals'} found
                </h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white">
                  <option>Most Relevant</option>
                  <option>Recently Active</option>
                  <option>Alphabetical</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile, index) => (
                  <motion.div
                    key={profile._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/profile/${profile.userId._id}`)}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="relative mb-4">
                      <img
                        src={profile.avatarUrl || "/avatar-placeholder.png"}
                        className="w-28 h-28 rounded-full object-cover border-4 border-gray-50 group-hover:border-blue-100 transition-all"
                        alt={profile.userId?.firstName || 'Profile'}
                      />
                      <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {profile.userId?.firstName} {profile.userId?.lastName}
                    </h3>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-3">
                      {profile.headline || <span className="text-gray-300 italic">No headline</span>}
                    </p>

                    {profile.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                        <MapPin size={12} /> {profile.location}
                      </p>
                    )}

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-2 w-full py-2.5 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-gray-600 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Connect
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200"
            >
              <UserCircle2 size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">No profiles found</h2>
              <p className="text-gray-400">Try adjusting your search or filters to find more people</p>
            </motion.div>
          )}
        </motion.div>

        {/* Load More Button */}
        {profiles.length > 0 && profiles.length >= 12 && (
          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all"
            >
              Load More Profiles
            </motion.button>
          </div>
        )}
      </div>
    </ExploreCommunityLayout>
  );
};

export default PublicProfilesPage;