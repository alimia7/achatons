import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStats } from './hooks/useStats';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AdminCharts = () => {
  const { stats } = useStats();
  const [offersData, setOffersData] = useState<Array<{ month: string; count: number }>>([]);
  const [participationsData, setParticipationsData] = useState<Array<{ month: string; count: number }>>([]);
  const [statusDistribution, setStatusDistribution] = useState<Array<{ name: string; value: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      // Fetch offers
      const offersSnap = await getDocs(collection(db, 'offers'));
      const offers = offersSnap.docs.map(d => ({
        ...d.data(),
        created_at: d.data().created_at || new Date().toISOString(),
        status: d.data().status || 'inactive',
      }));

      // Fetch participations
      const participationsSnap = await getDocs(collection(db, 'participations'));
      const participations = participationsSnap.docs.map(d => ({
        ...d.data(),
        created_at: d.data().created_at || new Date().toISOString(),
        status: d.data().status || 'pending',
      }));

      // Group offers by month
      const offersByMonth = new Map<string, number>();
      offers.forEach(offer => {
        const date = new Date(offer.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        offersByMonth.set(monthKey, (offersByMonth.get(monthKey) || 0) + 1);
      });

      const offersChartData = Array.from(offersByMonth.entries())
        .map(([month, count]) => ({
          month: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          count,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Last 6 months

      // Group participations by month
      const participationsByMonth = new Map<string, number>();
      participations.forEach(part => {
        const date = new Date(part.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        participationsByMonth.set(monthKey, (participationsByMonth.get(monthKey) || 0) + 1);
      });

      const participationsChartData = Array.from(participationsByMonth.entries())
        .map(([month, count]) => ({
          month: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
          count,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Last 6 months

      // Status distribution for participations
      const statusCounts = {
        pending: participations.filter((p: any) => p.status === 'pending').length,
        validated: participations.filter((p: any) => p.status === 'validated').length,
        cancelled: participations.filter((p: any) => p.status === 'cancelled').length,
      };

      setStatusDistribution([
        { name: 'En attente', value: statusCounts.pending },
        { name: 'Validées', value: statusCounts.validated },
        { name: 'Annulées', value: statusCounts.cancelled },
      ]);

      setOffersData(offersChartData);
      setParticipationsData(participationsChartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#D2691E', '#8B4513', '#FF6B6B', '#4ECDC4', '#45B7D1'];

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chargement des graphiques...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Offers Evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-achatons-brown">
            Évolution des offres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={offersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#D2691E"
                strokeWidth={2}
                name="Nombre d'offres"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Participations Evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-achatons-brown">
            Évolution des participations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={participationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8B4513" name="Nombre de participations" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-achatons-brown">
            Répartition des participations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Offers Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-achatons-brown">
            Statut des offres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Actives', value: stats.activeOffers },
                { name: 'Inactives', value: stats.totalOffers - stats.activeOffers },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#D2691E" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCharts;

