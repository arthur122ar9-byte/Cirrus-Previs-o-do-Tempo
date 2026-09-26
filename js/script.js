// ==========================================
// CONFIGURAÇÕES
// ==========================================

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");

const weatherContent = document.getElementById("weatherContent");

const cityName = document.getElementById("cityName");
const country = document.getElementById("country");
const date = document.getElementById("date");

const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");

const hourlyForecast = document.getElementById("hourlyForecast");
const dailyForecast = document.getElementById("dailyForecast");

const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");

const favoriteButton = document.getElementById("favoriteButton");
const themeButton = document.getElementById("themeButton");
const unitButton = document.getElementById("unitButton");


// ==========================================
// ESTADO
// ==========================================

let currentWeather = null;

let currentUnit = "celsius";

let currentCity = "";


// ==========================================
// CÓDIGOS DO CLIMA
// ==========================================

function getWeatherInfo(code) {

    const weather = {

        0: {
            description: "Céu limpo",
            icon: "☀️"
        },

        1: {
            description: "Principalmente limpo",
            icon: "🌤️"
        },

        2: {
            description: "Parcialmente nublado",
            icon: "⛅"
        },

        3: {
            description: "Nublado",
            icon: "☁️"
        },

        45: {
            description: "Neblina",
            icon: "🌫️"
        },

        48: {
            description: "Neblina",
            icon: "🌫️"
        },

        51: {
            description: "Garoa leve",
            icon: "🌦️"
        },

        53: {
            description: "Garoa",
            icon: "🌦️"
        },

        55: {
            description: "Garoa intensa",
            icon: "🌧️"
        },

        61: {
            description: "Chuva leve",
            icon: "🌦️"
        },

        63: {
            description: "Chuva",
            icon: "🌧️"
        },

        65: {
            description: "Chuva forte",
            icon: "🌧️"
        },

        71: {
            description: "Neve leve",
            icon: "🌨️"
        },

        73: {
            description: "Neve",
            icon: "❄️"
        },

        75: {
            description: "Neve forte",
            icon: "❄️"
        },

        80: {
            description: "Pancadas de chuva",
            icon: "🌦️"
        },

        81: {
            description: "Pancadas de chuva",
            icon: "🌧️"
        },

        82: {
            description: "Pancadas fortes",
            icon: "⛈️"
        },

        95: {
            description: "Tempestade",
            icon: "⛈️"
        }

    };

    return weather[code] || {
        description: "Condição desconhecida",
        icon: "🌤️"
    };
}


// ==========================================
// BUSCAR COORDENADAS DA CIDADE
// ==========================================

async function searchCity(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar cidade.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("Cidade não encontrada.");
    }

    return data.results[0];
}


// ==========================================
// BUSCAR CLIMA
// ==========================================

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erro ao buscar previsão.");
    }

    return await response.json();
}


// ==========================================
// BUSCAR CIDADE COMPLETA
// ==========================================

async function searchWeather(city) {

    try {

        showLoading();

        const location = await searchCity(city);

        const weather = await getWeather(
            location.latitude,
            location.longitude
        );

        currentCity = location.name;

        currentWeather = {
            location,
            weather
        };

        displayWeather();

        saveToHistory(location.name);

        renderHistory();

    } catch (error) {

        showError(
            error.message ||
            "Não foi possível obter os dados."
        );

    } finally {

        hideLoading();

    }

}


// ==========================================
// MOSTRAR CLIMA
// ==========================================

function displayWeather() {

    const location = currentWeather.location;

    const weather = currentWeather.weather;

    const current = weather.current;

    const weatherInfo =
        getWeatherInfo(current.weather_code);


    weatherContent.classList.remove("hidden");


    cityName.textContent =
        location.name;


    country.textContent =
        location.country_code || location.country;


    date.textContent =
        formatDate(new Date());


    temperature.textContent =
        convertTemperature(
            current.temperature_2m
        );


    description.textContent =
        weatherInfo.description;


    weatherIcon.textContent =
        weatherInfo.icon;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;


    feelsLike.textContent =
        `${convertTemperature(current.apparent_temperature)}°`;


    renderHourly(weather);


    renderDaily(weather);

}


// ==========================================
// PREVISÃO POR HORA
// ==========================================

function renderHourly(weather) {

    hourlyForecast.innerHTML = "";

    const times =
        weather.hourly.time;

    const temperatures =
        weather.hourly.temperature_2m;

    const codes =
        weather.hourly.weather_code;


    const currentHour =
        new Date().getHours();


    for (
        let i = currentHour; i < currentHour + 8; i++
    ) {

        if (!times[i]) continue;


        const info =
            getWeatherInfo(codes[i]);


        const hour =
            new Date(times[i])
            .getHours()
            .toString()
            .padStart(2, "0");


        const card =
            document.createElement("div");


        card.className =
            "hour-card";


        card.innerHTML = `
            <span>${hour}:00</span>

            <div class="icon">
                ${info.icon}
            </div>

            <strong>
                ${convertTemperature(temperatures[i])}°
            </strong>
        `;


        hourlyForecast.appendChild(card);

    }

}


// ==========================================
// PREVISÃO DOS DIAS
// ==========================================

function renderDaily(weather) {

    dailyForecast.innerHTML = "";


    const dates =
        weather.daily.time;

    const codes =
        weather.daily.weather_code;

    const max =
        weather.daily.temperature_2m_max;

    const min =
        weather.daily.temperature_2m_min;


    for (
        let i = 0; i < Math.min(dates.length, 7); i++
    ) {

        const info =
            getWeatherInfo(codes[i]);


        const dateObject =
            new Date(dates[i] + "T12:00:00");


        const day =
            i === 0 ?
            "Hoje" :
            dateObject.toLocaleDateString(
                "pt-BR", {
                    weekday: "short"
                }
            );


        const card =
            document.createElement("div");


        card.className =
            "day-card";


        card.innerHTML = `

            <div class="day-name">
                ${capitalize(day)}
            </div>

            <div class="day-weather">
                ${info.icon}
            </div>

            <div class="day-description">
                ${info.description}
            </div>

            <div class="day-temperature">
                ${convertTemperature(max[i])}°
                /
                ${convertTemperature(min[i])}°
            </div>

        `;


        dailyForecast.appendChild(card);

    }

}


// ==========================================
// CONVERSÃO DE TEMPERATURA
// ==========================================

function convertTemperature(value) {

    if (currentUnit === "celsius") {

        return Math.round(value);

    }

    return Math.round(
        (value * 9 / 5) + 32
    );

}


// ==========================================
// FORMATAÇÃO DE DATA
// ==========================================

function formatDate(date) {

    return date.toLocaleDateString(
        "pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

}


function capitalize(text) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    error.classList.add("hidden");

    weatherContent.classList.add("hidden");

}


function hideLoading() {

    loading.classList.add("hidden");

}


// ==========================================
// ERRO
// ==========================================

function showError(message) {

    error.classList.remove("hidden");

    errorMessage.textContent =
        message;

    weatherContent.classList.add("hidden");

}


// ==========================================
// HISTÓRICO
// ==========================================

function getHistory() {

    return JSON.parse(
        localStorage.getItem("weatherHistory")
    ) || [];

}


function saveToHistory(city) {

    let history =
        getHistory();


    history =
        history.filter(
            item =>
            item.toLowerCase() !==
            city.toLowerCase()
        );


    history.unshift(city);


    history =
        history.slice(0, 6);


    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(history)
    );

}


function renderHistory() {

    const history =
        getHistory();


    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            "<p>Nenhuma pesquisa recente.</p>";

        return;

    }


    history.forEach(city => {

        const button =
            document.createElement("button");


        button.className =
            "history-item";


        button.textContent =
            `📍 ${city}`;


        button.addEventListener(
            "click",
            () => searchWeather(city)
        );


        historyList.appendChild(button);

    });

}


clearHistory.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "weatherHistory"
        );

        renderHistory();

    }
);


// ==========================================
// FAVORITO
// ==========================================

favoriteButton.addEventListener(
    "click",
    () => {

        const favorites =
            JSON.parse(
                localStorage.getItem(
                    "weatherFavorites"
                )
            ) || [];


        const exists =
            favorites.includes(currentCity);


        if (exists) {

            const newFavorites =
                favorites.filter(
                    city =>
                    city !== currentCity
                );


            localStorage.setItem(
                "weatherFavorites",
                JSON.stringify(newFavorites)
            );


            favoriteButton.textContent = "☆";

        } else {

            favorites.push(currentCity);


            localStorage.setItem(
                "weatherFavorites",
                JSON.stringify(favorites)
            );


            favoriteButton.textContent = "★";

        }

    }
);


// ==========================================
// TEMA
// ==========================================

themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains(
                "dark"
            );


        themeButton.textContent =
            dark ? "☀️" : "🌙";


        localStorage.setItem(
            "darkMode",
            dark
        );

    }
);


// ==========================================
// UNIDADE
// ==========================================

unitButton.addEventListener(
    "click",
    () => {

        currentUnit =
            currentUnit === "celsius" ?
            "fahrenheit" :
            "celsius";


        unitButton.textContent =
            currentUnit === "celsius" ?
            "°C" :
            "°F";


        if (currentWeather) {

            displayWeather();

        }

    }
);


// ==========================================
// LOCALIZAÇÃO
// ==========================================

locationButton.addEventListener(
    "click",
    () => {

        if (!navigator.geolocation) {

            showError(
                "Seu navegador não suporta localização."
            );

            return;

        }


        showLoading();


        navigator.geolocation.getCurrentPosition(

            async position => {

                try {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;


                    const weather =
                        await getWeather(
                            latitude,
                            longitude
                        );


                    const locationResponse =
                        await fetch(
                            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=pt&format=json`
                        );


                    const locationData =
                        await locationResponse.json();


                    const location =
                        locationData.results[0] || {
                            name: "Minha localização",
                            country_code: ""
                        };


                    currentCity =
                        location.name;


                    currentWeather = {
                        location,
                        weather
                    };


                    displayWeather();


                } catch (error) {

                    showError(
                        "Não foi possível obter sua localização."
                    );

                } finally {

                    hideLoading();

                }

            },

            () => {

                hideLoading();

                showError(
                    "Permita o acesso à localização para usar essa função."
                );

            }

        );

    }
);


// ==========================================
// PESQUISA
// ==========================================

searchButton.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();


        if (!city) {

            showError(
                "Digite o nome de uma cidade."
            );

            return;

        }


        searchWeather(city);

    }
);


cityInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchButton.click();

        }

    }
);


// ==========================================
// CONFIGURAÇÕES SALVAS
// ==========================================

function loadSettings() {

    const dark =
        localStorage.getItem(
            "darkMode"
        ) === "true";


    if (dark) {

        document.body.classList.add("dark");

        themeButton.textContent =
            "☀️";

    }


    renderHistory();

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

loadSettings();

searchWeather("São Paulo");