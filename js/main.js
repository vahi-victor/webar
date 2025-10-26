    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { MindARThree } from 'mindar-image-three';


    function debugLog(msg) {
      const div = document.createElement('div');
      div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      document.getElementById('debug-box').appendChild(div);
      console.log(msg);
    }

    debugLog("🚀 Loading from GitHub...");

    // Wait for script to load
    let attempts = 0;
    const checkMindAR = setInterval(() => {
      attempts++;

      if (window.MINDAR && window.MINDAR.IMAGE) {
        clearInterval(checkMindAR);
        debugLog("✅ MindAR loaded!");
        startAR();
      } else if (attempts > 50) {
        clearInterval(checkMindAR);
        debugLog("❌ Timeout - MindAR not loading");
        debugLog("Try downloading from:");
        debugLog("https://hiukim.github.io/mind-ar-js/");
      }
    }, 100);

    function startAR() {
      // const THREE = window.MINDAR.IMAGE.THREE;
      // debugLog(`📦 THREE r${THREE.REVISION}`);

      const mindARThree = new MindARThree({
        container: document.body,
        imageTargetSrc: 'targets/targets.mind',
      });

      const { renderer, scene, camera } = mindARThree;
      const anchor = mindARThree.addAnchor(0);
      const anchor1 = mindARThree.addAnchor(1);

      scene.add(new THREE.DirectionalLight(0xffffff, 1));
      scene.add(new THREE.AmbientLight(0x404040, 1.5));
      scene.add(new THREE.AxesHelper(0.5));
      debugLog("💡 Scene ready");

      const loader = new  GLTFLoader();
      const mixers = [];
      const clock = new THREE.Clock();

      debugLog("📥 Loading model...");

      loader.load('resources/minecraft.glb',
        (gltf) => {
          debugLog("✅ Model loaded");
          gltf.scene.scale.set(0.02, 0.02, 0.02);
          gltf.scene.position.set(0, -0.5, 0);
          gltf.scene.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
          anchor.group.add(gltf.scene);

          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            mixer.clipAction(gltf.animations[0]).play();
            mixers.push(mixer);
            debugLog(`🎭 Animation: ${gltf.animations[0].name}`);
          }
        },
        (xhr) => {
          if (xhr.total) {
            const p = Math.round(xhr.loaded / xhr.total * 100);
            if (p % 25 === 0) debugLog(`📊 ${p}%`);
          }
        },
        (e) => debugLog("❌ " + e.message)
      );

      anchor.onTargetFound = () => debugLog("🎯 FOUND!");
      anchor.onTargetLost = () => debugLog("❌ Lost");

      (async () => {
        debugLog("▶️ Starting AR...");
        try {
          await mindARThree.start();
          debugLog("✅ AR ACTIVE!");
          debugLog("📷 Point at target");

          renderer.setAnimationLoop(() => {
            mixers.forEach(m => m.update(clock.getDelta()));
            renderer.render(scene, camera);
          });
        } catch (e) {
          debugLog("❌ " + e.message);
        }
      })();

      loader.load('resources/sq-multi.glb',
        (gltf) => {
          debugLog("✅ Model  sq loaded");
          gltf.scene.scale.set(0.02, 0.02, 0.02);
          gltf.scene.position.set(0, 0 , 0);
          gltf.scene.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
          anchor.group.add(gltf.scene);

          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            mixer.clipAction(gltf.animations[0]).play();
            mixers.push(mixer);
            debugLog(`🎭 Animation: ${gltf.animations[0].name}`);
          }
        },
        (xhr) => {
          if (xhr.total) {
            const p = Math.round(xhr.loaded / xhr.total * 100);
            if (p % 25 === 0) debugLog(`📊 ${p}%`);
          }
        },
        (e) => debugLog("❌ " + e.message)
      );

      anchor.onTargetFound = () => debugLog("🎯 FOUND!");
      anchor.onTargetLost = () => debugLog("❌ Lost");

      (async () => {
        debugLog("▶️ Starting AR...");
        try {
          await mindARThree.start();
          debugLog("✅ AR ACTIVE!");
          debugLog("📷 Point at target");

          renderer.setAnimationLoop(() => {
            mixers.forEach(m => m.update(clock.getDelta()));
            renderer.render(scene, camera);
          });
        } catch (e) {
          debugLog("❌ " + e.message);
        }
      })();
    }

    