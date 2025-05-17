import { useState, useEffect, useRef } from "react";
import './index.css';
import WeatherCard from './components/WeatherCard';

function App() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse movement to update interactive elements
  const handleMouseMove = (event) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  useEffect(() => {
    // Initialize canvas when component mounts
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // Recreate particles when canvas is resized
    };

    // Create initial particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000); // Adjust density based on screen size
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25
        });
      }
    };

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a2a6c');
      gradient.addColorStop(0.5, '#2a4858');
      gradient.addColorStop(1, '#203a43');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update particles
      particles.forEach((particle, index) => {
        // Calculate distance from mouse to create interactive effect
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        // Move particles away from mouse when close
        if (distance < maxDistance) {
          const angle = Math.atan2(dy, dx);
          const force = (maxDistance - distance) / maxDistance;
          particle.x -= Math.cos(angle) * force * 2;
          particle.y -= Math.sin(angle) * force * 2;
        }
        
        // Regular particle movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Draw the particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Connect nearby particles with lines
        particles.forEach((p2, j) => {
          if (index !== j) {
            const dx = particle.x - p2.x;
            const dy = particle.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };

    // Initialize and start animation
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  return (
    <div className="relative w-screen h-screen overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Interactive Background Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <WeatherCard />
      </div>
    </div>
  );
}

export default App;