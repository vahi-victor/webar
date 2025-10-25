
// main.js
import * as THREE from './js/three.module-0.180.0.js'; 
import {GLTFLoader} from './js/GLTFLoader-0.180.0.js';
import { MindARThree } from './js/mindar-image-three.prod.js';

      // ---------- Debug Logger ----------
      const debugBox = document.getElementById("debug-box");
      function debugLog(msg) {
        console.log(msg);
        const div = document.createElement("div");
        div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        debugBox.appendChild(div);
        debugBox.scrollTop = debugBox.scrollHeight;
  
      }
      const video = document.querySelector("#myvideo");
      setTimeout(() =>{
        video.play();
      }, 4000);

      //setup MindAR
      const mindthree = new MindARThree({
        container: document.body,
        imageTargetSrc: 'targets/targets.mind',
      });

      const {renderer, scene, camera} = mindthree;

      //Anchor setup
        const anchor0 = mindthree.addAnchor(0);
        const anchor1 = mindthree.addAnchor(1);
        const anchor2 = mindthree.addAnchor(2);


      // murl
      const params = new URLSearchParams(window.location.search);
      const value = params.get("urll");
      debugLog(value);


      // ---------- Scene Setup ----------

    //   dispatcher
    const dispatcher = new THREE.EventDispatcher();

      dispatcher.addEventListener("loaded", () =>{
        debugLog("Scene loaded. Setting up raycaster...");

        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

          // 1️⃣ Get dynamic model URL (example: query param ?modelUrl=...)
          const params = new URLSearchParams(window.location.search);
          const mUrl = params.get("murl") || "resources/sq-multi.glb";

          // loading  modeles from gltfloader 
          const obejcts = {};
          const loader = new GLTFLoader();
          let mixer;
          const action = {};

        //   loading squirrel model
          loader.load("./resources/sq-multi.glb", (gltf) => {
            debugLog("GLTF model loaded from URL: " + mUrl);
            obejcts.squirrel = gltf.scene;
            obejcts.squirrel.scale.set(1.1, 1.1, 1.1);
            obejcts.squirrel.position.set(-0.32, -0.38, 0);
            obejcts.squirrel.rotation.set(
                5.354 * Math.PI /180,
                 70 * Math.PI /180,
                 12.784 * Math.PI /180
                );
            anchor0.group.add(obejcts.squirrel);
            debugLog("Squirrel model added to target 0.");
          });

        //   loading minecraft model
        loader.load("resources/minecraft.glb", (gltf) => {
            obejcts.minecraft = gltf.scene;
            obejcts.minecraft.scale.set(0.02, 0.02, 0.02);
            obejcts.minecraft.position.set(0, -0.5, 0);
            obejcts.minecraft.rotation.set(
                0 * Math.PI/180, 
                0 * Math.PI/ 180, 
                0 * Math.PI/180
            );
            anchor1.group.add(obejcts.minecraft);
            debugLog("Minecraft model added to target 1.");
            if (gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(obejcts.minecraft);
                const action = mixer.clipAction(gltf.animations[0]);
          });
          playaniamtionm("Idle");
        }
    });

            if (item["animation-mixer"]) {
              entity.setAttribute("animation-mixer", item["animation-mixer"]);
            }

            if (item.Animation && Array.isArray(item.Animation)) {
              item.Animation.forEach(anim => {
                entity.setAttribute(`animation__${anim.name}`, anim.value);
              });
            }

            target0.appendChild(entity);
            console.log("Model created:", entity);
            });

            // مدل‌ها
            
            const squirrel = document.querySelector("#t2");
            const tree1 = document.querySelector("#t1");
            const phoenix = document.querySelector("#phoenix_bird");

            
            const clipsq = ["rig|idle-1", "rig|walk-03_remap"];

            let index = 0;
            let moveIndex = 0;

            // tree model moded log
            tree1.addEventListener("model-loaded", () => {
              debugLog("tree model loaded");
            });

            phoenix.setAttribute('visible', 'false');
            debugLog("phoenix visible is false");

            // play when marker found
            const marker = document.querySelector("#target0");
            marker.addEventListener("targetFound", () => {
              debugLog("target founded");
              const sound = document.getElementById('narrator');
              sound.volume = 1;
              setTimeout(() => {
                sound.play();
              }, 8000);
              debugLog("Narration is palying");
              // visible phoenix and fly
              phoenix.setAttribute('visible', 'true');
              debugLog("phoenix model loaded");
              phoenix.emit("flying");
              debugLog("Phoenix flying started");
            });

            // squirrel model
            squirrel.addEventListener("model-loaded", ()=> {
              document.querySelector('#custom-loader').style.display = "none";
              squirrel.setAttribute("animation-mixer", "clip: rig|idle-1");
              debugLog("squirrell model loaded");
              
            });
            
            phoenix.addEventListener("animationcomplete__fly", () =>{
                debugLog("Phoenix finished first flight; Rotating");
                phoenix.emit("phoenixrotation");
                phoenix.emit("phoenixscale");
                debugLog("Phoenix finished first flight; switching to flyfront");
                phoenix.emit("flyingfront");
              });

            // ---------- تعامل کلیک/لمس ----------
            function handleInteraction(event) {
              const rect = sceneEl.canvas.getBoundingClientRect();
              const x = event.touches ? event.touches[0].clientX : event.clientX;
              const y = event.touches ? event.touches[0].clientY : event.clientY;

              mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
              mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

              raycaster.setFromCamera(mouse, camera);
              const intersects = raycaster.intersectObjects(sceneEl.object3D.children, true);

              if (intersects.length > 0) {
                const target = intersects[0].object.el;
                if (!target) return;
                debugLog(`Tapped: ${target.id}`);

                // Minecraft
                if (target.id === "test") {
                  index = (index + 1) % clips.length;
                  const clip = clips[index];
                  minecraft.setAttribute("animation-mixer", `clip: ${clip}`);
                  if (clip === "walk") {
                    minecraft.emit("movefrontmine");
                    minecraft.emit("scalemine");
                    debugLog("Minecraft → movefrontmine");
                  }
                  debugLog(`Minecraft animation: ${clip}`);
                }

                // squirrel
                if (target.id === "t2") { 
                  squirrel.setAttribute("animation-mixer", `clip:rig|walk-03_remap`,'timeScal:5');
                  squirrel.emit("moveright");
                  debugLog(`Minecraft animation: moveright`);
                  const sound = document.getElementById('sammy');
                  sound.volume = 1;
                  sound.play();
                  debugLog(`sammy is talking`);
                }

                squirrel.addEventListener("animationcomplete__right",()=>{
                  debugLog("animation move to right completed");
                  squirrel.setAttribute("animation__fade",{
                    property:"scale",
                    to:"0 0 0",
                    dur:3000,
                    easing: "easeInOutSine"
                  });
      
                  squirrel.addEventListener("animationcomplete__fade",()=>{
                    squirrel.parentNode.removeChild(squirrel);
                    debugLog("removed");
                  });
                });
              }
            }

            // فقط یک شنونده (تا دوبار اجرا نشود)
            sceneEl.addEventListener("click", handleInteraction);

            debugLog("Raycaster ready (click supported).");
          

        });
  