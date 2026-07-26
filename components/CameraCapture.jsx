import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { X, Camera as CameraIcon, SwitchCamera } from 'lucide-react';
import styles from './CameraCapture.module.css';

export default function CameraCapture({ onCapture, onClose }) {
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Snap Label</h3>
          <button onClick={onClose} className={styles.iconButton}>
            <X size={24} />
          </button>
        </div>
        
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
          <button onClick={toggleCamera} className={styles.secondaryButton}>
            <SwitchCamera size={20} />
          </button>
          
          <button onClick={capture} className={styles.captureButton}>
            <CameraIcon size={24} />
            <span>Capture</span>
          </button>
        </div>
      </div>
    </div>
  );
}
