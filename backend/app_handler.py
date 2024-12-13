from pywinauto.application import Application
from pywinauto.findwindows import ElementNotFoundError

import time
from functools import wraps

from utils import parse_artist_album


def ensure_connection(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if not self.is_connected():
            self.connect()
        return method(self, *args, **kwargs)

    return wrapper


class AppleMusicHandler:
    """
    Establishes connection to Apple Music application
    and allows for querying playing tracks.
    """

    def __init__(self, window_title="Apple Music"):
        self.window_title = window_title
        self.main_win = None
        self.connection_lock = False

    def connect(self):
        if self.connection_lock:
            return

        try:
            self.connection_lock = True
            app = Application(backend="uia").connect(title_re="Apple Music")
            self.main_win = app.window(title_re="Apple Music")
            self.find_all_elements()
            print("Connection to Apple Music established")

        except ElementNotFoundError as err:
            print("Retrying connection in 5 seconds...")
            time.sleep(5)
            self.connection_lock = False
            self.connect()

    def is_connected(self):
        if self.main_win is None:
            return False
        try:
            return self.main_win.exists()
        except ElementNotFoundError:
            return False

    def find_all_elements(self):
        self.current_time_element = self.main_win.child_window(
            auto_id="CurrentTime", control_type="Text"
        )
        self.duration_element = self.main_win.child_window(
            auto_id="Duration", control_type="Text"
        )
        self.track_name_element = self.main_win.child_window(
            auto_id="ScrollingText", control_type="Text", found_index=0
        )
        self.track_artist_album_element = self.main_win.child_window(
            auto_id="ScrollingText", control_type="Text", found_index=1
        )

    def get_current_time(self):
        try:
            return self.current_time_element.window_text()
        except:
            return None

    def get_duration(self):
        try:
            return self.duration_element.window_text()
        except:
            return None

    def get_track_name(self):
        try:
            return self.track_name_element.window_text()
        except:
            return None

    def get_track_artist(self):
        try:
            artist, _ = parse_artist_album(
                self.track_artist_album_element.window_text()
            )
            return artist
        except:
            return None

    def get_track_album(self):
        try:
            _, album = parse_artist_album(self.track_artist_album_element.window_text())
            return album
        except:
            return None

    @ensure_connection
    def get_all(self):
        current_time = self.get_current_time()
        duration = self.get_duration()
        track_name = self.get_track_name()
        track_artist = self.get_track_artist()
        track_album = self.get_track_album()

        return current_time, duration, track_name, track_artist, track_album


if __name__ == "__main__":
    apple_music = AppleMusicHandler()
    apple_music.connect()
