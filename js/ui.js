// ==========================================
// ELEMENTOS
// ==========================================

const elements = {

    weatherContent: document.getElementById(
        "weatherContent"
    ),

    loading: document.getElementById(
        "loading"
    ),

    error: document.getElementById(
        "error"
    ),

    errorMessage: document.getElementById(
        "errorMessage"
    ),

    cityName: document.getElementById(
        "cityName"
    ),

    country: document.getElementById(
        "country"
    ),

    date: document.getElementById(
        "date"
    ),

    temperature: document.getElementById(
        "temperature"
    ),

    description: document.getElementById(
        "description"
    ),

    weatherIcon: document.getElementById(
        "weatherIcon"
    ),

    humidity: document.getElementById(
        "humidity"
    ),

    wind: document.getElementById(
        "wind"
    ),

    feelsLike: document.getElementById(
        "feelsLike"
    ),

    hourly: document.getElementById(
        "hourlyForecast"
    ),

    daily: document.getElementById(
        "dailyForecast"
    ),

    history: document.getElementById(
        "historyList"
    ),

    chartHumidity: document.getElementById(
        "chartHumidity"
    ),

    chartWind: document.getElementById(
        "chartWind"
    ),

    chartMax: document.getElementById(
        "chartMax"
    ),

    chartMin: document.getElementById(
        "chartMin"
    ),

    sunrise: document.getElementById(
        "sunrise"
    ),

    sunset: document.getElementById(
        "sunset"
    )

};


// ==========================================
// INFORMAÇÕES DO CLIMA
// ==========================================

function getWeatherInfo(code) {

    const weather = {

        0: ["Céu limpo", "☀️", "clear"],

        1: ["Principalmente limpo", "🌤️", "partly-cloudy"],

        2: ["Parcialmente nublado", "⛅", "partly-cloudy"],

        3: ["Nublado", "☁️", "cloudy"],

        45: ["Neblina", "🌫️", "fog"],

        48: ["Neblina", "🌫️", "fog"],

        51: ["Garoa leve", "🌦️", "rain"],

        53: ["Garoa", "🌦️", "rain"],

        55: ["Garoa forte", "🌧️", "rain"],

        61: ["Chuva leve", "🌦️", "rain"],

        63: ["Chuva", "🌧️", "rain"],

        65: ["Chuva forte", "🌧️", "rain"],

        66: ["Chuva congelante", "🌧️", "rain"],

        67: ["Chuva congelante forte", "🌧️", "rain"],

        71: ["Neve leve", "🌨️", "snow"],

        73: ["Neve", "❄️", "snow"],

        75: ["Neve forte", "❄️", "snow"],

        80: ["Pancadas de chuva", "🌦️", "rain"],

        81: ["Pancadas de chuva", "🌧️", "rain"],

        82: ["Pancadas fortes", "⛈️", "storm"],

        95: ["Tempestade", "⛈️", "storm"],

        96: ["Tempestade com granizo", "⛈️", "storm"],

        99: ["Tempestade forte com granizo", "⛈️", "storm"]

    };


    return weather[code] || [
        "Condição desconhecida",
        "🌤️",
        "clear"
    ];

}


// ==========================================
// MOSTRAR CLIMA
// ==========================================

function renderWeather(location, weather, unit) {

    const current =
        weather.current;


    // Fundo baseado na temperatura
    updateTemperatureBackground(
        current.temperature_2m
    );


    // Ativa/desativa chuva
    updateRainEffect(
        current.weather_code
    );


    const info =
        getWeatherInfo(
            current.weather_code
        );


    elements.weatherContent
        .classList
        .remove("hidden");


    elements.cityName.textContent =
        location.name;


    elements.country.textContent =
        location.country_code ||
        location.country ||
        "";


    elements.date.textContent =
        new Date().toLocaleDateString(
            "pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );


    elements.temperature.textContent =
        convertTemperature(
            current.temperature_2m,
            unit
        );


    elements.description.textContent =
        info[0];


    elements.weatherIcon.textContent =
        info[1];


    elements.humidity.textContent =
        `${current.relative_humidity_2m}%`;


    elements.wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    elements.feelsLike.textContent =
        `${convertTemperature(
            current.apparent_temperature,
            unit
        )}°`;


    renderHourly(
        weather,
        unit
    );


    renderDaily(
        weather,
        unit
    );


    renderChartStats(
        weather,
        unit
    );

}


// ==========================================
// PREVISÃO POR HORA
// ==========================================

function renderHourly(weather, unit) {

    elements.hourly.innerHTML = "";


    const now =
        new Date().getHours();


    for (
        let i = now; i < now + 8; i++
    ) {

        if (!weather.hourly.time[i]) {
            continue;
        }


        const info =
            getWeatherInfo(
                weather.hourly.weather_code[i]
            );


        const hour =
            new Date(
                weather.hourly.time[i]
            )
            .getHours()
            .toString()
            .padStart(2, "0");


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "hour-card";


        card.innerHTML = `
            <span>${hour}:00</span>

            <div class="icon">
                ${info[1]}
            </div>

            <strong>
                ${convertTemperature(
                    weather.hourly.temperature_2m[i],
                    unit
                )}°
            </strong>
        `;


        elements.hourly.appendChild(
            card
        );

    }

}


// ==========================================
// DIAS
// ==========================================

function renderDaily(weather, unit) {

    elements.daily.innerHTML = "";


    for (
        let i = 0; i < Math.min(
            weather.daily.time.length,
            7
        ); i++
    ) {

        const info =
            getWeatherInfo(
                weather.daily.weather_code[i]
            );


        const date =
            new Date(
                weather.daily.time[i] +
                "T12:00:00"
            );


        const day =
            i === 0 ?
            "Hoje" :
            date.toLocaleDateString(
                "pt-BR", {
                    weekday: "short"
                }
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "day-card";


        card.innerHTML = `

            <div class="day-name">
                ${capitalize(day)}
            </div>

            <div class="day-weather">
                ${info[1]}
            </div>

            <div class="day-description">
                ${info[0]}
            </div>

            <div class="day-temperature">

                ${convertTemperature(
                    weather.daily.temperature_2m_max[i],
                    unit
                )}°
                /
                ${convertTemperature(
                    weather.daily.temperature_2m_min[i],
                    unit
                )}°

            </div>

        `;


        elements.daily.appendChild(
            card
        );

    }

}


// ==========================================
// ESTATÍSTICAS DOS GRÁFICOS
// ==========================================

function renderChartStats(weather, unit) {

    const current =
        weather.current;


    elements.chartHumidity.textContent =
        `${current.relative_humidity_2m}%`;


    elements.chartWind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    elements.chartMax.textContent =
        `${convertTemperature(
            weather.daily.temperature_2m_max[0],
            unit
        )}°`;


    elements.chartMin.textContent =
        `${convertTemperature(
            weather.daily.temperature_2m_min[0],
            unit
        )}°`;


    elements.sunrise.textContent =
        formatTime(
            weather.daily.sunrise[0]
        );


    elements.sunset.textContent =
        formatTime(
            weather.daily.sunset[0]
        );

}


// ==========================================
// HISTÓRICO
// ==========================================

function renderHistoryList(onClick) {

    const history =
        getHistory();


    elements.history.innerHTML = "";


    if (history.length === 0) {

        elements.history.innerHTML =
            `<p style="color: var(--muted); font-size: 13px;">
                Nenhuma pesquisa recente.
            </p>`;

        return;

    }


    history.forEach(city => {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "history-item";


        button.textContent =
            `📍 ${city}`;


        button.addEventListener(
            "click",
            () => onClick(city)
        );


        elements.history.appendChild(
            button
        );

    });

}


// ==========================================
// CONVERTER TEMPERATURA
// ==========================================

function convertTemperature(
    value,
    unit
) {

    if (unit === "celsius") {

        return Math.round(value);

    }


    return Math.round(
        value * 9 / 5 + 32
    );

}


// ==========================================
// FORMATAR HORA
// ==========================================

function formatTime(value) {

    if (!value) {
        return "--:--";
    }


    return new Date(value)
        .toLocaleTimeString(
            "pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


// ==========================================
// CAPITALIZAR
// ==========================================

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    elements.loading
        .classList
        .remove("hidden");


    elements.error
        .classList
        .add("hidden");


    elements.weatherContent
        .classList
        .add("hidden");

}


function hideLoading() {

    elements.loading
        .classList
        .add("hidden");

}


// ==========================================
// ERRO
// ==========================================

function showError(message) {

    elements.error
        .classList
        .remove("hidden");


    elements.errorMessage.textContent =
        message;

}


function hideError() {

    elements.error
        .classList
        .add("hidden");

}


// ==========================================
// FUNDO BASEADO NA TEMPERATURA
// ==========================================

function updateTemperatureBackground(
    temperature
) {

    const body =
        document.body;


    // Remove fundos anteriores
    body.classList.remove(
        "temp-freezing",
        "temp-cold",
        "temp-mild",
        "temp-warm",
        "temp-hot",
        "temp-very-hot",
        "temp-extreme"
    );


    if (temperature < 5) {

        body.classList.add(
            "temp-freezing"
        );

    } else if (temperature < 15) {

        body.classList.add(
            "temp-cold"
        );

    } else if (temperature < 21) {

        body.classList.add(
            "temp-mild"
        );

    } else if (temperature < 28) {

        body.classList.add(
            "temp-warm"
        );

    } else if (temperature < 35) {

        body.classList.add(
            "temp-hot"
        );

    } else if (temperature < 40) {

        body.classList.add(
            "temp-very-hot"
        );

    } else {

        body.classList.add(
            "temp-extreme"
        );

    }

}


// ==========================================
// CRIAR EFEITO DE CHUVA
// ==========================================

function createRainEffect() {

    const rain =
        document.getElementById(
            "rainEffect"
        );


    if (!rain) {
        return;
    }


    rain.innerHTML = "";


    const drops = 80;


    for (
        let i = 0; i < drops; i++
    ) {

        const drop =
            document.createElement(
                "span"
            );


        drop.className =
            "rain-drop";


        drop.style.left =
            `${Math.random() * 100}%`;


        drop.style.animationDuration =
            `${0.5 + Math.random() * 0.5}s`;


        drop.style.animationDelay =
            `${Math.random() * 2}s`;


        drop.style.opacity =
            `${0.2 + Math.random() * 0.5}`;


        drop.style.height =
            `${30 + Math.random() * 40}px`;


        rain.appendChild(
            drop
        );

    }

}


// ==========================================
// ATIVAR/DESATIVAR CHUVA
// ==========================================

function updateRainEffect(
    weatherCode
) {

    const rainCodes = [

        51,
        53,
        55,

        61,
        63,
        65,

        66,
        67,

        80,
        81,
        82,

        95,
        96,
        99

    ];


    const isRaining =
        rainCodes.includes(
            weatherCode
        );


    if (isRaining) {

        document.body.classList.add(
            "rain-active"
        );


        createRainEffect();

    } else {

        document.body.classList.remove(
            "rain-active"
        );

    }

}