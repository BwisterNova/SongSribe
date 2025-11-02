import { useState, useEffect, useRef } from "react";
import { Music, X } from "lucide-react";

interface FloatingOrbProps {
  isListening: boolean;
  songName?: string;
  artist?: string;
  onDismiss: () => void;
}

function FloatingOrb({ isListening, songName, artist, onDismiss }: FloatingOrbProps) {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 40, y: window.innerHeight / 2 - 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [showDismissTarget, setShowDismissTarget] = useState(false);
  const [isNearDismiss, setIsNearDismiss] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const dismissTargetY = window.innerHeight - 120;
  const dismissTargetX = window.innerWidth / 2 - 40;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        setPosition({ x: newX, y: newY });

        // Check if near dismiss target
        const distance = Math.sqrt(
          Math.pow(newX - dismissTargetX, 2) + Math.pow(newY - dismissTargetY, 2)
        );
        setIsNearDismiss(distance < 100);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setShowDismissTarget(false);
        
        // Check if should dismiss
        if (isNearDismiss) {
          onDismiss();
        }
        setIsNearDismiss(false);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isNearDismiss, dismissTargetX, dismissTargetY, onDismiss]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (orbRef.current) {
      const rect = orbRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsDragging(true);
      setShowDismissTarget(true);
    }
  };

  const showSongInfo = songName && artist;

  return (
    <>
      {/* Floating Orb */}
      <div
        ref={orbRef}
        onMouseDown={handleMouseDown}
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "all 0.3s ease",
        }}
        className="select-none"
      >
        {/* Soundwave ripples - only show when actively listening (not when failed) */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
            <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.6s" }} />
          </>
        )}

        {/* Main Orb */}
        <div
          className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl flex items-center justify-center transition-all duration-500 ${
            isListening ? "animate-pulse" : ""
          } ${showSongInfo ? "w-64 h-20 rounded-2xl" : ""}`}
          style={{
            boxShadow: isListening
              ? "0 0 60px rgba(147, 51, 234, 0.8), 0 0 100px rgba(59, 130, 246, 0.6)"
              : "0 0 40px rgba(147, 51, 234, 0.5)",
          }}
        >
          {showSongInfo ? (
            <div className="px-4 text-center">
              <p className="text-white font-bold text-sm truncate">{songName}</p>
              <p className="text-purple-200 text-xs truncate">{artist}</p>
            </div>
          ) : (
            <Music className="w-10 h-10 text-white" />
          )}
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 blur-xl opacity-60 -z-10"
          style={{
            animation: isListening ? "pulse 2s ease-in-out infinite" : "none",
          }}
        />
      </div>

      {/* Dismiss Target */}
      {showDismissTarget && (
        <div
          style={{
            position: "fixed",
            left: `${dismissTargetX}px`,
            top: `${dismissTargetY}px`,
            zIndex: 9998,
          }}
          className={`w-20 h-20 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-300 ${
            isNearDismiss
              ? "border-red-500 bg-red-500/20 scale-125"
              : "border-gray-500 bg-gray-500/10 scale-100"
          }`}
        >
          <X className={`w-8 h-8 ${isNearDismiss ? "text-red-500" : "text-gray-500"}`} />
        </div>
      )}
    </>
  );
}

export default FloatingOrb;