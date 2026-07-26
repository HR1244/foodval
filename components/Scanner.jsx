"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';
import styles from './Scanner.module.css';

export default function Scanner({ onScan, onClose }) {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      /* verbose= */ false
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        // Stop scanning after successful read to prevent multiple triggers
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
        onScan(decodedText);
      },
      (err) => {
        // Just ignore errors during scanning (like no barcode in frame)
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [onScan]);

  return (
    <div className={styles.scannerOverlay}>
      <div className={styles.scannerModal}>
        <div className={styles.header}>
          <h3>Scan Barcode</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        
        <div id="reader" className={styles.readerArea}></div>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <p className={styles.helperText}>
          Position the barcode within the frame. It will scan automatically.
        </p>
      </div>
    </div>
  );
}
