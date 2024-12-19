from winrt.windows.media.control import (
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

        print(info.title, info.artist, session.source_app_user_model_id)

        if "AppleMusic" in session.source_app_user_model_id:  # Adjust this condition
            track_name = info.title
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


# Run the async function
track_name, artist, album, position, duration = asyncio.run(get_apple_music_info())
print("Track:", track_name)
print("Artist:", artist)
print("Album:", album)
print("Position (s):", position)
print("Duration (s):", duration)
