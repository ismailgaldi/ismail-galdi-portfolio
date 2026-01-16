/**
 * Three.js Hero Scene
 * 3D abstract monogram with mouse interaction
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/reducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

let scene, camera, renderer, mesh;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let isVisible = true;
let animationId = null;

/**
 * Initialize Three.js scene
 */
export function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Scene setup
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });

    // Limit pixel ratio on mobile for performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Create 3D object - Abstract geometric shape
    createAbstractShape();

    // Lighting
    setupLighting();

    // Mouse interaction (desktop only)
    if (!prefersReducedMotion() && window.innerWidth > 768) {
        setupMouseInteraction(container);
    }

    // Visibility observer for performance
    setupVisibilityObserver(canvas);

    // Scroll-linked effects
    setupScrollEffects();

    // Handle resize
    window.addEventListener('resize', handleResize);

    // Start render loop
    animate();
}

/**
 * Create abstract 3D shape (stylized "IG" or geometric)
 */
function createAbstractShape() {
    // Create a group for multiple geometries
    const group = new THREE.Group();

    // Main torus knot (abstract, elegant)
    const torusGeometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16, 2, 3);

    // Material with accent color influence
    const material = new THREE.MeshStandardMaterial({
        color: 0x1a1f2a,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1
    });

    mesh = new THREE.Mesh(torusGeometry, material);
    group.add(mesh);

    // Add wireframe overlay for depth
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xB6FF3B,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const wireframeMesh = new THREE.Mesh(torusGeometry, wireframeMaterial);
    wireframeMesh.scale.set(1.02, 1.02, 1.02);
    group.add(wireframeMesh);

    // Add floating particles around the shape
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 2 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xB6FF3B,
        size: 0.03,
        transparent: true,
        opacity: 0.6
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.name = 'particles';
    group.add(particles);

    scene.add(group);
}

/**
 * Setup scene lighting
 */
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Accent colored light
    const accentLight = new THREE.PointLight(0xB6FF3B, 0.8, 10);
    accentLight.position.set(-3, 2, 3);
    accentLight.name = 'accentLight';
    scene.add(accentLight);

    // Back rim light
    const rimLight = new THREE.PointLight(0x4488ff, 0.5, 10);
    rimLight.position.set(3, -2, -3);
    scene.add(rimLight);
}

/**
 * Setup mouse interaction
 */
function setupMouseInteraction(container) {
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    container.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });
}

/**
 * Setup IntersectionObserver for performance
 */
function setupVisibilityObserver(canvas) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(canvas);
}

/**
 * Setup scroll-linked effects
 */
function setupScrollEffects() {
    if (prefersReducedMotion()) return;

    const hero = document.getElementById('hero');

    ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
            const progress = self.progress;

            // Move object back in Z
            if (mesh) {
                mesh.position.z = -progress * 2;
            }

            // Shift accent light
            const accentLight = scene.getObjectByName('accentLight');
            if (accentLight) {
                accentLight.intensity = 0.8 * (1 - progress);
            }
        }
    });
}

/**
 * Handle window resize
 */
function handleResize() {
    const container = document.getElementById('hero-canvas')?.parentElement;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

/**
 * Animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);

    // Skip if not visible (performance)
    if (!isVisible) return;

    // Smooth rotation towards mouse
    const rotationSpeed = 0.02; // Reduced from 0.05 for more weight
    const maxRotation = 0.2; // Reduced amplitude

    targetRotationY = mouseX * maxRotation;
    targetRotationX = mouseY * maxRotation;

    if (mesh) {
        // Auto rotation (slow)
        if (!prefersReducedMotion()) {
            mesh.rotation.y += 0.0015; // Halved speed
        }

        // Mouse-follow rotation
        mesh.rotation.x += (targetRotationX - mesh.rotation.x) * rotationSpeed;
        mesh.rotation.y += (targetRotationY - mesh.rotation.y) * rotationSpeed;
    }

    // Animate particles
    const particles = scene.getObjectByName('particles');
    if (particles && !prefersReducedMotion()) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
    }

    renderer.render(scene, camera);
}

/**
 * Cleanup
 */
export function destroyHeroScene() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (renderer) {
        renderer.dispose();
    }

    window.removeEventListener('resize', handleResize);
}
