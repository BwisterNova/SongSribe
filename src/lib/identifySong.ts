import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SongData {
  title: string;
  artist: string;
  albumArt: string;
  lyrics: string;
  platform?: string;
  source?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  noLyrics?: boolean;
  message?: string;
}

export async function identifySongByUrl(url: string): Promise<SongData | null> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('supabase-functions-identify-song', {
      body: { url },
    });

    if (error) {
      console.error('Error calling identify function:', error);
      throw new Error('Failed to identify song');
    }

    console.log('Full URL Response:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.title || !data.artist) {
      throw new Error("We couldn't fetch lyrics or metadata for this source.");
    }

    return {
      title: data.title,
      artist: data.artist,
      albumArt: data.albumCover || 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
      lyrics: data.lyrics || '',
      platform: data.platform,
      source: data.source,
      noLyrics: !data.lyrics,
      message: data.message,
    };
  } catch (error) {
    console.error('Error identifying song by URL:', error);
    throw error;
  }
}

export async function identifySongByAudio(audioBlob: Blob): Promise<SongData | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please check your environment variables.');
  }
  
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.mp3');

    const response = await fetch(
      `${supabaseUrl}/functions/v1/supabase-functions-identify-song`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
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

    console.log('Full Audio Response:', data);

    if (data.error || !data.title) {
      throw new Error(data.error || data.message || 'Song not found');
    }

    return {
      title: data.title,
      artist: data.artist,
      albumArt: data.albumCover || 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
      lyrics: data.lyrics || '',
      platform: data.platform,
      source: data.source,
      noLyrics: !data.lyrics,
      message: data.message,
      spotifyUrl: data.spotify?.external_urls?.spotify,
      appleMusicUrl: data.apple_music?.url,
    };
  } catch (error) {
    console.error('Error identifying song by audio:', error);
    throw error;
  }
}