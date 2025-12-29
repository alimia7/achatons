import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, updateDoc, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, X, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoriesTab = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setFetchLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snap = await getDocs(q);
      const list: Category[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: data.name,
          description: data.description || '',
        };
      });
      setCategories(list);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories.",
        variant: "destructive",
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        // Update existing category
        await updateDoc(doc(db, 'categories', editingCategory.id), {
          name: formData.name,
          description: formData.description,
          updated_at: new Date().toISOString(),
        });

        toast({
          title: "Succès",
          description: "La catégorie a été mise à jour avec succès.",
        });
      } else {
        // Create new category
        await addDoc(collection(db, 'categories'), {
          name: formData.name,
          description: formData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        toast({
          title: "Succès",
          description: "La catégorie a été créée avec succès.",
        });
      }

      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      let errorMessage = "Une erreur s'est produite lors de la sauvegarde.";
      if (error?.code === 'permission-denied') {
        errorMessage = "Vous n'avez pas l'autorisation de modifier les catégories.";
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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      toast({
        title: "Succès",
        description: "La catégorie a été supprimée avec succès.",
      });
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      let errorMessage = "Une erreur s'est produite lors de la suppression.";
      if (error?.code === 'permission-denied') {
        errorMessage = "Vous n'avez pas l'autorisation de supprimer les catégories.";
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (fetchLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des catégories...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-achatons-brown flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Gestion des catégories
          </CardTitle>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-achatons-orange hover:bg-achatons-brown"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une catégorie
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-16 text-gray-600 border rounded-md bg-white">
              <Tag className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">Aucune catégorie pour le moment.</p>
              <p className="text-sm text-gray-500 mt-2">
                Créez votre première catégorie pour commencer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-gray-600">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Category Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Nom de la catégorie *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Ex: Électronique"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la catégorie"
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-achatons-orange hover:bg-achatons-brown"
              >
                {loading ? 'Enregistrement...' : editingCategory ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesTab;



