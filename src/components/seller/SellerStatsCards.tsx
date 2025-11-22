import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  BarChart3,
  Target
} from 'lucide-react';
import { useSellerStats } from './hooks/useSellerStats';

const SellerStatsCards = () => {
  const { stats, loading } = useSellerStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produits actifs</p>
              <p className="text-2xl font-bold text-achatons-brown">{stats.activeProducts}</p>
              <p className="text-xs text-gray-500 mt-1">sur {stats.totalProducts} total</p>
            </div>
            <Package className="h-8 w-8 text-achatons-orange" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offres en cours</p>
              <p className="text-2xl font-bold text-achatons-brown">{stats.activeOffers}</p>
              <p className="text-xs text-gray-500 mt-1">sur {stats.totalOffers} total</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-achatons-orange" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-2xl font-bold text-achatons-brown">{stats.totalParticipants}</p>
              <p className="text-xs text-gray-500 mt-1">total</p>
            </div>
            <Users className="h-8 w-8 text-achatons-brown" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-achatons-brown">{stats.totalRevenue.toLocaleString()} FCFA</p>
              <p className="text-xs text-gray-500 mt-1">Taux: {stats.conversionRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-achatons-orange" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerStatsCards;

