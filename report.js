// PDF Export System for Asteroid Impact Simulator
// Includes orbit screenshot capture and orbital parameters table

// Capture orbit screenshot from Three.js canvas
async function captureOrbitScreenshot() {
    try {
        // Try to find the main Three.js canvas
        let canvas = document.getElementById('earthCanvas') || 
                   document.querySelector('canvas') ||
                   document.querySelector('#simulationCanvas');
        
        if (!canvas) {
            console.warn('No simulation canvas found for screenshot');
            return null;
        }
        
        // Use html2canvas if available, otherwise use canvas.toDataURL
        if (window.html2canvas) {
            const canvasElement = await html2canvas(canvas, {
                useCORS: true,
                backgroundColor: '#000000',
                scale: 1
            });
            return canvasElement.toDataURL('image/png');
        } else {
            // Fallback to direct canvas capture
            return canvas.toDataURL('image/png');
        }
    } catch (error) {
        console.error('Error capturing orbit screenshot:', error);
        return null;
    }
}

// Gather scenario data for PDF export
function gatherScenarioData() {
    const asteroid = asteroidDatabase[currentAsteroidIndex] || {};
    const timestamp = new Date().toISOString();
    
    return {
        timestamp: timestamp,
        asteroid_name: asteroid.name || 'Unknown Asteroid',
        asteroid_diameter: asteroid.diameter || 0,
        asteroid_velocity: asteroid.velocity || 0,
        asteroid_density: asteroid.density || 0,
        target_location: currentTarget.name || 'Unknown Location',
        target_coordinates: `${targetLat.toFixed(4)}°N, ${targetLon.toFixed(4)}°E`,
        impact_energy: document.getElementById('kineticEnergy')?.textContent || '0 J',
        tnt_equivalent: document.getElementById('tntEquivalent')?.textContent || '0 MT',
        crater_diameter: document.getElementById('craterDiameter')?.textContent || '0 km',
        fireball_radius: document.getElementById('fireballRadius')?.textContent || '0 km',
        airblast_radius: document.getElementById('airblastRadius')?.textContent || '0 km',
        thermal_radius: document.getElementById('thermalRadius')?.textContent || '0 km',
        seismic_radius: document.getElementById('seismicRadius')?.textContent || '0 km',
        threat_level: document.getElementById('threatLevel')?.textContent || 'Unknown',
        casualty_estimate: document.getElementById('casualtyEstimate')?.textContent || '0',
        mitigation: window.__LAST_MITIGATION__ || null,
        nasa_data: asteroid.nasaData || null
    };
}

// Generate PDF with orbit screenshot and parameters table
async function generatePDFWithScreenshot(reportData) {
    try {
        // Load jsPDF
        const { jsPDF } = window.jspdf || jspdf || window.jsPDF || {};
        if (!jsPDF) {
            throw new Error('jsPDF library not loaded');
        }
        
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        let y = 50;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Header
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text('Meteor Madness — Impact & Mitigation Report', margin, y);
        
        doc.setFontSize(10);
        doc.text(`Generated: ${reportData.timestamp}`, margin, y + 18);
        doc.text(`Asteroid: ${reportData.asteroid_name}`, margin, y + 34);
        y += 56;
        
        // Capture and embed orbit screenshot
        const orbitScreenshot = await captureOrbitScreenshot();
        if (orbitScreenshot) {
            try {
                const imgProps = doc.getImageProperties(orbitScreenshot);
                const imgWidth = pageWidth - 2 * margin;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                
                // Limit height to prevent overflow
                const maxHeight = 200;
                if (imgHeight > maxHeight) {
                    const scale = maxHeight / imgHeight;
                    doc.addImage(orbitScreenshot, 'PNG', margin, y, imgWidth * scale, maxHeight);
                    y += maxHeight + 16;
                } else {
                    doc.addImage(orbitScreenshot, 'PNG', margin, y, imgWidth, imgHeight);
                    y += imgHeight + 16;
                }
                
                doc.setFontSize(9);
                doc.text('Figure 1. Simulation snapshot showing orbit visualization', margin, y);
                y += 24;
            } catch (imgError) {
                console.warn('Could not embed orbit screenshot:', imgError);
                doc.setFontSize(9);
                doc.text('Simulation screenshot: N/A (visualization not available)', margin, y);
                y += 24;
            }
        } else {
            doc.setFontSize(9);
            doc.text('Simulation screenshot: N/A (no visualization detected)', margin, y);
            y += 24;
        }
        
        // Asteroid Parameters Table
        doc.setFontSize(12);
        doc.text('Asteroid Parameters', margin, y);
        y += 20;
        
        const asteroidParams = [
            ['Parameter', 'Value'],
            ['Name', reportData.asteroid_name],
            ['Diameter', `${reportData.asteroid_diameter} km`],
            ['Velocity', `${reportData.asteroid_velocity} km/s`],
            ['Density', `${reportData.asteroid_density} kg/m³`],
            ['Target Location', reportData.target_location],
            ['Coordinates', reportData.target_coordinates]
        ];
        
        // Draw table
        doc.setFontSize(10);
        asteroidParams.forEach((row, index) => {
            if (index === 0) {
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'bold');
            } else {
                doc.setTextColor(50, 50, 50);
                doc.setFont(undefined, 'normal');
            }
            
            doc.text(row[0], margin, y);
            doc.text(row[1], margin + 150, y);
            y += 16;
        });
        y += 20;
        
        // Impact Consequences
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Impact Consequences', margin, y);
        y += 20;
        
        const impactParams = [
            ['Impact Energy', reportData.impact_energy],
            ['TNT Equivalent', reportData.tnt_equivalent],
            ['Crater Diameter', reportData.crater_diameter],
            ['Fireball Radius', reportData.fireball_radius],
            ['Air Blast Radius', reportData.airblast_radius],
            ['Thermal Radius', reportData.thermal_radius],
            ['Seismic Radius', reportData.seismic_radius],
            ['Threat Level', reportData.threat_level],
            ['Casualty Estimate', reportData.casualty_estimate]
        ];
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        impactParams.forEach(row => {
            doc.text(row[0], margin, y);
            doc.text(row[1], margin + 150, y);
            y += 16;
        });
        y += 20;
        
        // Orbital Parameters Table (if mitigation was applied)
        if (reportData.mitigation && reportData.mitigation.beforeElems && reportData.mitigation.afterElems) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text('Orbital Parameters (Before vs After)', margin, y);
            y += 20;
            
            const before = reportData.mitigation.beforeElems;
            const after = reportData.mitigation.afterElems;
            
            const orbitalParams = [
                ['Parameter', 'Before', 'After'],
                ['Semi-major axis (AU)', before.a?.toFixed(4) || 'N/A', after.a?.toFixed(4) || 'N/A'],
                ['Eccentricity', before.e?.toFixed(4) || 'N/A', after.e?.toFixed(4) || 'N/A'],
                ['Inclination (°)', before.i?.toFixed(2) || 'N/A', after.i?.toFixed(2) || 'N/A'],
                ['RAAN (°)', before.Omega?.toFixed(2) || 'N/A', after.Omega?.toFixed(2) || 'N/A'],
                ['Arg. of Perihelion (°)', before.omega?.toFixed(2) || 'N/A', after.omega?.toFixed(2) || 'N/A'],
                ['Mean Anomaly (°)', before.M?.toFixed(2) || 'N/A', after.M?.toFixed(2) || 'N/A']
            ];
            
            doc.setFontSize(10);
            orbitalParams.forEach((row, index) => {
                if (index === 0) {
                    doc.setFont(undefined, 'bold');
                    doc.setTextColor(0, 0, 0);
                } else {
                    doc.setFont(undefined, 'normal');
                    doc.setTextColor(50, 50, 50);
                }
                
                doc.text(row[0], margin, y);
                doc.text(row[1], margin + 120, y);
                doc.text(row[2], margin + 240, y);
                y += 16;
            });
            y += 20;
            
            // Mitigation Summary
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text('Mitigation Applied', margin, y);
            y += 20;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Type: ${reportData.mitigation.name}`, margin, y);
            y += 16;
            doc.text(`Δv Applied: ${reportData.mitigation.dv_km_s?.map(v => v.toFixed(2)).join(', ')} km/s`, margin, y);
            y += 16;
            
            // Safety assessment
            const periapsisBefore = before.periapsis || (before.a * 1.496e11 * (1 - before.e));
            const periapsisAfter = after.periapsis || (after.a * 1.496e11 * (1 - after.e));
            const earthRadius = 6371000;
            const safetyMargin = 1000000;
            
            if (periapsisAfter > earthRadius + safetyMargin) {
                const missDistance = (periapsisAfter - earthRadius) / 1000;
                doc.text(`Result: SUCCESS - Asteroid will miss Earth by ${missDistance.toFixed(0)} km`, margin, y);
            } else if (periapsisAfter > periapsisBefore) {
                const improvement = ((periapsisAfter - periapsisBefore) / 1000).toFixed(0);
                doc.text(`Result: PARTIAL - Orbit improved by ${improvement} km but still risky`, margin, y);
            } else {
                doc.text(`Result: FAILED - Orbit worsened, impact still likely`, margin, y);
            }
            y += 20;
        }
        
        // NASA Data (if available)
        if (reportData.nasa_data) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text('NASA Data Integration', margin, y);
            y += 20;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Designation: ${reportData.nasa_data.designation || 'N/A'}`, margin, y);
            y += 16;
            doc.text(`Orbit ID: ${reportData.nasa_data.orbital_data?.orbit_id || 'N/A'}`, margin, y);
            y += 16;
            doc.text(`First Observed: ${reportData.nasa_data.orbital_data?.first_observation_date || 'N/A'}`, margin, y);
            y += 16;
            doc.text(`Potentially Hazardous: ${reportData.nasa_data.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}`, margin, y);
            y += 20;
        }
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated by Meteor Madness Asteroid Impact Simulator', margin, doc.internal.pageSize.getHeight() - 20);
        doc.text('NASA Data Integration v2.1', pageWidth - margin - 100, doc.internal.pageSize.getHeight() - 20);
        
        // Save PDF
        const filename = `MeteorMadness_Report_${reportData.timestamp.replace(/[:.]/g, '-')}.pdf`;
        doc.save(filename);
        
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF: ' + error.message);
        return false;
    }
}

// Main export function
async function exportScenarioPDF() {
    const reportData = gatherScenarioData();
    await generatePDFWithScreenshot(reportData);
}

// Scenario save/load functions
function saveScenario() {
    try {
        const scenarioData = {
            timestamp: new Date().toISOString(),
            asteroid: asteroidDatabase[currentAsteroidIndex],
            target: currentTarget,
            coordinates: { lat: targetLat, lon: targetLon },
            uiState: {
                diameter: document.getElementById('diameter')?.value,
                velocity: document.getElementById('velocity')?.value,
                angle: document.getElementById('angle')?.value,
                density: document.getElementById('density')?.value,
                composition: document.getElementById('composition')?.value
            },
            mitigation: window.__LAST_MITIGATION__,
            physics: {
                mass: document.getElementById('asteroidMass')?.textContent,
                kineticEnergy: document.getElementById('kineticEnergy')?.textContent,
                tntEquivalent: document.getElementById('tntEquivalent')?.textContent
            }
        };
        
        const dataStr = JSON.stringify(scenarioData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `MeteorMadness_Scenario_${scenarioData.timestamp.replace(/[:.]/g, '-')}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        // Show success message
        const message = document.createElement('div');
        message.textContent = '✅ Scenario saved successfully!';
        message.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: #d4edda; color: #155724; padding: 10px 20px;
            border-radius: 5px; border: 1px solid #c3e6cb;
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
        
    } catch (error) {
        console.error('Error saving scenario:', error);
        alert('Failed to save scenario: ' + error.message);
    }
}

function loadScenario() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const scenarioData = JSON.parse(e.target.result);
                
                // Restore asteroid
                if (scenarioData.asteroid) {
                    const asteroidIndex = asteroidDatabase.findIndex(a => a.name === scenarioData.asteroid.name);
                    if (asteroidIndex >= 0) {
                        currentAsteroidIndex = asteroidIndex;
                        updateAsteroidDisplays();
                    }
                }
                
                // Restore target
                if (scenarioData.target) {
                    currentTarget = scenarioData.target;
                    document.getElementById('targetName').textContent = currentTarget.name;
                }
                
                // Restore coordinates
                if (scenarioData.coordinates) {
                    targetLat = scenarioData.coordinates.lat;
                    targetLon = scenarioData.coordinates.lon;
                    document.getElementById('coordinates').textContent = `${targetLat.toFixed(4)}°N, ${targetLon.toFixed(4)}°E`;
                }
                
                // Restore UI state
                if (scenarioData.uiState) {
                    const ui = scenarioData.uiState;
                    if (ui.diameter) document.getElementById('diameter').value = ui.diameter;
                    if (ui.velocity) document.getElementById('velocity').value = ui.velocity;
                    if (ui.angle) document.getElementById('angle').value = ui.angle;
                    if (ui.density) document.getElementById('density').value = ui.density;
                    if (ui.composition) document.getElementById('composition').value = ui.composition;
                    updateAsteroid();
                }
                
                // Restore mitigation
                if (scenarioData.mitigation) {
                    window.__LAST_MITIGATION__ = scenarioData.mitigation;
                }
                
                // Show success message
                const message = document.createElement('div');
                message.textContent = '✅ Scenario loaded successfully!';
                message.style.cssText = `
                    position: fixed; top: 20px; right: 20px; z-index: 10000;
                    background: #d4edda; color: #155724; padding: 10px 20px;
                    border-radius: 5px; border: 1px solid #c3e6cb;
                `;
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 3000);
                
            } catch (error) {
                console.error('Error loading scenario:', error);
                alert('Failed to load scenario: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Make functions globally available
window.exportScenarioPDF = exportScenarioPDF;
window.saveScenario = saveScenario;
window.loadScenario = loadScenario;
