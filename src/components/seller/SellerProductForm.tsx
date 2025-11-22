import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { SellerProduct } from './hooks/useSellerProducts';

interface Category {
  id: string;
  name: string;
}

interface SellerProductFormProps {
  product?: SellerProduct | null;
  onSaved: (productData: any) => void;
  onCancel: () => void;
}

const SellerProductForm = ({ product, onSaved, onCancel }: SellerProductFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    base_price: '',
    unit_of_measure: 'pièces',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category_id: product.category_id || '',
        base_price: product.base_price.toString(),
        unit_of_measure: product.unit_of_measure || 'pièces',
        status: product.status,
      });
      if (product.image_url) {
        setImagePreview(product.image_url);
      }
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snap = await getDocs(q);
      const list: Category[] = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
      }));
      setCategories(list);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = product?.image_url || null;
      
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

      const productData = {
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id || null,
        base_price: parseFloat(formData.base_price),
        unit_of_measure: formData.unit_of_measure,
        status: formData.status,
        ...(imageUrl && { image_url: imageUrl }),
      };

      onSaved(productData);
    } catch (error) {
      console.error('Error saving product:', error);
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
        <Label htmlFor="image">Image du produit (JPG/PNG, max 2Mo)</Label>
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
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 2MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="base_price">Prix de base (FCFA) *</Label>
          <Input
            id="base_price"
            type="number"
            value={formData.base_price}
            onChange={(e) => handleInputChange('base_price', e.target.value)}
            required
            placeholder="35000"
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
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
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
          {loading ? "Sauvegarde..." : (product ? "Mettre à jour" : "Enregistrer")}
        </Button>
      </div>
    </form>
  );
};

export default SellerProductForm;

