import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSellerStats } from './hooks/useSellerStats';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RevenueChart = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const { stats, loading } = useSellerStats(period);

  // Mock data for chart - in real app, fetch historical data
  const chartData = [
    { date: 'Jan', revenue: 0 },
    { date: 'Fév', revenue: 0 },
    { date: 'Mar', revenue: 0 },
    { date: 'Avr', revenue: 0 },
    { date: 'Mai', revenue: 0 },
    { date: 'Juin', revenue: stats.totalRevenue },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-achatons-brown">Évolution des revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-achatons-brown">Évolution des revenus</CardTitle>
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#D2691E" 
              strokeWidth={2}
              name="Revenus (FCFA)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

