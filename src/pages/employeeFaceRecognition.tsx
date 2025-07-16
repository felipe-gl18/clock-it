import * as faceapi from "face-api.js";
import { Camera } from "@/camera";
import { Button } from "@/components/ui/button";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { CameraIcon, CameraOff, Check, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useEmployeeTimeRecord } from "@/hooks/useEmployeeTimeRecord";
import { useNavigate, useParams } from "react-router-dom";
import type { EmployeeWithId } from "@/contexts/EmployeesContext";
import type {
  EmployeeTimeRecord,
  EmployeeTimeRecordWithId,
} from "@/contexts/EmployeeTimeRecordContext";
import Loading from "@/components/loading";

export default function EmployeeTimeRecord() {
  const navigate = useNavigate();

  const { token } = useParams<{ token: string }>();
  const { getEmployeesByUserId, getPendingEmployeeTimeRecord } =
    useFirebaseStorage();

  const { handleNewEmployeeTimeRecord } = useEmployeeTimeRecord();
  const { getMediaURL, verifyFaceRecognitionToken, updateEmployeeTimeRecord } =
    useFirebaseStorage();

  const streamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [employees, setEmployees] = useState<EmployeeWithId[] | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [detectedEmployee, setDetectedEmployee] = useState<string | null>(null);
  const [pendingEmployeeTimeRecord, setPendingEmployeeTimeRecord] =
    useState<EmployeeTimeRecordWithId | null>(null);

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
    setIsCameraLoading(true);
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMacther = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
    const video = streamRef!.current!;
    await new Camera(video).run();
    setIsCameraLoading(false);
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
        drawBox.draw(canvas as HTMLCanvasElement);
        if (result.label === "unknown") {
          setDetectedEmployee(null);
          return;
        }
        setDetectedEmployee(result.label);
      });

      setTimeout(detectFaces, 100);
    }

    detectFaces();
  }

  async function loadLabeledImages() {
    const descriptors = await Promise.all(
      employees!.map(async (employee) => {
        const descriptions = [];
        const fileURL = await getMediaURL(`gym/${employee.id}`);
        const img = await faceapi.fetchImage(fileURL);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections!.descriptor);

        return new faceapi.LabeledFaceDescriptors(employee.name, descriptions);
      })
    );
    return descriptors;
  }

  function handleCameraIsOn() {
    if (isCameraOn) {
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
      setIsCameraOn(false);
    } else {
      setIsCameraOn(true);
      streamRef!.current!.play();
    }
  }

  async function handleClockOut() {
    await updateEmployeeTimeRecord(pendingEmployeeTimeRecord!.id);
    handleCameraIsOn();
    setDetectedEmployee(null);
  }

  async function handleRegister() {
    const employee = employees!.find(
      (employee) => employee.name === detectedEmployee
    );
    await handleNewEmployeeTimeRecord({
      employeeId: employee!.id,
      clockedIn: new Date(),
      clockedOut: null,
      day: new Date(),
    });
    handleCameraIsOn();
    setDetectedEmployee(null);
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      toast.error("You need a token to access this feature");
      return;
    }

    const fetchFunction = async () => {
      try {
        const result = await verifyFaceRecognitionToken(token);
        const employees = await getEmployeesByUserId(result);
        setEmployees(employees);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, {
            position: "bottom-right",
          });
        }
      }
    };

    fetchFunction();
  }, [token]);

  useEffect(() => {
    if (!detectedEmployee) return;
    const fetchFunction = async () => {
      const employee = employees!.find(
        (employee) => employee.name === detectedEmployee
      );
      const result = await getPendingEmployeeTimeRecord(employee!.id);
      setPendingEmployeeTimeRecord(result);
    };
    fetchFunction();
  }, [detectedEmployee]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {isCameraOn ? (
          <Button onClick={handleCameraIsOn} className="cursor-pointer">
            <CameraOff />
            Close camera
          </Button>
        ) : (
          <Button onClick={setup} className="cursor-pointer">
            <CameraIcon />
            Open camera
          </Button>
        )}
        {pendingEmployeeTimeRecord ? (
          <Button
            onClick={handleClockOut}
            variant="outline"
            disabled={!detectedEmployee ? true : false}
            className="cursor-pointer"
          >
            <LogOut />
            Clock out
          </Button>
        ) : (
          <Button
            onClick={handleRegister}
            variant="outline"
            disabled={!detectedEmployee ? true : false}
            className="cursor-pointer"
          >
            <Check />
            Clock in
          </Button>
        )}
      </div>
      <div
        className="shadow-lg rounded-md bg-gray-100"
        style={{ position: "relative", width: "640px", height: "480px" }}
      >
        {!isCameraOn && !isCameraLoading ? (
          <div className="flex justify-center items-center w-full h-full">
            <CameraOff size={42} />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <Loading />
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
