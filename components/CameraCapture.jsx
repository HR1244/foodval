import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Loader2, Camera as CameraIcon, SwitchCamera } from 'lucide-react';
import styles from './CameraCapture.module.css';

export default function CameraCapture({ onCapture, isAnalyzing }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };

  return (
    <div className={styles.inlineContainer}>
      <div className={styles.cameraWrapper}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode }}
          className={styles.webcam}
        />
      </div>

      <div className={styles.controls}>
        <button onClick={toggleCamera} className={styles.secondaryButton} disabled={isAnalyzing}>
          <SwitchCamera size={20} />
        </button>
        
        <button onClick={capture} className={styles.captureButton} disabled={isAnalyzing}>
          {isAnalyzing ? <Loader2 size={24} className={styles.spinner} /> : <CameraIcon size={24} />}
          <span>{isAnalyzing ? 'Analyzing...' : 'Snap Food'}</span>
        </button>
      </div>
    </div>
  );
}
