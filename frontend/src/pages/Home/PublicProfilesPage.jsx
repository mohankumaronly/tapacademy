import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCircle2, MapPin, ChevronRight, Users2 } from "lucide-react";

import Loading from "../../components/Loading";
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

    debounceTimer = setTimeout(async () => {
      const res = await getPublicProfiles(value);
      setSuggestions(res.data.data.slice(0, 5));
      setShowDropdown(true);
      setProfiles(res.data.data);
    }, 300);
  };

  const openProfile = (id) => {
    setShowDropdown(false);
    setSearch("");
    navigate(`/profile/${id}`);
  };

  if (loading && profiles.length === 0) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <Users2 className="text-blue-600" size={32} />
          Explore Community
        </h1>
        <p className="text-gray-500 mt-2">Connect with professionals and fellow learners</p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-10" ref={dropdownRef}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            onFocus={() => search.trim() && setShowDropdown(true)}
            placeholder="Search by name, email, headline, or skills..." 
            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg"
          />
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute w-full bg-white border border-gray-100 shadow-xl rounded-xl mt-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {suggestions.map(p => (
              <div
                key={p._id}
                onClick={() => openProfile(p.userId._id)}
                className="flex items-center gap-3 p-4 hover:bg-blue-50 cursor-pointer border-b last:border-none transition-colors"
              >
                <img
                  src={p.avatarUrl || "/avatar-placeholder.png"}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  alt="avatar"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {p.userId.firstName} {p.userId.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[250px]">
                    {p.headline || "No headline updated"}
                  </p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      {profiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <div
              key={profile._id}
              onClick={() => navigate(`/profile/${profile.userId._id}`)}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="relative">
                <img
                  src={profile.avatarUrl || "/avatar-placeholder.png"}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-50 shadow-sm group-hover:scale-105 transition-transform"
                  alt="profile"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
              </div>

              <h3 className="mt-4 font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {profile.userId.firstName} {profile.userId.lastName}
              </h3>
              
              <p className="text-sm text-gray-600 mt-1 line-clamp-1 h-5">
                {profile.headline || <span className="text-gray-300 italic">Headline not updated</span>}
              </p>

              {profile.location && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <MapPin size={12} /> {profile.location}
                </p>
              )}

              <button className="mt-6 w-full py-2 bg-gray-50 group-hover:bg-blue-600 group-hover:text-white text-gray-600 rounded-xl text-sm font-semibold transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <UserCircle2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No profiles found</h2>
          <p className="text-gray-400 mt-1">Try searching for a different name or email</p>
        </div>
      )}
    </div>
  );
};

export default PublicProfilesPage;