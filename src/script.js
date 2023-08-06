import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;
let objectDistance = 4;
let objects = [];

function loadModel(url) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, resolve, null, reject);
  });
}

async function loadModels() {
  try {
    const burgerGltf = await loadModel("/models/burger.glb");
    burgerGltf.scene.scale.set(0.2, 0.2, 0.2);
    objects.push(burgerGltf.scene);
    scene.add(burgerGltf.scene);

    const doubleCheeseGltf = await loadModel("/models/doublecheese.glb");
    doubleCheeseGltf.scene.scale.set(0.2, 0.2, 0.2);
    objects.push(doubleCheeseGltf.scene);
    scene.add(doubleCheeseGltf.scene);

    const tripleCheeseGltf = await loadModel("/models/triplecheese.glb");
    tripleCheeseGltf.scene.scale.set(0.2, 0.2, 0.2);
    objects.push(tripleCheeseGltf.scene);
    scene.add(tripleCheeseGltf.scene);

    const gbaCheeseGltf = await loadModel("/models/gbacheese.glb");
    gbaCheeseGltf.scene.scale.set(0.2, 0.2, 0.2);
    objects.push(gbaCheeseGltf.scene);
    scene.add(gbaCheeseGltf.scene);

    objects[0].position.y = -objectDistance * 0;
    objects[1].position.y = -objectDistance * 1;
    objects[2].position.y = -objectDistance * 2;
    objects[3].position.y = -objectDistance * 3;
  } catch (error) {
    console.error("Error loading models:", error);
  }
}

loadModels();

/**
 * Floor
 */

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 6);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 1, 0);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
let scrollY = 0;
window.addEventListener('scroll', ()=> {
    scrollY = window.scrollY 
})

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //animate Camera

  camera.position.y = - scrollY / sizes.height * objectDistance

  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  //   controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
