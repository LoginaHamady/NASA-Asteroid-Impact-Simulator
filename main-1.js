// Global variables
let scene, camera, renderer, earth, asteroid, animationId;
let currentAsteroidIndex = 0;
let soundEnabled = true;
let lastText = "";
let volume = 0.7;
let targetLat = 23.8859,
    targetLon = 2.5085;
let currentTarget = {
    name: "Sahara Desert",
    population: 1000,
    environment: "Desert"
};
let explosionParticles = [];
let impactMarker = null;
let isSimulating = false;
let cinematicMode = false;
let selectedMitigation = null;
let journeyPhases = [];
let currentJourneyPhase = 0;
let earthMesh, atmosphereMesh, cloudMesh, nightLightsMesh;
let controls;
let previewScene, previewCamera, previewRenderer, previewAsteroid;
let nasaApiKey = "miLjNljhymbMhz9QGhoWCZne1dyjBzlQzsM3im8F";
// 2D map (Leaflet)
let map2d = null;
let map2dMarker = null;
// Recording
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
// USGS Data Service
let usgsService = null;
let usgsData = null;

// Enhancement Features
let gamificationMode = null;
let socialSharing = null;
let educationalOverlay = null;
let regionalAnalysis = null;
let accessibilityMode = {
    highContrast: false,
    reducedMotion: false,
    colorblind: false
};
// NASA asteroid database with real discovered asteroids
let asteroidDatabase = [{
        name: "Chicxulub Impactor",
        diameter: 12000,
        velocity: 20,
        angle: 45,
        density: 2700,
        type: "rocky",
        description: "66 MYA • Extinction Event",
        discovered: "Theoretical",
        shape: "spherical"
    },
    {
        name: "Apophis (99942)",
        diameter: 370,
        velocity: 30,
        angle: 60,
        density: 2600,
        type: "rocky",
        description: "2029 Close Approach",
        discovered: "2004",
        shape: "elongated"
    },
    {
        name: "Bennu (101955)",
        diameter: 492,
        velocity: 28,
        angle: 45,
        density: 1190,
        type: "carbonaceous",
        description: "OSIRIS-REx Target",
        discovered: "1999",
        shape: "spherical"
    },
    {
        name: "Ryugu (162173)",
        diameter: 900,
        velocity: 25,
        angle: 50,
        density: 1270,
        type: "carbonaceous",
        description: "Hayabusa2 Target",
        discovered: "1999",
        shape: "diamond"
    },
    {
        name: "Eros (433)",
        diameter: 16840,
        velocity: 24,
        angle: 35,
        density: 2670,
        type: "rocky",
        description: "NEAR Shoemaker Target",
        discovered: "1898",
        shape: "elongated"
    }
];
// Location database with accurate coordinates
const locationDatabase = {
    newyork: {
        lat: 40.7128,
        lon: -74.0060,
        name: "New York City",
        population: 8400000,
        environment: "Urban"
    },
    london: {
        lat: 51.5074,
        lon: -0.1278,
        name: "London",
        population: 9000000,
        environment: "Urban"
    },
    tokyo: {
        lat: 35.6762,
        lon: 139.6503,
        name: "Tokyo",
        population: 14000000,
        environment: "Urban"
    },
    mumbai: {
        lat: 19.0760,
        lon: 72.8777,
        name: "Mumbai",
        population: 20400000,
        environment: "Urban"
    },
    shanghai: {
        lat: 31.2304,
        lon: 121.4737,
        name: "Shanghai",
        population: 24300000,
        environment: "Urban"
    },
    saopaulo: {
        lat: -23.5505,
        lon: -46.6333,
        name: "São Paulo",
        population: 12300000,
        environment: "Urban"
    },
    cairo: {
        lat: 30.0444,
        lon: 31.2357,
        name: "Cairo",
        population: 20900000,
        environment: "Urban"
    },
    moscow: {
        lat: 55.7558,
        lon: 37.6176,
        name: "Moscow",
        population: 12500000,
        environment: "Urban"
    },
    sydney: {
        lat: -33.8688,
        lon: 151.2093,
        name: "Sydney",
        population: 5300000,
        environment: "Urban"
    },
    lagos: {
        lat: 6.5244,
        lon: 3.3792,
        name: "Lagos",
        population: 15300000,
        environment: "Urban"
    },
    washington: {
        lat: 38.9072,
        lon: -77.0369,
        name: "Washington D.C.",
        population: 700000,
        environment: "Urban"
    },
    paris: {
        lat: 48.8566,
        lon: 2.3522,
        name: "Paris",
        population: 2200000,
        environment: "Urban"
    },
    berlin: {
        lat: 52.5200,
        lon: 13.4050,
        name: "Berlin",
        population: 3700000,
        environment: "Urban"
    },
    rome: {
        lat: 41.9028,
        lon: 12.4964,
        name: "Rome",
        population: 2900000,
        environment: "Urban"
    },
    madrid: {
        lat: 40.4168,
        lon: -3.7038,
        name: "Madrid",
        population: 3200000,
        environment: "Urban"
    },
    beijing: {
        lat: 39.9042,
        lon: 116.4074,
        name: "Beijing",
        population: 21500000,
        environment: "Urban"
    },
    newdelhi: {
        lat: 28.6139,
        lon: 77.2090,
        name: "New Delhi",
        population: 29400000,
        environment: "Urban"
    },
    brasilia: {
        lat: -15.8267,
        lon: -47.9218,
        name: "Brasília",
        population: 3100000,
        environment: "Urban"
    },
    ottawa: {
        lat: 45.4215,
        lon: -75.6972,
        name: "Ottawa",
        population: 1000000,
        environment: "Urban"
    },
    canberra: {
        lat: -35.2809,
        lon: 149.1300,
        name: "Canberra",
        population: 430000,
        environment: "Urban"
    },
    ocean_pacific: {
        lat: 0,
        lon: -140,
        name: "Pacific Ocean",
        population: 0,
        environment: "Ocean"
    },
    ocean_atlantic: {
        lat: 0,
        lon: -30,
        name: "Atlantic Ocean",
        population: 0,
        environment: "Ocean"
    },
    sahara: {
        lat: 23.8859,
        lon: 2.5085,
        name: "Sahara Desert",
        population: 1000,
        environment: "Desert"
    },
    antarctica: {
        lat: -82.8628,
        lon: 135.0000,
        name: "Antarctica",
        population: 5000,
        environment: "Ice"
    },
    siberia: {
        lat: 66.0000,
        lon: 94.0000,
        name: "Siberian Wilderness",
        population: 500,
        environment: "Tundra"
    },
    amazon: {
        lat: -3.4653,
        lon: -62.2159,
        name: "Amazon Rainforest",
        population: 2000,
        environment: "Forest"
    }
};

// One-time unlock for Web Speech API on first user interaction
window.__speechUnlocked = false;
function ensureSpeechUnlocked() {
    if (window.__speechUnlocked) return;
    const synth = window.speechSynthesis;
    if (!synth) { window.__speechUnlocked = true; return; }
    try {
        // Speak a zero-width space or short silent utterance to unlock
        const u = new SpeechSynthesisUtterance('\u200B');
        u.volume = 0; u.rate = 1; u.pitch = 1;
        u.onend = () => { 
            window.__speechUnlocked = true; 
            const prompt = document.getElementById('audioUnlockPrompt');
            if (prompt) prompt.style.display = 'none';
        };
        // Some browsers ignore 0-volume; speak a very short sound then cancel
        synth.speak(u);
        setTimeout(() => { try { if (synth.speaking) synth.cancel(); } catch (_) {} }, 200);
    } catch (_) {
        window.__speechUnlocked = true;
    }
}
// Attach unlock to first interaction
['pointerdown','keydown'].forEach(evt => {
    window.addEventListener(evt, function once() {
        try { ensureSpeechUnlocked(); } catch (_) {}
        window.removeEventListener(evt, once);
    });
});
// Show unlock prompt until user interacts
setTimeout(() => {
    try {
        if (!window.__speechUnlocked) {
            const prompt = document.getElementById('audioUnlockPrompt');
            if (prompt) prompt.style.display = 'block';
        }
    } catch (_) {}
}, 1200);
// NASA Earth texture URLs
const textureUrls = {
    earth: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    specular: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    lights: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    normal: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    asteroid: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/asteroid_rock_01.jpg',
    asteroidNormal: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/asteroid_rock_01_n.jpg'
};
// NASA API Integration Functions
async function fetchNASAData() {
    const apiStatus = document.getElementById('apiStatus');
    apiStatus.textContent = "API: Loading...";
    apiStatus.className = "api-status loading";
    try {
        // Fetch data from NASA NEO API
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${nasaApiKey}`);
        const data = await response.json();
        if (data.near_earth_objects && data.near_earth_objects.length > 0) {
            // Process and add NASA asteroids to our database
            processNASAAsteroids(data.near_earth_objects);
            apiStatus.textContent = "API: Loaded " + data.near_earth_objects.length + " asteroids";
            apiStatus.className = "api-status success";
            // Show NASA data section
            document.getElementById('nasaDataSection').style.display = 'block';
            // Update current asteroid display with NASA data
            updateNASADataDisplay();
        } else {
            throw new Error("No asteroid data received from NASA API");
        }
    } catch (error) {
        console.error("Error fetching NASA data:", error);
        apiStatus.textContent = "API: Error - " + error.message;
        apiStatus.className = "api-status error";
    }
}

function processNASAAsteroids(neoData) {
    // Clear existing database except for the first 5 historical asteroids
    const historicalAsteroids = asteroidDatabase.slice(0, 5);
    asteroidDatabase = historicalAsteroids;
    // Add NASA asteroids to our database
    neoData.forEach(asteroid => {
        if (asteroid.estimated_diameter && asteroid.estimated_diameter.meters) {
            const diameterMin = asteroid.estimated_diameter.meters.estimated_diameter_min;
            const diameterMax = asteroid.estimated_diameter.meters.estimated_diameter_max;
            const avgDiameter = (diameterMin + diameterMax) / 2;
            // Get velocity from close approach data if available
            let velocity = 20; // Default
            if (asteroid.close_approach_data && asteroid.close_approach_data.length > 0) {
                velocity = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second) || 20;
            }
            // Determine asteroid type based on diameter and other factors
            let type = "rocky";
            if (avgDiameter < 100) type = "carbonaceous";
            if (avgDiameter > 5000) type = "metallic";
            // Add to database
            asteroidDatabase.push({
                name: asteroid.name,
                diameter: avgDiameter,
                velocity: velocity,
                angle: 45,
                density: type === "rocky" ? 2700 : type === "metallic" ? 7800 : 1300,
                type: type,
                description: `NASA NEO • ${asteroid.neo_reference_id}`,
                discovered: asteroid.discovery_date || "Unknown",
                shape: "spherical",
                nasaData: asteroid // Store full NASA data
            });
        }
    });
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentAsteroidIndex === 0;
    document.getElementById('nextBtn').disabled = currentAsteroidIndex === asteroidDatabase.length - 1;
}

function updateNASADataDisplay() {
    const asteroid = asteroidDatabase[currentAsteroidIndex];
    if (!asteroid.nasaData) return;
    const nasaData = asteroid.nasaData;
    // Update NASA data panel
    document.getElementById('nasaDesignation').textContent = nasaData.name;
    document.getElementById('nasaOrbitId').textContent = nasaData.neo_reference_id || "N/A";
    document.getElementById('nasaFirstObserved').textContent = nasaData.discovery_date || "Unknown";
    // Potentially hazardous indicator
    const hazardousElement = document.getElementById('nasaHazardous');
    if (nasaData.is_potentially_hazardous_asteroid) {
        hazardousElement.textContent = "YES";
        hazardousElement.className = "nasa-data-value hazardous";
    } else {
        hazardousElement.textContent = "NO";
        hazardousElement.className = "nasa-data-value safe";
    }
    // Orbit classification
    document.getElementById('nasaOrbitClass').textContent =
        nasaData.orbital_data?.orbit_class?.orbit_class_type || "N/A";
    // Close approach data
    if (nasaData.close_approach_data && nasaData.close_approach_data.length > 0) {
        const approach = nasaData.close_approach_data[0];
        document.getElementById('nasaCloseApproach').textContent = approach.close_approach_date;
        document.getElementById('nasaRelativeVelocity').textContent =
            Math.round(parseFloat(approach.relative_velocity.kilometers_per_second)) + " km/s";
        document.getElementById('nasaMissDistance').textContent =
            formatNumber(parseFloat(approach.miss_distance.kilometers)) + " km";
    } else {
        document.getElementById('nasaCloseApproach').textContent = "N/A";
        document.getElementById('nasaRelativeVelocity').textContent = "N/A";
        document.getElementById('nasaMissDistance').textContent = "N/A";
    }
}
// Sound generation functions
function createSound(frequency, duration, type = 'sine') {
    if (!soundEnabled) return;
    const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playLaunchSound() {
    // Rocket launch sound effect
    createSound(100, 0.5, 'sawtooth');
    setTimeout(() => createSound(150, 0.8, 'square'), 200);
    setTimeout(() => createSound(80, 1.2, 'triangle'), 500);
}

function playImpactSound() {
    // Massive explosion sound
    createSound(50, 2.0, 'sawtooth');
    setTimeout(() => createSound(30, 1.5, 'square'), 300);
    setTimeout(() => createSound(200, 0.8, 'triangle'), 800);
    setTimeout(() => createSound(100, 1.0, 'sawtooth'), 1200);
}

function playNavigationSound() {
    createSound(800, 0.1, 'sine');
}

// ================= Recording (MediaRecorder) =================
function setRecordingIndicator(on) {
    const el = document.getElementById('recordingIndicator');
    if (el) el.style.display = on ? 'flex' : 'none';
    const canvasIcon = document.getElementById('canvasRecordingIcon');
    if (canvasIcon) canvasIcon.style.display = on ? 'flex' : 'none';
}

function showToast(message) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = message;
    t.style.display = 'block';
    clearTimeout(t.__hideTimer);
    t.__hideTimer = setTimeout(() => {
        t.style.display = 'none';
    }, 4000);
}

function startEventRecording() {
    try {
        if (isRecording) return;
        const canvas = document.getElementById('earthCanvas');
        if (!canvas || !canvas.captureStream) {
            console.warn('Canvas captureStream not supported');
            return;
        }
        const stream = canvas.captureStream(30);
        const mimeTypes = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        let chosen = '';
        for (const mt of mimeTypes) {
            if (MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mt)) {
                chosen = mt; break;
            }
        }
        const options = chosen ? { mimeType: chosen } : undefined;
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
            try {
                const blob = new Blob(recordedChunks, { type: chosen || 'video/webm' });
                const url = URL.createObjectURL(blob);
                // Reveal download button
                const btn = document.getElementById('downloadRecordingBtn');
                if (btn) {
                    btn.href = url;
                    btn.download = `impact-simulation-${Date.now()}.webm`;
                    btn.style.display = 'inline-block';
                    // Auto-download the recording for convenience
                    setTimeout(() => {
                        try { btn.click(); } catch (_) {}
                    }, 250);
                    // Revoke URL later to free memory
                    setTimeout(() => { try { URL.revokeObjectURL(url); } catch(_){} }, 60000);
                }
                showToast('Recording ready. Click "Download Recording" to save.');
                setRecordingIndicator(false);
            } catch (err) {
                console.warn('Failed to create recording blob:', err);
            }
        };
        mediaRecorder.start();
        isRecording = true;
        console.log('Recording started');
        setRecordingIndicator(true);
        const btn = document.getElementById('downloadRecordingBtn');
        if (btn) btn.style.display = 'none';
    } catch (err) {
        console.warn('Recording start failed:', err);
    }
}

function stopEventRecording() {
    try {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            console.log('Recording stopped');
        }
        setRecordingIndicator(false);
    } catch (err) {
        console.warn('Recording stop failed:', err);
    }
}
// Initialize Three.js scene
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('earthCanvas'),
        antialias: true,
        alpha: true
    });
    const canvas = document.getElementById('earthCanvas');
    const rect = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    renderer.setClearColor(0x000011);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Add orbit controls for Earth navigation
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 30;
    controls.rotateSpeed = 0.5;
    // Create realistic Earth with NASA textures
    createNASAEarth();
    // Add enhanced realistic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Increased ambient light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    // Add additional light to illuminate the dark side of Earth
    const backLight = new THREE.DirectionalLight(0x223344, 0.4);
    backLight.position.set(-10, -5, -5);
    scene.add(backLight);
    // Add starfield background
    createStarfield();
    camera.position.z = 15;
    // Initialize asteroid preview
    initAsteroidPreview();
}

function initAsteroidPreview() {
    const previewCanvas = document.getElementById('asteroidPreview');
    previewScene = new THREE.Scene();
    previewCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    previewRenderer = new THREE.WebGLRenderer({
        canvas: previewCanvas,
        antialias: true,
        alpha: true
    });
    previewRenderer.setSize(120, 120);
    previewRenderer.setClearColor(0x000000, 0);
    // Add enhanced lighting to preview
    const previewLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    previewLight1.position.set(5, 5, 5);
    previewScene.add(previewLight1);
    const previewLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    previewLight2.position.set(-5, -5, -5);
    previewScene.add(previewLight2);
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    previewScene.add(ambientLight);
    // Add a point light to make the asteroid more visible
    const pointLight = new THREE.PointLight(0xffffff, 1, 10);
    pointLight.position.set(0, 0, 3);
    previewScene.add(pointLight);
    previewCamera.position.z = 3;
    // Create the initial asteroid preview
    createAsteroidPreview();
    // Start animation
    function animatePreview() {
        requestAnimationFrame(animatePreview);
        if (previewAsteroid) {
            previewAsteroid.rotation.x += 0.01;
            previewAsteroid.rotation.y += 0.01;
        }
        previewRenderer.render(previewScene, previewCamera);
    }
    animatePreview();
}

function createAsteroidPreview() {
    // Clear existing preview asteroid
    if (previewAsteroid) {
        previewScene.remove(previewAsteroid);
    }
    const asteroidData = asteroidDatabase[currentAsteroidIndex];
    let geometry;
    // Create realistic asteroid geometries with enhanced detail
    switch (asteroidData.shape) {
        case "spherical":
            geometry = createRealisticAsteroidGeometry(1, 0.1, 0.3);
            break;
        case "elongated":
            geometry = createRealisticAsteroidGeometry(1, 0.2, 0.3, 1.5, 0.8, 0.8);
            break;
        case "diamond":
            geometry = createRealisticAsteroidGeometry(1, 0.15, 0.4, 1, 1, 1, 'diamond');
            break;
        case "potato":
            geometry = createRealisticAsteroidGeometry(1, 0.3, 0.5);
            break;
        case "irregular":
            geometry = createRealisticAsteroidGeometry(1, 0.4, 0.6);
            break;
        case "peanut":
            geometry = createRealisticAsteroidGeometry(1, 0.2, 0.4, 1.2, 0.6, 0.6, 'peanut');
            break;
        case "oblong":
            geometry = createRealisticAsteroidGeometry(1, 0.2, 0.4, 1.8, 0.5, 0.5);
            break;
        case "bennu":
            geometry = createRealisticAsteroidGeometry(1, 0.25, 0.4, 1.1, 0.9, 0.8, 'bennu');
            break;
        case "ryugu":
            geometry = createRealisticAsteroidGeometry(1, 0.3, 0.5, 1.2, 1.1, 0.9, 'ryugu');
            break;
        default:
            geometry = createRealisticAsteroidGeometry(1, 0.1, 0.3);
    }
    // Create material based on asteroid type with enhanced visibility
    let material;
    switch (asteroidData.type) {
        case "rocky":
            material = new THREE.MeshPhongMaterial({
                color: 0x8B4513,
                shininess: 30,
                specular: 0x886644,
                emissive: 0x221100, // Slight emissive to make it more visible
                emissiveIntensity: 0.2
            });
            break;
        case "metallic":
            material = new THREE.MeshPhongMaterial({
                color: 0x888888,
                shininess: 50,
                specular: 0xffffff,
                emissive: 0x222222,
                emissiveIntensity: 0.3
            });
            break;
        case "carbonaceous":
            material = new THREE.MeshPhongMaterial({
                color: 0x2F4F4F,
                shininess: 20,
                specular: 0x444444,
                emissive: 0x112211,
                emissiveIntensity: 0.2
            });
            break;
        case "icy":
            material = new THREE.MeshPhongMaterial({
                color: 0xE6E6FA,
                shininess: 60,
                specular: 0xffffff,
                emissive: 0x222244,
                emissiveIntensity: 0.3
            });
            break;
        default:
            material = new THREE.MeshPhongMaterial({
                color: 0x808080,
                shininess: 30,
                specular: 0x666666,
                emissive: 0x222222,
                emissiveIntensity: 0.2
            });
    }
    previewAsteroid = new THREE.Mesh(geometry, material);
    previewScene.add(previewAsteroid);
}

function createNASAEarth() {
    const textureLoader = new THREE.TextureLoader();
    // Load NASA Earth textures
    const earthTexture = textureLoader.load(textureUrls.earth);
    const bumpMap = textureLoader.load(textureUrls.normal);
    const specularMap = textureLoader.load(textureUrls.specular);
    const cloudsTexture = textureLoader.load(textureUrls.clouds);
    const lightsTexture = textureLoader.load(textureUrls.lights);
    // Earth geometry with more segments for better detail
    const earthGeometry = new THREE.SphereGeometry(5, 128, 128);
    // Earth material with enhanced realism and better illumination
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        specularMap: specularMap,
        specular: new THREE.Color(0x444444), // Increased specular
        shininess: 15, // Increased shininess
        emissive: new THREE.Color(0x111122), // Added emissive for better dark side visibility
        emissiveIntensity: 0.1
    });
    earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
    // Create atmosphere
    createAtmosphere();
    // Create cloud layer
    createCloudLayer(cloudsTexture);
    // Create night lights layer
    createNightLightsLayer(lightsTexture);
}

function createAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(5.1, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x7ec0ee,
        transparent: true,
        opacity: 0.15, // Slightly increased opacity
        side: THREE.BackSide,
        emissive: 0x223344, // Added emissive for better visibility
        emissiveIntensity: 0.1
    });
    atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);
}

function createCloudLayer(cloudsTexture) {
    const cloudGeometry = new THREE.SphereGeometry(5.05, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: 0.5, // Increased opacity for better visibility
        depthWrite: false,
        emissive: 0x222222, // Added emissive
        emissiveIntensity: 0.1
    });
    cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(cloudMesh);
}

function createNightLightsLayer(lightsTexture) {
    const lightsGeometry = new THREE.SphereGeometry(5.01, 64, 64);
    const lightsMaterial = new THREE.MeshBasicMaterial({
        map: lightsTexture,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8 // Increased opacity for better visibility
    });
    nightLightsMesh = new THREE.Mesh(lightsGeometry, lightsMaterial);
    scene.add(nightLightsMesh);
}

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        sizeAttenuation: false
    });
    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

function updateImpactMarker() {
    // Remove existing marker
    if (impactMarker) {
        scene.remove(impactMarker);
    }
    // Create new impact marker
    const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff1744,
        emissive: 0xff1744,
        emissiveIntensity: 0.8 // Increased emissive intensity
    });
    impactMarker = new THREE.Mesh(markerGeometry, markerMaterial);
    // Position marker on Earth surface
    updateImpactMarkerPosition();
    scene.add(impactMarker);
}

function updateImpactMarkerPosition() {
    if (!impactMarker) return;
    const phi = (90 - targetLat) * Math.PI / 180;
    const theta = (targetLon + 180) * Math.PI / 180;
    const x = 5.1 * Math.sin(phi) * Math.cos(theta);
    const y = 5.1 * Math.cos(phi);
    const z = 5.1 * Math.sin(phi) * Math.sin(theta);
    impactMarker.position.set(x, y, z);
}

// ================= USGS Data Integration =================
function initUSGSService() {
    try {
        usgsService = new USGSDataService();
        console.log('USGS Data Service initialized successfully');
        
        // Load USGS data for current target location
        loadUSGSDataForLocation(targetLat, targetLon);
    } catch (error) {
        console.warn('Failed to initialize USGS Data Service:', error);
        usgsService = null;
    }
}

async function loadUSGSDataForLocation(lat, lon) {
    if (!usgsService) return;
    
    try {
        const currentAsteroid = asteroidDatabase[currentAsteroidIndex];
        const asteroidData = {
            ...currentAsteroid,
            lat: lat,
            lon: lon
        };
        
        usgsData = await usgsService.calculateEnhancedImpactConsequences(asteroidData, lat, lon);
        console.log('USGS data loaded for location:', lat, lon);
        
        // Update UI with enhanced data
        updateEnhancedImpactDisplay();
    } catch (error) {
        console.warn('Failed to load USGS data:', error);
    }
}

function updateEnhancedImpactDisplay() {
    if (!usgsData) return;
    
    const { enhancedConsequences } = usgsData;
    const { tsunami, seismic, crater, environmental, economic } = enhancedConsequences;
    
    // Update existing impact calculations with USGS data
    updateImpactCalculationsWithUSGS(tsunami, seismic, crater);
    
    // Add new UI elements for enhanced data
    addUSGSDataToUI(tsunami, seismic, crater, environmental, economic);
}

function updateImpactCalculationsWithUSGS(tsunami, seismic, crater) {
    // Update crater diameter with terrain-adjusted values
    const craterElement = document.getElementById('craterDiameter');
    if (craterElement && crater.diameter) {
        craterElement.textContent = formatNumber(crater.diameter) + ' km (terrain-adjusted)';
    }
    
    // Update seismic radius with enhanced calculations
    const seismicElement = document.getElementById('seismicRadius');
    if (seismicElement && seismic.damageRadius) {
        seismicElement.textContent = formatNumber(seismic.damageRadius) + ' km (seismic hazard-adjusted)';
    }
    
    // Add tsunami information if coastal
    if (tsunami.waveHeight > 0) {
        addTsunamiInfo(tsunami);
    }
}

function addTsunamiInfo(tsunami) {
    // Check if tsunami info already exists
    let tsunamiElement = document.getElementById('tsunamiInfo');
    if (!tsunamiElement) {
        tsunamiElement = document.createElement('div');
        tsunamiElement.id = 'tsunamiInfo';
        tsunamiElement.className = 'impact-info-item';
        tsunamiElement.innerHTML = '<h4>🌊 Tsunami Impact</h4>';
        
        // Insert after seismic radius
        const seismicElement = document.getElementById('seismicRadius');
        if (seismicElement && seismicElement.parentNode) {
            seismicElement.parentNode.insertBefore(tsunamiElement, seismicElement.nextSibling);
        }
    }
    
    tsunamiElement.innerHTML = `
        <h4>🌊 Tsunami Impact</h4>
        <p><strong>Wave Height:</strong> ${formatNumber(tsunami.waveHeight)} m</p>
        <p><strong>Runup Distance:</strong> ${formatNumber(tsunami.runupDistance)} km</p>
        <p><strong>Affected Area:</strong> ${formatNumber(tsunami.affectedArea)} km²</p>
        <p><strong>Evacuation Radius:</strong> ${formatNumber(tsunami.evacuationRadius)} km</p>
    `;
}

function addUSGSDataToUI(tsunami, seismic, crater, environmental, economic) {
    // Create or update USGS data panel
    let usgsPanel = document.getElementById('usgsDataPanel');
    if (!usgsPanel) {
        usgsPanel = document.createElement('div');
        usgsPanel.id = 'usgsDataPanel';
        usgsPanel.className = 'usgs-data-panel';
        usgsPanel.innerHTML = '<h3>🗺️ USGS Enhanced Analysis</h3>';
        
        // Insert after impact assessment
        const impactAssessment = document.getElementById('impactAssessment');
        if (impactAssessment && impactAssessment.parentNode) {
            impactAssessment.parentNode.insertBefore(usgsPanel, impactAssessment.nextSibling);
        }
    }
    
    usgsPanel.innerHTML = `
        <h3>🗺️ USGS Enhanced Analysis</h3>
        <div class="usgs-data-grid">
            <div class="usgs-data-section">
                <h4>🏔️ Terrain Analysis</h4>
                <p><strong>Elevation:</strong> ${usgsData.elevation.averageElevation.toFixed(0)} m</p>
                <p><strong>Terrain Slope:</strong> ${usgsData.elevation.slope.toFixed(1)}°</p>
                <p><strong>Crater Complexity:</strong> ${crater.complexity}</p>
            </div>
            <div class="usgs-data-section">
                <h4>🌍 Seismic Hazard</h4>
                <p><strong>Magnitude:</strong> ${seismic.magnitude.toFixed(1)}</p>
                <p><strong>Ground Acceleration:</strong> ${(seismic.groundAcceleration/9.81).toFixed(2)}g</p>
                <p><strong>Building Damage:</strong> ${seismic.buildingDamage}</p>
                <p><strong>Liquefaction Risk:</strong> ${seismic.liquefactionRisk}</p>
            </div>
            <div class="usgs-data-section">
                <h4>🌊 Coastal Impact</h4>
                <p><strong>Coastal Distance:</strong> ${usgsData.coastal.coastalDistance.toFixed(0)} km</p>
                <p><strong>Tsunami Height:</strong> ${tsunami.waveHeight.toFixed(1)} m</p>
                <p><strong>Coastal Vulnerability:</strong> ${(tsunami.coastalVulnerability * 100).toFixed(0)}%</p>
            </div>
            <div class="usgs-data-section">
                <h4>🌱 Environmental Impact</h4>
                <p><strong>Ecosystem Damage:</strong> ${formatNumber(environmental.ecosystemDamage)} km²</p>
                <p><strong>Water Contamination:</strong> ${formatNumber(environmental.waterContamination)} km²</p>
                <p><strong>Biodiversity Loss:</strong> ${formatNumber(environmental.biodiversityLoss)} km²</p>
            </div>
            <div class="usgs-data-section">
                <h4>💰 Economic Impact</h4>
                <p><strong>Total Damage:</strong> $${formatNumber(economic.totalDamage)}</p>
                <p><strong>Infrastructure:</strong> $${formatNumber(economic.infrastructureDamage)}</p>
                <p><strong>Recovery Time:</strong> ${economic.recoveryTime.toFixed(1)} years</p>
            </div>
        </div>
    `;
}

// ================= Leaflet 2D Map =================
function initMap2D() {
    try {
        const el = document.getElementById('map2d');
        if (!el || typeof L === 'undefined') return; // Leaflet not loaded or container missing
        // Initialize map
        map2d = L.map('map2d', {
            center: [targetLat, targetLon],
            zoom: 3,
            minZoom: 2,
            maxZoom: 18,
            worldCopyJump: true
        });
        // OSM tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map2d);
        // Marker
        map2dMarker = L.marker([targetLat, targetLon], { draggable: false }).addTo(map2d);
        // Click to set target
        map2d.on('click', (e) => {
            targetLat = e.latlng.lat;
            targetLon = e.latlng.lng;
            updateLocationDisplay();
            updateImpactMarker();
            updateMapMarkerPosition();
            // Update AI with new location
            if (typeof updateAIRiskAdvisor === 'function') {
                updateAIRiskAdvisor();
            }
            // Reload USGS data for new location
            loadUSGSDataForLocation(targetLat, targetLon);
        });
        // Ensure correct size if panel was hidden initially
        setTimeout(() => map2d.invalidateSize(), 200);
        updateMapMarkerPosition();
    } catch (err) {
        console.warn('Map2D init failed:', err);
    }
}

function updateMapMarkerPosition() {
    if (!map2d || !map2dMarker) return;
    map2dMarker.setLatLng([targetLat, targetLon]);
    // Keep map view centered around marker at current zoom
    // Do not jump aggressively if user is panning; use panTo for smoothness
    map2d.panTo([targetLat, targetLon], { animate: true, duration: 0.4 });
}

function createExplosionEffect() {
    // Calculate impact coordinates from targetLat/targetLon (degrees)
    const phi = (90 - targetLat) * Math.PI / 180;
    const theta = (targetLon + 180) * Math.PI / 180;
    const impactX = 5.1 * Math.sin(phi) * Math.cos(theta);
    const impactY = 5.1 * Math.cos(phi);
    const impactZ = 5.1 * Math.sin(phi) * Math.sin(theta);
    
    // Create visible asteroid approaching Earth
    const asteroid = asteroidDatabase[currentAsteroidIndex];
    createApproachingAsteroid(impactX, impactY, impactZ, asteroid);
    
    // Create asteroid fragmentation after a delay
    setTimeout(() => {
        createAsteroidFragmentation(impactX, impactY, impactZ, asteroid);
    }, 2000);
    // -------------------------
    // FIREBALL CORE (glowing sphere that expands & fades)
    // -------------------------
    const fireballGeometry = new THREE.SphereGeometry(0.08, 32, 32);
    const fireballMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa33,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
    });
    const fireball = new THREE.Mesh(fireballGeometry, fireballMaterial);
    fireball.position.set(impactX, impactY, impactZ);
    scene.add(fireball);
    let fireballScale = 0.12;
    (function animateFireball() {
        fireballScale += 0.28;
        fireball.scale.set(fireballScale, fireballScale, fireballScale);
        fireball.material.opacity *= 0.95;
        if (fireball.material.opacity > 0.02) {
            requestAnimationFrame(animateFireball);
        } else {
            scene.remove(fireball);
        }
    })();
    // -------------------------
    // EXPLOSION PARTICLES (incandescent gas + sparks)
    // -------------------------
    const particleCount = 1200;
    const particles = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    const colors = [];
    const sizes = [];
    for (let i = 0; i < particleCount; i++) {
        positions.push(impactX, impactY, impactZ);
        // Direction biased upward + radial
        const dir = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            Math.random() * 1.6 + 0.2,
            (Math.random() - 0.5) * 2
        ).normalize();
        // Speed in scene units per frame (matches existing updater which sums directly)
        const speed = 0.04 + Math.random() * 0.18;
        const v = dir.multiplyScalar(speed);
        velocities.push(v.x, v.y, v.z);
        // Fire color gradient: white-hot -> yellow/orange -> red
        const r = Math.random();
        if (r < 0.25) {
            colors.push(1.0, 1.0, 1.0);
        } // white-hot core
        else if (r < 0.65) {
            colors.push(1.0, 0.85, 0.2);
        } // yellow/orange
        else {
            colors.push(0.85, 0.25, 0.1);
        } // red
        sizes.push(0.12 + Math.random() * 0.22);
    }
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    const explosionSystem = new THREE.Points(particles, particleMaterial);
    scene.add(explosionSystem);
    explosionParticles.push({
        system: explosionSystem,
        velocities: velocities,
        life: 0,
        maxLife: 6.0, // longer-lived fire cloud
        type: 'explosion'
    });
    // -------------------------
    // DEBRIS CLOUD (visible asteroid pieces)
    // -------------------------
    createDebrisCloud(impactX, impactY, impactZ, asteroid);
    
    // -------------------------
    // DEBRIS CHUNKS (rock fragments via existing helper)
    // -------------------------
    if (typeof createDebrisField === 'function') {
        createDebrisField(400, 3.8);
    }
    // -------------------------
    // SHOCKWAVE + ATMOSPHERIC FLASH (existing helpers animate themselves)
    // -------------------------
    if (typeof createShockwaveRings === 'function') {
        createShockwaveRings(impactX, impactY, impactZ);
    }
    if (typeof createAtmosphericDisturbance === 'function') {
        createAtmosphericDisturbance();
    }
    if (typeof createCraterEffect === 'function') {
        createCraterEffect();
    }
    // -------------------------
    // AUDIO + CAMERA SHAKE
    // -------------------------
    if (typeof playImpactSound === 'function') playImpactSound();
    if (typeof createCameraShake === 'function') createCameraShake();
}

// Create debris cloud from asteroid fragments
function createDebrisCloud(impactX, impactY, impactZ, asteroid) {
    const debrisCount = 50; // Number of visible debris pieces
    const debrisGroup = new THREE.Group();
    
    for (let i = 0; i < debrisCount; i++) {
        // Create small asteroid fragments
        const fragmentSize = Math.random() * 0.05 + 0.02;
        const fragmentGeometry = createRealisticAsteroidGeometry(
            fragmentSize, 0.3, 0.4, 
            Math.random() * 0.5 + 0.5, 
            Math.random() * 0.5 + 0.5, 
            Math.random() * 0.5 + 0.5,
            'irregular'
        );
        
        const fragmentMaterial = new THREE.MeshPhongMaterial({
            color: asteroid.type === 'rocky' ? 0x8B4513 : 
                   asteroid.type === 'metallic' ? 0x888888 :
                   asteroid.type === 'carbonaceous' ? 0x2F4F4F : 0xE6E6FA,
            shininess: 20,
            emissive: 0x111111,
            emissiveIntensity: 0.1
        });
        
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        
        // Random position around impact point
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 0.3 + 0.1;
        fragment.position.set(
            impactX + Math.cos(angle) * distance,
            impactY + Math.random() * 0.2,
            impactZ + Math.sin(angle) * distance
        );
        
        // Random rotation
        fragment.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Random velocity
        fragment.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                Math.random() * 0.05 + 0.02,
                (Math.random() - 0.5) * 0.1
            ),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ),
            lifetime: Math.random() * 5 + 3
        };
        
        debrisGroup.add(fragment);
    }
    
    scene.add(debrisGroup);
    
    // Animate debris
    let debrisTime = 0;
    (function animateDebris() {
        debrisTime += 0.016;
        
        debrisGroup.children.forEach(fragment => {
            const userData = fragment.userData;
            
            // Update position
            fragment.position.add(userData.velocity);
            
            // Update rotation
            fragment.rotation.x += userData.rotationSpeed.x;
            fragment.rotation.y += userData.rotationSpeed.y;
            fragment.rotation.z += userData.rotationSpeed.z;
            
            // Apply gravity
            userData.velocity.y -= 0.01;
            
            // Apply air resistance
            userData.velocity.multiplyScalar(0.995);
            
            // Update lifetime
            userData.lifetime -= 0.016;
            
            // Fade out
            const lifeRatio = Math.max(0, userData.lifetime / 5);
            fragment.material.opacity = lifeRatio;
            fragment.material.transparent = true;
        });
        
        // Remove expired debris
        debrisGroup.children = debrisGroup.children.filter(fragment => 
            fragment.userData.lifetime > 0
        );
        
        if (debrisGroup.children.length > 0) {
            requestAnimationFrame(animateDebris);
        } else {
            scene.remove(debrisGroup);
        }
    })();
}

function createApproachingAsteroid(impactX, impactY, impactZ, asteroid) {
    // Create visible asteroid approaching Earth
    const asteroidGeometry = createRealisticAsteroidGeometry(
        Math.min(asteroid.diameter / 1000, 0.3), // Scale down for visibility
        0.2, 0.3, 1, 1, 1, asteroid.shape
    );
    
    const asteroidMaterial = new THREE.MeshPhongMaterial({
        color: asteroid.type === 'rocky' ? 0x8B4513 : 
               asteroid.type === 'metallic' ? 0x888888 :
               asteroid.type === 'carbonaceous' ? 0x2F4F4F : 0xE6E6FA,
        shininess: 30,
        emissive: 0x222222,
        emissiveIntensity: 0.2
    });
    
    const asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    
    // Start asteroid from a distance
    const startDistance = 15;
    const approachDirection = new THREE.Vector3(impactX, impactY, impactZ).normalize();
    asteroidMesh.position.copy(approachDirection.multiplyScalar(startDistance));
    
    scene.add(asteroidMesh);
    
    // Animate asteroid approach
    const approachDuration = 3000; // 3 seconds
    const startTime = Date.now();
    
    const animateApproach = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / approachDuration, 1);
        
        // Move asteroid towards impact point
        const currentPos = new THREE.Vector3(impactX, impactY, impactZ);
        const startPos = approachDirection.clone().multiplyScalar(startDistance);
        asteroidMesh.position.lerpVectors(startPos, currentPos, progress);
        
        // Rotate asteroid as it approaches
        asteroidMesh.rotation.x += 0.02;
        asteroidMesh.rotation.y += 0.02;
        asteroidMesh.rotation.z += 0.01;
        
        // Add glow effect as it approaches
        const glowIntensity = 1 + Math.sin(elapsed * 0.01) * 0.3;
        asteroidMaterial.emissiveIntensity = glowIntensity * 0.3;
        
        // Scale up slightly as it gets closer (perspective effect)
        const scale = 1 + progress * 0.5;
        asteroidMesh.scale.setScalar(scale);
        
        if (progress < 1) {
            requestAnimationFrame(animateApproach);
        } else {
            // Asteroid has reached impact point - remove it
            scene.remove(asteroidMesh);
        }
    };
    
    animateApproach();
}

function createAsteroidFragmentation(impactX, impactY, impactZ, asteroid) {
    // Create asteroid breaking into smaller pieces
    const fragmentCount = Math.min(20, Math.max(5, Math.floor(asteroid.diameter / 100)));
    const fragments = [];
    
    for (let i = 0; i < fragmentCount; i++) {
        // Create smaller asteroid fragments
        const fragmentSize = Math.random() * 0.1 + 0.05;
        const fragmentGeometry = createRealisticAsteroidGeometry(
            fragmentSize, 0.3, 0.4, 1, 1, 1, asteroid.shape
        );
        
        const fragmentMaterial = new THREE.MeshPhongMaterial({
            color: asteroid.type === 'rocky' ? 0x8B4513 : 
                   asteroid.type === 'metallic' ? 0x888888 :
                   asteroid.type === 'carbonaceous' ? 0x2F4F4F : 0xE6E6FA,
            shininess: 30,
            emissive: 0x444444,
            emissiveIntensity: 0.3
        });
        
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        fragment.position.set(impactX, impactY, impactZ);
        
        // Random rotation
        fragment.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        scene.add(fragment);
        fragments.push(fragment);
    }
    
    // Animate fragments flying away
    const animationDuration = 4000; // 4 seconds
    const startTime = Date.now();
    
    const animateFragments = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        fragments.forEach((fragment, index) => {
            // Random velocity for each fragment
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                Math.random() * 0.2 + 0.1,
                (Math.random() - 0.5) * 0.3
            );
            
            // Move fragment
            fragment.position.add(velocity);
            
            // Rotate fragment
            fragment.rotation.x += 0.05;
            fragment.rotation.y += 0.05;
            fragment.rotation.z += 0.03;
            
            // Fade out over time
            fragment.material.opacity = 1 - progress;
            fragment.material.transparent = true;
            
            // Scale down over time
            const scale = 1 - progress * 0.5;
            fragment.scale.setScalar(scale);
        });
        
        if (progress < 1) {
            requestAnimationFrame(animateFragments);
        } else {
            // Remove fragments
            fragments.forEach(fragment => {
                scene.remove(fragment);
            });
        }
    };
    
    animateFragments();
}

// Enhanced AI Avatar with mouse and hands
function enhanceAIAvatar() {
    const avatarContainer = document.querySelector('.ai-avatar-container');
    if (!avatarContainer) return;
    
    // Add enhanced class
    avatarContainer.classList.add('enhanced');
    
    
    // Add tutorial system
    addTutorialSystem();
    
    // Start interactive animations
    startAvatarAnimations();
}

// Add tutorial system for new users
function addTutorialSystem() {
    const avatarContainer = document.querySelector('.ai-avatar-container');
    if (!avatarContainer) return;
    
    // Check if user is new (no tutorial completed)
    const tutorialCompleted = localStorage.getItem('asteroidTutorialCompleted');
    if (tutorialCompleted) return;
    
    // Add tutorial overlay
    const tutorialOverlay = document.createElement('div');
    tutorialOverlay.className = 'tutorial-overlay';
    tutorialOverlay.id = 'tutorialOverlay';
    tutorialOverlay.innerHTML = `
        <div class="tutorial-content">
            <div class="tutorial-header">
                <h3>🤖 Welcome to the Asteroid Impact Simulator!</h3>
                <button class="tutorial-close" onclick="closeTutorial()">×</button>
            </div>
            <div class="tutorial-body">
                <p>I'm your AI assistant! Let me guide you through the features:</p>
                <div class="tutorial-steps">
                    <div class="tutorial-step active" data-step="1">
                        <div class="step-icon">☄️</div>
                        <div class="step-content">
                            <h4>Choose an Asteroid</h4>
                            <p>Select from real NASA asteroids or create your own!</p>
                        </div>
                    </div>
                    <div class="tutorial-step" data-step="2">
                        <div class="step-icon">🌍</div>
                        <div class="step-content">
                            <h4>Pick Impact Location</h4>
                            <p>Click on the 2D map or use the dropdown to select a target.</p>
                        </div>
                    </div>
                    <div class="tutorial-step" data-step="3">
                        <div class="step-icon">🚀</div>
                        <div class="step-content">
                            <h4>Launch Simulation</h4>
                            <p>Click "LAUNCH ASTEROID" to see the impact simulation!</p>
                        </div>
                    </div>
                    <div class="tutorial-step" data-step="4">
                        <div class="step-icon">📊</div>
                        <div class="step-content">
                            <h4>Analyze Results</h4>
                            <p>View detailed impact analysis and damage assessment.</p>
                        </div>
                    </div>
                </div>
                <div class="tutorial-navigation">
                    <button class="tutorial-btn prev" onclick="previousTutorialStep()" disabled>Previous</button>
                    <button class="tutorial-btn next" onclick="nextTutorialStep()">Next</button>
                    <button class="tutorial-btn skip" onclick="skipTutorial()">Skip Tutorial</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(tutorialOverlay);
    
    // Start tutorial narration
    setTimeout(() => {
        startTutorialNarration();
    }, 1000);
}

// Start avatar animations
function startAvatarAnimations() {
    const avatarContainer = document.querySelector('.ai-avatar-container');
    if (!avatarContainer) return;
    
    // Simple breathing animation for the avatar
    setInterval(() => {
        avatarContainer.style.transform = 'scale(1.05)';
        setTimeout(() => {
            avatarContainer.style.transform = 'scale(1)';
        }, 1000);
    }, 3000);
}

// Tutorial system functions
let currentTutorialStep = 1;
const totalTutorialSteps = 4;

function nextTutorialStep() {
    if (currentTutorialStep < totalTutorialSteps) {
        // Remove active class from current step
        const currentStep = document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`);
        if (currentStep) {
            currentStep.classList.remove('active');
        }
        
        currentTutorialStep++;
        
        // Add active class to next step
        const nextStep = document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`);
        if (nextStep) {
            nextStep.classList.add('active');
        }
        
        // Update navigation buttons
        updateTutorialNavigation();
        
        // Highlight relevant UI element
        highlightTutorialElement(currentTutorialStep);
        
        // Narrate step
        narrateTutorialStep(currentTutorialStep);
    }
}

function previousTutorialStep() {
    if (currentTutorialStep > 1) {
        // Remove active class from current step
        const currentStep = document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`);
        if (currentStep) {
            currentStep.classList.remove('active');
        }
        
        currentTutorialStep--;
        
        // Add active class to previous step
        const prevStep = document.querySelector(`.tutorial-step[data-step="${currentTutorialStep}"]`);
        if (prevStep) {
            prevStep.classList.add('active');
        }
        
        // Update navigation buttons
        updateTutorialNavigation();
        
        // Highlight relevant UI element
        highlightTutorialElement(currentTutorialStep);
        
        // Narrate step
        narrateTutorialStep(currentTutorialStep);
    }
}

function updateTutorialNavigation() {
    const prevBtn = document.querySelector('.tutorial-btn.prev');
    const nextBtn = document.querySelector('.tutorial-btn.next');
    
    if (prevBtn) {
        prevBtn.disabled = currentTutorialStep === 1;
    }
    
    if (nextBtn) {
        nextBtn.textContent = currentTutorialStep === totalTutorialSteps ? 'Finish' : 'Next';
    }
}

function highlightTutorialElement(step) {
    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    let targetElement = null;
    
    switch (step) {
        case 1:
            targetElement = document.querySelector('.asteroid-section');
            break;
        case 2:
            targetElement = document.querySelector('.impact-section');
            break;
        case 3:
            targetElement = document.querySelector('#launchBtn');
            break;
        case 4:
            targetElement = document.querySelector('.impact-results-panel');
            break;
    }
    
    if (targetElement) {
        targetElement.classList.add('tutorial-highlight');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function narrateTutorialStep(step) {
    const messages = {
        1: "Welcome! Let's start by choosing an asteroid. You can select from real NASA asteroids or create your own custom one.",
        2: "Now pick where you want the asteroid to impact. You can click on the 2D map or use the dropdown menu.",
        3: "Perfect! Now click the 'LAUNCH ASTEROID' button to start the simulation and watch the impact!",
        4: "Great! After the impact, you'll see detailed analysis results. I can narrate the findings for you."
    };
    
    const message = messages[step];
    if (message && audioEnabled) {
        speakText(message);
    }
}

function startTutorialNarration() {
    if (audioEnabled) {
        speakText("Welcome to the Asteroid Impact Simulator! I'm your AI assistant and I'll guide you through the features. Let's start with step one - choosing an asteroid.");
    }
}

function closeTutorial() {
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    if (tutorialOverlay) {
        tutorialOverlay.remove();
    }
    
    // Mark tutorial as completed
    localStorage.setItem('asteroidTutorialCompleted', 'true');
}

function skipTutorial() {
    closeTutorial();
}

function highlightTextDuringNarration(text, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Split text into words
    const words = text.split(' ');
    let currentWordIndex = 0;
    
    const highlightNextWord = () => {
        if (currentWordIndex < words.length) {
            // Remove previous highlights
            element.querySelectorAll('.highlight-word').forEach(word => {
                word.classList.remove('active');
            });
            
            // Highlight current word
            const wordElements = element.querySelectorAll('.highlight-word');
            if (wordElements[currentWordIndex]) {
                wordElements[currentWordIndex].classList.add('active');
            }
            
            currentWordIndex++;
            setTimeout(highlightNextWord, 200); // Highlight next word after 200ms
        }
    };
    
    // Wrap words in highlight spans
    const wrappedText = words.map(word => `<span class="highlight-word">${word}</span>`).join(' ');
    element.innerHTML = wrappedText;
    
    // Start highlighting
    highlightNextWord();
}

function createTextHighlighting(text, targetElement) {
    const words = text.split(' ');
    const highlightedText = words.map(word => `<span class="highlight-word">${word}</span>`).join(' ');
    targetElement.innerHTML = highlightedText;
    
    // Animate highlighting
    const wordElements = targetElement.querySelectorAll('.highlight-word');
    let currentIndex = 0;
    
    const highlightInterval = setInterval(() => {
        if (currentIndex < wordElements.length) {
            // Remove previous active highlight
            wordElements.forEach(word => word.classList.remove('active'));
            
            // Add active highlight to current word
            wordElements[currentIndex].classList.add('active');
            currentIndex++;
        } else {
            clearInterval(highlightInterval);
        }
    }, 300);
}

// AI Quick Explanations for new users
function addAIQuickExplanations() {
    // Add tooltips to buttons for new users
    const buttons = [
        { selector: '.custom-asteroid-btn', explanation: 'Create your own custom asteroid with unique properties and save it with your name!' },
        { selector: '.city-zoom-btn', explanation: 'Zoom in to see detailed city damage analysis and impact statistics!' },
        { selector: '.discover-btn', explanation: 'Learn the fascinating story and scientific significance of this asteroid!' },
        { selector: '#launchBtn', explanation: 'Launch the asteroid simulation to see the impact in real-time!' },
        { selector: '.deflection-btn', explanation: 'Try different mitigation strategies to deflect the asteroid!' }
    ];
    
    buttons.forEach(button => {
        const element = document.querySelector(button.selector);
        if (element) {
            element.addEventListener('mouseenter', () => {
                showAIExplanation(button.explanation, element);
            });
            
            element.addEventListener('mouseleave', () => {
                hideAIExplanation();
            });
        }
    });
}

function showAIExplanation(text, targetElement) {
    // Remove existing explanation
    hideAIExplanation();
    
    // Create explanation bubble
    const explanation = document.createElement('div');
    explanation.className = 'ai-explanation-bubble';
    explanation.innerHTML = `
        <div class="explanation-content">
            <div class="ai-avatar-mini">🤖</div>
            <div class="explanation-text">${text}</div>
        </div>
    `;
    
    // Position near target element
    const rect = targetElement.getBoundingClientRect();
    explanation.style.position = 'fixed';
    explanation.style.left = `${rect.left + rect.width / 2}px`;
    explanation.style.top = `${rect.top - 10}px`;
    explanation.style.transform = 'translateX(-50%) translateY(-100%)';
    explanation.style.zIndex = '9999';
    
    document.body.appendChild(explanation);
    
    // Add animation
    setTimeout(() => {
        explanation.classList.add('show');
    }, 10);
}

function hideAIExplanation() {
    const existing = document.querySelector('.ai-explanation-bubble');
    if (existing) {
        existing.classList.add('hide');
        setTimeout(() => {
            if (existing.parentNode) {
                existing.parentNode.removeChild(existing);
            }
        }, 300);
    }
}

function closeWelcomeModal() {
    const modal = document.querySelector('.welcome-modal');
    if (modal) {
        modal.remove();
    }
}

// My City Impact Feature
function showMyCityImpact() {
    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                createMyCityImpactModal(lat, lon);
            },
            (error) => {
                // Fallback to manual location input
                createMyCityImpactModal(null, null);
            }
        );
    } else {
        // Fallback to manual location input
        createMyCityImpactModal(null, null);
    }
}

function createMyCityImpactModal(lat, lon) {
    const modal = document.createElement('div');
    modal.className = 'my-city-modal';
    modal.id = 'myCityModal';
    
    const locationText = lat && lon ? 
        `📍 Your Location: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°W` : 
        '📍 Please enter your location manually';
    
    modal.innerHTML = `
        <div class="my-city-content">
            <div class="my-city-header">
                <h2>🏠 What if it hits my city?</h2>
                <button class="close-story" onclick="closeMyCityModal()">×</button>
            </div>
            <div class="my-city-body">
                <div class="location-info">
                    <h3>${locationText}</h3>
                    ${!lat || !lon ? `
                        <div class="manual-location">
                            <input type="text" id="cityName" placeholder="Enter your city name" style="width: 100%; padding: 10px; margin: 10px 0; border-radius: 5px; border: 1px solid #4a90e2; background: rgba(45, 90, 135, 0.3); color: #e2e8f0;">
                            <button class="btn primary" onclick="getCityCoordinates()">Get Coordinates</button>
                        </div>
                    ` : ''}
                </div>
                <div class="impact-preview">
                    <div class="impact-visualization">
                        <canvas id="myCityCanvas" width="300" height="200"></canvas>
                    </div>
                    <div class="impact-stats">
                        <h4>Local Impact Analysis</h4>
                        <div class="stat-item">
                            <span class="stat-label">Distance from Impact:</span>
                            <span class="stat-value" id="distanceFromImpact">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Damage Level:</span>
                            <span class="stat-value" id="damageLevel">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Evacuation Required:</span>
                            <span class="stat-value" id="evacuationStatus">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Survival Probability:</span>
                            <span class="stat-value" id="survivalProbability">-</span>
                        </div>
                    </div>
                </div>
                <div class="impact-recommendations">
                    <h4>Safety Recommendations</h4>
                    <div id="safetyRecommendations">
                        <p>Calculating safety recommendations based on your location...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Calculate impact for user's location
    if (lat && lon) {
        calculateMyCityImpact(lat, lon);
    }
}

function getCityCoordinates() {
    const cityName = document.getElementById('cityName').value;
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    
    // Use a geocoding service (simplified - in real app, use proper geocoding API)
    const cityCoordinates = {
        'New York': { lat: 40.7128, lon: -74.0060 },
        'Los Angeles': { lat: 34.0522, lon: -118.2437 },
        'Chicago': { lat: 41.8781, lon: -87.6298 },
        'Houston': { lat: 29.7604, lon: -95.3698 },
        'Phoenix': { lat: 33.4484, lon: -112.0740 },
        'Philadelphia': { lat: 39.9526, lon: -75.1652 },
        'San Antonio': { lat: 29.4241, lon: -98.4936 },
        'San Diego': { lat: 32.7157, lon: -117.1611 },
        'Dallas': { lat: 32.7767, lon: -96.7970 },
        'San Jose': { lat: 37.3382, lon: -121.8863 },
        'London': { lat: 51.5074, lon: -0.1278 },
        'Paris': { lat: 48.8566, lon: 2.3522 },
        'Tokyo': { lat: 35.6762, lon: 139.6503 },
        'Beijing': { lat: 39.9042, lon: 116.4074 },
        'Moscow': { lat: 55.7558, lon: 37.6176 }
    };
    
    const coords = cityCoordinates[cityName];
    if (coords) {
        calculateMyCityImpact(coords.lat, coords.lon);
    } else {
        alert('City not found. Please try a major city name.');
    }
}

function calculateMyCityImpact(userLat, userLon) {
    const asteroid = asteroidDatabase[currentAsteroidIndex];
    const impactLat = targetLat;
    const impactLon = targetLon;
    
    // Calculate distance between user location and impact point
    const distance = calculateDistance(userLat, userLon, impactLat, impactLon);
    
    // Calculate damage level based on distance
    const craterRadius = asteroid.diameter / 2000; // km
    const totalDestructionRadius = craterRadius * 2;
    const severeDamageRadius = craterRadius * 5;
    const moderateDamageRadius = craterRadius * 10;
    const lightDamageRadius = craterRadius * 20;
    
    let damageLevel = 'No Damage';
    let evacuationRequired = 'No';
    let survivalProbability = '100%';
    
    if (distance <= totalDestructionRadius) {
        damageLevel = 'Total Destruction';
        evacuationRequired = 'Immediate';
        survivalProbability = '0%';
    } else if (distance <= severeDamageRadius) {
        damageLevel = 'Severe Damage';
        evacuationRequired = 'Immediate';
        survivalProbability = '10%';
    } else if (distance <= moderateDamageRadius) {
        damageLevel = 'Moderate Damage';
        evacuationRequired = 'Recommended';
        survivalProbability = '50%';
    } else if (distance <= lightDamageRadius) {
        damageLevel = 'Light Damage';
        evacuationRequired = 'Optional';
        survivalProbability = '80%';
    }
    
    // Update display
    document.getElementById('distanceFromImpact').textContent = `${distance.toFixed(1)} km`;
    document.getElementById('damageLevel').textContent = damageLevel;
    document.getElementById('evacuationStatus').textContent = evacuationRequired;
    document.getElementById('survivalProbability').textContent = survivalProbability;
    
    // Generate safety recommendations
    generateSafetyRecommendations(damageLevel, distance, evacuationRequired);
    
    // Create visualization
    createMyCityVisualization(userLat, userLon, impactLat, impactLon, distance);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function generateSafetyRecommendations(damageLevel, distance, evacuationRequired) {
    const recommendations = document.getElementById('safetyRecommendations');
    let html = '<ul>';
    
    if (damageLevel === 'Total Destruction') {
        html += '<li>🚨 <strong>IMMEDIATE EVACUATION REQUIRED</strong> - You are in the total destruction zone</li>';
        html += '<li>🏃‍♂️ Evacuate immediately to a distance of at least 50km</li>';
        html += '<li>📱 Contact emergency services and family members</li>';
        html += '<li>🚗 Use multiple evacuation routes in case of traffic</li>';
    } else if (damageLevel === 'Severe Damage') {
        html += '<li>🚨 <strong>IMMEDIATE EVACUATION REQUIRED</strong> - You are in the severe damage zone</li>';
        html += '<li>🏃‍♂️ Evacuate to a distance of at least 20km</li>';
        html += '<li>🏠 Seek shelter in reinforced buildings if evacuation is not possible</li>';
        html += '<li>📱 Stay informed through emergency broadcasts</li>';
    } else if (damageLevel === 'Moderate Damage') {
        html += '<li>⚠️ <strong>EVACUATION RECOMMENDED</strong> - You are in the moderate damage zone</li>';
        html += '<li>🏠 Seek shelter in reinforced buildings or basements</li>';
        html += '<li>📱 Prepare for potential power outages and communication disruptions</li>';
        html += '<li>🚗 Have evacuation plan ready in case conditions worsen</li>';
    } else if (damageLevel === 'Light Damage') {
        html += '<li>✅ <strong>MINIMAL RISK</strong> - You are in the light damage zone</li>';
        html += '<li>🏠 Stay indoors during impact and for several hours after</li>';
        html += '<li>📱 Monitor emergency broadcasts for updates</li>';
        html += '<li>🚗 Avoid unnecessary travel for 24-48 hours</li>';
    } else {
        html += '<li>✅ <strong>SAFE ZONE</strong> - You are outside the damage zones</li>';
        html += '<li>📱 Monitor news for updates on the impact</li>';
        html += '<li>🏠 Normal activities can continue</li>';
        html += '<li>🤝 Consider helping with relief efforts if needed</li>';
    }
    
    html += '</ul>';
    recommendations.innerHTML = html;
}

function createMyCityVisualization(userLat, userLon, impactLat, impactLon, distance) {
    const canvas = document.getElementById('myCityCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Draw impact point (center)
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw damage zones
    const asteroid = asteroidDatabase[currentAsteroidIndex];
    const craterRadius = asteroid.diameter / 2000;
    const scale = 50; // pixels per km
    
    const zones = [
        { radius: craterRadius * 2 * scale, color: '#ff0000', alpha: 0.3 },
        { radius: craterRadius * 5 * scale, color: '#ff8800', alpha: 0.2 },
        { radius: craterRadius * 10 * scale, color: '#ffaa00', alpha: 0.15 },
        { radius: craterRadius * 20 * scale, color: '#ffff00', alpha: 0.1 }
    ];
    
    zones.forEach(zone => {
        ctx.fillStyle = zone.color;
        ctx.globalAlpha = zone.alpha;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(zone.radius, 100), 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.globalAlpha = 1;
    
    // Draw impact point
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw user location
    const userX = centerX + (userLon - impactLon) * scale * 0.1;
    const userY = centerY + (impactLat - userLat) * scale * 0.1;
    
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath();
    ctx.arc(userX, userY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw line between impact and user
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(userX, userY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Impact', centerX + 10, centerY - 10);
    ctx.fillText('Your Location', userX + 10, userY - 10);
}

function closeMyCityModal() {
    const modal = document.getElementById('myCityModal');
    if (modal) {
        modal.remove();
    }
}

function createCityZoomDamage() {
    // Start cinematic zoom sequence
    startCinematicCityZoom();
    
    // Create detailed city damage visualization
    const modal = document.createElement('div');
    modal.className = 'city-damage-modal';
    modal.id = 'cityDamageModal';
    modal.innerHTML = `
        <div class="city-damage-content">
            <div class="city-damage-header">
                <h2>🏙️ City Impact Analysis</h2>
                <div class="zoom-controls">
                    <button class="zoom-btn" onclick="zoomToImpact()">🔍 Zoom to Impact</button>
                    <button class="zoom-btn" onclick="zoomToCity()">🏙️ Zoom to City</button>
                    <button class="zoom-btn" onclick="resetZoom()">🌍 Reset View</button>
                </div>
                <button class="close-story" onclick="closeCityDamageModal()">×</button>
            </div>
            <div class="city-damage-body">
                <div class="damage-map">
                    <canvas id="cityDamageCanvas" width="600" height="400"></canvas>
                    <div class="zoom-indicator">
                        <span id="zoomLevel">1x</span>
                    </div>
                </div>
                <div class="damage-stats">
                    <h3>Impact Statistics</h3>
                    <div class="stat-grid">
                        <div class="stat-item">
                            <span class="stat-label">Population Affected:</span>
                            <span class="stat-value" id="populationAffected">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Buildings Destroyed:</span>
                            <span class="stat-value" id="buildingsDestroyed">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Economic Damage:</span>
                            <span class="stat-value" id="economicDamage">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Evacuation Required:</span>
                            <span class="stat-value" id="evacuationRequired">-</span>
                        </div>
                    </div>
                </div>
                <div class="damage-layers">
                    <h4>Damage Zones</h4>
                    <div class="zone-list">
                        <div class="zone-item">
                            <div class="zone-color" style="background: #ff0000;"></div>
                            <span>Total Destruction (0-2km)</span>
                        </div>
                        <div class="zone-item">
                            <div class="zone-color" style="background: #ff8800;"></div>
                            <span>Severe Damage (2-5km)</span>
                        </div>
                        <div class="zone-item">
                            <div class="zone-color" style="background: #ffaa00;"></div>
                            <span>Moderate Damage (5-10km)</span>
                        </div>
                        <div class="zone-item">
                            <div class="zone-color" style="background: #ffff00;"></div>
                            <span>Light Damage (10-20km)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Create damage visualization
    createCityDamageVisualization();
    calculateCityDamageStats();
    
    // Start cinematic sequence
    setTimeout(() => {
        startCinematicDamageSequence();
    }, 500);
}

// Start cinematic zoom to city
function startCinematicCityZoom() {
    // Animate camera to zoom into the impact area
    const originalCameraZ = camera.position.z;
    const targetZ = 2; // Close zoom
    
    // Smooth camera animation
    animateCameraTo({ z: targetZ }, 2000, () => {
        // Show city damage modal after zoom
        setTimeout(() => {
            // Camera stays zoomed for city analysis
        }, 1000);
    });
}

// Start cinematic damage sequence
function startCinematicDamageSequence() {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrame = 0;
    const totalFrames = 300; // 5 seconds at 60fps
    
    function animateDamage() {
        animationFrame++;
        const progress = animationFrame / totalFrames;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw city background
        drawCityBackground(ctx, canvas.width, canvas.height);
        
        // Draw buildings
        drawCityBuildings(ctx, canvas.width, canvas.height);
        
        // Animate impact sequence
        if (progress < 0.2) {
            // Pre-impact: show normal city
            drawPreImpactCity(ctx, canvas.width, canvas.height);
        } else if (progress < 0.4) {
            // Impact moment: show explosion
            drawImpactMoment(ctx, canvas.width, canvas.height, (progress - 0.2) / 0.2);
        } else if (progress < 0.6) {
            // Fireball expansion
            drawFireballExpansion(ctx, canvas.width, canvas.height, (progress - 0.4) / 0.2);
        } else if (progress < 0.8) {
            // Shockwave propagation
            drawShockwavePropagation(ctx, canvas.width, canvas.height, (progress - 0.6) / 0.2);
        } else {
            // Final damage state
            drawFinalDamageState(ctx, canvas.width, canvas.height);
        }
        
        if (animationFrame < totalFrames) {
            requestAnimationFrame(animateDamage);
        } else {
            // Animation complete, show interactive damage map
            createInteractiveDamageMap();
        }
    }
    
    animateDamage();
}

// Draw pre-impact city
function drawPreImpactCity(ctx, width, height) {
    // Draw normal city buildings
    ctx.fillStyle = '#4a4a4a';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = height - Math.random() * 100 - 50;
        const w = 20 + Math.random() * 30;
        const h = 30 + Math.random() * 100;
        ctx.fillRect(x, y, w, h);
    }
}

// Draw impact moment
function drawImpactMoment(ctx, width, height, progress) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw buildings being destroyed
    drawPreImpactCity(ctx, width, height);
    
    // Draw explosion
    const explosionRadius = progress * 50;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, explosionRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, explosionRadius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw fireball expansion
function drawFireballExpansion(ctx, width, height, progress) {
    const centerX = width / 2;
    const centerY = height / 2;
    const fireballRadius = 50 + progress * 100;
    
    // Draw destroyed buildings
    ctx.fillStyle = '#2a2a2a';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = height - Math.random() * 50 - 30;
        const w = 15 + Math.random() * 20;
        const h = 20 + Math.random() * 40;
        ctx.fillRect(x, y, w, h);
    }
    
    // Draw fireball
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, fireballRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.3, 'rgba(255, 200, 0, 0.7)');
    gradient.addColorStop(0.7, 'rgba(255, 100, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, fireballRadius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw shockwave propagation
function drawShockwavePropagation(ctx, width, height, progress) {
    const centerX = width / 2;
    const centerY = height / 2;
    const shockwaveRadius = 150 + progress * 200;
    
    // Draw damaged buildings
    drawPreImpactCity(ctx, width, height);
    
    // Draw shockwave rings
    for (let i = 0; i < 3; i++) {
        const ringRadius = shockwaveRadius - i * 30;
        if (ringRadius > 0) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 - i * 0.1})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// Draw final damage state
function drawFinalDamageState(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw crater
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw damage zones
    drawDamageZones(ctx, centerX, centerY);
    
    // Draw remaining buildings
    ctx.fillStyle = '#3a3a3a';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = height - Math.random() * 80 - 40;
        const w = 10 + Math.random() * 15;
        const h = 15 + Math.random() * 30;
        ctx.fillRect(x, y, w, h);
    }
}

// Create interactive damage map
function createInteractiveDamageMap() {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    // Add click handlers for zooming
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Zoom to clicked area
        zoomToArea(x, y);
    });
    
    // Add mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoomCanvas(delta);
    });
}

// Zoom functions
function zoomToImpact() {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    zoomToArea(centerX, centerY);
}

function zoomToCity() {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    // Zoom to show entire city
    canvas.style.transform = 'scale(1)';
    updateZoomIndicator(1);
}

function resetZoom() {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    canvas.style.transform = 'scale(1)';
    updateZoomIndicator(1);
}

function zoomToArea(x, y) {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    const scale = 2;
    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = `${x}px ${y}px`;
    updateZoomIndicator(scale);
}

function zoomCanvas(delta) {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    const currentScale = parseFloat(canvas.style.transform.replace('scale(', '').replace(')', '')) || 1;
    const newScale = Math.max(0.5, Math.min(5, currentScale * delta));
    
    canvas.style.transform = `scale(${newScale})`;
    updateZoomIndicator(newScale);
}

function updateZoomIndicator(scale) {
    const indicator = document.getElementById('zoomLevel');
    if (indicator) {
        indicator.textContent = `${scale.toFixed(1)}x`;
    }
}

function createCityDamageVisualization() {
    const canvas = document.getElementById('cityDamageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw city background
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw buildings
    drawCityBuildings(ctx, width, height);
    
    // Draw impact crater
    const centerX = width / 2;
    const centerY = height / 2;
    const craterRadius = 30;
    
    // Crater
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(centerX, centerY, craterRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Damage zones
    drawDamageZones(ctx, centerX, centerY);
    
    // Draw buildings with damage
    drawDamagedBuildings(ctx, width, height, centerX, centerY);
}

function drawCityBuildings(ctx, width, height) {
    // Draw city buildings
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const buildingWidth = Math.random() * 20 + 10;
        const buildingHeight = Math.random() * 60 + 20;
        
        ctx.fillStyle = '#444444';
        ctx.fillRect(x, y, buildingWidth, buildingHeight);
        
        // Windows
        ctx.fillStyle = '#666666';
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 5; k++) {
                ctx.fillRect(x + j * 5, y + k * 10, 3, 5);
            }
        }
    }
}

function drawDamageZones(ctx, centerX, centerY) {
    const zones = [
        { radius: 40, color: '#ff0000', alpha: 0.3 },
        { radius: 80, color: '#ff8800', alpha: 0.2 },
        { radius: 120, color: '#ffaa00', alpha: 0.15 },
        { radius: 160, color: '#ffff00', alpha: 0.1 }
    ];
    
    zones.forEach(zone => {
        ctx.fillStyle = zone.color;
        ctx.globalAlpha = zone.alpha;
        ctx.beginPath();
        ctx.arc(centerX, centerY, zone.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    
    ctx.globalAlpha = 1;
}

function drawDamagedBuildings(ctx, width, height, centerX, centerY) {
    // Draw damaged buildings based on distance from impact
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        let damageLevel = 0;
        if (distance < 40) damageLevel = 4; // Total destruction
        else if (distance < 80) damageLevel = 3; // Severe damage
        else if (distance < 120) damageLevel = 2; // Moderate damage
        else if (distance < 160) damageLevel = 1; // Light damage
        
        if (damageLevel > 0) {
            drawDamagedBuilding(ctx, x, y, damageLevel);
        }
    }
}

function drawDamagedBuilding(ctx, x, y, damageLevel) {
    const colors = ['#ff0000', '#ff4400', '#ff8800', '#ffaa00'];
    const alphas = [0.8, 0.6, 0.4, 0.2];
    
    ctx.fillStyle = colors[damageLevel - 1];
    ctx.globalAlpha = alphas[damageLevel - 1];
    ctx.fillRect(x, y, 15, 40);
    
    // Add damage effects
    if (damageLevel >= 3) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 15, y + 40);
        ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
}

function calculateCityDamageStats() {
    const asteroid = asteroidDatabase[currentAsteroidIndex];
    const diameter = asteroid.diameter;
    const energy = asteroid.kineticEnergy;
    
    // Calculate damage statistics
    const craterRadius = diameter / 2000; // km
    const totalDestructionRadius = craterRadius * 2;
    const severeDamageRadius = craterRadius * 5;
    const moderateDamageRadius = craterRadius * 10;
    const lightDamageRadius = craterRadius * 20;
    
    // Population estimates (simplified)
    const populationDensity = 1000; // people per km²
    const totalDestructionArea = Math.PI * totalDestructionRadius ** 2;
    const severeDamageArea = Math.PI * severeDamageRadius ** 2 - totalDestructionArea;
    const moderateDamageArea = Math.PI * moderateDamageRadius ** 2 - severeDamageArea - totalDestructionArea;
    
    const populationAffected = Math.floor(
        totalDestructionArea * populationDensity * 0.9 +
        severeDamageArea * populationDensity * 0.7 +
        moderateDamageArea * populationDensity * 0.3
    );
    
    const buildingsDestroyed = Math.floor(populationAffected / 3);
    const economicDamage = Math.floor(energy / 1e12); // Trillions
    const evacuationRequired = Math.floor(populationAffected * 1.5);
    
    // Update display
    document.getElementById('populationAffected').textContent = populationAffected.toLocaleString();
    document.getElementById('buildingsDestroyed').textContent = buildingsDestroyed.toLocaleString();
    document.getElementById('economicDamage').textContent = `$${economicDamage}T`;
    document.getElementById('evacuationRequired').textContent = evacuationRequired.toLocaleString();
}

function closeCityDamageModal() {
    const modal = document.getElementById('cityDamageModal');
    if (modal) {
        modal.remove();
    }
}

function createDebrisField(particleCount, radius) {
    const particles = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    const colors = [];
    const sizes = [];
    const phi = (90 - targetLat) * Math.PI / 180;
    const theta = (targetLon + 180) * Math.PI / 180;
    const impactX = 5.1 * Math.sin(phi) * Math.cos(theta);
    const impactY = 5.1 * Math.cos(phi);
    const impactZ = 5.1 * Math.sin(phi) * Math.sin(theta);
    for (let i = 0; i < particleCount; i++) {
        positions.push(impactX, impactY, impactZ);
        // Debris has different velocity patterns
        const speed = 0.15 + Math.random() * radius * 1.0; // Increased speed
        const angle = Math.random() * Math.PI * 2;
        const elevation = Math.random() * Math.PI * 0.7; // More horizontal spread
        velocities.push(
            Math.cos(angle) * Math.sin(elevation) * speed,
            Math.cos(elevation) * speed * 0.7,
            Math.sin(angle) * Math.sin(elevation) * speed
        );
        // Rock/debris colors with more variation
        const rockType = Math.random();
        if (rockType < 0.3) {
            colors.push(0.4, 0.3, 0.2); // Brown rock
        } else if (rockType < 0.6) {
            colors.push(0.5, 0.5, 0.5); // Gray rock
        } else {
            colors.push(0.3, 0.2, 0.1); // Dark rock
        }
        // Variable debris sizes
        sizes.push(0.1 + Math.random() * 0.15); // Increased size
    }
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12, // Increased size
        vertexColors: true,
        transparent: true,
        opacity: 0.8, // Increased opacity
        sizeAttenuation: true
    });
    const debrisSystem = new THREE.Points(particles, particleMaterial);
    scene.add(debrisSystem);
    explosionParticles.push({
        system: debrisSystem,
        velocities: velocities,
        life: 0,
        maxLife: 8.0, // Increased lifetime
        type: 'debris'
    });
}

function createShockwaveRings(impactX, impactY, impactZ) {
    // Create multiple expanding shockwave rings
    const shockwaves = [{
            delay: 0,
            color: 0xffffff,
            opacity: 1.0,
            speed: 0.8,
            maxScale: 15
        },
        {
            delay: 200,
            color: 0x00aaff,
            opacity: 0.8,
            speed: 0.6,
            maxScale: 25
        },
        {
            delay: 400,
            color: 0x0088cc,
            opacity: 0.6,
            speed: 0.4,
            maxScale: 35
        }
    ];
    shockwaves.forEach(wave => {
        setTimeout(() => {
            const ringGeometry = new THREE.RingGeometry(0.1, 0.3, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: wave.color,
                transparent: true,
                opacity: wave.opacity,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const shockwave = new THREE.Mesh(ringGeometry, ringMaterial);
            shockwave.position.set(impactX, impactY, impactZ);
            shockwave.lookAt(0, 0, 0);
            scene.add(shockwave);
            // Animate expansion
            let scale = 0.1;
            const expandWave = () => {
                scale += wave.speed;
                shockwave.scale.set(scale, scale, 1);
                shockwave.material.opacity = Math.max(0, wave.opacity * (1 - scale / wave.maxScale));
                if (scale < wave.maxScale && shockwave.material.opacity > 0.01) {
                    requestAnimationFrame(expandWave);
                } else {
                    scene.remove(shockwave);
                }
            };
            expandWave();
        }, wave.delay);
    });
}

function createAtmosphericDisturbance() {
    // Global atmospheric heating effect
    const atmosphereGeometry = new THREE.SphereGeometry(5.5, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6622, // Warmer color
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    // Animate atmospheric disturbance
    let intensity = 0;
    let growing = true;
    const maxIntensity = 0.4; // Increased intensity
    const animateAtmosphere = () => {
        if (growing) {
            intensity += 0.015; // Faster growth
            if (intensity >= maxIntensity) {
                growing = false;
            }
        } else {
            intensity *= 0.97;
        }
        atmosphere.material.opacity = intensity;
        atmosphere.scale.setScalar(1 + intensity * 3.5); // Larger scale
        if (intensity > 0.001) {
            requestAnimationFrame(animateAtmosphere);
        } else {
            scene.remove(atmosphere);
        }
    };
    animateAtmosphere();
}

function createCraterEffect() {
    const diameter = parseFloat(document.getElementById('diameter').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    const density = parseFloat(document.getElementById('density').value);
    const energyMT = calculateTNTEquivalent(diameter, velocity, density);
    const craterSize = Math.min(2.0, Math.max(0.3, energyMT * 0.0015)); // Larger crater
    // Create a crater mesh
    const craterGeometry = new THREE.SphereGeometry(craterSize, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const craterMaterial = new THREE.MeshBasicMaterial({
        color: 0x8B4513,
        transparent: true,
        opacity: 0.9, // Increased opacity
        side: THREE.BackSide
    });
    const crater = new THREE.Mesh(craterGeometry, craterMaterial);
    // Position crater at impact point
    const phi = (90 - targetLat) * Math.PI / 180;
    const theta = (targetLon + 180) * Math.PI / 180;
    const x = 5.1 * Math.sin(phi) * Math.cos(theta);
    const y = 5.1 * Math.cos(phi);
    const z = 5.1 * Math.sin(phi) * Math.sin(theta);
    crater.position.set(x, y, z);
    crater.lookAt(0, 0, 0);
    scene.add(crater);
    // Animate crater formation
    let scale = 0.1;
    const maxScale = craterSize;
    const formCrater = () => {
        scale += 0.07; // Faster formation
        crater.scale.set(scale, scale, scale);
        if (scale < maxScale) {
            requestAnimationFrame(formCrater);
        }
    };
    formCrater();
}

function createScreenShake(energyMT) {
    const intensity = Math.min(1.0, energyMT / 1000); // Scale intensity with energy
    if (intensity < 0.1) return; // Only shake for significant impacts
    const originalPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    let shakeTime = 0;
    const shakeDuration = 2000 * intensity; // Scale duration with intensity
    const shakeCamera = () => {
        shakeTime += 16; // ~60fps
        const progress = shakeTime / shakeDuration;
        if (progress < 1) {
            const currentIntensity = intensity * (1 - progress);
            camera.position.x = originalPosition.x + (Math.random() - 0.5) * currentIntensity;
            camera.position.y = originalPosition.y + (Math.random() - 0.5) * currentIntensity;
            camera.position.z = originalPosition.z + (Math.random() - 0.5) * currentIntensity * 0.5;
            requestAnimationFrame(shakeCamera);
        } else {
            camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
        }
    };
    shakeCamera();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    // Update controls
    controls.update();
    // Rotate Earth slowly if not in simulation mode
    if (!isSimulating) {
        earthMesh.rotation.y += 0.001;
        cloudMesh.rotation.y += 0.0015; // Slightly faster rotation for clouds
    }
    // Update explosion particles
    explosionParticles.forEach((explosion, index) => {
        explosion.life += 0.016; // ~60fps
        const positions = explosion.system.geometry.attributes.position.array;
        const velocities = explosion.velocities;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i]; // x
            positions[i + 1] += velocities[i + 1]; // y
            positions[i + 2] += velocities[i + 2]; // z
            // Apply gravity and drag
            velocities[i + 1] -= 0.01;
            velocities[i] *= 0.97;
            velocities[i + 1] *= 0.97;
            velocities[i + 2] *= 0.97;
        }
        explosion.system.geometry.attributes.position.needsUpdate = true;
        // Fade out over time
        const fadeProgress = explosion.life / explosion.maxLife;
        explosion.system.material.opacity = Math.max(0, 1.0 - fadeProgress);
        // Remove when expired
        if (explosion.life >= explosion.maxLife) {
            scene.remove(explosion.system);
            explosionParticles.splice(index, 1);
        }
    });
    // Animate impact marker pulsing
    if (impactMarker) {
        const time = Date.now() * 0.005;
        impactMarker.scale.setScalar(1 + Math.sin(time) * 0.2);
    }
    renderer.render(scene, camera);
}
// Asteroid navigation functions
function previousAsteroid() {
    playNavigationSound();
    currentAsteroidIndex = (currentAsteroidIndex - 1 + asteroidDatabase.length) % asteroidDatabase.length;
    loadAsteroid(currentAsteroidIndex);
}

function nextAsteroid() {
    playNavigationSound();
    currentAsteroidIndex = (currentAsteroidIndex + 1) % asteroidDatabase.length;
    loadAsteroid(currentAsteroidIndex);
}

function loadAsteroid(index) {
    const asteroid = asteroidDatabase[index];
    document.getElementById('currentAsteroidName').textContent = asteroid.name;
    document.getElementById('currentAsteroidDetails').textContent =
        `${formatSize(asteroid.diameter)} • ${asteroid.velocity} km/s • ${asteroid.description}`;
    document.getElementById('diameter').value = asteroid.diameter;
    document.getElementById('velocity').value = asteroid.velocity;
    document.getElementById('angle').value = asteroid.angle;
    document.getElementById('density').value = asteroid.density;
    document.getElementById('composition').value = asteroid.type;
    // Update the 3D preview
    createAsteroidPreview();
    // Update NASA data if available
    if (asteroid.nasaData) {
        updateNASADataDisplay();
    }
    updateAsteroid();
    
    // Add discover button
}

function formatSize(diameter) {
    if (diameter >= 1000) {
        return (diameter / 1000).toFixed(1) + 'km';
    }
    return diameter + 'm';
}

function updateAsteroid() {
    const diameter = parseFloat(document.getElementById('diameter').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const density = parseFloat(document.getElementById('density').value);
    // Update display values
    document.getElementById('diameterValue').textContent = formatSize(diameter);
    document.getElementById('velocityValue').textContent = velocity + ' km/s';
    document.getElementById('angleValue').textContent = angle + '°';
    document.getElementById('densityValue').textContent = density;
    // Calculate physics
    calculatePhysics(diameter, velocity, density);
    // Update AI Risk Advisor
    updateAIRiskAdvisor();
}

function calculatePhysics(diameter, velocity, density) {
    const radius = diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * density;
    const velocityMs = velocity * 1000;
    const kineticEnergy = 0.5 * mass * Math.pow(velocityMs, 2);
    const tntEquivalent = kineticEnergy / (4.184e15); // Convert to megatons TNT
    const momentum = mass * velocityMs;
    // Calculate damage radii (simplified formulas)
    const energyMT = tntEquivalent;
    const fireballRadius = 0.28 * Math.pow(energyMT, 0.4);
    const airblastRadius = 2.2 * Math.pow(energyMT, 0.33);
    const thermalRadius = 1.9 * Math.pow(energyMT, 0.41);
    const seismicRadius = 15 * Math.pow(energyMT, 0.25);
    const craterDiameter = 1.8 * Math.pow(diameter, 0.78) * Math.pow(velocity, 0.44) / 1000;
    // Update display
    document.getElementById('asteroidMass').textContent = formatScientific(mass) + ' kg';
    document.getElementById('kineticEnergy').textContent = formatScientific(kineticEnergy) + ' J';
    document.getElementById('tntEquivalent').textContent = formatNumber(tntEquivalent) + ' MT';
    document.getElementById('momentum').textContent = formatScientific(momentum) + ' kg⋅m/s';
    document.getElementById('fireballRadius').textContent = formatNumber(fireballRadius) + ' km';
    document.getElementById('airblastRadius').textContent = formatNumber(airblastRadius) + ' km';
    document.getElementById('thermalRadius').textContent = formatNumber(thermalRadius) + ' km';
    document.getElementById('seismicRadius').textContent = formatNumber(seismicRadius) + ' km';
    document.getElementById('craterDiameter').textContent = formatNumber(craterDiameter) + ' km';
    // Update impact assessment
    updateImpactAssessment(energyMT, airblastRadius);
}

function updateImpactAssessment(energyMT, damageRadius) {
    // Calculate threat level
    let threatLevel = "LOW";
    let threatColor = "#4caf50";
    if (energyMT > 1000) {
        threatLevel = "EXTINCTION";
        threatColor = "#000000";
    } else if (energyMT > 100) {
        threatLevel = "EXTREME";
        threatColor = "#ff1744";
    } else if (energyMT > 10) {
        threatLevel = "HIGH";
        threatColor = "#ff9800";
    } else if (energyMT > 1) {
        threatLevel = "MODERATE";
        threatColor = "#ffeb3b";
    }
    // Calculate casualties
    const populationDensity = currentTarget.environment === 'Urban' ? 5000 :
        currentTarget.environment === 'Ocean' ? 0 : 100;
    const affectedArea = Math.PI * Math.pow(damageRadius, 2);
    const casualties = Math.floor(affectedArea * populationDensity * 0.7);
    // Calculate recovery time
    let recoveryTime = "Decades";
    if (energyMT > 1000) recoveryTime = "Never";
    else if (energyMT > 100) recoveryTime = "Centuries";
    else if (energyMT > 10) recoveryTime = "Decades";
    else if (energyMT > 1) recoveryTime = "Years";
    else recoveryTime = "Months";
    // Update display
    const threatElement = document.getElementById('threatLevel');
    threatElement.textContent = threatLevel;
    threatElement.style.color = threatColor;
    document.getElementById('casualtyEstimate').textContent = formatNumber(casualties);
    document.getElementById('damageRadius').textContent = damageRadius.toFixed(1) + ' km';
    document.getElementById('recoveryTime').textContent = recoveryTime;
    // Update mitigation success rates based on asteroid size
    updateMitigationRates(energyMT);
}

function updateMitigationRates(energyMT) {
    let deflectionRate = 85;
    let nuclearRate = 65;
    let evacuationRate = 95;
    let shelterRate = 70;
    // Adjust rates based on asteroid size
    if (energyMT > 100) {
        deflectionRate = 15;
        nuclearRate = 30;
        evacuationRate = 60;
        shelterRate = 20;
    } else if (energyMT > 10) {
        deflectionRate = 45;
        nuclearRate = 50;
        evacuationRate = 80;
        shelterRate = 40;
    } else if (energyMT > 1) {
        deflectionRate = 70;
        nuclearRate = 60;
        evacuationRate = 90;
        shelterRate = 60;
    }
    document.getElementById('deflectionSuccess').textContent = deflectionRate + '% Success Rate';
    document.getElementById('nuclearSuccess').textContent = nuclearRate + '% Success Rate';
    document.getElementById('evacuationSuccess').textContent = evacuationRate + '% Casualty Reduction';
    document.getElementById('shelterSuccess').textContent = shelterRate + '% Casualty Reduction';
}

function formatScientific(num) {
    return num.toExponential(2);
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + ' billion';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + ' million';
    } else if (num >= 1000) {
        return Math.floor(num / 1000) + ',' + String(Math.floor(num % 1000)).padStart(3, '0');
    }
    return Math.floor(num).toString();
}

function updateComposition() {
    const composition = document.getElementById('composition').value;
    const densitySlider = document.getElementById('density');
    const densities = {
        rocky: 2700,
        metallic: 7800,
        carbonaceous: 1300,
        icy: 900
    };
    if (densities[composition]) {
        densitySlider.value = densities[composition];
        updateAsteroid();
    }
}
// Location functions
function setTargetLocation() {
    const locationKey = document.getElementById('targetLocation').value;
    if (locationKey !== 'custom' && locationDatabase[locationKey]) {
        const location = locationDatabase[locationKey];
        targetLat = location.lat;
        targetLon = location.lon;
        currentTarget = {
            name: location.name,
            population: location.population,
            environment: location.environment
        };
        updateLocationDisplay();
        updateImpactMarker();
        updateMapMarkerPosition();
        // Update AI Risk Advisor with new location data
        updateAIRiskAdvisor();
        // Reload USGS data for new location
        loadUSGSDataForLocation(targetLat, targetLon);
    }
}

function updateLocationDisplay() {
    const latStr = Math.abs(targetLat).toFixed(4) + '°' + (targetLat >= 0 ? 'N' : 'S');
    const lonStr = Math.abs(targetLon).toFixed(4) + '°' + (targetLon >= 0 ? 'E' : 'W');
    document.getElementById('coordinates').textContent = latStr + ', ' + lonStr;
    document.getElementById('hudCoordinates').textContent = latStr + ', ' + lonStr;
    document.getElementById('targetName').textContent = currentTarget.name;
    document.getElementById('targetPopulation').textContent = formatPopulation(currentTarget.population);
    document.getElementById('hudEnvironment').textContent = currentTarget.environment;
    // Sync 2D map marker
    updateMapMarkerPosition();
}

function formatPopulation(pop) {
    if (pop >= 1000000) {
        return (pop / 1000000).toFixed(1) + 'M';
    } else if (pop >= 1000) {
        return (pop / 1000).toFixed(0) + 'K';
    }
    return pop.toString();
}

function randomizeImpact() {
    playNavigationSound();
    targetLat = (Math.random() - 0.5) * 180;
    targetLon = (Math.random() - 0.5) * 360;
    const environments = ['Ocean', 'Desert', 'Forest', 'Mountain', 'Tundra', 'Grassland'];
    const randomEnv = environments[Math.floor(Math.random() * environments.length)];
    const randomPop = Math.floor(Math.random() * 1000000);
    currentTarget = {
        name: 'Random Location',
        population: randomPop,
        environment: randomEnv
    };
    document.getElementById('targetLocation').value = 'custom';
    updateLocationDisplay();
    updateImpactMarker();
    updateMapMarkerPosition();
    // Update AI Risk Advisor with new location data
    updateAIRiskAdvisor();
    // Reload USGS data for new location
    loadUSGSDataForLocation(targetLat, targetLon);
}
// Sound controls
function toggleSound() {
    soundEnabled = !soundEnabled;
    const button = document.getElementById('soundToggle');
    if (soundEnabled) {
        button.textContent = '🔊 Sound ON';
        button.classList.remove('muted');
    } else {
        button.textContent = '🔇 Sound OFF';
        button.classList.add('muted');
    }
    playNavigationSound();
}

function setVolume(value) {
    volume = value / 100;
}
// AI Risk Advisor Functions
function updateAIRiskAdvisor() {
    // Show thinking animation
    document.getElementById('aiThinking').style.display = 'flex';
    document.getElementById('aiAnalysisResult').style.opacity = '0.5';
    // Simulate AI processing time
    setTimeout(() => {
        const diameter = parseFloat(document.getElementById('diameter').value);
        const velocity = parseFloat(document.getElementById('velocity').value);
        const density = parseFloat(document.getElementById('density').value);
        const angle = parseFloat(document.getElementById('angle').value);
        // Calculate energy and other parameters
        const energyMT = calculateTNTEquivalent(diameter, velocity, density);
        // Get AI recommendation
        const recommendation = getAIRecommendation(diameter, velocity, density, angle, energyMT);
        // Update UI with AI recommendation
        document.getElementById('aiRecommendation').textContent = recommendation.strategy;
        document.getElementById('aiSuccessProbability').textContent = recommendation.successProbability + '%';
        document.getElementById('aiSuccessProbability').className = 'recommendation-stat-value ' +
            (recommendation.successProbability > 70 ? 'recommendation-high' :
                recommendation.successProbability > 40 ? 'recommendation-medium' : 'recommendation-low');
        document.getElementById('aiEstimatedCost').textContent = recommendation.estimatedCost;
        document.getElementById('aiTimeRequired').textContent = recommendation.timeRequired;
        document.getElementById('aiRiskLevel').textContent = recommendation.riskLevel;
        document.getElementById('aiRiskLevel').className = 'recommendation-stat-value ' +
            (recommendation.riskLevel === 'Low' ? 'recommendation-high' :
                recommendation.riskLevel === 'Medium' ? 'recommendation-medium' : 'recommendation-low');
        document.getElementById('aiAnalysisText').innerHTML = recommendation.analysis;
        // Hide thinking animation and show results
        document.getElementById('aiThinking').style.display = 'none';
        document.getElementById('aiAnalysisResult').style.opacity = '1';
    }, 1500);
}

function getAIRecommendation(diameter, velocity, density, angle, energyMT) {
    // Determine the best strategy based on asteroid parameters
    let strategy, successProbability, estimatedCost, timeRequired, riskLevel, analysis;
    // Decision logic based on asteroid characteristics
    if (diameter < 100) {
        // Small asteroid - deflection is most effective
        strategy = "Kinetic Deflection Mission";
        successProbability = 85;
        estimatedCost = "$500M - $1B";
        timeRequired = "2-5 years";
        riskLevel = "Low";
        analysis = "This small asteroid is ideal for deflection. A kinetic impactor mission similar to NASA's DART could successfully alter its trajectory with minimal risk. The cost is relatively low compared to other options, and the timeline allows for proper mission planning and execution.";
    } else if (diameter < 500) {
        // Medium asteroid - nuclear option might be needed
        if (velocity < 20) {
            strategy = "Kinetic Deflection Mission";
            successProbability = 65;
            estimatedCost = "$2B - $5B";
            timeRequired = "5-8 years";
            riskLevel = "Medium";
            analysis = "While this asteroid is larger, its relatively low velocity makes deflection feasible. A scaled-up kinetic impactor mission with multiple spacecraft could successfully nudge it off course. Nuclear options carry higher political and environmental risks.";
        } else {
            strategy = "Nuclear Disruption";
            successProbability = 55;
            estimatedCost = "$10B - $20B";
            timeRequired = "3-6 years";
            riskLevel = "High";
            analysis = "The combination of size and high velocity makes this asteroid challenging to deflect. Nuclear disruption may be necessary to break it into smaller, less dangerous fragments. This approach carries significant political and environmental risks but may be the only viable option with limited warning time.";
        }
    } else if (diameter < 2000) {
        // Large asteroid - nuclear or combination approach
        strategy = "Combined Nuclear & Evacuation";
        successProbability = 45;
        estimatedCost = "$50B - $100B";
        timeRequired = "8-15 years";
        riskLevel = "Very High";
        analysis = "This large asteroid presents a significant threat. A combined approach using nuclear devices to fragment the asteroid, followed by targeted evacuations of high-risk areas, offers the best chance of minimizing casualties. The cost is substantial, and the timeline requires immediate action.";
    } else {
        // Very large asteroid - evacuation is primary option
        strategy = "Mass Evacuation & Shelter Construction";
        successProbability = 30;
        estimatedCost = "$100B+";
        timeRequired = "10-20 years";
        riskLevel = "Extreme";
        analysis = "An asteroid of this size would cause global catastrophic effects. Deflection or disruption is unlikely to be effective. The primary strategy must focus on large-scale evacuation from vulnerable areas and construction of underground shelters. Recovery would take decades or centuries.";
    }
    // Adjust based on impact location
    if (currentTarget.environment === "Ocean") {
        successProbability += 5;
        riskLevel = riskLevel === "Extreme" ? "Very High" : riskLevel;
        analysis += " Impact in an ocean area reduces immediate human casualties but could generate devastating tsunamis affecting coastal regions globally.";
    } else if (currentTarget.environment === "Urban") {
        successProbability -= 10;
        riskLevel = riskLevel === "Low" ? "Medium" : riskLevel === "Medium" ? "High" : riskLevel;
        analysis += " Impact in a densely populated urban area dramatically increases potential casualties. Evacuation planning must be prioritized given the high population density.";
    }
    // Adjust based on composition
    const composition = document.getElementById('composition').value;
    if (composition === "carbonaceous" || composition === "icy") {
        successProbability += 5;
        analysis += " The asteroid's composition makes it more amenable to deflection techniques, as these materials tend to be less dense and more responsive to impact forces.";
    } else if (composition === "metallic") {
        successProbability -= 5;
        analysis += " The metallic composition makes this asteroid more difficult to deflect or disrupt, requiring greater energy input for any mitigation strategy.";
    }
    // Ensure probability is within bounds
    successProbability = Math.max(5, Math.min(95, successProbability));
    return {
        strategy,
        successProbability,
        estimatedCost,
        timeRequired,
        riskLevel,
        analysis
    };
}
// Mitigation system functions
function selectMitigation(type) {
    // Remove previous selection
    document.querySelectorAll('.mitigation-option').forEach(option => {
        option.classList.remove('selected');
    });
    // Add selection to clicked option
    event.target.closest('.mitigation-option').classList.add('selected');
    selectedMitigation = type;
    showMitigationDetails(type);
    playNavigationSound();
}

function showMitigationDetails(type) {
    const detailsPanel = document.getElementById('selectedMitigation');
    const title = document.getElementById('mitigationTitle');
    const details = document.getElementById('mitigationDetails');
    const cost = document.getElementById('mitigationCost');
    const time = document.getElementById('mitigationTime');
    const effectiveness = document.getElementById('mitigationEffectiveness');
    const energyMT = calculateTNTEquivalent(
        parseFloat(document.getElementById('diameter').value),
        parseFloat(document.getElementById('velocity').value),
        parseFloat(document.getElementById('density').value)
    );
    const mitigationData = {
        deflection: {
            title: "Kinetic Deflection Mission",
            details: "Launch a spacecraft to impact the asteroid and change its trajectory. Similar to NASA's DART mission, this approach requires precise timing and multiple years of advance warning.",
            cost: energyMT > 100 ? "$50B+" : energyMT > 10 ? "$15B" : "$5B",
            time: energyMT > 100 ? "15+ years" : energyMT > 10 ? "8 years" : "3 years",
            effectiveness: energyMT > 100 ? "15%" : energyMT > 10 ? "45%" : "85%"
        },
        nuclear: {
            title: "Nuclear Disruption",
            details: "Deploy nuclear devices to fragment or deflect the asteroid. This is a last resort option that could create multiple smaller impacts instead of one large one.",
            cost: energyMT > 100 ? "$100B+" : energyMT > 10 ? "$25B" : "$8B",
            time: energyMT > 100 ? "10+ years" : energyMT > 10 ? "5 years" : "2 years",
            effectiveness: energyMT > 100 ? "30%" : energyMT > 10 ? "50%" : "65%"
        },
        evacuation: {
            title: "Mass Evacuation Protocol",
            details: "Evacuate all populations from the predicted impact zone and surrounding areas. This requires massive logistical coordination and could take months to complete effectively.",
            cost: energyMT > 100 ? "$500B+" : energyMT > 10 ? "$100B" : "$20B",
            time: energyMT > 100 ? "2+ years" : energyMT > 10 ? "1 year" : "6 months",
            effectiveness: energyMT > 100 ? "60%" : energyMT > 10 ? "80%" : "95%"
        },
        shelter: {
            title: "Underground Shelter Network",
            details: "Construct reinforced underground bunkers to protect populations from the impact effects. These shelters must be stocked with supplies for extended periods.",
            cost: energyMT > 100 ? "$1T+" : energyMT > 10 ? "$200B" : "$50B",
            time: energyMT > 100 ? "5+ years" : energyMT > 10 ? "3 years" : "1 year",
            effectiveness: energyMT > 100 ? "20%" : energyMT > 10 ? "40%" : "70%"
        }
    };
    const data = mitigationData[type];
    title.textContent = data.title;
    details.textContent = data.details;
    cost.textContent = data.cost;
    time.textContent = data.time;
    effectiveness.textContent = data.effectiveness;
    detailsPanel.style.display = 'block';
}
// Cinematic mode functions
function toggleCinematicMode() {
    cinematicMode = !cinematicMode;
    const btn = document.getElementById('cinematicBtn');
    if (cinematicMode) {
        btn.textContent = '🎬 Cinematic ON';
        btn.style.background = 'linear-gradient(45deg, #4caf50, #45a049)';
    } else {
        btn.textContent = '🎬 Cinematic Mode';
        btn.style.background = 'linear-gradient(45deg, #4fc3f7, #29b6f6)';
    }
    playNavigationSound();
}
// Launch simulation
function launchAsteroid() {
    if (isSimulating) return;
    isSimulating = true;
    // Allow narration to run for this new simulation
    try { if (typeof resetNarrationFlag === 'function') resetNarrationFlag(); } catch(_) {}
    playLaunchSound();
    // Begin recording the sequence
    startEventRecording();
    // Hide results sections initially
    document.querySelectorAll('.results-section').forEach(section => {
        section.classList.remove('visible');
    });
    
    // Force using the simple countdown method
    if (false) { // Disabled orbital mechanics for now
        // Get current asteroid data
        const asteroid = asteroidDatabase[currentAsteroidIndex];
        const diameter = parseFloat(document.getElementById('diameter').value);
        const velocity = parseFloat(document.getElementById('velocity').value);
        const density = parseFloat(document.getElementById('density').value);
        
        // Create realistic orbital elements for the asteroid
        const orbitalElements = {
            a: 1.5, // Semi-major axis in AU
            e: 0.1, // Eccentricity
            i: 5,   // Inclination in degrees
            Omega: 0, // Longitude of ascending node
            omega: 0, // Argument of periapsis
            M: 0     // Mean anomaly
        };
        
        // Calculate trajectory using orbital mechanics
        const stateVector = window.orbitUtils.elementsToStateVector(orbitalElements);
        
        // Create asteroid in space and animate its approach
        const asteroidMesh = createSpaceAsteroid();
        if (asteroidMesh) {
            animateAsteroidApproach(asteroidMesh, stateVector.position, [0, 0, 0]);
        } else {
            console.warn('Failed to create asteroid mesh, falling back to simple countdown');
            // Fallback to simple countdown
            const countdown = document.getElementById('countdown');
            const countdownNumber = document.getElementById('countdownNumber');
            countdown.classList.add('show');
            let count = 3;
            const countdownInterval = setInterval(() => {
                countdownNumber.textContent = count;
                createSound(800, 0.2, 'sine');
                count--;
                if (count < 0) {
                    clearInterval(countdownInterval);
                    countdown.classList.remove('show');
                    createExplosionEffect();
                    setTimeout(() => {
                        showImpactResults();
                        isSimulating = false;
                        setTimeout(() => stopEventRecording(), 1200);
                    }, 3000);
                }
            }, 1000);
        }
        
        // Show cinematic journey phases
        startCinematicJourney();
    }
    
    // Simple countdown and impact effect
    const countdown = document.getElementById('countdown');
    const countdownNumber = document.getElementById('countdownNumber');
    if (countdown) countdown.classList.add('show');
    
    let count = 3;
    const countdownInterval = setInterval(() => {
        if (countdownNumber) countdownNumber.textContent = count;
        createSound(800, 0.2, 'sine');
        count--;
        if (count < 0) {
            clearInterval(countdownInterval);
            if (countdown) countdown.classList.remove('show');
            
            // Create explosion effect
            if (typeof createExplosionEffect === 'function') {
                createExplosionEffect();
            }
            
            // Show results after explosion
            setTimeout(() => {
                if (typeof showImpactResults === 'function') {
                    showImpactResults();
                }
                isSimulating = false;
                
                // Stop recording shortly after results are shown
                if (typeof stopEventRecording === 'function') {
                    setTimeout(() => stopEventRecording(), 1200);
                }
            }, 3000);
        }
    }, 1000);
}

// Immediate impact simulation: skip countdown/trajectory and detonate at target
function simulateImpact() {
    if (isSimulating) return;
    isSimulating = true;
    try {
        // Optional cue
        if (typeof playLaunchSound === 'function') playLaunchSound();
        // Allow narration to run for this new simulation
        try { if (typeof resetNarrationFlag === 'function') resetNarrationFlag(); } catch(_) {}
        // Begin recording the sequence
        startEventRecording();
        // Detonate at current target
        if (typeof createExplosionEffect === 'function') createExplosionEffect();
        if (typeof playImpactSound === 'function') playImpactSound();
        if (typeof createCameraShake === 'function') createCameraShake();
        setTimeout(() => {
            if (typeof showImpactResults === 'function') showImpactResults();
            isSimulating = false;
            // Stop recording shortly after results are shown
            setTimeout(() => stopEventRecording(), 1200);
        }, 3000);
    } catch (e) {
        console.error('simulateImpact error:', e);
        isSimulating = false;
    }
}

// Expose to window
window.simulateImpact = simulateImpact;

function startCinematicJourney() {
    // Hide UI panels
    document.getElementById('controlsPanel').classList.add('hidden');
    document.querySelector('.hud').style.opacity = '0';
    // Show cinematic overlay
    const overlay = document.getElementById('cinematicOverlay');
    overlay.classList.add('active');
    // Initialize journey phases
    journeyPhases = [{
            id: 'journeyPhase1',
            duration: 4000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 80
            }
        },
        {
            id: 'journeyPhase2',
            duration: 3000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 50
            }
        },
        {
            id: 'journeyPhase3',
            duration: 3000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 25
            }
        },
        {
            id: 'journeyPhase4',
            duration: 2000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 18
            }
        },
        {
            id: 'journeyPhase5',
            duration: 2000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 15
            }
        },
        {
            id: 'journeyPhase6',
            duration: 3000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 12
            }
        },
        {
            id: 'journeyPhase7',
            duration: 4000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 20
            }
        },
        {
            id: 'journeyPhase8',
            duration: 5000,
            cameraPos: {
                x: 0,
                y: 0,
                z: 30
            }
        }
    ];
    currentJourneyPhase = 0;
    startJourneyPhase();
}

function startJourneyPhase() {
    if (currentJourneyPhase >= journeyPhases.length) {
        endCinematicJourney();
        return;
    }
    const phase = journeyPhases[currentJourneyPhase];
    const progress = ((currentJourneyPhase + 1) / journeyPhases.length) * 100;
    // Update progress bar
    document.getElementById('cinematicProgressBar').style.width = progress + '%';
    // Update cinematic text
    const titles = [
        "DEEP SPACE APPROACH",
        "ENTERING EARTH'S GRAVITY",
        "ATMOSPHERIC ENTRY",
        "PLASMA FORMATION",
        "MOMENT OF IMPACT",
        "FIREBALL EXPANSION",
        "SHOCKWAVE PROPAGATION",
        "GLOBAL CONSEQUENCES"
    ];
    const subtitles = [
        "The asteroid travels through the void...",
        "Gravity takes hold of the cosmic projectile...",
        "Hypersonic entry creates brilliant fireball...",
        "Extreme heating forms plasma sheath...",
        "Energy release equivalent to nuclear weapons...",
        "Temperatures exceed the Sun's surface...",
        "Devastating waves reshape the landscape...",
        "Effects ripple across the entire planet..."
    ];
    document.getElementById('cinematicTitle').textContent = titles[currentJourneyPhase];
    document.getElementById('cinematicSubtitle').textContent = subtitles[currentJourneyPhase];
    // Show journey phase overlay
    const phaseElement = document.getElementById(phase.id);
    phaseElement.classList.add('active');
    // Animate camera
    animateCameraTo(phase.cameraPos, phase.duration * 0.6);
    // Create phase-specific effects
    createPhaseEffects(currentJourneyPhase);
    // Schedule next phase
    setTimeout(() => {
        phaseElement.classList.remove('active');
        currentJourneyPhase++;
        startJourneyPhase();
    }, phase.duration);
}

function createPhaseEffects(phaseIndex) {
    switch (phaseIndex) {
        case 0: // Deep space
            createSpaceAsteroid();
            break;
        case 1: // Gravity well
            if (asteroid) {
                // Add subtle trajectory curve
                asteroid.userData.gravityEffect = true;
            }
            break;
        case 2: // Atmospheric entry
            createAtmosphericEntry();
            break;
        case 3: // Plasma formation
            createPlasmaEffects();
            break;
        case 4: // Impact
            createEnhancedExplosionEffect();
            break;
        case 5: // Fireball
            // Already handled in impact
            break;
        case 6: // Shockwave
            // Already handled in impact
            break;
        case 7: // Global effects
            createGlobalEffects();
            break;
    }
}

function createAtmosphericEntry() {
    if (!asteroid) return;
    // Add atmospheric heating glow
    const glowGeometry = new THREE.SphereGeometry(asteroid.geometry.parameters.radius * 2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    asteroid.add(glow);
    // Animate glow intensity
    let intensity = 0.6;
    const animateow = () => {
        intensity += 0.02;
        glow.material.opacity = Math.min(0.9, intensity);
        glow.scale.setScalar(1 + intensity * 0.5);
        if (intensity < 2) {
            requestAnimationFrame(animateGlow);
        }
    };
    animateGlow();
}

function createPlasmaEffects() {
    if (!asteroid) return;
    // Create plasma sheath
    const plasmaGeometry = new THREE.SphereGeometry(asteroid.geometry.parameters.radius * 3, 32, 32);
    const plasmaMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const plasma = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
    asteroid.add(plasma);
    // Animate plasma
    let time = 0;
    const animatePlasma = () => {
        time += 0.1;
        plasma.material.opacity = 0.4 + Math.sin(time) * 0.2;
        plasma.rotation.x += 0.02;
        plasma.rotation.y += 0.03;
        if (time < 20) {
            requestAnimationFrame(animatePlasma);
        }
    };
    animatePlasma();
}

function createGlobalEffects() {
    // Create global atmospheric disturbance
    const atmosphereGeometry = new THREE.SphereGeometry(5.8, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4400,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    const globalAtmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(globalAtmosphere);
    // Animate global effects
    let globalIntensity = 0.1;

    function animateGlobal() {
        globalIntensity += 0.005;
        globalAtmosphere.material.opacity = Math.min(0.3, globalIntensity);
        globalAtmosphere.rotation.y += .001;
        if (globalIntensity < 0.3) {
            requestAnimationFrame(animateGlobal);
        }
    }
    animateGlobal();
}

function endCinematicJourney() {
    // Hide cinematic overlay
    document.getElementById('cinematicOverlay').classList.remove('active');
    // Show UI panels
    document.getElementById('controlsPanel').classList.remove('hidden');
    document.querySelector('.hud').style.opacity = '1';
    // Show impact results
    setTimeout(() => {
        showImpactResults();
        isSimulating = false;
        // Return camera to normal position
        animateCameraTo({
            x: 0,
            y: 0,
            z: 15
        }, 3000);
    }, 2000);
}

function createAsteroidTrajectory() {
    // Kurzgesagt-style cinematic sequence
    startCinematicSequence();
}

function startCinematicSequence() {
    // Phase 1: Zoom out to show asteroid approaching from space
    const originalCameraZ = camera.position.z;
    // Smooth camera zoom out
    animateCameraTo({
        z: 50
    }, 2000, () => {
        // Phase 2: Show asteroid in deep space
        createSpaceAsteroid();
        setTimeout(() => {
            // Phase 3: Follow asteroid as it approaches
            animateCamera({
                z: 25
            }, 3000, () => {
                // Phase 4: Dramatic close-up as it enters atmosphere
                setTimeout(() => {
                    animateCameraTo({
                        z: 15
                    }, 2000, () => {
                        // Phase 5: Impact and explosion
                        setTimeout(() => {
                            createEnhancedExplosionEffect();
                            playImpactSound();
                            // Show results after explosion
                            setTimeout(() => {
                                showImpactResults();
                                isSimulating = false;
                            }, 4000);
                        }, 1000);
                    });
                }, 2000);
            });
        }, 1000);
    });
}

function animateCameraTo(targetPos, duration, callback) {
    const startPos = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    const startTime = Date.now();
    const animateCamera = () => {
        const elapsed = Date.now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        camera.position.x = startPos.x + (targetPos.x || 0 - startPos.x) * easeProgress;
        camera.position.y = startPos.y + (targetPos.y || 0 - startPos.y) * easeProgress;
        camera.position.z = startPos.z + (targetPos.z - startPos) * easeProgress;
        if (progress < 1) {
            requestAnimationFrame(animateCamera);
        } else if (callback) {
            callback();
        }
    };
    animateCamera();
}

function createSpaceAsteroid() {
    const diameter = parseFloat(document.getElementById('diameter').value);
    const asteroidSize = Math.max(0.1, Math.min(1.0, diameter / 5000));
    // Create beautiful Kurzgesagt-style asteroid
    const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 32, 32);
    // Create stunning asteroid material with realistic textures
    const asteroidMaterial = new THREE.MeshPhongMaterial({
        color: 0x8b4513,
        shininess: 10,
        bumpScale: 0.2
    });
    // Create detailed asteroid texture
    const asteroidCanvas = document.createElement('canvas');
    asteroidCanvas.width = 512;
    asteroidCanvas.height = 512;
    const ctx = asteroidCanvas.getContext('2d');
    // Base rocky color
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#5d4037');
    gradient.addColorStop(0.5, '#6d4c41');
    gradient.addColorStop(1, '#4e342e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    // Add realistic craters and surface details
    for (let i = 0; i < 80; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 15 + 5;
        const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        craterGradient.addColorStop(0, '#2a1810');
        craterGradient.addColorStop(0.7, '#4a2f1a');
        craterGradient.addColorStop(1, '#6b3f25');
        ctx.fillStyle = craterGradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
        ctx.stroke();
    }
    // Add surface roughness
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 5 + 2;
        ctx.fillStyle = `rgba(${60 + Math.random() * 40}, ${30 + Math.random() * 20}, ${15 + Math.random() * 15}, 0.6)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    asteroidMaterial.map = new THREE.CanvasTexture(asteroidCanvas);
    asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    // Position asteroid in deep space
    const phi = (90 - targetLat) * Math.PI / 180;
    const theta = (targetLon + 180) * Math.PI / 180;
    const targetX = 5.1 * Math.sin(phi) * Math.cos(theta);
    const targetY = 5.1 * Math.cos(phi);
    const targetZ = 5.1 * Math.sin(phi) * Math.sin(theta);
    // Start very far away
    const distance = 80;
    const startX = targetX + distance * 0.7;
    const startY = targetY + distance * 0.5;
    const startZ = targetZ + distance * 0.3;
    asteroid.position.set(startX, startY, startZ);
    scene.add(asteroid);
    // Create beautiful particle trail system
    createKurzgesagtTra(asteroid);
    // Start the dramatic approach animation
    animateAsteroidApproach(asteroid, {
        x: startX,
        y: startY,
        z: startZ
    }, {
        x: targetX,
        y: targetY,
        z: targetZ
    });
}

function createKurzgesagtTrail(asteroidMesh) {
    // Create multiple trail systems for layered effect
    const trailSystems = [];
    // Main bright trail
    const mainTrailGeometry = new THREE.BufferGeometry();
    const mainPositions = [];
    const mainColors = [];
    for (let i = 0; i < 100; i++) {
        mainPositions.push(asteroidMesh.position.x, asteroidMesh.position.y, asteroidMesh.position.z);
        const intensity = (100 - i) / 100;
        mainColors.push(1, intensity * 0.8, 0); // Bright yellow-orange
    }
    mainTrailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mainPositions, 3));
    mainTrailGeometry.setAttribute('color', new THREE.Float32BufferAttribute(mnColors, 3));
    const mainTrailMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const mainTra = new THREE.Points(mainTrailGeometry, mainTrailMaterial);
    scene.add(mainTrail);
    trailSystems.push({
        system: mainTrail,
        type: 'main'
    });
    // Secondary particle trail
    const secondaryTrailGeometry = new THREE.BufferGeometry();
    const secondaryPositions = [];
    const secondaryColors = [];
    for (let i = 0; i < 100; i++) {
        secondaryPositions.push(asteroidMesh.position.x, asteroidMesh.position.y, asteroidMesh.position.z);
        const intensity = (100 - i) / 100;
        secondaryColors.push(1, intensity * 0.4, 0); // Deep orange
    }
    secondaryTrailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(secondaryPositions, 3));
    secondaryTrailGeometry.setAttribute('color', new THREE.Float32BufferAttribute(secondaryColors, 3));
    const secondaryTrailMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const secondaryTrail = new THREE.Points(secondaryTrailGeometry, secondaryTrailMaterial);
    scene.add(secondaryTrail);
    trailSystems.push({
        system: secondaryTrail,
        type: 'secondary'
    });
    // Store trail systems for updates
    asteroidMesh.userData.trailSystems = trailSystems;
}

function animateAsteroidApproach(asteroidMesh, startPos, targetPos) {
    const totalDuration = 8000; // 8 seconds for dramatic effect
    const startTime = Date.now();
    const animateApproach = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        // Smooth easing with acceleration
        const easeProgress = progress < 0.5 ?
            2 * progress * progress :
            1 - Math.pow(-2 * progress + 2, 3) / 2;
        // Update asteroid position
        asteroidMesh.position.x = startPos.x + (targetPos.x - startPos.x) * easeProgress;
        asteroidMesh.position.y = startPos.y + (targetPos.y - startPos.y) * easeProgress;
        asteroidMesh.position.z = startPos.z + (targetPos.z - startPos.z) * easeProgress;
        // Realistic rotation
        asteroidMesh.rotation.x += 0.02;
        asteroidMesh.rotation.y += 0.015;
        asteroidMesh.rotation.z += 0.008;
        // Update trail systems
        if (asteroidMesh.userData.trailSystems) {
            asteroidMesh.userData.trailSystems.forEach(trailData => {
                const positions = trailData.system.geometry.attributes.position.array;
                const pointCount = positions.length / 3;
                // Shift existing positions back
                for (let i = pointCount - 1; i > 0; i--) {
                    positions[i * 3] = positions[(i - 1) * 3];
                    positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
                    positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];
                }
                // Add current position
                positions[0] = asteroidMesh.position.x;
                positions[1] = asteroidMesh.position.y;
                positions[2] = asteroidMesh.position.z;
                trailData.system.geometry.attributes.position.needsUpdate = true;
            });
        }
        // Atmospheric entry effects (Kurzgesagt style)
        if (progress > 0.6) {
            const entryProgress = (progress - 0.6) / 0.4;
            // Create heating glow
            if (!asteroidMesh.userData.atmosphericGlow) {
                const glowGeometry = new THREE.SphereGeometry(asteroidMesh.geometry.parameters.radius * 3, 32, 32);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff6600,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending
                });
                asteroidMesh.userData.atmosphericGlow = new THREE.Mesh(glowGeometry, glowMaterial);
                asteroidMesh.add(asteroidMesh.userData.atmosphericGlow);
                // Add plasma trail effect
                const plasmaGeometry = new THREE.SphereGeometry(asteroidMesh.geometry.parameters.radius * 1.5, 16, 16);
                const plasmaMaterial = new THREE.MeshBasicMaterial({
                    color: 0x00aaff,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending
                });
                asteroidMesh.userData.plasmaGlow = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
                asteroidMesh.add(asteroidMesh.userData.plasmaGlow);
            }
            // Animate atmospheric effects
            requestAnimationFrame(animateApproach);
        } else {
            // IMPACT!
            scene.remove(asteroidMesh);
            if (asteroidMesh.userData.trailSystems) {
                asteroidMesh.userata.trailSystems.forEach(trailData => {
                    scene.remove(trailData.system);
                });
            }
            // Create the spectacular explosion
            createEnhancedExplosionEffect();
            playImpactSound();
            // Camera shake effect
            createCameraShake();
            // Show results after explosion sequence
            setTimeout(() => {
                showImpactResults();
                isSimulating = false;
            }, 4000);
        }
    };
    animateApproach();
}

function createCameraShake() {
    const originalPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    let shakeIntensity = 0.5;
    let shakeTime = 0;
    const shakeDuration = 2000; // 2 seconds
    const shakeCamera = () => {
        shakeTime += 16; // ~60fps
        const progress = shakeTime / shakeDuration;
        if (progress < 1) {
            const currentIntensity = shakeIntensity * (1 - progress);
            camera.position.x = originalPosition.x + (Math.random() - 0.5) * currentIntensity;
            camera.position.y = originalPosition.y + (Math.random() - 0.5) * currentIntensity;
            camera.position.z = originalPosition.z + (Math.random() - 0.5) * currentIntensity * 0.5;
            requestAnimationFrame(shakeCamera);
        } else {
            camera.position.set(originalPosition.x, originalPosition.y, originalPosition.z);
        }
    };
    shakeCamera();
}

function startAvatarNarrationOnce() {
    if (window.__narrationHasRun) return;
    window.__narrationHasRun = true;
    
    // Get impact text from the results panel
    const impactText = document.querySelector('.impact-summary')?.textContent?.trim() || 
                     'Impact simulation complete. Check the results panel for details.';
    
    console.log('Starting narration with text:', impactText);
    
    // Make sure audio is enabled
    if (typeof audioEnabled === 'undefined') {
        window.audioEnabled = true;
    }
    
    // Ensure we have speech synthesis
    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not available');
        return;
    }
    
    // Speak the text
    if (typeof speakText === 'function') {
        // Add a small delay to ensure the UI is ready
        setTimeout(() => {
            speakText(impactText);
            
            // Start talking animation
            const avatar = document.getElementById('aiAvatar');
            if (avatar) {
                avatar.classList.add('talking');
                
                // Stop talking animation when speech ends
                const onEnd = () => {
                    avatar.classList.remove('talking');
                    speechSynthesis.cancel();
                    window.removeEventListener('end', onEnd);
                };
                
                // Set up event listener for when speech ends
                const utterance = new SpeechSynthesisUtterance(impactText);
                utterance.onend = onEnd;
                speechSynthesis.speak(utterance);
            } else {
                // Fallback if we can't find the avatar
                speakText(impactText);
            }
        }, 1000);
    }
}

function showImpactResults() {
    generateImpactAnalysis();
    const panel = document.getElementById('impactResultsPanel');
    if (panel) panel.classList.add('show');
    
    // Show the results sections
    document.querySelectorAll('.results-section').forEach(section => {
        section.classList.add('visible');
    });
    
    // Start avatar narration once content is visible
    setTimeout(() => startAvatarNarrationOnce(), 500);
    
    // Ensure recording stops if still running
    try {
        if (typeof stopEventRecording === 'function') {
            setTimeout(() => stopEventRecording(), 2000);
        }
    } catch (e) {
        console.error('Error stopping event recording:', e);
    }
}


function generateImpactAnalysis() {
    window.__narrationRunId = (window.__narrationRunId || 0) + 1;
    // Do not auto-start narration here; it is triggered from showImpactResults()
    
    const diameter = parseFloat(document.getElementById('diameter').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    const density = parseFloat(document.getElementById('density').value);
    const energyMT = calculateTNTEquivalent(diameter, velocity, density);
    const energyGT = energyMT / 1000; // Convert to Gigatons
    // Calculate detailed impact parameters
    const impactData = calculateDetailedImpact(diameter, velocity, density, energyMT);
    // Generate crater analysis as detailed points
    const immediateEffects = [{
            title: "Crater Formation",
            description: `• ${impactData.craterDiameter.toFixed(1)} km wide crater\n• An estimated ${formatNumber(impactData.craterCasualties)} people would be vaporized in the crater\n• The crater is ${impactData.craterDepth.toFixed(0)} m deep\n• Your asteroid impacted the ground at ${velocity} km/s\n• The impact is equivalent to ${energyGT.toFixed(1)} Gigatons of TNT\n• ${getEnergyComparison(energyGT)}`,
            severity: "severe"
        },
        {
            title: "Impact Frequency",
            description: `• An impact this size happens on average every ${formatNumber(impactData.frequency)} years\n• ${getFrequencyContext(impactData.frequency)}`,
            severity: impactData.frequency < 100000 ? "severe" : impactData.frequency < 1000000 ? "moderate" : "minor"
        }
    ];
    // Generate fireball effects as detailed points
    const secondaryEffects = [{
            title: "Fireball Effects",
            description: `• ${impactData.fireballRadius.toFixed(0)} km wide fireball\n• An estimated ${formatNumber(impactData.fireballDeaths)} people would die from the fireball\n• An estimated ${formatNumber(impactData.burns3rd)} people would receive 3rd degree burns\n• An estimated ${formatNumber(impactData.burns2nd)} people would receive 2nd degree burns`,
            severity: "severe"
        },
        {
            title: "Thermal Ignition",
            description: `• Clothes would catch on fire within ${impactData.clothesIgnition.toFixed(0)} km of the impact\n• Trees would catch on fire within ${impactData.treeIgnition.toFixed(0)} km of the impact`,
            severity: impactData.clothesIgnition > 50 ? "severe" : "moderate"
        },
        {
            title: "Shock Wave",
            description: `• ${impactData.shockwaveDecibels.toFixed(0)} decibel shock wave\n• An estimated ${formatNumber(impactData.shockwaveDeaths)} people would die from the shock wave\n• Anyone within ${impactData.lungDamage.toFixed(0)} km would likely receive lung damage\n• Anyone within ${impactData.eardrumRupture.toFixed(0)} km would likely have ruptured eardrums`,
            severity: "severe"
        }
    ];
    // Generate structural damage as detailed points
    const longTermEffects = [{
            title: "Building Collapse",
            description: `• Buildings within ${impactData.buildingCollapse.toFixed(0)} would collapse\n• Homes within ${impactData.homeCollapse.toFixed(0)} km would collapse`,
            severity: "severe"
        },
        {
            title: "Wind Blast",
            description: `• ${impactData.peakWindSpeed.toFixed(1)} km/s peak wind speed\n• An estimated ${formatNumber(impactData.windDeaths)} people would die from the wind blast\n• Wind within ${impactData.jupiterWinds.toFixed(0)} km would be faster than storms on Jupiter\n• Homes within ${impactData.homesLeveled.toFixed(0)} km would be completely leveled`,
            severity: "severe"
        },
        {
            title: "Tornado-Force Winds",
            description: `• Within ${impactData.tornadoZone.toFixed(0)} km it would feel like being inside an EF5 tornado\n• Nearly all trees within ${impactData.treesKnocked.toFixed(0)} km would be knocked down`,
            severity: "severe"
        }
    ];
    // Generate seismic effects as detailed points
    const globalEffects = [{
            title: "Seismic Activity",
            description: `• ${impactData.earthquakeMagnitude.toFixed(1)} magnitude earthquake\n• An estimated ${formatNumber(impactData.earthquakeDeaths)} people would die from the earthquake\n• The earthquake would be felt ${impactData.earthquakeRange.toFixed(0)} km away`,
            severity: impactData.earthquakeMagnitude > 7 ? "severe" : "moderate"
        },
        {
            title: "Total Casualties",
            description: `• Total estimated casualties: ${formatNumber(impactData.totalCasualties)} deaths from all effects combined\n• This represents ${((impactData.totalCasualties / currentTarget.population) * 100).toFixed(1)}% of the local population`,
            severity: "severe"
        },
        {
            title: "Global Impact",
            description: `• ${getGlobalImpactDescription(energyGT, impactData.frequency)}`,
            severity: energyGT > 100 ? "severe" : energyGT > 10 ? "moderate" : "minor"
        }
    ];
    // Populate the results (narration will read from these DOM nodes)
    populateEffectsList('immediateEffects', immediateEffects);
    populateEffectsList('secondaryEffects', secondaryEffects);
    populateEffectsList('longTermEffects', longTermEffects);
    populateEffectsList('globalEffects', globalEffects);
}

function calculateDetailedImpact(diameter, velocity, density, energyMT) {
    const energyGT = energyMT / 1000;
    // Crater calculations (based on scaling laws)
    const craterDiameter = 1.8 * Math.pow(diameter, 0.78) * Math.pow(velocity, 0.44) / 1000;
    const craterDepth = craterDiameter * 0.06 * 1000; // Convert to meters
    // Population density calculations (simplified)
    const populationDensity = currentTarget.environment === 'Urban' ? 5000 :
        currentTarget.environment === 'Ocean' ? 0 : 100;
    // Crater casualties
    const craterArea = Math.PI * Math.pow(craterDiameter / 2, 2);
    const craterCasualties = Math.floor(craterArea * populationDensity);
    // Fireball calculations
    const fireballRadius = 0.28 * Math.pow(energyMT, 0.4);
    const fireballArea = Math.PI * Math.pow(fireballRadius, 2);
    const fireballDeaths = Math.floor(fireballArea * populationDensity * 0.95);
    // Thermal effects
    const thermalRadius1st = 1.9 * Math.pow(energyMT, 0.41);
    const thermalRadius2nd = thermalRadius1st * 0.8;
    const thermalRadius3rd = thermalRadius1st * 0.6;
    const burns3rd = Math.floor((Math.PI * Math.pow(thermalRadius3rd, 2) - fireballArea) * populationDensity * 0.7);
    const burns2nd = Math.floor((Math.PI * Math.pow(thermalRadius2nd, 2) - Math.PI * Math.pow(thermalRadius3rd, 2)) * populationDensity * 0.5);
    // Ignition distances
    const clothesIgnition = thermalRadius1st * 0.8;
    const treeIgnition = thermalRadius1st * 1.3;
    // Shock wave calculations
    const shockwaveDecibels = 20 * Math.log10(Math.pow(energyMT, 0.33) * 1000) + 100;
    const shockwaveRadius = 2.2 * Math.pow(energyMT, 0.33);
    const shockwaveArea = Math.PI * Math.pow(shockwaveRadius, 2);
    const shockwaveDeaths = Math.floor(shockwaveArea * populationDensity * 0.6);
    const lungDamage = shockwaveRadius * 0.6;
    const eardrumRupture = shockwaveRadius * 0.8;
    // Structural damage
    const buildingCollapse = shockwaveRadius * 1.4;
    const homeCollapse = shockwaveRadius * 1.8;
    // Wind effects
    const peakWindSpeed = Math.pow(energyMT, 0.25) * 0.8; // km/s
    const windRadius = shockwaveRadius * 1.2;
    const windArea = Math.PI * Math.pow(windRadius, 2);
    const windDeaths = Math.floor(windArea * populationDensity * 0.4);
    const jupiterWinds = windRadius * 0.4;
    const homesLeveled = windRadius * 0.6;
    const tornadoZone = windRadius * 1.1;
    const treesKnocked = windRadius * 1.8;
    // Seismic effects
    const earthquakeMagnitude = Math.min(9.5, 4.5 + Math.log10(energyMT) * 0.67);
    const earthquakeRange = 15 * Math.pow(energyMT, 0.25);
    const earthquakeDeaths = Math.floor(Math.pow(earthquakeMagnitude - 5, 2) * populationDensity * 0.1);
    // Impact frequency (years between similar impacts)
    const frequency = Math.pow(10, 2.5 + Math.log10(energyMT) * 0.8);
    // Total casualties
    const totalCasualties = craterCasualties + fireballDeaths + shockwaveDeaths + windDeaths + earthquakeDeaths;
    return {
        craterDiameter,
        craterDepth,
        craterCasualties,
        fireballRadius,
        fireballDeaths,
        burns3rd,
        burns2nd,
        clothesIgnition,
        treeIgnition,
        shockwaveDecibels,
        shockwaveDeaths,
        lungDamage,
        eardrumRupture,
        buildingCollapse,
        homeCollapse,
        peakWindSpeed,
        windDeaths,
        jupiterWinds,
        homesLeveled,
        tornadoZone,
        treesKnocked,
        earthquakeMagnitude,
        earthquakeDeaths,
        earthquakeRange,
        frequency,
        totalCasualties
    };
}

function getEnergyComparison(energyGT) {
    if (energyGT > 1000) {
        return "More energy than all nuclear weapons on Earth combined.";
    } else if (energyGT > 100) {
        return "Equivalent to the largest nuclear weapons ever tested.";
    } else if (energyGT > 10) {
        return "More energy was released than a hurricane releases in a day.";
    } else if (energyGT > 1) {
        return "More energy than the largest volcanic eruptions in recorded history.";
    } else {
        return "Comparable to a major earthquake's energy release.";
    }
}

function getFrequencyContext(frequency) {
    if (frequency > 10000000) {
        return "Extremely rare - civilization-ending event.";
    } else if (frequency > 1000000) {
        return "Rare enough that human civilization has never experienced one.";
    } else if (frequency > 100000) {
        return "Occurs roughly once per ice age cycle.";
    } else if (frequency > 10000) {
        return "Happens several times during recorded human history.";
    } else {
        return "Relatively common on geological timescales.";
    }
}

function getGlobalImpactDescription(energyGT, frequency) {
    if (energyGT > 1000) {
        return "Global mass extinction event. End of human civilization as we know it. Nuclear winter lasting decades.";
    } else if (energyGT > 100) {
        return "Regional devastation with global climate effects. Crop failures worldwide. Millions of refugees.";
    } else if (energyGT > 10) {
        return "Continental-scale disaster. Significant global economic disruption. Climate effects lasting years.";
    } else if (energyGT > 1) {
        return "National emergency. Regional climate effects. International aid required for recovery.";
    } else {
        return "Local disaster with minimal global impact. Recovery possible within decades.";
    }
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + ' billion';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + ' million';
    } else if (num >= 1000) {
        return Math.floor(num / 1000) + ',' + String(Math.floor(num % 1000)).padStart(3, '0');
    }
    return Math.floor(num).toString();
}

function calculateTNTEquivalent(diameter, velocity, density) {
    const radius = diameter / 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * density;
    const velocityMs = velocity * 1000;
    const kineticEnergy = 0.5 * mass * Math.pow(velocityMs, 2);
    return kineticEnergy / (4.184e15);
}

function calculateCasualties(energyMT, population) {
    const destructionRadius = 2.2 * Math.pow(energyMT, 0.33);
    const affectedArea = Math.PI * Math.pow(destructionRadius, 2);
    const casualtyRate = currentTarget.environment === 'Urban' ? 0.8 :
        currentTarget.environment === 'Ocean' ? 0.1 : 0.3;
    const casualties = Math.min(population, Math.floor(population * casualtyRate * (affectedArea / 100)));
    if (casualties >= 1000000) {
        return (casualties / 1000000).toFixed(1) + ' million';
    } else if (casualties >= 1000) {
        return (casualties / 1000).toFixed(0) + ' thousand';
    }
    return casualties.toString();
}

function calculateEconomicDamage(energyMT) {
    return (energyMT * 0.001).toFixed(1);
}

function populateEffectsList(containerId, effects) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    effects.forEach(effect => {
        const effectDiv = document.createElement('div');
        effectDiv.className = `impact-item ${effect.severity}`;
        effectDiv.innerHTML = `
                    <div class="impact-title">${effect.title}</div>
                    <div class="impact-description">${effect.description}</div>
                `;
        container.appendChild(effectDiv);
    });
}

function closeImpactResults() {
    document.getElementById('impactResultsPanel').classList.remove('show');
}

function resetSimulation() {
    try {
        resetNarrationFlag();
    } catch (_) {}
    playNavigationSound();
    closeImpactResults();
    isSimulating = false;
    // Clear explosion effects
    explosionParticles.forEach(explosion => {
        scene.remove(explosion.system);
    });
    explosionParticles = [];
    // Reset to default asteroid
    currentAsteroidIndex = 0;
    loadAsteroid(0);
    // Reset target location
    targetLat = 23.8859;
    targetLon = 2.5085;
    currentTarget = {
        name: "Sahara Desert",
        population: 1000,
        environment: "Desert"
    };
    document.getElementById('targetLocation').value = 'sahara';
    updateLocationDisplay();
    updateImpactMarker();
}
// Initialize everything when page loads
window.addEventListener('load', () => {
    // Ensure keyboard shortcuts modal is hidden on load
    const keyboardModal = document.getElementById('keyboardShortcutsModal');
    if (keyboardModal) {
        keyboardModal.style.display = 'none';
    }
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'flex';
        initScene();
        loadCustomAsteroids(); // Load custom asteroids from localStorage
        initAIAvatar(); // Initialize AI Avatar
        enhanceAIAvatar(); // Enhance AI avatar with mouse and hands
        addAIQuickExplanations(); // Add AI explanations for buttons
        animate();
        loadAsteroid(0);
        updateLocationDisplay();
        updateImpactMarker();
        // Initialize 2D map after UI is visible
        initMap2D();
        // Initialize USGS Data Service
        initUSGSService();
        // Fetch NASA data after initial load
        fetchNASAData();
    }, 2000);
});
// Handle window resize
window.addEventListener('resize', function () {
    if (renderer && camera) {
        const canvas = document.getElementById('earthCanvas');
        const rect = canvas.parentElement.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height);
    }


    // AI Avatar functionality
    // Note: legacy avatar block retained for backward compatibility. Enhanced narrator is used elsewhere.
    let audioEnabled = true;
    let currentExplanation = null;
    let speechSynthesis = window.speechSynthesis;

    
    // Initialize the AI Avatar
    function initAIAvatar() {
        // Check if speech synthesis is supported
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported in this browser');
            document.getElementById('aiStatus').textContent = "Audio not supported";
            audioEnabled = false;
            return;
        }
        
        // Load voices when they become available
        speechSynthesis.onvoiceschanged = function() {
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices);
            if (voices.length > 0) {
                // Try to find a good default voice
                const defaultVoice = voices.find(v => v.lang.includes('en-')) || voices[0];
                if (defaultVoice) {
                    console.log('Using voice:', defaultVoice.name);
                }
            }
        };
        
        // Force voices to load
        speechSynthesis.getVoices();
        
        // Show avatar after a short delay
        setTimeout(() => {
            const avatar = document.getElementById('aiAvatar');
            if (avatar) {
                avatar.classList.add('visible');
            }
        }, 1000);
    }
    // Toggle audio on/off
    function toggleAudio() {
        audioEnabled = !audioEnabled;
        if (!audioEnabled && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            stopTalkingAnimation();
        }
        updateAudioButton();
    }

    function updateAudioButton() {
        const buttons = document.querySelectorAll('.ai-btn');
        buttons[0].textContent = audioEnabled ? "🔊 Audio ON" : "🔇 Audio OFF";
    }
    // Make the avatar speak text
    function speakText(text) {
        if (!audioEnabled) return;
        // Cancel any ongoing speech
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        // Create speech synthesis utterance
        const speech = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();

        // Select preferred voice
        const preferredVoice = voices.find(voice =>
            voice.name.includes('David') ||
            voice.name.includes('Microsoft') ||
            voice.lang.startsWith('en')
        ) || voices[0];

        if (preferredVoice) {
            speech.voice = preferredVoice;
        }

        speech.rate = 0.9;
        speech.pitch = 1.0;
        speech.volume = volume;

        // Events for when speech starts and ends
        speech.onstart = function () {
            startTalkingAnimation();
            document.getElementById('aiStatus').textContent = "Explaining results";
        };

        speech.onend = function () {
            stopTalkingAnimation();
            document.getElementById('aiStatus').textContent = "Analysis complete";
        };

        speechSynthesis.speak(speech);
    }
    // Start talking animation
    function startTalkingAnimation() {
        document.getElementById('aiMouth').classList.add('talking');
    }
    // Stop talking animation
    function stopTalkingAnimation() {
        document.getElementById('aiMouth').classList.remove('talking');
    }
    // Skip current explanation
    function skipExplanation() {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            stopTalkingAnimation();
            document.getElementById('speechBubble').classList.remove('visible');
            document.getElementById('aiStatus').textContent = "Skipped explanation";
            currentExplanation = null;
        }
    }
    /* Removed legacy explainImpactResults_legacy function */
    // Initialize the AI avatar when the page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Previous initialization code...
            // Initialize AI Avatar
            initAIAvatar();
        }, 2000);
    });
    // Update the existing formatNumber function if needed
    function formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + ' billion';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + ' million';
        } else if (num >= 1000) {
            return Math.floor(num / 1000) + ',' + String(Math.floor(num % 1000)).padStart(3, '0');
        }
        return Math.floor(num).toString();
    }
});
// Enhanced AI Avatar functionality
let audioEnabled = true;
let currentExplanation = null;
let speechSynthesis = window.speechSynthesis;
let currentLanguage = 'en-US';
let availableVoices = [];
let currentVoice = null;
// Language options
const languageOptions = [{
        code: 'en-US',
        name: 'English (US)',
        voiceName: 'Samantha'
    },
    {
        code: 'en-GB',
        name: 'English (UK)',
        voiceName: 'Daniel'
    },
    {
        code: 'es-ES',
        name: 'Español',
        voiceName: 'Monica'
    },
    {
        code: 'fr-FR',
        name: 'Français',
        voiceName: 'Amélie'
    },
    {
        code: 'de-DE',
        name: 'Deutsch',
        voiceName: 'Anna'
    }
];
// Initialize the AI Avatar with enhanced functionality
function initAIAvatar() {
    // Load available voices
    loadVoices();
    // Show avatar after a delay
    setTimeout(() => {
        document.getElementById('aiAvatar').classList.add('visible');
        /* removed auto welcome TTS */
    }, 5000);
}
// Load available voices
function loadVoices() {
    // This might need to be called after the voices are loaded
    availableVoices = speechSynthesis.getVoices();
    // Set default voice to American English
    setVoice('en-US');
    // If voices aren't available yet, wait for them to load
    if (availableVoices.length === 0) {
        speechSynthesis.addEventListener('voiceschanged', function () {
            availableVoices = speechSynthesis.getVoices();
            setVoice('en-US');
        });
    }
}
// Set voice based on language code
function setVoice(langCode) {
    const langOption = languageOptions.find(opt => opt.code === langCode);
    if (!langOption) return;
    // Find the voice
    currentVoice = availableVoices.find(voice =>
        voice.lang === langCode && voice.name.includes(langOption.voiceName)
    ) || availableVoices.find(voice => voice.lang === langCode);
    // If no specific voice found, try to find any voice for the language
    if (!currentVoice) {
        currentVoice = availableVoices.find(voice => voice.lang.startsWith(langCode.split('-')[0]));
    }
    // As a last resort, use the first available voice
    if (!currentVoice && availableVoices.length > 0) {
        currentVoice = availableVoices[0];
    }
    currentLanguage = langCode;
}
// Change language
function changeLanguage() {
    // Find current language index
    const currentIndex = languageOptions.findIndex(opt => opt.code === currentLanguage);
    // Get next language (cycle through options)
    const nextIndex = (currentIndex + 1) % languageOptions.length;
    const nextLang = languageOptions[nextIndex];
    setVoice(nextLang.code);
    document.getElementById('aiStatus').textContent = `Language: ${nextLang.name}`;
    // If currently speaking, restart explanation in new language
    if (speechSynthesis.speaking && currentExplanation) {
        speechSynthesis.cancel();
        /* removed duplicate restart narration */
    }
}
// Make the avatar speak text with enhanced animation
function speakText(text) {
    console.log('speakText called with text:', text);
    console.log('audioEnabled:', audioEnabled);
    
    if (!audioEnabled) {
        console.log('Audio is disabled');
        return;
    }
    
    if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        return;
    }
    
    // Cancel any ongoing speech
    console.log('Speech synthesis speaking?', speechSynthesis.speaking);
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 1.1;
    speech.volume = 1;
    // Use the selected voice
    if (currentVoice) {
        speech.voice = currentVoice;
    }
    // Start talking animation with enhanced movements
    startTalkingAnimation();
    // Events for when speech starts and ends
    speech.onstart = function () {
        document.getElementById('aiStatus').textContent = "Explaining results";
        // Find and highlight the relevant text in impact results
        highlightRelevantText(text);
    };
    speech.onend = function () {
        stopTalkingAnimation();
        document.getElementById('aiStatus').textContent = "Analysis complete";
        // Remove highlights
        removeHighlights();
        // If there's a next part in the explanation, continue
        if (currentExplanation && currentExplanation.parts.length > 0) {
            const nextPart = currentExplanation.parts.shift();
            setTimeout(() => speakText(nextPart.text), 800);
        } else {
            currentExplanation = null;
        }
    };
    speech.onerror = function () {
        stopTalkingAnimation();
        document.getElementById('aiStatus').textContent = "Audio error";
        removeHighlights();
        currentExplanation = null;
    };
    // Add boundary event to sync mouth movement with speech
    speech.onboundary = function (event) {
        // Enhance mouth movement based on speech
        enhanceMouthMovement();
    };
    speechSynthesis.speak(speech);
}
// Enhanced mouth movement animation
function enhanceMouthMovement() {
    const mouth = document.getElementById('aiMouth');
    // Add a talking class that creates more dynamic movement
    mouth.classList.add('enhanced-talking');
    // Remove the class after a short delay to create a "bouncing" effect
    setTimeout(() => {
        mouth.classList.remove('enhanced-talking');
    }, 100);
}
// Start enhanced talking animation
function startTalkingAnimation() {
    document.getElementById('aiMouth').classList.add('talking');
}
// Stop talking animation
function stopTalkingAnimation() {
    document.getElementById('aiMouth').classList.remove('talking');
}
// Legacy highlight functions - disabled to prevent conflicts
function highlightRelevantText(text) {
    // Disabled - using new avatar narration system
    return;
}
// Remove all highlights
function removeHighlights() {
    // Clean up both old and new highlight classes
    document.querySelectorAll('.impact-item.highlighted, .reading-highlight, .reading-secondary').forEach(item => {
        item.classList.remove('highlighted', 'reading-highlight', 'reading-secondary');
    });
}
// Skip current explanation
function skipExplanation() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        stopTalkingAnimation();
        document.getElementById('aiStatus').textContent = "Skipped explanation";
        removeHighlights();
        currentExplanation = null;
    }
}
// Explain impact results with enhanced synchronization
function explainImpactResults() {
    const diameter = parseFloat(document.getElementById('diameter').value);
    const velocity = parseFloat(document.getElementById('velocity').value);
    const density = parseFloat(document.getElementById('density').value);
    const energyMT = calculateTNTEquivalent(diameter, velocity, density);
    const energyGT = energyMT / 1000;
    // Generate explanation text based on impact severity
    let explanation = generateImpactExplanation(diameter, velocity, density, energyMT, energyGT);
    // Set current explanation
    currentExplanation = {
        parts: explanation.parts
    };
    // Start speaking the first part
    speakText(explanation.parts.shift().text);
}
// Generate appropriate explanation based on impact parameters
function generateImpactExplanation(diameter, velocity, density, energyMT, energyGT) {
    const impactData = calculateDetailedImpact(diameter, velocity, density, energyMT);
    const location = currentTarget.name;
    let parts = [];
    // Introduction
    parts.push({
        text: `Analysis complete for impact scenario. A ${formatSize(diameter)} asteroid traveling at ${velocity} kilometers per second has impacted the ${location} region.`,
        section: 'global'
    });
    // Energy comparison
    if (energyGT > 1000) {
        parts.push({
            text: `The impact released ${energyGT.toFixed(1)} gigatons of energy, more than all nuclear weapons on Earth combined. This is an extinction-level event.`,
            section: 'global'
        });
    } else if (energyGT > 100) {
        parts.push({
            text: `The impact released ${energyGT.toFixed(1)} gigatons of energy, equivalent to the largest nuclear weapons ever tested. Global catastrophic effects are expected.`,
            section: 'global'
        });
    } else if (energyGT > 10) {
        parts.push({
            text: `The impact released ${energyGT.toFixed(1)} gigatons of energy, more than a hurricane releases in a day. This will cause continental-scale devastation.`,
            section: 'global'
        });
    } else if (energyGT > 1) {
        parts.push({
            text: `The impact released ${energyGT.toFixed(1)} gigatons of energy, comparable to major volcanic eruptions. Regional destruction is expected.`,
            section: 'global'
        });
    } else {
        parts.push({
            text: `The impact released ${energyGT.toFixed(1)} gigatons of energy. While significant, the effects will be mostly local.`,
            section: 'global'
        });
    }
    // Crater effects
    parts.push({
        text: `The impact created a crater approximately ${impactData.craterDiameter.toFixed(1)} kilometers in diameter and ${impactData.craterDepth.toFixed(0)} meters deep. Everything within this area was vaporized instantly.`,
        section: 'immediate'
    });
    // Immediate effects
    if (impactData.fireballRadius > 10) {
        parts.push({
            text: `A fireball ${impactData.fireballRadius.toFixed(0)} kilometers in radius incinerated everything in its path. Thermal radiation would cause severe burns many kilometers from ground zero.`,
            section: 'immediate'
        });
    }
    // Shockwave effects
    parts.push({
        text: `The shockwave generated winds exceeding ${impactData.peakWindSpeed.toFixed(1)} kilometers per second, leveling structures up to ${impactData.buildingCollapse.toFixed(0)} kilometers away.`,
        section: 'secondary'
    });
    // Casualty estimates
    if (impactData.totalCasualties > 1000000) {
        parts.push({
            text: `Estimated casualties exceed ${formatNumber(impactData.totalCasualties)}. This represents a catastrophic loss of life.`,
            section: 'longterm'
        });
    } else if (impactData.totalCasualties > 1000) {
        parts.push({
            text: `Estimated casualties are approximately ${formatNumber(impactData.totalCasualties)}. This would be a major disaster.`,
            section: 'longterm'
        });
    } else {
        parts.push({
            text: `Estimated casualties are relatively low at ${formatNumber(impactData.totalCasualties)}, primarily due to the impact location.`,
            section: 'longterm'
        });
    }
    // Frequency and context
    parts.push({
        text: `Impacts of this magnitude occur roughly once every ${formatNumber(impactData.frequency)} years. ${getFrequencyContext(impactData.frequency)}`,
        section: 'global'
    });
    // Global implications
    parts.push({
        text: getGlobalImpactDescription(energyGT, impactData.frequency),
        section: 'global'
    });
    // Mitigation advice if applicable
    if (selectedMitigation) {
        const mitigationEffectiveness = document.getElementById('mitigationEffectiveness').textContent;
        parts.push({
            text: `Your selected mitigation strategy, ${selectedMitigation}, has an estimated effectiveness of ${mitigationEffectiveness}.`,
            section: 'global'
        });
    }
    // Conclusion
    parts.push({
        text: "This simulation demonstrates the catastrophic potential of asteroid impacts and the importance of planetary defense initiatives. Thank you for using the NASA Asteroid Impact Simulator.",
        section: 'global'
    });
    return {
        parts
    };
}
    // Initialize the AI avatar when the page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Previous initialization code...
            // Initialize AI Avatar with enhanced functionality
            initAIAvatar();
            // Initialize enhancement features
            initEnhancementFeatures();
        }, 2000);
    });

// ================= ENHANCEMENT FEATURES =================

// Initialize all enhancement features
function initEnhancementFeatures() {
    // Initialize gamification mode
    gamificationMode = new DefendEarthMode();
    
    // Initialize social sharing
    socialSharing = new SocialSharing();
    
    // Initialize educational overlays
    educationalOverlay = new EducationalOverlay();
    
    // Initialize regional analysis
    regionalAnalysis = new RegionalAnalysis();
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize mobile features
    initMobileFeatures();
    
    console.log('All enhancement features initialized successfully');
}

// ================= GAMIFICATION MODE =================
class DefendEarthMode {
    constructor() {
        this.isActive = false;
        this.score = 0;
        this.level = 1;
        this.timeLimit = 300; // 5 minutes
        this.timeRemaining = this.timeLimit;
        this.currentAsteroid = null;
        this.gameTimer = null;
        this.selectedStrategy = null;
    }
    
    startGame() {
        this.isActive = true;
        this.score = 0;
        this.level = 1;
        this.timeRemaining = this.timeLimit;
        
        // Show gamification panel
        document.getElementById('gamificationPanel').style.display = 'block';
        
        // Start game timer
        this.startTimer();
        
        // Spawn first asteroid
        this.spawnRandomAsteroid();
        
        // Update UI
        this.updateGameUI();
        
        console.log('Defend Earth mode started!');
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            this.timeRemaining--;
            document.getElementById('gameTime').textContent = this.timeRemaining;
            
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    spawnRandomAsteroid() {
        const threats = [
            { name: "Asteroid-2025A", diameter: 100, velocity: 15, timeToImpact: 120 },
            { name: "Asteroid-2025B", diameter: 250, velocity: 20, timeToImpact: 90 },
            { name: "Asteroid-2025C", diameter: 500, velocity: 25, timeToImpact: 60 },
            { name: "Asteroid-2025D", diameter: 1000, velocity: 30, timeToImpact: 45 }
        ];
        
        // Increase difficulty with level
        const threatIndex = Math.min(Math.floor(Math.random() * (this.level + 1)), threats.length - 1);
        this.currentAsteroid = threats[threatIndex];
        
        // Update threat display
        const threatInfo = document.getElementById('threatAsteroidInfo');
        threatInfo.innerHTML = `
            <div class="threat-details">
                <p><strong>Name:</strong> ${this.currentAsteroid.name}</p>
                <p><strong>Diameter:</strong> ${this.currentAsteroid.diameter}m</p>
                <p><strong>Velocity:</strong> ${this.currentAsteroid.velocity} km/s</p>
                <p><strong>Time to Impact:</strong> ${this.currentAsteroid.timeToImpact} seconds</p>
                <p><strong>Threat Level:</strong> ${this.getThreatLevel()}</p>
            </div>
        `;
        
        // Show deflection options
        document.getElementById('deflectionOptions').style.display = 'block';
        document.getElementById('gameResults').style.display = 'none';
    }
    
    getThreatLevel() {
        const energy = 0.5 * this.currentAsteroid.diameter * this.currentAsteroid.velocity * this.currentAsteroid.velocity;
        if (energy > 1000000) return "EXTREME";
        if (energy > 500000) return "HIGH";
        if (energy > 100000) return "MEDIUM";
        return "LOW";
    }
    
    selectDeflectionStrategy(strategy) {
        this.selectedStrategy = strategy;
        
        // Remove previous selection
        document.querySelectorAll('.deflection-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked button
        event.target.closest('.deflection-btn').classList.add('selected');
        
        // Execute strategy after a short delay
        setTimeout(() => {
            this.executeStrategy(strategy);
        }, 1000);
    }
    
    executeStrategy(strategy) {
        const strategies = {
            kinetic: { cost: 1000, effectiveness: 0.8, time: 50 },
            gravity: { cost: 2000, effectiveness: 0.6, time: 100 },
            nuclear: { cost: 5000, effectiveness: 0.9, time: 30 },
            laser: { cost: 3000, effectiveness: 0.7, time: 60 }
        };
        
        const strategyData = strategies[strategy];
        const success = Math.random() < strategyData.effectiveness;
        
        if (success) {
            this.score += Math.floor(strategyData.effectiveness * 1000 * this.level);
            this.level++;
            this.showGameResult(true, strategyData);
        } else {
            this.score -= 500;
            this.showGameResult(false, strategyData);
        }
        
        this.updateGameUI();
    }
    
    showGameResult(success, strategyData) {
        const resultsDiv = document.getElementById('gameResults');
        const titleDiv = document.getElementById('gameResultTitle');
        const textDiv = document.getElementById('gameResultText');
        
        if (success) {
            titleDiv.textContent = "✅ Mission Successful!";
            textDiv.textContent = `The ${strategyData.name || 'deflection strategy'} successfully deflected the asteroid! Score: +${Math.floor(strategyData.effectiveness * 1000 * this.level)}`;
        } else {
            titleDiv.textContent = "❌ Mission Failed!";
            textDiv.textContent = `The ${strategyData.name || 'deflection strategy'} failed to deflect the asteroid in time. Score: -500`;
        }
        
        resultsDiv.style.display = 'block';
        document.getElementById('deflectionOptions').style.display = 'none';
    }
    
    nextGameLevel() {
        this.spawnRandomAsteroid();
    }
    
    updateGameUI() {
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameLevel').textContent = this.level;
    }
    
    endGame() {
        this.isActive = false;
        clearInterval(this.gameTimer);
        
        const resultsDiv = document.getElementById('gameResults');
        const titleDiv = document.getElementById('gameResultTitle');
        const textDiv = document.getElementById('gameResultText');
        
        titleDiv.textContent = "🏆 Game Over!";
        textDiv.textContent = `Final Score: ${this.score} | Level Reached: ${this.level}`;
        
        resultsDiv.style.display = 'block';
        document.getElementById('deflectionOptions').style.display = 'none';
    }
    
    exit() {
        this.isActive = false;
        clearInterval(this.gameTimer);
        document.getElementById('gamificationPanel').style.display = 'none';
    }
}

// ================= SOCIAL SHARING =================
class SocialSharing {
    constructor() {
        this.shareData = {
            title: 'NASA Asteroid Impact Simulation',
            text: 'Check out this asteroid impact simulation!',
            url: window.location.href
        };
    }
    
    async shareResults(simulationData) {
        const shareText = `Asteroid Impact Simulation Results:
🌍 Location: ${simulationData.location || 'Custom Location'}
☄️ Asteroid: ${simulationData.asteroid?.name || 'Custom Asteroid'}
💥 Energy: ${simulationData.energy || 'N/A'} MT TNT
🌊 Tsunami Height: ${simulationData.tsunami || 'N/A'} m
🏔️ Crater Diameter: ${simulationData.crater || 'N/A'} km

#AsteroidImpact #NASA #SpaceScience`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.shareData.title,
                    text: shareText,
                    url: this.shareData.url
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            this.fallbackShare(shareText);
        }
    }
    
    fallbackShare(text) {
        // Create a temporary textarea to copy text
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        showToast('Text copied to clipboard!');
    }
    
    exportToPDF(simulationData) {
        // Simple PDF generation using browser print
        const printWindow = window.open('', '_blank');
        const content = this.generateReportContent(simulationData);
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Asteroid Impact Simulation Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #0f3460; }
                        .section { margin: 20px 0; }
                        .data { background: #f5f5f5; padding: 10px; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }
    
    exportToJSON(simulationData) {
        const dataStr = JSON.stringify(simulationData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'asteroid-simulation-data.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    exportToCSV(simulationData) {
        const csvContent = this.convertToCSV(simulationData);
        const dataBlob = new Blob([csvContent], {type: 'text/csv'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'asteroid-simulation-data.csv';
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    generateReportContent(data) {
        return `
            <h1>NASA Asteroid Impact Simulation Report</h1>
            <div class="section">
                <h2>Simulation Parameters</h2>
                <div class="data">
                    <p><strong>Asteroid:</strong> ${data.asteroid?.name || 'Custom'}</p>
                    <p><strong>Diameter:</strong> ${data.asteroid?.diameter || 'N/A'} m</p>
                    <p><strong>Velocity:</strong> ${data.asteroid?.velocity || 'N/A'} km/s</p>
                    <p><strong>Location:</strong> ${data.location || 'Custom Location'}</p>
                </div>
            </div>
            <div class="section">
                <h2>Impact Results</h2>
                <div class="data">
                    <p><strong>Energy:</strong> ${data.energy || 'N/A'} MT TNT</p>
                    <p><strong>Crater Diameter:</strong> ${data.crater || 'N/A'} km</p>
                    <p><strong>Tsunami Height:</strong> ${data.tsunami || 'N/A'} m</p>
                    <p><strong>Seismic Magnitude:</strong> ${data.seismic || 'N/A'}</p>
                </div>
            </div>
        `;
    }
    
    convertToCSV(data) {
        const headers = ['Parameter', 'Value', 'Unit'];
        const rows = [
            ['Asteroid Name', data.asteroid?.name || 'Custom', ''],
            ['Diameter', data.asteroid?.diameter || 'N/A', 'm'],
            ['Velocity', data.asteroid?.velocity || 'N/A', 'km/s'],
            ['Impact Energy', data.energy || 'N/A', 'MT TNT'],
            ['Crater Diameter', data.crater || 'N/A', 'km'],
            ['Tsunami Height', data.tsunami || 'N/A', 'm'],
            ['Seismic Magnitude', data.seismic || 'N/A', 'Richter Scale']
        ];
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// ================= EDUCATIONAL OVERLAY =================
class EducationalOverlay {
    constructor() {
        this.tooltips = new Map();
        this.initTooltips();
    }
    
    initTooltips() {
        const terms = {
            'eccentricity': {
                title: 'Orbital Eccentricity',
                content: 'How elliptical an orbit is. 0 = perfect circle, 1 = straight line.',
                formula: 'e = √(1 - (b²/a²))'
            },
            'impact-energy': {
                title: 'Kinetic Impact Energy',
                content: 'Energy released when asteroid hits Earth',
                formula: 'KE = ½ × mass × velocity²'
            },
            'crater-diameter': {
                title: 'Crater Diameter',
                content: 'Size of impact crater based on energy and target material',
                formula: 'D = 1.8 × (diameter^0.78) × (velocity^0.44)'
            },
            'seismic-magnitude': {
                title: 'Seismic Magnitude',
                content: 'Measure of earthquake strength on Richter scale',
                formula: 'M = log₁₀(A/T) + 1.66×log₁₀(D) + 3.3'
            },
            'tsunami-height': {
                title: 'Tsunami Wave Height',
                content: 'Height of tsunami waves generated by ocean impact',
                formula: 'H = 0.5 × (energy^0.25) × (depth^-0.5)'
            }
        };
        
        Object.entries(terms).forEach(([id, data]) => {
            this.createTooltip(id, data);
        });
    }
    
    createTooltip(elementId, data) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'educational-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${data.title}</div>
            <div class="tooltip-content">${data.content}</div>
            <div class="tooltip-formula">${data.formula}</div>
        `;
        
        document.body.appendChild(tooltip);
        
        element.addEventListener('mouseenter', (e) => this.showTooltip(tooltip, e));
        element.addEventListener('mouseleave', () => this.hideTooltip(tooltip));
        element.addEventListener('mousemove', (e) => this.updateTooltipPosition(tooltip, e));
    }
    
    showTooltip(tooltip, event) {
        tooltip.classList.add('visible');
        this.updateTooltipPosition(tooltip, event);
    }
    
    hideTooltip(tooltip) {
        tooltip.classList.remove('visible');
    }
    
    updateTooltipPosition(tooltip, event) {
        const rect = tooltip.getBoundingClientRect();
        const x = event.clientX + 10;
        const y = event.clientY - rect.height - 10;
        
        tooltip.style.left = Math.min(x, window.innerWidth - rect.width - 10) + 'px';
        tooltip.style.top = Math.max(y, 10) + 'px';
    }
}

// ================= REGIONAL ANALYSIS =================
class RegionalAnalysis {
    constructor() {
        this.regions = {
            'coastal-cities': {
                name: 'Coastal Cities',
                tsunamiRisk: 'High',
                populationDensity: 'Very High',
                evacuationTime: '2-4 hours',
                specificRisks: ['Tsunami', 'Storm Surge', 'Flooding']
            },
            'mountainous': {
                name: 'Mountainous Regions',
                tsunamiRisk: 'None',
                landslideRisk: 'High',
                populationDensity: 'Low',
                specificRisks: ['Landslides', 'Avalanches', 'Rock Falls']
            },
            'desert': {
                name: 'Desert Regions',
                tsunamiRisk: 'None',
                sandstormRisk: 'High',
                populationDensity: 'Very Low',
                specificRisks: ['Sandstorms', 'Dust Clouds', 'Heat Waves']
            },
            'urban': {
                name: 'Urban Areas',
                tsunamiRisk: 'Low',
                populationDensity: 'Extremely High',
                evacuationTime: '6-12 hours',
                specificRisks: ['Building Collapse', 'Firestorms', 'Infrastructure Damage']
            }
        };
    }
    
    analyzeRegion(lat, lon) {
        const region = this.determineRegion(lat, lon);
        const analysis = this.regions[region];
        
        return {
            region: analysis,
            specificRisks: this.calculateSpecificRisks(lat, lon, analysis),
            mitigationStrategies: this.getMitigationStrategies(analysis),
            evacuationRoutes: this.getEvacuationRoutes(lat, lon)
        };
    }
    
    determineRegion(lat, lon) {
        // Simple region determination based on coordinates
        if (this.isCoastal(lat, lon)) return 'coastal-cities';
        if (this.isMountainous(lat, lon)) return 'mountainous';
        if (this.isDesert(lat, lon)) return 'desert';
        return 'urban';
    }
    
    isCoastal(lat, lon) {
        // Simple coastal detection
        const coastalThreshold = 0.1;
        const majorCoasts = [
            {lat: 40.7, lon: -74.0}, {lat: 34.0, lon: -118.2},
            {lat: 51.5, lon: -0.1}, {lat: 35.7, lon: 139.7}
        ];
        return majorCoasts.some(coast => 
            Math.abs(lat - coast.lat) < coastalThreshold && 
            Math.abs(lon - coast.lon) < coastalThreshold
        );
    }
    
    isMountainous(lat, lon) {
        // Simple mountainous region detection
        const mountainRanges = [
            {lat: 39.0, lon: -105.0}, // Rocky Mountains
            {lat: 46.0, lon: 7.0},    // Alps
            {lat: 28.0, lon: 84.0}    // Himalayas
        ];
        return mountainRanges.some(mountain => 
            Math.abs(lat - mountain.lat) < 5 && 
            Math.abs(lon - mountain.lon) < 5
        );
    }
    
    isDesert(lat, lon) {
        // Simple desert region detection
        const deserts = [
            {lat: 23.0, lon: 2.0},    // Sahara
            {lat: 25.0, lon: 45.0},   // Arabian Desert
            {lat: -25.0, lon: 130.0}  // Australian Desert
        ];
        return deserts.some(desert => 
            Math.abs(lat - desert.lat) < 10 && 
            Math.abs(lon - desert.lon) < 10
        );
    }
    
    calculateSpecificRisks(lat, lon, region) {
        const risks = [...region.specificRisks];
        
        // Add location-specific risks
        if (lat > 60 || lat < -60) risks.push('Polar Conditions');
        if (Math.abs(lon) > 150) risks.push('Remote Location');
        
        return risks;
    }
    
    getMitigationStrategies(region) {
        const strategies = {
            'coastal-cities': [
                'Tsunami warning systems',
                'Coastal evacuation routes',
                'Flood barriers and sea walls'
            ],
            'mountainous': [
                'Landslide monitoring',
                'Avalanche control systems',
                'Mountain evacuation protocols'
            ],
            'desert': [
                'Dust storm shelters',
                'Water supply protection',
                'Heat wave management'
            ],
            'urban': [
                'Building reinforcement',
                'Mass evacuation plans',
                'Infrastructure protection'
            ]
        };
        
        return strategies[region.name.toLowerCase().replace(' ', '-')] || [];
    }
    
    getEvacuationRoutes(lat, lon) {
        return {
            primary: this.calculatePrimaryRoute(lat, lon),
            secondary: this.calculateSecondaryRoute(lat, lon),
            estimatedTime: this.estimateEvacuationTime(lat, lon)
        };
    }
    
    calculatePrimaryRoute(lat, lon) {
        // Simplified evacuation route calculation
        return `Primary route: Head ${lat > 0 ? 'north' : 'south'} to higher ground`;
    }
    
    calculateSecondaryRoute(lat, lon) {
        return `Secondary route: Head ${lon > 0 ? 'east' : 'west'} to safe zone`;
    }
    
    estimateEvacuationTime(lat, lon) {
        // Simple time estimation based on population density
        const baseTime = 2; // hours
        const populationFactor = this.getPopulationDensity(lat, lon);
        return Math.round(baseTime * populationFactor);
    }
    
    getPopulationDensity(lat, lon) {
        // Simplified population density estimation
        if (this.isUrban(lat, lon)) return 3;
        if (this.isCoastal(lat, lon)) return 2;
        return 1;
    }
    
    isUrban(lat, lon) {
        const cities = [
            {lat: 40.7, lon: -74.0}, {lat: 51.5, lon: -0.1},
            {lat: 35.7, lon: 139.7}, {lat: 48.9, lon: 2.4}
        ];
        return cities.some(city => 
            Math.abs(lat - city.lat) < 1 && 
            Math.abs(lon - city.lon) < 1
        );
    }
}

// ================= ACCESSIBILITY FUNCTIONS =================
function toggleHighContrast() {
    accessibilityMode.highContrast = !accessibilityMode.highContrast;
    document.body.classList.toggle('high-contrast', accessibilityMode.highContrast);
    
    const btn = event.target.closest('.accessibility-btn');
    btn.classList.toggle('active', accessibilityMode.highContrast);
    
    showToast(accessibilityMode.highContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
}

function toggleReducedMotion() {
    accessibilityMode.reducedMotion = !accessibilityMode.reducedMotion;
    document.body.classList.toggle('reduced-motion', accessibilityMode.reducedMotion);
    
    const btn = event.target.closest('.accessibility-btn');
    btn.classList.toggle('active', accessibilityMode.reducedMotion);
    
    showToast(accessibilityMode.reducedMotion ? 'Reduced motion enabled' : 'Reduced motion disabled');
}

function toggleColorblindMode() {
    accessibilityMode.colorblind = !accessibilityMode.colorblind;
    document.body.classList.toggle('colorblind-mode', accessibilityMode.colorblind);
    
    const btn = event.target.closest('.accessibility-btn');
    btn.classList.toggle('active', accessibilityMode.colorblind);
    
    showToast(accessibilityMode.colorblind ? 'Colorblind mode enabled' : 'Colorblind mode disabled');
}

function showKeyboardShortcuts() {
    document.getElementById('keyboardShortcutsModal').style.display = 'flex';
}

function closeKeyboardShortcuts() {
    document.getElementById('keyboardShortcutsModal').style.display = 'none';
}

// ================= GAMIFICATION FUNCTIONS =================
function toggleGamificationMode() {
    if (!gamificationMode) {
        gamificationMode = new DefendEarthMode();
    }
    
    if (gamificationMode.isActive) {
        gamificationMode.exit();
    } else {
        gamificationMode.startGame();
    }
}

function selectDeflectionStrategy(strategy) {
    if (gamificationMode && gamificationMode.isActive) {
        gamificationMode.selectDeflectionStrategy(strategy);
    }
}

function nextGameLevel() {
    if (gamificationMode && gamificationMode.isActive) {
        gamificationMode.nextGameLevel();
    }
}

function exitGamificationMode() {
    if (gamificationMode) {
        gamificationMode.exit();
    }
}

// ================= SOCIAL SHARING FUNCTIONS =================
function showSocialSharing() {
    document.getElementById('socialSharingModal').style.display = 'flex';
}

function closeSocialSharing() {
    document.getElementById('socialSharingModal').style.display = 'none';
}

function shareToTwitter() {
    if (socialSharing) {
        const simulationData = getCurrentSimulationData();
        socialSharing.shareResults(simulationData);
    }
}

function shareToFacebook() {
    if (socialSharing) {
        const simulationData = getCurrentSimulationData();
        socialSharing.shareResults(simulationData);
    }
}

function shareToLinkedIn() {
    if (socialSharing) {
        const simulationData = getCurrentSimulationData();
        socialSharing.shareResults(simulationData);
    }
}

function copyToClipboard() {
    if (socialSharing) {
        const simulationData = getCurrentSimulationData();
        socialSharing.fallbackShare(JSON.stringify(simulationData, null, 2));
    }
}

function exportToPDF() {
    if (socialSharing) {
        const simulationData = getCurrentSimulationData();
        socialSharing.exportToPDF(simulationData);
    }
}

function exportToJSON() {
    if (socialSharing) {
        const simulationData = getCurrentSimulationData();
        socialSharing.exportToJSON(simulationData);
    }
}

function exportToCSV() {
    if (socialSharing) {
        const simulationData = getCurrentSimulationData();
        socialSharing.exportToCSV(simulationData);
    }
}

function getCurrentSimulationData() {
    return {
        asteroid: asteroidDatabase[currentAsteroidIndex],
        location: currentTarget.name,
        energy: document.getElementById('tntEquivalent')?.textContent || 'N/A',
        crater: document.getElementById('craterDiameter')?.textContent || 'N/A',
        tsunami: document.getElementById('tsunamiInfo')?.textContent || 'N/A',
        seismic: document.getElementById('seismicRadius')?.textContent || 'N/A'
    };
}

// ================= MOBILE FUNCTIONS =================
function toggleMobilePanel() {
    const panel = document.getElementById('controlsPanel');
    panel.classList.toggle('mobile-open');
}

function initMobileFeatures() {
    // Add touch gesture support
    let startX, startY;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.touches[0].clientX;
        const endY = e.touches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe left to open panel
        if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
            document.getElementById('controlsPanel').classList.add('mobile-open');
        }
        
        // Swipe right to close panel
        if (Math.abs(diffX) > Math.abs(diffY) && diffX < -50) {
            document.getElementById('controlsPanel').classList.remove('mobile-open');
        }
        
        startX = null;
        startY = null;
    });
}

// ================= KEYBOARD SHORTCUTS =================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case ' ':
                e.preventDefault();
                if (typeof launchAsteroid === 'function') launchAsteroid();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                if (typeof resetSimulation === 'function') resetSimulation();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                // Toggle 2D map
                const mapContainer = document.querySelector('.map2d-container');
                if (mapContainer) {
                    mapContainer.style.display = mapContainer.style.display === 'none' ? 'block' : 'none';
                }
                break;
            case 'Escape':
                e.preventDefault();
                // Close all modals
                document.querySelectorAll('.modal, .keyboard-shortcuts-modal, .social-sharing-modal').forEach(modal => {
                    modal.style.display = 'none';
                });
                break;
            case 'g':
            case 'G':
                e.preventDefault();
                if (typeof toggleGamificationMode === 'function') toggleGamificationMode();
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                showKeyboardShortcuts();
                break;
        }
    });
}
// Add CSS for enhanced animations
const style = document.createElement('style');
style.textContent = `
            .ai-eye {
                animation: blinkEyes 4s infinite;
            }
            @keyframes blinkEyes {
                0%, 96%, 100% { height: 20px; }
                98% { height: 5px; }
            }
            .ai-mouth.enhanced-talking {
                height: 15px;
                border-radius: 10px;
            }
            .impact-item.highlighted {
                background: rgba(79, 195, 247, 0.2) !important;
                border-left: 4px solid #4fc3f7 !important;
                transition: all 0.3s ease;
            }
        `;
    document.head.appendChild(style);

/* --- script block separator --- */

(function () {
    // Guard against double-injection
    if (window.__AvatarEnhancementsLoaded) return;
    window.__AvatarEnhancementsLoaded = true;
    const container = document.getElementById('aiAvatar');
    const mouth = document.getElementById('aiMouth');
    const statusEl = document.getElementById('aiStatus');
    const speechBubble = document.querySelector('.speech-bubble') || (function () {
        // disabled: do not show bubble
        const b = document.createElement('div');
        b.className = 'speech-bubble';
        b.style.display = 'none';
        container.appendChild(b);
        return b;
    })();
    // Build a voice selector
    let voiceSelect = document.createElement('select');
    voiceSelect.className = 'avatar-voice-select';
    voiceSelect.title = 'Narrator Voice';
    container.appendChild(voiceSelect);
    // === Speech Synthesis wiring ===
    const synth = window.speechSynthesis;
    let voices = [];
    let speaking = false;
    let muted = false;
    let currentUtterance = null;
    let queued = [];
    let skipRequested = false;
    let pauseRequested = false;
    // Avatar narration pitch control
    let avatarPitch = 1.0; // default pitch
    function setAvatarPitch(p) {
        avatarPitch = Math.max(0.5, Math.min(2.0, Number(p) || 1.0));
    }
    window.setAvatarPitch = setAvatarPitch;

    function populateVoices() {
        voices = synth.getVoices().filter(v => !/deprecated/i.test(v.name || ''));
        voiceSelect.innerHTML = '';
        let davidIndex = -1;
        voices.forEach((v, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `${v.name} — ${v.lang}`;
            if (/Microsoft\s*David/i.test(v.name)) davidIndex = i;
            voiceSelect.appendChild(opt);
        });
        // Default to Microsoft David if present; else pick an English voice
        if (davidIndex >= 0) {
            voiceSelect.selectedIndex = davidIndex;
        } else {
            const idx = voices.findIndex(v => /en(-|_)?US/i.test(v.lang) && /Microsoft/i.test(v.name));
            voiceSelect.selectedIndex = idx >= 0 ? idx : 0;
        }
    }
    populateVoices();
    if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.onvoiceschanged = populateVoices;
    }

    function setStatus(text) {
        statusEl.textContent = text;
    }

    function setMouthTalking(on) {
        if (!mouth) return;
        mouth.classList.toggle('talking', !!on);
    }
    // Read speech volume from the main Volume slider (0..100)
    function getSpeechVolume() {
        const slider = document.getElementById('volumeSlider');
        if (!slider) return 1.0;
        const v = parseInt(slider.value || '100', 10);
        return Math.max(0, Math.min(1, v / 100));
    }

    function flyIn() {
        container.classList.remove('fly-out');
        container.classList.add('visible', 'fly-in');
        setTimeout(() => container.classList.remove('fly-in'), 950);
    }

    function flyOut() {
        container.classList.add('fly-out');
        setTimeout(() => {
            container.classList.remove('fly-out', 'visible');
        }, 650);
    }
    // Public audio controls expected by existing buttons
    window.toggleAudio = function () {
        muted = !muted;
        setStatus(muted ? 'Audio muted' : 'Audio on');
        if (muted && speaking) {
            synth.cancel();
            cleanupHighlights();
            setMouthTalking(false);
            speaking = false;
        }
    };
    // Expose mute state for external checks
    window.isAvatarMuted = function () { return !!muted; };
    window.skipExplanation = function () {
        skipRequested = true;
        synth.cancel();
    };
    window.changeLanguage = function () {
        // Move selection to the next voice
        if (!voiceSelect.options.length) return;
        const next = (voiceSelect.selectedIndex + 1) % voiceSelect.options.length;
        voiceSelect.selectedIndex = next;
        setStatus('Voice: ' + voiceSelect.options[next].textContent);
    };
    // ================ NARRATION CORE =================
    // reads all Impact Analysis lists, with highlighting and auto-scroll
    function collectImpactText() {
        const sections = ['immediateEffects', 'secondaryEffects', 'longTermEffects', 'globalEffects'];
        const chunks = [];
        sections.forEach(id => {
            const container = document.getElementById(id);
            if (!container) return;
            // target .impact-item & text within
            container.querySelectorAll('.impact-item, .impact-title, .impact-description, li, p, span').forEach(el => {
                const text = (el.innerText || '').trim();
                if (text && text.length > 1) {
                    chunks.push({
                        el,
                        text
                    });
                }
            });
        });
        return chunks;
    }

    function cleanupHighlights() {
        document.querySelectorAll('.reading-highlight, .reading-secondary').forEach(e => {
            e.classList.remove('reading-highlight', 'reading-secondary');
        });
    }

    function highlightWindow(chunks, i) {
        cleanupHighlights();
        const primary = chunks[i];
        if (!primary) return;

        primary.el.classList.add('reading-highlight');
        primary.el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'      // prevents horizontal scrolling
        });
        // also lightly mark the next two items to satisfy "highlight in three places"
        if (chunks[i + 1]) chunks[i + 1].el.classList.add('reading-secondary');
        if (chunks[i + 2]) chunks[i + 2].el.classList.add('reading-secondary');
    }


    async function speakQueue(lines) {
        speaking = true;
        setMouthTalking(true);

        flyIn();
        setStatus('Narrating impact analysis…');
        // Raise pitch for impact analysis narration
        setAvatarPitch(1.6);
        for (let i = 0; i < lines.length; i++) {
            if (skipRequested) break;
            // highlightWindow(lines, i);
            const part = lines[i].text;
            await speak(part);
            if (pauseRequested || skipRequested) break;
        }
        // cleanupHighlights();
        setMouthTalking(false);
        speaking = false;
        if (!skipRequested) setStatus('Narration complete');
        skipRequested = false;
        // Reset pitch back to normal
        setAvatarPitch(1.0);
        // After a short beat, fly out
        setTimeout(flyOut, 1200);
    }

    function pickVoice() {
        const idx = voiceSelect.selectedIndex >= 0 ? voiceSelect.selectedIndex : 0;
        return voices[idx] || null;
    }


    function speak(text) {
        console.log("Speaking");

        if (lastText.includes(text)) {
            console.log("Prevent peaking");
            return;
        }
        lastText = text;
        console.log(text);


        return new Promise((resolve) => {
            if (muted || !text) return resolve();
            const u = new SpeechSynthesisUtterance(text);
            currentUtterance = u;
            const v = pickVoice();
            if (v) u.voice = v;
            // Pace reasonably for comprehension
            u.rate = 0.95;
            u.pitch = avatarPitch; // use current avatar pitch (high during impact narration)
            u.volume = getSpeechVolume();
            u.onstart = () => {
                setMouthTalking(true);
                if (speechBubble) {
                    speechBubble.textContent = text;
                };
                if (speechBubble && speechBubble.classList) {
                    speechBubble.classList.add('visible');
                };
            };
            u.onend = () => {
                setMouthTalking(false);
                if (speechBubble && speechBubble.classList) {
                    speechBubble.classList.remove('visible');
                };
                currentUtterance = null;
                resolve();
            };
            u.onerror = () => {
                setMouthTalking(false);
                resolve();
            };
            // Rough mouth sync: toggle during long sentences
            u.onboundary = (ev) => {
                if (ev.name === 'word' || ev.charIndex % 8 === 0) {
                    mouth.classList.toggle('talking');
                }
            };
            synth.speak(u)
        });
    }



    // Public API to start narration (call after your Impact panel is populated)
    window.startAvatarNarration = function (fullText) {
        if (speaking) {
            return;
        }
        const parts = collectImpactText();
        if (!parts.length) {
            setStatus('No analysis text to read yet');
            return;
        }
        speakQueue(parts);
    };
    
    // Example hook: if your app already calls openImpactResults(), you can auto-start here.
    const resultsPanel = document.getElementById('impactResultsPanel');
    if (resultsPanel) {
        const obs = new MutationObserver((muts) => {
            const isShown = resultsPanel.classList.contains('show') || resultsPanel.style.transform === 'translateX(0)';
            if (isShown && !speaking) {
                // give the UI a moment to render, then read
            }
        });
        obs.observe(resultsPanel, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
    // Also expose a convenience method to read any plain string array with highlighting elements
    window.avatarSpeakLines = async function (texts) {
        const chunks = texts.map(t => ({
            el: speechBubble,
            text: t
        }));
        await speakQueue(chunks);
    };
    // Volume control helpers (adjust the main Volume slider)
    function setVolumeSlider(val) {
        const slider = document.getElementById('volumeSlider');
        if (!slider) return;
        const v = Math.max(0, Math.min(100, val|0));
        slider.value = v;
        const display = document.getElementById('volumeValue');
        if (display) display.textContent = v + ' %';
        if (typeof showToast === 'function') showToast('Avatar volume: ' + v + '%');
    }
    window.avatarVolumeUp = function() {
        const slider = document.getElementById('volumeSlider');
        const v = slider ? parseInt(slider.value||'0',10) : 0;
        setVolumeSlider(v + 10);
    };
    window.avatarVolumeDown = function() {
        const slider = document.getElementById('volumeSlider');
        const v = slider ? parseInt(slider.value||'0',10) : 0;
        setVolumeSlider(v - 10);
    };
    // Stop narration immediately
    window.stopAvatarVoice = function () {
        try {
            synth.cancel();
        } catch(_) {}
        skipRequested = true;
        cleanupHighlights();
        setMouthTalking(false);
        speaking = false;
        setStatus('Voice stopped');
    };
    // Simple test voice function for UI button
    window.testAvatarVoice = function () {
        try {
            // Use the avatar pipeline if available
            if (typeof window.avatarSpeakLines === 'function') {
                setAvatarPitch(1.4);
                window.avatarSpeakLines([
                    'Voice check. Impact analysis narration is ready.'
                ]).then(() => setAvatarPitch(1.0));
                setStatus('Testing voice…');
                return;
            }
        } catch (_) {}
        // Fallback to basic speech synthesis
        try {
            const synth = window.speechSynthesis;
            if (!synth) return;
            const u = new SpeechSynthesisUtterance('Voice check. Impact analysis narration is ready.');
            u.rate = 0.95; u.pitch = 1.4; u.volume = getSpeechVolume();
            synth.cancel();
            synth.speak(u);
        } catch (_) {}
    };
    // Keyboard shortcuts for live demos
    window.addEventListener('keydown', (e) => {
        if (e.key === ' ') { // space = pause/resume
            e.preventDefault();
            if (!speaking) {
                window.startAvatarNarrationOnce();
                return;
            }
            if (synth.speaking && !synth.paused) {
                synth.pause();
                pauseRequested = true;
                setMouthTalking(false);
                setStatus('Paused');
            } else if (synth.paused) {
                synth.resume();
                pauseRequested = false;
                setMouthTalking(true);
                setStatus('Resumed');
            }
        } else if (e.key === 'Escape') {
            synth.cancel();
            skipRequested = true;
            cleanupHighlights();
            setMouthTalking(false);
            speaking = false;
            setStatus('Skipped');
        }
    });
    // Make avatar visible & idle-ready
    container.classList.add('visible');
    setStatus('Ready to analyze');
})();

/* --- script block separator --- */

// Prevent double narration
window.__narrationTriggered = false;

// Expose a safe, idempotent trigger for avatar narration
window.startAvatarNarrationOnce = function () {
    if (window.__narrationTriggered) return;
    window.__narrationTriggered = true;
    try {
        // Ensure speech is unlocked on some browsers
        try { ensureSpeechUnlocked(); } catch (_) {}
        // Warn if muted or volume is zero
        try {
            if (typeof window.isAvatarMuted === 'function' && window.isAvatarMuted()) {
                if (typeof showToast === 'function') showToast('Avatar audio was muted. Enabling audio…');
                if (typeof window.toggleAudio === 'function') {
                    try { window.toggleAudio(); } catch(_) {}
                }
            }
        } catch (_) {}
        try {
            const volEl = document.getElementById('volumeSlider');
            if (volEl && parseInt(volEl.value || '0', 10) === 0) {
                if (typeof showToast === 'function') showToast('Volume was 0%. Setting to 70% for narration.');
                volEl.value = 70;
                const display = document.getElementById('volumeValue');
                if (display) display.textContent = '70 %';
                try { if (typeof window.setVolume === 'function') window.setVolume(70); } catch(_) {}
            }
        } catch (_) {}
        if (typeof window.startAvatarNarration === 'function') {
            // Use the enhanced avatar narrator if present
            return window.startAvatarNarration();
        }
        // Fallback: speak visible analysis text directly
        const panel = document.getElementById('impactResultsPanel');
        if (!panel) return;
        const items = panel.querySelectorAll('.impact-item, .impact-title, .impact-description, .impact-list li');
        const text = Array.from(items).map(el => (el.innerText || '').trim()).filter(Boolean).join('. ');
        if (!text) return;
        const synth = window.speechSynthesis;
        if (!synth) return;
        const utter = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        utter.voice = (voices || []).find(v => /english|en/i.test(v.lang || v.name)) || voices[0] || null;
        utter.rate = 0.95;
        utter.pitch = 1.6; // higher pitch as requested
        utter.volume = 0.95;
        synth.cancel();
        synth.speak(utter);
    } catch (e) {
        console.error('Avatar narration fallback failed:', e);
    }
};

// Reset helper for simulation reset flows
function resetNarrationFlag() {
    window.__narrationTriggered = false;
}

/* --- script block separator --- */

(function () {
    const synth = window.speechSynthesis;
    const mouth = document.getElementById("mouth");
    if (!mouth) return;

    function openMouth(open) {
        if (open) {
            mouth.setAttribute("height", "22");
        } else {
            mouth.setAttribute("height", "12");
        }
    }
    const oldSpeakText = window.speakText;
    window.speakText = function (text) {
        const utter = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        utter.voice = voices.find(v => /david/i.test(v.name)) || voices[0];
        utter.onboundary = (e) => {
            openMouth(true);
            setTimeout(() => openMouth(false), 150);
        };
        utter.onend = () => openMouth(false);
        synth.cancel();
        synth.speak(utter);
        return utter;
    };
})();

/* --- script block separator --- */

/* ================== CONFIG ==================
   Quick tweak settings for behavior + appearance
------------------------------------------------- */
const CONFIG = {
    eyeGlanceMin: 4000, // ms min between glances
    eyeGlanceMax: 10000, // ms max between glances
    glanceOffset: 4, // px shift for glance
    glanceDuration: 350, // ms duration of glance
};

/* ================== EYE GLANCE RANDOMIZER ================== */
(function () {
    const eyesGroup = document.getElementById('eyes');

    function randomGlance() {
        const dir = Math.random() < 0.5 ? -1 : 1;
        eyesGroup.style.transition = `transform ${CONFIG.glanceDuration}ms ease`;
        eyesGroup.style.transform = `translate(${dir*CONFIG.glanceOffset}px,0)`;
        setTimeout(() => {
            eyesGroup.style.transform = 'translate(0,0)';
        }, CONFIG.glanceDuration + 50);
        scheduleNextGlance();
    }

    function scheduleNextGlance() {
        const ms = CONFIG.eyeGlanceMin + Math.random() * (CONFIG.eyeGlanceMax - CONFIG.eyeGlanceMin);
        setTimeout(randomGlance, ms);
    }
    scheduleNextGlance();
})();

// Create realistic asteroid geometry with irregular surfaces - Enhanced for NASA Eyes style
function createRealisticAsteroidGeometry(radius = 1, roughness = 0.2, irregularity = 0.3, scaleX = 1, scaleY = 1, scaleZ = 1, shape = 'spherical') {
    let geometry;
    
    // Create base geometry based on shape with higher detail
    switch (shape) {
        case 'diamond':
            geometry = new THREE.OctahedronGeometry(radius, 3);
            break;
        case 'peanut':
            // Create more detailed peanut shape
            const sphere1 = new THREE.SphereGeometry(radius * 0.6, 24, 24);
            const sphere2 = new THREE.SphereGeometry(radius * 0.6, 24, 24);
            sphere1.translate(radius * 0.5, 0, 0);
            sphere2.translate(-radius * 0.5, 0, 0);
            geometry = new THREE.BufferGeometry();
            const positions1 = sphere1.attributes.position.array;
            const positions2 = sphere2.attributes.position.array;
            const normals1 = sphere1.attributes.normal.array;
            const normals2 = sphere2.attributes.normal.array;
            const indices1 = sphere1.index.array;
            const indices2 = sphere2.index.array;
            
            geometry.setAttribute('position', new THREE.BufferAttribute(
                new Float32Array([...positions1, ...positions2]), 3));
            geometry.setAttribute('normal', new THREE.BufferAttribute(
                new Float32Array([...normals1, ...normals2]), 3));
            geometry.setIndex([...indices1, ...indices2.map(i => i + positions1.length / 3)]);
            break;
        case 'bennu':
            // More detailed Bennu shape with characteristic ridges
            geometry = new THREE.SphereGeometry(radius, 48, 48);
            break;
        case 'ryugu':
            // Diamond-shaped Ryugu with more detail
            geometry = new THREE.SphereGeometry(radius, 36, 36);
            break;
        case 'itokawa':
            // Irregular potato-shaped asteroid
            geometry = new THREE.SphereGeometry(radius, 40, 40);
            break;
        case 'eros':
            // Elongated Eros shape
            geometry = new THREE.SphereGeometry(radius, 48, 48);
            break;
        case 'gaspra':
            // Irregular Gaspra shape
            geometry = new THREE.SphereGeometry(radius, 44, 44);
            break;
        default:
            geometry = new THREE.SphereGeometry(radius, 48, 48);
    }
    
    // Apply scaling
    geometry.scale(scaleX, scaleY, scaleZ);
    
    // Add realistic surface irregularities with multiple noise layers
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;
    
    // Create crater data for realistic surface features
    const craters = [];
    const numCraters = Math.floor(radius * 20 + Math.random() * 10);
    for (let i = 0; i < numCraters; i++) {
        craters.push({
            center: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize().multiplyScalar(radius * (0.7 + Math.random() * 0.3)),
            size: Math.random() * 0.3 + 0.1,
            depth: Math.random() * 0.2 + 0.05
        });
    }
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];
        
        // Calculate distance from center for more realistic deformation
        const distance = Math.sqrt(x * x + y * y + z * z);
        const normalizedDistance = distance / radius;
        
        // Multi-layered noise for realistic surface
        const noise1 = (Math.sin(x * 15) + Math.cos(y * 12) + Math.sin(z * 18)) * 0.08;
        const noise2 = (Math.sin(x * 30) + Math.cos(y * 25) + Math.sin(z * 35)) * 0.04;
        const noise3 = (Math.sin(x * 8) + Math.cos(y * 10) + Math.sin(z * 14)) * 0.12;
        const noise4 = (Math.sin(x * 50) + Math.cos(y * 45) + Math.sin(z * 55)) * 0.02;
        
        const totalNoise = (noise1 + noise2 + noise3 + noise4) * roughness;
        const irregularityFactor = 1 + (Math.random() - 0.5) * irregularity;
        
        // Apply crater effects
        let craterEffect = 0;
        const currentPos = new THREE.Vector3(x, y, z);
        craters.forEach(crater => {
            const distanceToCrater = currentPos.distanceTo(crater.center);
            if (distanceToCrater < crater.size * radius) {
                const craterInfluence = 1 - (distanceToCrater / (crater.size * radius));
                craterEffect += craterInfluence * crater.depth * 0.3;
            }
        });
        
        // Apply deformation
        const deformation = (totalNoise * irregularityFactor - craterEffect) * normalizedDistance;
        
        positions[i] += x * deformation;
        positions[i + 1] += y * deformation;
        positions[i + 2] += z * deformation;
    }
    
    // Recalculate normals for proper lighting
    geometry.computeVertexNormals();
    
    return geometry;
}


// Show asteroid discovery story
function showAsteroidStory() {
    const asteroid = asteroidDatabase[currentAsteroidIndex];
    const storyModal = document.createElement('div');
    storyModal.className = 'asteroid-story-modal';
    storyModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🔍 ${asteroid.name} Discovery Story</h2>
                <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="story-content">
                <div class="asteroid-image">
                    <canvas id="storyAsteroidCanvas" width="200" height="200"></canvas>
                </div>
                <div class="story-text">
                    <h3>Discovery Details</h3>
                    <p><strong>Discovered:</strong> ${asteroid.discovered}</p>
                    <p><strong>Type:</strong> ${asteroid.type.charAt(0).toUpperCase() + asteroid.type.slice(1)}</p>
                    <p><strong>Shape:</strong> ${asteroid.shape.charAt(0).toUpperCase() + asteroid.shape.slice(1)}</p>
                    <p><strong>Description:</strong> ${asteroid.description}</p>
                    <div class="story-narrative">
                        <h4>Discovery Narrative</h4>
                        <p>${getAsteroidStory(asteroid)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(storyModal);
    
    // Create 3D asteroid preview for story
    createStoryAsteroidPreview(asteroid);
}

// Get detailed asteroid story
function getAsteroidStory(asteroid) {
    const stories = {
        'Chicxulub Impactor': `The Chicxulub impactor is the asteroid that struck Earth approximately 66 million years ago, creating the Chicxulub crater in Mexico. This massive impact is widely believed to have caused the Cretaceous-Paleogene extinction event, which wiped out the dinosaurs and many other species. The asteroid was approximately 10-15 kilometers in diameter and struck with the force of 100 trillion tons of TNT. The impact created a crater over 180 kilometers wide and triggered global climate change that lasted for years.`,
        'Apophis (99942)': `Apophis was discovered on June 19, 2004, by astronomers Roy Tucker, David Tholen, and Fabrizio Bernardi at the Kitt Peak National Observatory. Initially, there was concern that it might impact Earth in 2029, but further observations ruled out this possibility. However, it will make a very close approach to Earth on April 13, 2029, coming within 31,000 kilometers of Earth's surface. This will be the closest approach by an asteroid of this size in recorded history.`,
        'Bennu (101955)': `Bennu was discovered on September 11, 1999, by the LINEAR project. It's a carbonaceous asteroid that is the target of NASA's OSIRIS-REx mission. The spacecraft successfully collected samples from Bennu's surface in 2020. Bennu is considered a potentially hazardous asteroid due to its close approaches to Earth. It has a 1 in 2,700 chance of impacting Earth between 2175 and 2199.`,
        'Ryugu (162173)': `Ryugu was discovered on May 10, 1999, by the Lincoln Near-Earth Asteroid Research (LINEAR) project. It's a diamond-shaped asteroid that was visited by Japan's Hayabusa2 spacecraft. The mission successfully collected samples from Ryugu's surface and returned them to Earth in 2020. Ryugu is a carbonaceous asteroid, rich in organic compounds and water, making it valuable for understanding the early solar system.`,
        'Eros (433)': `Eros was discovered on August 13, 1898, by Carl Gustav Witt and Felix Linke at the Urania Observatory in Berlin. It was the first near-Earth asteroid to be discovered and is one of the largest near-Earth asteroids. NASA's NEAR Shoemaker spacecraft orbited Eros from 2000 to 2001, providing detailed images and data about its surface. Eros is an S-type asteroid, composed mainly of silicate rocks and metals.`
    };
    
    return stories[asteroid.name] || `This asteroid was discovered in ${asteroid.discovered} and represents an important object in our solar system. Its ${asteroid.type} composition and ${asteroid.shape} shape provide valuable insights into the formation and evolution of asteroids.`;
}

// Create 3D asteroid preview for story modal
function createStoryAsteroidPreview(asteroid) {
    setTimeout(() => {
        const canvas = document.getElementById('storyAsteroidCanvas');
        if (!canvas) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(200, 200);
        renderer.setClearColor(0x000000, 0);
        
        // Create asteroid geometry
        const geometry = createRealisticAsteroidGeometry(1, 0.2, 0.3, 1, 1, 1, asteroid.shape);
        const material = new THREE.MeshPhongMaterial({
            color: asteroid.type === 'rocky' ? 0x8B4513 : 
                   asteroid.type === 'metallic' ? 0x888888 :
                   asteroid.type === 'carbonaceous' ? 0x2F4F4F : 0xE6E6FA,
            shininess: 30,
            emissive: 0x222222,
            emissiveIntensity: 0.2
        });
        
        const asteroidMesh = new THREE.Mesh(geometry, material);
        scene.add(asteroidMesh);
        
        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        camera.position.z = 3;
        
        // Animate rotation
        function animate() {
            requestAnimationFrame(animate);
            asteroidMesh.rotation.x += 0.01;
            asteroidMesh.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    }, 100);
}


// Custom Asteroid Creator
function openCustomAsteroidCreator() {
    const modal = document.createElement('div');
    modal.className = 'custom-asteroid-modal';
    modal.id = 'customAsteroidModal';
    modal.innerHTML = `
        <div class="custom-asteroid-content">
            <div class="custom-asteroid-header">
                <h2>🛸 Create Your Own Asteroid</h2>
                <button class="close-story" onclick="closeCustomAsteroidCreator()">×</button>
            </div>
            <div class="custom-asteroid-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="customName">Asteroid Name</label>
                        <input type="text" id="customName" placeholder="Enter asteroid name" required>
                    </div>
                    <div class="form-group">
                        <label for="customCreator">Your Name</label>
                        <input type="text" id="customCreator" placeholder="Enter your name" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="customDiameter">Diameter (meters)</label>
                        <input type="number" id="customDiameter" min="1" max="10000" value="100" required>
                    </div>
                    <div class="form-group">
                        <label for="customVelocity">Velocity (km/s)</label>
                        <input type="number" id="customVelocity" min="1" max="100" value="17" step="0.1" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="customShape">Shape</label>
                        <select id="customShape" onchange="updateCustomPreview()">
                            <option value="spherical">Spherical</option>
                            <option value="elongated">Elongated</option>
                            <option value="diamond">Diamond</option>
                            <option value="potato">Potato</option>
                            <option value="irregular">Irregular</option>
                            <option value="peanut">Peanut</option>
                            <option value="oblong">Oblong</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="customType">Composition</label>
                        <select id="customType" onchange="updateCustomPreview()">
                            <option value="rocky">Rocky</option>
                            <option value="metallic">Metallic</option>
                            <option value="carbonaceous">Carbonaceous</option>
                            <option value="icy">Icy</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="customDensity">Density (kg/m³)</label>
                        <input type="number" id="customDensity" min="1000" max="8000" value="3000" required>
                    </div>
                    <div class="form-group">
                        <label for="customAngle">Impact Angle (degrees)</label>
                        <input type="number" id="customAngle" min="0" max="90" value="45" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="customDescription">Description</label>
                    <textarea id="customDescription" rows="3" placeholder="Describe your asteroid..."></textarea>
                </div>
                
                <div class="custom-asteroid-preview">
                    <h4>Preview</h4>
                    <canvas id="customAsteroidPreview" width="200" height="200"></canvas>
                </div>
                
                <div class="form-buttons">
                    <button class="btn-cancel" onclick="closeCustomAsteroidCreator()">Cancel</button>
                    <button class="btn-save" onclick="saveCustomAsteroid()">Save Asteroid</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Create preview
    updateCustomPreview();
}

function closeCustomAsteroidCreator() {
    const modal = document.getElementById('customAsteroidModal');
    if (modal) {
        modal.remove();
    }
}

function updateCustomPreview() {
    const canvas = document.getElementById('customAsteroidPreview');
    if (!canvas) return;
    
    const shape = document.getElementById('customShape').value;
    const type = document.getElementById('customType').value;
    
    // Create new scene for preview
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(200, 200);
    
    // Create asteroid geometry
    const geometry = createRealisticAsteroidGeometry(1, 0.2, 0.3, 1, 1, 1, shape);
    const material = new THREE.MeshPhongMaterial({
        color: type === 'rocky' ? 0x8B4513 : 
               type === 'metallic' ? 0x888888 :
               type === 'carbonaceous' ? 0x2F4F4F : 0xE6E6FA,
        shininess: 30
    });
    
    const asteroidMesh = new THREE.Mesh(geometry, material);
    scene.add(asteroidMesh);
    
    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    camera.position.z = 3;
    
    function animate() {
        requestAnimationFrame(animate);
        asteroidMesh.rotation.x += 0.01;
        asteroidMesh.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

function saveCustomAsteroid() {
    const name = document.getElementById('customName').value;
    const creator = document.getElementById('customCreator').value;
    const diameter = parseFloat(document.getElementById('customDiameter').value);
    const velocity = parseFloat(document.getElementById('customVelocity').value);
    const shape = document.getElementById('customShape').value;
    const type = document.getElementById('customType').value;
    const density = parseFloat(document.getElementById('customDensity').value);
    const angle = parseFloat(document.getElementById('customAngle').value);
    const description = document.getElementById('customDescription').value;
    
    if (!name || !creator) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Create custom asteroid
    const customAsteroid = {
        name: name,
        creator: creator,
        diameter: diameter,
        velocity: velocity,
        shape: shape,
        type: type,
        density: density,
        angle: angle,
        description: description || `A custom ${type} asteroid created by ${creator}`,
        discovered: new Date().toLocaleDateString(),
        isCustom: true,
        mass: (4/3) * Math.PI * Math.pow(diameter/2, 3) * density,
        kineticEnergy: 0.5 * ((4/3) * Math.PI * Math.pow(diameter/2, 3) * density) * Math.pow(velocity * 1000, 2),
        tntEquivalent: 0
    };
    
    // Calculate TNT equivalent
    customAsteroid.tntEquivalent = customAsteroid.kineticEnergy / (4.184e9);
    
    // Add to asteroid database
    asteroidDatabase.push(customAsteroid);
    
    // Save to localStorage
    localStorage.setItem('customAsteroids', JSON.stringify(asteroidDatabase.filter(a => a.isCustom)));
    
    // Update UI
    updateAsteroidDatabase();
    
    // Close modal
    closeCustomAsteroidCreator();
    
    // Show success message
    showNotification(`Asteroid "${name}" created successfully by ${creator}!`, 'success');
    
    // Switch to the new asteroid
    currentAsteroidIndex = asteroidDatabase.length - 1;
    loadAsteroid();
}

function loadCustomAsteroids() {
    const saved = localStorage.getItem('customAsteroids');
    if (saved) {
        const customAsteroids = JSON.parse(saved);
        // Add custom asteroids to database
        customAsteroids.forEach(asteroid => {
            if (!asteroidDatabase.find(a => a.name === asteroid.name && a.creator === asteroid.creator)) {
                asteroidDatabase.push(asteroid);
            }
        });
    }
}
