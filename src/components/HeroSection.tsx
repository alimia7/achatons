
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Users, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import StoryModal from "./StoryModal";

const HeroSection = () => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <section className="bg-gradient-to-br from-achatons-cream to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-achatons-brown leading-tight">
                Achetons ensemble,
                <span className="text-achatons-orange"> économisons ensemble</span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed">
                Rejoignez la première plateforme d'achat groupé au Sénégal. 
                Accédez à des prix de gros en vous regroupant avec d'autres consommateurs 
                et soutenez les fournisseurs locaux.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/produits">
                <Button 
                  size="lg" 
                  className="bg-achatons-orange hover:bg-achatons-brown text-white px-8 py-6 text-lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Voir les offres du moment
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-achatons-brown text-achatons-brown hover:bg-achatons-brown hover:text-white px-8 py-6 text-lg"
                onClick={() => setIsStoryModalOpen(true)}
              >
                En savoir plus
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-achatons-orange">30%</div>
                <div className="text-sm text-gray-600">d'économies potentielles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-achatons-orange">50+</div>
                <div className="text-sm text-gray-600">premiers membres</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-achatons-orange">20+</div>
                <div className="text-sm text-gray-600">fournisseurs partenaires</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-achatons-orange to-achatons-brown rounded-3xl p-8 text-white transform rotate-2 shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <Users className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Achat groupé</h3>
                  <p className="text-sm opacity-90">Plus on est nombreux, moins on paye</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <TrendingDown className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Prix réduits</h3>
                  <p className="text-sm opacity-90">Tarifs de gros pour tous</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <ShoppingCart className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Local</h3>
                  <p className="text-sm opacity-90">Soutien aux fournisseurs sénégalais</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                  <Users className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Solidaire</h3>
                  <p className="text-sm opacity-90">Consommation communautaire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StoryModal 
        isOpen={isStoryModalOpen} 
        onClose={() => setIsStoryModalOpen(false)} 
      />
    </section>
  );
};

export default HeroSection;
