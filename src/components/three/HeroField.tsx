"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { W_MARK_PATH, W_DOT } from "@/components/ui/Logo";

/* ------------------------------------------------------------------
 * "The loom": thousands of particles that assemble into the Webloom
 * W-mark, scatter away from the cursor, and unravel into a woven,
 * breathing landscape as the hero scrolls away.
 * ------------------------------------------------------------------ */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform vec3 uMarkOffset;
  uniform float uMarkScale;

  attribute vec3 aMark;
  attribute vec3 aWave;
  attribute vec3 aScatter;
  attribute vec4 aRand;

  varying float vAccent;
  varying float vAlpha;
  varying float vForce;
  varying float vCrest;

  void main() {
    float r = aRand.x;

    // intro: scattered cloud -> W mark (staggered per particle)
    float t = clamp(uIntro * 1.7 - r * 0.7, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 mark = aMark * uMarkScale + uMarkOffset;
    mark.z += sin(uTime * 0.9 + r * 40.0) * 0.06;
    mark.xy += vec2(sin(uTime * 0.7 + r * 31.0), cos(uTime * 0.6 + r * 17.0)) * 0.018;
    vec3 p = mix(aScatter, mark, t);

    // woven landscape
    vec3 w = aWave;
    float wave = sin(w.x * 0.55 + uTime * 0.6) * 0.42
               + cos(w.z * 0.65 - uTime * 0.45) * 0.34
               + sin((w.x + w.z) * 1.4 + uTime * 0.9) * 0.08;
    w.y += wave;
    float m = clamp(uMorph * 1.5 - r * 0.5, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    p = mix(p, w, m);
    vCrest = smoothstep(0.15, 0.65, wave) * m;

    // cursor repulsion
    vec2 d = p.xy - uMouse.xy;
    float dist = length(d);
    float force = smoothstep(0.85, 0.0, dist) * uMouseStrength * (1.0 - m * 0.4);
    p.xy += normalize(d + 0.0001) * force * 0.45;
    p.z += force * 1.1;
    vForce = force;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * mix(0.55 + aRand.z * 0.9, 1.9, m) * (1.0 + aRand.y * 0.9 * (1.0 - m));
    gl_PointSize = size * uPixelRatio * (9.0 / -mv.z);

    vAccent = aRand.y;
    vAlpha = mix(0.35 + aRand.w * 0.65, 1.0, m) * smoothstep(-26.0, -3.0, mv.z);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAccent;
  varying float vAlpha;
  varying float vForce;
  varying float vCrest;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.05, d);
    vec3 col = mix(uColor, uAccent, clamp(vAccent * (1.0 - vCrest) + vForce * 1.4 + vCrest, 0.0, 1.0));
    col *= 1.0 + vCrest * 0.6;
    gl_FragColor = vec4(col, a * vAlpha);
  }
`;

function buildGeometry(count: number) {
  const mark = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);

  // Sample points inside the W path (viewBox 556 x 186)
  const ctx = document.createElement("canvas").getContext("2d")!;
  const path = new Path2D(W_MARK_PATH);
  const W = 556,
    H = 186,
    S = 1 / W; // normalised to width 1
  const accentCount = Math.floor(count * 0.035);
  let i = 0;
  let guard = 0;
  while (i < count - accentCount && guard < count * 30) {
    guard++;
    const x = Math.random() * W;
    const y = Math.random() * H;
    if (!ctx.isPointInPath(path, x, y)) continue;
    mark[i * 3] = (x - W / 2) * S;
    mark[i * 3 + 1] = -(y - H / 2) * S;
    mark[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    rand[i * 4 + 1] = 0;
    i++;
  }
  // The coral dot (slightly enlarged for presence)
  for (; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(Math.random()) * W_DOT.r * 1.35;
    const x = W_DOT.cx + Math.cos(a) * rr;
    const y = W_DOT.cy + Math.sin(a) * rr;
    mark[i * 3] = (x - W / 2) * S;
    mark[i * 3 + 1] = -(y - H / 2) * S;
    mark[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    rand[i * 4 + 1] = 1;
  }

  // Woven landscape: a jittered grid receding into the distance
  // rows of "threads": dense along x, spaced along z
  const cols = Math.ceil(Math.sqrt(count * 3.4));
  const rows = Math.ceil(count / cols);
  for (let k = 0; k < count; k++) {
    const cx = k % cols;
    const cz = Math.floor(k / cols);
    const x = (cx / cols - 0.5) * 20;
    const z = -(cz / rows) * 15 + 3;
    wave[k * 3] = x;
    wave[k * 3 + 1] = -2.2;
    wave[k * 3 + 2] = z;
  }

  // Scatter cloud
  for (let k = 0; k < count; k++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    const rr = 6 + Math.random() * 10;
    scatter[k * 3] = Math.sin(v) * Math.cos(u) * rr;
    scatter[k * 3 + 1] = Math.sin(v) * Math.sin(u) * rr * 0.6;
    scatter[k * 3 + 2] = Math.cos(v) * rr - 4;
    rand[k * 4] = Math.random();
    rand[k * 4 + 2] = Math.random();
    rand[k * 4 + 3] = Math.random();
  }

  // shuffle so accent dots get mixed stagger timing
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(mark.slice(), 3));
  g.setAttribute("aMark", new THREE.BufferAttribute(mark, 3));
  g.setAttribute("aWave", new THREE.BufferAttribute(wave, 3));
  g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
  return g;
}

type Shared = {
  morph: React.RefObject<number>;
  intro: React.RefObject<boolean>;
  paused: React.RefObject<boolean>;
};

function Particles({ morph, intro, paused, count }: Shared & { count: number }) {
  const { camera, size, gl } = useThree();
  const geometry = useMemo(() => buildGeometry(count), [count]);
  const mouseNdc = useRef(new THREE.Vector2(10, 10));
  const mouseWorld = useRef(new THREE.Vector3(100, 100, 0));
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uIntro: { value: 0 },
          uMorph: { value: 0 },
          uSize: { value: 2.2 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uMouse: { value: new THREE.Vector3(100, 100, 0) },
          uMouseStrength: { value: 0 },
          uMarkOffset: { value: new THREE.Vector3(2.3, 0.2, 0) },
          uMarkScale: { value: 5 },
          uColor: { value: new THREE.Color("#C7CED1") },
          uAccent: { value: new THREE.Color("#FF6B47") },
        },
      }),
    []
  );

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouseNdc.current.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const onLeave = () => mouseNdc.current.set(10, 10);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const dt = Math.min(delta, 0.05);
    if (!paused.current) u.uTime.value += dt;
    // intro assemble
    const target = intro.current ? 1 : 0;
    u.uIntro.value += (target - u.uIntro.value) * Math.min(1, dt * (intro.current ? 0.9 : 4));
    // scroll morph
    u.uMorph.value += ((morph.current ?? 0) - u.uMorph.value) * Math.min(1, dt * 5);

    // layout: mark on the right on wide screens, centred above text on narrow ones
    const mobile = size.width < 820;
    const aspect = size.width / size.height;
    const markScale = mobile ? Math.min(3.2, aspect * 4.2) : Math.min(4.6, aspect * 2.3);
    u.uMarkScale.value = markScale;
    (u.uMarkOffset.value as THREE.Vector3).set(mobile ? 0 : Math.min(3.1, aspect * 1.45), mobile ? 1.5 : 0.1, 0);

    // mouse -> world (plane z = 0)
    const n = mouseNdc.current;
    let strength = 0;
    if (Math.abs(n.x) <= 1 && Math.abs(n.y) <= 1) {
      tmp.set(n.x, n.y, 0.5).unproject(camera).sub(camera.position).normalize();
      const dist = -camera.position.z / tmp.z;
      const wpos = camera.position.clone().add(tmp.multiplyScalar(dist));
      mouseWorld.current.lerp(wpos, Math.min(1, dt * 8));
      strength = 1;
    }
    (u.uMouse.value as THREE.Vector3).copy(mouseWorld.current);
    u.uMouseStrength.value += (strength - u.uMouseStrength.value) * Math.min(1, dt * 4);

    // camera drifts with pointer & dips toward the landscape as we scroll
    const m = u.uMorph.value;
    const px = Math.abs(n.x) <= 1 ? n.x : 0;
    const py = Math.abs(n.y) <= 1 ? n.y : 0;
    camera.position.x += (px * 0.35 - camera.position.x) * dt * 2;
    camera.position.y += (py * 0.2 + m * 1.6 - camera.position.y) * dt * 2;
    lookTarget.set(0, -m * 1.4, 0);
    camera.lookAt(lookTarget);
    state.invalidate();
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export default function HeroField(props: Shared) {
  const count = typeof window !== "undefined" && window.innerWidth < 820 ? 7000 : 15000;
  return (
    <Canvas
      className="hero__canvas"
      camera={{ position: [0, 0, 8], fov: 38, near: 0.1, far: 60 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Particles {...props} count={count} />
    </Canvas>
  );
}
