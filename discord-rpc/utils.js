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

async function iTunesSongSearch(artist, song) {
  if (artist == null || song == null) {
    return null;
  }

  const searchTerm =
    artist.replaceAll(" ", "+").replace(/[^0-9A-Za-z+]/g, "") +
    "+" +
    song.replaceAll(" ", "+").replace(/[^0-9A-Za-z+]/g, "");
  const url = `https://itunes.apple.com/search?term=${searchTerm}&entity=song`;

  // Fetch song data from iTunes
  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    return {
      trackTimeMillis: data.results[0].trackTimeMillis,
      primaryGenreName: data.results[0].primaryGenreName,
    };
  } catch {
    console.warn("Error fetching song information from iTunes API");
    return null;
  }
}

// Helper to convert a time string "M:SS" or "MM:SS" to milliseconds
function timeStrToMs(timeStr) {
  const negative = timeStr.startsWith("-");
  const cleanTime = negative ? timeStr.slice(1) : timeStr;
  const parts = cleanTime.split(":");
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  return (minutes * 60 + seconds) * 1000;
}

module.exports = {
  iTunesSearch,
  iTunesSongSearch,
  timeStrToMs,
};
