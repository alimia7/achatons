import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useSellerRequests, SellerRequest } from './hooks/useSellerRequests';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X, Eye, Clock, Store } from 'lucide-react';
import LoadingState from '@/components/LoadingState';

const SellerRequestsTable = () => {
  const { requests, loading, fetchRequests } = useSellerRequests();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [togglingRole, setTogglingRole] = useState<string | null>(null);

  const handleApprove = async (request: SellerRequest) => {
    if (!confirm(`Approuver la demande de ${request.company_name} ?`)) return;

    setProcessing(request.id);
    try {
      // Update request status
      await updateDoc(doc(db, 'seller_requests', request.id), {
        status: 'approved',
        updated_at: new Date().toISOString(),
      });

      // Update user profile to seller role
      await updateDoc(doc(db, 'profiles', request.user_id), {
        role: 'vendeur',
        company_name: request.company_name,
        responsible_name: request.responsible_name,
        phone: request.phone,
        email: request.email,
        address: request.address,
        activity_category: request.activity_category,
        description: request.description,
        updated_at: new Date().toISOString(),
      });

      // Update local state for user role
      setUserRoles(prev => ({
        ...prev,
        [request.user_id]: 'vendeur',
      }));

      toast({
        title: "Succès",
        description: "La demande a été approuvée. L'utilisateur est maintenant vendeur.",
      });

      await fetchRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'approbation.",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (request: SellerRequest) => {
    if (!confirm(`Rejeter la demande de ${request.company_name} ?`)) return;

    setProcessing(request.id);
    try {
      await updateDoc(doc(db, 'seller_requests', request.id), {
        status: 'rejected',
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Succès",
        description: "La demande a été rejetée.",
      });

      await fetchRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors du rejet.",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  // Fetch user roles for all requests
  useEffect(() => {
    const fetchUserRoles = async () => {
      const roles: Record<string, string> = {};
      for (const request of requests) {
        try {
          const profileRef = doc(db, 'profiles', request.user_id);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            roles[request.user_id] = data.role || 'user';
          } else {
            roles[request.user_id] = 'user';
          }
        } catch (error) {
          console.error(`Error fetching role for user ${request.user_id}:`, error);
          roles[request.user_id] = 'user';
        }
      }
      setUserRoles(roles);
    };

    if (requests.length > 0) {
      fetchUserRoles();
    }
  }, [requests]);

  const handleToggleSellerRole = async (userId: string, currentRole: string) => {
    const isCurrentlySeller = currentRole === 'vendeur' || currentRole === 'seller';
    const newRole = isCurrentlySeller ? 'user' : 'vendeur';

    setTogglingRole(userId);
    try {
      await updateDoc(doc(db, 'profiles', userId), {
        role: newRole,
        updated_at: new Date().toISOString(),
      });

      // Update local state
      setUserRoles(prev => ({
        ...prev,
        [userId]: newRole,
      }));

      toast({
        title: "Succès",
        description: `Le droit vendeur a été ${newRole === 'vendeur' ? 'activé' : 'désactivé'}.`,
      });
    } catch (error: any) {
      console.error('Error toggling seller role:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la modification du rôle.",
        variant: "destructive",
      });
    } finally {
      setTogglingRole(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Approuvée
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Rejetée
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const allRequests = requests;

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-achatons-brown flex items-center gap-2">
            <Store className="h-6 w-6" />
            Demandes de vendeur
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingRequests.length} en attente
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allRequests.length === 0 ? (
            <div className="text-center py-16 text-gray-600 border rounded-md bg-white">
              <Store className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">Aucune demande de vendeur pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Droit vendeur</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.company_name}</TableCell>
                      <TableCell>{request.responsible_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{request.phone}</p>
                          <p className="text-gray-500">{request.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(request.created_at)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={userRoles[request.user_id] === 'vendeur' || userRoles[request.user_id] === 'seller'}
                            onCheckedChange={() => {
                              const currentRole = userRoles[request.user_id] || 'user';
                              handleToggleSellerRole(request.user_id, currentRole);
                            }}
                            disabled={togglingRole === request.user_id}
                          />
                          <span className="text-sm text-gray-600">
                            {userRoles[request.user_id] === 'vendeur' || userRoles[request.user_id] === 'seller' 
                              ? 'Actif' 
                              : 'Inactif'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(request)}
                                disabled={processing === request.id}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(request)}
                                disabled={processing === request.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Rejeter
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-achatons-brown">
                Détails de la demande
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Entreprise</p>
                    <p className="font-semibold text-achatons-brown">{selectedRequest.company_name}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Responsable</p>
                    <p className="font-semibold text-achatons-brown">{selectedRequest.responsible_name}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                    <p className="font-semibold text-achatons-brown">{selectedRequest.phone}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-achatons-brown">{selectedRequest.email}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-1">Adresse</p>
                  <p className="font-semibold text-achatons-brown">{selectedRequest.address}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-1">Catégorie d'activité</p>
                  <p className="font-semibold text-achatons-brown">{selectedRequest.activity_category}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedRequest.description}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Date de demande</p>
                    <p className="font-semibold text-achatons-brown">
                      {formatDate(selectedRequest.created_at)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-1">Statut</p>
                    {getStatusBadge(selectedRequest.status)}
                  </CardContent>
                </Card>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest)}
                    disabled={processing === selectedRequest.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rejeter
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedRequest)}
                    disabled={processing === selectedRequest.id}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approuver
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SellerRequestsTable;

