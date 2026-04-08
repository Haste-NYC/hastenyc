import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import FluidMetaballs from "@/components/FluidMetaballs";

// ============================================================
// EXPERIMENT 1: CSS Blob Animation (Pure CSS, no JS)
// ============================================================
const CSSBlobLavaLamp = () => (
  <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
    <svg className="absolute inset-0 w-0 h-0">
      <defs>
        <filter id="css-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
    <div className="absolute inset-0" style={{ filter: "url(#css-goo)" }}>
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/90"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            left: `${15 + (i * 47) % 70}%`,
            animation: `cssBlob${i} ${8 + i * 2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
    <style>{`
      @keyframes cssBlob0 { 0%, 100% { transform: translate(0, 90%) scale(1); } 50% { transform: translate(20px, -10%) scale(1.2); } }
      @keyframes cssBlob1 { 0%, 100% { transform: translate(0, -10%) scale(1.1); } 50% { transform: translate(-30px, 85%) scale(0.9); } }
      @keyframes cssBlob2 { 0%, 100% { transform: translate(0, 80%) scale(0.9); } 33% { transform: translate(15px, 20%) scale(1.15); } 66% { transform: translate(-15px, -5%) scale(1); } }
      @keyframes cssBlob3 { 0%, 100% { transform: translate(0, -5%) scale(1); } 50% { transform: translate(-20px, 75%) scale(1.1); } }
      @keyframes cssBlob4 { 0%, 100% { transform: translate(0, 70%) scale(1.05); } 40% { transform: translate(25px, 10%) scale(0.95); } 80% { transform: translate(-10px, 40%) scale(1.1); } }
      @keyframes cssBlob5 { 0%, 100% { transform: translate(0, 5%) scale(0.95); } 50% { transform: translate(10px, 80%) scale(1.15); } }
      @keyframes cssBlob6 { 0%, 100% { transform: translate(0, 60%) scale(1); } 35% { transform: translate(-20px, 0%) scale(1.1); } 70% { transform: translate(15px, 30%) scale(0.9); } }
    `}</style>
  </div>
);

// ============================================================
// EXPERIMENT 2: SVG Metaball Filter (Smooth merging blobs)
// ============================================================
const SVGMetaballLavaLamp = () => (
  <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="svg-metaball">
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -12"
          />
        </filter>
      </defs>
      <g filter="url(#svg-metaball)">
        {/* Base pools at top and bottom */}
        <ellipse cx="200" cy="580" rx="180" ry="40" fill="rgba(255,255,255,0.85)">
          <animate attributeName="rx" values="180;160;180" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="200" cy="20" rx="160" ry="35" fill="rgba(255,255,255,0.85)">
          <animate attributeName="rx" values="160;180;160" dur="7s" repeatCount="indefinite" />
        </ellipse>
        {/* Rising/falling blobs */}
        <circle cx="150" cy="500" r="35" fill="rgba(255,255,255,0.9)">
          <animate attributeName="cy" values="500;80;500" dur="12s" repeatCount="indefinite" />
          <animate attributeName="r" values="35;28;35" dur="12s" repeatCount="indefinite" />
          <animate attributeName="cx" values="150;170;150" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="100" r="30" fill="rgba(255,255,255,0.9)">
          <animate attributeName="cy" values="100;520;100" dur="14s" repeatCount="indefinite" />
          <animate attributeName="r" values="30;38;30" dur="14s" repeatCount="indefinite" />
          <animate attributeName="cx" values="250;230;250" dur="14s" repeatCount="indefinite" />
        </circle>
        <circle cx="180" cy="300" r="25" fill="rgba(255,255,255,0.85)">
          <animate attributeName="cy" values="480;60;480" dur="16s" repeatCount="indefinite" />
          <animate attributeName="r" values="25;32;25" dur="16s" repeatCount="indefinite" />
          <animate attributeName="cx" values="180;220;180" dur="16s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="200" r="22" fill="rgba(255,255,255,0.85)">
          <animate attributeName="cy" values="120;500;120" dur="11s" repeatCount="indefinite" />
          <animate attributeName="r" values="22;28;22" dur="11s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="350" r="20" fill="rgba(255,255,255,0.8)">
          <animate attributeName="cy" values="520;50;520" dur="18s" repeatCount="indefinite" />
          <animate attributeName="cx" values="200;160;200" dur="18s" repeatCount="indefinite" />
          <animate attributeName="r" values="20;26;20" dur="18s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  </div>
);

// ============================================================
// EXPERIMENT 3: Canvas Metaballs (JS-driven, smooth)
// ============================================================
const CanvasMetaballLavaLamp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const balls = [
      { x: 0.3, y: 0.8, vx: 0.002, vy: -0.004, r: 0.08 },
      { x: 0.7, y: 0.2, vx: -0.001, vy: 0.003, r: 0.07 },
      { x: 0.5, y: 0.5, vx: 0.003, vy: -0.002, r: 0.09 },
      { x: 0.4, y: 0.1, vx: -0.002, vy: 0.005, r: 0.06 },
      { x: 0.6, y: 0.9, vx: 0.001, vy: -0.003, r: 0.075 },
      { x: 0.2, y: 0.6, vx: 0.002, vy: 0.002, r: 0.055 },
    ];

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (const b of balls) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0.05 || b.x > 0.95) b.vx *= -1;
        if (b.y < 0.05 || b.y > 0.95) b.vy *= -1;
      }

      // Render metaballs using pixel sampling
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      const step = 2; // sample every 2 pixels for performance

      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          let sum = 0;
          const nx = px / w;
          const ny = py / h;
          for (const b of balls) {
            const dx = nx - b.x;
            const dy = ny - b.y;
            sum += (b.r * b.r) / (dx * dx + dy * dy + 0.0001);
          }

          if (sum > 1) {
            const alpha = Math.min(255, (sum - 1) * 200);
            for (let sy = 0; sy < step && py + sy < h; sy++) {
              for (let sx = 0; sx < step && px + sx < w; sx++) {
                const idx = ((py + sy) * w + (px + sx)) * 4;
                data[idx] = 255;
                data[idx + 1] = 255;
                data[idx + 2] = 255;
                data[idx + 3] = alpha;
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ============================================================
// EXPERIMENT 4: WebGL Shader Metaballs (GPU-powered)
// ============================================================
const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    float v = 0.0;

    // 6 metaballs with different orbits
    vec2 b1 = vec2(0.5 + 0.3 * sin(u_time * 0.4), 0.5 + 0.35 * cos(u_time * 0.3));
    vec2 b2 = vec2(0.5 + 0.25 * cos(u_time * 0.5), 0.5 + 0.3 * sin(u_time * 0.45));
    vec2 b3 = vec2(0.5 + 0.2 * sin(u_time * 0.35 + 1.0), 0.5 + 0.25 * cos(u_time * 0.55 + 2.0));
    vec2 b4 = vec2(0.5 + 0.35 * cos(u_time * 0.25 + 3.0), 0.5 + 0.2 * sin(u_time * 0.6 + 1.0));
    vec2 b5 = vec2(0.5 + 0.15 * sin(u_time * 0.7 + 2.0), 0.5 + 0.35 * cos(u_time * 0.35 + 3.0));
    vec2 b6 = vec2(0.5 + 0.28 * cos(u_time * 0.3 + 4.0), 0.5 + 0.18 * sin(u_time * 0.5 + 5.0));

    v += 0.008 / (dot(uv - b1, uv - b1) + 0.0001);
    v += 0.006 / (dot(uv - b2, uv - b2) + 0.0001);
    v += 0.007 / (dot(uv - b3, uv - b3) + 0.0001);
    v += 0.005 / (dot(uv - b4, uv - b4) + 0.0001);
    v += 0.004 / (dot(uv - b5, uv - b5) + 0.0001);
    v += 0.005 / (dot(uv - b6, uv - b6) + 0.0001);

    float edge = smoothstep(0.95, 1.05, v);
    float glow = smoothstep(0.5, 1.0, v) * 0.15;

    float alpha = edge + glow;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

const WebGLShaderLavaLamp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    let animId: number;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };
    render();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ============================================================
// EXPERIMENT 5: Raymarched 3D Lava Lamp (based on brybrant/lava-lamp)
// ============================================================
const ORGANIC_FRAGMENT = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  #define MAX_STEPS 40
  #define MAX_DIST 30.0
  #define SURF_DIST 0.01

  float ballspeed = 0.125;

  // Smooth union - the key to lava lamp blob merging
  float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
  }

  // Scene SDF: top/bottom planes + spheres bouncing between them
  float getDist(vec3 p) {
    float time = u_time * ballspeed;

    float botPlane = p.y + 2.0;
    float topPlane = 2.0 - p.y;

    float s1 = length(p - vec3(
      0.0, sin(time + 2.0) * 3.0, sin(time)
    )) - 1.5;

    float s2 = length(p - vec3(
      -1.0, sin(time) * 2.0, 4.0 + cos(time)
    )) - 1.5;

    float s3 = length(p - vec3(
      -1.0, sin(time + 4.0) * 2.0, -4.0 - cos(time)
    )) - 1.5;

    float s4 = length(p - vec3(
      3.0, sin(time * 0.75 + 6.0) * 2.0, 2.5 - cos(time * 0.75)
    )) - 2.0;

    float s5 = length(p - vec3(
      3.0, sin(time * 0.75 + 9.0) * 2.0, -2.5 + cos(time * 0.75 + 3.0)
    )) - 2.0;

    float d = opSmoothUnion(botPlane, topPlane, 1.0);
    d = opSmoothUnion(d, s1, 1.0);
    d = opSmoothUnion(d, s2, 1.0);
    d = opSmoothUnion(d, s3, 1.0);
    d = opSmoothUnion(d, s4, 1.0);
    d = opSmoothUnion(d, s5, 1.0);

    return d;
  }

  // Accurate normals via central differences
  vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.005, 0.0);
    return normalize(vec3(
      getDist(p + e.xyy) - getDist(p - e.xyy),
      getDist(p + e.yxy) - getDist(p - e.yxy),
      getDist(p + e.yyx) - getDist(p - e.yyx)
    ));
  }

  // Soft shadow
  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    for (int i = 0; i < 16; i++) {
      float h = getDist(ro + rd * t);
      res = min(res, k * h / t);
      t += clamp(h, 0.02, 0.5);
      if (t > maxt) break;
    }
    return clamp(res, 0.0, 1.0);
  }

  // Ambient occlusion
  float calcAO(vec3 p, vec3 n) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
      float h = 0.01 + 0.12 * float(i);
      float d = getDist(p + h * n);
      occ += (h - d) * sca;
      sca *= 0.95;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
  }

  float raymarch(vec3 ro, vec3 rd) {
    float d = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * d;
      float ds = getDist(p);
      d += ds;
      if (d > MAX_DIST || abs(ds) < SURF_DIST) break;
    }
    return d;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;

    // Camera
    vec3 ro = vec3(-6.0, 0.0, 0.0);
    vec3 rd = normalize(vec3(1.0, uv.y, uv.x));

    float d = raymarch(ro, rd);

    if (d >= MAX_DIST) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);

    // === LIGHTING ===
    vec3 lightPos = vec3(-30.0, 5.0, 0.0);
    vec3 lightDir = normalize(lightPos - p);
    vec3 viewDir = normalize(ro - p);
    vec3 halfDir = normalize(lightDir + viewDir);

    // Half-lambert diffuse
    float diff = dot(n, lightDir) * 0.5 + 0.5;
    diff *= diff;

    // Blinn-Phong specular
    float spec = pow(max(dot(n, halfDir), 0.0), 64.0);

    // Fresnel
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 4.0);

    // Soft shadow + AO
    float shadow = softShadow(p + n * 0.02, lightDir, 0.1, 25.0, 8.0);
    float ao = calcAO(p, n);

    // Subsurface scattering
    float sss = pow(clamp(dot(viewDir, -lightDir + n * 0.5), 0.0, 1.0), 2.0) * 0.3;

    // Fill light
    vec3 lightDir2 = normalize(vec3(20.0, 3.0, 5.0) - p);
    float diff2 = max(dot(n, lightDir2), 0.0) * 0.3;

    // Rim
    float rim = fresnel * 0.4;

    // Material
    vec3 baseColor = vec3(0.95, 0.93, 0.91);

    // Combine
    vec3 color = vec3(0.0);
    color += baseColor * diff * shadow * 0.9;
    color += baseColor * diff2 * 0.4;
    color += vec3(1.0) * spec * shadow * 0.5;
    color += baseColor * sss * ao;
    color += vec3(0.9, 0.92, 0.95) * rim;
    color += baseColor * 0.05 * ao;

    // Tone map
    color = color / (color + vec3(0.2));
    color = pow(color, vec3(0.92));

    // Depth fog
    float fog = 1.0 - smoothstep(4.0, 15.0, d);
    color *= fog;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const WebGLOrganicLavaLamp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    let animId: number;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, ORGANIC_FRAGMENT);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };
    render();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ============================================================
// EXPERIMENT 6: WebGL Noise-based Fluid (organic flowing liquid)
// ============================================================
const NOISE_FLUID_FRAGMENT = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float t = u_time * 0.15;

    // Layered noise for fluid look
    float n1 = snoise(uv * 3.0 + vec2(t, t * 0.7));
    float n2 = snoise(uv * 5.0 + vec2(-t * 0.5, t * 1.2)) * 0.5;
    float n3 = snoise(uv * 8.0 + vec2(t * 0.3, -t * 0.8)) * 0.25;

    float n = n1 + n2 + n3;

    // Add vertical movement bias (rising)
    n += sin(uv.y * 6.28 + t * 2.0) * 0.3;

    // Threshold for liquid shape
    float liquid = smoothstep(0.1, 0.3, n);
    float edge_glow = smoothstep(-0.1, 0.1, n) * 0.1;

    float alpha = liquid * 0.85 + edge_glow;

    gl_FragColor = vec4(vec3(1.0, 0.98, 0.96), alpha);
  }
`;

const WebGLNoiseFluidLavaLamp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    let animId: number;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, NOISE_FLUID_FRAGMENT);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };
    render();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-lg">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================

const experiments = [
  {
    id: 1,
    title: "CSS + SVG Filter Goo",
    tech: "Pure CSS animations + SVG feGaussianBlur filter",
    pros: "Zero JS, lightweight, good browser support",
    cons: "Less control over merging behavior",
    component: CSSBlobLavaLamp,
  },
  {
    id: 2,
    title: "SVG Metaball Animation",
    tech: "SVG SMIL animations + feColorMatrix filter",
    pros: "Declarative, no JS runtime, true metaball merging",
    cons: "SMIL deprecated in some browsers, limited control",
    component: SVGMetaballLavaLamp,
  },
  {
    id: 3,
    title: "Canvas 2D Metaballs",
    tech: "Canvas pixel manipulation, JS metaball math",
    pros: "Precise control, classic metaball algorithm",
    cons: "CPU-bound, lower resolution for performance",
    component: CanvasMetaballLavaLamp,
  },
  {
    id: 4,
    title: "WebGL Shader Metaballs",
    tech: "GLSL fragment shader, GPU metaball fields",
    pros: "Smooth 60fps, GPU-powered, crisp at any resolution",
    cons: "WebGL required, more complex code",
    component: WebGLShaderLavaLamp,
  },
  {
    id: 5,
    title: "Raymarched 3D Lava Lamp",
    tech: "Raymarching, smooth union SDF, soft shadows, AO, SSS",
    pros: "True 3D with shadows, specular, depth -- most realistic",
    cons: "WebGL required, heavier GPU load (40 ray steps)",
    component: WebGLOrganicLavaLamp,
  },
  {
    id: 6,
    title: "WebGL Noise Fluid",
    tech: "GLSL simplex noise, layered fluid simulation",
    pros: "Organic flowing texture, very smooth",
    cons: "Less blobby, more fluid/amorphous",
    component: WebGLNoiseFluidLavaLamp,
  },
  {
    id: 7,
    title: "Three.js Fluid Metaballs",
    tech: "Three.js + GLSL raymarching, SDF smooth union, Blinn-Phong + AO + soft shadows",
    pros: "True 3D glossy blobs, specular highlights, Three.js ecosystem, closest to reference",
    cons: "Heaviest GPU load (80 ray steps), Three.js dependency",
    component: FluidMetaballs,
  },
];

const LavaLampExperiments = () => {
  const [fullscreen, setFullscreen] = useState<number | null>(null);

  if (fullscreen !== null) {
    const exp = experiments.find((e) => e.id === fullscreen);
    if (exp) {
      const Comp = exp.component;
      return (
        <div className="fixed inset-0 z-50 bg-black">
          <Comp />
          <button
            onClick={() => setFullscreen(null)}
            className="absolute top-6 right-6 z-50 text-white/60 hover:text-white text-sm uppercase tracking-wider border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm bg-black/30 transition-colors"
          >
            Back to grid
          </button>
          <div className="absolute bottom-6 left-6 z-50">
            <p className="text-white/80 text-lg font-medium">{exp.title}</p>
            <p className="text-white/40 text-xs mt-1">{exp.tech}</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Lava Lamp Background Experiments
            </h1>
            <p className="text-muted-foreground text-sm">
              White liquid animations on black. Click any tile to view fullscreen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((exp) => {
              const Comp = exp.component;
              return (
                <div key={exp.id} className="space-y-3">
                  <button
                    onClick={() => setFullscreen(exp.id)}
                    className="block w-full aspect-[3/4] rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <Comp />
                  </button>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {exp.id}. {exp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {exp.tech}
                    </p>
                    <p className="text-xs text-green-400/70 mt-1">+ {exp.pros}</p>
                    <p className="text-xs text-red-400/70">- {exp.cons}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LavaLampExperiments;
