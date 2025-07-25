'use client'

import { useEffect, useState } from 'react'

export default function Home({ showCloseButton = false, onClose = () => {} }) {
  const videos = [
    '/assets/eduContent1.mp4',
    '/assets/eduContent2.mp4',
    '/assets/eduContent3.mp4',
  ]

  const stateMatrix = [
    [1, 0.5, 0.4],
    [0.5, 1, 0.5],
    [0.4, 0.5, 1],
  ]

  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % stateMatrix.length)
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const getStyle = (index, number) => {
    const widthFactor = stateMatrix[step][index]

    return {
      flex: widthFactor,
      height: 'calc(100vh - 65vh)',
      position: 'relative',
      transition: 'all 0.6s ease-in-out',
      borderRadius: '1rem',
      overflow: 'hidden',
      transform: `scale(${0.8 + 0.2 * widthFactor})`,
      filter: `brightness(${0.6 + 0.4 * widthFactor})`,
      zIndex: Math.round(widthFactor * 10),
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {showCloseButton && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      )}
      <div
        style={{
          display: 'flex',
          height: 'calc(100vh - 65vh)',
          gap: 'calc(0.4vw)',
          width: 'calc(100% - 2rem)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {videos.map((src, i) => (
          <div key={i} style={getStyle(i)}>
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="auto"
              onLoadedData={() => console.log('Video loaded successfully:', src)}
              onError={(e) => {
                console.error('Video error:', e);
                console.error('Video src:', src);
                console.error('Error details:', e.target.error);
              }}
              style={{
                zIndex: 1,
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '1rem',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
