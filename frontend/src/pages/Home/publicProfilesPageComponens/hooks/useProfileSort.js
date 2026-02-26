import { useCallback, useState } from 'react';

export const useProfileSort = (initialProfiles = []) => {
  const [sortBy, setSortBy] = useState("relevant");

  const sortProfiles = useCallback((profiles, sortValue = sortBy) => {
    if (!profiles.length) return profiles;

    const sorted = [...profiles];
    
    switch(sortValue) {
      case "alphabetical":
        sorted.sort((a, b) => 
          (a.user?.firstName || "").localeCompare(b.user?.firstName || "")
        );
        break;
      case "recent":
        sorted.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [sortBy]);

  return {
    sortBy,
    setSortBy,
    sortProfiles
  };
};