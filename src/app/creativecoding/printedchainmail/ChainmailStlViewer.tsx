"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type ChainmailStlViewerProps = {
  src: string;
  poster?: string;
};

export default function ChainmailStlViewer({ src, poster }: ChainmailStlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(1, 1, 1);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-1, -0.5, -1);
    scene.add(ambientLight, keyLight, fillLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    let mesh: THREE.Mesh | null = null;

    new STLLoader().load(
      src,
      (geometry) => {
        if (disposed) return;
        geometry.center();
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
          color: 0xb3b3b3,
          metalness: 0.15,
          roughness: 0.55,
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3()).length() || 1;
        const distance = size * 1.4;
        camera.position.set(distance, distance * 0.6, distance);
        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
        controls.minDistance = distance * 0.2;
        controls.maxDistance = distance * 5;
        controls.update();

        setIsLoading(false);
      },
      undefined,
      () => {
        if (!disposed) {
          setHasError(true);
          setIsLoading(false);
        }
      },
    );

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      mesh?.geometry.dispose();
      if (mesh && mesh.material instanceof THREE.Material) mesh.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  return (
    <div className="cmStlViewer">
      {isLoading && poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="cmStlViewerPoster" />
      )}
      <div ref={containerRef} className="cmStlViewerCanvas" />
      {isLoading && !hasError && <p className="cmStlViewerStatus">loading model…</p>}
      {hasError && <p className="cmStlViewerStatus">couldn&apos;t load the 3D model</p>}
      {!isLoading && !hasError && (
        <p className="cmStlViewerHint">psst! move me around!</p>
      )}
    </div>
  );
}
