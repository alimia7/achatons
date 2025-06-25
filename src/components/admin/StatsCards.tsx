
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Clock,
  BarChart3
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalOffers: number;
    activeOffers: number;
    totalParticipations: number;
    pendingParticipations: number;
    totalRevenue: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total des offres</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-achatons-orange" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offres actives</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeOffers}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-achatons-green" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Participations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParticipations}</p>
            </div>
            <Users className="h-8 w-8 text-achatons-brown" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingParticipations}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chiffre estimé</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} FCFA</p>
            </div>
            <BarChart3 className="h-8 w-8 text-achatons-orange" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
