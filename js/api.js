// ==========================================
// GEOCODING
// ==========================================

async function searchCity(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodeURIComponent(city)}` +
        `&count=1` +
        `&language=pt` +
        `&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao pesquisar cidade.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("Cidade não encontrada.");
    }

    return data.results[0];
}


// ==========================================
// CLIMA
// ==========================================

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar previsão.");
    }

    return await response.json();
}


// ==========================================
// CLIMA POR LOCALIZAÇÃO
// ==========================================

async function getLocationName(latitude, longitude) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/reverse` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&count=1` +
        `&language=pt` +
        `&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        return {
            name: "Minha localização",
            country_code: ""
        };
    }

    const data = await response.json();

    return data.results[0] || {
        name: "Minha localização",
        country_code: ""
    };
}