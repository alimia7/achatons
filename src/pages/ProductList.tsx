import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactModal from "@/components/ContactModal";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ProposeProductSection from "@/components/ProposeProductSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { retrySupabaseRequest } from "@/lib/supabase-health";

interface DatabaseProduct {
  id: string;
  name: string;
  description: string;
  original_price: number;
  group_price: number;
  savings?: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  image_url?: string;
  supplier: string;
  status: string;
  category_id?: string;
  unit_of_measure?: string;
  categories?: {
    name: string;
  };
}

interface Product {
  id: number;
  originalId: string;
  name: string;
  description: string;
  originalPrice: number;
  groupPrice: number;
  savings: number;
  currentParticipants: number;
  targetParticipants: number;
  deadline: string;
  image: string;
  supplier: string;
  category?: string;
  unitOfMeasure?: string;
}

interface Category {
  id: string;
  name: string;
}

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    // Attendre que l'authentification soit prête avant de charger les données
    if (!authLoading) {
      // Petit délai pour s'assurer que Supabase est complètement initialisé
      const timer = setTimeout(() => {
        fetchProducts();
        fetchCategories();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      
      const data = await retrySupabaseRequest(async () => {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        return data;
      });
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      
      // En cas d'échec définitif, utiliser des catégories par défaut
      console.warn('Utilisation des catégories par défaut');
      setCategories([
        { id: 'all', name: 'Toutes les catégories' }
      ]);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      
      const data = await retrySupabaseRequest(async () => {
        const { data, error } = await supabase
          .from('offers')
          .select(`
            *,
            categories (name)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      });

      console.log('Products fetched:', data?.length);
      const transformedProducts = (data || []).map((dbProduct: DatabaseProduct) => ({
        id: parseInt(dbProduct.id.replace(/-/g, '').substring(0, 8), 16),
        originalId: dbProduct.id,
        name: dbProduct.name,
        description: dbProduct.description || '',
        originalPrice: dbProduct.original_price,
        groupPrice: dbProduct.group_price,
        savings: Math.round(((dbProduct.original_price - dbProduct.group_price) / dbProduct.original_price) * 100),
        currentParticipants: dbProduct.current_participants || 0,
        targetParticipants: dbProduct.target_participants,
        deadline: dbProduct.deadline,
        image: dbProduct.image_url || "/placeholder.svg",
        supplier: dbProduct.supplier || 'Fournisseur non spécifié',
        category: dbProduct.categories?.name,
        unitOfMeasure: dbProduct.unit_of_measure || 'pièces'
      }));

      setProducts(transformedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      
      toast({
        title: "Erreur de connexion",
        description: "Impossible de charger les offres après plusieurs tentatives. Veuillez rafraîchir la page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    if (product) {
      setSelectedProduct(product.originalId);
      setIsContactModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsContactModalOpen(false);
    setSelectedProduct(null);
  };

  const handleParticipationSuccess = () => {
    // Refresh products to show updated participant counts
    fetchProducts();
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        const category = categories.find(cat => cat.name === product.category);
        return category?.id === selectedCategory;
      });

  if (loading || authLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-achatons-cream to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-achatons-brown mb-4">
            Offres du moment
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Découvrez nos achats groupés en cours et bénéficiez de prix exceptionnels 
            en vous joignant à d'autres consommateurs.
          </p>

          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState selectedCategory={selectedCategory} />
        ) : (
          <ProductGrid
            products={filteredProducts}
            onJoinGroup={handleJoinGroup}
          />
        )}

        <ProposeProductSection categories={categories} />
      </main>

      <Footer />
      <WhatsAppButton />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={handleCloseModal}
        productId={selectedProduct}
        onSuccess={handleParticipationSuccess}
      />
    </div>
  );
};

export default ProductList;
