from flask import Flask, request, abort
from flask_cors import CORS
from time import sleep
import serial

app = Flask(__name__)
ser = serial.Serial("/dev/tty.usbmodem2101", 115200)

# CORS settings - allow any port on same origin
CORS(app, supports_credentials=True)


# def custom_cors():
#     origin = request.headers.get("Origin")
#     if origin:
#         from urllib.parse import urlparse

#         parsed_origin = urlparse(origin)
#         if parsed_origin.hostname != request.host.split(":")[0]:  # Check same host
#             abort(403)  # Forbidden


# @app.before_request
# def check_origin():
#     custom_cors()


# Route
@app.route("/", methods=["POST"])
def root():
    body = request.get_json()
    bpm = int(body.get("bpm"))
    sequence = [int(b) for b in body.get("sequence")]

    beat_length = 60 / bpm
    quaver_length = beat_length / 2
    vibration_length = quaver_length / 2

    print(quaver_length)

    print(sequence)

    for note in sequence:
        if note == 1:
            ser.write("1".encode())
            sleep(vibration_length)
            ser.write("0".encode())
            sleep(quaver_length - vibration_length)
        else:
            sleep(quaver_length)

    return "All good sexy boy :)", 200


# Run
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5050,
    )
