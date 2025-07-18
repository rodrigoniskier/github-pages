import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.module.js';

let scene, camera, renderer;
let hero;
const bacteria = [];
const keys = {};
let score = 0;

init();
animate();

function init(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0,20,20);
  scene.add(light);

  const geo = new THREE.SphereGeometry(1, 32, 32);
  const mat = new THREE.MeshStandardMaterial({color: 0x00ff00});
  hero = new THREE.Mesh(geo, mat);
  scene.add(hero);

  camera.position.z = 5;

  spawnBacteria(5);
  window.addEventListener('resize', onResize);
  document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
}

function spawnBacteria(n){
  for(let i=0;i<n;i++){
    const geo = new THREE.BoxGeometry(1,1,1);
    const mat = new THREE.MeshStandardMaterial({color: 0xff0000});
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
    scene.add(cube);
    bacteria.push(cube);
  }
}

function onResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
  requestAnimationFrame(animate);
  const speed = 0.05;
  if(keys['w']) hero.position.z -= speed;
  if(keys['s']) hero.position.z += speed;
  if(keys['a']) hero.position.x -= speed;
  if(keys['d']) hero.position.x += speed;

  checkCollisions();
  renderer.render(scene, camera);
}

function checkCollisions(){
  for(let i=bacteria.length-1;i>=0;i--){
    const b = bacteria[i];
    if(hero.position.distanceTo(b.position) < 1.2){
      scene.remove(b);
      bacteria.splice(i,1);
      score++;
      document.getElementById('status').innerText = `Bactérias eliminadas: ${score}`;
      if(score === 3){
        document.getElementById('status').innerText += '\nA imunidade inata age rapidamente eliminando ameaças.';
      } else if(score === 5){
        document.getElementById('status').innerText += '\nA imunidade adaptativa cria memória para futuras infecções.';
      }
      if(bacteria.length === 0) spawnBacteria(5);
    }
  }
}
