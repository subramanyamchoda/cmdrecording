import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const CameraRecorder = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const commands = [
    {
      command: ['open camera', 'start camera'],
      callback: () => startCamera()
    },
    {
      command: ['start recording'],
      callback: () => startRecording()
    },
    {
      command: ['stop recording'],
      callback: () => stopRecording()
    },
    {
      command: ['close camera', 'stop camera'],
      callback: () => stopCamera()
    }
  ];

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>;
  }

  const startCamera = async () => {
    if (!cameraActive) {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject && !recording) {
      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      downloadRecording();
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
  }, []);

  return (
    <div>
      <h2>Voice-Controlled Camera and Recorder</h2>
      <p>Listening: {listening ? 'Yes' : 'No'}</p>
      <p>Transcript: {transcript}</p>

      {cameraActive && (
        <div>
          <video ref={videoRef} style={{ width: '100%', height: 'auto' }}></video>
        </div>
      )}

      {recording && <p>Recording...</p>}

      {!cameraActive && <p>Say 'open camera' to start.</p>}
    </div>
  );
};

export default CameraRecorder;
