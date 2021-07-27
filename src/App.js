//1.install dependencies DONE
//2 import dependencies DONE
//3 setup webcam and canvas DONE
//4 define references to those DONE
//5 load body pix DONE
//6 detect function
//7 draw using drawmask

import React, { useRef } from "react";
//import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

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
        <div>
          <Webcam
            ref={webcamRef}
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
      </header>
    </div>
  );
}

export default App;
