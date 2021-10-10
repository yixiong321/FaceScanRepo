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
import { Button, Modal, Spinner } from "react-bootstrap";
import AttendanceDataService from "../service/attendance-http";

const FaceDetection = ({ session_id }) => {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [detected, setDetected] = useState(false);
  const [camera, setCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialCapturedStatus = {
    capture: false,
    capture_msg: {
      name: "",
      matric: "",
      date_time_captured: "",
    },
    error: false,
    error_msg: "",
  };
  const [capturedStatus, setCapturedStatus] = useState(initialCapturedStatus);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setVideo(videoRef.current);
    setCanvas(canvasRef.current);
  }, []);

  useEffect(async () => {
    if (detected && !loading) {
      const timeout = setTimeout(async() => {
        clearTimeout(timeout)
        await captureImage();
      }, 3000)
    }
  }, [detected]);

  useEffect(() =>{
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      setCapturedStatus(initialCapturedStatus);
    }, 3000)
  }, [loading])

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

  const captureImage = async () => {
    setLoading(true);
    const captureCanvas = document.getElementById("captureCanvas");
    const context = captureCanvas.getContext("2d");
    const image = videoRef.current;
    context.drawImage(image, 0, 0, 600, 500);
    captureCanvas.toBlob(async (blob) => {
      let file = new File([blob], "test.jpg");
      let fd = new FormData();
      fd.append("photo", file);
      fd.append("type", "image/jpg");
      try {
        const response = await AttendanceDataService.postNewAttendance(
          session_id,
          fd
        );
        const {
          data: {
            attendance: { date_time_captured },
            student: { name, matric },
          },
        } = response;

        setCapturedStatus({
          ...capturedStatus,
          capture: true,
          capture_msg: {
            ...capturedStatus.capture_msg,
            name,
            matric,
            date_time_captured,
          },
          error: false,
        });
      } catch (e) {
        setCapturedStatus({
          ...capturedStatus,
          capture: false,
          error: true,
          error_msg: e.response?.data[0] || "Reload The Page",
        });
      } finally {
        setLoading(false);
      }
    });
  };
  return (
    <div className="attendance-taking">
      {camera ? (
        <Button onClick={() => window.close()} className="w-25">
          End Session
        </Button>
      ) : (
        <Button onClick={start} className="w-25">
          Launch Camera
        </Button>
      )}
      <video className="canvas" width="600" height="500" ref={videoRef} />
      <canvas className="canvas" ref={canvasRef} />
      {loading && 
        <Spinner className="spinner" animation="border" variant="white" /> 
      }
      {camera && capturedStatus.capture && (
        <Modal
          show={capturedStatus.capture}
          centered
          size="sm"
          className="face-capture-modal"
        >
          <Modal.Header className="bg-success text-center font-weight-bold">
            <Modal.Body className="mt-3">
              <h3>{`Attendance Taken`}</h3>
              <h5>{`Name: ${capturedStatus.capture_msg.name}`}</h5>
              <h5>{`Matric Number: ${capturedStatus.capture_msg.matric}`}</h5>
              <h6>{`Date and Time Taken: ${capturedStatus.capture_msg.date_time_captured}`}</h6>
            </Modal.Body>
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
            <Modal.Body className="mt-3">{capturedStatus.error_msg}</Modal.Body>
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
