import { useEffect, useRef } from "react";
import conformLogo from "@/assets/conform-studio-logo.png";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uCameraPosition;

vec3 backgroundColor = vec3(0.4, 0.1, 0.4);
vec3 lavaColor = vec3(2.0, 0.8, -0.6);

#define MAX_STEPS 30
#define MAX_DIST 30.0
#define MIN_DIST 1.5
vec4 sphere = vec4(0.0, 0.0, 0.0, 1.0);
vec3 lightpos = vec3(-30.0, 2.0, 0.0);
float ballspeed = 0.125;

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

float getDist(vec3 raypos) {
  float time = uTime * ballspeed;
  float botPlane = raypos.y + 2.0;
  float topPlane = 2.0 - raypos.y;
  float sphereMiddle = length(raypos - vec3(0.0, sin(time + 2.0) * 3.0, sin(time))) - 1.5;
  float sphereRight = length(raypos - vec3(-1.0, sin(time) * 2.0, 4.0 + cos(time))) - 1.5;
  float sphereLeft = length(raypos - vec3(-1.0, sin(time + 4.0) * 2.0, -4.0 - cos(time))) - 1.5;
  float sphereBackRight = length(raypos - vec3(3.0, sin(time * 0.75 + 6.0) * 2.0, 2.5 - cos(time * 0.75))) - 2.0;
  float sphereBackLeft = length(raypos - vec3(3.0, sin(time * 0.75 + 9.0) * 2.0, -2.5 + cos(time * 0.75 + 3.0))) - 2.0;
  float dist = opSmoothUnion(botPlane, topPlane, 1.0);
  dist = opSmoothUnion(dist, sphereMiddle, 1.0);
  dist = opSmoothUnion(dist, sphereRight, 1.0);
  dist = opSmoothUnion(dist, sphereLeft, 1.0);
  dist = opSmoothUnion(dist, sphereBackRight, 1.0);
  dist = opSmoothUnion(dist, sphereBackLeft, 1.0);
  return dist;
}

vec3 getNormal(vec3 p) { return normalize(sphere.xyz - p); }

float getLight(vec3 p) {
  vec3 lightdir = normalize(lightpos - p);
  vec3 normal = getNormal(p);
  return dot(normal, lightdir);
}

float raymarch(vec3 camera, vec3 dir) {
  float dist = 1.5;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 pos = camera + dir * dist;
    float stepdist = getDist(pos);
    dist += stepdist;
    if (dist > MAX_DIST || dist < MIN_DIST) break;
  }
  return dist;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uResolution.xy * 0.5) / uResolution.y;
  vec3 col = vec3(0.0);
  vec3 camera = uCameraPosition;
  vec3 ray = vec3(1.0, uv.y, uv.x);
  float d = raymarch(camera, normalize(ray));
  vec3 p = camera + ray * d;
  float diff = getLight(p);
  col += vec3(1.0 - diff);
  col = col * 0.5;
  gl_FragColor = vec4(mix(backgroundColor, lavaColor, col), 1.0);
}
`;

function useLavaCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) return;
    canvas.width = 1200;
    canvas.height = 630;
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
    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uCamera = gl.getUniformLocation(prog, "uCameraPosition");
    gl.viewport(0, 0, 1200, 630);
    gl.uniform2f(uRes, 1200, 630);
    gl.uniform3f(uCamera, -6.0, 0.0, 0.0);
    gl.uniform1f(uTime, 42.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, []);
}

const LavaBackground = ({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "#0d0d1a", zIndex: -1 }} />
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: 1200, height: 630, opacity: 0.5 }} />
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
      }}
    />
  </>
);

const font = "'Inter', 'Space Grotesk', system-ui, sans-serif";

// -------------------------------------------------------------------
// OPTION A: Logo only -- maximum visual impact, zero legibility risk
// -------------------------------------------------------------------
const OptionA = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLavaCanvas(canvasRef);
  return (
    <div id="og-a" style={{ position: "relative", width: 1200, height: 630, overflow: "hidden", flexShrink: 0 }}>
      <LavaBackground canvasRef={canvasRef} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
        <img
          src={conformLogo}
          alt="Conform Studio"
          style={{ width: "920px", height: "auto", filter: "drop-shadow(0 0 40px rgba(255,255,255,0.2))" }}
        />
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// OPTION B: Logo + large tagline only -- readable at any size
// -------------------------------------------------------------------
const OptionB = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLavaCanvas(canvasRef);
  return (
    <div id="og-b" style={{ position: "relative", width: 1200, height: 630, overflow: "hidden", flexShrink: 0 }}>
      <LavaBackground canvasRef={canvasRef} />
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3, gap: "20px",
      }}>
        <p style={{
          fontSize: "22px", letterSpacing: "0.3em", textTransform: "uppercase",
          fontFamily: font, margin: 0, fontWeight: 400, color: "rgba(255,255,255,0.6)",
        }}>
          Introducing from HASTE
        </p>
        <img
          src={conformLogo}
          alt="Conform Studio"
          style={{ width: "860px", height: "auto", filter: "drop-shadow(0 0 40px rgba(255,255,255,0.2))" }}
        />
        <p style={{
          fontSize: "22px", letterSpacing: "0.3em", textTransform: "uppercase",
          fontFamily: font, margin: 0, fontWeight: 400,
        }}>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Premiere to Resolve</span>{" "}
          <span style={{ color: "rgba(255,255,255,0.95)" }}>in Seconds</span>
        </p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// OPTION C: Logo + bold single-line value prop -- punchy and readable
// -------------------------------------------------------------------
const OptionC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLavaCanvas(canvasRef);
  return (
    <div id="og-c" style={{ position: "relative", width: 1200, height: 630, overflow: "hidden", flexShrink: 0 }}>
      <LavaBackground canvasRef={canvasRef} />
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", zIndex: 3, gap: "24px",
      }}>
        <p style={{
          fontSize: "14px", letterSpacing: "0.3em", textTransform: "uppercase",
          fontFamily: font, margin: 0, color: "rgba(255,255,255,0.6)",
        }}>
          Introducing from HASTE
        </p>
        <img
          src={conformLogo}
          alt="Conform Studio"
          style={{ width: "840px", height: "auto", filter: "drop-shadow(0 0 40px rgba(255,255,255,0.2))" }}
        />
        <p style={{
          fontSize: "26px", letterSpacing: "0.08em", fontFamily: font,
          margin: "8px 0 0 0", color: "rgba(255,255,255,0.95)", fontWeight: 500,
          textAlign: "center",
        }}>
          AI-Powered Conform Automation
        </p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// Page layout: show all three options
// -------------------------------------------------------------------
const OgImagePreview = () => {
  return (
    <div style={{
      width: "100vw", minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 20px", gap: "48px",
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#888", fontFamily: "monospace", fontSize: "16px", margin: "0 0 4px 0" }}>
          OG Image Options (1200 x 630)
        </p>
        <p style={{ color: "#555", fontFamily: "monospace", fontSize: "12px", margin: 0 }}>
          Each renders at the actual pixel dimensions used by social platforms
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#666", fontFamily: "monospace", fontSize: "13px", marginBottom: "12px", letterSpacing: "0.1em" }}>
          OPTION A -- Logo only
        </p>
        <OptionA />
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#666", fontFamily: "monospace", fontSize: "13px", marginBottom: "12px", letterSpacing: "0.1em" }}>
          OPTION B -- Logo + tagline
        </p>
        <OptionB />
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#666", fontFamily: "monospace", fontSize: "13px", marginBottom: "12px", letterSpacing: "0.1em" }}>
          OPTION C -- Logo + bold value prop
        </p>
        <OptionC />
      </div>
    </div>
  );
};

export default OgImagePreview;
