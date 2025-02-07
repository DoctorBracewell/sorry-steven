from flask import Flask, request, abort
from flask_cors import CORS
import serial

app = Flask(__name__)
ser = serial.Serial("/dev/tty.usbmodem2101", 115200)

# CORS settings - allow any port on same origin
CORS(app, supports_credentials=True)


def custom_cors():
    origin = request.headers.get("Origin")
    if origin:
        from urllib.parse import urlparse

        parsed_origin = urlparse(origin)
        if parsed_origin.hostname != request.host.split(":")[0]:  # Check same host
            abort(403)  # Forbidden


@app.before_request
def check_origin():
    custom_cors()


# Route
@app.route("/")
def root():
    return "Hello, Flask!"


# Run
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5050,
    )
