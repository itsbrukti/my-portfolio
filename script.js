// script.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --- Three.js Setup for Hero Background (Girly 3D floating hearts & particles) ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
scene.background = null; // transparent, will be soft gradient from CSS
scene.fog = new THREE.FogExp2(0xfff0f5, 0.008);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // transparent

// Lighting
const ambientLight = new THREE.AmbientLight(0xffccdd);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xff99bb, 1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);
const backLight = new THREE.PointLight(0xffc0cb, 0.5);
backLight.position.set(-2, 1, -3);
scene.add(backLight);

// Floating Hearts (using torus knots and custom shapes)
const heartShape = (x, y, z, scale) => {
    const group = new THREE.Group();
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6b8a, emissive: 0xffa5c0, emissiveIntensity: 0.4 });
    const sphere1 = new THREE.Mesh(geometry, material);
    sphere1.position.set(-0.2, 0.2, 0);
    const sphere2 = new THREE.Mesh(geometry, material);
    sphere2.position.set(0.2, 0.2, 0);
    const coneGeo = new THREE.ConeGeometry(0.22, 0.4, 32);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xff6b8a });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(0, -0.15, 0);
    group.add(sphere1, sphere2, cone);
    group.scale.set(scale, scale, scale);
    group.position.set(x, y, z);
    return group;
};

const heartsGroup = [];
for (let i = 0; i < 35; i++) {
    const heart = heartShape(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6 + 1,
        (Math.random() - 0.5) * 8 - 4,
        Math.random() * 0.35 + 0.2
    );
    scene.add(heart);
    heartsGroup.push(heart);
}

// floating glitter particles
const particleCount = 800;
const particlesGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    particlePositions[i*3] = (Math.random() - 0.5) * 20;
    particlePositions[i*3+1] = (Math.random() - 0.5) * 12;
    particlePositions[i*3+2] = (Math.random() - 0.5) * 15 - 5;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({ color: 0xffa5c0, size: 0.08, transparent: true, opacity: 0.6 });
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

// Also add floating ribbons / rings for elegance
const ringGeo = new THREE.TorusGeometry(1.2, 0.05, 64, 200);
const ringMat = new THREE.MeshStandardMaterial({ color: 0xff8da1, emissive: 0xffb7c9 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.position.set(0, -0.5, -1);
scene.add(ring);

// Animation variables
let time = 0;

function animate3D() {
    requestAnimationFrame(animate3D);
    time += 0.008;
    
    heartsGroup.forEach((heart, idx) => {
        heart.rotation.x = Math.sin(time + idx) * 0.5;
        heart.rotation.z = Math.cos(time * 0.8 + idx) * 0.4;
        heart.position.y += Math.sin(time * 1.5 + idx) * 0.002;
    });
    
    particles.rotation.y = time * 0.1;
    ring.rotation.x = time * 0.4;
    ring.rotation.z = time * 0.2;
    
    camera.lookAt(0, 1, 0);
    renderer.render(scene, camera);
}
animate3D();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Navbar mobile toggle & active link smooth scroll ---
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

// --- CV download simulation ---
const downloadBtn = document.getElementById('download-cv');
downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Simulate CV download (you can replace with actual pdf)
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'Biruktawit_Zemedkun_CV.pdf';
    link.click();
    alert("📄 CV download simulation. Replace with actual CV file.");
});

// --- Send message to email via FormSubmit.co (free service) ---
const form = document.getElementById('message-form');
const statusDiv = document.getElementById('form-status');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    statusDiv.innerHTML = "💖 Sending your lovely message...";
    statusDiv.style.color = "#e06e8a";
    
    // Using FormSubmit.co endpoint (free, emails go to your registered email)
    // NOTE: Replace 'your_email@example.com' with actual email address before deploy
    const YOUR_EMAIL = "biruktawit@example.com"; // CHANGE THIS TO YOUR REAL EMAIL
    try {
        const response = await fetch('https://formsubmit.co/ajax/' + YOUR_EMAIL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name: name, email: email, message: message, _subject: "New Portfolio Message from Biruktawit's Site" })
        });
        if (response.ok) {
            statusDiv.innerHTML = "✨ Message sent successfully! I'll get back to you soon. ✨";
            form.reset();
        } else {
            statusDiv.innerHTML = "⚠️ Oops! Couldn't send. Try emailing directly or later.";
        }
    } catch (err) {
        statusDiv.innerHTML = "⚠️ Network error. Please try again.";
    }
    setTimeout(() => {
        setTimeout(() => { if(statusDiv) statusDiv.innerHTML = ""; }, 3000);
    }, 4000);
});

// Social buttons placeholders - open respective links (update with actual URLs)
document.querySelectorAll('.social-icon.email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); window.location.href = "mailto:biruktawit@example.com"; });
});
document.querySelectorAll('.social-icon.linkedin-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); window.open('https://linkedin.com/in/biruktawit-zemedkun', '_blank'); });
});
document.querySelectorAll('.social-icon.telegram-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); window.open('https://t.me/biruktawit', '_blank'); });
});
document.querySelectorAll('.social-icon.github-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); window.open('https://github.com/biruktawit', '_blank'); });
});