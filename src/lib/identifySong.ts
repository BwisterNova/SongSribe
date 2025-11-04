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
}

export async function identifySongByUrl(url: string): Promise<SongData | null> {
  try {
    const { data, error } = await supabase.functions.invoke('supabase-functions-identify-song', {
      body: { url },
    });

    if (error) {
      console.error('Error calling identify function:', error);
      throw new Error('Failed to identify song');
    }

    console.log('Full AudD Response:', data);

    if (data.status === 'error' || !data.result) {
      throw new Error(data.error?.error_message || 'Song not found');
    }

    const result = data.result;
    
    const albumArt = result.spotify?.album?.images?.[0]?.url || 
                     result.apple_music?.artwork?.url?.replace('{w}', '400').replace('{h}', '400') ||
                     result.song_link || 
                     'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80';

    const lyrics = result.lyrics?.lyrics || '';

    if (!lyrics) {
      console.warn('No lyrics available for this song');
    }

    return {
      title: result.title || 'Unknown Title',
      artist: result.artist || 'Unknown Artist',
      albumArt,
      lyrics,
      spotifyUrl: result.spotify?.external_urls?.spotify,
      appleMusicUrl: result.apple_music?.url,
    };
  } catch (error) {
    console.error('Error identifying song by URL:', error);
    throw error;
  }
}

export async function identifySongByAudio(audioBlob: Blob): Promise<SongData | null> {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

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

    console.log('Full AudD Audio Response:', data);

    if (data.status === 'error' || !data.result) {
      throw new Error(data.error?.error_message || 'Song not found');
    }

    const result = data.result;
    
    const albumArt = result.spotify?.album?.images?.[0]?.url || 
                     result.apple_music?.artwork?.url?.replace('{w}', '400').replace('{h}', '400') ||
                     result.song_link || 
                     'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80';

    const lyrics = result.lyrics?.lyrics || '';

    if (!lyrics) {
      console.warn('No lyrics available for this song');
    }

    return {
      title: result.title || 'Unknown Title',
      artist: result.artist || 'Unknown Artist',
      albumArt,
      lyrics,
      spotifyUrl: result.spotify?.external_urls?.spotify,
      appleMusicUrl: result.apple_music?.url,
    };
  } catch (error) {
    console.error('Error identifying song by audio:', error);
    throw error;
  }
}