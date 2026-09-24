"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GitGraphOrb() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---------- scene setup ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const accent = new THREE.Color(0x1f6feb);
    const accentSoft = new THREE.Color(0x58a6ff);

    // ---------- the sculpture: a commit graph on a sphere ----------
    const graph = new THREE.Group();
    scene.add(graph);

    const radius = 1.55;
    const icoGeo = new THREE.IcosahedronGeometry(radius, 0);
    const edgesGeo = new THREE.EdgesGeometry(icoGeo);
    const edgeLines = new THREE.LineSegments(
      edgesGeo,
      new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.5 })
    );
    graph.add(edgeLines);

    // the 12 vertices of an icosahedron, placed as glowing "commit" nodes
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    const nodeGeo = new THREE.SphereGeometry(0.075, 20, 20);
    rawVerts.forEach((v, i) => {
      const vec = new THREE.Vector3(...v).normalize().multiplyScalar(radius);
      const isHead = i === 0;
      const node = new THREE.Mesh(
        nodeGeo,
        new THREE.MeshStandardMaterial({
          color: isHead ? accentSoft : 0xffffff,
          emissive: accent,
          emissiveIntensity: isHead ? 0.9 : 0.35,
          roughness: 0.35,
          metalness: 0.25,
        })
      );
      node.position.copy(vec);
      graph.add(node);
    });

    // two faint orbiting rings for depth, an atom-like accent, not a logo
    const ringMat1 = new THREE.LineBasicMaterial({
      color: accentSoft,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, radius * 1.55, radius * 1.55).getPoints(96).map(
          (p) => new THREE.Vector3(p.x, p.y, 0)
        )
      ),
      ringMat1
    );
    ring1.rotation.x = Math.PI / 2.4;
    ring1.rotation.y = 0.3;
    scene.add(ring1);

    const ring2 = ring1.clone();
    ring2.material = new THREE.LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.22,
    });
    ring2.rotation.x = -Math.PI / 3.1;
    ring2.rotation.y = -0.6;
    scene.add(ring2);

    // ---------- lighting ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.PointLight(accent, 14, 20);
    key.position.set(3, 2, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 6, 20);
    rim.position.set(-3, -2, -3);
    scene.add(rim);

    // ---------- responsive sizing ----------
    function resize() {
      if (!mount) return;
      const size = mount.clientWidth;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---------- gentle mouse parallax ----------
    let targetX = 0;
    let targetY = 0;
    function onPointerMove(e: PointerEvent) {
      const rect = mount!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.6;
      targetY = y * 0.6;
    }
    window.addEventListener("pointermove", onPointerMove);

    // ---------- animation loop ----------
    let frameId: number;
    const clock = new THREE.Clock();

    function renderStaticFrame() {
      graph.rotation.set(0.3, -0.5, 0);
      renderer.render(scene, camera);
    }

    function animate() {
      const t = clock.getElapsedTime();
      graph.rotation.y = t * 0.22 + targetX;
      graph.rotation.x = Math.sin(t * 0.35) * 0.15 + targetY;
      ring1.rotation.z = t * 0.15;
      ring2.rotation.z = -t * 0.1;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    if (prefersReducedMotion) {
      renderStaticFrame();
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      mount.removeChild(renderer.domElement);
      [icoGeo, edgesGeo, nodeGeo, ring1.geometry, ring2.geometry].forEach((g) => g.dispose());
      graph.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          const mat = obj.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full aspect-square max-w-[420px] mx-auto [&>canvas]:w-full [&>canvas]:h-full"
      aria-hidden="true"
    />
  );
}
