import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface ProposeProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const ProposeProductModal = ({ isOpen, onClose, categories }: ProposeProductModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    group_price: '',
    target_participants: '',
    deadline: '',
    supplier: '',
    category_id: '',
    unit_of_measure: 'pièces',
  });

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
      const filePath = `product-images/${fileName}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
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
        status: 'pending',
        supplier: formData.supplier,
        category_id: formData.category_id || null,
        unit_of_measure: formData.unit_of_measure,
        created_by_admin: false,
        ...(imageUrl && { image_url: imageUrl }),
      };

      await addDoc(collection(db, 'offers'), {
        ...dataToSave,
        created_at: new Date().toISOString(),
        created_by_admin: false,
      });

      toast({
        title: "Succès",
        description: "Votre proposition de produit a été soumise avec succès et est en attente de validation.",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        original_price: '',
        group_price: '',
        target_participants: '',
        deadline: '',
        supplier: '',
        category_id: '',
        unit_of_measure: 'pièces',
      });
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la soumission.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proposer un produit</DialogTitle>
        </DialogHeader>
        
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
            <div className="col-span-2">
              <Label htmlFor="deadline">Date limite *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-achatons-orange hover:bg-achatons-brown"
              disabled={loading}
            >
              {loading ? "Soumission..." : "Proposer le produit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeProductModal;
