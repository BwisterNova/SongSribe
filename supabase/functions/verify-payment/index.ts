const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    metadata: {
      custom_fields: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
    customer: {
      email: string;
    };
    paid_at: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { reference } = await req.json();

    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Payment reference is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const verifyData: PaystackVerifyResponse = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return new Response(
        JSON.stringify({ 
          error: 'Payment verification failed',
          message: verifyData.message 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Extract metadata
    const metadata = verifyData.data.metadata.custom_fields.reduce((acc, field) => {
      acc[field.variable_name] = field.value;
      return acc;
    }, {} as Record<string, string>);

    const planId = metadata.plan;
    const billingCycle = metadata.billing_cycle;
    const userId = metadata.user_id;

    // Here you would typically:
    // 1. Update the user's subscription in your database
    // 2. Set subscription expiry date
    // 3. Send confirmation email

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: verifyData.data.reference,
          amount: verifyData.data.amount / 100, // Convert from kobo to naira
          currency: verifyData.data.currency,
          plan: planId,
          billingCycle,
          userId,
          paidAt: verifyData.data.paid_at,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Payment verification failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
