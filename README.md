# apple-music-discord-rpc

## Apple Music Discord Rich Presence

This project integrates Apple Music with Discord Rich Presence to display detailed playback information about your current track directly in your Discord profile. It uses a Python Flask backend to retrieve information from the Apple Music app and a Node.js application to update your Discord status.

![Example Image](images/discord_activity_status.png)

## Features

- Displays the currently playing track on Apple Music in Discord Rich Presence.
- Includes track title, artist, album, and a progress bar showing elapsed time.
- Dynamically updates information when the track changes.

## Installation

### Prerequisites

- Python 3.7+ with pip installed.
- Node.js with npm installed.
- Apple Music app installed and running on your system.
- Windows System (tested on Windows 11)

### Libraries

Python Libraries

1. `cd backend`
2. `pip install -r requirements.txt`

Node.Js Libraries

1. `cd discord-rpc`
2. `npm install`

## How it works

1. The backend uses `pywinauto` to interface with the Apple Music app, fetching details about the currently playing track.
2. The `Flask` server exposes an API endpoint that provides this information in `JSON` format.
3. The Discord RPC application periodically queries the Flask server and updates your Discord Rich Presence using the `discord-rpc` library.

## Acknowledgements

- [discordjs/RPC](https://github.com/discordjs/RPC)
- [pywinauto](https://github.com/pywinauto/pywinauto)
