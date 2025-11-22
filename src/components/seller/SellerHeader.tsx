import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const SellerHeader = () => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-achatons-brown mb-2">Tableau de bord vendeur</h1>
        <p className="text-gray-600">Gérez vos produits, offres et suivez vos performances</p>
      </div>
      <Link to="/">
        <Button variant="outline" className="flex items-center space-x-2">
          <Home className="h-4 w-4" />
          <span>Retour à l'accueil</span>
        </Button>
      </Link>
    </div>
  );
};

export default SellerHeader;

