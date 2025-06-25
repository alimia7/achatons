
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ParticipationTableRow from './ParticipationTableRow';
import { useParticipationActions } from './hooks/useParticipationActions';

interface Participation {
  id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  quantity: number;
  status: string;
  created_at: string;
  offers: {
    name: string;
  };
}

interface ParticipationsTableProps {
  participations: Participation[];
  onParticipationsChange: () => void;
}

const ParticipationsTable = ({ participations, onParticipationsChange }: ParticipationsTableProps) => {
  const [selectedParticipationStatus, setSelectedParticipationStatus] = useState<string>('all');
  const [sortByProduct, setSortByProduct] = useState<'asc' | 'desc' | null>(null);
  const {
    isUpdating,
    handleValidateParticipation,
    handleCancelParticipation,
  } = useParticipationActions(onParticipationsChange);

  const filteredParticipations = selectedParticipationStatus === 'all'
    ? participations
    : participations.filter(participation => participation.status === selectedParticipationStatus);

  const sortedParticipations = [...filteredParticipations].sort((a, b) => {
    if (!sortByProduct) return 0;
    
    const productA = a.offers?.name || '';
    const productB = b.offers?.name || '';
    
    if (sortByProduct === 'asc') {
      return productA.localeCompare(productB, 'fr', { sensitivity: 'base' });
    } else {
      return productB.localeCompare(productA, 'fr', { sensitivity: 'base' });
    }
  });

  const handleProductSort = () => {
    if (sortByProduct === null) {
      setSortByProduct('asc');
    } else if (sortByProduct === 'asc') {
      setSortByProduct('desc');
    } else {
      setSortByProduct(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des participations</CardTitle>
            <CardDescription>Validez ou annulez les demandes de participation</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedParticipationStatus} onValueChange={setSelectedParticipationStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="validated">Validées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-medium hover:bg-transparent"
                  onClick={handleProductSort}
                >
                  <div className="flex items-center space-x-1">
                    <span>Offre</span>
                    <ArrowUpDown className="h-4 w-4" />
                    {sortByProduct && (
                      <span className="text-xs text-blue-600">
                        {sortByProduct === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </Button>
              </TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedParticipations.map((participation) => (
              <ParticipationTableRow
                key={participation.id}
                participation={participation}
                isUpdating={isUpdating[participation.id] || false}
                onValidate={handleValidateParticipation}
                onCancel={handleCancelParticipation}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ParticipationsTable;
