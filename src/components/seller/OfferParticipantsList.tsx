import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { useOfferParticipations, OfferParticipation } from './hooks/useOfferParticipations';
import { useParticipationActions } from '@/components/admin/hooks/useParticipationActions';
import LoadingState from '@/components/LoadingState';

interface OfferParticipantsListProps {
  offerId: string;
  onParticipationsChange?: () => void;
}

const OfferParticipantsList = ({ offerId, onParticipationsChange }: OfferParticipantsListProps) => {
  const { participations, loading, fetchParticipations } = useOfferParticipations(offerId);
  
  const handleRefresh = () => {
    fetchParticipations();
    onParticipationsChange?.(); // This will trigger offer refresh in parent
  };
  
  const { isUpdating, handleValidateParticipation, handleCancelParticipation } = useParticipationActions(handleRefresh);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'validated':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" />Validée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" />Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (!paymentStatus) return <Badge variant="outline" className="bg-gray-50 text-gray-700">Non défini</Badge>;
    
    switch (paymentStatus) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" />Payé</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Remboursé</Badge>;
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>;
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (participations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 border rounded-md bg-white">
        <p>Aucun participant pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participations.map((participation) => (
              <TableRow key={participation.id}>
                <TableCell className="font-medium">{participation.user_name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {participation.user_phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{participation.user_phone}</span>
                      </div>
                    )}
                    {participation.user_email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="text-xs">{participation.user_email}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {participation.user_address ? (
                    <div className="flex items-start text-sm max-w-xs">
                      <MapPin className="h-3 w-3 mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{participation.user_address}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>{participation.quantity}</TableCell>
                <TableCell>{getStatusBadge(participation.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(participation.payment_status)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(participation.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {participation.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleValidateParticipation(participation.id)}
                        disabled={isUpdating[participation.id]}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                    )}
                    {participation.status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelParticipation(participation.id)}
                        disabled={isUpdating[participation.id]}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-gray-600 pt-2">
        <p>Total: <strong>{participations.length}</strong> participant(s)</p>
        <p>
          Validées: <strong>{participations.filter(p => p.status === 'validated').length}</strong> | 
          En attente: <strong>{participations.filter(p => p.status === 'pending').length}</strong> | 
          Annulées: <strong>{participations.filter(p => p.status === 'cancelled').length}</strong>
        </p>
      </div>
    </div>
  );
};

export default OfferParticipantsList;

