// main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Debug logging function
function debugLog(msg) {
    const debugBox = document.getElementById('debug-box');
    if (debugBox) {
        const div = document.createElement('div');
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        debugBox.appendChild(div);
        debugBox.scrollTop = debugBox.scrollHeight;
    }
    console.log(msg);
}

debugLog("Starting AR application...");

// Wait for MindAR to be available
if (!window.MINDAR) {
    debugLog("ERROR: MindAR not loaded!");
    throw new Error("MindAR library not found");
}

// Initialize MindAR
const mindARThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: 'targets/targets.mind',
});

const { renderer, scene, camera } = mindARThree;
debugLog("MindAR initialized");

// Add anchor for target 0
const anchor = mindARThree.addAnchor(0);
debugLog("Anchor 0 added");

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 2);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambient);
debugLog("Lights added");

// Optional: Axes helper for debugging
const axesHelper = new THREE.AxesHelper(0.5);
scene.add(axesHelper);

// GLTF Loader
const loader = new GLTFLoader();
const objects = {};
const AnimationMixers = [];

// Optional: OrbitControls for debugging (disable for production AR)
// Uncomment these lines if you want manual camera control for testing
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.update();

// Load Minecraft model
debugLog("Loading minecraft.glb...");
loader.load(
    'resources/minecraft.glb', 
    (gltf) => {
        debugLog("Minecraft model loaded successfully");
        objects.minecraft = gltf.scene;
        objects.minecraft.scale.set(0.02, 0.02, 0.02);
        objects.minecraft.position.set(0, -0.5, 0);
        objects.minecraft.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
        anchor.group.add(objects.minecraft);
        debugLog("Minecraft model added to anchor");
        
        // Handle animations if present
        if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(objects.minecraft);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
            AnimationMixers.push(mixer);
            debugLog(`Playing animation: ${gltf.animations[0].name}`);
        }
    },
    (progress) => {
        const percent = Math.round(progress.loaded / progress.total * 100);
        debugLog(`Loading minecraft: ${percent}%`);
    },
    (error) => {
        debugLog(`ERROR loading model: ${error.message}`);
        console.error(error);
    }
);

// Animation loop
const clock = new THREE.Clock();

async function start() {
    debugLog("Starting MindAR...");
    try {
        await mindARThree.start();
        debugLog("MindAR started successfully - Point camera at target!");
        
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            // Update all animation mixers
            AnimationMixers.forEach(mixer => mixer.update(delta));
            renderer.render(scene, camera);
        });
        
        debugLog("Animation loop started");
    } catch (error) {
        debugLog(`ERROR starting MindAR: ${error.message}`);
        console.error(error);
    }
}

// Target detection events
anchor.onTargetFound = () => {
    debugLog("✅ Target 0 FOUND!");
};

anchor.onTargetLost = () => {
    debugLog("❌ Target 0 LOST");
};

// Start the application
start();




// // main.js
// // import * as THREE from 'three';
// // import {GLTFLoader} from '/js/threejs/loader/GLTFLoader-0.180.0.js';
// import { OrbitControls } from './OrbitControls.js';
// // import {MindARThree} from '/js/mindar-image-three.prod-1.2.5.js';



// const mindARThree = new window.MINDAR.IMAGE.MindARThree({
//     container: document.body,
//     imageTargetSrc: 'targets/targets.mind',
// });

// const {renderer, scene, camera} = mindARThree;

// const anchor0 = mindARThree.addAnchor(0);
// // const scene = new THREE.Scene();

// // const w = window.innerWidth;
// // const h = window.innerHeight;
// // const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
// // renderer.setSize(w, h);
// // document.body.appendChild(renderer.domElement);

// // const fov = 45;
// // const aspect = w / h;
// // const near = 0.1;
// // const far = 1000;
// // const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// // camera.position.set(0, 2, 5);

// // 💡 Light
// const light = new THREE.DirectionalLight(0xffffff, 1); // color, intensity
// light.position.set(1, 1, 2); // move the light
// scene.add(light);

// // Optional: add ambient light for soft global lighting
// const ambient = new THREE.AmbientLight(0x404040, 1.5);
// scene.add(ambient);

// const axesHelper = new THREE.AxesHelper(5);
// axesHelper.position.set(0, 0, -2);
// scene.add(axesHelper);

// const loader = new THREE.AmbientLightGLTFLoader();
// const obejcts = {};
// let mixer;

// // OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.update();

// // Load Minecraft model
// loader.load('resources/minecraft.glb', (gltf) => {
//     obejcts.minecraft = gltf.scene;
//     obejcts.minecraft.scale.set(1,1,1);
//     obejcts.minecraft.position.set(0, 0, 0);
//     obejcts.minecraft.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
//     anchor.group.add(obejcts.minecraft);
//     if (gltf.animations.length > 0) {
//       mixer = new THREE.AnimationMixer(obejcts.minecraft);
//       const action = mixer.clipAction(gltf.animations[0]);
//       action.play();
//       AnimationMixer.push(mixer);
//     }
// });

// const clock = new THREE.Clock();
// const AnimationMixer = [];
// async function animate() {
//     await mindARThree.start();
//     renderer.setAnimationLoop(() => {
//     const delta = clock.getDelta();
//     animateMixers.forEach(m => m.update(delta));
//     renderer.render(scene, camera);
//   });
// }
// start();




// // (async function startAR() {


// // //setup MindAR
// //     const mindthree = new MindARThree({
// //         container: document.body,
// //         imageTargetSrc: 'targets/targets.mind',
// //     });

// //     const {renderer, scene, camera} = mindthree;

// // //Anchor setup
// //     const anchor0 = mindthree.addAnchor(0);
// //     const anchor1 = mindthree.addAnchor(1);
// //     const anchor2 = mindthree.addAnchor(2);

// //     await mindthree.start();


// // // murl
// //     const params = new URLSearchParams(window.location.search);
// //     const value = params.get("urll");



// // // ---------- Scene Setup ----------

// // //   dispatcher
// //     const dispatcher = new THREE.EventDispatcher();

// //     dispatcher.addEventListener("loaded", () => {
// //         const raycaster = new THREE.Raycaster();
// //         const mouse = new THREE.Vector2();

// //         // 1️⃣ Get dynamic model URL (example: query param ?modelUrl=...)
// //         const params = new URLSearchParams(window.location.search);
// //         const mUrl = params.get("murl") || "resources/sq-multi.glb";

// //         // loading  modeles from gltfloader
// //         const obejcts = {};
// //         const loader = new GLTFLoader();
// //         let mixer;
// //         const action = {};

// //         //   loading squirrel model
// //         loader.load("./resources/sq-multi.glb", (gltf) => {
// //             debugLog("squirrel model loaded");
// //             obejcts.squirrel = gltf.scene;
// //             obejcts.squirrel.scale.set(1.1, 1.1, 1.1);
// //             obejcts.squirrel.position.set(-0.32, -0.38, 0);
// //             obejcts.squirrel.rotation.set(
// //                 5.354 * Math.PI / 180,
// //                 70 * Math.PI / 180,
// //                 12.784 * Math.PI / 180
// //             );
// //             anchor0.group.add(obejcts.squirrel);
// //             debugLog("Squirrel model added to target 0.");
// //         });

// //         //   loading minecraft model
// //         loader.load("resources/minecraft.glb", (gltf) => {
// //             obejcts.minecraft = gltf.scene;
// //             obejcts.minecraft.scale.set(0.02, 0.02, 0.02);
// //             obejcts.minecraft.position.set(0, -0.5, 0);
// //             obejcts.minecraft.rotation.set(
// //                 0 * Math.PI / 180,
// //                 0 * Math.PI / 180,
// //                 0 * Math.PI / 180
// //             );
// //             anchor1.group.add(obejcts.minecraft);
// //             debugLog("Minecraft model added to target 1.");
// //             if (gltf.animations && gltf.animations.length > 0) {
// //                 const mixer = new THREE.AnimationMixer(obejcts.minecraft);
// //                 const action = mixer.clipAction(gltf.animations[0]);
// //                 action.play();
// //             }
// //             // playaniamtionm("Idle");
// //         });

// //         renderer.setAnimationLoop((t, dt) => {
// //             if (mixer) mixer.update(dt / 1000);
// //             renderer.render(scene, camera);
// //         });

// //         renderer.domElement.addEventListener("click", (event) => {
// //             const raycaster = new THREE.Raycaster();
// //             const mouse = new THREE.Vector2();
// //             const rect = renderer.domElement.getBoundingClientRect();
// //             mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
// //             mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
// //             raycaster.setFromCamera(mouse, camera);
// //             const intersects = raycaster.intersectObjects(scene.children, true);
// //             if (intersects.length > 0) debugLog("Clicked: " + intersects[0].object.name);
// //         });
// //      });
// //     })();
// //
// //     if (item["animation-mixer"]) {
// //         entity.setAttribute("animation-mixer", item["animation-mixer"]);
// //     }
// //
// //     if (item.Animation && Array.isArray(item.Animation)) {
// //         item.Animation.forEach(anim => {
// //             entity.setAttribute(`animation__${anim.name}`, anim.value);
// //         });
// //     }
// //
// //     target0.appendChild(entity);
// //     console.log("Model created:", entity);
// // });
// //
// // // ---------- تعامل کلیک/لمس ----------
// // function handleInteraction(event) {
// //     const rect = sceneEl.canvas.getBoundingClientRect();
// //     const x = event.touches ? event.touches[0].clientX : event.clientX;
// //     const y = event.touches ? event.touches[0].clientY : event.clientY;
// //
// //     mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
// //     mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
// //
// //     raycaster.setFromCamera(mouse, camera);
// //     const intersects = raycaster.intersectObjects(sceneEl.object3D.children, true);
// //
// //     if (intersects.length > 0) {
// //         const target = intersects[0].object.el;
// //         if (!target) return;
// //         debugLog(`Tapped: ${target.id}`);
// //
// //         // Minecraft
// //         if (target.id === "test") {
// //             index = (index + 1) % clips.length;
// //             const clip = clips[index];
// //             minecraft.setAttribute("animation-mixer", `clip: ${clip}`);
// //             if (clip === "walk") {
// //                 minecraft.emit("movefrontmine");
// //                 minecraft.emit("scalemine");
// //                 debugLog("Minecraft → movefrontmine");
// //             }
// //             debugLog(`Minecraft animation: ${clip}`);
// //         }
// //
// //         // squirrel
// //         if (target.id === "t2") {
// //             squirrel.setAttribute("animation-mixer", `clip:rig|walk-03_remap`, 'timeScal:5');
// //             squirrel.emit("moveright");
// //             debugLog(`Minecraft animation: moveright`);
// //             const sound = document.getElementById('sammy');
// //             sound.volume = 1;
// //             sound.play();
// //             debugLog(`sammy is talking`);
// //         }
// //
// //         squirrel.addEventListener("animationcomplete__right", () => {
// //             debugLog("animation move to right completed");
// //             squirrel.setAttribute("animation__fade", {
// //                 property: "scale",
// //                 to: "0 0 0",
// //                 dur: 3000,
// //                 easing: "easeInOutSine"
// //             });
// //
// //             squirrel.addEventListener("animationcomplete__fade", () => {
// //                 squirrel.parentNode.removeChild(squirrel);
// //                 debugLog("removed");
// //             });
// //         });
// //     }
// // }
// //
// // // فقط یک شنونده (تا دوبار اجرا نشود)
// // sceneEl.addEventListener("click", handleInteraction);
// //
// // debugLog("Raycaster ready (click supported).");
// //
// //
// // })
// // ;
// //