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
  const rafIdRef = useRef<number>(0);
  const containerSizeRef = useRef({ width: 0, height: 0 });
  const isVisibleRef = useRef(false);

  // Check for mobile on mount (debounced to avoid scene teardown on transient resizes)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const checkMobile = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMobile(window.innerWidth < 768), 300);
    };
    // Set initial value immediately (no debounce)
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {

    if (!containerRef.current) return;
    setMounted(true);

    // Pause render loop when off-screen to save GPU/battery
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    containerSizeRef.current = { width, height };

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
    const allCubes: THREE.Mesh[] = [];

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
      allCubes.push(cube);

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
      allCubes.push(cube);

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
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

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

    // Camera distance - adjustable via pinch on mobile
    let cameraDistance = 380;
    let targetCameraDistance = 380;
    const isMobileDevice = window.innerWidth < 768;
    let lastPinchDist = 0;
    let touchStartX = 0;
    let touchMoved = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start - capture initial distance
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.sqrt(dx * dx + dy * dy);
        isDragging = false;
      } else if (e.touches.length === 1) {
        isDragging = true;
        isInteractingRef.current = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchMoved = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastPinchDist > 0) {
          const scale = lastPinchDist / dist;
          targetCameraDistance = Math.max(200, Math.min(600, targetCameraDistance * scale));
        }
        lastPinchDist = dist;
        e.preventDefault();
      } else if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - lastMouseX;
        // Horizontal only on mobile (won't interfere with vertical scroll)
        targetAngle += deltaX * 0.005;
        if (!isMobileDevice) {
          const deltaY = e.touches[0].clientY - lastMouseY;
          targetVertical = Math.max(-1.2, Math.min(1.2, targetVertical + deltaY * 0.004));
        }
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
        if (Math.abs(e.touches[0].clientX - touchStartX) > 5) touchMoved = true;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        lastPinchDist = 0;
        isDragging = false;
        setTimeout(() => { isInteractingRef.current = false; }, 1500);

        // If it was a tap (not a drag), raycast for tooltip
        if (!touchMoved && isMobileDevice && e.changedTouches.length > 0) {
          const rect = container.getBoundingClientRect();
          const touch = e.changedTouches[0];
          mouseRef.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
          mouseRef.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        }
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    let prevHoveredKey: string | null = null;
    let prevTooltipX = 0;
    let prevTooltipY = 0;

    const animate = () => {
      rafIdRef.current = requestAnimationFrame(animate);

      // Skip rendering when off-screen
      if (!isVisibleRef.current) return;

      if (!isInteractingRef.current) {
        targetAngle += 0.0005;
      }

      cameraAngle += (targetAngle - cameraAngle) * 0.03;
      cameraVertical += (targetVertical - cameraVertical) * 0.03;

      cameraDistance += (targetCameraDistance - cameraDistance) * 0.05;
      camera.position.x = Math.sin(cameraAngle) * Math.cos(cameraVertical) * cameraDistance;
      camera.position.z = Math.cos(cameraAngle) * Math.cos(cameraVertical) * cameraDistance;
      camera.position.y = Math.sin(cameraVertical) * cameraDistance;
      camera.lookAt(0, 0, 0);

      // Gentle cube rotation (Issue 10: use pre-built array instead of scene traversal)
      for (let i = 0; i < allCubes.length; i++) {
        allCubes[i].rotation.x += 0.004;
        allCubes[i].rotation.y += 0.004;
      }

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
        // Issue 2: Use containerSizeRef for current dimensions after resize
        const { width: curW, height: curH } = containerSizeRef.current;
        const newX = (vec.x * 0.5 + 0.5) * curW;
        const newY = -(vec.y * 0.5 - 0.5) * curH - 70;

        // Issue 3: Only update state when values actually change
        const hoveredData = hovered.userData as HoveredNode;
        const hoveredKey = hoveredData.label;
        if (hoveredKey !== prevHoveredKey) {
          prevHoveredKey = hoveredKey;
          setHoveredNode(hoveredData);
        }
        if (newX !== prevTooltipX || newY !== prevTooltipY) {
          prevTooltipX = newX;
          prevTooltipY = newY;
          setTooltipPos({ x: newX, y: newY });
        }
      } else {
        if (prevHoveredKey !== null) {
          prevHoveredKey = null;
          setHoveredNode(null);
        }
      }

      renderer.render(scene, camera);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      containerSizeRef.current = { width: newWidth, height: newHeight };
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      // Dispose GPU resources to prevent memory leaks on remount
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile]);

  return (
    <div className="relative w-full h-[calc(var(--vh,100dvh)-160px)] md:h-[600px] overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {/* Header */}
      <div
        className="absolute top-4 md:top-10 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none"
        style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease 0.3s'
        }}
      >
        <div className="text-[10px] md:text-xs tracking-[0.25em] text-green-400 uppercase mb-2 whitespace-nowrap">
          Conversion Complete
        </div>
        <h2 className="text-base md:text-2xl font-normal tracking-tight whitespace-nowrap">
          <span className="text-white/40">Premiere Pro</span>
          <span className="mx-2 md:mx-3 text-white/20">→</span>
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
