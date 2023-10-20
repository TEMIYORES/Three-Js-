import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGL1Renderer();
renderer.shadowMap.enabled = true;
// setting the rendered screen to be the window width and height
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Create a screen and camera else nothing will show
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Create orbit that makes the camera move
const orbit = new OrbitControls(camera, renderer.domElement);
// Show the lines on the screen the x, y, and z planes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
camera.position.set(-10, 30, 30);

// updating camera position
orbit.update();

// Create a box
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// Create a plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
// Creating a plane material to add to the plane
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
// Join the plane and the material
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
const sphereGeometry = new THREE.SphereGeometry(4, 100);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;
const sphereId = sphere.id;

// Ambient light creation
const ambientLight = new THREE.AmbientLight(0x333);
scene.add(ambientLight);
// Create a direction from which the light is shown
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// // Create directional light helper which shows where the light direction is
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   5
// );
// scene.add(directionalLightHelper);
// //  Creating directional light camera shadow helper that is responsible for rendering the shadow
// const directionalLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightShadowHelper);

//create spot light
const spotLight = new THREE.SpotLight(0xffffff, 100000);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.position.set(-100, 100, 0);
spotLight.angle = 0.05;
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
// const spotLightShadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightShadowHelper);
// Gui helps changing to material options easier and faster
const gui = new dat.GUI();
const options = {
  sphereColor: "#ffff00",
  wireframe: false,
  speed: 0.01,
  angle: 0.1,
  penumbra: 0.1,
  intensity: 100,
};
gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});

gui.add(options, "speed", 0, 0.1);
gui.add(options, "angle", 0, 1);
gui.add(options, "penumbra", 0, 1);
gui.add(options, "intensity", 0, 100000);
// Adding a gridhelper
const gridHelper = new THREE.GridHelper(30, 10);
scene.add(gridHelper);

// Add fog
// scene.fog = new THREE.Fog(0xffffff, 0, 200);
// scene.fog = new THREE.FogExp2(0xffffff, 0.01)

// renderer.setClearColor(0xff00ff)

// Create Texture loader for image
const texture = new THREE.TextureLoader();
// scene.background = texture.load(stars);
// scene.backgroundIntensity = 1;
const cubeTexture = new THREE.CubeTextureLoader();
scene.background = cubeTexture.load([
  nebula,
  nebula,
  stars,
  stars,
  stars,
  stars,
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
// const box2Material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   //   map: texture.load(stars),
// });
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: texture.load(stars) }),
  new THREE.MeshBasicMaterial({ map: texture.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: texture.load(stars) }),
  new THREE.MeshBasicMaterial({ map: texture.load(stars) }),
  new THREE.MeshBasicMaterial({ map: texture.load(stars) }),
  new THREE.MeshBasicMaterial({ map: texture.load(stars) }),
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(10, 10, 10);
// box2.material.map = texture.load(nebula);
box2.name = "theBox";
// How to select a particular object
const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// plane2
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  side: THREE.DoubleSide,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(-5, 10, 15);

// Loading a blender model
let t_shirt;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "./assets/t-shirt.glb",
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    t_shirt = model;
    t_shirt.position.set(-12, 20, 10);
    t_shirt.scale.set(0.1, 0.1, 0.1);
  },
  undefined,
  function (err) {
    console.error(err);
  }
);

// the Vertex contains the x,y,z values - the geometry holds all the values of all vetices in array
const lastpointz = plane2.geometry.attributes.position.array.length - 1;

const vShader = `
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;
const fShader = `
void main(){
  gl_FragColor = vec4(0.5,0.5,1.0,1.0);
}
`;
// Vertex and Fragment Shaders
const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);
// Create rayCaster - responsible for registering the objects from the camera to the cursor point
const rayCaster = new THREE.Raycaster();
let step = 0;
// let speed = 0.01;
// animation function for rotating box
function animate() {
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  spotLightHelper.update();
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  // console.log(intersects);
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereId) {
      intersects[i].object.material.color.set(0xff0000);
    }

    if (intersects[i].object.name === "theBox") {
      console.log("hello word");
      intersects[i].object.rotation.x += 0.1;
      intersects[i].object.rotation.y += 0.1;
    }
  }
  plane2.geometry.attributes.position.array[0] = 10 * Math.random();
  plane2.geometry.attributes.position.array[1] = 10 * Math.random();
  plane2.geometry.attributes.position.array[2] = 10 * Math.random();
  plane2.geometry.attributes.position.array[lastpointz] = 10 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
