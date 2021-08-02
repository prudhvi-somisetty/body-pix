import React, { useRef, useState } from "react";
//import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "./App.css";
import Modal from "./Modal/modal.js";
//import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [visibility, setVisibility] = useState(true);

  const [show, setShow] = useState(false);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  //
  //const [deviceId, setDeviceId] = React.useState({});
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

  //toggle webcam on and off

  const handleClickCamState = React.useCallback(() => {
    setVisibility((prevState) => (prevState === true ? false : true));
  }, []);

  const runBodysegement = async () => {
    const net = await bodyPix.load();
    console.log("bodypix model loaded");
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    // to check if data is available
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClickCamState}
          >
            Toggle Camera On/Off
          </button>
        </div>
        <div className="buttons">
          <button
            type="button"
            className="btn btn-primary "
            onClick={() => setShow(true)}
          >
            Video Devices present
          </button>
          <Modal
            title="Video Capture Devices"
            onClose={() => setShow(false)}
            show={show}
          >
            <div>
              <b>Video capture devices present on your device:</b>
              {devices.map((device, key) => (
                <div key={key}>
                  <p>{device.label || `Device ${key + 1}`}</p>
                </div>
              ))}
            </div>
          </Modal>

          {devices.length > 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClick}
            >
              Switch camera
            </button>
          ) : null}
        </div>
        <div className="container-fluid">
          {visibility && (
            <div className="stream">
              <Webcam
                ref={webcamRef}
                audio={false}
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
                  width: 480,
                  height: 360,
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
                  width: 480,
                  height: 360,
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="footer">
        <p>
          <b>V2.2 </b>Developed by: Srinivas Prudhvi, Akshata, Asish
        </p>
      </div>
    </div>
  );
}

export default App;
