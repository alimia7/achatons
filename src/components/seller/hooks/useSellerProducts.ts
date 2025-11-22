import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SellerProduct {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category_id: string;
  base_price: number;
  unit_of_measure: string;
  status: 'active' | 'inactive';
  seller_id: string;
  created_at: string;
  updated_at: string;
}

export const useSellerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // First try with orderBy, if it fails (missing index), fetch without orderBy
      let snap;
      try {
        const q = query(
          collection(db, 'products'),
          where('seller_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        snap = await getDocs(q);
      } catch (error: any) {
        // If index error, fetch without orderBy and sort client-side
        console.warn('Index missing, fetching without orderBy:', error);
        const q = query(
          collection(db, 'products'),
          where('seller_id', '==', user.uid)
        );
        snap = await getDocs(q);
      }
      
      const list: SellerProduct[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...(data as Omit<SellerProduct, 'id'>),
        };
      });
      
      console.log(`Fetched ${list.length} products for seller ${user.uid}`);
      if (list.length > 0) {
        console.log('Sample product:', list[0]);
      }
      
      // Sort by created_at if we fetched without orderBy
      if (list.length > 0 && !list[0].created_at) {
        // If created_at is missing, add it
        list.forEach(p => {
          if (!p.created_at) {
            p.created_at = new Date().toISOString();
          }
        });
      }
      
      // Sort by created_at descending (client-side if needed)
      list.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      setProducts(list);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      // Show more detailed error
      if (error.code === 'permission-denied') {
        console.error('Permission denied - check Firestore rules');
      } else if (error.code === 'failed-precondition') {
        console.error('Index required - create composite index for products collection');
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<SellerProduct, 'id' | 'seller_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    const newProduct = {
      ...productData,
      seller_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    console.log('Creating product with data:', newProduct);
    const docRef = await addDoc(collection(db, 'products'), newProduct);
    console.log('Product created with ID:', docRef.id);
    await fetchProducts();
    return docRef.id;
  };

  const updateProduct = async (productId: string, updates: Partial<SellerProduct>) => {
    await updateDoc(doc(db, 'products', productId), {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    await fetchProducts();
  };

  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
    await fetchProducts();
  };

  const toggleProductStatus = async (productId: string, currentStatus: 'active' | 'inactive') => {
    await updateProduct(productId, {
      status: currentStatus === 'active' ? 'inactive' : 'active',
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [user?.uid]);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  };
};

