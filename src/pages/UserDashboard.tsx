import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserParticipations, UserParticipation } from '@/components/user/hooks/useUserParticipations';
import UserProfileTab from '@/components/user/UserProfileTab';
import { Clock, Check, X, Eye, Package, Calendar, DollarSign, Users, User } from 'lucide-react';
import LoadingState from '@/components/LoadingState';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { participations, loading, refreshParticipations } = useUserParticipations();
  const [selectedParticipation, setSelectedParticipation] = useState<UserParticipation | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <LoadingState />
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case 'validated':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Validée
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Annulée
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    if (!paymentStatus) return <Badge variant="outline" className="bg-gray-50 text-gray-700">Non défini</Badge>;
    
    switch (paymentStatus) {
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Payé
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Remboursé
          </Badge>
        );
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.round(price)) + ' FCFA';
  };

  const calculateSavings = (participation: UserParticipation) => {
    if (!participation.original_price || !participation.group_price) return 0;
    if (participation.original_price <= participation.group_price) return 0;
    return (participation.original_price - participation.group_price) * participation.quantity;
  };

  const pendingCount = participations.filter(p => p.status === 'pending').length;
  const validatedCount = participations.filter(p => p.status === 'validated').length;
  const cancelledCount = participations.filter(p => p.status === 'cancelled').length;
  const totalSpent = participations
    .filter(p => p.status === 'validated')
    .reduce((sum, p) => sum + p.total_amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-achatons-cream to-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-achatons-brown mb-2">Mon espace</h1>
          <p className="text-gray-600">Gérez vos informations et suivez l'historique de vos participations</p>
        </div>

        <Tabs defaultValue="participations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="participations" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Mes participations
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Mes informations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participations" className="space-y-6">
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total participations</p>
                  <p className="text-2xl font-bold text-achatons-brown">{participations.length}</p>
                </div>
                <Package className="h-8 w-8 text-achatons-orange" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Validées</p>
                  <p className="text-2xl font-bold text-green-600">{validatedCount}</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total dépensé</p>
                  <p className="text-2xl font-bold text-achatons-orange">{formatPrice(totalSpent)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-achatons-orange" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-achatons-brown">Historique des participations</CardTitle>
          </CardHeader>
          <CardContent>
            {participations.length === 0 ? (
              <div className="text-center py-16 text-gray-600 border rounded-md bg-white">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium">Aucune participation pour le moment.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Rejoignez des offres groupées pour voir votre historique ici.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offre</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participations.map((participation) => (
                      <TableRow key={participation.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {participation.offer_image ? (
                              <img
                                src={participation.offer_image}
                                alt={participation.offer_name}
                                className="h-12 w-12 object-cover rounded-md"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-achatons-brown">{participation.offer_name}</p>
                              {participation.seller_name && (
                                <p className="text-xs text-gray-500">{participation.seller_name}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{participation.quantity}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-achatons-orange">{formatPrice(participation.total_amount)}</p>
                            {participation.original_price && participation.original_price > participation.group_price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(participation.original_price * participation.quantity)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(participation.status)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(participation.payment_status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(participation.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedParticipation(participation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Participation Details Modal */}
        {selectedParticipation && (
          <Dialog open={!!selectedParticipation} onOpenChange={() => setSelectedParticipation(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-achatons-brown">
                  Détails de la participation
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Offer Info */}
                <div className="bg-gradient-to-br from-achatons-cream to-white rounded-lg p-6 border border-achatons-brown/10">
                  <div className="flex items-start gap-4">
                    {selectedParticipation.offer_image ? (
                      <img
                        src={selectedParticipation.offer_image}
                        alt={selectedParticipation.offer_name}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-achatons-brown mb-2">
                        {selectedParticipation.offer_name}
                      </h3>
                      {selectedParticipation.seller_name && (
                        <div className="flex items-center gap-2 mb-2">
                          {selectedParticipation.seller_logo && (
                            <img
                              src={selectedParticipation.seller_logo}
                              alt={selectedParticipation.seller_name}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          )}
                          <span className="text-sm text-gray-600">Vendeur: {selectedParticipation.seller_name}</span>
                        </div>
                      )}
                      {selectedParticipation.deadline && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Date limite: {formatDate(selectedParticipation.deadline)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Participation Details */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Quantité commandée</p>
                      <p className="text-2xl font-bold text-achatons-brown">{selectedParticipation.quantity}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Prix unitaire</p>
                      <p className="text-2xl font-bold text-achatons-orange">
                        {formatPrice(selectedParticipation.group_price)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Montant total</p>
                      <p className="text-2xl font-bold text-achatons-orange">
                        {formatPrice(selectedParticipation.total_amount)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Économie réalisée</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(calculateSavings(selectedParticipation))}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Status Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-2">Statut de la participation</p>
                      {getStatusBadge(selectedParticipation.status)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-2">Statut du paiement</p>
                      {getPaymentStatusBadge(selectedParticipation.payment_status)}
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Info */}
                {selectedParticipation.target_participants && selectedParticipation.current_participants !== undefined && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">Progression de l'offre</p>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-semibold text-achatons-brown">
                            {selectedParticipation.current_participants} / {selectedParticipation.target_participants}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-achatons-orange h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (selectedParticipation.current_participants / selectedParticipation.target_participants) * 100)}%`
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-1">Date de participation</p>
                      <p className="font-semibold text-achatons-brown">
                        {formatDate(selectedParticipation.created_at)}
                      </p>
                    </CardContent>
                  </Card>
                  {selectedParticipation.updated_at && (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-sm text-gray-600 mb-1">Dernière mise à jour</p>
                        <p className="font-semibold text-achatons-brown">
                          {formatDate(selectedParticipation.updated_at)}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
          </TabsContent>

          <TabsContent value="profile">
            <UserProfileTab />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;

