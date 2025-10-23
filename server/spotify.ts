let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    const refreshToken = connectionSettings?.settings?.oauth?.credentials?.refresh_token;
    const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
    const clientId = connectionSettings?.settings?.oauth?.credentials?.client_id;
    const expiresIn = connectionSettings.settings?.oauth?.credentials?.expires_in;
    console.log("Using cached Spotify credentials");
    return {accessToken, clientId, refreshToken, expiresIn};
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  console.log("Fetching fresh Spotify credentials from Replit connector...");
  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=spotify',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );
  
  const data = await response.json();
  console.log("Connector response items count:", data.items?.length || 0);
  
  connectionSettings = data.items?.[0];
  
  if (!connectionSettings) {
    console.error("No Spotify connection found in connector response");
    throw new Error('Spotify not connected');
  }
  
  const refreshToken = connectionSettings?.settings?.oauth?.credentials?.refresh_token;
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  const clientId = connectionSettings?.settings?.oauth?.credentials?.client_id;
  const expiresIn = connectionSettings.settings?.oauth?.credentials?.expires_in;
  
  console.log("Credentials fetched - Has accessToken:", !!accessToken, "Has clientId:", !!clientId, "Has refreshToken:", !!refreshToken);
  
  if (!accessToken || !clientId || !refreshToken) {
    console.error("Missing required credentials");
    throw new Error('Spotify not connected - missing credentials');
  }
  return {accessToken, clientId, refreshToken, expiresIn};
}

async function getClientCredentialsToken() {
  try {
    const {clientId} = await getAccessToken();
    
    console.log("Getting client credentials token for public API access");
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(clientId + ':').toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      console.error("Failed to get client credentials token");
      throw new Error("Failed to authenticate with Spotify");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting client credentials:", error);
    throw error;
  }
}

async function makeSpotifyRequest(endpoint: string, requireUserAuth: boolean = false) {
  let accessToken;
  
  if (requireUserAuth) {
    const credentials = await getAccessToken();
    accessToken = credentials.accessToken;
  } else {
    accessToken = await getClientCredentialsToken();
  }
  
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Spotify API error (${response.status}):`, error);
    throw new Error(`Spotify API request failed: ${response.statusText}`);
  }

  return response.json();
}

export interface SpotifyArtist {
  id: string;
  name: string;
  image?: string;
  genres?: string[];
  popularity?: number;
}

class SpotifyService {
  async searchArtists(query: string, limit: number = 20): Promise<SpotifyArtist[]> {
    try {
      console.log(`Searching Spotify for artists: "${query}" (limit: ${limit})`);
      const endpoint = `/search?q=${encodeURIComponent(query)}&type=artist&limit=${Math.min(limit, 50)}`;
      const results = await makeSpotifyRequest(endpoint);
      
      console.log(`Found ${results.artists.items.length} artist results`);
      
      return results.artists.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url,
        genres: artist.genres,
        popularity: artist.popularity,
      }));
    } catch (error) {
      console.error("Error searching Spotify artists:", error);
      throw new Error("Failed to search artists");
    }
  }

  async getUserTopArtists(limit: number = 50, offset: number = 0): Promise<SpotifyArtist[]> {
    try {
      console.log(`Fetching user's top artists (limit: ${limit}, offset: ${offset})`);
      const endpoint = `/me/top/artists?time_range=medium_term&limit=${Math.min(limit, 50)}&offset=${offset}`;
      const results = await makeSpotifyRequest(endpoint);
      
      console.log(`Found ${results.items.length} top artists`);
      
      return results.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url,
        genres: artist.genres,
        popularity: artist.popularity,
      }));
    } catch (error) {
      console.error("Error fetching user's top artists:", error);
      throw new Error("Failed to fetch top artists");
    }
  }

  async getUserTopArtistsMultiplePages(totalLimit: number = 100): Promise<SpotifyArtist[]> {
    const allArtists: SpotifyArtist[] = [];
    const pageSize = 50;
    const pages = Math.ceil(totalLimit / pageSize);

    for (let i = 0; i < pages; i++) {
      const offset = i * pageSize;
      const limit = Math.min(pageSize, totalLimit - offset);
      const artists = await this.getUserTopArtists(limit, offset);
      allArtists.push(...artists);
      
      if (artists.length < limit) {
        break;
      }
    }

    return allArtists;
  }
}

export const spotifyService = new SpotifyService();
