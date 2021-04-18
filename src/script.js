import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "dat.gui";
import gsap from "gsap";

// Texture Loader
const textureLoader = new THREE.TextureLoader();

/**
 * Debug
 */
// const gui = new dat.GUI();

/**
 * Canvas
 */
const canvas = document.querySelector("canvas.webgl");

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */
// https://threejs.org/docs/#api/en/geometries/PlaneGeometry
const geometry = new THREE.PlaneBufferGeometry(1, 1.5);

// load images
for (let i = 0; i < 6; i++) {
  /**
   * Materials
   */
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/images/${i}.jpg`),
  });

  /**
   * Mesh
   */
  const img = new THREE.Mesh(geometry, material);
  // offset the images
  img.position.set(Math.random() + 0.6, -(i * 2.1));

  scene.add(img);
}

let meshObjects = [];

scene.traverse((object) => {
  if (object.isMesh) meshObjects.push(object);
});

/**
 * Lights
 */

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// const cameraFolder = gui.addFolder("Camera");

// cameraFolder.add(camera.position, "x").min(-5).max(10).step(0.1);
// cameraFolder.add(camera.position, "y").min(-10).max(0).step(0.1);
// cameraFolder.add(camera.position, "z").min(0).max(10).step(0.1);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

// position of camera
let y = 0;
let position = 0;

const onMouseWheel = (e) => {
  y = e.deltaY * 0.0004;
};

const mouse = new THREE.Vector2();

// on wheel event listener
window.addEventListener("wheel", onMouseWheel);
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

// init raycaster
const raycaster = new THREE.Raycaster();

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // monitoring the scrolling
  position -= y;
  y *= 0.91; // to gradually reduce scrolling speed to 0

  // raycaster
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(meshObjects);

  for (const intersect of intersects) {
    // intersect.object.scale.set(1.1, 1.1);
    gsap.to(intersect.object.scale, { x: 1.7, y: 1.7 });
    gsap.to(intersect.object.rotation, { y: -0.4 });
    gsap.to(intersect.object.position, { z: -0.9 });
  }

  for (const object of meshObjects) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      // object.scale.set(1, 1);
      gsap.to(object.scale, { x: 1, y: 1 });
      gsap.to(object.rotation, { y: 0 });
      gsap.to(object.position, { z: 0 });
    }
  }

  camera.position.y = position;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
