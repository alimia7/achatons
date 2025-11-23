import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, Mail, Phone, MapPin, Users, CheckCircle2, XCircle, Hourglass } from 'lucide-react';
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
  
  const { isUpdating, handleValidateParticipation, handleCancelParticipation, handleReactivateParticipation } = useParticipationActions(handleRefresh);

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

  // Filter participations by status
  const pendingParticipations = participations.filter(p => p.status === 'pending');
  const validatedParticipations = participations.filter(p => p.status === 'validated');
  const cancelledParticipations = participations.filter(p => p.status === 'cancelled');
  
  // Calculate totals
  const totalQuantity = participations.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const validatedQuantity = validatedParticipations.reduce((sum, p) => sum + (p.quantity || 0), 0);

  const renderParticipationsTable = (participationsList: OfferParticipation[]) => {
    if (participationsList.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 border rounded-md bg-gray-50">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>Aucune participation dans cette catégorie.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participationsList.map((participation) => (
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
                <TableCell>
                  <span className="font-semibold text-achatons-brown">{participation.quantity}</span>
                </TableCell>
                <TableCell>{getPaymentStatusBadge(participation.payment_status)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(participation.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {participation.status === 'pending' && (
                      <>
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
                      </>
                    )}
                    {participation.status === 'validated' && (
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
                    {participation.status === 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReactivateParticipation(participation.id, 'pending')}
                        disabled={isUpdating[participation.id]}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Réactiver
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (participations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 border rounded-md bg-white">
        <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">Aucun participant pour le moment.</p>
        <p className="text-sm text-gray-500 mt-1">Les demandes de participation apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{participations.length}</p>
              <p className="text-xs text-blue-600 mt-1">{totalQuantity} unités</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">En attente</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingParticipations.length}</p>
              <p className="text-xs text-yellow-600 mt-1">
                {pendingParticipations.reduce((sum, p) => sum + (p.quantity || 0), 0)} unités
              </p>
            </div>
            <Hourglass className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Validées</p>
              <p className="text-2xl font-bold text-green-900">{validatedParticipations.length}</p>
              <p className="text-xs text-green-600 mt-1">{validatedQuantity} unités</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Annulées</p>
              <p className="text-2xl font-bold text-red-900">{cancelledParticipations.length}</p>
              <p className="text-xs text-red-600 mt-1">
                {cancelledParticipations.reduce((sum, p) => sum + (p.quantity || 0), 0)} unités
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Onglets pour filtrer les participations */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Toutes ({participations.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Hourglass className="h-4 w-4" />
            En attente ({pendingParticipations.length})
          </TabsTrigger>
          <TabsTrigger value="validated" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Validées ({validatedParticipations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Annulées ({cancelledParticipations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderParticipationsTable(participations)}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {renderParticipationsTable(pendingParticipations)}
        </TabsContent>

        <TabsContent value="validated" className="mt-4">
          {renderParticipationsTable(validatedParticipations)}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4">
          {renderParticipationsTable(cancelledParticipations)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OfferParticipantsList;

