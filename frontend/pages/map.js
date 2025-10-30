window.addEventListener('load', function() {
    const map = L.map('map').setView([32.9312, -96.9492], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

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

    // Polygon Label
    valleyRanchPolygon.bindPopup('<b>Valley Ranch</b><br>Irving, Texas');

    // Valley Ranch Canals Marker
    const canalMarker = L.marker([32.9350918,-96.9546313]).addTo(map);
    canalMarker.bindPopup('<b>Valley Ranch Canals</b><br>Scenic waterways and walking paths');

    // Cimarron Park Recreation Center Marker
    const customMarker = L.marker([32.9312322, -96.9471744]).addTo(map);
    customMarker.bindPopup('<b>Cimarron Park Recreation Center</b><br>Community hub and recreation facility');

    map.fitBounds(valleyRanchPolygon.getBounds().pad(0.1));

    setTimeout(() => {
        const titles = document.querySelectorAll('.significantBox .tag h2');
        
        titles.forEach(title => {
            const titleText = title.textContent.trim();
            
            // Make titles clickable
            title.style.cursor = 'pointer';
            title.style.transition = 'color 0.3s ease';
            
            // Add hover effect - darker color
            title.addEventListener('mouseenter', () => {
                title.style.color = '#005566';
            });
            
            title.addEventListener('mouseleave', () => {
                title.style.color = '#002938';
            });
            
            // Add click handler
            title.addEventListener('click', () => {
                // Scroll to the map
                const mapElement = document.getElementById('map');
                mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Wait for scroll to finish, then zoom to marker
                setTimeout(() => {
                    if (titleText.includes('Cimarron Park')) {
                        map.setView([32.9312322, -96.9471744], 17, { animate: true });
                        setTimeout(() => customMarker.openPopup(), 500);
                    } else if (titleText.includes('Canal')) {
                        map.setView([32.9350, -96.9500], 17, { animate: true });
                        setTimeout(() => canalMarker.openPopup(), 500);
                    }
                }, 800); // Wait 800ms for smooth scroll to finish
            });
        });
    }, 100);
});