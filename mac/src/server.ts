import * as rpc from "discord-rpc";
import * as path from "path";
import { exec } from "child_process";

import { iTunesSearch, appleMusicLogo } from "./utils";

const clientId = "1315758334489661440"; // Replace with your Discord app's client ID
const client = new rpc.Client({ transport: "ipc" });

interface MusicData {
  playing: boolean;
  trackName: string;
  trackArtist: string;
  trackAlbum: string;
  trackDuration: number;
  trackGenre: string;
  trackPlayedCount: number;
  trackRating: number;
  trackYear: number;
  trackAlbumArtist: string;
  currentPosition: number;
}

function getMusicData(): Promise<MusicData> {
  return new Promise((resolve, reject) => {
    // Resolve the absolute path to the AppleScript file
    const scriptPath = path.resolve(
      __dirname,
      "../scripts/music_data.applescript"
    );
    exec(`osascript ${scriptPath}`, (error, stdout) => {
      if (error) {
        return reject(error);
      }

      const result = stdout.trim();
      if (result === "not_playing") {
        resolve({
          playing: false,
          trackName: "",
          trackArtist: "",
          trackAlbum: "",
          trackDuration: 0,
          trackGenre: "",
          trackPlayedCount: 0,
          trackRating: 0,
          trackYear: 0,
          trackAlbumArtist: "",
          currentPosition: 0,
        });
        return;
      }

      //   const [currentStr, totalStr, trackName, artist] = result.split("|");
      let [
        trackName,
        trackArtist,
        trackAlbum,
        trackDurationStr,
        trackGenre,
        trackPlayedCountStr,
        trackRatingStr,
        trackYearStr,
        trackAlbumArtist,
        currentPositionStr,
      ] = result.split("|");

      const trackDuration: number = parseInt(trackDurationStr);
      const trackPlayedCount: number = parseInt(trackPlayedCountStr);
      const trackRating: number = parseInt(trackRatingStr);
      const trackYear: number = parseInt(trackYearStr);
      const currentPosition: number = parseInt(currentPositionStr);

      resolve({
        playing: true,
        trackName,
        trackArtist,
        trackAlbum,
        trackDuration,
        trackGenre,
        trackPlayedCount,
        trackRating,
        trackYear,
        trackAlbumArtist,
        currentPosition,
      });
    });
  });
}

async function updateRichPresence() {
  try {
    const {
      playing,
      trackName,
      trackArtist,
      trackAlbum,
      currentPosition,
      trackDuration,
    } = await getMusicData();
    const iTunesUrls = await iTunesSearch(trackArtist, trackAlbum);

    if (!playing) {
      console.log("No track is playing, clearing rich presence.");
      client.clearActivity();
      return;
    }

    client.setActivity({
      details: trackName,
      state: `${trackArtist} — ${trackAlbum}`,
      startTimestamp: Date.now() - currentPosition * 1000, // Calculate start time
      endTimestamp: Date.now() + (trackDuration - currentPosition) * 1000, // Calculate end time
      largeImageText: `${trackName} — ${trackArtist}`,
      largeImageKey: iTunesUrls ? iTunesUrls.albumCoverUrl : appleMusicLogo,
      instance: false, // TODO : double check what this does exactly
    });

    console.log(
      `Updated Discord status: ${trackName} by ${trackArtist} @ ${currentPosition}s`
    );
  } catch (err) {
    console.error("Error updating rich presence:", err);
  }
}

// Initialize Discord RPC
client.on("ready", () => {
  console.log(`Connected to Discord as ${client.user?.username}`);
  updateRichPresence();
  setInterval(updateRichPresence, 15 * 1000); // Update every 15 seconds
});

client.login({ clientId }).catch(console.error);
