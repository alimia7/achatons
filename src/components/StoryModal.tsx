
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoryModal = ({ isOpen, onClose }: StoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-achatons-brown">L'histoire d'Achat'ons</DialogTitle>
          <DialogDescription className="text-lg">
            Découvrez comment nous révolutionnons la consommation au Sénégal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-achatons-orange mb-3">Notre Vision</h3>
            <p className="leading-relaxed">
              Achat'ons est né d'une vision simple mais puissante : démocratiser l'accès aux prix de gros 
              pour tous les Sénégalais. Nous croyons que chaque famille, chaque individu devrait pouvoir 
              bénéficier des mêmes avantages économiques que les grands acheteurs.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-achatons-orange mb-3">Le Problème</h3>
            <p className="leading-relaxed">
              Au Sénégal, les prix au détail sont souvent 30 à 50% plus élevés que les prix de gros. 
              Cette différence pénalise les familles et les petites entreprises qui n'ont pas le volume 
              d'achat nécessaire pour négocier directement avec les fournisseurs. Résultat : une partie 
              importante du budget familial est consacrée à des achats de base comme le riz, l'huile, 
              ou le sucre.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-achatons-orange mb-3">Notre Solution</h3>
            <p className="leading-relaxed mb-4">
              Achat'ons révolutionne cette approche en créant une plateforme d'achat groupé qui permet à 
              chacun de bénéficier des prix de gros. Notre concept est simple :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Nous négocions directement avec les fournisseurs pour obtenir les meilleurs prix</li>
              <li>Nous regroupons les demandes de plusieurs consommateurs</li>
              <li>Une fois le nombre minimum de participants atteint, nous organisons la livraison</li>
              <li>Chacun économise entre 20% et 40% sur ses achats essentiels</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-achatons-orange mb-3">Impact Social</h3>
            <p className="leading-relaxed">
              Au-delà des économies, Achat'ons crée un impact social positif. Nous soutenons les 
              fournisseurs locaux en leur garantissant des volumes d'achat importants. Nous créons 
              des liens communautaires en encourageant les achats groupés entre voisins. Et surtout, 
              nous libérons du pouvoir d'achat que les familles peuvent consacrer à l'éducation, 
              la santé ou l'épargne.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-achatons-orange mb-3">Nos Valeurs</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-achatons-cream p-4 rounded-lg">
                <h4 className="font-semibold text-achatons-brown">Solidarité</h4>
                <p>Ensemble, nous sommes plus forts pour négocier et économiser.</p>
              </div>
              <div className="bg-achatons-cream p-4 rounded-lg">
                <h4 className="font-semibold text-achatons-brown">Transparence</h4>
                <p>Prix clairs, pas de frais cachés, total transparence sur nos marges.</p>
              </div>
              <div className="bg-achatons-cream p-4 rounded-lg">
                <h4 className="font-semibold text-achatons-brown">Local</h4>
                <p>Nous privilégions les fournisseurs sénégalais et soutenons l'économie locale.</p>
              </div>
              <div className="bg-achatons-cream p-4 rounded-lg">
                <h4 className="font-semibold text-achatons-brown">Innovation</h4>
                <p>Nous utilisons la technologie pour simplifier et optimiser les achats groupés.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-achatons-orange mb-3">L'Avenir</h3>
            <p className="leading-relaxed">
              Notre ambition est de devenir la première plateforme d'achat groupé de l'Afrique de l'Ouest. 
              Nous voulons étendre notre modèle à d'autres pays de la région et diversifier notre offre 
              vers l'électroménager, les produits d'hygiène, et même les services. L'objectif : que chaque 
              famille puisse améliorer son pouvoir d'achat grâce à la force du collectif.
            </p>
          </div>

          <div className="bg-gradient-to-r from-achatons-orange to-achatons-brown p-6 rounded-lg text-white">
            <h3 className="text-xl font-semibold mb-3">Rejoignez l'Aventure</h3>
            <p className="leading-relaxed">
              Achat'ons, c'est plus qu'une plateforme d'achat. C'est un mouvement vers une consommation 
              plus intelligente, plus solidaire et plus économique. Rejoignez-nous et faisons ensemble 
              la révolution de l'achat au Sénégal !
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;
