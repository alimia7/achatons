import { supabase } from '@/integrations/supabase/client';

export interface SupabaseHealthStatus {
  isHealthy: boolean;
  error?: string;
  timestamp: number;
}

/**
 * Vérifie la santé de la connexion Supabase
 */
export const checkSupabaseHealth = async (): Promise<SupabaseHealthStatus> => {
  try {
    // Test simple de connexion avec une requête légère
    const { error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      return {
        isHealthy: false,
        error: error.message,
        timestamp: Date.now()
      };
    }

    return {
      isHealthy: true,
      timestamp: Date.now()
    };
  } catch (error: any) {
    return {
      isHealthy: false,
      error: error.message || 'Erreur de connexion inconnue',
      timestamp: Date.now()
    };
  }
};

/**
 * Retry avec backoff exponentiel pour les requêtes Supabase
 */
export const retrySupabaseRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error: any) {
      lastError = error;
      
      // Ne pas retry pour certaines erreurs
      if (error?.code === 'PGRST301' || 
          error?.message?.includes('permission') ||
          error?.message?.includes('unauthorized')) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Tentative ${attempt + 1}/${maxRetries + 1} échouée, retry dans ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};
