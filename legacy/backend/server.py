from flask import Flask, jsonify
from app_handler import AppleMusicHandler

apple_music = AppleMusicHandler()

app = Flask(__name__)


@app.route("/query", methods=["GET"])
def track_info():

    current_time, duration, track_name, track_artist, track_album = (
        apple_music.get_all()
    )

    return jsonify(
        {
            "current_time": current_time,
            "duration": duration,
            "track_name": track_name,
            "track_artist": track_artist,
            "track_album": track_album,
        }
    )


if __name__ == "__main__":
    app.run(port=5000)  # Run on localhost:5000
