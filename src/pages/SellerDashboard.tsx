import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SellerHeader from '@/components/seller/SellerHeader';
import SellerStatsCards from '@/components/seller/SellerStatsCards';
import RevenueChart from '@/components/seller/RevenueChart';
import SalesDistributionChart from '@/components/seller/SalesDistributionChart';
import SellerProductsTab from '@/components/seller/SellerProductsTab';
import SellerOffersTab from '@/components/seller/SellerOffersTab';
import SellerClientsTab from '@/components/seller/SellerClientsTab';
import SellerDeliveriesTab from '@/components/seller/SellerDeliveriesTab';
import SellerProfileTab from '@/components/seller/SellerProfileTab';
import LoadingState from '@/components/LoadingState';

const SellerDashboard = () => {
  const { user, isSeller, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isSeller)) {
      navigate('/auth');
      return;
    }
  }, [user, isSeller, loading, navigate]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user || !isSeller) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-achatons-cream to-white">
      <div className="container mx-auto px-4 py-12">
        <SellerHeader />
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="offers">Offres</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="deliveries">Livraison</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SellerStatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <SalesDistributionChart />
            </div>
          </TabsContent>

          <TabsContent value="products">
            <SellerProductsTab />
          </TabsContent>

          <TabsContent value="offers">
            <SellerOffersTab />
          </TabsContent>

          <TabsContent value="clients">
            <SellerClientsTab />
          </TabsContent>

          <TabsContent value="deliveries">
            <SellerDeliveriesTab />
          </TabsContent>

          <TabsContent value="profile">
            <SellerProfileTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;

