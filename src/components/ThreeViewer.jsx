import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Loader2, Maximize2, RotateCcw } from 'lucide-react';

export default function ThreeViewer({ modelUrl, title }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 400;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 4, 8);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f2fe, 1.5);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // 5. Grid Helper
    const grid = new THREE.GridHelper(20, 20, 0x38bdf8, 0x1e293b);
    grid.position.y = -1;
    scene.add(grid);

    // 6. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 7. Load GLTF/GLB Model or Fallback Geometry
    setLoading(true);
    setError(null);

    const loader = new GLTFLoader();

    if (modelUrl && modelUrl.endsWith('.glb')) {
      loader.load(
        modelUrl,
        (gltf) => {
          scene.add(gltf.scene);
          // Auto center & frame camera
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          controls.target.copy(center);
          setLoading(false);
        },
        undefined,
        (err) => {
          // If custom GLB loader falls back, render sample parametric engineering mesh
          console.warn('[ThreeViewer] Loading fallback parametric mesh');
          renderFallbackMesh(scene);
          setLoading(false);
        }
      );
    } else {
      renderFallbackMesh(scene);
      setLoading(false);
    }

    // 8. Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  const renderFallbackMesh = (scene) => {
    // Render high-tech parametric engineering component with metallic material
    const group = new THREE.Group();

    const geometry1 = new THREE.CylinderGeometry(1.5, 1.8, 1.2, 32);
    const material1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
    });
    const cylinder = new THREE.Mesh(geometry1, material1);
    group.add(cylinder);

    const geometry2 = new THREE.TorusGeometry(2.2, 0.2, 16, 100);
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ring = new THREE.Mesh(geometry2, material2);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    scene.add(group);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'clamp(260px, 45vh, 420px)', borderRadius: '12px', overflow: 'hidden', background: '#07090E', border: '1px solid var(--border-glow)' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading Overlay */}
      {loading && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,9,14,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--accent-cyan)' }}>
          <Loader2 size={32} className="floating" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Streaming WebGL 3D Model...</span>
        </div>
      )}

      {/* Controls Hint Badge */}
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', maxWidth: 'max-content', background: 'rgba(15,23,42,0.85)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.72rem', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(8px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        Touch/Drag: Rotate | Pinch: Zoom | 2-Fingers: Pan
      </div>
    </div>
  );
}
