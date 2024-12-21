import * as rpc from 'discord-rpc'
import * as path from 'path'
import { exec } from 'child_process'

import { iTunesSearch, appleMusicLogo } from './utils'

const clientId = '1315758334489661440'
const client = new rpc.Client({ transport: 'ipc' })

export enum RpcStatus {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected'
}

let status: RpcStatus = RpcStatus.Connecting

export function getRpcStatus() {
  return status
}

interface MusicData {
  playing: boolean
  trackName: string
  trackArtist: string
  trackAlbum: string
  trackDuration: number
  trackGenre: string
  trackPlayedCount: number
  trackRating: number
  trackYear: number
  trackAlbumArtist: string
  currentPosition: number
}

function getMusicData(): Promise<MusicData> {
  return new Promise((resolve, reject) => {
    // Resolve the absolute path to the AppleScript file
    const scriptPath = path.resolve(__dirname, './scripts/music_data.applescript')
    exec(`osascript ${scriptPath}`, (error, stdout) => {
      if (error) {
        return reject(error)
      }

      const result = stdout.trim()
      if (result === 'not_playing') {
        resolve({
          playing: false,
          trackName: '',
          trackArtist: '',
          trackAlbum: '',
          trackDuration: 0,
          trackGenre: '',
          trackPlayedCount: 0,
          trackRating: 0,
          trackYear: 0,
          trackAlbumArtist: '',
          currentPosition: 0
        })
        return
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
        currentPositionStr
      ] = result.split('|')

      const trackDuration: number = parseInt(trackDurationStr)
      const trackPlayedCount: number = parseInt(trackPlayedCountStr)
      const trackRating: number = parseInt(trackRatingStr)
      const trackYear: number = parseInt(trackYearStr)
      const currentPosition: number = parseInt(currentPositionStr)

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
        currentPosition
      })
    })
  })
}

async function updateRichPresence() {
  try {
    const { playing, trackName, trackArtist, trackAlbum, currentPosition, trackDuration } =
      await getMusicData()
    const iTunesUrls = await iTunesSearch(trackArtist, trackAlbum)

    if (!playing) {
      console.log('No track is playing, clearing rich presence.')
      client.clearActivity()
      return
    }

    client.setActivity({
      details: trackName,
      state: `${trackArtist} — ${trackAlbum}`,
      startTimestamp: Date.now() - currentPosition * 1000, // Calculate start time
      endTimestamp: Date.now() + (trackDuration - currentPosition) * 1000, // Calculate end time
      largeImageText: `${trackName} — ${trackArtist}`,
      largeImageKey: iTunesUrls ? iTunesUrls.albumCoverUrl : appleMusicLogo,
      instance: false, // TODO : double check what this does exactly
      ...(iTunesUrls && {
        buttons: [{ label: 'View Artist', url: iTunesUrls.artistUrl }]
      })
    })

    console.log(`Updated Discord status: ${trackName} by ${trackArtist} @ ${currentPosition}s`)
  } catch (err) {
    console.error('Error updating rich presence:', err)
  }
}

// export function initializeDiscordRpc() {
//   client.on('ready', () => {
//     console.log(`Connected to Discord as ${client.user?.username}`)
//     updateRichPresence()
//     setInterval(updateRichPresence, 15 * 1000)
//   })

//   client.login({ clientId }).catch(console.error)
// }

export async function initializeDiscordRpc(sendStatusUpdate: (status: RpcStatus) => void) {
  let updateInterval: NodeJS.Timeout | null = null
  let reconnectionInterval: NodeJS.Timeout | null = null

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Allows frontend to render, and the connect after rendering
  await sleep(2000)

  function clearIntervals() {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
    if (reconnectionInterval) {
      clearInterval(reconnectionInterval)
      reconnectionInterval = null
    }
  }

  client.on('ready', () => {
    console.log('Connected to Discord RPC')
    status = RpcStatus.Connected
    sendStatusUpdate(status)

    // Clear reconnection attempts since we're connected
    if (reconnectionInterval) {
      clearInterval(reconnectionInterval)
      reconnectionInterval = null
    }

    // Clear any existing activity intervals
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }

    // Start updating presence
    updateRichPresence() // Initial update
    updateInterval = setInterval(updateRichPresence, 15 * 1000)
  })

  client.on('disconnected', () => {
    console.log('Disconnected from Discord RPC')
    status = RpcStatus.Disconnected
    sendStatusUpdate(status)

    // Clear existing intervals
    clearIntervals()

    // Start reconnection attempts
    startReconnectionLoop(sendStatusUpdate)
  })

  client.on('error', (err) => {
    console.error('Discord RPC error:', err)
    status = RpcStatus.Disconnected
    sendStatusUpdate(status)

    // Clear existing intervals
    clearIntervals()

    // Start reconnection attempts
    startReconnectionLoop(sendStatusUpdate)
  })

  // Log in to Discord RPC initially
  client
    .login({ clientId })
    .then(() => {
      console.log('Discord RPC login initiated')
      // If the "ready" event has already been fired, update the status
      if (status !== RpcStatus.Connected) {
        console.log('Ensuring status update after login')
        status = RpcStatus.Connected
        sendStatusUpdate(status)
      }
    })
    .catch((err) => {
      console.error('Failed to connect Discord RPC:', err)
      status = RpcStatus.Disconnected
      sendStatusUpdate(status)

      // Start reconnection attempts
      startReconnectionLoop(sendStatusUpdate)
    })

  function startReconnectionLoop(sendStatusUpdate: (status: RpcStatus) => void) {
    if (reconnectionInterval) {
      return // Prevent multiple reconnection intervals
    }

    reconnectionInterval = setInterval(() => {
      console.log('Attempting to reconnect to Discord RPC...')
      status = RpcStatus.Connecting
      sendStatusUpdate(status)

      client
        .login({ clientId })
        .then(() => {
          console.log('Reconnected to Discord RPC')
          status = RpcStatus.Connected
          sendStatusUpdate(status)

          // Clear reconnection loop once connected
          if (reconnectionInterval) {
            clearInterval(reconnectionInterval)
            reconnectionInterval = null
          }
        })
        .catch((err) => {
          console.error('Reconnection failed:', err)
        })
    }, 15 * 1000) // Retry every 15 seconds
  }
}
