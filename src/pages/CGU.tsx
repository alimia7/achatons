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
  FileText,
  User,
  Globe,
  ShoppingCart,
  CreditCard,
  Truck,
  Shield,
  AlertTriangle,
  Scale,
  Users,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const CGU = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const cguSections = [
    {
      id: "definitions",
      title: "1. DÉFINITIONS",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-achatons-orange",
      content: `Achat'ons : Plateforme digitale d'achat groupé, société de droit sénégalais sise à la Cité impôts et domaines, Dakar, Sénégal.

Plateforme : L'ensemble des services proposés par Achat'ons via son site web www.achatons.sn, son application mobile et tous autres canaux digitaux associés.

Utilisateur : Toute personne physique ou morale qui accède et utilise la Plateforme.

Membre : Utilisateur ayant créé un compte sur la Plateforme.

Achat groupé : Commande collective organisée par Achat'ons permettant à plusieurs Membres d'acheter des produits à des conditions préférentielles.

Fournisseur : Partenaire commercial d'Achat'ons proposant des produits via la Plateforme.`
    },
    {
      id: "objet",
      title: "2. OBJET ET ACCEPTATION",
      icon: <Globe className="h-6 w-6" />,
      color: "bg-achatons-green",
      content: `2.1 Objet
Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la Plateforme Achat'ons, service d'intermédiation permettant l'organisation d'achats groupés de produits de consommation courante au Sénégal.

2.2 Acceptation
L'accès et l'utilisation de la Plateforme impliquent l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement l'utilisation de nos services.`
    },
    {
      id: "acces",
      title: "3. ACCÈS À LA PLATEFORME",
      icon: <User className="h-6 w-6" />,
      color: "bg-achatons-brown",
      content: `3.1 Conditions d'accès
L'accès à la Plateforme est ouvert à toute personne physique majeure ou personne morale ayant la capacité juridique de contracter, résidant ou établie au Sénégal.

3.2 Inscription
L'inscription requiert la fourniture d'informations exactes et à jour :
• Nom et prénom ou dénomination sociale
• Adresse email valide
• Numéro de téléphone mobile
• Adresse de livraison au Sénégal

3.3 Compte utilisateur
Chaque Membre est responsable de la confidentialité de ses identifiants et de toutes les activités effectuées sous son compte. En cas d'utilisation non autorisée, le Membre doit immédiatement informer Achat'ons.`
    },
    {
      id: "fonctionnement",
      title: "4. FONCTIONNEMENT DES ACHATS GROUPÉS",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-achatons-lightOrange",
      content: `4.1 Principe
Achat'ons organise des achats groupés en :
• Sélectionnant des produits auprès de Fournisseurs partenaires
• Constituant des groupes d'achat avec objectif quantitatif minimum
• Négociant des tarifs préférentiels basés sur les volumes
• Coordonnant la livraison ou le retrait des commandes

4.2 Formation des groupes
• Seuil minimum de participants requis pour déclencher la commande
• Délai limite pour atteindre l'objectif
• Information transparente sur l'état d'avancement
• Annulation automatique si l'objectif n'est pas atteint

4.3 Modalités de commande et validation
• Adhésion au groupe : Versement obligatoire de 50% du montant total de la commande
• Validation définitive : Aucune annulation possible après validation de l'adhésion par le Membre
• Paiement du solde : 50% restants à régler après atteinte du seuil minimum et avant livraison
• Échec du groupe : Remboursement intégral de l'acompte versé si le seuil n'est pas atteint dans les délais`
    },
    {
      id: "prix",
      title: "5. PRIX ET PAIEMENT",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-achatons-orange",
      content: `5.1 Prix
Les prix affichés sont exprimés en Francs CFA (FCFA) et incluent toutes les taxes applicables. Les prix peuvent varier selon les volumes atteints et les négociations avec les Fournisseurs.

5.2 Modalités de paiement
Paiement fractionné obligatoire :
• 1ère échéance : 50% du montant total lors de l'adhésion au groupe d'achat
• 2ème échéance : 50% restants après constitution du groupe et avant livraison

Moyens de paiement acceptés :
• Mobile Money (Orange Money, Free Money, Wave)
• Virement bancaire
• Carte bancaire
• Espèces (pour certains points de retrait)

Conditions particulières :
• Le non-paiement du solde dans les délais impartis entraîne l'annulation de la commande et le 50% déjà versé seront considéré comme une avance sur une autre offre groupé choisie par le membre.
• Les frais éventuels liés aux moyens de paiement sont à la charge du Membre

5.3 Facturation
Une facture électronique est émise pour chaque commande confirmée et envoyée à l'adresse email du Membre.`
    },
    {
      id: "livraison",
      title: "6. LIVRAISON ET RETRAIT",
      icon: <Truck className="h-6 w-6" />,
      color: "bg-achatons-green",
      content: `6.1 Modalités
Selon les produits et la localisation :
• Livraison à domicile dans la région de Dakar
• Points de retrait dans les principales villes du Sénégal
• Retrait en magasin partenaire

6.2 Délais
Les délais de livraison/retrait sont communiqués lors de la commande et peuvent varier selon :
• La nature des produits
• La localisation
• Les contraintes logistiques

6.3 Responsabilité
Achat'ons s'engage à livrer les produits conformes à la commande. En cas de non-conformité, le Membre dispose de 48h après réception pour signaler le problème.`
    },
    {
      id: "annulation",
      title: "7. ANNULATION, RÉTRACTATION ET REMBOURSEMENT",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "bg-achatons-brown",
      content: `7.1 Règles d'annulation
Avant validation de l'adhésion : Le Membre peut librement annuler sa participation au groupe d'achat.
Après validation de l'adhésion : Aucune annulation n'est possible une fois que le Membre a validé son adhésion et versé l'acompte de 50%. Cette règle garantit la stabilité des groupes d'achat et la fiabilité des négociations avec les Fournisseurs.

7.2 Échec de constitution du groupe
En cas de non-atteinte du seuil minimum dans les délais impartis :
• Remboursement intégral et automatique de l'acompte versé (50%)
• Notification immédiate du Membre par email et SMS
• Remboursement effectué dans un délai maximum de 7 jours ouvrables
• Aucun frais ne sera retenu par Achat'ons

7.3 Produits périssables
Conformément à la réglementation sénégalaise, les produits alimentaires périssables ne peuvent faire l'objet d'une rétractation après livraison.

7.4 Autres produits
Pour les produits non périssables livrés, un délai de rétractation de 7 jours est accordé à compter de la réception, produits dans leur emballage d'origine, uniquement en cas de vice ou défaut constaté.

7.5 Modalités de remboursement
• Remboursement par le même moyen de paiement utilisé
• Délai maximum de 14 jours ouvrables pour les rétractations
• Frais de retour à la charge du Membre sauf vice ou défaut du produit`
    },
    {
      id: "donnees",
      title: "8. PROTECTION DES DONNÉES PERSONNELLES",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-achatons-lightOrange",
      content: `8.1 Collecte
Achat'ons collecte uniquement les données nécessaires au fonctionnement du service, en conformité avec la loi sénégalaise sur les données personnelles.

8.2 Utilisation
Les données sont utilisées pour :
• La gestion des comptes et commandes
• L'amélioration du service
• La communication commerciale (avec consentement)

8.3 Droits
Chaque Membre dispose d'un droit d'accès, de rectification et de suppression de ses données personnelles en contactant : achatons.info@gmail.com`
    },
    {
      id: "responsabilites",
      title: "9. RESPONSABILITÉS",
      icon: <Users className="h-6 w-6" />,
      color: "bg-achatons-orange",
      content: `9.1 Responsabilité d'Achat'ons
Achat'ons s'engage à :
• Fournir un service conforme aux présentes CGU
• Assurer la sécurité des transactions
• Respecter les délais annoncés dans la mesure du possible

9.2 Limitations
La responsabilité d'Achat'ons est limitée au montant de la commande en cause et exclut les dommages indirects.

9.3 Responsabilité du Membre
Le Membre s'engage à :
• Fournir des informations exactes
• Respecter les conditions d'utilisation
• Réceptionner ses commandes aux dates/lieux convenus
• Honorer ses engagements de paiement : payer l'intégralité du solde (50%) dans les délais après constitution du groupe
• Respecter le caractère définitif de son adhésion après validation et versement de l'acompte

Conséquences du non-respect :
• Non-paiement du solde : annulation de la commande sans remboursement de l'acompte
• Défaillance répétée : suspension temporaire ou définitive du compte`
    },
    {
      id: "propriete",
      title: "10. PROPRIÉTÉ INTELLECTUELLE",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-achatons-green",
      content: `Tous les éléments de la Plateforme (textes, images, logos, graphismes, etc.) sont protégés par les droits de propriété intellectuelle et appartiennent à Achat'ons ou à ses partenaires.`
    },
    {
      id: "resiliation",
      title: "11. RÉSILIATION",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "bg-achatons-brown",
      content: `11.1 Résiliation par le Membre
Le Membre peut fermer son compte à tout moment en adressant une demande à achatons.info@gmail.com

11.2 Résiliation par Achat'ons
Achat'ons se réserve le droit de suspendre ou résilier un compte en cas de :
• Violation des présentes CGU
• Utilisation frauduleuse de la Plateforme
• Impayés répétés`
    },
    {
      id: "reclamations",
      title: "12. RÉCLAMATIONS ET MÉDIATION",
      icon: <Scale className="h-6 w-6" />,
      color: "bg-achatons-lightOrange",
      content: `12.1 Service client
Pour toute réclamation : achatons.info@gmail.com ou +221782189429

12.2 Médiation
En cas de litige, une solution amiable sera recherchée. À défaut, le litige sera soumis à la médiation puis, le cas échéant, aux tribunaux compétents de Dakar.`
    },
    {
      id: "dispositions",
      title: "13. DISPOSITIONS GÉNÉRALES",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-achatons-orange",
      content: `13.1 Droit applicable
Les présentes CGU sont soumises au droit sénégalais.

13.2 Modification
Achat'ons se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur la Plateforme.

13.3 Divisibilité
Si une disposition des présentes CGU est déclarée nulle ou inapplicable, les autres dispositions restent pleinement en vigueur.`
    }
  ];

  const contactInfo = {
    address: "Patte d'Oie, Cité Impôts et Domaines, Dakar, Sénégal",
    email: "achatons.info@gmail.com",
    phone: "+221782189429",
    website: "www.achatons.sn"
  };

  const filteredSections = cguSections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-achatons-brown to-achatons-orange text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            CONDITIONS GÉNÉRALES D'UTILISATION
          </h1>
          <p className="text-xl md:text-2xl text-achatons-cream mb-8">
            ACHAT'ONS - Plateforme d'achat groupé au Sénégal
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher dans les CGU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-gray-900 bg-white border-0 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CGU Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {searchQuery && (
            <div className="mb-8">
              <p className="text-gray-600">
                {filteredSections.length} section(s) trouvée(s) pour "{searchQuery}"
              </p>
            </div>
          )}

          <div className="grid gap-8">
            {(searchQuery ? filteredSections : cguSections).map((section) => (
              <Card key={section.id} className="shadow-lg border-0 overflow-hidden">
                <CardHeader className={`${section.color} text-white`}>
                  <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Information */}
          <Card className="mt-12 shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-achatons-green text-white">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Phone className="h-6 w-6" />
                14. CONTACT
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-achatons-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Adresse</h4>
                      <p className="text-gray-600">{contactInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-achatons-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600">{contactInfo.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-achatons-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Téléphone</h4>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-achatons-orange mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Site web</h4>
                      <p className="text-gray-600">{contactInfo.website}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Update Info */}
          <div className="mt-8 text-center py-6 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-sm">
              Ces Conditions Générales d'Utilisation ont été mises à jour le <strong>01 Août 2025</strong> et sont disponibles en permanence sur notre site web.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CGU;
