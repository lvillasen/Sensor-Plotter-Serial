# ESP32 Sensor Plotter with a Serial Port

This app plots and prints data sent by an ESP32 microcontroller through the serial port using the codes provided to control different sensors. The Arduino IDE software can be used to compile and upload these codes to an ESP32.

This Web App can also be used to perform a Discrete Fourier Transform to analyse the data in the frequency domain. Alternately, you can copy and paste the data here to get a full calculation of the Discrete Fourier Transform.


## Usage

- This app requires an ESP32 microcontroller
- Clone the repository
- Program the ESP32 microcontroller with the code provided for each sensor using the Arduino IDE software.
- Connect a serial port cable between the computer and a source device.
- Open the file index.html with any web browser that supports the Web Serial API.
- Select 115200 baud and click the Connect button.

## Live Demo

https://ciiec.buap.mx/Sensor-Plotter-Serial/

## Credits

- We use the Serial Web API (https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API).

## License

[MIT](LICENSE)
