import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Store, Mail, Phone, MapPin, FileText, Building2 } from 'lucide-react';
import LoadingState from '@/components/LoadingState';

const BecomeSeller = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    responsible_name: '',
    phone: '',
    email: '',
    address: '',
    activity_category: '',
    description: '',
  });

  if (authLoading) {
    return (
      <>
        <Header />
        <LoadingState />
        <Footer />
      </>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setLoading(true);
    try {
      // Check if user already has a pending request
      const existingRequestQuery = query(
        collection(db, 'seller_requests'),
        where('user_id', '==', user.uid),
        where('status', '==', 'pending')
      );
      const existingSnap = await getDocs(existingRequestQuery);
      if (!existingSnap.empty) {
        toast({
          title: "Demande déjà en cours",
          description: "Vous avez déjà une demande en attente de traitement.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create or update seller request
      const requestData = {
        user_id: user.uid,
        user_email: user.email || formData.email,
        company_name: formData.company_name,
        responsible_name: formData.responsible_name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        activity_category: formData.activity_category,
        description: formData.description,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await addDoc(collection(db, 'seller_requests'), requestData);

      toast({
        title: "Demande soumise",
        description: "Votre demande pour devenir vendeur a été soumise avec succès. Un administrateur va l'examiner sous peu.",
      });

      // Reset form
      setFormData({
        company_name: '',
        responsible_name: '',
        phone: '',
        email: '',
        address: '',
        activity_category: '',
        description: '',
      });

      // Navigate to user dashboard
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting seller request:', error);
      let errorMessage = "Une erreur s'est produite lors de la soumission de votre demande.";
      if (error?.code === 'permission-denied') {
        errorMessage = "Vous n'avez pas l'autorisation de soumettre cette demande.";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-achatons-cream to-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <Store className="h-12 w-12 text-achatons-orange mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-achatons-brown mb-2">Devenir vendeur</h1>
            <p className="text-gray-600">
              Remplissez le formulaire ci-dessous pour demander à devenir vendeur sur Achat'ons
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-achatons-brown">
                Formulaire de demande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Nom de l'entreprise / Vendeur *
                    </Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      required
                      placeholder="Ex: Coopérative du Delta"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsible_name" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Nom du responsable *
                    </Label>
                    <Input
                      id="responsible_name"
                      value={formData.responsible_name}
                      onChange={(e) => handleInputChange('responsible_name', e.target.value)}
                      required
                      placeholder="Ex: Jean Dupont"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone professionnel *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      placeholder="+221 77 123 45 67"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email professionnel *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="contact@entreprise.com"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse complète *
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                    placeholder="Votre adresse complète"
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="activity_category">Catégorie d'activité *</Label>
                  <Input
                    id="activity_category"
                    value={formData.activity_category}
                    onChange={(e) => handleInputChange('activity_category', e.target.value)}
                    required
                    placeholder="Ex: Agriculture, Électronique, Textile..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description de l'activité *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    placeholder="Décrivez votre activité, vos produits, votre expérience..."
                    className="mt-2"
                    rows={5}
                  />
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/user-dashboard')}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-achatons-orange hover:bg-achatons-brown"
                  >
                    {loading ? 'Envoi en cours...' : 'Soumettre la demande'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeSeller;

