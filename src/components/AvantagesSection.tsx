
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Heart, Truck } from "lucide-react";

const AvantagesSection = () => {
  const avantages = [
    {
      icon: DollarSign,
      title: "Économies importantes",
      description: "Réduisez vos dépenses jusqu'à 50% grâce aux tarifs de gros accessibles par l'achat groupé.",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Users,
      title: "Force du collectif",
      description: "Plus nous sommes nombreux, plus notre pouvoir de négociation est important face aux fournisseurs.",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Heart,
      title: "Soutien local",
      description: "Favorisez l'économie sénégalaise en achetant directement auprès des producteurs et fournisseurs locaux.",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Truck,
      title: "Livraison optimisée",
      description: "Livraisons groupées qui réduisent les coûts de transport et l'impact environnemental.",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <section id="avantages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-achatons-brown mb-4">
            Pourquoi choisir Achat'ons ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre plateforme révolutionne la façon dont les Sénégalais accèdent aux produits 
            de qualité à des prix abordables, tout en renforçant l'économie locale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {avantages.map((avantage, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0">
              <CardContent className={`p-6 ${avantage.bgColor} h-full`}>
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 ${avantage.iconColor} bg-white rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <avantage.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {avantage.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {avantage.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvantagesSection;
