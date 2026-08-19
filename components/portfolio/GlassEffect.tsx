"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import styles from "./Hero.module.css";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uPointerActive;
  uniform float uTime;
  uniform float uIntro;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.80, -0.60, 0.60, 0.80);
    for (int octave = 0; octave < 5; octave++) {
      value += amplitude * noise(p);
      p = rotation * p * 2.03 + 7.31;
      amplitude *= 0.5;
    }
    return value;
  }

  vec2 coverUv(vec2 uv) {
    float screenAspect = uResolution.x / uResolution.y;
    float imageAspect = uImageResolution.x / uImageResolution.y;
    vec2 scale = vec2(1.0);
    if (screenAspect > imageAspect) {
      scale.y = imageAspect / screenAspect;
    } else {
      scale.x = screenAspect / imageAspect;
    }
    float desktop = smoothstep(820.0, 1100.0, uResolution.x);
    float zoom = mix(0.965, 0.86, desktop);
    vec2 covered = (uv - 0.5) * scale * zoom + 0.5;
    covered.x -= 0.09 * desktop;
    return covered;
  }

  float ellipseField(vec2 uv, vec2 center, vec2 radius) {
    return length((uv - center) / radius);
  }

  void main() {
    vec2 uv = vUv;
    vec2 imageUv = coverUv(uv);
    float time = uTime * 0.062;

    // Three overlapping curved volumes form one irregular glass surface.
    float lensA = ellipseField(uv, vec2(0.84, 0.53), vec2(0.31, 0.47));
    float lensB = ellipseField(uv, vec2(0.69, 0.27), vec2(0.23, 0.28));
    float lensC = ellipseField(uv, vec2(1.00, 0.28), vec2(0.19, 0.32));
    float lensDistance = min(lensA, min(lensB, lensC));
    float glassMask = 1.0 - smoothstep(0.82, 1.06, lensDistance);
    float glassEdge = smoothstep(0.84, 0.96, lensDistance) - smoothstep(0.96, 1.07, lensDistance);

    // Differentiated FBM creates slowly moving, non-uniform liquid refraction.
    vec2 flowUv = uv * vec2(3.2, 2.65);
    flowUv += vec2(time * 0.22, -time * 0.15);
    float baseNoise = fbm(flowUv + fbm(flowUv * 0.72 + time));
    float noiseX = fbm(flowUv + vec2(0.035, 0.0) + baseNoise * 0.36);
    float noiseY = fbm(flowUv + vec2(0.0, 0.035) - baseNoise * 0.31);
    vec2 flowGradient = vec2(noiseX - baseNoise, noiseY - baseNoise) / 0.035;

    // The main glass body bends perspective like a shallow crystal lens.
    vec2 lensCenter = vec2(0.83, 0.50);
    vec2 lensVector = (uv - lensCenter) * vec2(1.0, 0.84);
    float lensCurve = pow(max(0.0, 1.0 - min(lensDistance, 1.0)), 1.55);
    vec2 lensRefraction = -lensVector * lensCurve * 0.027;
    vec2 liquidRefraction = flowGradient * 0.0048 * glassMask;

    // Cursor agitation is velocity-sensitive, noise-broken and intentionally non-circular.
    vec2 mouseDelta = uv - uMouse;
    mouseDelta.x *= uResolution.x / uResolution.y;
    float cursorArea = exp(-dot(mouseDelta, mouseDelta) * 16.0) * uPointerActive;
    float cursorNoise = fbm(uv * 7.0 - vec2(time * 0.78, time * 0.56));
    vec2 cursorDirection = normalize(mouseDelta + vec2(0.0001));
    vec2 tangent = vec2(-cursorDirection.y, cursorDirection.x);
    float speed = clamp(length(uVelocity) * 2.8, 0.0, 1.0);
    vec2 cursorRefraction = (
      cursorDirection * (cursorNoise - 0.36) * 0.018 +
      tangent * (cursorNoise - 0.5) * 0.011 +
      uVelocity * 0.009
    ) * cursorArea * (0.28 + speed * 0.72);

    vec2 totalRefraction = (lensRefraction + liquidRefraction + cursorRefraction) * uIntro;
    vec2 refractedUv = clamp(imageUv + totalRefraction, 0.002, 0.998);

    // Sub-pixel channel separation stays confined to active glass edges and motion.
    vec2 aberrationDirection = normalize(totalRefraction + vec2(0.0001));
    float aberrationAmount = (glassEdge * 0.00075 + length(totalRefraction) * 0.012) * uIntro;
    vec2 chroma = aberrationDirection * aberrationAmount;
    float red = texture2D(uTexture, clamp(refractedUv + chroma, 0.002, 0.998)).r;
    float green = texture2D(uTexture, refractedUv).g;
    float blue = texture2D(uTexture, clamp(refractedUv - chroma, 0.002, 0.998)).b;
    vec3 color = vec3(red, green, blue);

    // Slow diagonal reflection and soft edge energy sell the transparent surface.
    float sweepPosition = 0.48 + sin(time * 0.26) * 0.20;
    float sweepCoordinate = dot(uv, normalize(vec2(0.82, 0.57)));
    float reflection = 1.0 - smoothstep(0.025, 0.13, abs(sweepCoordinate - sweepPosition));
    reflection *= glassMask * (0.15 + baseNoise * 0.27);
    float fluidRidge = smoothstep(0.12, 0.72, length(flowGradient)) * glassMask;
    vec3 iceLight = vec3(0.69, 0.88, 1.0);
    color += iceLight * reflection * 0.09 * uIntro;
    color += iceLight * glassEdge * (0.13 + baseNoise * 0.08) * uIntro;
    color += iceLight * fluidRidge * 0.012 * uIntro;

    // A very subtle glass density shift, without washing out the portrait.
    color = mix(color, color * vec3(0.975, 1.006, 1.022) + 0.011, glassMask * 0.16 * uIntro);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function LiquidGlassPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useLoader(THREE.TextureLoader, "/media/lukina-hero-clean.png");
  const { size } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(.78, .5));
  const mouseCurrent = useRef(new THREE.Vector2(.78, .5));
  const velocityTarget = useRef(new THREE.Vector2());
  const velocityCurrent = useRef(new THREE.Vector2());
  const pointerActive = useRef(0);
  const intro = useRef(0);
  const lastPointer = useRef({ x: .78, y: .5, time: performance.now() });

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uImageResolution: { value: new THREE.Vector2(1672, 941) },
    uMouse: { value: new THREE.Vector2(.78, .5) },
    uVelocity: { value: new THREE.Vector2() },
    uPointerActive: { value: 0 },
    uTime: { value: 0 },
    uIntro: { value: 0 },
  }), [size.height, size.width, texture]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const yFromTop = event.clientY / window.innerHeight;
      const y = 1 - yFromTop;
      const inEllipse = (centerX: number, centerY: number, radiusX: number, radiusY: number) =>
        ((x - centerX) / radiusX) ** 2 + ((yFromTop - centerY) / radiusY) ** 2 <= 1;
      const overPortrait =
        inEllipse(.60, .28, .35, .34) ||
        inEllipse(.88, .35, .26, .39) ||
        inEllipse(.77, .73, .36, .42);
      const overNavigation = event.target instanceof Element && Boolean(event.target.closest("nav"));
      pointerActive.current = overPortrait && !overNavigation ? 1 : 0;

      const now = performance.now();
      const elapsed = Math.max(8, now - lastPointer.current.time);
      velocityTarget.current.set(
        ((x - lastPointer.current.x) / elapsed) * 16,
        ((y - lastPointer.current.y) / elapsed) * 16,
      );
      mouseTarget.current.set(x, y);
      lastPointer.current = { x, y, time: now };
    };

    const onPointerLeave = () => {
      pointerActive.current = 0;
      velocityTarget.current.set(0, 0);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    mouseCurrent.current.lerp(mouseTarget.current, 1 - Math.exp(-delta * 5.5));
    velocityCurrent.current.lerp(velocityTarget.current, 1 - Math.exp(-delta * 4.2));
    velocityTarget.current.multiplyScalar(Math.exp(-delta * 5.8));
    intro.current = THREE.MathUtils.damp(intro.current, 1, 1.25, delta);

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uMouse.value.copy(mouseCurrent.current);
    material.uniforms.uVelocity.value.copy(velocityCurrent.current);
    material.uniforms.uPointerActive.value = THREE.MathUtils.damp(
      material.uniforms.uPointerActive.value,
      pointerActive.current,
      5,
      delta,
    );
    material.uniforms.uIntro.value = intro.current;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export function GlassEffect() {
  return (
    <>
      <div className={styles.fallback} aria-hidden="true" />
      <div className={styles.canvasWrap} aria-hidden="true">
        <Canvas
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1 }}
          dpr={[1, 1.7]}
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <LiquidGlassPlane />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}
