
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCards from '@/components/admin/StatsCards';
import OffersTable from '@/components/admin/OffersTable';
import CommunityOffersTable from '@/components/admin/CommunityOffersTable';
import ParticipationsTable from '@/components/admin/ParticipationsTable';
import { useAdminData } from '@/components/admin/hooks/useAdminData';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const {
    offers,
    categories,
    participations,
    stats,
    refreshOffersAndStats,
    refreshParticipationsAndStats,
    refreshCategoriesAndOffers,
  } = useAdminData();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
      return;
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeader />
        <StatsCards stats={stats} />
        <CommunityOffersTable 
          offers={offers}
          onOffersChange={refreshOffersAndStats}
        />
        <OffersTable 
          offers={offers}
          categories={categories}
          onOffersChange={refreshOffersAndStats}
          onCategoriesChange={refreshCategoriesAndOffers}
        />
        <ParticipationsTable 
          participations={participations}
          onParticipationsChange={refreshParticipationsAndStats}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
