import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ChevronUp, ChevronDown, RotateCcw, Shield, Cpu, Activity, Sparkles } from 'lucide-react';

interface ThreeCyberCoreProps {
  onNodeClick?: (nodeName: string) => void;
}

export const ThreeCyberCore: React.FC<ThreeCyberCoreProps> = ({ onNodeClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState<number>(1);
  const [coreColor, setCoreColor] = useState<string>('#06b6d4'); // Cyan default
  const [shieldActive, setShieldActive] = useState<boolean>(true);
  const [pulseMetric, setPulseMetric] = useState<number>(98.4);

  // References for mutable animation state
  const animStateRef = useRef({
    speed: 1,
    shield: true,
    colorHex: 0x06b6d4,
    rotationGroup: null as THREE.Group | null,
    shieldMesh: null as THREE.Mesh | null,
    coreMesh: null as THREE.Mesh | null,
    rings: [] as THREE.Mesh[],
  });

  useEffect(() => {
    animStateRef.current.speed = activeSpeed;
    animStateRef.current.shield = shieldActive;
    const col = new THREE.Color(coreColor);
    animStateRef.current.colorHex = col.getHex();
    if (animStateRef.current.coreMesh) {
      (animStateRef.current.coreMesh.material as THREE.MeshStandardMaterial).color = col;
      (animStateRef.current.coreMesh.material as THREE.MeshStandardMaterial).emissive = col;
    }
  }, [activeSpeed, shieldActive, coreColor]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Scene & Fog Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Match dark slate-950
    scene.fog = new THREE.FogExp2(0x020617, 0.05);

    // 3. Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 7.5);
    camera.lookAt(0, 0, 0);

    // 4. Modern Renderer Pipeline
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 5. Studio Environment Map (PMREMGenerator + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = roomEnv;
    pmremGenerator.dispose();

    // 6. Warm/Cool Studio Lighting
    const warmKeyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    warmKeyLight.position.set(4, 6, 5);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (warmKeyLight.shadow) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
      warmKeyLight.shadow.normalBias = 0.02;
    }
    scene.add(warmKeyLight);

    const coolFillLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 1.2);
    scene.add(coolFillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 2.0, 10);
    rimLight.position.set(-4, -1, -3);
    scene.add(rimLight);

    // 7. Procedural Ground Contact Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const groundShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      })
    );
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.6;
    scene.add(groundShadow);

    // 8. Composite 7-Part Procedural Cyber-Neural Model (THREE.Group)
    const cyberCoreGroup = new THREE.Group();
    cyberCoreGroup.position.set(0, 0, 0);

    // Part 1: Central Core Node (Icosahedron + PBR)
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.18,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = !isSoftwareGl;
    cyberCoreGroup.add(coreMesh);
    animStateRef.current.coreMesh = coreMesh;

    // Part 2: Inner Octahedron Lattice
    const latticeGeo = new THREE.OctahedronGeometry(1.1, 1);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      metalness: 0.95,
      roughness: 0.1,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    cyberCoreGroup.add(latticeMesh);

    // Part 3: Equatorial Torus Flux Ring
    const ring1Geo = new THREE.TorusGeometry(1.6, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.25,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.3;
    cyberCoreGroup.add(ring1);

    // Part 4: Polar Orbital Gyro Ring
    const ring2Geo = new THREE.TorusGeometry(1.9, 0.035, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    cyberCoreGroup.add(ring2);

    // Part 5: Oblique Data Conduit Ring
    const ring3Geo = new THREE.TorusGeometry(2.2, 0.03, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.2,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 4;
    cyberCoreGroup.add(ring3);

    animStateRef.current.rings = [ring1, ring2, ring3];

    // Part 6: Outer Holographic Defensive Shield Sphere
    const shieldGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.2,
      transmission: isSoftwareGl ? 0 : 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      depthWrite: false,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    cyberCoreGroup.add(shieldMesh);
    animStateRef.current.shieldMesh = shieldMesh;

    // Part 7: Satellite Quantum Pylons (InstancedMesh or 6-orbit nodes)
    const pylonGeo = new THREE.BoxGeometry(0.08, 0.35, 0.08);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      metalness: 0.9,
      roughness: 0.2,
    });
    const pylonsGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const pylon = new THREE.Mesh(pylonGeo, pylonMat);
      pylon.position.set(Math.cos(angle) * 2.8, Math.sin(angle * 2) * 0.4, Math.sin(angle) * 2.8);
      pylonsGroup.add(pylon);
    }
    cyberCoreGroup.add(pylonsGroup);

    scene.add(cyberCoreGroup);
    animStateRef.current.rotationGroup = cyberCoreGroup;

    // 9. Pre-warm Shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 10. Lossless 60fps Animation Loop with Exponential Damping
    let frameId = 0;
    let lastTime = performance.now();

    function renderLoop() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const spd = animStateRef.current.speed;

      // Exponential damping rotation
      cyberCoreGroup.rotation.y += 0.35 * dt * spd;
      latticeMesh.rotation.y -= 0.5 * dt * spd;
      latticeMesh.rotation.x += 0.3 * dt * spd;

      ring1.rotation.z += 0.45 * dt * spd;
      ring2.rotation.x += 0.6 * dt * spd;
      ring3.rotation.y += 0.5 * dt * spd;

      pylonsGroup.rotation.y -= 0.2 * dt * spd;

      // Pulse shield
      if (shieldMesh) {
        shieldMesh.visible = animStateRef.current.shield;
        if (animStateRef.current.shield) {
          const pulse = 1 + Math.sin(now * 0.003 * spd) * 0.03;
          shieldMesh.scale.set(pulse, pulse, pulse);
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(renderLoop);
    }

    frameId = requestAnimationFrame(renderLoop);

    // 11. Handle Resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      shieldGeo.dispose();
      shieldMat.dispose();
      pylonGeo.dispose();
      pylonMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Spec Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 pointer-events-none">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-cyan-400">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>CYBER-NEURAL CORE r174</span>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-emerald-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>{pulseMetric}% SYNC</span>
        </div>
      </div>

      {/* Bottom Centered Collapsible Control Dock (Per Three.js ergonomics standard) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-1 flex items-center space-x-1 px-3 py-1 rounded-t-lg bg-slate-900 border-t border-x border-slate-700 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span>{isCollapsed ? 'Show 3D HUD' : 'Collapse HUD'}</span>
        </button>

        {!isCollapsed && (
          <div className="w-full px-4 py-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl flex items-center justify-between gap-3 text-xs text-slate-300">
            {/* Speed Multipliers */}
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-slate-400 text-[11px]">Clock:</span>
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSpeed(s)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    activeSpeed === s ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Core Spectrum Palette */}
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-slate-400 text-[11px]">Harmonic:</span>
              {[
                { label: 'Cyan', color: '#06b6d4' },
                { label: 'Purple', color: '#a855f7' },
                { label: 'Emerald', color: '#10b981' },
                { label: 'Amber', color: '#f59e0b' },
              ].map(item => (
                <button
                  key={item.color}
                  onClick={() => setCoreColor(item.color)}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    coreColor === item.color ? 'scale-110 border-white ring-2 ring-cyan-500/50' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: item.color }}
                  title={item.label}
                />
              ))}
            </div>

            {/* Defensive Shield Toggle */}
            <button
              onClick={() => setShieldActive(!shieldActive)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                shieldActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{shieldActive ? 'Shield ON' : 'Shield OFF'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
