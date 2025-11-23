
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Users, TrendingDown, MapPin, Eye } from "lucide-react";
import ShareButton from "./ShareButton";
import ProductDetailsModal from "./ProductDetailsModal";
import { useState } from "react";

interface Product {
  id: number;
  originalId: string; // Ajout de l'UUID original
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
  unitOfMeasure?: string;
  sellerLogo?: string | null;
  sellerName?: string | null;
}

interface ProductCardProps {
  product: Product;
  onJoinGroup: () => void;
}

const ProductCard = ({ product, onJoinGroup }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Safely calculate values with defaults
  const originalPrice = product.originalPrice || 0;
  const groupPrice = product.groupPrice || 0;
  const currentParticipants = product.currentParticipants || 0;
  const targetParticipants = product.targetParticipants || 1;
  const savings = product.savings || (originalPrice > 0 && groupPrice > 0 && originalPrice > groupPrice 
    ? Math.round(((originalPrice - groupPrice) / originalPrice) * 100) 
    : 0);
  
  const progressPercentage = targetParticipants > 0 
    ? Math.min(100, Math.max(0, (currentParticipants / targetParticipants) * 100))
    : 0;
  
  const daysLeft = Math.ceil((new Date(product.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const formatPrice = (price: number) => {
    if (!price || isNaN(price) || price <= 0) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(Math.round(price)) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-2 hover:border-achatons-orange cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {savings > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{savings}%
            </div>
          )}
          <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
            <ShareButton
              productName={product.name}
              productPrice={formatPrice(groupPrice)}
              productUrl="/products"
            />
          </div>
          <div className="absolute bottom-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors">
            <Eye className="h-4 w-4" />
          </div>
        </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-achatons-brown mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{product.supplier}</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-achatons-orange">
                {formatPrice(groupPrice)}
              </p>
              {originalPrice > 0 && originalPrice > groupPrice && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}
                </p>
              )}
            </div>
            {originalPrice > groupPrice && (
              <div className="text-right">
                <div className="flex items-center text-achatons-green text-sm font-semibold">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>Économie: {formatPrice(originalPrice - groupPrice)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                Participants
              </span>
              <span className="font-semibold text-achatons-brown">
                {currentParticipants}/{targetParticipants} {product.unitOfMeasure || 'pièces'}
              </span>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                Fin le {formatDate(product.deadline)}
              </span>
              <span className={`font-semibold ${daysLeft <= 3 ? 'text-red-500' : 'text-achatons-green'}`}>
                {daysLeft > 0 ? `${daysLeft} jours` : 'Expiré'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onJoinGroup();
          }}
          className="w-full bg-achatons-orange hover:bg-achatons-brown text-white font-semibold py-3 transition-colors"
          disabled={daysLeft <= 0 || progressPercentage >= 100}
        >
          {progressPercentage >= 100 ? 'Objectif atteint' : 
           daysLeft <= 0 ? 'Offre expirée' : 
           'Rejoindre le groupe d\'achat'}
        </Button>
      </CardFooter>
      </Card>

      <ProductDetailsModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoinGroup={onJoinGroup}
      />
    </>
  );
};

export default ProductCard;
