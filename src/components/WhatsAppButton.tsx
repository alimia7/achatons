
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "782189429";
  const message = "Bonjour, je suis intéressé(e) par la plateforme Achat'ons. Pouvez-vous me donner plus d'informations ?";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-float z-50"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppButton;
