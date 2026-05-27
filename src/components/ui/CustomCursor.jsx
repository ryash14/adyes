import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  // For high performance, we use requestAnimationFrame to update state
  const targetPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    // Inject global CSS to hide the default cursor everywhere except on inputs where text cursor is needed
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: none !important;
      }
      input, textarea, [contenteditable="true"] {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);

    const onMouseMove = (e) => {
      if (hidden) setHidden(false);
      targetPosition.current = { x: e.clientX, y: e.clientY };
    };
    
    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    const checkHover = () => {
      const hoverEl = document.elementFromPoint(targetPosition.current.x, targetPosition.current.y);
      if (hoverEl) {
        // Check if hovering over interactive elements
        const isInteractive = hoverEl.closest('a') || hoverEl.closest('button') || hoverEl.closest('[role="button"]') || hoverEl.tagName.toLowerCase() === 'input';
        setLinkHovered(!!isInteractive);
      }
    };

    const updatePosition = (time) => {
      if (previousTimeRef.current != undefined) {
        // Zero-latency update: jump straight to target position
        setPosition({
          x: targetPosition.current.x,
          y: targetPosition.current.y
        });
        checkHover();
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(updatePosition);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      document.head.removeChild(style);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [hidden]);

  if (hidden || isTouchDevice) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0s'
        }}
      >
        <div 
          className={`
            flex items-center justify-center -translate-x-1/2 -translate-y-1/2 
            transition-all duration-150 ease-out border border-white
            ${clicked ? 'scale-75' : ''}
            ${linkHovered ? 'w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl' : 'w-5 h-5 bg-white rounded-full'}
          `}
        >
          {linkHovered && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
        </div>
      </div>
    </>
  );
}
