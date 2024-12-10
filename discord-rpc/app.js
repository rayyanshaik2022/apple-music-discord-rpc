const RPC = require("discord-rpc");
require("dotenv").config();

// Helper functions
const { iTunesSearch, timeStrToMs } = require("./utils");

const clientId = process.env.discordClientId;

// Discord client image keys
const appleMusicLogo = "apple_music_icon_1024";

const rpc = new RPC.Client({ transport: "ipc" });

// Track when a new song is played (name)
let lastTrackName = null;
// Track when a new song was started (time)
let playedFrom = null;

async function updateActivityStatus() {
  if (!rpc) return;

  const url = "http://127.0.0.1:5000/query";

  // Variables of interest
  let current_time, duration, track_album, track_artist, track_name;

  // Fetch data from Apple Music application
  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    console.log("Track Data:", data);

    ({ current_time, duration, track_album, track_artist, track_name } = data);
  } catch (error) {
    console.error(
      "Could not update status.\nError fetching track info:",
      error
    );
    return;
  }

  // If this is true, no song is playing
  if (!track_name || !track_artist) {
    console.log("No song playing, nothing to update.");
    return;
  }

  // Handle song change / new song
  if (track_name != lastTrackName) {
    lastTrackName = track_name;
    playedFrom = Date.now();
  }

  // Get album cover and artist URLS
  const iTunesUrls = await iTunesSearch(track_artist, track_album);

  // Update discord activity status
  try {
    let activityConfig = {
      details: track_name,
      state: `${track_artist} — ${track_album}`,

      // If we have a known time (not always consistent) then use that
      // Otherwise use the time delta from when we know we started
      // a new song.
      startTimestamp: current_time
        ? Date.now() - timeStrToMs(current_time)
        : playedFrom,

      largeImageKey: iTunesUrls ? iTunesUrls.albumCoverUrl : appleMusicLogo,
      largeImageText: `${track_name} — ${track_artist}`,
    };

    // Add buttons if we have the data for it
    if (iTunesUrls) {
      activityConfig.buttons = [
        { label: "View Artist", url: iTunesUrls.artistUrl },
      ];
    }

    rpc.setActivity(activityConfig);
    console.log("Activity updated.");
  } catch (error) {
    console.error("Error updating discord status:", error);
  }
}

// Event handlers
rpc.on("ready", () => {
  console.log("Connected to Discord!");

  // Fetch the track info every 5 seconds
  setInterval(updateActivityStatus, 3000);

  // Immediately fetch and update activity status once connected
  updateActivityStatus();
});

// Connect the client
rpc.login({ clientId }).catch(console.error);
