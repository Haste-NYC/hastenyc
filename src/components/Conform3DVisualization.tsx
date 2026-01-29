import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const mockData = [
  { key: 'accuracy', value: '98.7%', label: 'Accuracy', highlight: true },
  { key: 'timeSaved', value: '4.5h', label: 'Time Saved', highlight: true },
  { key: 'clips', value: '847', label: 'Clips' },
  { key: 'effects', value: '156', label: 'Effects' },
  { key: 'markers', value: '89', label: 'Markers' },
  { key: 'tracks', value: '24', label: 'Tracks' },
  { key: 'sequences', value: '12', label: 'Sequences' },
  { key: 'video', value: '16', label: 'Video Tracks' },
  { key: 'audio', value: '8', label: 'Audio Tracks' },
  { key: 'warnings', value: '3', label: 'Warnings', warning: true },
  { key: 'processingTime', value: '2:34', label: 'Processing Time' },
  { key: 'mediaFiles', value: '1,247', label: 'Media Files' },
];

interface HoveredNode {
  value: string;
  label: string;
  warning?: boolean;
  highlight?: boolean;
}

export default function Conform3DVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const dataNodesRef = useRef<THREE.Mesh[]>([]);
  const dataLinesRef = useRef<THREE.Line[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const isInteractingRef = useRef(false);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Skip 3D rendering on mobile for performance
    if (isMobile) return;

    setMounted(true);
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    // Transparent background - page background shows through
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 380);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Uniform sphere distribution
    const generateSpherePoints = (count: number, radius: number) => {
      const points: { x: number; y: number; z: number }[] = [];
      const goldenRatio = (1 + Math.sqrt(5)) / 2;

      for (let i = 0; i < count; i++) {
        const t = i / count;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = 2 * Math.PI * goldenRatio * i;

        const x = radius * Math.sin(inclination) * Math.cos(azimuth);
        const y = radius * Math.sin(inclination) * Math.sin(azimuth);
        const z = radius * Math.cos(inclination);

        points.push({ x, y, z });
      }
      return points;
    };

    const sphereRadius = 120;

    // Decorative nodes with their lines
    const decorativeCount = 30;
    const decorativePoints = generateSpherePoints(decorativeCount, sphereRadius);

    decorativePoints.forEach((point) => {
      const size = 2.5 + Math.random() * 1.5;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4a5568,
        transparent: true,
        opacity: 0.35
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(point.x, point.y, point.z);
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mainGroup.add(cube);

      // Each node gets its own connection line
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(point.x, point.y, point.z)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.04
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      mainGroup.add(line);
    });

    // Data nodes with their lines
    const dataNodes: THREE.Mesh[] = [];
    const dataLines: THREE.Line[] = [];
    const dataPoints = generateSpherePoints(mockData.length, sphereRadius);

    mockData.forEach((data, i) => {
      const point = dataPoints[i];

      const size = data.highlight ? 5.5 : 4;
      const geometry = new THREE.BoxGeometry(size, size, size);

      let color = 0x5a6a7a;
      if (data.highlight) color = 0x7aa3c4;
      if (data.warning) color = 0xc4a24a;

      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9
      });

      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(point.x, point.y, point.z);
      cube.userData = { ...data, originalColor: color };
      mainGroup.add(cube);
      dataNodes.push(cube);

      // Connection line for this data node
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(point.x, point.y, point.z)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      mainGroup.add(line);
      dataLines.push(line);
    });

    dataNodesRef.current = dataNodes;
    dataLinesRef.current = dataLines;

    // Small center point
    const centerGeometry = new THREE.SphereGeometry(2.5, 16, 16);
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.8
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    mainGroup.add(center);

    // Camera controls
    let cameraAngle = 0;
    let cameraVertical = 0;
    let targetAngle = 0;
    let targetVertical = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      isInteractingRef.current = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        targetAngle += deltaX * 0.004;
        targetVertical = Math.max(-1.2, Math.min(1.2, targetVertical + deltaY * 0.004));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => { isInteractingRef.current = false; }, 1500);
    };

    // Scroll zoom disabled - fixed camera distance
    const cameraDistanceFixed = 380;

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      isInteractingRef.current = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - lastMouseX;
        const deltaY = e.touches[0].clientY - lastMouseY;
        targetAngle += deltaX * 0.004;
        targetVertical = Math.max(-1.2, Math.min(1.2, targetVertical + deltaY * 0.004));
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onMouseUp);

    const animate = () => {
      requestAnimationFrame(animate);

      if (!isInteractingRef.current) {
        targetAngle += 0.0005;
      }

      cameraAngle += (targetAngle - cameraAngle) * 0.03;
      cameraVertical += (targetVertical - cameraVertical) * 0.03;

      camera.position.x = Math.sin(cameraAngle) * Math.cos(cameraVertical) * cameraDistanceFixed;
      camera.position.z = Math.cos(cameraAngle) * Math.cos(cameraVertical) * cameraDistanceFixed;
      camera.position.y = Math.sin(cameraVertical) * cameraDistanceFixed;
      camera.lookAt(0, 0, 0);

      // Gentle cube rotation
      mainGroup.children.forEach((child) => {
        if (child.type === 'Mesh' && (child as THREE.Mesh).geometry.type === 'BoxGeometry') {
          child.rotation.x += 0.004;
          child.rotation.y += 0.004;
        }
      });

      // Raycasting for data nodes
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(dataNodesRef.current);

      dataNodesRef.current.forEach((node, i) => {
        node.scale.setScalar(1);
        (node.material as THREE.MeshBasicMaterial).opacity = 0.9;
        (dataLinesRef.current[i].material as THREE.LineBasicMaterial).opacity = 0.12;
        (dataLinesRef.current[i].material as THREE.LineBasicMaterial).color.setHex(0xffffff);
      });

      if (intersects.length > 0) {
        const hovered = intersects[0].object as THREE.Mesh;
        const idx = dataNodesRef.current.indexOf(hovered);

        hovered.scale.setScalar(1.4);
        (hovered.material as THREE.MeshBasicMaterial).opacity = 1;

        if (idx >= 0) {
          (dataLinesRef.current[idx].material as THREE.LineBasicMaterial).opacity = 0.5;
          (dataLinesRef.current[idx].material as THREE.LineBasicMaterial).color.setHex(0x4ade80);
        }

        const vec = hovered.position.clone();
        vec.project(camera);
        const rect = container.getBoundingClientRect();
        setTooltipPos({
          x: (vec.x * 0.5 + 0.5) * width,
          y: -(vec.y * 0.5 - 0.5) * height - 70
        });
        setHoveredNode(hovered.userData as HoveredNode);
      } else {
        setHoveredNode(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onMouseUp);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile]);

  // On mobile, show a static fallback
  if (isMobile) {
    return (
      <div className="w-full px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-xs uppercase tracking-[0.25em] text-green-400">
            Conversion Complete
          </div>
          <h2 className="text-2xl font-normal">
            <span className="text-white/40">Premiere Pro</span>
            <span className="mx-3 text-white/20">→</span>
            <span className="text-white">DaVinci Resolve</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {mockData.slice(0, 4).map((item) => (
              <div
                key={item.key}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className={`text-2xl font-semibold ${
                  item.warning ? 'text-yellow-400' : item.highlight ? 'text-blue-300' : 'text-white'
                }`}>
                  {item.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {/* Header */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
        style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 0.3s'
        }}
      >
        <div className="text-xs tracking-[0.25em] text-green-400 uppercase mb-2">
          Conversion Complete
        </div>
        <h2 className="text-2xl font-normal tracking-tight">
          <span className="text-white/40">Premiere Pro</span>
          <span className="mx-3 text-white/20">→</span>
          <span className="text-white">DaVinci Resolve</span>
        </h2>
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-[#0a0a0a]/95 border border-white/10 rounded-md px-4 py-2 text-center">
            <div className={`text-xl font-semibold tracking-tight ${
              hoveredNode.warning ? 'text-yellow-400' : hoveredNode.highlight ? 'text-blue-300' : 'text-white'
            }`}>
              {hoveredNode.value}
            </div>
            <div className="text-[10px] text-white/40 uppercase tracking-[0.12em] mt-0.5">
              {hoveredNode.label}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
