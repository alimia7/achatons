
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Target, Globe } from 'lucide-react';
import StoryModal from './StoryModal';

const StorySection = () => {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-achatons-cream to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-achatons-brown mb-6">
            Notre Mission : Révolutionner la Consommation au Sénégal
          </h2>
          
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Achat'ons n'est pas qu'une plateforme d'achat groupé. C'est un mouvement 
            qui transforme la façon dont les Sénégalais consomment, économisent et 
            soutiennent leur économie locale.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Heart className="h-12 w-12 text-achatons-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-achatons-brown mb-2">Solidarité</h3>
              <p className="text-gray-600">Ensemble, nous sommes plus forts pour négocier et économiser</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Users className="h-12 w-12 text-achatons-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-achatons-brown mb-2">Communauté</h3>
              <p className="text-gray-600">Créer des liens entre consommateurs et producteurs locaux</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Target className="h-12 w-12 text-achatons-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-achatons-brown mb-2">Économies</h3>
              <p className="text-gray-600">Jusqu'à 40% d'économies sur vos achats essentiels</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Globe className="h-12 w-12 text-achatons-orange mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-achatons-brown mb-2">Impact</h3>
              <p className="text-gray-600">Soutenir l'économie locale et les producteurs sénégalais</p>
            </div>
          </div>

          <Button 
            onClick={() => setIsStoryModalOpen(true)}
            className="bg-achatons-orange hover:bg-achatons-brown text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
          >
            Découvrir Notre Histoire
          </Button>
        </div>
      </div>

      <StoryModal 
        isOpen={isStoryModalOpen} 
        onClose={() => setIsStoryModalOpen(false)} 
      />
    </section>
  );
};

export default StorySection;
