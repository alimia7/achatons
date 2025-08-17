
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-achatons-brown text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <img 
              src="/lovable-uploads/73983906-731d-43b7-8b83-4a8583ef68e5.png" 
              alt="Achat'ons Logo" 
              className="h-16 w-auto filter brightness-0 invert"
            />
            <p className="text-achatons-cream leading-relaxed">
              La première plateforme d'achat groupé au Sénégal. 
              Ensemble, économisons et soutenons notre économie locale.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-achatons-cream hover:text-achatons-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-achatons-cream hover:text-achatons-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-achatons-cream hover:text-achatons-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-achatons-orange">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="#avantages" className="text-achatons-cream hover:text-white transition-colors">Avantages</a></li>
              <li><a href="#comment-ca-marche" className="text-achatons-cream hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="#impact" className="text-achatons-cream hover:text-white transition-colors">Notre impact</a></li>
              <li><a href="#" className="text-achatons-cream hover:text-white transition-colors">Nos fournisseurs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-achatons-orange">Légal</h3>
            <ul className="space-y-2">
              <li><Link to="/cgu" className="text-achatons-cream hover:text-white transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/legal" className="text-achatons-cream hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/legal" className="text-achatons-cream hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link to="/faq" className="text-achatons-cream hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-achatons-orange">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-achatons-orange" />
                <span className="text-achatons-cream">+221 78 218 94 29</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-achatons-orange" />
                <span className="text-achatons-cream">contact@achatons.sn</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-achatons-orange" />
                <span className="text-achatons-cream">Dakar, Sénégal</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-achatons-orange border-opacity-30 pt-8 text-center">
          <p className="text-achatons-cream">
            © 2024 Achat'ons. Tous droits réservés. | Développé avec ❤️ pour le Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
