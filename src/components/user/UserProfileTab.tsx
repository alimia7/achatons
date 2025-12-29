import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Lock, Mail, Phone, MapPin } from 'lucide-react';
import LoadingState from '@/components/LoadingState';

const UserProfileTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.uid) return;
    
    setProfileLoading(true);
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setFormData({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } else {
        // If profile doesn't exist, initialize with user email
        setFormData({
          full_name: '',
          email: user.email || '',
          phone: '',
          address: '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil.",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Succès",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      let errorMessage = "Une erreur s'est produite lors de la mise à jour.";
      if (error?.code === 'permission-denied') {
        errorMessage = "Vous n'avez pas l'autorisation de mettre à jour ce profil.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordData.newPassword);

      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès.",
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordDialog(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      let errorMessage = "Une erreur s'est produite lors du changement de mot de passe.";
      if (error?.code === 'auth/wrong-password') {
        errorMessage = "Le mot de passe actuel est incorrect.";
      } else if (error?.code === 'auth/weak-password') {
        errorMessage = "Le nouveau mot de passe est trop faible.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold text-achatons-brown flex items-center gap-2">
            <User className="h-6 w-6" />
            Mes informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <Label htmlFor="full_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nom complet *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                required
                placeholder="Ex: Jean Dupont"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="exemple@email.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+221 77 123 45 67"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Votre adresse complète"
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordDialog(true)}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Changer le mot de passe
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-achatons-orange hover:bg-achatons-brown"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Changer le mot de passe
            </DialogTitle>
            <DialogDescription>
              Pour des raisons de sécurité, vous devez saisir votre mot de passe actuel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe *</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                minLength={6}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                minLength={6}
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-achatons-orange hover:bg-achatons-brown"
              >
                {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfileTab;



