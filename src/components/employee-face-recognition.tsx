import * as faceapi from "face-api.js";
import { useEmployees } from "@/hooks/useEmployees";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { Camera } from "@/camera";
import { Button } from "./ui/button";
import { CameraIcon, CameraOffIcon, CheckIcon, LogOutIcon } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function EmployeeFaceRecognition() {
  const {
    employees,
    handleNewEmployeeRegister,
    handleEmployeeClockedOut,
    handleEmployeeIsWorking,
  } = useEmployees();
  const { getMediaURL } = useFirebaseStorage();

  const streamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraIsOn, setCameraIsOn] = useState<boolean>(false);
  const [detectedEmployee, setDetectedEmployee] = useState<string | null>(null);

  function setup() {
    if (!employees)
      return toast.error("Employees not found", { position: "bottom-right" });

    Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ]).then(start);
  }

  async function start() {
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMacther = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    const video = streamRef!.current!;
    await new Camera(video).run();
    handleCameraIsOn();
    const canvas = canvasRef!.current!;
    const displaySize = { width: video.width, height: video.height };
    if (canvas) {
      faceapi.matchDimensions(canvas as HTMLCanvasElement, displaySize);
    }

    async function detectFaces() {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const results = resizedDetections.map((d) =>
        faceMacther.findBestMatch(d.descriptor)
      );

      (canvas as HTMLCanvasElement)
        .getContext("2d")!
        .clearRect(
          0,
          0,
          (canvas as HTMLCanvasElement).width,
          (canvas as HTMLCanvasElement).height
        );

      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        setDetectedEmployee(result.label);
        drawBox.draw(canvas as HTMLCanvasElement);
      });

      setTimeout(detectFaces, 100);
    }

    detectFaces();
  }

  async function loadLabeledImages() {
    const labels = employees!.map((employee) => employee.name) || [];
    const descriptors = await Promise.all(
      labels.map(async (label: string) => {
        const descriptions = [];
        const fileURL = await getMediaURL(`gym/${label}`);
        const img = await faceapi.fetchImage(fileURL);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections!.descriptor);

        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
    return descriptors;
  }

  function handleCameraIsOn() {
    if (cameraIsOn) {
      const video = streamRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop(); // this stops the camera
        });
        video.srcObject = null;
      }
      canvasRef!
        .current!.getContext("2d")!
        .clearRect(0, 0, canvasRef!.current!.width, canvasRef!.current!.height);
      setCameraIsOn(false);
    } else {
      setCameraIsOn(true);
      streamRef!.current!.play();
    }
  }

  function handleClockOut() {
    handleEmployeeClockedOut(detectedEmployee!);
    handleCameraIsOn();
    setDetectedEmployee(null);
  }

  function handleRegister() {
    const employee = employees!.find(
      (employee) => employee.name === detectedEmployee
    );
    handleNewEmployeeRegister({
      ...employee!,
      clockedIn: new Date(),
      clockedOut: null,
      day: new Date(),
    });
    handleCameraIsOn();
    setDetectedEmployee(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {cameraIsOn ? (
          <Button onClick={handleCameraIsOn} className="cursor-pointer">
            <CameraOffIcon />
            Close camera
          </Button>
        ) : (
          <Button onClick={setup} className="cursor-pointer">
            <CameraIcon />
            Open camera
          </Button>
        )}
        {handleEmployeeIsWorking(detectedEmployee!) ? (
          <Button
            onClick={handleClockOut}
            variant="outline"
            disabled={!detectedEmployee ? true : false}
            className="cursor-pointer"
          >
            <LogOutIcon />
            Clock out
          </Button>
        ) : (
          <Button
            onClick={handleRegister}
            variant="outline"
            disabled={!detectedEmployee ? true : false}
            className="cursor-pointer"
          >
            <CheckIcon />
            Clock in
          </Button>
        )}
      </div>
      <div
        className="shadow-lg rounded-md bg-gray-100"
        style={{ position: "relative", width: "640px", height: "480px" }}
      >
        {!cameraIsOn && (
          <div className="flex justify-center items-center w-full h-full">
            <CameraOffIcon size={42} />
          </div>
        )}
        <video
          ref={streamRef}
          id="videoElement"
          className="rounded-md"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          autoPlay
          muted
        ></video>
        <canvas
          ref={canvasRef}
          id="facesCanvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></canvas>
      </div>
    </div>
  );
}
