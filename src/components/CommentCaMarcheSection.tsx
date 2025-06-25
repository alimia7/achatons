import { Badge } from "@/components/ui/badge";
import { Users, Search, ShoppingBag, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommentCaMarcheSection = () => {
  const navigate = useNavigate();

  const etapes = [
    {
      numero: "01",
      icon: Search,
      titre: "Découvrez les offres",
      description: "Parcourez les produits disponibles en achat groupé proposés par nos fournisseurs locaux.",
      couleur: "bg-achatons-green"
    },
    {
      numero: "02",
      icon: Users,
      titre: "Rejoignez un groupe",
      description: "Participez à un achat groupé existant ou créez le vôtre pour atteindre le minimum requis.",
      couleur: "bg-achatons-orange"
    },
    {
      numero: "03",
      icon: ShoppingBag,
      titre: "Passez commande",
      description: "Une fois le groupe constitué, finalisez votre commande à prix réduit.",
      couleur: "bg-achatons-brown"
    },
    {
      numero: "04",
      icon: Package,
      titre: "Recevez vos produits",
      description: "Votre commande est préparée et livrée selon les modalités convenues avec le groupe.",
      couleur: "bg-achatons-green"
    }
  ];

  const handleViewOffers = () => {
    navigate('/produits');
  };

  return (
    <section id="comment-ca-marche" className="py-20 bg-gradient-to-br from-achatons-cream to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-achatons-orange text-white mb-4">Comment ça marche</Badge>
          <h2 className="text-4xl font-bold text-achatons-brown mb-4">
            Simple comme bonjour
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En quelques clics, rejoignez une communauté d'acheteurs et profitez 
            de prix avantageux sur vos produits préférés.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {etapes.map((etape, index) => (
              <div key={index} className="relative">
                {index < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-achatons-orange to-achatons-brown transform translate-x-4 z-0"></div>
                )}
                
                <div className="relative z-10 text-center group">
                  <div className={`w-32 h-32 ${etape.couleur} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <etape.icon className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="absolute -top-2 -right-2 bg-white border-4 border-achatons-orange rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-achatons-orange font-bold text-lg">{etape.numero}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-achatons-brown mb-3">
                    {etape.titre}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {etape.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-achatons-cream">
            <h3 className="text-2xl font-bold text-achatons-brown mb-4">
              Prêt à commencer ?
            </h3>
            <p className="text-gray-600 mb-6">
              Rejoignez dès maintenant notre communauté et découvrez les premières offres disponibles.
            </p>
            <button 
              onClick={handleViewOffers}
              className="bg-achatons-orange hover:bg-achatons-brown text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Voir les offres du moment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentCaMarcheSection;
