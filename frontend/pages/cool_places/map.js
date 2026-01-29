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
        [32.951902, -96.968034],
        [32.948877, -96.965716],
        [32.947500, -96.958000],
        [32.947200, -96.950000],
        [32.946860, -96.942971],
        [32.943000, -96.941500],
        [32.938000, -96.940800],
        [32.930000, -96.940500],
        [32.920000, -96.940800],
        [32.914082, -96.941340],
        [32.914500, -96.948000],
        [32.914800, -96.955000],
        [32.915200, -96.961000],
        [32.921287, -96.961682],
        [32.928000, -96.963000],
        [32.935000, -96.964500],
        [32.942000, -96.966000],
        [32.951902, -96.968034]
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

    // Bruno's Ristorante Marker
    const brunosMarker = L.marker([32.9346803, -96.9563815]).addTo(map);
    brunosMarker.bindPopup('<b>Bruno\'s Ristorante</b><br>Italian cuisine and fine dining');


    // Center on Valley Ranch Polygon
    map.fitBounds(valleyRanchPolygon.getBounds().pad(0.1));

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
            } else if (locationName.includes('Bruno')) {
                map.setView([32.9346803, -96.9563815], 17, { animate: true });
                setTimeout(() => brunosMarker.openPopup(), 500);
            }
        }, 800);
    };
});