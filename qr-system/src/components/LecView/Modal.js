// src/components/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onGenerateCode }) => {
  if (!isOpen) return null;  // Render modal only when `isOpen` is true

  const handleGenerateCode = () => {
    const classCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    onGenerateCode(classCode);  // Generate a random class code
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Generate Class Code</h2>
        <button onClick={handleGenerateCode} className="generate-btn">Generate Code</button>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default Modal;
