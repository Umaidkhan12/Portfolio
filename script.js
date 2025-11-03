// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("three-container").appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x2563eb, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x06d6a0, 0.5, 100);
pointLight.position.set(-2, -1, 3);
scene.add(pointLight);

// Create a particle system
const particleCount = 2000;
const particles = new THREE.BufferGeometry();
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 50;
}

particles.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: 0x2563eb,
  transparent: true,
  opacity: 0.8,
});

const particleMesh = new THREE.Points(particles, particleMaterial);
scene.add(particleMesh);

// Create floating 3D objects
const objects = [];
const geometries = [
  new THREE.TorusGeometry(1, 0.4, 16, 100),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.ConeGeometry(1, 2, 8),
];

const materials = [
  new THREE.MeshPhongMaterial({
    color: 0x2563eb,
    transparent: true,
    opacity: 0.7,
    shininess: 100,
  }),
  new THREE.MeshPhongMaterial({
    color: 0x7c3aed,
    transparent: true,
    opacity: 0.7,
    shininess: 100,
  }),
  new THREE.MeshPhongMaterial({
    color: 0x06d6a0,
    transparent: true,
    opacity: 0.7,
    shininess: 100,
  }),
];

for (let i = 0; i < 15; i++) {
  const geometry = geometries[Math.floor(Math.random() * geometries.length)];
  const material = materials[Math.floor(Math.random() * materials.length)];
  const mesh = new THREE.Mesh(geometry, material);

  // Random position
  mesh.position.x = (Math.random() - 0.5) * 30;
  mesh.position.y = (Math.random() - 0.5) * 30;
  mesh.position.z = (Math.random() - 0.5) * 20;

  // Random rotation
  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  // Random scale
  const scale = Math.random() * 0.8 + 0.5;
  mesh.scale.set(scale, scale, scale);

  // Store initial values for animation
  objects.push({
    mesh: mesh,
    speed: {
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.005,
    },
    rotation: {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
    },
  });

  scene.add(mesh);
}

// Create a wireframe globe
const globeGeometry = new THREE.SphereGeometry(5, 32, 32);
const globeMaterial = new THREE.MeshBasicMaterial({
  color: 0x2563eb,
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Position camera
camera.position.z = 15;

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Animate particles
  particleMesh.rotation.y += 0.001;

  // Animate objects
  objects.forEach((obj) => {
    obj.mesh.position.x += obj.speed.x;
    obj.mesh.position.y += obj.speed.y;
    obj.mesh.position.z += obj.speed.z;

    // Bounce off boundaries
    if (Math.abs(obj.mesh.position.x) > 15) obj.speed.x *= -1;
    if (Math.abs(obj.mesh.position.y) > 15) obj.speed.y *= -1;
    if (Math.abs(obj.mesh.position.z) > 10) obj.speed.z *= -1;

    // Rotate objects
    obj.mesh.rotation.x += obj.rotation.x;
    obj.mesh.rotation.y += obj.rotation.y;
    obj.mesh.rotation.z += obj.rotation.z;
  });

  // Rotate globe
  globe.rotation.y += 0.002;

  // Camera movement based on mouse
  camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// Update active nav link on scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Form submission
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("This Section is under Construction!");
  this.reset();
});
