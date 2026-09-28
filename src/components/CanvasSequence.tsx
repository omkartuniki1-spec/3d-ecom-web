"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Ensure GSAP plugins are registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Configuration
const TOTAL_FRAMES = 192;
const PRELOAD_FRAMES = 60;
const FRAME_PREFIX = "/frames/frame_";
const FRAME_EXTENSION = ".jpg";

const SECTIONS = [
  { id: 1, title: "Storefront", startFrame: 1, endFrame: 50 },
  { id: 2, title: "Apparel Racks", startFrame: 51, endFrame: 110 },
  { id: 3, title: "Sneaker Wall", startFrame: 111, endFrame: 160 },
  { id: 4, title: "VIP Lounge", startFrame: 161, endFrame: 192 },
];

export default function CanvasSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Overlay Refs
  const sec1Ref = useRef<HTMLDivElement>(null);
  const sec2Ref = useRef<HTMLDivElement>(null);
  const sec3Ref = useRef<HTMLDivElement>(null);
  const sec4Ref = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [isPreloading, setIsPreloading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(1);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ frame: 1 });

  // Custom Cursor and Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Move custom cursor
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Subtle Parallax on cards
      const xOffset = (e.clientX / window.innerWidth - 0.5) * 20;
      const yOffset = (e.clientY / window.innerHeight - 0.5) * 20;

      gsap.to([sec1Ref.current, sec2Ref.current, sec3Ref.current, sec4Ref.current], {
        x: xOffset,
        y: `+=${yOffset}`, // Additive so it doesn't break our scroll Y animation completely, wait, this might fight.
        // Better to target a wrapper inside the ref
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Navbar Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preload Logic
  useEffect(() => {
    let active = true;
    let loadedInitialCount = 0;

    const loadImages = async () => {
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (!active) return;
        const img = new Image();
        const frameString = i.toString().padStart(4, "0");
        img.src = `${FRAME_PREFIX}${frameString}${FRAME_EXTENSION}`;

        await new Promise((resolve) => {
          img.onload = () => {
            imagesRef.current[i] = img;
            if (i <= PRELOAD_FRAMES) {
              loadedInitialCount++;
              setProgress(Math.floor((loadedInitialCount / PRELOAD_FRAMES) * 100));
              if (loadedInitialCount === PRELOAD_FRAMES) {
                setTimeout(() => { if (active) setIsPreloading(false); }, 400);
              }
            }
            resolve(true);
          };
          img.onerror = () => resolve(true); // Prevent blocking
        });
      }
    };
    loadImages();

    // Scroll indicator animation
    const scrollTween = gsap.to(scrollIndicatorRef.current, {
      y: 10, opacity: 0, duration: 1.5, repeat: -1, ease: "power2.inOut",
    });

    return () => {
      active = false;
      scrollTween.kill();
    };
  }, []);

  // Canvas Drawing & ScrollTrigger Logic
  useEffect(() => {
    if (!isPreloading && imagesRef.current[1] && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      const drawCover = (image: HTMLImageElement) => {
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        
        // Use logical sizing for calculation
        const logicalW = window.innerWidth;
        const logicalH = window.innerHeight;

        const hRatio = logicalW / image.width;
        const vRatio = logicalH / image.height;
        const ratio = Math.max(hRatio, vRatio);

        const drawW = image.width * ratio;
        const drawH = image.height * ratio;
        const centerShift_x = (logicalW - drawW) / 2;
        const centerShift_y = (logicalH - drawH) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          image,
          0, 0, image.width, image.height,
          centerShift_x * dpr, centerShift_y * dpr, drawW * dpr, drawH * dpr
        );
      };

      const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        
        const currentFrame = Math.floor(frameIndexRef.current.frame);
        if (imagesRef.current[currentFrame]) {
          drawCover(imagesRef.current[currentFrame]);
        }
      };
      
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // 4x viewport height
        pin: true,
        onUpdate: (self) => {
          const calculatedFrame = Math.floor(self.progress * (TOTAL_FRAMES - 1)) + 1;
          
          if (calculatedFrame !== frameIndexRef.current.frame) {
            frameIndexRef.current.frame = calculatedFrame;
            if (imagesRef.current[calculatedFrame]) {
              drawCover(imagesRef.current[calculatedFrame]);
            }
          }

          // Active section updates
          const activeSec = SECTIONS.find(s => calculatedFrame >= s.startFrame && calculatedFrame <= s.endFrame);
          if (activeSec && activeSec.id !== activeSection) {
            setActiveSection(activeSec.id);
          }

          // UI Animations
          const sec1 = calculatedFrame >= 1 && calculatedFrame <= 50;
          const sec2 = calculatedFrame >= 51 && calculatedFrame <= 110;
          const sec3 = calculatedFrame >= 111 && calculatedFrame <= 160;
          const sec4 = calculatedFrame >= 161 && calculatedFrame <= 192;

          gsap.to(sec1Ref.current, { autoAlpha: sec1 ? 1 : 0, top: sec1 ? 0 : 30, duration: 0.6, overwrite: "auto", ease: "expo.out" });
          gsap.to(sec2Ref.current, { autoAlpha: sec2 ? 1 : 0, top: sec2 ? 0 : 30, duration: 0.6, overwrite: "auto", ease: "expo.out" });
          gsap.to(sec3Ref.current, { autoAlpha: sec3 ? 1 : 0, top: sec3 ? 0 : 30, duration: 0.6, overwrite: "auto", ease: "expo.out" });
          gsap.to(sec4Ref.current, { autoAlpha: sec4 ? 1 : 0, top: sec4 ? 0 : 30, duration: 0.6, overwrite: "auto", ease: "expo.out" });
        },
      });
      scrollTriggerRef.current = st;

      // Initial state
      gsap.set([sec1Ref.current, sec2Ref.current, sec3Ref.current, sec4Ref.current], { autoAlpha: 0, top: 30 });
      gsap.to(sec1Ref.current, { autoAlpha: 1, top: 0, duration: 0.6, ease: "expo.out", delay: 0.2 });

      return () => {
        st.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        window.removeEventListener("resize", resizeCanvas);
      };
    }
  }, [isPreloading]);

  const scrollToSection = (frame: number) => {
    if (!scrollTriggerRef.current) return;
    const progress = (frame - 1) / (TOTAL_FRAMES - 1);
    const st = scrollTriggerRef.current;
    const scrollPos = st.start + (st.end - st.start) * progress;
    gsap.to(window, { scrollTo: scrollPos, duration: 1.5, ease: "power3.inOut" });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-neutral-950 overflow-hidden cursor-none">
      
      {/* Custom Luxury Cursor */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-6 h-6 border border-white/50 rounded-full pointer-events-none z-[100] mix-blend-difference -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform"
      >
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>

      {/* Film Grain & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')]" style={{ backgroundSize: "200px 200px" }} />
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />

      {/* Loading Screen Overlay */}
      <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 transition-opacity duration-1000 ease-in-out ${isPreloading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tighter uppercase mb-6 drop-shadow-lg">Streetwear</h1>
          <div className="w-64 h-[1px] bg-white/20 relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-white/70 font-mono text-sm tracking-[0.3em]">{progress}% LOADED</span>
        </div>
      </div>

      {/* Hero & Navigation */}
      <div className={`absolute top-0 left-0 w-full p-8 md:p-12 z-40 flex justify-between items-start transition-all duration-500 ${isNavScrolled ? 'bg-black/20 backdrop-blur-md py-6' : 'bg-transparent'}`}>
        <div className="text-white font-black text-2xl md:text-3xl tracking-[0.15em] uppercase pointer-events-auto mix-blend-difference cursor-none">
          STREETWEAR
        </div>
        <nav className="hidden md:flex gap-10 text-white/90 font-medium text-xs tracking-[0.2em] uppercase pointer-events-auto mt-2 cursor-none">
          {["Shop", "New Drops", "Accessories", "Contact"].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300">
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Right Side Progress Navigation */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6 pointer-events-auto">
        {SECTIONS.map((section) => (
          <button 
            key={section.id} 
            onClick={() => scrollToSection(section.startFrame)}
            className="group flex items-center gap-4 justify-end focus:outline-none cursor-none"
          >
            <span className={`text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-500 ${activeSection === section.id ? "text-white opacity-100 translate-x-0" : "text-white/40 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"}`}>
              {section.title}
            </span>
            <div className={`transition-all duration-500 rounded-full ${activeSection === section.id ? "w-1 h-8 bg-white" : "w-1 h-3 bg-white/30 group-hover:bg-white/70 group-hover:h-5"}`} />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none mix-blend-difference">
        <span className="text-white/50 text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div ref={scrollIndicatorRef} className="w-full h-1/3 bg-white absolute top-0 left-0" />
        </div>
      </div>

      {/* Glassmorphism Overlays Container */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        
        <div className="absolute bottom-24 left-8 md:left-24 max-w-lg pointer-events-none parallax-wrapper relative mix-blend-difference">
          <div ref={sec1Ref} className="invisible absolute bottom-0 left-0 w-[500px]">
            <div className="flex flex-col items-start transition-transform duration-75 parallax-card">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-[1px] bg-white" />
                 <h3 className="text-white font-mono text-[10px] tracking-[0.4em] uppercase">Phase 01</h3>
              </div>
              <h2 className="text-white text-5xl md:text-6xl font-light tracking-tighter mb-4 leading-[1.1]">
                Storefront <br/><span className="italic font-serif text-white/70">& Neon Sign</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-32 max-w-lg pointer-events-none parallax-wrapper relative mix-blend-difference">
          <div ref={sec2Ref} className="invisible absolute top-1/2 -translate-y-1/2 right-0 w-[500px] flex justify-end">
            <div className="flex flex-col items-end text-right transition-transform duration-75 parallax-card">
              <div className="flex items-center gap-4 mb-4">
                 <h3 className="text-white font-mono text-[10px] tracking-[0.4em] uppercase">Phase 02</h3>
                 <div className="w-12 h-[1px] bg-white" />
              </div>
              <h2 className="text-white text-5xl md:text-6xl font-light tracking-tighter mb-4 leading-[1.1]">
                Apparel <br/><span className="italic font-serif text-white/70">Floor & Racks</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 left-8 md:left-24 max-w-lg pointer-events-none parallax-wrapper relative mix-blend-difference">
          <div ref={sec3Ref} className="invisible absolute bottom-0 left-0 w-[500px]">
            <div className="flex flex-col items-start transition-transform duration-75 parallax-card">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-[1px] bg-white" />
                 <h3 className="text-white font-mono text-[10px] tracking-[0.4em] uppercase">Phase 03</h3>
              </div>
              <h2 className="text-white text-5xl md:text-6xl font-light tracking-tighter mb-4 leading-[1.1]">
                Curated <br/><span className="italic font-serif text-white/70">Sneaker Wall</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-32 max-w-lg pointer-events-none parallax-wrapper relative mix-blend-difference">
          <div ref={sec4Ref} className="invisible absolute top-1/2 -translate-y-1/2 right-0 w-[500px] flex justify-end">
            <div className="flex flex-col items-end text-right transition-transform duration-75 parallax-card">
              <div className="flex items-center gap-4 mb-4">
                 <h3 className="text-white font-mono text-[10px] tracking-[0.4em] uppercase">Phase 04</h3>
                 <div className="w-12 h-[1px] bg-white" />
              </div>
              <h2 className="text-white text-5xl md:text-6xl font-light tracking-tighter mb-4 leading-[1.1]">
                VIP Lounge <br/><span className="italic font-serif text-white/70">& Exclusives</span>
              </h2>
            </div>
          </div>
        </div>

      </div>

      {/* Frame Rendering Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full object-cover pointer-events-none" />
    </div>
  );
}
