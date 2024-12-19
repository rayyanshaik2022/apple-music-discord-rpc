tell application "Music"
    set thePlayerState to player state
    set theVolume to sound volume
    set thePosition to player position
    
    if thePlayerState is playing then
        set theTrack to current track
        set trackName to name of theTrack
        set trackArtist to artist of theTrack
        set trackAlbum to album of theTrack
        set trackDuration to duration of theTrack -- total duration in seconds
        set currentPosition to player position -- current position in seconds
        set trackGenre to genre of theTrack
        set trackPlayedCount to played count of theTrack
        set trackRating to rating of theTrack
        set trackYear to year of theTrack
        set trackAlbumArtist to album artist of theTrack
        
        -- We can convert data to JSON by using a known delimiter and reconstructing in Node.
        return trackName & "|" & trackArtist & "|" & trackAlbum & "|" & trackDuration & "|" & trackGenre & "|" & trackPlayedCount & "|" & trackRating & "|" & trackYear & "|" & trackAlbumArtist & "|" & currentPosition 
    else
        return "not_playing"
    end if
end tell
