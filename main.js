import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";
import javascriptLogo from "./javascript.svg";
import { setupCounter } from "./counter.js";
import { randFloatSpread } from "three/src/math/MathUtils";

// stats.js to show FPS Counter.
// var stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

// SETUP
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// TORUS
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xffe400, // Yellow ring
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// LIGHTS
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// HELPERS
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(400).fill().forEach(addStar);

// space (Background)
const spaceTexture = new THREE.TextureLoader().load("./img/space.jpeg");
scene.background = spaceTexture;

// Alec
const alecTexture = new THREE.TextureLoader().load("./img/Alec.jpeg");
const alec = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: alecTexture })
);
scene.add(alec);

// moon
const moonTexture = new THREE.TextureLoader().load("./img/moon.jpeg");
const normalTexture = new THREE.TextureLoader().load("./img/normal.jpeg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);

moon.position.z = 15;
moon.position.setX(10);
moon.position.setY(-3);

alec.position.setZ(-5);
alec.position.setX(2);

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// CREATE AN AUDIOLISTENER & ADD IT TO CAMERA
// a virtual listener of all audio effects in scene
const listener = new THREE.AudioListener();
// camera.add(listener);

// CREATE AUDIOLOADER TO LOAD ALL SOUND FILES
const audioLoader = new THREE.AudioLoader();

// CREATE, LOAD, AND PLAY BACKGROUND MUSIC
// create non-positional global audio object
const backgroundMusic = new THREE.Audio(listener);

// Load sound file
audioLoader.load(
  "./music/Extras Menu - Sonic Mega Collection [OST].mp3",
  function (buffer) {
    backgroundMusic.setBuffer(buffer); // set source to sound object's buffer
    backgroundMusic.setLoop(true); // sound will loop when done
    backgroundMusic.setVolume(0.4); // volume 0 - 1
    backgroundMusic.play(); // start sound right now
  }
);

// Animation Loop
function animate() {
  // stats.begin();
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  alec.rotation.y += 0.001;
  alec.rotation.z += 0.001;

  moon.rotation.y += 0.001;

  // controls.update();

  renderer.render(scene, camera);
  // stats.end();
}

animate();
