// Orbital Mechanics Utilities for Asteroid Impact Simulator
// Provides realistic orbital element calculations and Δv application

const orbitUtils = {
    // Constants
    G: 6.67430e-11, // Gravitational constant (m³/kg/s²)
    AU: 1.496e11,   // Astronomical unit (m)
    EARTH_RADIUS: 6371000, // Earth radius (m)
    SUN_MASS: 1.989e30,    // Solar mass (kg)
    
    // Convert orbital elements to state vector (position and velocity)
    elementsToStateVector(elements) {
        const { a, e, i, Omega, omega, M } = elements;
        const a_m = a * this.AU; // Convert AU to meters
        
        // Solve Kepler's equation for eccentric anomaly E
        let E = M; // Initial guess
        for (let iter = 0; iter < 10; iter++) {
            const deltaE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
            E += deltaE;
            if (Math.abs(deltaE) < 1e-8) break;
        }
        
        // Calculate position and velocity in orbital plane
        const cosE = Math.cos(E);
        const sinE = Math.sin(E);
        const sqrt1me2 = Math.sqrt(1 - e * e);
        
        const r = a_m * (1 - e * cosE);
        const v = Math.sqrt(this.G * this.SUN_MASS / a_m) / r;
        
        // Position in orbital plane
        const x = a_m * (cosE - e);
        const y = a_m * sqrt1me2 * sinE;
        const z = 0;
        
        // Velocity in orbital plane
        const vx = -v * a_m * sinE;
        const vy = v * a_m * sqrt1me2 * cosE;
        const vz = 0;
        
        // Convert to 3D space using rotation matrices
        const cosi = Math.cos(i);
        const sini = Math.sin(i);
        const cosOmega = Math.cos(Omega);
        const sinOmega = Math.sin(Omega);
        const cosomega = Math.cos(omega);
        const sinomega = Math.sin(omega);
        
        // Rotation matrix for inclination and nodes
        const R = [
            [cosOmega * cosomega - sinOmega * sinomega * cosi, -cosOmega * sinomega - sinOmega * cosomega * cosi, sinOmega * sini],
            [sinOmega * cosomega + cosOmega * sinomega * cosi, -sinOmega * sinomega + cosOmega * cosomega * cosi, -cosOmega * sini],
            [sinomega * sini, cosomega * sini, cosi]
        ];
        
        // Apply rotation
        const position = [
            R[0][0] * x + R[0][1] * y + R[0][2] * z,
            R[1][0] * x + R[1][1] * y + R[1][2] * z,
            R[2][0] * x + R[2][1] * y + R[2][2] * z
        ];
        
        const velocity = [
            R[0][0] * vx + R[0][1] * vy + R[0][2] * vz,
            R[1][0] * vx + R[1][1] * vy + R[1][2] * vz,
            R[2][0] * vx + R[2][1] * vy + R[2][2] * vz
        ];
        
        return { position, velocity };
    },
    
    // Convert state vector to orbital elements
    stateVectorsToElements(position, velocity) {
        const r = Math.sqrt(position[0]**2 + position[1]**2 + position[2]**2);
        const v = Math.sqrt(velocity[0]**2 + velocity[1]**2 + velocity[2]**2);
        
        // Specific angular momentum
        const h = [
            position[1] * velocity[2] - position[2] * velocity[1],
            position[2] * velocity[0] - position[0] * velocity[2],
            position[0] * velocity[1] - position[1] * velocity[0]
        ];
        const h_mag = Math.sqrt(h[0]**2 + h[1]**2 + h[2]**2);
        
        // Specific energy
        const energy = 0.5 * v**2 - this.G * this.SUN_MASS / r;
        
        // Semi-major axis
        const a = -this.G * this.SUN_MASS / (2 * energy);
        const a_AU = a / this.AU;
        
        // Eccentricity vector
        const e_vec = [
            (v**2 - this.G * this.SUN_MASS / r) * position[0] / (this.G * this.SUN_MASS) - (position[0] * velocity[0] + position[1] * velocity[1] + position[2] * velocity[2]) * velocity[0] / (this.G * this.SUN_MASS),
            (v**2 - this.G * this.SUN_MASS / r) * position[1] / (this.G * this.SUN_MASS) - (position[0] * velocity[0] + position[1] * velocity[1] + position[2] * velocity[2]) * velocity[1] / (this.G * this.SUN_MASS),
            (v**2 - this.G * this.SUN_MASS / r) * position[2] / (this.G * this.SUN_MASS) - (position[0] * velocity[0] + position[1] * velocity[1] + position[2] * velocity[2]) * velocity[2] / (this.G * this.SUN_MASS)
        ];
        const e = Math.sqrt(e_vec[0]**2 + e_vec[1]**2 + e_vec[2]**2);
        
        // Inclination
        const i = Math.acos(h[2] / h_mag);
        
        // Longitude of ascending node
        const Omega = Math.atan2(h[0], -h[1]);
        
        // Argument of periapsis
        const n = [-h[1], h[0], 0]; // Node vector
        const n_mag = Math.sqrt(n[0]**2 + n[1]**2);
        const omega = Math.atan2(
            (e_vec[0] * n[0] + e_vec[1] * n[1]) / (e * n_mag),
            (e_vec[0] * n[0] + e_vec[1] * n[1]) / (e * n_mag)
        );
        
        // True anomaly
        const nu = Math.atan2(
            Math.sqrt(1 - e**2) * (position[0] * e_vec[0] + position[1] * e_vec[1] + position[2] * e_vec[2]) / (e * r),
            (e**2 + (position[0] * e_vec[0] + position[1] * e_vec[1] + position[2] * e_vec[2]) / r) / e - 1
        );
        
        // Mean anomaly (simplified)
        const E = 2 * Math.atan(Math.sqrt((1 - e) / (1 + e)) * Math.tan(nu / 2));
        const M = E - e * Math.sin(E);
        
        return {
            a: a_AU,
            e: e,
            i: i * 180 / Math.PI, // Convert to degrees
            Omega: Omega * 180 / Math.PI,
            omega: omega * 180 / Math.PI,
            M: M * 180 / Math.PI,
            periapsis: a_AU * (1 - e) * this.AU // Periapsis distance in meters
        };
    },
    
    // Apply Δv to current asteroid and update orbit
    async updateOrbitAfterDeltaV(deltaV_ms) {
        try {
            const asteroid = asteroidDatabase[currentAsteroidIndex];
            if (!asteroid) {
                return { ok: false, error: "No asteroid selected" };
            }
            
            // Get current orbital elements (from NASA data or defaults)
            let currentElements;
            if (asteroid.nasaData && asteroid.nasaData.orbital_data) {
                const od = asteroid.nasaData.orbital_data;
                currentElements = {
                    a: parseFloat(od.semi_major_axis) || 1.5,
                    e: parseFloat(od.eccentricity) || 0.1,
                    i: parseFloat(od.inclination) || 5,
                    Omega: parseFloat(od.longitude_of_ascending_node) || 0,
                    omega: parseFloat(od.argument_of_periapsis) || 0,
                    M: parseFloat(od.mean_anomaly) || 0
                };
            } else {
                // Default orbital elements for demonstration
                currentElements = {
                    a: 1.5, e: 0.1, i: 5, Omega: 0, omega: 0, M: 0
                };
            }
            
            // Store original elements
            const originalElements = { ...currentElements };
            
            // Convert to state vector
            const state = this.elementsToStateVector(currentElements);
            
            // Apply Δv (convert m/s to km/s for consistency)
            const deltaV_km_s = deltaV_ms.map(v => v / 1000);
            const newVelocity = [
                state.velocity[0] + deltaV_km_s[0] * 1000, // Convert back to m/s
                state.velocity[1] + deltaV_km_s[1] * 1000,
                state.velocity[2] + deltaV_km_s[2] * 1000
            ];
            
            // Convert back to orbital elements
            const newElements = this.stateVectorsToElements(state.position, newVelocity);
            
            // Store results
            if (!asteroid.postDeflection) {
                asteroid.postDeflection = {};
            }
            asteroid.postDeflection.originalElements = originalElements;
            asteroid.postDeflection.newElements = newElements;
            asteroid.postDeflection.deltaV = deltaV_km_s;
            
            // Update window for PDF export
            window.__LAST_MITIGATION__ = {
                name: "Orbital Deflection",
                dv_km_s: deltaV_km_s,
                beforeElems: originalElements,
                afterElems: newElements
            };
            
            // Draw new orbit if function exists
            if (typeof drawOrbitFromElements === 'function') {
                drawOrbitFromElements(newElements, { color: 0x00ff00, dashed: false });
            }
            
            return { 
                ok: true, 
                before: originalElements, 
                after: newElements,
                periapsisChange: newElements.periapsis - originalElements.periapsis
            };
            
        } catch (error) {
            console.error("Error updating orbit:", error);
            return { ok: false, error: error.message };
        }
    },
    
    // Calculate periapsis distance for safety assessment
    calculatePeriapsis(elements) {
        return elements.a * this.AU * (1 - elements.e);
    },
    
    // Check if asteroid will miss Earth
    willMissEarth(elements, safetyMargin = 1000000) { // 1000km safety margin
        const periapsis = this.calculatePeriapsis(elements);
        return periapsis > (this.EARTH_RADIUS + safetyMargin);
    },

    // Enhanced deflection trajectory calculation using real orbital mechanics
    calculateDeflectionTrajectory(asteroidElements, deflectionDeltaV, timeToImpact) {
        const { a, e, i, Omega, omega, M } = asteroidElements;
        
        // Convert to state vector
        const stateVector = this.elementsToStateVector(asteroidElements);
        const { position, velocity } = stateVector;
        
        // Calculate deflection direction (perpendicular to velocity for maximum effect)
        const velocityUnit = velocity.clone().normalize();
        const deflectionDirection = new THREE.Vector3(
            -velocityUnit.z,
            velocityUnit.x,
            velocityUnit.y
        ).normalize();
        
        // Apply deflection velocity
        const deflectedVelocity = velocity.clone().add(
            deflectionDirection.multiplyScalar(deflectionDeltaV)
        );
        
        // Convert back to orbital elements
        const deflectedElements = this.stateVectorToElements(position, deflectedVelocity);
        
        // Calculate new impact point
        const newImpactPoint = this.calculateImpactPoint(deflectedElements, timeToImpact);
        
        return {
            originalElements: asteroidElements,
            deflectedElements: deflectedElements,
            deflectionVector: deflectionDirection.multiplyScalar(deflectionDeltaV),
            newImpactPoint: newImpactPoint,
            deflectionDistance: this.calculateDeflectionDistance(asteroidElements, deflectedElements),
            missionFeasibility: this.assessMissionFeasibility(deflectionDeltaV, timeToImpact)
        };
    },

    // Calculate impact point from orbital elements
    calculateImpactPoint(elements, timeToImpact) {
        // Propagate orbit forward in time
        const propagatedElements = this.propagateOrbit(elements, timeToImpact);
        
        // Find intersection with Earth's orbit
        const earthOrbitRadius = 1.496e11; // 1 AU in meters
        const intersection = this.findOrbitIntersection(propagatedElements, earthOrbitRadius);
        
        return intersection;
    },

    // Propagate orbit forward in time
    propagateOrbit(elements, timeDelta) {
        const { a, e, i, Omega, omega, M } = elements;
        const n = Math.sqrt(this.G * this.SUN_MASS / Math.pow(a * this.AU, 3)); // Mean motion
        
        // Calculate new mean anomaly
        const newM = M + n * timeDelta;
        
        return {
            a, e, i, Omega, omega,
            M: newM % (2 * Math.PI)
        };
    },

    // Find intersection with Earth's orbit
    findOrbitIntersection(elements, earthRadius) {
        const { a, e, i, Omega, omega, M } = elements;
        const a_m = a * this.AU;
        
        // Solve for true anomaly where r = earthRadius
        const r = earthRadius;
        const cosE = (a_m - r) / (a_m * e);
        
        if (Math.abs(cosE) > 1) {
            // No intersection
            return null;
        }
        
        const E = Math.acos(cosE);
        const nu = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
        
        // Convert to position vector
        const position = this.trueAnomalyToPosition(a_m, e, i, Omega, omega, nu);
        
        return {
            position: position,
            trueAnomaly: nu,
            eccentricAnomaly: E
        };
    },

    // Convert true anomaly to position vector
    trueAnomalyToPosition(a, e, i, Omega, omega, nu) {
        const cosNu = Math.cos(nu);
        const sinNu = Math.sin(nu);
        const cosI = Math.cos(i);
        const sinI = Math.sin(i);
        const cosOmega = Math.cos(Omega);
        const sinOmega = Math.sin(Omega);
        const cosOmegaPlusNu = Math.cos(omega + nu);
        const sinOmegaPlusNu = Math.sin(omega + nu);
        
        const r = a * (1 - e * e) / (1 + e * cosNu);
        
        const x = r * (cosOmega * cosOmegaPlusNu - sinOmega * sinOmegaPlusNu * cosI);
        const y = r * (sinOmega * cosOmegaPlusNu + cosOmega * sinOmegaPlusNu * cosI);
        const z = r * sinOmegaPlusNu * sinI;
        
        return new THREE.Vector3(x, y, z);
    },

    // Calculate deflection distance
    calculateDeflectionDistance(originalElements, deflectedElements) {
        const originalState = this.elementsToStateVector(originalElements);
        const deflectedState = this.elementsToStateVector(deflectedElements);
        
        return originalState.position.distanceTo(deflectedState.position);
    },

    // Assess mission feasibility
    assessMissionFeasibility(deflectionDeltaV, timeToImpact) {
        const maxAchievableDeltaV = 10000; // m/s (typical for chemical propulsion)
        const minTimeRequired = 365 * 24 * 3600; // 1 year in seconds
        
        return {
            isFeasible: deflectionDeltaV < maxAchievableDeltaV && timeToImpact > minTimeRequired,
            deltaVFeasible: deflectionDeltaV < maxAchievableDeltaV,
            timeFeasible: timeToImpact > minTimeRequired,
            riskLevel: deflectionDeltaV > maxAchievableDeltaV * 0.8 ? 'High' : 
                     deflectionDeltaV > maxAchievableDeltaV * 0.5 ? 'Medium' : 'Low'
        };
    },

    // Enhanced gravity tractor calculation
    calculateGravityTractorDeflection(asteroidMass, spacecraftMass, timeToImpact, distance) {
        const G = this.G;
        const force = G * asteroidMass * spacecraftMass / (distance * distance);
        const acceleration = force / asteroidMass;
        const deflectionDistance = 0.5 * acceleration * Math.pow(timeToImpact, 2);
        
        return {
            force: force,
            acceleration: acceleration,
            deflectionDistance: deflectionDistance,
            requiredThrust: force,
            missionDuration: timeToImpact
        };
    },

    // Nuclear disruption calculation
    calculateNuclearDisruption(asteroidMass, yield, standoffDistance) {
        const energy = yield * 4.184e15; // Convert megatons to Joules
        const energyDensity = energy / (4 * Math.PI * standoffDistance * standoffDistance);
        
        // Calculate fragment velocity
        const fragmentVelocity = Math.sqrt(2 * energyDensity / 1000); // Assuming 1000 kg/m³ density
        
        // Calculate dispersion
        const dispersionAngle = Math.atan(standoffDistance / Math.sqrt(energyDensity / 1000));
        
        return {
            energy: energy,
            energyDensity: energyDensity,
            fragmentVelocity: fragmentVelocity,
            dispersionAngle: dispersionAngle,
            effectiveness: this.assessNuclearEffectiveness(asteroidMass, yield, standoffDistance)
        };
    },

    // Assess nuclear disruption effectiveness
    assessNuclearEffectiveness(asteroidMass, yield, standoffDistance) {
        const energy = yield * 4.184e15;
        const bindingEnergy = asteroidMass * 1e6; // Rough estimate
        
        const effectiveness = Math.min(1, energy / bindingEnergy);
        
        return {
            effectiveness: effectiveness,
            disruptionLevel: effectiveness > 0.8 ? 'Complete' : 
                           effectiveness > 0.5 ? 'Partial' : 'Minimal',
            fragmentCount: Math.floor(effectiveness * 100),
            hazardReduction: effectiveness * 0.9 // 90% of effectiveness
        };
    },

    // ================= ADVANCED MITIGATION STRATEGIES =================
    
    // Laser Ablation Deflection
    calculateLaserAblation(asteroidMass, laserPower, timeToImpact) {
        const ablationRate = laserPower / (asteroidMass * 1000); // kg/s
        const totalAblation = ablationRate * timeToImpact;
        const velocityChange = (totalAblation / asteroidMass) * 1000; // m/s
        
        return {
            method: 'Laser Ablation',
            velocityChange: velocityChange,
            effectiveness: Math.min(1, velocityChange / 10),
            cost: laserPower * timeToImpact * 0.001, // $/W/s
            feasibility: velocityChange > 0.1 ? 'High' : 'Low',
            advantages: ['Precise control', 'No debris', 'Reusable'],
            disadvantages: ['Requires close approach', 'High power needs', 'Atmospheric interference']
        };
    },
    
    // Solar Sail Deflection
    calculateSolarSail(asteroidMass, sailArea, timeToImpact) {
        const solarPressure = 9.08e-6; // N/m² at 1 AU
        const force = solarPressure * sailArea;
        const acceleration = force / asteroidMass;
        const velocityChange = acceleration * timeToImpact;
        
        return {
            method: 'Solar Sail',
            velocityChange: velocityChange,
            effectiveness: Math.min(1, velocityChange / 5),
            cost: sailArea * 1000, // $/m²
            feasibility: velocityChange > 0.05 ? 'Medium' : 'Low',
            advantages: ['No fuel required', 'Continuous thrust', 'Environmentally friendly'],
            disadvantages: ['Large sail needed', 'Distance dependent', 'Fragile design']
        };
    },
    
    // Ion Beam Deflection
    calculateIonBeam(asteroidMass, beamPower, timeToImpact) {
        const ionVelocity = 50000; // m/s
        const massFlowRate = beamPower / (0.5 * ionVelocity * ionVelocity);
        const thrust = massFlowRate * ionVelocity;
        const acceleration = thrust / asteroidMass;
        const velocityChange = acceleration * timeToImpact;
        
        return {
            method: 'Ion Beam',
            velocityChange: velocityChange,
            effectiveness: Math.min(1, velocityChange / 8),
            cost: beamPower * timeToImpact * 0.01,
            feasibility: velocityChange > 0.1 ? 'High' : 'Medium',
            advantages: ['High specific impulse', 'Precise control', 'Efficient'],
            disadvantages: ['High power consumption', 'Complex system', 'Limited range']
        };
    },
    
    // Enhanced Gravity Tractor
    calculateEnhancedGravityTractor(asteroidMass, spacecraftMass, timeToImpact, distance) {
        const G = this.G;
        const force = G * asteroidMass * spacecraftMass / (distance * distance);
        const acceleration = force / asteroidMass;
        const deflectionDistance = 0.5 * acceleration * Math.pow(timeToImpact, 2);
        
        // Calculate optimal positioning
        const optimalDistance = Math.sqrt(G * spacecraftMass / (2 * acceleration));
        const stationKeepingDeltaV = Math.sqrt(G * asteroidMass / distance);
        
        return {
            method: 'Enhanced Gravity Tractor',
            deflectionDistance: deflectionDistance,
            acceleration: acceleration,
            optimalDistance: optimalDistance,
            stationKeepingDeltaV: stationKeepingDeltaV,
            feasibility: deflectionDistance > 1000 ? 'High' : 'Medium',
            advantages: ['No physical contact', 'Gradual deflection', 'Safe method'],
            disadvantages: ['Long mission duration', 'Precise positioning', 'Limited effectiveness']
        };
    },
    
    // Mass Driver Deflection
    calculateMassDriver(asteroidMass, ejectaMass, ejectaVelocity, timeToImpact) {
        const momentumTransfer = ejectaMass * ejectaVelocity;
        const velocityChange = momentumTransfer / asteroidMass;
        const deflectionDistance = velocityChange * timeToImpact;
        
        return {
            method: 'Mass Driver',
            velocityChange: velocityChange,
            deflectionDistance: deflectionDistance,
            effectiveness: Math.min(1, velocityChange / 5),
            feasibility: velocityChange > 0.1 ? 'High' : 'Low',
            advantages: ['Uses asteroid material', 'No external fuel', 'Scalable'],
            disadvantages: ['Requires surface operations', 'Complex mining', 'Limited by asteroid composition']
        };
    },
    
    // Electromagnetic Deflection
    calculateElectromagneticDeflection(asteroidMass, magneticField, timeToImpact) {
        // Simplified electromagnetic deflection calculation
        const inducedCurrent = magneticField * 0.1; // Simplified
        const lorentzForce = inducedCurrent * magneticField;
        const acceleration = lorentzForce / asteroidMass;
        const velocityChange = acceleration * timeToImpact;
        
        return {
            method: 'Electromagnetic Deflection',
            velocityChange: velocityChange,
            acceleration: acceleration,
            effectiveness: Math.min(1, velocityChange / 3),
            feasibility: velocityChange > 0.05 ? 'Medium' : 'Low',
            advantages: ['No physical contact', 'Works on metallic asteroids', 'Precise control'],
            disadvantages: ['Limited to conductive asteroids', 'High power needs', 'Complex setup']
        };
    },
    
    // Compare all mitigation strategies
    compareMitigationStrategies(asteroidMass, timeToImpact, budget) {
        const strategies = [
            this.calculateLaserAblation(asteroidMass, 1000000, timeToImpact), // 1MW laser
            this.calculateSolarSail(asteroidMass, 10000, timeToImpact), // 10km² sail
            this.calculateIonBeam(asteroidMass, 100000, timeToImpact), // 100kW ion beam
            this.calculateEnhancedGravityTractor(asteroidMass, 1000, timeToImpact, 100),
            this.calculateMassDriver(asteroidMass, 1000, 1000, timeToImpact),
            this.calculateElectromagneticDeflection(asteroidMass, 0.1, timeToImpact)
        ];
        
        // Sort by effectiveness
        strategies.sort((a, b) => b.effectiveness - a.effectiveness);
        
        // Filter by budget
        const affordableStrategies = strategies.filter(strategy => strategy.cost <= budget);
        
        return {
            allStrategies: strategies,
            affordableStrategies: affordableStrategies,
            recommended: affordableStrategies[0] || strategies[0],
            analysis: this.analyzeStrategyTradeoffs(strategies)
        };
    },
    
    analyzeStrategyTradeoffs(strategies) {
        const analysis = {
            mostEffective: strategies.reduce((max, strategy) => 
                strategy.effectiveness > max.effectiveness ? strategy : max
            ),
            mostCostEffective: strategies.reduce((best, strategy) => 
                (strategy.effectiveness / strategy.cost) > (best.effectiveness / best.cost) ? strategy : best
            ),
            fastest: strategies.reduce((fastest, strategy) => 
                strategy.velocityChange > fastest.velocityChange ? strategy : fastest
            ),
            safest: strategies.find(strategy => 
                strategy.method === 'Enhanced Gravity Tractor'
            ) || strategies[0]
        };
        
        return analysis;
    }
};

// Make available globally
window.orbitUtils = orbitUtils;
