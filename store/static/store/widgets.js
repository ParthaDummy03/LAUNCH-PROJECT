(function () {
  const translate = (text) => window.tazaTranslate ? window.tazaTranslate(text) : text;
  const icons = {
    Clear: ["☀️", "sun"], Clouds: ["☁️", "cloud"], Rain: ["🌧️", "rain"],
    Drizzle: ["🌦️", "rain"], Thunderstorm: ["⛈️", "rain"], Snow: ["❄️", "cloud"],
  };
  const icon = document.getElementById("w-icon");
  const temperature = document.getElementById("w-temp");
  const description = document.getElementById("w-desc");
  const locationButton = document.getElementById("w-location");
  let latestWeather = null;

  function renderWeatherDescription(data) {
    description.textContent = `${data.city} · ${translate(data.desc)}`;
  }

  async function showWeather(lat, lon) {
    description.textContent = translate("Loading weather…");
    try {
      const response = await fetch(`/api/weather/?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Weather is unavailable.");
      latestWeather = data;
      const [emoji, style] = icons[data.main] || ["🌫️", "cloud"];
      icon.textContent = emoji;
      icon.className = `weather-icon ${style}`;
      temperature.textContent = `${data.temp}°C`;
      renderWeatherDescription(data);
    } catch (error) {
      description.textContent = translate(error.message || "Weather is unavailable.");
    }
  }

  window.addEventListener("taza-language-change", () => {
    if (latestWeather) renderWeatherDescription(latestWeather);
  });

  // Use Chattogram by default without requesting location until the visitor clicks.
  showWeather(22.3569, 91.7832);
  locationButton.addEventListener("click", function () {
    if (!navigator.geolocation) {
      description.textContent = translate("Location is not supported by this browser.");
      return;
    }
    description.textContent = translate("Finding your location…");
    const locationFallback = window.setTimeout(() => {
      description.textContent = translate("Location timed out. Showing Chattogram.");
      showWeather(22.3569, 91.7832);
    }, 12000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        window.clearTimeout(locationFallback);
        showWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        window.clearTimeout(locationFallback);
        description.textContent = translate("Location unavailable. Showing Chattogram.");
        showWeather(22.3569, 91.7832);
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  });

  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-in");
  const send = document.getElementById("chat-send");
  function addLine(text, sender) {
    const line = document.createElement("div");
    line.className = `chat-message ${sender === "user" ? "chat-user" : "chat-bot"}`;
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    input.disabled = true;
    send.disabled = true;
    send.textContent = "…";
    addLine(message, "user");
    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": CSRF },
        body: JSON.stringify({ message, language: document.documentElement.lang === "bn" ? "bn" : "en" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant could not answer.");
      addLine(data.reply, "bot");
    } catch (error) {
      addLine(translate(error.message || "Could not reach the assistant. Please try again."), "bot");
    } finally {
      input.disabled = false;
      send.disabled = false;
      send.textContent = translate("Send");
      input.focus();
    }
  });
})();
