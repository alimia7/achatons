
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Facebook, Twitter, Copy, Linkedin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  productName: string;
  productPrice: string;
  productUrl: string;
}

const ShareButton = ({ productName, productPrice, productUrl }: ShareButtonProps) => {
  const { toast } = useToast();
  
  const shareText = `Découvrez cette offre d'achat groupé: ${productName} à ${productPrice} sur Achat'ons!`;
  const fullUrl = `${window.location.origin}${productUrl}`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't have a direct web share URL, so we'll copy the link with Instagram-friendly text
    const instagramText = `${shareText} ${fullUrl} #AchatGroupe #BonsPlans #Economie #Shopping`;
    navigator.clipboard.writeText(instagramText).then(() => {
      toast({
        title: "Texte copié pour Instagram!",
        description: "Le texte a été copié. Vous pouvez maintenant le coller dans Instagram.",
      });
    });
  };

  const handleTikTokShare = () => {
    // TikTok doesn't have a direct web share URL, so we'll copy the link with TikTok-friendly text
    const tiktokText = `${shareText} ${fullUrl} #AchatGroupe #BonsPlans #TikTokMadeMyBuy`;
    navigator.clipboard.writeText(tiktokText).then(() => {
      toast({
        title: "Texte copié pour TikTok!",
        description: "Le texte a été copié. Vous pouvez maintenant le coller dans TikTok.",
      });
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${fullUrl}`);
      toast({
        title: "Lien copié!",
        description: "Le lien a été copié dans votre presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 hover:bg-achatons-orange hover:text-white"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Partager</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleInstagramShare} className="cursor-pointer">
          <div className="h-4 w-4 mr-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded flex items-center justify-center text-xs font-bold text-white">I</div>
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLinkedInShare} className="cursor-pointer">
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTikTokShare} className="cursor-pointer">
          <div className="h-4 w-4 mr-2 bg-black text-white rounded flex items-center justify-center text-xs font-bold">T</div>
          TikTok
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2 text-gray-600" />
          Copier le lien
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
