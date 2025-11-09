import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface SongData {
  title: string;
  artist: string;
  albumArt: string;
  lyrics: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  noLyrics?: boolean;
}

export async function identifySongByAudio(audioBlob: Blob): Promise<SongData | null> {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.mp3');

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/supabase-functions-identify-song`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error:', errorText);
      throw new Error('Failed to identify song from audio');
    }

    const data = await response.json();

    console.log('Full Response:', data);

    if (data.status === 'error' || !data.result) {
      throw new Error(data.error?.error_message || 'Song not found');
    }

    const result = data.result;
    const lyrics = result.lyrics?.lyrics || '';
    const albumArt = result.spotify?.album?.images?.[0]?.url || 
                     result.apple_music?.artwork?.url?.replace('{w}', '400').replace('{h}', '400') ||
                     result.deezer?.album?.cover_xl ||
                     'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80';

    return {
      title: result.title,
      artist: result.artist,
      albumArt,
      lyrics,
      noLyrics: !lyrics,
      spotifyUrl: result.spotify?.external_urls?.spotify,
      appleMusicUrl: result.apple_music?.url,
    };
  } catch (error) {
    console.error('Error identifying song by audio:', error);
    throw error;
  }
}