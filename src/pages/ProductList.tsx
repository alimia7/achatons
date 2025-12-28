import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactModal from "@/components/ContactModal";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useOffers } from "@/hooks/useOffers";
import { Search, X, Flame } from "lucide-react";

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
  sellerLogo?: string | null;
  sellerName?: string | null;

  // Tiered pricing fields
  pricing_model?: 'fixed' | 'tiered';
  base_price?: number;
  pricing_tiers?: any[];
  current_price?: number;
  current_tier?: number;
}

interface Category {
  id: string;
  name: string;
}

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

  // Use React Query hook for offers with caching
  const { offers: products, isLoading: loading, refetch } = useOffers();

  useEffect(() => {
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
    // Refetch offers to show updated participant counts and tier progress
    refetch();
  };

  // Calculate hot offers (close to next tier)
  const hotOffers = products.filter(product => {
    if (product.pricing_model !== 'tiered' || !product.pricing_tiers) return false;
    const nextTier = product.pricing_tiers.find(
      t => t.tier_number === (product.current_tier || 0) + 1
    );
    if (!nextTier) return false;
    const remaining = nextTier.min_participants - (product.totalQuantity || 0);
    return remaining <= 5 && remaining > 0; // Close to next tier
  });

  const filteredProducts = products.filter(product => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' 
      ? true
      : (() => {
          const category = categories.find(cat => cat.name === product.category);
          return category?.id === selectedCategory;
        })();
    
    // Filter by search term
    const searchMatch = searchTerm === '' || (() => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.supplier.toLowerCase().includes(searchLower) ||
        (product.category && product.category.toLowerCase().includes(searchLower)) ||
        (product.sellerName && product.sellerName.toLowerCase().includes(searchLower))
      );
    })();
    
    return categoryMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-achatons-cream to-white">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-achatons-brown mb-4">
              Offres du moment
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Chargement des offres...
            </p>
          </div>
          <ProductSkeletonGrid count={6} />
        </main>
        <Footer />
      </div>
    );
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

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un produit, fournisseur, vendeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          {/* Results count */}
          {(searchTerm || selectedCategory !== 'all') && filteredProducts.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} offre{filteredProducts.length > 1 ? 's' : ''} trouvée{filteredProducts.length > 1 ? 's' : ''}
                {searchTerm && ` pour "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <ProductSkeletonGrid count={6} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState selectedCategory={selectedCategory} searchTerm={searchTerm} />
        ) : (
          <>
            {/* Hot Offers Section */}
            {hotOffers.length > 0 && !searchTerm && selectedCategory === 'all' && (
              <section className="mb-12">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-achatons-brown mb-2 flex items-center justify-center gap-2">
                    <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
                    Offres chaudes
                    <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
                  </h2>
                  <p className="text-gray-600">
                    Ces offres sont proches du palier suivant ! Rejoignez maintenant pour débloquer de meilleurs prix.
                  </p>
                </div>
                <ProductGrid
                  products={hotOffers}
                  onJoinGroup={handleJoinGroup}
                />
                <div className="mt-8 border-t border-gray-200" />
              </section>
            )}

            {/* All Offers */}
            <ProductGrid
              products={filteredProducts}
              onJoinGroup={handleJoinGroup}
            />
          </>
        )}
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
