import React, { useRef } from "react";
//import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //
  const [deviceId, setDeviceId] = React.useState({});
  const [devices, setDevices] = React.useState([]);

  const handleDevices = React.useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  //
  const FACING_MODE_USER = "user";
  const FACING_MODE_ENVIRONMENT = "environment";

  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  //const WebcamCapture = () => {
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);

  const handleClick = React.useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);
  //};

  const runBodysegement = async () => {
    const net = await bodyPix.load();
    console.log("bodypix model loaded");
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // to chack if data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // get video details
      const video = webcamRef.current.video;
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;

      // set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set canvas width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // make detections
      const person = await net.segmentPersonParts(video);
      //console.log(person);

      // draw mask
      const coloredPartImage = bodyPix.toColoredPartMask(person);

      bodyPix.drawMask(
        canvasRef.current,
        video,
        coloredPartImage,
        0.7,
        0,
        false
      );
    }
  };

  runBodysegement();

  return (
    <div className="App">
      <header className="App-header">
        <p> Real-Time Image Segementation using BodyPix Model</p>
      </header>
      <div>
        <div>
          <p>Please allow permission for camera to start segmentation </p>
        </div>
        <button onClick={handleClick} className="App-btn">
          Switch camera
        </button>
        <div>
          <Webcam
            ref={webcamRef}
            videoConstraints={{
              ...videoConstraints,
              facingMode,
            }}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: "0",
              right: "0",
              textAlign: "center",
              zIndex: 9,
              width: 640,
              height: 480,
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: "0",
              right: "0",
              textAlign: "center",
              zIndex: 9,
              width: 640,
              height: 480,
            }}
          />
        </div>
        <div>
          {devices.map((device, key) => (
            <div>
              <p>{device.label || `Device ${key + 1}`}</p>
            </div>
          ))}
        </div>
      </div>
      <div class="footer">
        <p>Developed by: Srinivas Prudhvi, Akshata, Asish</p>
      </div>
    </div>
  );
}

export default App;
