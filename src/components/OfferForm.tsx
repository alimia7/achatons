
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface Offer {
  id: string;
  name: string;
  description: string;
  original_price: number;
  group_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  status: string;
  supplier: string;
  category_id?: string;
  unit_of_measure?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface OfferFormProps {
  offer?: Offer | null;
  onSaved: () => void;
  onCancel: () => void;
}

const OfferForm = ({ offer, onSaved, onCancel }: OfferFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    group_price: '',
    target_participants: '',
    deadline: '',
    status: 'active',
    supplier: '',
    category_id: '',
    unit_of_measure: 'pièces',
  });

  useEffect(() => {
    fetchCategories();
    if (offer) {
      setFormData({
        name: offer.name,
        description: offer.description || '',
        original_price: offer.original_price.toString(),
        group_price: offer.group_price.toString(),
        target_participants: offer.target_participants.toString(),
        deadline: offer.deadline,
        status: offer.status,
        supplier: offer.supplier || '',
        category_id: offer.category_id || '',
        unit_of_measure: offer.unit_of_measure || 'pièces',
      });
    }
  }, [offer]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          toast({
            title: "Erreur",
            description: "Erreur lors du téléchargement de l'image.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const dataToSave = {
        name: formData.name,
        description: formData.description,
        original_price: parseInt(formData.original_price),
        group_price: parseInt(formData.group_price),
        target_participants: parseInt(formData.target_participants),
        deadline: formData.deadline,
        status: formData.status,
        supplier: formData.supplier,
        category_id: formData.category_id || null,
        unit_of_measure: formData.unit_of_measure,
        updated_at: new Date().toISOString(),
        ...(imageUrl && { image_url: imageUrl }),
      };

      let error;
      
      if (offer) {
        // Update existing offer
        const result = await supabase
          .from('offers')
          .update(dataToSave)
          .eq('id', offer.id);
        error = result.error;
      } else {
        // Create new offer
        const result = await supabase
          .from('offers')
          .insert([dataToSave]);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Succès",
        description: offer ? "L'offre a été mise à jour avec succès." : "L'offre a été créée avec succès.",
      });

      onSaved();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du produit *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="Ex: Riz brisé parfumé 50kg"
          />
        </div>
        <div>
          <Label htmlFor="supplier">Fournisseur</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => handleInputChange('supplier', e.target.value)}
            placeholder="Ex: Coopérative du Delta"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Description détaillée du produit..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">Image du produit</Label>
        <div className="mt-2">
          {imagePreview ? (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Aperçu" 
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
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-sm text-gray-600">
                    Cliquez pour télécharger une image
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="original_price">Prix unitaire (FCFA) *</Label>
          <Input
            id="original_price"
            type="number"
            value={formData.original_price}
            onChange={(e) => handleInputChange('original_price', e.target.value)}
            required
            placeholder="35000"
          />
        </div>
        <div>
          <Label htmlFor="group_price">Prix groupé (FCFA) *</Label>
          <Input
            id="group_price"
            type="number"
            value={formData.group_price}
            onChange={(e) => handleInputChange('group_price', e.target.value)}
            required
            placeholder="25000"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="target_participants">Participants cibles *</Label>
          <Input
            id="target_participants"
            type="number"
            value={formData.target_participants}
            onChange={(e) => handleInputChange('target_participants', e.target.value)}
            required
            placeholder="100"
          />
        </div>
        <div>
          <Label htmlFor="unit_of_measure">Unité de mesure</Label>
          <Select value={formData.unit_of_measure} onValueChange={(value) => handleInputChange('unit_of_measure', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pièces">Pièces</SelectItem>
              <SelectItem value="kg">Kilogrammes</SelectItem>
              <SelectItem value="litres">Litres</SelectItem>
              <SelectItem value="tonnes">Tonnes</SelectItem>
              <SelectItem value="sacs">Sacs</SelectItem>
              <SelectItem value="cartons">Cartons</SelectItem>
              <SelectItem value="unités">Unités</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="deadline">Date limite *</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="paused">En pause</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="bg-achatons-orange hover:bg-achatons-brown"
          disabled={loading}
        >
          {loading ? "Sauvegarde..." : (offer ? "Mettre à jour" : "Créer l'offre")}
        </Button>
      </div>
    </form>
  );
};

export default OfferForm;
