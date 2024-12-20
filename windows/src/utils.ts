export interface AlbumUrlInfo {
  albumCoverUrl: string;
  artistUrl: string;
}

export async function iTunesSearch(
  artist: string,
  album: string
): Promise<AlbumUrlInfo | null> {
  // Validate inputs
  if (!artist || !album) {
    return null;
  }

  const searchTerm =
    artist.replaceAll(" ", "+").replace(/[^0-9A-Za-z+]/g, "") +
    "+" +
    album.replaceAll(" ", "+").replace(/[^0-9A-Za-z+]/g, "");
  const url = `https://itunes.apple.com/search?term=${searchTerm}&entity=album`;

  // Fetch data from iTunes
  try {
    const response = await fetch(url, { method: "GET" });
    const data: any = await response.json();

    if (data.results && data.results.length > 0) {
      return {
        albumCoverUrl: data.results[0].artworkUrl100,
        artistUrl: data.results[0].artistViewUrl,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.warn("Error fetching album information from iTunes API:", error);
    return null;
  }
}

export const appleMusicLogo = "apple_music_icon_1024";
