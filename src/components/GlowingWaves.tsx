import { useEffect, useRef } from "react";

export interface GlowingWavesProps {
  theme?: "cyan" | "lilac-gold" | "bambuzau";
  yOffsets?: number[]; // custom vertical alignments (0.1 to 0.9)
}

export function GlowingWaves({ theme = "bambuzau", yOffsets }: GlowingWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Configure flowing wave ribbons with particles
    interface Particle {
      x: number;
      offsetY: number;
      size: number;
      speed: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;
    }

    interface Ribbon {
      color: string;
      glowColor: string;
      amplitude: number;
      frequency: number;
      speed: number;
      yOffsetPercent: number; // 0.1 to 0.9 vertical placement
      thickness: number;
      particles: Particle[];
      phase: number;
      particleColorFunc: (alpha: number) => string;
      particleGlowColorFunc: (alpha: number) => string;
    }

    // Default y-offsets if none provided
    const defaultYOffsets = theme === "lilac-gold" 
      ? [0.5, 0.45, 0.55, 0.48]
      : [0.45, 0.55, 0.5, 0.4];

    const activeYOffsets = yOffsets || defaultYOffsets;

    const cyanRibbons: Ribbon[] = [
      {
        color: "rgba(0, 180, 216, 0.35)", // Radiant cyan
        glowColor: "#00b4d8",
        amplitude: 55,
        frequency: 0.0035,
        speed: 0.008,
        yOffsetPercent: activeYOffsets[0] ?? 0.45,
        thickness: 25,
        particles: [],
        phase: 0,
        particleColorFunc: (a) => `rgba(0, 180, 216, ${a})`,
        particleGlowColorFunc: (a) => `rgba(144, 224, 239, ${a})`,
      },
      {
        color: "rgba(3, 4, 94, 0.3)", // Deep royal blue
        glowColor: "#0077b6",
        amplitude: 70,
        frequency: 0.002,
        speed: 0.005,
        yOffsetPercent: activeYOffsets[1] ?? 0.55,
        thickness: 35,
        particles: [],
        phase: Math.PI * 0.4,
        particleColorFunc: (a) => `rgba(0, 119, 182, ${a})`,
        particleGlowColorFunc: (a) => `rgba(0, 180, 216, ${a})`,
      },
      {
        color: "rgba(255, 183, 3, 0.4)", // Amber/Gold glitter
        glowColor: "#ffb703",
        amplitude: 45,
        frequency: 0.0045,
        speed: 0.012,
        yOffsetPercent: activeYOffsets[2] ?? 0.5,
        thickness: 15,
        particles: [],
        phase: Math.PI * 1.1,
        particleColorFunc: (a) => `rgba(255, 183, 3, ${a})`,
        particleGlowColorFunc: (a) => `rgba(255, 236, 179, ${a})`,
      },
      {
        color: "rgba(144, 224, 239, 0.25)", // Soft baby blue highlights
        glowColor: "#90e0ef",
        amplitude: 60,
        frequency: 0.005,
        speed: 0.015,
        yOffsetPercent: activeYOffsets[3] ?? 0.4,
        thickness: 20,
        particles: [],
        phase: Math.PI * 0.75,
        particleColorFunc: (a) => `rgba(144, 224, 239, ${a})`,
        particleGlowColorFunc: (a) => `rgba(255, 255, 255, ${a})`,
      }
    ];

    const lilacGoldRibbons: Ribbon[] = [
      {
        color: "rgba(216, 180, 254, 0.35)", // Soft lilac
        glowColor: "#d8b4fe",
        amplitude: 50,
        frequency: 0.0038,
        speed: 0.009,
        yOffsetPercent: activeYOffsets[0] ?? 0.5,
        thickness: 25,
        particles: [],
        phase: 0,
        particleColorFunc: (a) => `rgba(216, 180, 254, ${a})`,
        particleGlowColorFunc: (a) => `rgba(243, 232, 255, ${a})`,
      },
      {
        color: "rgba(234, 179, 8, 0.35)", // Gold/Yellow
        glowColor: "#eab308",
        amplitude: 65,
        frequency: 0.0025,
        speed: 0.006,
        yOffsetPercent: activeYOffsets[1] ?? 0.45,
        thickness: 30,
        particles: [],
        phase: Math.PI * 0.5,
        particleColorFunc: (a) => `rgba(234, 179, 8, ${a})`,
        particleGlowColorFunc: (a) => `rgba(254, 240, 138, ${a})`,
      },
      {
        color: "rgba(168, 85, 247, 0.3)", // Rich purple
        glowColor: "#a855f7",
        amplitude: 45,
        frequency: 0.0045,
        speed: 0.011,
        yOffsetPercent: activeYOffsets[2] ?? 0.55,
        thickness: 18,
        particles: [],
        phase: Math.PI * 1.2,
        particleColorFunc: (a) => `rgba(168, 85, 247, ${a})`,
        particleGlowColorFunc: (a) => `rgba(216, 180, 254, ${a})`,
      },
      {
        color: "rgba(250, 204, 21, 0.25)", // Bright gold sparkles
        glowColor: "#facc15",
        amplitude: 55,
        frequency: 0.0052,
        speed: 0.014,
        yOffsetPercent: activeYOffsets[3] ?? 0.48,
        thickness: 22,
        particles: [],
        phase: Math.PI * 0.8,
        particleColorFunc: (a) => `rgba(250, 204, 21, ${a})`,
        particleGlowColorFunc: (a) => `rgba(254, 249, 195, ${a})`,
      }
    ];

    const bambuzauRibbons: Ribbon[] = [
      {
        color: "rgba(30, 77, 43, 0.35)", // Forest Green
        glowColor: "#1E4D2B",
        amplitude: 50,
        frequency: 0.0035,
        speed: 0.008,
        yOffsetPercent: activeYOffsets[0] ?? 0.45,
        thickness: 25,
        particles: [],
        phase: 0,
        particleColorFunc: (a) => `rgba(30, 77, 43, ${a})`,
        particleGlowColorFunc: (a) => `rgba(42, 102, 58, ${a})`,
      },
      {
        color: "rgba(242, 162, 2, 0.3)", // Bamboo Yellow/Orange
        glowColor: "#F2A202",
        amplitude: 65,
        frequency: 0.0022,
        speed: 0.006,
        yOffsetPercent: activeYOffsets[1] ?? 0.55,
        thickness: 30,
        particles: [],
        phase: Math.PI * 0.4,
        particleColorFunc: (a) => `rgba(242, 162, 2, ${a})`,
        particleGlowColorFunc: (a) => `rgba(254, 240, 138, ${a})`,
      },
      {
        color: "rgba(42, 102, 58, 0.25)", // Soft green highlight
        glowColor: "#2A663A",
        amplitude: 45,
        frequency: 0.0045,
        speed: 0.011,
        yOffsetPercent: activeYOffsets[2] ?? 0.5,
        thickness: 18,
        particles: [],
        phase: Math.PI * 1.1,
        particleColorFunc: (a) => `rgba(42, 102, 58, ${a})`,
        particleGlowColorFunc: (a) => `rgba(255, 255, 255, ${a})`,
      },
      {
        color: "rgba(242, 162, 2, 0.25)", // Warm light sparkles
        glowColor: "#F2A202",
        amplitude: 55,
        frequency: 0.005,
        speed: 0.013,
        yOffsetPercent: activeYOffsets[3] ?? 0.4,
        thickness: 20,
        particles: [],
        phase: Math.PI * 0.75,
        particleColorFunc: (a) => `rgba(242, 162, 2, ${a})`,
        particleGlowColorFunc: (a) => `rgba(254, 249, 195, ${a})`,
      }
    ];

    const ribbons = theme === "bambuzau" 
      ? bambuzauRibbons 
      : theme === "lilac-gold" 
        ? lilacGoldRibbons 
        : cyanRibbons;

    // Initialize/Regenerate particles for each ribbon
    const initParticles = (ribbon: Ribbon, count: number, canvasWidth: number) => {
      ribbon.particles = [];
      for (let i = 0; i < count; i++) {
        ribbon.particles.push({
          x: Math.random() * canvasWidth,
          offsetY: (Math.random() - 0.5) * ribbon.thickness,
          size: Math.random() * 2.2 + 0.6,
          speed: Math.random() * 0.4 + 0.15,
          opacity: Math.random() * 0.7 + 0.3,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = container.clientWidth;
      height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Re-init particles based on width
      const particleDensity = Math.min(Math.max(Math.floor(width / 10), 40), 180);
      ribbons.forEach((ribbon) => {
        initParticles(ribbon, particleDensity, width);
      });
    };

    // Use ResizeObserver for responsive resizing
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Run first resize manually
    handleResize();

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw each beautiful ribbon
      ribbons.forEach((ribbon) => {
        ribbon.phase += ribbon.speed;

        // Draw solid smooth flowing center stroke first
        ctx.save();
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const sinValue = Math.sin(x * ribbon.frequency + ribbon.phase);
          const cosValue = Math.cos(x * (ribbon.frequency * 1.5) + ribbon.phase * 0.5);
          const y = height * ribbon.yOffsetPercent + (sinValue + cosValue * 0.3) * ribbon.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = ribbon.color;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = ribbon.glowColor;
        ctx.stroke();
        ctx.restore();

        // Render, update, and draw glistening particles along the sine path
        ribbon.particles.forEach((p) => {
          // Move particles horizontally
          p.x += p.speed;
          if (p.x > width) {
            p.x = 0;
            p.offsetY = (Math.random() - 0.5) * ribbon.thickness;
          }

          // Compute y coordinate on the moving curve
          const sinValue = Math.sin(p.x * ribbon.frequency + ribbon.phase);
          const cosValue = Math.cos(p.x * (ribbon.frequency * 1.5) + ribbon.phase * 0.5);
          const curveY = height * ribbon.yOffsetPercent + (sinValue + cosValue * 0.3) * ribbon.amplitude;
          const y = curveY + p.offsetY;

          // Pulse opacity for glittering / starry effect
          p.pulsePhase += p.pulseSpeed;
          const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulsePhase) * 0.4);

          // Draw outer soft glow using a larger lower-opacity circle (high-performance glow)
          ctx.beginPath();
          ctx.arc(p.x, y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = ribbon.particleGlowColorFunc(currentOpacity * 0.25);
          ctx.fill();

          // Draw inner bright core
          ctx.beginPath();
          ctx.arc(p.x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = ribbon.particleColorFunc(currentOpacity);
          ctx.fill();
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
