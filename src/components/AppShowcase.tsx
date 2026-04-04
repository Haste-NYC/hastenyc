import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

// --- Workflow phases ---
// Each phase lasts a set duration (ms). Elements animate in/out between phases.
// Phase 0: Select   - "Browse" / "Select from open projects" -> project highlighted
// Phase 1: Configure - Options fly out, checkboxes toggle, stems selected, QC on
// Phase 2: Convert   - Everything collapses, progress ring spins, percentage counts up
// Phase 3: Complete  - Data sphere with completion metrics
const PHASE_DURATIONS = [4000, 5000, 5000, 5000];
const TOTAL_CYCLE = PHASE_DURATIONS.reduce((a, b) => a + b, 0);

// Golden-ratio sphere point distribution
function fibSpherePoints(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const gr = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const inc = Math.acos(1 - 2 * t);
    const az = 2 * Math.PI * gr * i;
    pts.push(new THREE.Vector3(
      radius * Math.sin(inc) * Math.cos(az),
      radius * Math.sin(inc) * Math.sin(az),
      radius * Math.cos(inc),
    ));
  }
  return pts;
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

// Create a rounded-rect text sprite
function makeTextSprite(text: string, opts: {
  fontSize?: number; color?: string; bg?: string; padding?: number; borderRadius?: number; bold?: boolean; width?: number;
} = {}) {
  const { fontSize = 28, color = "rgba(255,255,255,0.7)", bg = "rgba(255,255,255,0.04)", padding = 18, borderRadius = 12, bold = false, width: fixedWidth } = opts;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${bold ? "600" : "400"} ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro", Inter, sans-serif`;
  const measured = ctx.measureText(text);
  const textW = fixedWidth ?? Math.ceil(measured.width) + padding * 2;
  const textH = fontSize + padding * 2;
  canvas.width = textW * 2;
  canvas.height = textH * 2;
  ctx.scale(2, 2);

  // Background
  ctx.beginPath();
  ctx.roundRect(0, 0, textW, textH, borderRadius);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Text
  ctx.font = `${bold ? "600" : "400"} ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro", Inter, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, textW / 2, textH / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  const aspect = textW / textH;
  sprite.scale.set(aspect * 14, 14, 1);
  return sprite;
}

// Checkbox sprite
function makeCheckbox(label: string, checked: boolean) {
  const canvas = document.createElement("canvas");
  const w = 500, h = 64;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Checkbox
  const boxSize = 28;
  const boxX = 12, boxY = (h - boxSize) / 2;
  ctx.strokeStyle = checked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxSize, boxSize, 5);
  ctx.stroke();
  if (checked) {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boxX + 7, boxY + 14);
    ctx.lineTo(boxX + 12, boxY + 20);
    ctx.lineTo(boxX + 21, boxY + 9);
    ctx.stroke();
  }

  // Label
  ctx.font = "400 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = checked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label, boxX + boxSize + 12, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set((w / h) * 10, 10, 1);
  return sprite;
}

// Toggle sprite
function makeToggle(label: string, on: boolean) {
  const canvas = document.createElement("canvas");
  const w = 500, h = 64;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Track
  const trackW = 44, trackH = 22;
  const trackX = 12, trackY = (h - trackH) / 2;
  ctx.beginPath();
  ctx.roundRect(trackX, trackY, trackW, trackH, trackH / 2);
  ctx.fillStyle = on ? "rgba(46,172,80,0.5)" : "rgba(255,255,255,0.08)";
  ctx.fill();

  // Thumb
  const thumbR = 8;
  const thumbX = on ? trackX + trackW - thumbR - 4 : trackX + thumbR + 4;
  ctx.beginPath();
  ctx.arc(thumbX, h / 2, thumbR, 0, Math.PI * 2);
  ctx.fillStyle = on ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)";
  ctx.fill();

  // Label
  ctx.font = "400 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = on ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label, trackX + trackW + 14, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set((w / h) * 10, 10, 1);
  return sprite;
}

// Progress ring geometry
function makeProgressRing(progress: number, radius: number, color: THREE.Color) {
  const segments = 64;
  const angle = progress * Math.PI * 2;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * angle - Math.PI / 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 });
  return new THREE.Line(geo, mat);
}

// Data node for completion sphere
function makeDataNode(value: string, label: string, highlight: boolean) {
  const canvas = document.createElement("canvas");
  const w = 160, h = 80;
  canvas.width = w * 2; canvas.height = h * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);

  ctx.font = "700 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = highlight ? "rgba(46,172,80,0.9)" : "rgba(255,255,255,0.75)";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(value, w / 2, h / 2 - 2);

  ctx.font = "500 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(label.toUpperCase(), w / 2, h / 2 + 3);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set((w / h) * 8, 8, 1);
  return sprite;
}

export default function AppShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phaseLabel, setPhaseLabel] = useState("Select Project");
  const [isMobile, setIsMobile] = useState(true);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Visibility observer
    const obs = new IntersectionObserver(
      ([e]) => { isVisibleRef.current = e.isIntersecting; },
      { threshold: 0 }
    );
    obs.observe(container);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
    camera.position.set(0, 0, 120);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Phase 0: Select ---
    const selectGroup = new THREE.Group();
    group.add(selectGroup);
    const browseBtn = makeTextSprite("Browse for project file", { fontSize: 24, bg: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)" });
    browseBtn.position.set(0, 8, 0);
    selectGroup.add(browseBtn);
    const selectBtn = makeTextSprite("Select from open projects...", { fontSize: 24, bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" });
    selectBtn.position.set(0, -4, 0);
    selectGroup.add(selectBtn);
    const projectName = makeTextSprite("EP01_Main_V6.prproj", { fontSize: 24, bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", bold: true });
    projectName.position.set(0, -16, 0);
    projectName.material.opacity = 0;
    selectGroup.add(projectName);

    // --- Phase 1: Configure ---
    const configGroup = new THREE.Group();
    group.add(configGroup);
    configGroup.visible = false;

    // Title
    const configTitle = makeTextSprite("EP01_Main_V6.prproj", { fontSize: 22, color: "rgba(255,255,255,0.7)", bg: "rgba(255,255,255,0.06)", bold: true });
    configTitle.position.set(0, 28, 0);
    configGroup.add(configTitle);

    // Checkboxes
    const checkboxData = [
      { label: "Disabled Tracks", checked: true },
      { label: "Empty Tracks", checked: true },
      { label: "Graphics", checked: false },
      { label: "Offline Clips", checked: true },
      { label: "Effects", checked: false },
      { label: "Transitions", checked: false },
    ];
    const checkboxSprites: THREE.Sprite[] = [];
    checkboxData.forEach((cb, i) => {
      const sprite = makeCheckbox(cb.label, cb.checked);
      const col = i % 2;
      const row = Math.floor(i / 2);
      sprite.position.set(-18 + col * 36, 14 - row * 10, 0);
      configGroup.add(sprite);
      checkboxSprites.push(sprite);
    });

    // Audio mode label
    const stemsLabel = makeTextSprite("Stems", { fontSize: 22, color: "rgba(255,255,255,0.7)", bg: "rgba(140,100,200,0.15)" });
    stemsLabel.position.set(-14, -18, 0);
    configGroup.add(stemsLabel);
    const mixLabel = makeTextSprite("Audio Mixdown", { fontSize: 22, color: "rgba(255,255,255,0.25)", bg: "rgba(255,255,255,0.02)" });
    mixLabel.position.set(18, -18, 0);
    configGroup.add(mixLabel);

    // QC toggle
    const qcToggle = makeToggle("QC Verification", true);
    qcToggle.position.set(0, -30, 0);
    configGroup.add(qcToggle);

    // --- Phase 2: Convert ---
    const convertGroup = new THREE.Group();
    group.add(convertGroup);
    convertGroup.visible = false;

    // Progress ring track (background)
    const ringTrackGeo = new THREE.RingGeometry(28, 29.5, 64);
    const ringTrackMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    const ringTrack = new THREE.Mesh(ringTrackGeo, ringTrackMat);
    convertGroup.add(ringTrack);

    // Progress ring (filled) - will be recreated each frame
    let progressLine: THREE.Line | null = null;
    const progressColor = new THREE.Color(0xb464c8);

    // Percentage text
    const percentCanvas = document.createElement("canvas");
    percentCanvas.width = 256; percentCanvas.height = 128;
    const percentTex = new THREE.CanvasTexture(percentCanvas);
    percentTex.minFilter = THREE.LinearFilter;
    const percentMat = new THREE.SpriteMaterial({ map: percentTex, transparent: true, depthWrite: false });
    const percentSprite = new THREE.Sprite(percentMat);
    percentSprite.scale.set(20, 10, 1);
    percentSprite.position.set(0, 0, 1);
    convertGroup.add(percentSprite);

    // Status text
    const statusCanvas = document.createElement("canvas");
    statusCanvas.width = 512; statusCanvas.height = 64;
    const statusTex = new THREE.CanvasTexture(statusCanvas);
    statusTex.minFilter = THREE.LinearFilter;
    const statusMat = new THREE.SpriteMaterial({ map: statusTex, transparent: true, depthWrite: false });
    const statusSprite = new THREE.Sprite(statusMat);
    statusSprite.scale.set(40, 5, 1);
    statusSprite.position.set(0, -22, 0);
    convertGroup.add(statusSprite);

    const statusMessages = ["LOADING PROJECT", "EXTRACTING SEQUENCES", "CONVERTING TIMELINES", "TRANSFERRING MEDIA", "IMPORTING TO RESOLVE"];

    function updatePercentText(pct: number) {
      const ctx = percentCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, 256, 128);
      ctx.font = "700 56px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(pct)}%`, 128, 64);
      percentTex.needsUpdate = true;
    }

    function updateStatusText(msg: string) {
      const ctx = statusCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, 512, 64);
      ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(msg, 256, 32);
      statusTex.needsUpdate = true;
    }

    // --- Phase 3: Complete ---
    const completeGroup = new THREE.Group();
    group.add(completeGroup);
    completeGroup.visible = false;

    const completeData = [
      { value: "847", label: "Clips", highlight: false },
      { value: "2", label: "Sequences", highlight: false },
      { value: "156", label: "Effects", highlight: false },
      { value: "23", label: "Markers", highlight: false },
      { value: "36", label: "Tracks", highlight: false },
      { value: "0", label: "Errors", highlight: true },
      { value: "0:14", label: "Time", highlight: false },
      { value: "4.2h", label: "Saved", highlight: false },
    ];

    const sphereTargets = fibSpherePoints(completeData.length, 35);
    const dataNodes: THREE.Sprite[] = [];
    const dataLines: THREE.Line[] = [];
    completeData.forEach((d, i) => {
      const node = makeDataNode(d.value, d.label, d.highlight);
      node.position.set(0, 0, 0);
      completeGroup.add(node);
      dataNodes.push(node);

      // Connection line
      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), sphereTargets[i]]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
      const line = new THREE.Line(lineGeo, lineMat);
      completeGroup.add(line);
      dataLines.push(line);
    });

    // Center sphere for complete
    const centerGeo = new THREE.SphereGeometry(4, 32, 32);
    const centerMat = new THREE.MeshBasicMaterial({ color: 0x2eac50, transparent: true, opacity: 0.6 });
    const centerSphere = new THREE.Mesh(centerGeo, centerMat);
    completeGroup.add(centerSphere);

    // "CONFORM COMPLETE" text
    const completeLabel = makeTextSprite("CONFORM COMPLETE", { fontSize: 20, color: "rgba(255,255,255,0.5)", bg: "transparent", bold: true });
    completeLabel.position.set(0, -42, 0);
    completeGroup.add(completeLabel);

    // Decorative orbit ring
    const orbitGeo = new THREE.RingGeometry(34, 34.3, 64);
    const orbitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
    const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
    completeGroup.add(orbitRing);

    // --- Slow camera orbit ---
    const mouseTarget = { x: 0, y: 0 };
    const mouseSmoothed = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onMouseLeave = () => { mouseTarget.x = 0; mouseTarget.y = 0; };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // --- Animation loop ---
    const startTime = Date.now();
    let rafId = 0;

    function getPhase(elapsed: number) {
      const cycle = elapsed % TOTAL_CYCLE;
      let acc = 0;
      for (let i = 0; i < PHASE_DURATIONS.length; i++) {
        acc += PHASE_DURATIONS[i];
        if (cycle < acc) {
          const phaseElapsed = cycle - (acc - PHASE_DURATIONS[i]);
          return { phase: i, t: phaseElapsed / PHASE_DURATIONS[i], phaseElapsed };
        }
      }
      return { phase: 0, t: 0, phaseElapsed: 0 };
    }

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      const elapsed = Date.now() - startTime;
      const { phase, t } = getPhase(elapsed);

      // Smooth mouse for camera
      mouseSmoothed.x += (mouseTarget.x - mouseSmoothed.x) * 0.05;
      mouseSmoothed.y += (mouseTarget.y - mouseSmoothed.y) * 0.05;

      // Gentle camera orbit
      const baseAngle = elapsed * 0.00005;
      camera.position.x = Math.sin(baseAngle) * 10 + mouseSmoothed.x * 12;
      camera.position.y = mouseSmoothed.y * -8;
      camera.lookAt(0, 0, 0);

      // Transition durations
      const fadeIn = Math.min(t * 4, 1); // First 25% of phase
      const fadeOut = Math.max(0, 1 - (t - 0.8) * 5); // Last 20% of phase
      const visibility = Math.min(fadeIn, fadeOut);

      // Reset visibility
      selectGroup.visible = false;
      configGroup.visible = false;
      convertGroup.visible = false;
      completeGroup.visible = false;

      // Phase labels
      const labels = ["Select Project", "Configure Options", "Converting...", "Complete"];
      setPhaseLabel(labels[phase]);

      if (phase === 0) {
        selectGroup.visible = true;
        // Fade in browse/select, then highlight project name
        browseBtn.material.opacity = visibility;
        selectBtn.material.opacity = visibility;
        const projectFade = t > 0.4 ? easeOutCubic(Math.min((t - 0.4) / 0.3, 1)) : 0;
        projectName.material.opacity = projectFade * visibility;
        // Slight drift
        selectGroup.position.y = Math.sin(elapsed * 0.001) * 1;
      }

      if (phase === 1) {
        configGroup.visible = true;
        // Stagger checkboxes in
        checkboxSprites.forEach((s, i) => {
          const delay = i * 0.06;
          const localT = Math.max(0, t - delay);
          const appear = easeOutCubic(Math.min(localT * 5, 1));
          s.material.opacity = appear * visibility;
          s.position.z = (1 - appear) * 20;
        });
        configTitle.material.opacity = visibility;
        stemsLabel.material.opacity = visibility * (t > 0.3 ? 1 : 0);
        mixLabel.material.opacity = visibility * (t > 0.3 ? 1 : 0);
        qcToggle.material.opacity = visibility * (t > 0.5 ? easeOutCubic(Math.min((t - 0.5) / 0.2, 1)) : 0);
        configGroup.position.y = Math.sin(elapsed * 0.001) * 1;
      }

      if (phase === 2) {
        convertGroup.visible = true;

        const progress = easeInOutCubic(Math.min(t / 0.85, 1));
        updatePercentText(progress * 100);

        // Progress ring
        if (progressLine) {
          convertGroup.remove(progressLine);
          progressLine.geometry.dispose();
          (progressLine.material as THREE.LineBasicMaterial).dispose();
        }
        progressLine = makeProgressRing(progress, 29, progressColor);
        convertGroup.add(progressLine);

        // Status message
        const msgIndex = Math.min(Math.floor(progress * statusMessages.length), statusMessages.length - 1);
        updateStatusText(statusMessages[msgIndex]);

        // Fade
        ringTrackMat.opacity = 0.04 * visibility;
        percentMat.opacity = visibility;
        statusMat.opacity = visibility * 0.8;

        // Spin ring track subtly
        ringTrack.rotation.z = elapsed * 0.0003;
        convertGroup.position.y = Math.sin(elapsed * 0.001) * 0.5;
      }

      if (phase === 3) {
        completeGroup.visible = true;

        // Animate nodes outward from center
        const expandT = easeOutCubic(Math.min(t * 2.5, 1));
        dataNodes.forEach((node, i) => {
          const target = sphereTargets[i];
          node.position.lerpVectors(new THREE.Vector3(), target, expandT);
          node.material.opacity = expandT * visibility;

          // Gentle pulse after expanded
          if (expandT >= 1) {
            const pulse = 1 + Math.sin(elapsed * 0.002 + i * 0.7) * 0.08;
            node.scale.setScalar(pulse);
          }
        });

        // Update connection lines
        dataLines.forEach((line, i) => {
          const positions = line.geometry.attributes.position;
          const current = dataNodes[i].position;
          positions.setXYZ(1, current.x, current.y, current.z);
          positions.needsUpdate = true;
          (line.material as THREE.LineBasicMaterial).opacity = 0.06 * expandT * visibility;
        });

        centerMat.opacity = 0.6 * expandT * visibility;
        completeLabel.material.opacity = expandT * visibility * 0.7;
        orbitMat.opacity = 0.04 * expandT * visibility;
        orbitRing.rotation.z = elapsed * 0.0002;

        // Slow rotate entire sphere
        completeGroup.rotation.y = elapsed * 0.0002;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      obs.disconnect();

      // Cleanup GPU
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
        if (obj instanceof THREE.Sprite) {
          obj.material.map?.dispose();
          obj.material.dispose();
        }
      });
      if (progressLine) {
        progressLine.geometry.dispose();
        (progressLine.material as THREE.LineBasicMaterial).dispose();
      }
      percentTex.dispose();
      statusTex.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11px] uppercase tracking-[0.15em] text-white/30 block mb-3">How It Works</span>
          <h2
            className="font-black tracking-tight leading-none"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-0.02em" }}
          >
            Five Steps / Zero Friction
          </h2>
        </motion.div>

        {/* Phase label */}
        <div className="text-center mb-4">
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold">{phaseLabel}</span>
        </div>

        {/* 3D Canvas */}
        <div
          ref={containerRef}
          className="w-full mx-auto relative"
          style={{ height: "min(500px, 60vw)", maxWidth: "800px" }}
        />

        {/* Phase dots */}
        <div className="flex justify-center gap-6 mt-6">
          {["Select", "Configure", "Convert", "Complete"].map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                phaseLabel.toLowerCase().startsWith(label.toLowerCase()) ? "bg-white w-3" : "bg-white/15"
              }`} />
              <span className={`text-[9px] uppercase tracking-wider transition-colors duration-500 ${
                phaseLabel.toLowerCase().startsWith(label.toLowerCase()) ? "text-white/50" : "text-white/15"
              }`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
