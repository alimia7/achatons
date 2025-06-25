
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, MapPin, Handshake, Leaf } from "lucide-react";

const ImpactSection = () => {
  const impacts = [
    {
      icon: TrendingUp,
      chiffre: "500K",
      unite: "FCFA",
      description: "économies potentielles par mois pour nos membres"
    },
    {
      icon: MapPin,
      chiffre: "5",
      unite: "villes",
      description: "ciblées pour le lancement"
    },
    {
      icon: Handshake,
      chiffre: "20",
      unite: "PME",
      description: "partenaires locales engagées"
    },
    {
      icon: Leaf,
      chiffre: "25%",
      unite: "CO2",
      description: "de réduction prévue des émissions de transport"
    }
  ];

  return (
    <section id="impact" className="py-20 bg-achatons-brown text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-achatons-orange rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Notre vision pour les communautés sénégalaises
          </h2>
          <p className="text-xl text-achatons-cream max-w-3xl mx-auto">
            Achat'ons se lance avec l'ambition de créer un écosystème de consommation 
            plus équitable et durable pour tous les Sénégalais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <Card key={index} className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <impact.icon className="h-12 w-12 text-achatons-orange mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-1">
                  {impact.chiffre}
                </div>
                <div className="text-achatons-orange font-semibold mb-2">
                  {impact.unite}
                </div>
                <p className="text-achatons-cream text-sm">
                  {impact.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-achatons-orange to-achatons-green rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Rejoignez le mouvement dès le lancement
          </h3>
          <p className="text-lg mb-6 text-white text-opacity-90">
            Soyez parmi les premiers à bénéficier d'Achat'ons et contribuez 
            au développement économique local dès notre lancement.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">premiers membres inscrits</div>
            </div>
            <div>
              <div className="text-2xl font-bold">20+</div>
              <div className="text-sm">PME partenaires engagées</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100+</div>
              <div className="text-sm">familles à impacter positivement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
