import { exec } from "child_process";

function getMusicData(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Run the AppleScript file using osascript
    exec(
      `osascript ./scripts/music_data.applescript`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
        // stdout will contain the output from the AppleScript
        resolve(stdout.trim());
      }
    );
  });
}

async function main() {
  try {
    const result = await getMusicData();
    if (result === "not_playing") {
      console.log("No track is currently playing.");
    } else {
      // Parse the pipe-delimited string
      const [
        trackName,
        trackArtist,
        trackAlbum,
        trackDuration,
        trackGenre,
        trackPlayedCount,
        trackRating,
        trackYear,
        trackAlbumArtist,
        currentPosition
      ] = result.split("|");

      console.log("Track Name:", trackName);
      console.log("Artist:", trackArtist);
      console.log("Album:", trackAlbum);
      console.log("Duration (s):", trackDuration);
      console.log("Genre:", trackGenre);
      console.log("Played Count:", trackPlayedCount);
      console.log("Rating:", trackRating);
      console.log("Year:", trackYear);
      console.log("Album Artist:", trackAlbumArtist);
      console.log("The Position:", currentPosition);
    }
  } catch (err) {
    console.error("Error executing AppleScript:", err);
  }
}

main();
