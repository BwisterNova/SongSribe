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

    if (contentType.includes('application/json')) {
      const { url } = await req.json();
      
      if (!url) {
        return new Response(
          JSON.stringify({ error: 'URL parameter is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const platform = detectPlatform(url);
      console.log('Detected platform:', platform);

      if (platform === 'Unknown') {
        return new Response(
          JSON.stringify({ 
            error: 'Unsupported link. Try a Spotify, YouTube, Apple Music, SoundCloud, Deezer, Audiomack, or Boomplay link.' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      const metadata = await fetchMetadata(url, platform);
      
      if (!metadata) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch song metadata from this URL' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }

      console.log('Fetched metadata:', metadata);

      let lyrics = await fetchLyricsFromAudD(metadata.title, metadata.artist, auddApiKey);
      let source = 'audd';

      if (!lyrics && metadata.description) {
        console.log('AudD lyrics not found, checking platform metadata...');
        if (looksLikeLyrics(metadata.description)) {
          lyrics = metadata.description;
          source = 'platform_metadata';
        }
      }

      const response = {
        title: metadata.title,
        artist: metadata.artist,
        albumCover: metadata.artwork,
        platform,
        lyrics: lyrics || null,
        source: lyrics ? source : null,
      };

      if (!lyrics) {
        response.message = 'Lyrics not found — try listening via mic instead.';
      }

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else if (contentType.includes('multipart/form-data')) {
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
      console.log('AudD Audio Response:', JSON.stringify(data, null, 2));

      if (data.status === 'success' && data.result) {
        const result = data.result;
        let lyrics = result.lyrics?.lyrics || null;
        let source = 'audd';

        if (!lyrics) {
          console.log('AudD lyrics not found, trying findLyrics...');
          lyrics = await fetchLyricsFromAudD(result.title, result.artist, auddApiKey);
        }

        const albumCover = result.spotify?.album?.images?.[0]?.url || 
                         result.apple_music?.artwork?.url?.replace('{w}', '400').replace('{h}', '400') ||
                         result.deezer?.album?.cover_xl ||
                         'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80';

        const unifiedResponse = {
          title: result.title,
          artist: result.artist,
          albumCover,
          platform: 'Audio Recognition',
          lyrics: lyrics,
          source: lyrics ? source : null,
          spotify: result.spotify,
          apple_music: result.apple_music,
        };

        if (!lyrics) {
          unifiedResponse.message = 'Lyrics not found — try listening via mic instead.';
        }

        return new Response(JSON.stringify(unifiedResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(
        JSON.stringify({ 
          error: 'Song not recognized',
          message: 'Could not identify the song from audio'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid content type. Use application/json or multipart/form-data' }),
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

function detectPlatform(url: string): string {
  if (url.includes('spotify.com')) return 'Spotify';
  if (url.includes('music.apple.com')) return 'Apple Music';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('soundcloud.com')) return 'SoundCloud';
  if (url.includes('deezer.com')) return 'Deezer';
  if (url.includes('audiomack.com')) return 'Audiomack';
  if (url.includes('boomplay.com')) return 'Boomplay';
  return 'Unknown';
}

async function fetchMetadata(url: string, platform: string): Promise<{ title: string; artist: string; artwork: string; description?: string } | null> {
  try {
    let apiUrl = '';
    
    switch (platform) {
      case 'Spotify':
        apiUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
        break;
      case 'YouTube':
        apiUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        break;
      case 'SoundCloud':
        apiUrl = `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        break;
      case 'Deezer':
        apiUrl = `https://www.deezer.com/oembed?url=${encodeURIComponent(url)}`;
        break;
      case 'Apple Music':
        const trackId = extractAppleMusicTrackId(url);
        if (trackId) {
          apiUrl = `https://itunes.apple.com/lookup?id=${trackId}`;
        }
        break;
      case 'Audiomack':
      case 'Boomplay':
        return await fetchGenericMetadata(url, platform);
    }

    if (!apiUrl) return null;

    const response = await fetch(apiUrl);
    if (!response.ok) return null;

    const data = await response.json();

    if (platform === 'Apple Music' && data.results && data.results.length > 0) {
      const track = data.results[0];
      return {
        title: track.trackName || track.collectionName || 'Unknown Title',
        artist: track.artistName || 'Unknown Artist',
        artwork: track.artworkUrl100?.replace('100x100', '400x400') || track.artworkUrl60?.replace('60x60', '400x400') || '',
      };
    }

    let title = data.title || 'Unknown Title';
    let artist = data.author_name || data.author || 'Unknown Artist';
    let description = data.description || '';

    if (platform === 'YouTube' || platform === 'SoundCloud') {
      const parts = title.split(' - ');
      if (parts.length >= 2) {
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }
    }

    return {
      title,
      artist,
      artwork: data.thumbnail_url || data.thumbnail || '',
      description,
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

async function fetchGenericMetadata(url: string, platform: string): Promise<{ title: string; artist: string; artwork: string } | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const ogTitleMatch = html.match(/<meta property="og:title" content="(.*?)"/i);
    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);
    
    let title = ogTitleMatch?.[1] || titleMatch?.[1] || 'Unknown Title';
    const artwork = ogImageMatch?.[1] || '';
    
    const parts = title.split(' - ');
    let artist = 'Unknown Artist';
    
    if (parts.length >= 2) {
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }
    
    return { title, artist, artwork };
  } catch (error) {
    console.error('Error fetching generic metadata:', error);
    return null;
  }
}

function extractAppleMusicTrackId(url: string): string | null {
  const match = url.match(/\/i=(\d+)/);
  if (match) return match[1];
  
  const idMatch = url.match(/\/(\d+)\?/);
  if (idMatch) return idMatch[1];
  
  return null;
}

async function fetchLyricsFromAudD(title: string, artist: string, apiKey: string): Promise<string | null> {
  try {
    const query = `${title} ${artist}`;
    const url = `https://api.audd.io/findLyrics/?q=${encodeURIComponent(query)}&api_token=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('AudD findLyrics response:', JSON.stringify(data, null, 2));

    if (data.status === 'success' && data.result && data.result.length > 0) {
      const match = data.result[0];
      if (match.lyrics) {
        return match.lyrics;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching lyrics from AudD:', error);
    return null;
  }
}

function looksLikeLyrics(text: string): boolean {
  if (!text || text.length < 50) return false;
  
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 4) return false;
  
  const hasVersePattern = /verse|chorus|bridge|intro|outro/i.test(text);
  const hasRepeatingLines = lines.length !== new Set(lines).size;
  const avgLineLength = text.length / lines.length;
  
  return hasVersePattern || (hasRepeatingLines && avgLineLength < 100);
}