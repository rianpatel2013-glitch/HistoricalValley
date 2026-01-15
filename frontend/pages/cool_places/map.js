window.addEventListener('load', function() {
    // Add Map
    const map = L.map('map').setView([32.9312, -96.9492], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        noWrap: true,
        maxBoundsViscosity: 1.0
    }).addTo(map);

    // Max Bounds to Prevent Duplicate World Maps
    const southWest = L.latLng(-85, -180);
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);
    map.setMinZoom(2);

    // Valley Ranch Boundary Coordinates - Polygon
    const valleyRanchBoundary = [
        [32.948877, -96.965716],  // Northwest Corner
        [32.946860, -96.942971],  // Northeast Corner
        [32.914082, -96.941340],  // Southeast Corner
        [32.921287, -96.961682],  // Southwest Corner
        [32.951902, -96.968034]   // Draw Last Line Back to Northwest Corner
    ];

    // Polygon Outline
    const valleyRanchPolygon = L.polygon(valleyRanchBoundary, {
        color: '#002938',
        weight: 3
    }).addTo(map);

    // Polygon Popup
    valleyRanchPolygon.bindPopup('<b>Valley Ranch</b><br>Irving, Texas');

    // Valley Ranch Canals Marker
    const canalMarker = L.marker([32.9350918,-96.9546313]).addTo(map);
    canalMarker.bindPopup('<b>Valley Ranch Canals</b><br>Scenic waterways and walking paths');

    // Cimarron Park Recreation Center Marker
    const customMarker = L.marker([32.9312322, -96.9471744]).addTo(map);
    customMarker.bindPopup('<b>Cimarron Park Recreation Center</b><br>Community hub and recreation facility');

    // Center on Valley Ranch Polygon
    map.fitBounds(valleyRanchPolygon.getBounds().pad(0.1));

    // // Add Compass Rose
    // L.control.scale({
    //     position: 'bottomright',
    //     imperial: true,
    //     metric: false
    // }).addTo(map);

    // // Make Compass Rose Complete
    // const compassControl = L.Control.extend({
    //     options: {
    //         position: 'bottomright'
    //     },
    //     onAdd: function(map) {
    //         const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    //         container.style.backgroundColor = 'white';
    //         container.style.padding = '10px';
    //         container.style.borderRadius = '4px';
    //         container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
    //         container.innerHTML = `
    //         <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    //             <!-- Outer circle -->
    //             <circle cx="30" cy="30" r="28" fill="none" stroke="black" stroke-width="1.5"/>

    //             <!-- Cardinal & Ordinal Direction Arrows (Lines + Triangular Tips) -->
    //             <!-- N -->
    //             <line x1="30" y1="30" x2="30" y2="14" stroke="black" stroke-width="1.5"/>
    //             <polygon points="30,10 33,15 27,15" fill="black"/>
    //             <text x="30" y="8" text-anchor="middle" font-size="8" fill="black">N</text>

    //             <!-- NE -->
    //             <line x1="30" y1="30" x2="41" y2="19" stroke="black" stroke-width="1.5"/>
    //             <polygon points="44,16 47,19 41,19" fill="black" transform="rotate(45 30 30)"/>
    //             <text x="46" y="15" text-anchor="middle" font-size="8" fill="black">NE</text>

    //             <!-- E -->
    //             <line x1="30" y1="30" x2="46" y2="30" stroke="black" stroke-width="1.5"/>
    //             <polygon points="49,30 46,33 46,27" fill="black" transform="rotate(90 30 30)"/>
    //             <text x="51" y="34" text-anchor="middle" font-size="8" fill="black">E</text>

    //             <!-- SE -->
    //             <line x1="30" y1="30" x2="41" y2="41" stroke="black" stroke-width="1.5"/>
    //             <polygon points="44,44 47,47 41,47" fill="black" transform="rotate(135 30 30)"/>
    //             <text x="46" y="50" text-anchor="middle" font-size="8" fill="black">SE</text>

    //             <!-- S -->
    //             <line x1="30" y1="30" x2="30" y2="46" stroke="black" stroke-width="1.5"/>
    //             <polygon points="30,49 27,44 33,44" fill="black" transform="rotate(180 30 30)"/>
    //             <text x="30" y="54" text-anchor="middle" font-size="8" fill="black">S</text>

    //             <!-- SW -->
    //             <line x1="30" y1="30" x2="19" y2="41" stroke="black" stroke-width="1.5"/>
    //             <polygon points="16,44 19,47 13,47" fill="black" transform="rotate(-135 30 30)"/>
    //             <text x="14" y="50" text-anchor="middle" font-size="8" fill="black">SW</text>

    //             <!-- W -->
    //             <line x1="30" y1="30" x2="14" y2="30" stroke="black" stroke-width="1.5"/>
    //             <polygon points="11,30 14,27 14,33" fill="black" transform="rotate(-90 30 30)"/>
    //             <text x="6" y="34" text-anchor="middle" font-size="8" fill="black">W</text>

    //             <!-- NW -->
    //             <line x1="30" y1="30" x2="19" y2="19" stroke="black" stroke-width="1.5"/>
    //             <polygon points="16,16 19,13 13,13" fill="black" transform="rotate(-45 30 30)"/>
    //             <text x="14" y="15" text-anchor="middle" font-size="8" fill="black">NW</text>

    //             <!-- Center dot -->
    //             <circle cx="30" cy="30" r="1" fill="black"/>
    //         </svg>      
    //         `;
    //         return container;
    //     }
    // });
    // map.addControl(new compassControl());

    // Function to zoom to specific location on map
    window.showLocationOnMap = function(locationName) {
        // Scroll to Map
        const mapElement = document.getElementById('map');
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Zoom to Marker After Scrolling is Finished
        setTimeout(() => {
            map.invalidateSize();

            if (locationName.includes('Cimarron')) {
                map.setView([32.9312322, -96.9471744], 17, { animate: true });
                setTimeout(() => customMarker.openPopup(), 500);
            } else if (locationName.includes('Canal')) {
                map.setView([32.9350918,-96.9546313], 17, { animate: true });
                setTimeout(() => canalMarker.openPopup(), 500);
            }
        }, 800);
    };
});