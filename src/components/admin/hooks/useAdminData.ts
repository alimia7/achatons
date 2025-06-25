
import { useEffect } from 'react';
import { useOffers } from './useOffers';
import { useCategories } from './useCategories';
import { useParticipations } from './useParticipations';
import { useStats } from './useStats';

export const useAdminData = () => {
  const { offers, fetchOffers } = useOffers();
  const { categories, fetchCategories } = useCategories();
  const { participations, fetchParticipations } = useParticipations();
  const { stats, calculateStats } = useStats();

  const refreshData = async () => {
    console.log('Refreshing all data...');
    await Promise.all([
      fetchOffers(),
      fetchCategories(),
      fetchParticipations(),
      calculateStats()
    ]);
  };

  const refreshOffersAndStats = async () => {
    console.log('Refreshing offers and stats...');
    await Promise.all([
      fetchOffers(),
      calculateStats()
    ]);
  };

  const refreshParticipationsAndStats = async () => {
    console.log('Refreshing participations and stats...');
    await Promise.all([
      fetchParticipations(),
      fetchOffers(), // Also refresh offers to see updated participant counts
      calculateStats()
    ]);
  };

  const refreshCategoriesAndOffers = async () => {
    console.log('Refreshing categories and offers...');
    await Promise.all([
      fetchCategories(),
      fetchOffers()
    ]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    offers,
    categories,
    participations,
    stats,
    refreshData,
    refreshOffersAndStats,
    refreshParticipationsAndStats,
    refreshCategoriesAndOffers,
  };
};
