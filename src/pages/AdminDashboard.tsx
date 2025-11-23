
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCards from '@/components/admin/StatsCards';
import AdminCharts from '@/components/admin/AdminCharts';
import SellerRequestsTable from '@/components/admin/SellerRequestsTable';
import CategoriesTab from '@/components/admin/CategoriesTab';
import UsersTab from '@/components/admin/UsersTab';
import { useAdminData } from '@/components/admin/hooks/useAdminData';
import { BarChart3, Store, Tag, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('stats');
  const {
    stats,
  } = useAdminData();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
      return;
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    // Check if navigation state has a tab to open
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      // Clear the state to avoid reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="seller-requests" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Demandes de vendeur
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Catégories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <StatsCards stats={stats} />
            <AdminCharts />
          </TabsContent>

          <TabsContent value="seller-requests">
            <SellerRequestsTable />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
