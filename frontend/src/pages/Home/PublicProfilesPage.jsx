import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCircle2, MapPin, ChevronRight, Users2, X, Briefcase, Code } from "lucide-react";

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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  });

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
    fetchProfiles("", 1, pagination.limit);
  }, []);

  const fetchProfiles = async (query, page = 1, limit = pagination.limit) => {
    setLoading(true);
    try {
      const res = await getPublicProfiles(query, page, limit);
      setProfiles(res.data.data);
      setPagination(res.data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalCount: res.data.data.length,
        hasNextPage: false,
        hasPrevPage: page > 1,
        limit: limit
      });
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
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
      fetchProfiles("", 1, pagination.limit);
      return;
    }

    setLoading(true);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await getPublicProfiles(value, 1, 5); // Get only 5 for suggestions
        setSuggestions(res.data.data);
        setShowDropdown(true);
        setProfiles(res.data.data);
        setPagination(res.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: res.data.data.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: pagination.limit
        });
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
    fetchProfiles("", 1, pagination.limit);
  };

  const openProfile = (id) => {
    setShowDropdown(false);
    setSearch("");
    navigate(`/profile/${id}`);
  };

  const loadMore = () => {
    if (pagination.hasNextPage) {
      fetchProfiles(search, pagination.currentPage + 1, pagination.limit);
    }
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    // Implement sorting logic here
    const sortedProfiles = [...profiles];
    switch(sortValue) {
      case "alphabetical":
        sortedProfiles.sort((a, b) => 
          (a.user?.firstName || "").localeCompare(b.user?.firstName || "")
        );
        break;
      case "recent":
        // Sort by createdAt date
        sortedProfiles.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        // Most relevant - keep as is
        break;
    }
    setProfiles(sortedProfiles);
  };

  const renderSkills = (skills = [], techStack = []) => {
    const allSkills = [...new Set([...skills, ...techStack])].slice(0, 3);
    if (allSkills.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 justify-center mb-3">
        {allSkills.map((skill, i) => (
          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
            {skill}
          </span>
        ))}
        {allSkills.length > 3 && <span className="text-xs text-gray-400">+{allSkills.length - 3}</span>}
      </div>
    );
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
                      key={profile.id || profile._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => openProfile(profile.userId?._id || profile.userId)}
                      className="flex items-center gap-4 p-4 cursor-pointer border-b last:border-none"
                    >
                      <img
                        src={profile.avatarUrl || "/avatar-placeholder.png"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        alt={profile.user?.firstName || profile.userId?.firstName || 'User'}
                        onError={(e) => e.target.src = "/avatar-placeholder.png"}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {profile.user?.fullName || 
                           (profile.userId?.firstName && profile.userId?.lastName 
                             ? `${profile.userId.firstName} ${profile.userId.lastName}`
                             : profile.userId?.firstName || profile.userId?.lastName || "User")}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {profile.headline || "No headline updated"}
                        </p>
                        {profile.location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <MapPin size={12} /> {profile.location}
                          </p>
                        )}
                      </div>
                      <ChevronRight size={20} className="text-gray-300 flex-shrink-0" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-sm text-gray-400">Popular:</span>
            {["Developer", "Designer", "Mentor", "Student", "Teacher"].map((term) => (
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  {pagination.totalCount} {pagination.totalCount === 1 ? 'Professional' : 'Professionals'} found
                </h2>
                <select 
                  onChange={handleSortChange}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="recent">Recently Active</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile, index) => (
                  <motion.div
                    key={profile.id || profile._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(`/profile/${profile.userId?._id || profile.userId}`)}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className="relative mb-4">
                      <img
                        src={profile.avatarUrl || "/avatar-placeholder.png"}
                        className="w-28 h-28 rounded-full object-cover border-4 border-gray-50 group-hover:border-blue-100 transition-all"
                        alt={profile.user?.fullName || 'Profile'}
                        onError={(e) => e.target.src = "/avatar-placeholder.png"}
                      />
                      <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate w-full">
                      {profile.user?.fullName || 
                       (profile.userId?.firstName && profile.userId?.lastName 
                         ? `${profile.userId.firstName} ${profile.userId.lastName}`
                         : profile.userId?.firstName || profile.userId?.lastName || "User")}
                    </h3>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-3">
                      {profile.headline || <span className="text-gray-300 italic">No headline</span>}
                    </p>

                    {/* Skills Preview */}
                    {renderSkills(profile.skills, profile.techStack)}

                    {profile.company && profile.role && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <Briefcase size={12} className="text-gray-400" />
                        {profile.role} at {profile.company}
                      </p>
                    )}

                    {profile.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                        <MapPin size={12} /> {profile.location}
                      </p>
                    )}

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle connect action
                      }}
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
        {pagination.hasNextPage && (
          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load More Profiles"}
            </motion.button>
          </div>
        )}
      </div>
    </ExploreCommunityLayout>
  );
};

export default PublicProfilesPage;