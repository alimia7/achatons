import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSellerProducts } from './hooks/useSellerProducts';
import { useSellerOffers } from './hooks/useSellerOffers';

const COLORS = ['#D2691E', '#8B4513', '#2F5233', '#F4A460', '#E8B896', '#A0522D'];

const SalesDistributionChart = () => {
  const { products } = useSellerProducts();
  const { offers } = useSellerOffers();

  // Group offers by product
  const productSales = products.map(product => {
    const productOffers = offers.filter(o => o.product_id === product.id);
    const totalParticipants = productOffers.reduce((sum, o) => sum + o.current_participants, 0);
    return {
      name: product.name,
      value: totalParticipants,
    };
  }).filter(p => p.value > 0);

  if (productSales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-achatons-brown">Répartition des ventes par produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Aucune donnée disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-achatons-brown">Répartition des ventes par produit</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={productSales}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {productSales.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesDistributionChart;

