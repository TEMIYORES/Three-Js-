import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true;
// setting the rendered screen to be the window width and height
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Create a screen and camera else nothing will show
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);

// Create orbit that makes the camera move
const orbit = new OrbitControls(camera, renderer.domElement);
// Show the lines on the screen the x, y, and z planes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-10, 30, 30);

// updating camera position
orbit.update();

// const ambientLight = new THREE.AmbientLight(0xeeeeee);
// scene.add(ambientLight);
renderer.setClearColor(0xaaaaaa);
// Create a plane
const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
// Creating a plane material to add to the plane
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
// Join the plane and the material
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
// Adding a gridhelper
const gridHelper = new THREE.GridHelper(100, 10);
scene.add(gridHelper);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 4;

// importing model
let car;
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
// Adding light
rgbeLoader.load("./assets/MR_INT-005_WhiteNeons_NAD.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  gltfLoader.load("./assets/scene.gltf", function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    car = model;
    car.position.set(0, 0, 0);
    car.scale.set(0.1, 0.1, 0.1);
  });
});

function animate(time) {
  if (car) {
    car.rotation.y = time / 3000;
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
