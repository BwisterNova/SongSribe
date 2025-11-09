Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const auddApiKey = Deno.env.get('AUDD_API_KEY');
    
    if (!auddApiKey) {
      throw new Error('AUDD_API_KEY not configured');
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const audioFile = formData.get('audio');

      if (!audioFile) {
        return new Response(
          JSON.stringify({ error: 'Audio file is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const auddFormData = new FormData();
      auddFormData.append('api_token', auddApiKey);
      auddFormData.append('file', audioFile, 'recording.mp3');
      auddFormData.append('return', 'apple_music,spotify,deezer,soundcloud,lyrics');

      const response = await fetch('https://api.audd.io/', {
        method: 'POST',
        body: auddFormData,
      });

      const data = await response.json();
      console.log('AudD Response:', JSON.stringify(data, null, 2));

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid content type. Use multipart/form-data' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
  } catch (error) {
    console.error('Error identifying song:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to identify song',
        message: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});