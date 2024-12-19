async function iTunesSearch(artist, album) {
  // Validate inputs
  if (artist == null || album == null) {
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
    const data = await response.json();

    return {
      albumCoverUrl: data.results[0].artworkUrl100,
      artistUrl: data.results[0].artistViewUrl,
    };
  } catch {
    console.warn("Error fetching album information from iTunes API");
    return null;
  }
}
