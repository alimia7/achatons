import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users, 
  TrendingDown, 
  MapPin, 
  Calendar,
  Package,
  Star,
  Share2
} from "lucide-react";
import ShareButton from "./ShareButton";

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
  unitOfMeasure?: string;
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinGroup: () => void;
}

const ProductDetailsModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onJoinGroup 
}: ProductDetailsModalProps) => {
  if (!product) return null;

  const progressPercentage = (product.currentParticipants / product.targetParticipants) * 100;
  const daysLeft = Math.ceil((new Date(product.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTimeLeft = (dateString: string) => {
    const now = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return "Expiré";
    if (diffDays === 1) return "1 jour";
    return `${diffDays} jours`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl text-achatons-brown mb-2">
                {product.name}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Détails complets du produit
              </DialogDescription>
            </div>
            <ShareButton
              productName={product.name}
              productPrice={formatPrice(product.groupPrice)}
              productUrl="/products"
            />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Image et informations principales */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
              />
              <Badge className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-sm font-semibold">
                -{product.savings}%
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">Fournisseur :</span>
                <span className="ml-2 text-achatons-brown font-semibold">{product.supplier}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Package className="h-4 w-4 mr-2" />
                <span className="font-medium">Unité :</span>
                <span className="ml-2 text-achatons-brown font-semibold">
                  {product.unitOfMeasure || 'pièce'}
                </span>
              </div>
            </div>
          </div>

          {/* Détails et actions */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-achatons-brown mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Prix et économies */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-3xl font-bold text-achatons-orange">
                    {formatPrice(product.groupPrice)}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-achatons-green text-sm font-semibold">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span>Économie: {formatPrice(product.originalPrice - product.groupPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progression */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="flex items-center text-gray-700 font-medium">
                  <Users className="h-4 w-4 mr-2" />
                  Progression du groupe
                </span>
                <span className="font-semibold text-achatons-brown">
                  {product.currentParticipants}/{product.targetParticipants} {product.unitOfMeasure || 'pièces'}
                </span>
              </div>
              
              <Progress 
                value={progressPercentage} 
                className="h-3"
              />
              
              <p className="text-sm text-gray-600">
                {progressPercentage >= 100 
                  ? "🎉 Objectif atteint ! Le groupe d'achat est complet."
                  : `Il reste ${product.targetParticipants - product.currentParticipants} ${product.unitOfMeasure || 'pièces'} à atteindre l'objectif.`
                }
              </p>
            </div>

            {/* Date limite */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-orange-700">
                  <Clock className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-semibold">Date limite</p>
                    <p className="text-sm">{formatDate(product.deadline)}</p>
                  </div>
                </div>
                <Badge 
                  variant={daysLeft <= 3 ? "destructive" : "secondary"}
                  className="font-semibold"
                >
                  {formatTimeLeft(product.deadline)}
                </Badge>
              </div>
            </div>

            {/* Bouton d'action */}
            <div className="pt-4">
              <Button 
                onClick={onJoinGroup}
                className="w-full bg-achatons-orange hover:bg-achatons-brown text-white font-semibold py-4 text-lg transition-colors"
                disabled={daysLeft <= 0 || progressPercentage >= 100}
              >
                {progressPercentage >= 100 ? '🎉 Objectif atteint' : 
                 daysLeft <= 0 ? '⏰ Offre expirée' : 
                 '🚀 Rejoindre le groupe d\'achat'}
              </Button>
              
              {daysLeft > 0 && progressPercentage < 100 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Rejoignez maintenant et économisez {product.savings}% !
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal; 