
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, HelpCircle, Scale } from 'lucide-react';

const LegalPages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-achatons-cream to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-achatons-brown mb-4">
              Informations Légales
            </h1>
            <p className="text-xl text-gray-700">
              Tout ce que vous devez savoir sur l'utilisation d'Achat'ons
            </p>
          </div>

          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="terms" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Conditions</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Confidentialité</span>
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                <span className="hidden sm:inline">Mentions</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terms">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-achatons-brown">Conditions d'Utilisation</CardTitle>
                  <CardDescription>
                    Dernière mise à jour : 26 mai 2025
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">1. Acceptation des Conditions</h3>
                    <p className="text-gray-700 leading-relaxed">
                      En utilisant la plateforme Achat'ons, vous acceptez les présentes conditions d'utilisation. 
                      Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">2. Description du Service</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Achat'ons est une plateforme d'achat groupé qui permet aux utilisateurs de se regrouper 
                      pour bénéficier de prix de gros sur des produits essentiels. Nous facilitons la mise en 
                      relation entre consommateurs et fournisseurs locaux.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">3. Responsabilités des Utilisateurs</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Fournir des informations exactes lors de l'inscription</li>
                      <li>Respecter les délais de participation aux achats groupés</li>
                      <li>Honorer les commandes confirmées</li>
                      <li>Respecter les autres utilisateurs et les fournisseurs</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">4. Processus d'Achat</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Les achats groupés sont organisés selon un calendrier défini. Une fois le nombre minimum 
                      de participants atteint, la commande est confirmée. Les paiements s'effectuent à la livraison 
                      ou selon les modalités convenues avec le fournisseur.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">5. Annulations et Remboursements</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Si le nombre minimum de participants n'est pas atteint, l'achat groupé sera annulé et 
                      aucun paiement ne sera requis. Pour les commandes confirmées, les annulations sont 
                      possibles selon les conditions du fournisseur.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">6. Limitation de Responsabilité</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Achat'ons agit en tant qu'intermédiaire. Nous ne sommes pas responsables de la qualité 
                      des produits, des retards de livraison ou des litiges entre utilisateurs et fournisseurs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-achatons-brown">Politique de Confidentialité</CardTitle>
                  <CardDescription>
                    Comment nous protégeons vos données personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Collecte des Données</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous collectons uniquement les données nécessaires au fonctionnement de notre service :
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                      <li>Nom et prénom</li>
                      <li>Numéro de téléphone</li>
                      <li>Adresse email (optionnelle)</li>
                      <li>Préférences d'achat</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Utilisation des Données</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Vos données sont utilisées exclusivement pour :
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                      <li>Organiser les achats groupés</li>
                      <li>Vous contacter concernant vos commandes</li>
                      <li>Améliorer notre service</li>
                      <li>Vous informer des nouvelles offres</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Protection des Données</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous mettons en place des mesures de sécurité appropriées pour protéger vos données 
                      contre l'accès non autorisé, la modification, la divulgation ou la destruction.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Partage des Données</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous ne vendons jamais vos données. Nous les partageons uniquement avec nos fournisseurs 
                      partenaires dans le cadre de la réalisation de vos commandes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Vos Droits</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles. 
                      Contactez-nous à contact@achatons.sn pour exercer ces droits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="legal">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-achatons-brown">Mentions Légales</CardTitle>
                  <CardDescription>
                    Informations sur l'entreprise et le site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Éditeur du Site</h3>
                    <div className="text-gray-700 space-y-1">
                      <p><strong>Dénomination :</strong> Achat'ons</p>
                      <p><strong>Forme juridique :</strong> Startup innovante</p>
                      <p><strong>Siège social :</strong> Dakar, Sénégal</p>
                      <p><strong>Téléphone :</strong> +221 78 218 94 29</p>
                      <p><strong>Email :</strong> contact@achatons.sn</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Directeur de Publication</h3>
                    <p className="text-gray-700">
                      Le directeur de la publication est le représentant légal d'Achat'ons.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Hébergement</h3>
                    <p className="text-gray-700">
                      Le site est hébergé par des services cloud sécurisés avec une infrastructure 
                      respectueuse des standards internationaux de sécurité.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Propriété Intellectuelle</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Tous les contenus présents sur ce site (textes, images, logos, etc.) sont protégés 
                      par le droit d'auteur. Toute reproduction sans autorisation est interdite.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Loi Applicable</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Le présent site et son utilisation sont régis par le droit sénégalais. 
                      Tout litige sera de la compétence des tribunaux de Dakar.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-achatons-brown">Questions Fréquentes</CardTitle>
                  <CardDescription>
                    Trouvez rapidement les réponses à vos questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Comment fonctionne l'achat groupé ?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Vous vous inscrivez à une offre d'achat groupé. Une fois le nombre minimum de participants 
                      atteint, nous passons commande chez le fournisseur. Vous bénéficiez ainsi du prix de gros 
                      même pour de petites quantités.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Quand dois-je payer ?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Le paiement s'effectue généralement à la livraison ou selon les modalités convenues 
                      avec le fournisseur. Aucun paiement n'est requis avant confirmation de la commande.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Que se passe-t-il si l'objectif n'est pas atteint ?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Si le nombre minimum de participants n'est pas atteint avant la date limite, 
                      l'achat groupé est annulé. Vous êtes automatiquement notifié et aucun engagement 
                      financier n'est requis.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Comment sont sélectionnés les fournisseurs ?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous privilégions les fournisseurs locaux sénégalais qui respectent nos critères 
                      de qualité et de fiabilité. Chaque partenaire est soigneusement sélectionné pour 
                      garantir la satisfaction de nos utilisateurs.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Puis-je annuler ma participation ?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Vous pouvez annuler votre participation avant que l'objectif soit atteint. 
                      Une fois la commande confirmée, les conditions d'annulation dépendent du fournisseur.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Comment proposer un produit ?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Contactez-nous via WhatsApp ou email pour suggérer des produits. Nous étudions 
                      chaque demande et organisons des achats groupés selon la demande et la faisabilité.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-achatons-orange mb-3">Le service est-il gratuit ?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      L'inscription et la participation aux achats groupés sont entièrement gratuites 
                      pour les consommateurs. Nous sommes rémunérés par une commission prélevée auprès 
                      des fournisseurs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPages;
