
// @ts-ignore: Deno global is available in Supabase Edge Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  userPhone: string;
  userName: string;
  productName: string;
  quantity: number;
  groupPrice: number;
}

// @ts-ignore: Deno.serve is available in Supabase Edge Functions
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhone, userName, productName, quantity, groupPrice }: WhatsAppMessage = await req.json();

    console.log('Sending WhatsApp confirmation:', { userPhone, userName, productName, quantity, groupPrice });

    // Format the phone number (remove any non-digit characters and ensure Senegal format)
    const cleanPhone = userPhone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('221') ? cleanPhone : `221${cleanPhone}`;
    
    // Create confirmation message
    const totalPrice = quantity * groupPrice;
    const message = `Bonjour ${userName} ! 🎉

Félicitations ! Votre participation à l'achat groupé a été confirmée avec succès.

📦 Produit : ${productName}
📊 Quantité : ${quantity}
💰 Prix unitaire : ${groupPrice.toLocaleString()} FCFA
💳 Total : ${totalPrice.toLocaleString()} FCFA

Nous vous contacterons très bientôt pour organiser la livraison. 

Merci de faire confiance à Achat'ons ! 
🤝 Ensemble, économisons !

L'équipe Achat'ons
📞 +221 78 218 94 29`;

    // Generate WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    console.log('Generated WhatsApp URL:', whatsappUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        whatsappUrl,
        message: 'WhatsApp confirmation URL generated successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error generating WhatsApp confirmation:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to generate WhatsApp confirmation' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
