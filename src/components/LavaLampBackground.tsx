import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// 1:1 copy of https://github.com/brybrant/lava-lamp/blob/main/src/glsl/fragment.glsl
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

  float sphereMiddle = length(
    raypos - vec3(
      0.0,
      sin(time + 2.0) * 3.0,
      sin(time)
    )
  ) - 1.5;

  float sphereRight = length(
    raypos - vec3(
      -1.0,
      sin(time) * 2.0,
      4.0 + cos(time)
    )
  ) - 1.5;

  float sphereLeft = length(
    raypos - vec3(
      -1.0,
      sin(time + 4.0) * 2.0,
      -4.0 - cos(time)
    )
  ) - 1.5;

  float sphereBackRight = length(
    raypos - vec3(
      3.0,
      sin(time * 0.75 + 6.0) * 2.0,
      2.5 - cos(time * 0.75)
    )
  ) - 2.0;

  float sphereBackLeft = length(
    raypos - vec3(
      3.0,
      sin(time * 0.75 + 9.0) * 2.0,
      -2.5 + cos(time * 0.75 + 3.0)
    )
  ) - 2.0;

  float dist = opSmoothUnion(botPlane, topPlane, 1.0);
  dist = opSmoothUnion(dist, sphereMiddle, 1.0);
  dist = opSmoothUnion(dist, sphereRight, 1.0);
  dist = opSmoothUnion(dist, sphereLeft, 1.0);
  dist = opSmoothUnion(dist, sphereBackRight, 1.0);
  dist = opSmoothUnion(dist, sphereBackLeft, 1.0);

  return dist;
}

vec3 getNormal(vec3 p) {
  return normalize(sphere.xyz - p);
}

float getLight(vec3 p) {
  vec3 lightdir = normalize(lightpos - p);
  vec3 normal = getNormal(p);
  float diff = dot(normal, lightdir);
  return diff;
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

  gl_FragColor = vec4(
    mix(
      backgroundColor,
      lavaColor,
      col
    ),
    1.0
  );
}
`;

interface LavaLampBackgroundProps {
  className?: string;
  /** CSS selector for an element that determines visibility.
   *  When this element scrolls out of the viewport the animation loop pauses. */
  visibilityRef?: React.RefObject<HTMLElement>;
}

const LavaLampBackground = ({
  className = "",
  visibilityRef,
}: LavaLampBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);

  // Fade and pause the canvas based on visibility of the tracked element.
  // Uses intersection ratio for a smooth opacity transition instead of relying
  // on semi-transparent overlays (which cause compositor bleed on fast scroll).
  useEffect(() => {
    const el = visibilityRef?.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        // Fade canvas opacity proportional to how much of the hero is visible.
        // Max 0.5 to match the original design intensity.
        canvas.style.opacity = String(entry.intersectionRatio * 0.5);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibilityRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    let animId: number;

    // On mobile, render at half resolution for performance
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.5 : 1;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
      }
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
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uCamera = gl.getUniformLocation(prog, "uCameraPosition");

    gl.uniform3f(uCamera, -6.0, 0.0, 0.0);

    const resize = () => {
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const startTime = Math.random() * 100;

    const render = (time: number) => {
      if (isVisibleRef.current) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, startTime + time * 1e-3);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: 0.5, transition: "opacity 0.3s ease-out" }}
    />
  );
};

export default LavaLampBackground;
