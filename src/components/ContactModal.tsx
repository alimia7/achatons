
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Clock } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onSuccess: () => void;
}

const ContactModal = ({ isOpen, onClose, productId, onSuccess }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    quantity: "1",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    setIsSubmitting(true);

    try {
      // Insérer la participation avec le statut "pending" par défaut
      const { error } = await supabase
        .from('participations')
        .insert([
          {
            offer_id: productId,
            user_name: formData.name,
            user_phone: formData.phone,
            user_email: formData.email || null,
            user_address: formData.address,
            quantity: parseInt(formData.quantity),
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Demande enregistrée!",
        description: "Votre demande de participation a été enregistrée et sera examinée par notre équipe.",
      });

      // Afficher le message de confirmation
      setShowConfirmation(true);
      onSuccess();
    } catch (error) {
      console.error('Error submitting participation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de votre demande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    // Réinitialiser le formulaire
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      quantity: "1",
      message: "",
    });
    onClose();
  };

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseConfirmation}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-achatons-orange">
              🎉 Demande enregistrée !
            </DialogTitle>
            <DialogDescription className="text-center">
              Votre demande de participation à l'achat groupé a été enregistrée avec succès.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">En attente de validation</h3>
              </div>
              <p className="text-sm text-yellow-700">
                Votre demande est actuellement en cours d'examen par notre équipe. 
                Nous vous contacterons dès qu'elle sera validée.
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-700 mb-4">
                Vous recevrez une confirmation par téléphone ou email une fois votre participation validée.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-achatons-brown text-center">
                Besoin d'aide ? Contactez-nous
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href="tel:+221782189429" 
                  className="flex items-center justify-center space-x-2 p-3 bg-achatons-cream rounded-lg hover:bg-achatons-orange hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>+221 78 218 94 29</span>
                </a>
                
                <a 
                  href="mailto:contact@achatons.sn" 
                  className="flex items-center justify-center space-x-2 p-3 bg-achatons-cream rounded-lg hover:bg-achatons-orange hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>contact@achatons.sn</span>
                </a>
                
                <div className="flex items-center justify-center space-x-2 p-3 bg-achatons-cream rounded-lg">
                  <MapPin className="h-4 w-4" />
                  <span>Dakar, Sénégal</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-achatons-brown text-center">
                Suivez-nous sur les réseaux sociaux
              </h3>
              
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://facebook.com/achatons" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                
                <a 
                  href="https://instagram.com/achatons" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                
                <a 
                  href="https://linkedin.com/company/achatons" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                Pour plus d'informations sur nos conditions d'utilisation et notre politique de confidentialité, 
                visitez notre{" "}
                <a href="/legal" className="text-achatons-orange hover:underline">
                  page légale
                </a>
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleCloseConfirmation}
              className="bg-achatons-orange hover:bg-achatons-brown"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rejoindre l'achat groupé</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour faire une demande de participation à cet achat groupé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              placeholder="+221 XX XXX XX XX"
            />
          </div>

          <div>
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse de livraison *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              placeholder="Votre adresse complète de livraison"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantité *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Commentaires ou questions..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Votre demande sera examinée par notre équipe avant validation. 
              Vous serez contacté une fois votre participation confirmée.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-achatons-orange hover:bg-achatons-brown"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
