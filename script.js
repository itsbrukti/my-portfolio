// script.js
import * as THREE from 'three';

// Setup the 3D scene
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05050a);
scene.fog = new THREE.FogExp2(0x05050a, 0.008);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lighting
const ambientLight = new THREE.AmbientLight(0x1a1a2e);
scene.add(ambientLight);
const pointLight1 = new THREE.PointLight(0x00d4ff, 1);
pointLight1.position.set(3, 4, 5);
scene.add(pointLight1);
const pointLight2 = new THREE.PointLight(0xff3366, 0.5);
pointLight2.position.set(-3, 2, 4);
scene.add(pointLight2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 2, 1);
scene.add(directionalLight);

// Central 3D Object: Rotating Geometric Core
const coreGeometry = new THREE.IcosahedronGeometry(1.2, 0);
const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    emissive: 0x0088aa,
    emissiveIntensity: 0.4,
    metalness: 0.8,
    roughness: 0.2
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// Outer ring system
const ringGeometry = new THREE.TorusGeometry(1.8, 0.08, 64, 200);
const ringMaterial = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x0088aa, emissiveIntensity: 0.3 });
const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
ring1.rotation.x = Math.PI / 2;
scene.add(ring1);

const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
ring2.rotation.z = Math.PI / 3;
ring2.rotation.x = Math.PI / 3;
scene.add(ring2);

// Floating particles
const particleCount = 2000;
const particlesGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 25;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

// Floating cubes/orbs around
const orbGroup = [];
const orbColors = [0x00d4ff, 0x33aaff, 0x0088aa];
for (let i = 0; i < 30; i++) {
    const size = 0.08 + Math.random() * 0.1;
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshStandardMaterial({
        color: orbColors[Math.floor(Math.random() * orbColors.length)],
        emissive: 0x00aaff,
        emissiveIntensity: 0.3
    });
    const orb = new THREE.Mesh(geometry, material);
    const radius = 3 + Math.random() * 4;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 8;
    orb.userData = {
        radius: radius,
        angle: angle,
        speed: 0.002 + Math.random() * 0.005,
        yOffset: height,
        ySpeed: 0.002 + Math.random() * 0.003
    };
    orb.position.x = Math.cos(angle) * radius;
    orb.position.z = Math.sin(angle) * radius;
    orb.position.y = height;
    scene.add(orb);
    orbGroup.push(orb);
}

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.008;
    
    // Rotate core and rings
    core.rotation.x = time * 0.5;
    core.rotation.y = time * 0.8;
    ring1.rotation.z = time * 0.3;
    ring2.rotation.x = time * 0.4;
    ring2.rotation.y = time * 0.2;
    
    // Rotate particles
    particles.rotation.y = time * 0.05;
    particles.rotation.x = Math.sin(time * 0.1) * 0.1;
    
    // Animate orbs
    orbGroup.forEach(orb => {
        orb.userData.angle += orb.userData.speed;
        orb.position.x = Math.cos(orb.userData.angle) * orb.userData.radius;
        orb.position.z = Math.sin(orb.userData.angle) * orb.userData.radius;
        orb.position.y = orb.userData.yOffset + Math.sin(time * 1.5) * 0.5;
    });
    
    // Subtle camera movement
    camera.position.x = Math.sin(time * 0.1) * 0.3;
    camera.position.y = 2 + Math.sin(time * 0.2) * 0.1;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Navbar mobile toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// CV Download
document.getElementById('download-cv').addEventListener('click', (e) => {
    e.preventDefault();
    alert('📄 CV download will be available soon.');
});

// Contact form (using FormSubmit)
const form = document.getElementById('message-form');
const statusDiv = document.getElementById('form-status');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    statusDiv.innerHTML = '⏳ Sending message...';
    statusDiv.style.color = '#00d4ff';
    
    // Replace with your actual email for production
    const YOUR_EMAIL = 'biruktawit@example.com';
    try {
        const response = await fetch('https://formsubmit.co/ajax/' + YOUR_EMAIL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _subject: 'New Portfolio Message from Biruktawit'
            })
        });
        if (response.ok) {
            statusDiv.innerHTML = '✓ Message sent successfully! I\'ll get back to you soon.';
            form.reset();
        } else {
            statusDiv.innerHTML = '⚠️ Failed to send. Please try again or email directly.';
        }
    } catch (err) {
        statusDiv.innerHTML = '⚠️ Network error. Please try again.';
    }
    setTimeout(() => {
        setTimeout(() => { if(statusDiv) statusDiv.innerHTML = ''; }, 3000);
    }, 4000);
});

// Social links (update with actual URLs)
document.getElementById('email-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'mailto:biruktawit@example.com';
});
document.getElementById('linkedin-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://linkedin.com/in/biruktawit-zemedkun', '_blank');
});
document.getElementById('telegram-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://t.me/biruktawit', '_blank');
});
document.getElementById('github-link').addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/itsbrukti', '_blank');
});