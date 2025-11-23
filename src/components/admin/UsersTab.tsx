import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useUsers } from './hooks/useUsers';
import { useToast } from '@/hooks/use-toast';
import { Users as UsersIcon, Search, User, Shield, Store } from 'lucide-react';
import { useState } from 'react';
import LoadingState from '@/components/LoadingState';

const UsersTab = () => {
  const { users, loading, toggleSellerRole } = useUsers();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleSeller = async (userId: string, currentRole: string, userName: string) => {
    const isCurrentlySeller = currentRole === 'vendeur' || currentRole === 'seller';
    const action = isCurrentlySeller ? 'retirer' : 'accorder';

    if (!confirm(`Êtes-vous sûr de vouloir ${action} le droit vendeur à ${userName || 'cet utilisateur'} ?`)) {
      return;
    }

    try {
      await toggleSellerRole(userId, currentRole);
      toast({
        title: "Succès",
        description: `Le droit vendeur a été ${isCurrentlySeller ? 'retiré' : 'accordé'} avec succès.`,
      });
    } catch (error: any) {
      console.error('Error toggling seller role:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la modification.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case 'vendeur':
      case 'seller':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Store className="h-3 w-3 mr-1" />
            Vendeur
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <User className="h-3 w-3 mr-1" />
            Utilisateur
          </Badge>
        );
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchLower))
    );
  });

  const sellers = filteredUsers.filter(u => u.role === 'vendeur' || u.role === 'seller');
  const regularUsers = filteredUsers.filter(u => u.role === 'user');
  const admins = filteredUsers.filter(u => u.role === 'admin');

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-achatons-brown flex items-center gap-2">
            <UsersIcon className="h-6 w-6" />
            Gestion des utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par email ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total utilisateurs</p>
                    <p className="text-2xl font-bold text-achatons-brown">{filteredUsers.length}</p>
                  </div>
                  <UsersIcon className="h-8 w-8 text-achatons-orange" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vendeurs</p>
                    <p className="text-2xl font-bold text-blue-600">{sellers.length}</p>
                  </div>
                  <Store className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-600">{regularUsers.length}</p>
                  </div>
                  <User className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-gray-600 border rounded-md bg-white">
              <UsersIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead className="text-right">Droit vendeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const isSeller = user.role === 'vendeur' || user.role === 'seller';
                    const canToggle = user.role !== 'admin'; // Can't change admin role

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.full_name || '-'}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {canToggle ? (
                            <Switch
                              checked={isSeller}
                              onCheckedChange={() => handleToggleSeller(user.id, user.role, user.full_name || user.email)}
                            />
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;

