import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export default function Modal ({ isOpen, onClose, children })  {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={handleOverlayClick}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          width: '45%',
          height: '45%',
          borderRadius: '8px',
          padding: '20px',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#333',
          }} 
          onClick={onClose}
        >
          ×
        </button>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};