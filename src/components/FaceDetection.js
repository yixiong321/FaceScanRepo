import { useEffect, useState, useRef } from "react";
import {
  loadTinyFaceDetectorModel,
  detectSingleFace,
  TinyFaceDetectorOptions,
  resizeResults,
  matchDimensions,
  draw,
  loadFaceLandmarkTinyModel,
} from "face-api.js";
import { Button, Modal } from "react-bootstrap";
import AttendanceDataService from "../service/attendance-http";

const FaceDetection = ({ session_id }) => {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [detected, setDetected] = useState(false);
  const [camera, setCamera] = useState(false);
  const initialCapturedStatus = {
    capture: false,
    error: false
  }
  const [capturedStatus, setCapturedStatus] = useState(initialCapturedStatus);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setVideo(videoRef.current);
    setCanvas(canvasRef.current);
  }, []);

  useEffect(async() => {
    if (detected) {
      let success = await captureImage()
      setTimeout(() => {
        setCapturedStatus(initialCapturedStatus)
      }, 5000)
    }
  }, [detected]);

  const start = async () => {
    await launchCamera();
    const recognition = makeRecognition();
    await recognition.init();
    recognition.start();
  };

  const getFaceDetectorOptions = () =>
    new TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

  const makeRecognition = () => {
    let ctx;

    const init = async () => {
      await loadTinyFaceDetectorModel(`models`);
      await loadFaceLandmarkTinyModel("models");
      ctx = canvas.getContext("2d");
    };

    const start = async () => {
      await wait(0);
      if (video.readyState === 4) {
        const faces = await detectSingleFace(
          video,
          getFaceDetectorOptions()
        ).withFaceLandmarks(true);
        if (faces) {
          setDetected(true);
          const dims = matchDimensions(canvas, video, true);
          const resizedResults = resizeResults(faces, dims);
          if (true) {
            draw.drawDetections(canvas, resizedResults);
          }
        } else {
          setDetected(false);
          ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
        }
      }
      start();
    };

    return { init, start };
  };

  const launchCamera = () =>
    new Promise((resolve) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true,
        })
        .then(
          (stream) => {
            video.srcObject = stream;
            video.play();
            setCamera(true);
            resolve();
          },
          () => {}
        );
    });

  const captureImage = async() => {
    const captureCanvas = document.getElementById("captureCanvas");
    const context = captureCanvas.getContext("2d");
    const image = videoRef.current;
    context.drawImage(image, 0, 0, 600, 500);
    captureCanvas.toBlob(async(blob) => {

      let file = new File([blob], 'test.jpg');
      let fd = new FormData();
      fd.append("photo", file);
      fd.append("type", 'image/jpg');
      const {data: {success}} = await AttendanceDataService.postNewAttendance(session_id, fd)
      if(success){
        setCapturedStatus({
          ...capturedStatus,
          capture: true,
          error: false
        })
      }
      else{
        setCapturedStatus({
          ...capturedStatus,
          capture: false,
          error: true
        })
      }
    });
  }
  return (
    <div className="attendance-taking">
      {camera ? (
        <Button onClick={() => window.close()} className="w-25">End Session</Button>
      ) : (
        <Button onClick={start} className="w-25">Launch Camera</Button>
      )}
      <video className="canvas" width="600" height="500" ref={videoRef} />
      <canvas className="canvas" ref={canvasRef} />
      {camera && capturedStatus.capture && (
        <Modal
          show={capturedStatus.capture}
          centered
          size="sm"
          className="face-capture-modal"
        >
          <Modal.Header className="bg-success text-center font-weight-bold">
            <Modal.Body className="mt-3">Face Captured</Modal.Body>
          </Modal.Header>
          <Modal.Footer className="bg-success"></Modal.Footer>
        </Modal>
      )}
      {camera && capturedStatus.error && (
        <Modal
          show={capturedStatus.error}
          centered
          size="sm"
          className="face-capture-modal"
        >
          <Modal.Header className="bg-danger text-center font-weight-bold">
            <Modal.Body className="mt-3">Face Not Recognized, Try Again!</Modal.Body>
          </Modal.Header>
          <Modal.Footer className="bg-danger"></Modal.Footer>
        </Modal>
      )}
      <canvas id="captureCanvas" width="600" height="500" />
    </div>
  );
};

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default FaceDetection;
