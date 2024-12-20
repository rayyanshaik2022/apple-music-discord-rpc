from winrt.windows.media.control import ( # type: ignore
    GlobalSystemMediaTransportControlsSessionManager as GSMTCSessionManager,
)
import asyncio


async def get_apple_music_info():
    # Get the session manager
    manager = await GSMTCSessionManager.request_async()
    sessions = manager.get_sessions()

    for session in sessions:
        info = await session.try_get_media_properties_async()
        playback_info = session.get_playback_info()
        timeline = session.get_timeline_properties()

        # print(info.title, info.artist, session.source_app_user_model_id)

        if "AppleMusic" in session.source_app_user_model_id:  # Adjust this condition
            track_name = " ".join(info.title.split())
            artist = info.artist
            album = info.album_title

            # Convert TimeSpan objects to seconds
            duration = (
                timeline.end_time.duration / 10_000_000 if timeline.end_time else None
            )
            position = (
                timeline.position.duration / 10_000_000 if timeline.position else None
            )

            return track_name, artist, album, position, duration

    return None, None, None, None, None


if __name__ == "__main__":
    # Run the async function (in process)
    track_name, artist, album, position, duration = asyncio.run(get_apple_music_info())
    
    if not track_name or not artist:
        print("not_playing")
    else:
        print(f"{track_name}|{artist}|{album}|{position}|{duration}")

    # track_name, artist, album, position, duration = asyncio.run(get_apple_music_info())
    # print("Track:", track_name)
    # print("Artist:", artist)
    # print("Album:", album)
    # print("Position (s):", position)
    # print("Duration (s):", duration)
