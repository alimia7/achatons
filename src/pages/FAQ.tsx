import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search,
  ShoppingCart,
  HelpCircle,
  Smartphone,
  CreditCard,
  Truck,
  Package,
  Target,
  Shield,
  Phone,
  Mail,
  MapPin,
  Euro
} from "lucide-react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqSections = [
    {
      id: "comprendre",
      title: "🛒 COMPRENDRE ACHAT'ONS",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-achatons-orange",
      questions: [
        {
          question: "Qu'est-ce qu'Achat'ons ?",
          answer: "Achat'ons est la première plateforme d'achat groupé au Sénégal. Nous regroupons plusieurs personnes pour acheter les mêmes produits ensemble et négocier des prix de gros auprès des fournisseurs. Plus nous sommes nombreux, plus nous économisons !"
        },
        {
          question: "Comment ça marche concrètement ?",
          answer: "1. Découvrez nos packs disponibles sur la plateforme\n2. Rejoignez un groupe d'achat en versant 50% du montant\n3. Patientez jusqu'à ce que le groupe soit complet\n4. Payez les 50% restants une fois le seuil atteint\n5. Récupérez vos produits au point de livraison choisi"
        },
        {
          question: "Combien puis-je économiser ?",
          answer: "Nos membres économisent en moyenne 30% à 50% par rapport aux prix du marché. Par exemple, un pack riz + huile + savon qui coûte normalement 22 000 FCFA revient à seulement 15 400 FCFA, soit 6 600 FCFA d'économies !"
        },
        {
          question: "Qui peut utiliser Achat'ons ?",
          answer: "Toute personne majeure résidant au Sénégal peut s'inscrire. Que vous soyez parent, étudiant, commerçant ou simplement soucieux de votre budget, Achat'ons est fait pour vous."
        }
      ]
    },
    {
      id: "inscription",
      title: "📱 INSCRIPTION ET COMPTE",
      icon: <Smartphone className="h-6 w-6" />,
      color: "bg-achatons-green",
      questions: [
        {
          question: "Comment créer mon compte ?",
          answer: "Téléchargez l'application ou rendez-vous sur www.achatons.sn, puis cliquez sur \"S'inscrire\". Vous aurez besoin de :\n• Votre nom et prénom\n• Une adresse email valide\n• Votre numéro de téléphone\n• Votre adresse de livraison"
        },
        {
          question: "L'inscription est-elle gratuite ?",
          answer: "Oui, l'inscription et l'utilisation d'Achat'ons sont 100% gratuites. Vous ne payez que vos achats, sans frais cachés."
        },
        {
          question: "Puis-je modifier mes informations personnelles ?",
          answer: "Bien sûr ! Connectez-vous à votre compte, allez dans \"Mon profil\" et modifiez les informations souhaitées. N'oubliez pas de sauvegarder."
        },
        {
          question: "J'ai oublié mon mot de passe, que faire ?",
          answer: "Sur la page de connexion, cliquez sur \"Mot de passe oublié\" et suivez les instructions. Un lien de réinitialisation sera envoyé à votre adresse email."
        }
      ]
    },
    {
      id: "commandes",
      title: "🛍️ COMMANDES ET GROUPES",
      icon: <HelpCircle className="h-6 w-6" />,
      color: "bg-achatons-brown",
      questions: [
        {
          question: "Comment rejoindre un groupe d'achat ?",
          answer: "Parcourez nos packs disponibles, sélectionnez celui qui vous intéresse, choisissez la quantité souhaitée et cliquez sur \"Rejoindre le groupe\". Vous devrez verser 50% du montant pour valider votre participation."
        },
        {
          question: "Que se passe-t-il si le groupe n'atteint pas le seuil minimum ?",
          answer: "Si le nombre minimum de participants n'est pas atteint dans les délais, le groupe est automatiquement annulé et nous vous remboursons intégralement l'acompte versé dans un délai de 7 jours ouvrables."
        },
        {
          question: "Puis-je annuler ma commande après avoir rejoint un groupe ?",
          answer: "Non, une fois que vous avez validé votre adhésion et versé l'acompte de 50%, l'annulation n'est plus possible. Cette règle garantit la stabilité des groupes et la réussite des négociations."
        },
        {
          question: "Comment savoir si mon groupe a atteint le seuil ?",
          answer: "Vous recevez une notification par SMS et email dès que votre groupe atteint le seuil minimum. Vous avez alors 48h pour payer le solde (50% restants)."
        },
        {
          question: "Que se passe-t-il si je ne paie pas le solde à temps ?",
          answer: "Si vous ne payez pas le solde dans les 48h après notification, votre commande est annulée et l'acompte n'est pas remboursé mais considérée comme acompte sur une autre offre groupée disponible sur la plateforme. En cas de récidive, votre compte peut être suspendu."
        }
      ]
    },
    {
      id: "paiement",
      title: "💳 PAIEMENT",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-achatons-lightOrange",
      questions: [
        {
          question: "Quels sont les moyens de paiement acceptés ?",
          answer: "Nous acceptons :\n• Mobile Money : Orange Money, Free Money, Wave\n• Carte bancaire (Visa, Mastercard)\n• Virement bancaire\n• Espèces (dans certains points de retrait)"
        },
        {
          question: "Pourquoi dois-je payer en deux fois ?",
          answer: "Le paiement fractionné (50% + 50%) nous permet de :\n• Sécuriser la formation des groupes\n• Garantir l'engagement des participants\n• Optimiser nos négociations avec les fournisseurs"
        },
        {
          question: "Puis-je payer différemment pour l'acompte et le solde ?",
          answer: "Oui, vous pouvez utiliser des moyens de paiement différents pour l'acompte (50%) et le solde (50%)."
        }
      ]
    },
    {
      id: "livraison",
      title: "🚚 LIVRAISON ET RETRAIT",
      icon: <Truck className="h-6 w-6" />,
      color: "bg-achatons-orange",
      questions: [
        {
          question: "Où puis-je récupérer ma commande ?",
          answer: "Selon votre localisation :\n• Livraison à domicile (Dakar et banlieue)\n• Points de retrait (Thiès, Kaolack, Saint-Louis, Mbour)\n• Magasins partenaires (voir liste sur l'app)"
        },
        {
          question: "Quels sont les délais de livraison ?",
          answer: "Les délais varient selon les produits et la localisation :\n• Produits non périssables : 3 à 7 jours après constitution du groupe\n• Produits frais : 1 à 3 jours après constitution du groupe"
        },
        {
          question: "La livraison est-elle payante ?",
          answer: "Oui la livraison est à la charge du membre"
        },
        {
          question: "Comment suivre ma commande ?",
          answer: "Une fois votre groupe constitué et votre solde payé, vous recevez un numéro de suivi par SMS. Vous pouvez également suivre l'état de votre commande dans votre espace membre."
        }
      ]
    },
    {
      id: "produits",
      title: "📦 PRODUITS ET QUALITÉ",
      icon: <Package className="h-6 w-6" />,
      color: "bg-achatons-green",
      questions: [
        {
          question: "D'où viennent vos produits ?",
          answer: "Nous travaillons exclusivement avec des fournisseurs et distributeurs agréés au Sénégal. Tous nos partenaires respectent les normes de qualité et d'hygiène en vigueur."
        },
        {
          question: "Comment garantissez-vous la qualité ?",
          answer: "• Sélection rigoureuse de nos fournisseurs partenaires\n• Contrôle qualité avant expédition\n• Politique de remboursement en cas de produit défectueux\n• Traçabilité complète de nos approvisionnements"
        },
        {
          question: "Puis-je retourner un produit défectueux ?",
          answer: "Oui, vous disposez de 48h après réception pour signaler tout problème de qualité. Nous procédons alors à l'échange ou au remboursement selon votre préférence."
        },
        {
          question: "Proposez-vous des produits bio ou équitables ?",
          answer: "Nous développons progressivement notre gamme de produits bio et équitables. Suivez nos actualités pour découvrir nos nouvelles offres !"
        }
      ]
    },
    {
      id: "fonctionnalites",
      title: "🎯 FONCTIONNALITÉS AVANCÉES",
      icon: <Target className="h-6 w-6" />,
      color: "bg-achatons-brown",
      questions: [
        {
          question: "Puis-je créer un groupe privé avec mes proches ?",
          answer: "Cette fonctionnalité est en développement ! Bientôt, vous pourrez inviter vos amis et famille à former des groupes privés pour vos achats groupés."
        },
        {
          question: "Y a-t-il un programme de fidélité ?",
          answer: "Oui ! À chaque commande, vous cumulez des points Achat'ons convertibles en réductions sur vos prochains achats. Plus vous commandez, plus vous économisez !"
        },
        {
          question: "Puis-je suggérer de nouveaux produits ?",
          answer: "Absolument ! Contactez-nous à achatons.info@gmail.com avec vos suggestions. Si suffisamment de membres sont intéressés, nous négocierons avec les fournisseurs."
        },
        {
          question: "Comment parrainer de nouveaux membres ?",
          answer: "Dans votre espace membre, vous trouverez votre code de parrainage unique. Chaque nouveau membre inscrit avec votre code vous fait gagner des points fidélité !"
        }
      ]
    },
    {
      id: "support",
      title: "❓ PROBLÈMES ET SUPPORT",
      icon: <HelpCircle className="h-6 w-6" />,
      color: "bg-achatons-lightOrange",
      questions: [
        {
          question: "J'ai un problème technique, qui contacter ?",
          answer: "Notre équipe support est disponible :\n• Email : achatons.info@gmail.com\n• WhatsApp : +221782189429 (du lundi au samedi, 8h-18h)\n• Chat en ligne : Sur l'application (réponse sous 1h)"
        },
        {
          question: "Ma livraison est en retard, que faire ?",
          answer: "Contactez immédiatement notre service client avec votre numéro de commande. Nous identifierons la cause du retard et trouverons une solution rapidement."
        },
        {
          question: "Un produit manque dans ma livraison",
          answer: "Signalez-nous le problème dans les 48h avec photos à l'appui. Nous livrerons le produit manquant dans les plus brefs délais ou procéderons au remboursement."
        },
        {
          question: "Comment supprimer mon compte ?",
          answer: "Écrivez-nous à achatons.info@gmail.com depuis l'adresse email de votre compte en précisant \"Suppression de compte\". Vos données seront effacées sous 30 jours conformément à la réglementation."
        }
      ]
    },
    {
      id: "tarifs",
      title: "💰 TARIFS ET ÉCONOMIES",
      icon: <Euro className="h-6 w-6" />,
      color: "bg-achatons-orange",
      questions: [
        {
          question: "Comment calculez-vous les économies affichées ?",
          answer: "Nous comparons nos prix avec ceux pratiqués dans les supermarchés et marchés de Dakar. Les pourcentages d'économie sont calculés sur la base de cette moyenne de marché."
        },
        {
          question: "Y a-t-il des frais cachés ?",
          answer: "Aucun frais caché ! Le prix affiché inclut toutes les taxes. Seuls des frais de livraison peuvent s'appliquer selon le montant de votre commande."
        },
        {
          question: "Puis-je avoir une facture ?",
          answer: "Oui, une facture électronique est automatiquement générée et envoyée par email après chaque commande validée."
        }
      ]
    },
    {
      id: "securite",
      title: "🔒 SÉCURITÉ ET CONFIDENTIALITÉ",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-achatons-green",
      questions: [
        {
          question: "Mes données personnelles sont-elles protégées ?",
          answer: "Nous respectons scrupuleusement la réglementation sénégalaise sur les données personnelles. Vos informations ne sont jamais vendues ni partagées avec des tiers sans votre consentement."
        },
        {
          question: "Comment protégez-vous mes données bancaires ?",
          answer: "Nous ne stockons aucune donnée bancaire sur nos serveurs. Les paiements sont traités par des prestataires certifiés PCI-DSS, garantie de sécurité bancaire internationale."
        },
        {
          question: "Puis-je consulter les données que vous avez sur moi ?",
          answer: "Bien sûr ! Contactez-nous à achatons.info@gmail.com pour recevoir un export de toutes vos données personnelles."
        }
      ]
    }
  ];

  const contactInfo = {
    website: "www.achatons.com",
    email: "achatons.info@gmail.com",
    whatsapp: "+221772189429",
    address: "Patte d'Oie, Dakar",
    hours: "Lundi au Samedi, 8h00 - 18h00"
  };

  const filteredSections = faqSections.map(section => ({
    ...section,
    questions: section.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-achatons-brown to-achatons-orange text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FAQ - FOIRE AUX QUESTIONS
          </h1>
          <p className="text-xl md:text-2xl text-achatons-cream mb-8">
            Retrouvez ici les réponses aux questions les plus fréquentes sur Achat'ons
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-gray-900 bg-white border-0 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {searchQuery && (
            <div className="mb-8">
              <p className="text-gray-600">
                {filteredSections.reduce((total, section) => total + section.questions.length, 0)} résultat(s) trouvé(s) pour "{searchQuery}"
              </p>
            </div>
          )}

          <div className="grid gap-8">
            {(searchQuery ? filteredSections : faqSections).map((section) => (
              <Card key={section.id} className="shadow-lg border-0 overflow-hidden">
                <CardHeader className={`${section.color} text-white`}>
                  <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${section.id}-${index}`}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-achatons-brown text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-achatons-cream">
            📞 NOUS CONTACTER
          </h2>
          <p className="text-xl mb-8 text-achatons-cream">
            Une question qui ne figure pas dans cette FAQ ?
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="text-achatons-orange mb-3">
                <MapPin className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Site web</h3>
              <p className="text-achatons-cream">{contactInfo.website}</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="text-achatons-orange mb-3">
                <Mail className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Email général</h3>
              <p className="text-achatons-cream">{contactInfo.email}</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="text-achatons-orange mb-3">
                <Phone className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-achatons-cream">{contactInfo.whatsapp}</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 md:col-span-2 lg:col-span-1">
              <div className="text-achatons-orange mb-3">
                <MapPin className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Adresse</h3>
              <p className="text-achatons-cream">{contactInfo.address}</p>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-6 md:col-span-2">
              <div className="text-achatons-orange mb-3">
                <HelpCircle className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="font-semibold mb-2">Heures d'ouverture</h3>
              <p className="text-achatons-cream">{contactInfo.hours}</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-achatons-orange border-opacity-30">
            <p className="text-achatons-cream text-sm">
              Cette FAQ est régulièrement mise à jour. Dernière modification : Août 2025
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FAQ;
