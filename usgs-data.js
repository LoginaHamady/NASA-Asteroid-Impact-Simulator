// USGS Data Integration Module for Asteroid Impact Simulator
// Provides real-time access to USGS elevation, seismic, and coastal data

class USGSDataService {
    constructor() {
        this.baseUrls = {
            elevation: 'https://elevation.nationalmap.gov/arcgis/rest/services/3DEPElevation/ImageServer',
            seismic: 'https://earthquake.usgs.gov/arcgis/rest/services/haz/haz_general/MapServer',
            coastal: 'https://coastal.er.usgs.gov/arcgis/rest/services/CoastalElevation/CoastalElevation/MapServer',
            landcover: 'https://www.mrlc.gov/arcgis/rest/services/LandCover/USGS/MapServer',
            population: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer'
        };
        this.cache = new Map();
        this.cacheTimeout = 300000; // 5 minutes
    }

    // Get elevation data for a specific location
    async getElevationData(lat, lon, radius = 0.1) {
        const cacheKey = `elevation_${lat}_${lon}_${radius}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const bbox = this.calculateBoundingBox(lat, lon, radius);
            const url = `${this.baseUrls.elevation}/identify?f=json&geometry=${bbox}&geometryType=esriGeometryEnvelope&returnGeometry=true&spatialRel=esriSpatialRelIntersects&layers=0&tolerance=0&mapExtent=${bbox}&imageDisplay=400,300,96&returnZ=true`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const elevationData = this.processElevationData(data, lat, lon);
            this.cache.set(cacheKey, elevationData);
            
            return elevationData;
        } catch (error) {
            console.warn('USGS Elevation API error:', error);
            return this.getDefaultElevationData(lat, lon);
        }
    }

    // Get seismic hazard data for a location
    async getSeismicHazardData(lat, lon) {
        const cacheKey = `seismic_${lat}_${lon}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = `${this.baseUrls.seismic}/identify?f=json&geometry=${lon},${lat}&geometryType=esriGeometryPoint&returnGeometry=true&spatialRel=esriSpatialRelIntersects&layers=0&tolerance=0&returnZ=true`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const seismicData = this.processSeismicData(data);
            this.cache.set(cacheKey, seismicData);
            
            return seismicData;
        } catch (error) {
            console.warn('USGS Seismic API error:', error);
            return this.getDefaultSeismicData();
        }
    }

    // Get coastal elevation data for tsunami modeling
    async getCoastalElevationData(lat, lon, radius = 0.5) {
        const cacheKey = `coastal_${lat}_${lon}_${radius}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const bbox = this.calculateBoundingBox(lat, lon, radius);
            const url = `${this.baseUrls.coastal}/identify?f=json&geometry=${bbox}&geometryType=esriGeometryEnvelope&returnGeometry=true&spatialRel=esriSpatialRelIntersects&layers=0&tolerance=0&returnZ=true`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const coastalData = this.processCoastalData(data, lat, lon);
            this.cache.set(cacheKey, coastalData);
            
            return coastalData;
        } catch (error) {
            console.warn('USGS Coastal API error:', error);
            return this.getDefaultCoastalData(lat, lon);
        }
    }

    // Get land cover classification data
    async getLandCoverData(lat, lon, radius = 0.1) {
        const cacheKey = `landcover_${lat}_${lon}_${radius}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const bbox = this.calculateBoundingBox(lat, lon, radius);
            const url = `${this.baseUrls.landcover}/identify?f=json&geometry=${bbox}&geometryType=esriGeometryEnvelope&returnGeometry=true&spatialRel=esriSpatialRelIntersects&layers=0&tolerance=0`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const landcoverData = this.processLandCoverData(data);
            this.cache.set(cacheKey, landcoverData);
            
            return landcoverData;
        } catch (error) {
            console.warn('USGS Land Cover API error:', error);
            return this.getDefaultLandCoverData();
        }
    }

    // Calculate enhanced impact consequences using USGS data
    async calculateEnhancedImpactConsequences(asteroidData, impactLat, impactLon) {
        const [elevationData, seismicData, coastalData, landcoverData] = await Promise.all([
            this.getElevationData(impactLat, impactLon),
            this.getSeismicHazardData(impactLat, impactLon),
            this.getCoastalElevationData(impactLat, impactLon),
            this.getLandCoverData(impactLat, impactLon)
        ]);

        return {
            elevation: elevationData,
            seismic: seismicData,
            coastal: coastalData,
            landcover: landcoverData,
            enhancedConsequences: this.calculateConsequences(asteroidData, elevationData, seismicData, coastalData, landcoverData)
        };
    }

    // Enhanced tsunami modeling using coastal data
    calculateTsunamiImpact(asteroidData, coastalData, impactLat, impactLon) {
        const { diameter, velocity, density } = asteroidData;
        const mass = (4/3) * Math.PI * Math.pow(diameter/2, 3) * density;
        const kineticEnergy = 0.5 * mass * Math.pow(velocity * 1000, 2); // Convert to Joules
        
        // Calculate tsunami wave height based on impact energy and coastal elevation
        const baseWaveHeight = Math.pow(kineticEnergy / 1e15, 0.25) * 100; // meters
        const coastalElevation = coastalData.averageElevation || 0;
        const elevationFactor = Math.max(0.1, 1 - (coastalElevation / 1000)); // Higher elevation = lower tsunami impact
        
        const tsunamiHeight = baseWaveHeight * elevationFactor;
        const runupDistance = tsunamiHeight * 50; // Rough estimate of inland penetration
        
        return {
            waveHeight: tsunamiHeight,
            runupDistance: runupDistance,
            affectedArea: Math.PI * Math.pow(runupDistance, 2),
            coastalVulnerability: this.assessCoastalVulnerability(coastalData),
            evacuationRadius: runupDistance * 1.5
        };
    }

    // Enhanced seismic impact modeling
    calculateSeismicImpact(asteroidData, seismicData, elevationData) {
        const { diameter, velocity, density } = asteroidData;
        const mass = (4/3) * Math.PI * Math.pow(diameter/2, 3) * density;
        const kineticEnergy = 0.5 * mass * Math.pow(velocity * 1000, 2);
        
        // Convert kinetic energy to seismic magnitude
        const seismicMagnitude = Math.log10(kineticEnergy / 1e6) / 1.5; // Rough conversion
        
        // Factor in local seismic hazard
        const localHazard = seismicData.hazardLevel || 0.5;
        const enhancedMagnitude = seismicMagnitude + (localHazard * 0.5);
        
        // Calculate ground acceleration and damage radius
        const groundAcceleration = Math.pow(10, enhancedMagnitude - 4) * 9.81; // m/s²
        const damageRadius = Math.pow(kineticEnergy / 1e12, 0.33) * 100; // km
        
        return {
            magnitude: enhancedMagnitude,
            groundAcceleration: groundAcceleration,
            damageRadius: damageRadius,
            localHazard: localHazard,
            buildingDamage: this.assessBuildingDamage(groundAcceleration, seismicData),
            liquefactionRisk: this.assessLiquefactionRisk(seismicData, elevationData)
        };
    }

    // Enhanced crater modeling using elevation data
    calculateCraterImpact(asteroidData, elevationData) {
        const { diameter, velocity, density, angle } = asteroidData;
        const mass = (4/3) * Math.PI * Math.pow(diameter/2, 3) * density;
        const kineticEnergy = 0.5 * mass * Math.pow(velocity * 1000, 2);
        
        // Base crater calculations
        const craterDiameter = 1.8 * Math.pow(diameter, 0.78) * Math.pow(velocity, 0.44) / 1000;
        const craterDepth = craterDiameter * 0.2; // Typical depth-to-diameter ratio
        
        // Adjust for terrain elevation and slope
        const terrainElevation = elevationData.averageElevation || 0;
        const terrainSlope = elevationData.slope || 0;
        
        // Higher elevation = more complex crater formation
        const elevationFactor = 1 + (terrainElevation / 2000) * 0.1;
        const slopeFactor = 1 + Math.abs(terrainSlope) * 0.05;
        
        const adjustedDiameter = craterDiameter * elevationFactor * slopeFactor;
        const adjustedDepth = craterDepth * elevationFactor;
        
        return {
            diameter: adjustedDiameter,
            depth: adjustedDepth,
            volume: (Math.PI / 6) * Math.pow(adjustedDiameter, 2) * adjustedDepth,
            terrainElevation: terrainElevation,
            terrainSlope: terrainSlope,
            complexity: this.assessCraterComplexity(terrainElevation, terrainSlope)
        };
    }

    // Helper methods
    calculateBoundingBox(lat, lon, radius) {
        const latDelta = radius;
        const lonDelta = radius / Math.cos(lat * Math.PI / 180);
        return `${lon - lonDelta},${lat - latDelta},${lon + lonDelta},${lat + latDelta}`;
    }

    processElevationData(data, lat, lon) {
        if (!data.results || data.results.length === 0) {
            return this.getDefaultElevationData(lat, lon);
        }

        const elevations = data.results.map(r => r.attributes?.Z || 0).filter(e => !isNaN(e));
        const averageElevation = elevations.length > 0 ? elevations.reduce((a, b) => a + b, 0) / elevations.length : 0;
        const maxElevation = Math.max(...elevations, 0);
        const minElevation = Math.min(...elevations, 0);
        const slope = this.calculateSlope(elevations);

        return {
            averageElevation,
            maxElevation,
            minElevation,
            slope,
            elevationRange: maxElevation - minElevation,
            terrainRoughness: this.calculateTerrainRoughness(elevations)
        };
    }

    processSeismicData(data) {
        if (!data.results || data.results.length === 0) {
            return this.getDefaultSeismicData();
        }

        const seismicValues = data.results.map(r => r.attributes?.value || 0);
        const hazardLevel = seismicValues.length > 0 ? seismicValues.reduce((a, b) => a + b, 0) / seismicValues.length : 0.5;

        return {
            hazardLevel: Math.min(1, Math.max(0, hazardLevel)),
            seismicZone: this.classifySeismicZone(hazardLevel),
            groundMotion: hazardLevel * 0.4, // PGA in g
            liquefactionPotential: hazardLevel > 0.7 ? 'High' : hazardLevel > 0.4 ? 'Medium' : 'Low'
        };
    }

    processCoastalData(data, lat, lon) {
        if (!data.results || data.results.length === 0) {
            return this.getDefaultCoastalData(lat, lon);
        }

        const elevations = data.results.map(r => r.attributes?.Z || 0);
        const averageElevation = elevations.length > 0 ? elevations.reduce((a, b) => a + b, 0) / elevations.length : 0;
        const isCoastal = this.isCoastalLocation(lat, lon);

        return {
            averageElevation,
            isCoastal,
            coastalDistance: this.calculateCoastalDistance(lat, lon),
            tidalRange: isCoastal ? 2.0 : 0, // meters
            stormSurgeRisk: this.assessStormSurgeRisk(lat, lon)
        };
    }

    processLandCoverData(data) {
        if (!data.results || data.results.length === 0) {
            return this.getDefaultLandCoverData();
        }

        const landcoverTypes = data.results.map(r => r.attributes?.value || 0);
        const dominantType = this.getMostFrequent(landcoverTypes);

        return {
            dominantType,
            landcoverClass: this.classifyLandCover(dominantType),
            urbanization: this.calculateUrbanization(landcoverTypes),
            vegetation: this.calculateVegetation(landcoverTypes),
            waterCoverage: this.calculateWaterCoverage(landcoverTypes)
        };
    }

    // Default data fallbacks
    getDefaultElevationData(lat, lon) {
        return {
            averageElevation: 0,
            maxElevation: 0,
            minElevation: 0,
            slope: 0,
            elevationRange: 0,
            terrainRoughness: 0.1
        };
    }

    getDefaultSeismicData() {
        return {
            hazardLevel: 0.5,
            seismicZone: 'Moderate',
            groundMotion: 0.2,
            liquefactionPotential: 'Low'
        };
    }

    getDefaultCoastalData(lat, lon) {
        return {
            averageElevation: 0,
            isCoastal: this.isCoastalLocation(lat, lon),
            coastalDistance: this.calculateCoastalDistance(lat, lon),
            tidalRange: 0,
            stormSurgeRisk: 'Low'
        };
    }

    getDefaultLandCoverData() {
        return {
            dominantType: 0,
            landcoverClass: 'Unknown',
            urbanization: 0,
            vegetation: 0.5,
            waterCoverage: 0
        };
    }

    // Utility methods
    calculateSlope(elevations) {
        if (elevations.length < 2) return 0;
        const differences = [];
        for (let i = 1; i < elevations.length; i++) {
            differences.push(Math.abs(elevations[i] - elevations[i-1]));
        }
        return differences.reduce((a, b) => a + b, 0) / differences.length;
    }

    calculateTerrainRoughness(elevations) {
        if (elevations.length < 3) return 0.1;
        const mean = elevations.reduce((a, b) => a + b, 0) / elevations.length;
        const variance = elevations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / elevations.length;
        return Math.sqrt(variance) / 1000; // Normalize to km
    }

    classifySeismicZone(hazardLevel) {
        if (hazardLevel > 0.8) return 'Very High';
        if (hazardLevel > 0.6) return 'High';
        if (hazardLevel > 0.4) return 'Moderate';
        if (hazardLevel > 0.2) return 'Low';
        return 'Very Low';
    }

    isCoastalLocation(lat, lon) {
        // Simple coastal detection based on proximity to major coastlines
        const coastalThreshold = 0.1; // degrees
        const majorCoasts = [
            {lat: 40.7, lon: -74.0}, // NYC
            {lat: 34.0, lon: -118.2}, // LA
            {lat: 51.5, lon: -0.1}, // London
            {lat: 35.7, lon: 139.7}, // Tokyo
            {lat: -33.9, lon: 18.4} // Cape Town
        ];
        
        return majorCoasts.some(coast => 
            Math.abs(lat - coast.lat) < coastalThreshold && 
            Math.abs(lon - coast.lon) < coastalThreshold
        );
    }

    calculateCoastalDistance(lat, lon) {
        // Simplified distance calculation to nearest major coastline
        const majorCoasts = [
            {lat: 40.7, lon: -74.0},
            {lat: 34.0, lon: -118.2},
            {lat: 51.5, lon: -0.1},
            {lat: 35.7, lon: 139.7},
            {lat: -33.9, lon: 18.4}
        ];
        
        let minDistance = Infinity;
        majorCoasts.forEach(coast => {
            const distance = this.haversineDistance(lat, lon, coast.lat, coast.lon);
            minDistance = Math.min(minDistance, distance);
        });
        
        return minDistance;
    }

    haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    assessCoastalVulnerability(coastalData) {
        const { averageElevation, tidalRange, stormSurgeRisk } = coastalData;
        let vulnerability = 0;
        
        if (averageElevation < 5) vulnerability += 0.4;
        if (tidalRange > 3) vulnerability += 0.3;
        if (stormSurgeRisk === 'High') vulnerability += 0.3;
        
        return Math.min(1, vulnerability);
    }

    assessBuildingDamage(groundAcceleration, seismicData) {
        const pga = groundAcceleration / 9.81; // Convert to g
        const hazardLevel = seismicData.hazardLevel || 0.5;
        
        if (pga > 0.4) return 'Severe';
        if (pga > 0.2) return 'Moderate';
        if (pga > 0.1) return 'Light';
        return 'Minimal';
    }

    assessLiquefactionRisk(seismicData, elevationData) {
        const { hazardLevel } = seismicData;
        const { averageElevation } = elevationData;
        
        if (hazardLevel > 0.7 && averageElevation < 10) return 'High';
        if (hazardLevel > 0.5 && averageElevation < 20) return 'Medium';
        return 'Low';
    }

    assessCraterComplexity(terrainElevation, terrainSlope) {
        if (terrainElevation > 1000 && terrainSlope > 10) return 'Very High';
        if (terrainElevation > 500 || terrainSlope > 5) return 'High';
        if (terrainElevation > 100 || terrainSlope > 2) return 'Medium';
        return 'Low';
    }

    classifyLandCover(landcoverType) {
        const types = {
            0: 'Water',
            1: 'Developed',
            2: 'Barren',
            3: 'Forest',
            4: 'Shrubland',
            5: 'Grassland',
            6: 'Cultivated',
            7: 'Wetland'
        };
        return types[landcoverType] || 'Unknown';
    }

    getMostFrequent(arr) {
        return arr.sort((a,b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).pop();
    }

    calculateUrbanization(landcoverTypes) {
        const urbanTypes = [1]; // Developed
        const urbanCount = landcoverTypes.filter(type => urbanTypes.includes(type)).length;
        return urbanCount / landcoverTypes.length;
    }

    calculateVegetation(landcoverTypes) {
        const vegetationTypes = [3, 4, 5]; // Forest, Shrubland, Grassland
        const vegetationCount = landcoverTypes.filter(type => vegetationTypes.includes(type)).length;
        return vegetationCount / landcoverTypes.length;
    }

    calculateWaterCoverage(landcoverTypes) {
        const waterTypes = [0, 7]; // Water, Wetland
        const waterCount = landcoverTypes.filter(type => waterTypes.includes(type)).length;
        return waterCount / landcoverTypes.length;
    }

    assessStormSurgeRisk(lat, lon) {
        // Simplified storm surge risk assessment
        const hurricaneProne = [
            {lat: 25.8, lon: -80.3}, // Miami
            {lat: 29.8, lon: -95.4}, // Houston
            {lat: 30.0, lon: -90.1}, // New Orleans
        ];
        
        const isHurricaneProne = hurricaneProne.some(location => 
            this.haversineDistance(lat, lon, location.lat, location.lon) < 500
        );
        
        return isHurricaneProne ? 'High' : 'Low';
    }

    calculateConsequences(asteroidData, elevationData, seismicData, coastalData, landcoverData) {
        const tsunami = this.calculateTsunamiImpact(asteroidData, coastalData, asteroidData.lat, asteroidData.lon);
        const seismic = this.calculateSeismicImpact(asteroidData, seismicData, elevationData);
        const crater = this.calculateCraterImpact(asteroidData, elevationData);
        
        return {
            tsunami,
            seismic,
            crater,
            environmental: this.assessEnvironmentalImpact(landcoverData, crater),
            economic: this.assessEconomicImpact(landcoverData, crater, tsunami, seismic)
        };
    }

    assessEnvironmentalImpact(landcoverData, crater) {
        const { urbanization, vegetation, waterCoverage } = landcoverData;
        const { diameter } = crater;
        
        return {
            ecosystemDamage: vegetation * diameter * 0.1,
            waterContamination: waterCoverage * diameter * 0.05,
            airQualityImpact: urbanization * diameter * 0.2,
            biodiversityLoss: vegetation * diameter * 0.15
        };
    }

    assessEconomicImpact(landcoverData, crater, tsunami, seismic) {
        const { urbanization } = landcoverData;
        const { diameter } = crater;
        const { affectedArea } = tsunami;
        const { damageRadius } = seismic;
        
        const infrastructureDamage = urbanization * diameter * 1000000; // $1M per km per urbanization %
        const tsunamiDamage = affectedArea * 500000; // $500K per km²
        const seismicDamage = damageRadius * 2000000; // $2M per km radius
        
        return {
            totalDamage: infrastructureDamage + tsunamiDamage + seismicDamage,
            infrastructureDamage,
            tsunamiDamage,
            seismicDamage,
            recoveryTime: Math.max(diameter, damageRadius) * 0.1 // years
        };
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = USGSDataService;
} else {
    window.USGSDataService = USGSDataService;
}
