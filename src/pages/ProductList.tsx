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
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const list = snap.docs.map((d) => {
        const data = d.data() as any;
        return { id: d.id, name: data.name as string };
      });
      setCategories(list);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      // Filter offers by status 'active' to match Firestore rules
      const offersQuery = query(
        collection(db, 'offers'),
        where('status', '==', 'active')
      );
      const [offersSnap, categoriesSnap] = await Promise.all([
        getDocs(offersQuery),
        getDocs(collection(db, 'categories')),
      ]);
      const categoryMap = new Map<string, string>();
      categoriesSnap.forEach((d) => {
        const data = d.data() as any;
        categoryMap.set(d.id, data.name || '');
      });
      const transformedProducts = offersSnap.docs
        .map((docSnap) => {
          const dbProduct = docSnap.data() as any;
          // All offers from query are already active, no need to filter
          const numericId = parseInt(
            [...docSnap.id]
              .map((c) => c.charCodeAt(0).toString(16))
              .join('')
              .substring(0, 8),
            16
          );
          return {
            id: numericId,
            originalId: docSnap.id,
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
            category: dbProduct.category_id ? categoryMap.get(dbProduct.category_id) : undefined,
            unitOfMeasure: dbProduct.unit_of_measure || 'pièces'
          } as Product;
        })
        .filter(Boolean) as Product[];

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les offres.",
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

  if (loading) {
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
