import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";

RectAreaLightUniformsLib.init();

function createRoundedRectShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  const segsPerSide = 32;

  shape.moveTo(x + r, y);
  for (let i = 1; i <= segsPerSide; i++) {
    shape.lineTo(x + r + (w - 2 * r) * (i / segsPerSide), y);
  }
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  for (let i = 1; i <= segsPerSide; i++) {
    shape.lineTo(x + w, y + r + (h - 2 * r) * (i / segsPerSide));
  }
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  for (let i = 1; i <= segsPerSide; i++) {
    shape.lineTo(x + w - r - (w - 2 * r) * (i / segsPerSide), y + h);
  }
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  for (let i = 1; i <= segsPerSide; i++) {
    shape.lineTo(x, y + h - r - (h - 2 * r) * (i / segsPerSide));
  }
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

const UIShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // -- Visibility observer: pause rendering when off-screen --
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // -- Scene --
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // -- Camera --
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.8);
    camera.layers.enable(1);

    // -- Renderer --
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.75 : 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * scale);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // -- Post-processing --
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1), 0.3, 0.6, 0.7
    );
    composer.addPass(bloomPass);

    const fxaaPass = new ShaderPass(FXAAShader);
    composer.addPass(fxaaPass);

    // -- Video texture --
    const video = document.createElement("video");
    video.src = "/ui-showcase.mp4";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.style.position = "fixed";
    video.style.top = "-9999px";
    video.style.left = "-9999px";
    video.style.width = "1px";
    video.style.height = "1px";
    document.body.appendChild(video);

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;
    videoTexture.generateMipmaps = false;

    // -- Screen geometry --
    const screenAspect = 1544 / 1080;
    const screenHeight = 2.2;
    const screenWidth = screenHeight * screenAspect;
    const bezelWidth = 0.04;
    const bezelDepth = 0.06;
    const cornerRadius = 0.06;

    // Bezel
    const bezelShape = createRoundedRectShape(
      screenWidth + bezelWidth * 2,
      screenHeight + bezelWidth * 2,
      cornerRadius + bezelWidth
    );
    const bezelGeo = new THREE.ExtrudeGeometry(bezelShape, {
      depth: bezelDepth, bevelEnabled: false, curveSegments: 128, steps: 1,
    });
    bezelGeo.center();
    bezelGeo.computeVertexNormals();

    const bezelMat = new THREE.MeshPhysicalMaterial({
      color: 0x080808,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      envMapIntensity: 0.8,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.layers.enable(1);
    scene.add(bezelMesh);

    // Screen plane with blue-screen keyer
    const screenGeo = new THREE.PlaneGeometry(
      screenWidth + bezelWidth * 2, screenHeight + bezelWidth * 2, 1, 1
    );
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveIntensity: 1.0,
      roughness: 0.25,
      metalness: 0.0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.6,
      transparent: true,
      side: THREE.FrontSide,
      toneMapped: false,
    });

    screenMat.onBeforeCompile = (shader) => {
      shader.uniforms.uGamma = { value: 1.1 };
      shader.uniforms.uContrast = { value: 1.15 };
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_pars_fragment>",
        `
        #include <emissivemap_pars_fragment>
        uniform float uGamma;
        uniform float uContrast;
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `
        #ifdef USE_EMISSIVEMAP
          vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
          emissiveColor.rgb = pow(emissiveColor.rgb, vec3(uGamma));
          emissiveColor.rgb = clamp((emissiveColor.rgb - 0.5) * uContrast + 0.5, 0.0, 1.0);
          vec2 uv = vEmissiveMapUv;
          vec2 cornerDist = min(uv, 1.0 - uv);
          float cornerMask = 1.0 - smoothstep(0.0, 0.08, min(cornerDist.x, cornerDist.y));
          float blueDominance = emissiveColor.b - max(emissiveColor.r, emissiveColor.g);
          float keyMask = smoothstep(0.04, 0.12, blueDominance) * cornerMask;
          totalEmissiveRadiance *= emissiveColor.rgb * (1.0 - keyMask);
          diffuseColor.a *= (1.0 - keyMask);
        #endif
        `
      );
    };
    screenMat.emissiveMap = videoTexture;

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.032;
    scene.add(screenMesh);

    // -- Background glow --
    const bgGlowGeo = new THREE.PlaneGeometry(20, 20);
    const bgGlowMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(0x1a3a6a) },
        uIntensity: { value: 0.75 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform float uIntensity;
        void main() {
          vec2 c = vUv - 0.5;
          float d = length(c);
          float alpha = smoothstep(0.5, 0.0, d) * uIntensity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });
    const bgGlow = new THREE.Mesh(bgGlowGeo, bgGlowMat);
    bgGlow.position.z = -3;
    scene.add(bgGlow);

    // -- Mouse tracking --
    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // -- Resize --
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      fxaaPass.material.uniforms["resolution"].value.set(
        1 / (w * renderer.getPixelRatio()),
        1 / (h * renderer.getPixelRatio())
      );
    };
    resize();
    window.addEventListener("resize", resize);

    // -- Animation --
    const clock = new THREE.Clock();
    let animId: number;
    const orbitSpeed = 0.15;
    const orbitRange = 0.15;
    const parallaxX = 0.3;
    const parallaxY = 0.15;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      const t = clock.getElapsedTime();

      smoothMouse.x += (mouse.x - smoothMouse.x) * 0.03;
      smoothMouse.y += (mouse.y - smoothMouse.y) * 0.03;

      const autoOrbitX = Math.sin(t * orbitSpeed) * orbitRange;
      const autoOrbitY = Math.cos(t * (orbitSpeed * 0.8)) * (orbitRange * 0.5);

      const targetX = autoOrbitX + smoothMouse.x * parallaxX;
      const targetY = autoOrbitY + smoothMouse.y * parallaxY;

      const radius = 3.8;
      camera.position.x = Math.sin(targetX) * radius;
      camera.position.y = targetY * 0.8;
      camera.position.z = Math.cos(targetX) * radius;
      camera.lookAt(0, 0, 0);

      const breathe = Math.sin(t * 0.5) * 0.003;
      bezelMesh.position.y = breathe;
      screenMesh.position.y = breathe;

      composer.render();
    };

    // Start video and animation
    let startOnClick: (() => void) | null = null;
    video.play().catch(() => {
      startOnClick = () => {
        video.play();
        document.removeEventListener("click", startOnClick!);
        startOnClick = null;
      };
      document.addEventListener("click", startOnClick);
    });
    animate();

    return () => {
      if (startOnClick) {
        document.removeEventListener("click", startOnClick);
      }
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      video.pause();
      video.remove();
      renderer.dispose();
      composer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: "90vh", minHeight: "500px", maxHeight: "1100px" }}>
      <div
        ref={containerRef}
        className="absolute inset-0"
      />
      {/* Top fade to blend with section above */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, hsl(0 0% 0%) 0%, transparent 100%)" }}
      />
      {/* Bottom fade to blend with section below */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, hsl(0 0% 0%) 0%, transparent 100%)" }}
      />
    </div>
  );
};

export default UIShowcase;
