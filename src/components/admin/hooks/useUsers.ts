import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'vendeur' | 'seller' | 'admin';
  created_at: string;
  updated_at?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let snap;
      try {
        const q = query(collection(db, 'profiles'), orderBy('created_at', 'desc'));
        snap = await getDocs(q);
      } catch (error: any) {
        console.warn('Index missing, fetching without orderBy:', error);
        const q = query(collection(db, 'profiles'));
        snap = await getDocs(q);
      }

      const list: User[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          email: data.email || '',
          full_name: data.full_name || '',
          role: data.role || 'user',
          created_at: data.created_at || '',
          updated_at: data.updated_at,
        };
      });

      // Sort by created_at descending (client-side if needed)
      list.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      setUsers(list);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSellerRole = async (userId: string, currentRole: string) => {
    const isCurrentlySeller = currentRole === 'vendeur' || currentRole === 'seller';
    const newRole = isCurrentlySeller ? 'user' : 'vendeur';

    try {
      await updateDoc(doc(db, 'profiles', userId), {
        role: newRole,
        updated_at: new Date().toISOString(),
      });

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole as any } : user
        )
      );
    } catch (error) {
      console.error('Error toggling seller role:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    toggleSellerRole,
  };
};

