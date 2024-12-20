import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  // Example data
  const albumArtUrl = 'https://example.com/album-art.jpg'
  const trackName = 'Imagine'
  const trackArtist = 'John Lennon'
  const artistImageUrl = 'https://example.com/artist.jpg'
  const currentTime = 90 // in seconds
  const maxDuration = 180 // in seconds

  // Compute progress percentage
  const progressPercent = (currentTime / maxDuration) * 100

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start p-8 bg-gray-900 text-white">
      {/* 1. Centered Album Art */}
      <div className="w-40 h-40 rounded-md overflow-hidden flex items-center justify-center mb-8 border-2 border-cyan-500">
        {/* If you have access to a native image loader, just use <img> directly */}
        <img src={albumArtUrl} alt="Album Art" className="w-full h-full object-cover" />
      </div>

      {/* 2. Description Component (70% width) */}
      <div className="w-4/5 md:w-3/5 lg:w-2/5 flex items-center justify-between mb-4 border-2 border-green-500 p-4 rounded-md">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{trackName}</span>
          <span className="text-gray-300 text-sm">{trackArtist}</span>
        </div>
        <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-yellow-500 flex-shrink-0 ml-4">
          <img src={artistImageUrl} alt="Artist" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 3. Slider (same width as description) */}
      <div className="w-4/5 md:w-3/5 lg:w-2/5 flex flex-col">
        <span className="mb-2">Progress:</span>
        <div className="w-full h-2 bg-gray-700 rounded-md overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-400 mt-2">
          {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, '0')} /
          {Math.floor(maxDuration / 60)}:{String(maxDuration % 60).padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}

export default App
