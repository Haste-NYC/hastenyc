import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseActive;
  uniform vec3 uClick0;  // xy = UV position, z = shader time of click
  uniform vec3 uClick1;
  uniform vec3 uClick2;
  uniform vec3 uBgColor;
  uniform vec3 uBaseColor;

  #define MAX_STEPS 80
  #define MAX_DIST 40.0
  #define SURF_DIST 0.002

  // Smooth minimum for metaball merging
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // Pseudo-random hash (deterministic per seed, unpredictable per click)
  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  // Push a blob center away from a click point (jolt on impact)
  vec3 applyClickJolt(vec3 center, vec3 click) {
    float elapsed = uTime - click.z;
    float isActive = step(0.001, click.z) * step(0.0, elapsed) * step(elapsed, 10.0);
    vec3 cw = vec3(click.xy * 4.0, 0.0);
    vec3 delta = center - cw;
    float dist = length(delta);
    float jolt = 0.35 * exp(-elapsed * 0.35) / (dist + 0.3) * isActive;
    return center + normalize(delta + vec3(0.0001)) * jolt;
  }

  // Apply mouse hover push + click jolts to a blob center
  vec3 applyForces(vec3 center) {
    // Mouse hover: push blobs away from cursor
    vec3 mw = vec3(uMouse * 4.0, 0.0);
    vec3 delta = center - mw;
    float dist = length(delta);
    vec3 result = center + normalize(delta + vec3(0.0001)) * 0.8 * uMouseActive / (dist * dist + 0.5);

    // Click jolts: push blobs outward from click point
    result = applyClickJolt(result, uClick0);
    result = applyClickJolt(result, uClick1);
    result = applyClickJolt(result, uClick2);

    return result;
  }

  // Add fragment spheres for a single click event
  // Each click produces a unique random set of fragments
  float addClickFrags(vec3 p, float d, vec3 click, float ci) {
    float elapsed = uTime - click.z;
    float isActive = step(0.001, click.z) * step(0.0, elapsed) * step(elapsed, 12.0);
    if (isActive < 0.5) return d;

    vec3 cw = vec3(click.xy * 4.0, 0.0);
    float globalDecay = smoothstep(12.0, 6.0, elapsed);

    // Seed from click time -- different every click
    float seed = click.z * 127.1 + ci * 311.7;

    for (int fi = 0; fi < 7; fi++) {
      float ff = float(fi);

      // Per-fragment random properties
      float h1 = hash(seed + ff * 31.7);   // angle
      float h2 = hash(seed + ff * 47.3);   // speed
      float h3 = hash(seed + ff * 73.9);   // size
      float h4 = hash(seed + ff * 97.1);   // visibility (random count)
      float h5 = hash(seed + ff * 113.3);  // z depth
      float h6 = hash(seed + ff * 157.9);  // wobble phase
      float h7 = hash(seed + ff * 191.3);  // gravity weight

      // ~25% of fragments are invisible (random fragment count per click)
      float vis = step(0.25, h4);

      // Random size: mix of big chunks and small droplets
      float fragRadius = (0.12 + h3 * 0.3) * globalDecay * vis;
      if (fragRadius < 0.02) continue;

      // Random angle (full 360, not evenly spaced)
      float angle = h1 * 6.2832;

      // Smaller fragments travel faster (momentum)
      float speed = (0.4 + h2 * 0.7) * (1.2 - h3 * 0.5);

      // Slow exponential ease out (drift, not burst)
      float driftEase = 1.0 - exp(-elapsed * (0.2 + h2 * 0.2));
      float expandDist = speed * driftEase;

      // Base trajectory
      float zOff = (h5 - 0.5) * 0.8;
      vec3 dir = normalize(vec3(cos(angle), sin(angle), zOff));
      vec3 fragPos = cw + dir * expandDist;

      // Wobble: slow lateral oscillation perpendicular to drift
      float wobbleFreq = 0.4 + h6 * 0.8;
      float wobbleAmp = 0.12 * driftEase;
      vec3 wobbleDir = vec3(-sin(angle), cos(angle), 0.0);
      fragPos += wobbleDir * sin(elapsed * wobbleFreq + h6 * 6.28) * wobbleAmp;

      // Gravity: gentle downward pull (heavier fragments sink more)
      fragPos.y -= 0.02 * elapsed * elapsed * (0.3 + h7 * 0.7);

      // SDF + merge with scene
      float frag = length(p - fragPos) - fragRadius;
      // Random merge factor: some fragments stay connected longer
      float fragK = (0.1 + h2 * 0.15) * globalDecay + 0.03;
      d = smin(d, frag, fragK);
    }

    return d;
  }

  // Scene SDF with interaction
  float map(vec3 p) {
    float t = uTime * 0.3;

    // Blob centers with base animation
    vec3 c1 = vec3(0.0, 0.15 * sin(t * 0.8), 0.0);
    vec3 c2 = vec3(-1.1 + 0.3 * sin(t * 0.6), -0.5 + 0.2 * cos(t * 0.7), 0.4 * sin(t * 0.5));
    vec3 c3 = vec3(0.9 + 0.25 * cos(t * 0.5), -0.3 + 0.15 * sin(t * 0.9), -0.3 * cos(t * 0.4));
    vec3 c4 = vec3(-0.3 + 0.2 * sin(t * 0.4 + 1.0), -1.2 + 0.3 * sin(t * 0.5), 0.5 * cos(t * 0.6 + 0.5));
    vec3 c5 = vec3(0.5 + 0.3 * cos(t * 0.7 + 2.0), 0.6 + 0.2 * sin(t * 0.6 + 1.0), -0.2 * sin(t * 0.8));
    vec3 c6 = vec3(1.8 + 0.15 * sin(t * 0.3), 2.0 + 0.1 * cos(t * 0.5), -0.5 + 0.1 * sin(t * 0.4));

    // Apply mouse push + click jolts
    c1 = applyForces(c1);
    c2 = applyForces(c2);
    c3 = applyForces(c3);
    c4 = applyForces(c4);
    c5 = applyForces(c5);
    c6 = applyForces(c6);

    // Sphere SDFs
    float s1 = length(p - c1) - 1.4;
    float s2 = length(p - c2) - 1.1;
    float s3 = length(p - c3) - 1.0;
    float s4 = length(p - c4) - 0.9;
    float s5 = length(p - c5) - 0.85;
    float s6 = length(p - c6) - 0.45;

    // Merge main cluster
    float k = 0.8;
    float d = smin(s1, s2, k);
    d = smin(d, s3, k);
    d = smin(d, s4, k);
    d = smin(d, s5, k);
    d = smin(d, s6, 0.3);

    // Add click fragment spheres
    d = addClickFrags(p, d, uClick0, 0.0);
    d = addClickFrags(p, d, uClick1, 1.0);
    d = addClickFrags(p, d, uClick2, 2.0);

    return d;
  }

  // Central differences normal
  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)
    ));
  }

  // Ambient occlusion
  float calcAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
      float h = 0.02 + 0.1 * float(i);
      float d = map(p + h * n);
      occ += (h - d) * sca;
      sca *= 0.85;
    }
    return clamp(1.0 - 2.5 * occ, 0.0, 1.0);
  }

  // Soft shadow
  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    for (int i = 0; i < 24; i++) {
      float h = map(ro + rd * t);
      res = min(res, k * h / t);
      t += clamp(h, 0.01, 0.3);
      if (t > maxt) break;
    }
    return clamp(res, 0.0, 1.0);
  }

  // Raymarching
  float raymarch(vec3 ro, vec3 rd) {
    float d = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * d;
      float ds = map(p);
      d += ds;
      if (d > MAX_DIST || abs(ds) < SURF_DIST) break;
    }
    return d;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - uResolution.xy * 0.5) / uResolution.y;

    vec3 bgColor = uBgColor;

    vec3 ro = vec3(0.0, 0.0, 6.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    float d = raymarch(ro, rd);

    if (d >= MAX_DIST) {
      gl_FragColor = vec4(bgColor, 1.0);
      return;
    }

    vec3 p = ro + rd * d;
    vec3 n = calcNormal(p);

    // Key light
    vec3 lightPos1 = vec3(-4.0, 6.0, 8.0);
    vec3 lightDir1 = normalize(lightPos1 - p);
    vec3 viewDir = normalize(ro - p);
    vec3 halfDir1 = normalize(lightDir1 + viewDir);

    float diff1 = dot(n, lightDir1) * 0.5 + 0.5;
    diff1 *= diff1;
    float spec1 = pow(max(dot(n, halfDir1), 0.0), 128.0);

    // Fill light
    vec3 lightPos2 = vec3(5.0, 2.0, 6.0);
    vec3 lightDir2 = normalize(lightPos2 - p);
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float diff2 = max(dot(n, lightDir2), 0.0);
    float spec2 = pow(max(dot(n, halfDir2), 0.0), 64.0);

    // Rim
    float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    // Shadow + AO
    float shadow = softShadow(p + n * 0.01, lightDir1, 0.05, 15.0, 12.0);
    float ao = calcAO(p, n);

    // Environment reflection
    vec3 reflDir = reflect(-viewDir, n);
    float envRefl = smoothstep(-0.2, 0.8, reflDir.y) * 0.15;

    vec3 baseColor = uBaseColor;

    vec3 color = vec3(0.0);
    color += baseColor * diff1 * shadow * 0.75;
    color += vec3(1.0) * spec1 * shadow * 0.9;
    color += baseColor * diff2 * 0.25;
    color += vec3(1.0) * spec2 * 0.2;
    color += vec3(0.9, 0.92, 0.95) * rim * 0.35;
    color += baseColor * 0.12 * ao;
    color += vec3(1.0) * envRefl * ao;

    float sss = pow(clamp(dot(viewDir, -lightDir1 + n * 0.3), 0.0, 1.0), 3.0) * 0.15;
    color += baseColor * sss * ao;

    color = color / (color + vec3(0.15));
    color = pow(color, vec3(0.95));

    float edge = smoothstep(MAX_DIST - 2.0, MAX_DIST, d);
    color = mix(color, bgColor, edge);

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface FluidMetaballsProps {
  className?: string;
  bgColor?: [number, number, number];
  baseColor?: [number, number, number];
}

const FluidMetaballs = ({
  className = "",
  bgColor = [0.75, 0.75, 0.75],
  baseColor = [0.96, 0.95, 0.94],
}: FluidMetaballsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch {
      console.warn("FluidMetaballs: WebGL not available");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(
            container.clientWidth * renderer.getPixelRatio(),
            container.clientHeight * renderer.getPixelRatio()
          ),
        },
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseActive: { value: 0.0 },
        uClick0: { value: new THREE.Vector3(0, 0, 0) },
        uClick1: { value: new THREE.Vector3(0, 0, 0) },
        uClick2: { value: new THREE.Vector3(0, 0, 0) },
        uBgColor: { value: new THREE.Vector3(...bgColor) },
        uBaseColor: { value: new THREE.Vector3(...baseColor) },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = Math.random() * 100;

    // --- Interaction state ---
    const mouseTarget = { x: 0, y: 0 };
    const mouseCurrent = { x: 0, y: 0 };
    let mouseActiveTarget = 0;
    let mouseActiveSmooth = 0;

    // Click ring buffer (last 3 clicks)
    const clickSlots = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ];
    let nextClickSlot = 0;

    // Convert screen position to shader UV space
    const screenToUV = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left - rect.width / 2) / rect.height;
      const y = -(clientY - rect.top - rect.height / 2) / rect.height;
      return { x, y };
    };

    const onMouseMove = (e: MouseEvent) => {
      const uv = screenToUV(e.clientX, e.clientY);
      mouseTarget.x = uv.x;
      mouseTarget.y = uv.y;
      mouseActiveTarget = 1;
    };

    const onMouseLeave = () => {
      mouseActiveTarget = 0;
    };

    const onClick = (e: MouseEvent) => {
      const uv = screenToUV(e.clientX, e.clientY);
      const currentTime = material.uniforms.uTime.value;

      clickSlots[nextClickSlot].set(uv.x, uv.y, currentTime);
      material.uniforms[`uClick${nextClickSlot}` as keyof typeof material.uniforms].value =
        clickSlots[nextClickSlot];

      nextClickSlot = (nextClickSlot + 1) % 3;
    };

    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const uv = screenToUV(touch.clientX, touch.clientY);
        mouseTarget.x = uv.x;
        mouseTarget.y = uv.y;
        mouseActiveTarget = 1;
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const uv = screenToUV(touch.clientX, touch.clientY);
        mouseTarget.x = uv.x;
        mouseTarget.y = uv.y;
        mouseActiveTarget = 1;

        // Trigger click on tap
        const currentTime = material.uniforms.uTime.value;
        clickSlots[nextClickSlot].set(uv.x, uv.y, currentTime);
        material.uniforms[`uClick${nextClickSlot}` as keyof typeof material.uniforms].value =
          clickSlots[nextClickSlot];
        nextClickSlot = (nextClickSlot + 1) % 3;
      }
    };

    const onTouchEnd = () => {
      mouseActiveTarget = 0;
    };

    const el = renderer.domElement;
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("click", onClick);
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    el.style.cursor = "pointer";

    let animId: number;

    const render = (time: number) => {
      // Smooth mouse position (lerp toward target)
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.025;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.025;
      mouseActiveSmooth += (mouseActiveTarget - mouseActiveSmooth) * 0.02;

      material.uniforms.uTime.value = startTime + time * 0.001;
      material.uniforms.uMouse.value.set(mouseCurrent.x, mouseCurrent.y);
      material.uniforms.uMouseActive.value = mouseActiveSmooth;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio()
      );
    };

    animId = requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("click", onClick);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      container.removeChild(el);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{
        background: `rgb(${Math.round(bgColor[0] * 255)}, ${Math.round(bgColor[1] * 255)}, ${Math.round(bgColor[2] * 255)})`,
      }}
    />
  );
};

export default FluidMetaballs;
