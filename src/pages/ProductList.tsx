import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactModal from "@/components/ContactModal";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Search, X } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState<string>('');
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
      
      // Transform offers to products, handling both direct offers and product_id references
      const transformedProducts: Product[] = [];
      
      for (const docSnap of offersSnap.docs) {
        const dbOffer = docSnap.data() as any;
        
        // Skip offers that haven't started yet (start_date in the future)
        if (dbOffer.start_date) {
          const startDate = new Date(dbOffer.start_date);
          const now = new Date();
          // If start_date is in the future, skip this offer
          if (startDate > now) {
            continue;
          }
        }
        
        // Check if this offer references a product (seller offers)
        let productData = dbOffer;
        if (dbOffer.product_id) {
          try {
            // Fetch the referenced product
            const productDoc = await getDoc(doc(db, 'products', dbOffer.product_id));
            if (productDoc.exists()) {
              const productInfo = productDoc.data();
              // Merge offer data with product data
              productData = {
                ...productInfo,
                // Override with offer-specific data
                group_price: dbOffer.group_price,
                target_participants: dbOffer.target_participants,
                deadline: dbOffer.deadline,
                current_participants: dbOffer.current_participants || 0,
                // Use product's original_price (base_price) or offer's original_price
                original_price: dbOffer.original_price || productInfo.base_price || productInfo.original_price,
                // Preserve category_id from product (or offer if not in product)
                category_id: productInfo.category_id || dbOffer.category_id,
              };
            }
          } catch (error) {
            console.error(`Error fetching product ${dbOffer.product_id}:`, error);
            // Continue with offer data only if product fetch fails
          }
        }
        
        // Fetch seller information if seller_id exists
        let sellerLogo = null;
        let sellerName = null;
        if (dbOffer.seller_id) {
          try {
            const sellerProfileDoc = await getDoc(doc(db, 'profiles', dbOffer.seller_id));
            if (sellerProfileDoc.exists()) {
              const sellerData = sellerProfileDoc.data();
              sellerLogo = sellerData.logo_url || null;
              sellerName = sellerData.company_name || sellerData.responsible_name || null;
            }
          } catch (error) {
            console.error(`Error fetching seller profile ${dbOffer.seller_id}:`, error);
          }
        }
        
        // Ensure we have required fields with defaults
        const originalPrice = productData.original_price || productData.base_price || 0;
        const groupPrice = productData.group_price || 0;
        const targetParticipants = productData.target_participants || 0;
        const currentParticipants = productData.current_participants || 0;
        
        // Calculate savings safely
        let savings = 0;
        if (originalPrice > 0 && groupPrice > 0 && originalPrice > groupPrice) {
          savings = Math.round(((originalPrice - groupPrice) / originalPrice) * 100);
        }
        
        const numericId = parseInt(
          [...docSnap.id]
            .map((c) => c.charCodeAt(0).toString(16))
            .join('')
            .substring(0, 8),
          16
        );
        
        transformedProducts.push({
          id: numericId,
          originalId: docSnap.id,
          name: productData.name || 'Produit sans nom',
          description: productData.description || '',
          originalPrice: originalPrice,
          groupPrice: groupPrice,
          savings: savings,
          currentParticipants: currentParticipants,
          targetParticipants: targetParticipants,
          deadline: productData.deadline || new Date().toISOString(),
          image: productData.image_url || productData.image || "/placeholder.svg",
          supplier: productData.supplier || 'Fournisseur non spécifié',
          category: productData.category_id ? (categoryMap.get(productData.category_id) || productData.category_id) : undefined,
          unitOfMeasure: productData.unit_of_measure || 'pièces',
          sellerLogo: sellerLogo,
          sellerName: sellerName
        } as Product);
      }

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

        {filteredProducts.length === 0 ? (
          <EmptyState selectedCategory={selectedCategory} searchTerm={searchTerm} />
        ) : (
          <ProductGrid
            products={filteredProducts}
            onJoinGroup={handleJoinGroup}
          />
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
