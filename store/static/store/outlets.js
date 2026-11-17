(function () {
  const root = document.querySelector('.outlet-finder');
  if (!root) return;
  const translate = (text) => window.tazaTranslate ? window.tazaTranslate(text) : text;
  const apiUrl = root.dataset.apiUrl;
  const mode = root.dataset.mode || 'DINE_IN';
  const list = document.getElementById('outletList');
  const count = document.getElementById('outletCount');
  const locationMessage = document.getElementById('locationMessage');
  const locationButton = document.getElementById('useLocation');
  const radiusRange = document.getElementById('radiusRange');
  const radiusValue = document.getElementById('radiusValue');
  const csrfToken = document.querySelector('#csrfOutletForm input[name="csrfmiddlewaretoken"]')?.value || '';
  let userPoint = null;
  let map = null;
  let markerLayer = null;
  let radiusCircle = null;
  let outletRows = [];

  function initMap() {
    const mapElement = document.getElementById('outletMap');
    if (!mapElement) return;
    if (!window.L) {
      mapElement.textContent = translate('Map could not load. You can still select an outlet from the list.');
      return;
    }
    map = L.map(mapElement).setView([22.3569, 91.7832], 12); // Demo map centre: Chattogram city.
    // OpenStreetMap's public standard tile service requires this exact host.
    // Do not use the {s}.tile.openstreetmap.org subdomains.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    markerLayer = L.layerGroup().addTo(map);
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function buildOutletCard(outlet, index) {
    const card = element('article', 'outlet-card');
    const top = element('div', 'outlet-card-top');
    top.append(element('span', 'outlet-pin', String(index + 1).padStart(2, '0')));
    top.append(element('span', 'outlet-area', outlet.area || translate('TAZA OUTLET')));
    card.append(top);
    card.append(element('h3', '', outlet.name));
    card.append(element('p', '', outlet.address));
    const phone = element('a', 'outlet-phone', '☎ ' + outlet.phone);
    phone.href = 'tel:' + outlet.phone.replace(/[^0-9+]/g, '');
    card.append(phone);
    card.append(element('small', '', outlet.opening_hours));
    if (outlet.distance_km !== null && outlet.distance_km !== undefined) {
      card.append(element('small', 'outlet-distance', outlet.distance_km.toFixed(2) + ' ' + translate('km away')));
    }
    const form = element('form');
    form.method = 'post';
    form.action = root.dataset.selectUrlTemplate.replace('999999', outlet.id);
    const token = element('input'); token.type = 'hidden'; token.name = 'csrfmiddlewaretoken'; token.value = csrfToken;
    const modeInput = element('input'); modeInput.type = 'hidden'; modeInput.name = 'mode'; modeInput.value = mode;
    const button = element('button', 'button button-outline button-full', translate('Select this outlet →')); button.type = 'submit';
    form.append(token, modeInput, button);
    card.append(form);
    if (outlet.is_demo) card.append(element('em', 'demo-tag', translate('DEMO LOCATION · REPLACE IN ADMIN')));
    return card;
  }

  function renderOutlets(rows) {
    outletRows = rows;
    list.replaceChildren();
    count.textContent = String(rows.length);
    if (!rows.length) {
      list.append(element('div', 'empty-state', translate('No outlets found in this radius. Increase the search radius or view all outlets.')));
    } else {
      rows.forEach((outlet, index) => list.append(buildOutletCard(outlet, index)));
    }
    if (markerLayer) {
      markerLayer.clearLayers();
      rows.forEach((outlet) => {
        const marker = L.marker([outlet.latitude, outlet.longitude]);
        const distance = outlet.distance_km === null ? '' : '<br>' + outlet.distance_km.toFixed(2) + ' km away';
        marker.bindPopup('<strong>' + escapeHtml(outlet.name) + '</strong><br>' + escapeHtml(outlet.address) + distance);
        marker.addTo(markerLayer);
      });
      if (userPoint && !radiusCircle) map.setView([userPoint.lat, userPoint.lng], 13);
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  }

  async function loadOutlets() {
    const radius = Number(radiusRange.value || 10);
    const params = new URLSearchParams({ radius: String(radius) });
    if (userPoint) { params.set('lat', userPoint.lat); params.set('lng', userPoint.lng); }
    try {
      const response = await fetch(apiUrl + '?' + params.toString(), { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(translate('Could not retrieve outlets.'));
      const data = await response.json();
      renderOutlets(data.results || []);
    } catch (error) {
      locationMessage.textContent = translate('Could not refresh nearby outlets. The default list remains available; check your internet connection and try again.');
    }
  }

  function updateRadiusCircle() {
    if (!map || !userPoint) return;
    if (radiusCircle) radiusCircle.remove();
    radiusCircle = L.circle([userPoint.lat, userPoint.lng], {
      radius: Number(radiusRange.value) * 1000,
      color: '#d71920', fillColor: '#d71920', fillOpacity: 0.07, weight: 1
    }).addTo(map);
    map.setView([userPoint.lat, userPoint.lng], 12);
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      locationMessage.textContent = translate('Your browser does not support location access. Choose an outlet manually from the list.');
      return;
    }
    locationButton.disabled = true;
    locationButton.textContent = translate('Finding you…');
    locationMessage.textContent = translate('Waiting for browser location permission…');
    navigator.geolocation.getCurrentPosition((position) => {
      userPoint = { lat: position.coords.latitude, lng: position.coords.longitude };
      locationMessage.textContent = translate('Location found. Showing outlets within') + ' ' + radiusRange.value + ' ' + translate('km of your current position.');
      locationButton.disabled = false;
      locationButton.textContent = translate('Location found ✓');
      updateRadiusCircle();
      loadOutlets();
    }, (error) => {
      const messages = {
        1: translate('Location permission was denied. You can still select an outlet manually from the list.'),
        2: translate('Your location is unavailable. Check device location settings or select manually.'),
        3: translate('The location request timed out. Try again or select an outlet manually.')
      };
      locationMessage.textContent = messages[error.code] || translate('Could not get your location. Select an outlet manually.');
      locationButton.disabled = false;
      locationButton.textContent = translate('Try location again ↗');
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  }

  initMap();
  if (locationButton) locationButton.addEventListener('click', requestLocation);
  radiusRange.addEventListener('input', () => { radiusValue.textContent = radiusRange.value; if (userPoint) updateRadiusCircle(); });
  radiusRange.addEventListener('change', loadOutlets);
  loadOutlets();
})();
