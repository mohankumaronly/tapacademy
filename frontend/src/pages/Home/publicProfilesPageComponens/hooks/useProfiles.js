import { useState, useCallback, useRef } from 'react';
import { getPublicProfiles } from '../../../../services/profile.service';

export const useProfiles = (initialLimit = 12) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: initialLimit
  });

  const fetchProfiles = useCallback(async (query = "", page = 1, limit = initialLimit, isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    }
    
    try {
      const res = await getPublicProfiles(query, page, limit);
      
      if (isLoadMore) {
        setProfiles(prev => [...prev, ...res.data.data]);
      } else {
        setProfiles(res.data.data);
      }
      
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
      if (!isLoadMore) {
        setLoading(false);
      }
      setSearchLoading(false);
    }
  }, [initialLimit]);

  const loadMore = useCallback(() => {
    if (pagination.hasNextPage && !loading) {
      fetchProfiles('', pagination.currentPage + 1, pagination.limit, true);
    }
  }, [pagination, loading, fetchProfiles]);

  return {
    profiles,
    setProfiles,
    loading,
    searchLoading,
    setSearchLoading,
    pagination,
    fetchProfiles,
    loadMore
  };
};