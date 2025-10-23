import { SpotifyApi } from "@spotify/web-api-ts-sdk";

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
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

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=spotify',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);
   const refreshToken =
    connectionSettings?.settings?.oauth?.credentials?.refresh_token;
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
const clientId = connectionSettings?.settings?.oauth?.credentials?.client_id;
  const expiresIn = connectionSettings.settings?.oauth?.credentials?.expires_in;
  if (!connectionSettings || (!accessToken || !clientId || !refreshToken)) {
    throw new Error('Spotify not connected');
  }
  return {accessToken, clientId, refreshToken, expiresIn};
}

async function getUncachableSpotifyClient() {
  const {accessToken, clientId, refreshToken, expiresIn} = await getAccessToken();

  const spotify = SpotifyApi.withAccessToken(clientId, {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresIn || 3600,
    refresh_token: refreshToken,
  });

  return spotify;
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
      const spotify = await getUncachableSpotifyClient();
      const results = await spotify.search(query, ["artist"], undefined, limit);
      
      return results.artists.items.map(artist => ({
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
      const spotify = await getUncachableSpotifyClient();
      const results = await spotify.currentUser.topItems("artists", "medium_term", limit, offset);
      
      return results.items.map(artist => ({
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
