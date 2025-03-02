import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const canvas = document.querySelector('canvas.threejs');

init();


function init() {

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0x404040, 5);

  const dirLight = new THREE.SpotLight( 'white', 100 );
  dirLight.position.set( 1, 5, 2.5 );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 500;
  dirLight.shadow.camera.far = 4000;
  dirLight.shadow.camera.fov = 30;


  const secondDirLight = new THREE.SpotLight( 'Blue', 10 );
  secondDirLight.position.set( -5, 5, -5 );
  secondDirLight.castShadow = true;
  secondDirLight.shadow.mapSize.width = 1024;
  secondDirLight.shadow.mapSize.height = 1024;
  secondDirLight.shadow.camera.near = 500;
  secondDirLight.shadow.camera.far = 4000;
  secondDirLight.shadow.camera.fov = 30;

  
  
  //Camera
  const camera = new THREE.PerspectiveCamera(75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    30
  );
  
  camera.position.z = 2;
  camera.position.y = 0.75;
  scene.add(camera);
  scene.add( dirLight );
  scene.add(ambientLight);
  scene.add(secondDirLight);
  //Fauteuil

  const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );
    loader.setPath( './public/' );
    loader.load( 'SM_Bolero_R01_Low.glb', function ( gltf ) {

      const fauteuil = gltf.scene;
      fauteuil.rotation.y = Math.PI / 1;
      fauteuil.position.y = -0.25;
      fauteuil.castShadow = true;
      fauteuil.receiveShadow = true; 

      scene.add( fauteuil );
   
      render();

    } );

  // Sol
  
  const geometry = new THREE.PlaneGeometry( 100, 100 );
  const material = new THREE.MeshStandardMaterial( {color: 'black', side: THREE.DoubleSide } );
  
  const plane = new THREE.Mesh( geometry, material );
  
  plane.rotation.x = Math.PI /-2;
  plane.position.y = -0.25;
  plane.receiveShadow = true; 
  
  scene.add( plane );
  
  //renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', onWindowResize);
  const controls = new OrbitControls( camera, renderer.domElement );
  renderer.setAnimationLoop(cameraOrbiting);
  renderer.shadowMap.enabled = true;
  
  //functions
  function render () {
    renderer.render(scene, camera);
  };

  function cameraOrbiting() {
    controls.update();
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.maxDistance = 3;
    controls.minDistance = 1;

    render();
  };
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  };

  render();
  
};