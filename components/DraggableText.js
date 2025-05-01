import { useState, useRef, useEffect } from 'react';

const DraggableText = ({ initialText = "Кликните для редактирования" }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const textRef = useRef(null);
  const inputRef = useRef(null);

  // Обработчик для мыши и сенсорных устройств
  const handleStart = (clientX, clientY) => {
    const rect = textRef.current.getBoundingClientRect();
    setOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    
    setPosition({
      x: clientX - offset.x,
      y: clientY - offset.y
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'INPUT') return;
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    if (e.target.tagName === 'INPUT') return;
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
    e.preventDefault(); // Предотвращаем стандартное поведение
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
    e.preventDefault(); // Предотвращаем стандартное поведение
  };

  const handleTextClick = () => {
    if (!isDragging) {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const mouseMoveHandler = (e) => handleMouseMove(e);
    const touchMoveHandler = (e) => handleTouchMove(e);
    const endHandler = () => handleEnd();

    if (isDragging) {
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', endHandler);
      document.addEventListener('touchmove', touchMoveHandler, { passive: false });
      document.addEventListener('touchend', endHandler);
    } else {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', endHandler);
    }

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', endHandler);
    };
  }, [isDragging, offset]);

  return (
    <div
      ref={textRef}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: 1000,
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        border: '1px dashed #ccc',
        borderRadius: '4px',
        minWidth: '100px',
        minHeight: '20px',
        touchAction: 'none' // Важно для корректной работы на сенсорных устройствах
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleTextClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            cursor: 'text'
          }}
        />
      ) : (
        <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
      )}
    </div>
  );
};

export default DraggableText;