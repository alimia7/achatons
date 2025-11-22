import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Lock } from 'lucide-react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SellerProfileTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    responsible_name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    activity_category: '',
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
    
    try {
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setFormData({
          company_name: data.company_name || '',
          responsible_name: data.responsible_name || '',
          phone: data.phone || '',
          email: data.email || user.email || '',
          address: data.address || '',
          description: data.description || '',
          activity_category: data.activity_category || '',
        });
        if (data.logo_url) {
          setImagePreview(data.logo_url);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 2 Mo.",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.uid}_${Math.random()}.${fileExt}`;
      const filePath = `seller-logos/${fileName}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      let logoUrl = imagePreview || null;
      
      if (imageFile) {
        logoUrl = await uploadImage(imageFile);
        if (!logoUrl) {
          toast({
            title: "Erreur",
            description: "Erreur lors du téléchargement de l'image.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        ...formData,
        ...(logoUrl && { logo_url: logoUrl }),
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour.",
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
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, passwordData.newPassword);
      
      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès.",
      });
      
      setShowPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors du changement de mot de passe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold text-achatons-brown">Mon profil vendeur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <Label htmlFor="logo">Photo/Logo du vendeur (JPG/PNG, max 2Mo)</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Logo" 
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <span className="text-sm text-gray-600">
                          Cliquez pour télécharger une image
                        </span>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Nom du vendeur / entreprise *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  required
                  placeholder="Ex: Coopérative du Delta"
                />
              </div>
              <div>
                <Label htmlFor="responsible_name">Nom du responsable *</Label>
                <Input
                  id="responsible_name"
                  value={formData.responsible_name}
                  onChange={(e) => handleInputChange('responsible_name', e.target.value)}
                  required
                  placeholder="Ex: Jean Dupont"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Téléphone professionnel *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  placeholder="+221 77 123 45 67"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Adresse complète..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="description">Description du vendeur</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description de votre activité..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="activity_category">Catégorie d'activité</Label>
              <Input
                id="activity_category"
                value={formData.activity_category}
                onChange={(e) => handleInputChange('activity_category', e.target.value)}
                placeholder="Ex: Agroalimentaire, Produits frais, etc."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowPasswordDialog(true)}
              >
                <Lock className="h-4 w-4 mr-2" />
                Changer mot de passe
              </Button>
              <Button 
                type="submit" 
                className="bg-achatons-orange hover:bg-achatons-brown"
                disabled={loading}
              >
                {loading ? "Mise à jour..." : "Mettre à jour le profil"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-achatons-brown">Changer le mot de passe</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
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
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-achatons-orange hover:bg-achatons-brown"
                disabled={loading}
              >
                {loading ? "Changement..." : "Changer le mot de passe"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerProfileTab;

