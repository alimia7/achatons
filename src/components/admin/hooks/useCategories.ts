
import { useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Category {
  id: string;
  name: string;
  description: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snap = await getDocs(q);
      const result: Category[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: data.name,
          description: data.description || '',
        };
      });
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return {
    categories,
    fetchCategories,
  };
};
