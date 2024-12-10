def parse_artist_album(input_string):
    if "—" in input_string:
        # Split only on the first occurrence of "—"
        artist, album = input_string.split("—", 1)
        # Strip any leading or trailing whitespace
        artist = artist.strip()
        album = album.strip()
        return artist, album
    else:
        raise ValueError("Input string does not contain a valid separator '—'.")