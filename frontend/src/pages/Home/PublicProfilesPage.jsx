import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users2 } from "lucide-react";
import { motion } from "framer-motion";
import ExploreCommunityLayout from "../../layouts/ExploreCommunityLayout";
import Loading from "../../components/Loading";
import PageHeader from "./publicProfilesPageComponens/layout/PageHeader";
import SearchInput from "./publicProfilesPageComponens/components/SearchInput";
import SearchDropdown from "./publicProfilesPageComponens/components/search/SearchDropdown";
import PopularTerms from "./publicProfilesPageComponens/components/search/PopularTerms";
import SortSelect from "./publicProfilesPageComponens/components/SortSelect";
import ProfileCard from "./publicProfilesPageComponens/components/profiles/ProfileCard";
import LoadMoreButton from "./publicProfilesPageComponens/components/LoadMoreButton";
import EmptyState from "./publicProfilesPageComponens/components/EmptyState";
import { useProfiles } from "./publicProfilesPageComponens/hooks/useProfiles";
import { useSearch } from "./publicProfilesPageComponens/hooks/useSearch";
import { useClickOutside } from "./publicProfilesPageComponens/hooks/useClickOutside";
import { useProfileSort } from "./publicProfilesPageComponens/hooks/useProfileSort";


const PublicProfilesPage = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  const {
    profiles,
    setProfiles,
    loading,
    pagination,
    fetchProfiles,
    loadMore
  } = useProfiles(12);

  const {
    search,
    suggestions,
    showDropdown,
    searchLoading,
    setShowDropdown,
    handleSearchChange,
    clearSearch
  } = useSearch((query, results) => {
    setProfiles(results);
  });

  const { sortBy, setSortBy, sortProfiles } = useProfileSort();

  useClickOutside(dropdownRef, () => setShowDropdown(false));

  useEffect(() => {
    if (!initialLoadDone) {
      fetchProfiles("", 1, 12);
      setInitialLoadDone(true);
    }
  }, [initialLoadDone, fetchProfiles]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    const sorted = sortProfiles(profiles, value);
    setProfiles(sorted);
  };

  const handleExploreProfile = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

  const handlePopularTermClick = (term) => {
    handleSearchChange(term);
  };

  if (loading && profiles.length === 0) return <Loading />;

  return (
    <ExploreCommunityLayout>
      <div className="space-y-8">
        <PageHeader
          icon={Users2}
          title="Explore Community"
          subtitle="Connect with professionals, mentors, and fellow learners from around the world"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative" ref={dropdownRef}>
          <SearchInput
              ref={searchInputRef}
              value={search}
              onChange={handleSearchChange}
              onClear={clearSearch}
              onFocus={() => search.trim() && setShowDropdown(true)}
              isLoading={searchLoading}
              placeholder="Search by name, email, headline, or skills..."
            />

            <SearchDropdown
              suggestions={suggestions}
              isOpen={showDropdown}
              onSelect={handleExploreProfile}
              onClose={() => setShowDropdown(false)}
            />
          </div>

          <PopularTerms onTermClick={handlePopularTermClick} />
        </motion.div>

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
                <SortSelect value={sortBy} onChange={handleSortChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile, index) => (
                  <ProfileCard
                    key={profile.id || profile._id}
                    profile={profile}
                    index={index}
                    onExplore={handleExploreProfile}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              action={search && (
                <button
                  onClick={clearSearch}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            />
          )}
        </motion.div>

        <LoadMoreButton
          onClick={loadMore}
          loading={loading}
          hasNextPage={pagination.hasNextPage}
        />
      </div>
    </ExploreCommunityLayout>
  );
};

export default PublicProfilesPage;