import { useState, useRef, useEffect } from 'react';

const DraggableText = ({ initialText = "Кликните для редактирования" }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const textRef = useRef(null);
  const inputRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    const rect = textRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
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
        minHeight: '20px'
      }}
      onMouseDown={handleMouseDown}
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