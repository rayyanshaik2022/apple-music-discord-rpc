import RpcStatusIndicator from './components/RpcStatusIndicator'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  // Example data
  const albumArtUrl = 'https://placehold.co/400x400'
  const trackName = 'Imagine'
  const trackArtist = 'John Lennon'
  const artistImageUrl = 'https://placehold.co/400x400'
  const currentTime = 90 // in seconds
  const maxDuration = 180 // in seconds

  // Compute progress percentage
  const progressPercent = (currentTime / maxDuration) * 100

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-neutral-800 text-white">
      <RpcStatusIndicator />
      {/* 1. Centered Album Art */}
      <div className="w-64 h-64 min-h-64 rounded-md overflow-hidden flex items-center justify-center mb-8 border-2 border-neutral-900-500">
        <img src={albumArtUrl} alt="Album Art" className="w-full h-full object-cover" />
      </div>

      {/* 2. Description Component (70% width) */}
      <div className="w-4/5 md:w-3/5 lg:w-2/5 flex items-center justify-between mb-4 bg-neutral-700 p-4 rounded-md">
        <div className="flex flex-col">
          <span className="font-bold text-lg hover:cursor-pointer">{trackName}</span>
          <span className="text-gray-300 text-sm hover:cursor-pointer">{trackArtist}</span>
        </div>
        <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-neutral-900 flex-shrink-0 ml-4">
          <img src={albumArtUrl} alt="Artist" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 3. Slider (same width as description) */}
      <div className="w-4/5 md:w-3/5 lg:w-2/5 flex flex-col">
        <span className="mb-2">Progress:</span>
        <div className="w-full h-[6px] bg-neutral-700 rounded-md overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-400 mt-2 flex flex-row justify-between">
          <p>
            {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, '0')}{' '}
          </p>
          <p>
            {Math.floor(maxDuration / 60)}:{String(maxDuration % 60).padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
