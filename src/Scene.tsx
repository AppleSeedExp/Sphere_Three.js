import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Scene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const spheres: THREE.Mesh[] = [];
    const sphereGeometry = new THREE.SphereGeometry(10, 32, 32);
    for (let i = 0; i < 6; i++) {
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff0000 : 0x00ff00
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(0, 0, i * 50);
      spheres.push(sphere);
      scene.add(sphere);
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
      spheres.map((sphere) => sphere.position)
    );
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    camera.position.set(0, 0, 1000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    setSceneReady(true);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      controls.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Scene;
