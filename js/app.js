// ==========================================
// ESTADO
// ==========================================

let currentWeather = null;

let currentLocation = null;

let currentUnit = "celsius";


// ==========================================
// ELEMENTOS
// ==========================================

const cityInput =
    document.getElementById(
        "cityInput"
    );


const searchForm =
    document.getElementById(
        "searchForm"
    );


const locationButton =
    document.getElementById(
        "locationButton"
    );


const themeButton =
    document.getElementById(
        "themeButton"
    );


const unitButton =
    document.getElementById(
        "unitButton"
    );


const favoriteButton =
    document.getElementById(
        "favoriteButton"
    );


const clearHistory =
    document.getElementById(
        "clearHistory"
    );


// ==========================================
// PESQUISAR
// ==========================================

async function searchWeather(city) {

    try {

        showLoading();

        hideError();


        const location =
            await searchCity(city);


        const weather =
            await getWeather(
                location.latitude,
                location.longitude
            );


        currentLocation =
            location;


        currentWeather =
            weather;


        renderWeather(
            location,
            weather,
            currentUnit
        );


        saveHistory(
            location.name
        );


        renderHistoryList(
            searchWeather
        );


        updateFavoriteButton();


        // Atualiza o gráfico
        renderTemperatureChart(
            weather
        );


    } catch (error) {

        showError(
            error.message ||
            "Não foi possível buscar os dados."
        );

    } finally {

        hideLoading();

    }

}


// ==========================================
// FORMULÁRIO
// ==========================================

searchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const city =
            cityInput.value.trim();


        if (!city) {

            showError(
                "Digite uma cidade."
            );

            return;

        }


        searchWeather(city);

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
                "Seu navegador não suporta geolocalização."
            );

            return;

        }


        showLoading();


        navigator.geolocation.getCurrentPosition(

            async position => {

                try {

                    const {
                        latitude,
                        longitude
                    } = position.coords;


                    const location =
                        await getLocationName(
                            latitude,
                            longitude
                        );


                    const weather =
                        await getWeather(
                            latitude,
                            longitude
                        );


                    currentLocation =
                        location;


                    currentWeather =
                        weather;


                    renderWeather(
                        location,
                        weather,
                        currentUnit
                    );


                    saveHistory(
                        location.name
                    );


                    renderHistoryList(
                        searchWeather
                    );


                    updateFavoriteButton();


                    renderTemperatureChart(
                        weather
                    );


                } catch {

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
                    "Permita o acesso à localização."
                );

            }

        );

    }
);


// ==========================================
// FAVORITO
// ==========================================

favoriteButton.addEventListener(
    "click",
    () => {

        if (!currentLocation) return;


        toggleFavorite(
            currentLocation.name
        );


        updateFavoriteButton();

    }
);


function updateFavoriteButton() {

    if (!currentLocation) return;


    const favorites =
        getFavorites();


    const isFavorite =
        favorites.includes(
            currentLocation.name
        );


    favoriteButton.textContent =
        isFavorite ?
        "★" :
        "☆";

}


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


        if (
            currentLocation &&
            currentWeather
        ) {

            renderWeather(
                currentLocation,
                currentWeather,
                currentUnit
            );

        }

    }
);


// ==========================================
// TEMA
// ==========================================

themeButton.addEventListener(
    "click",
    () => {

        const isDark =
            document.body
            .classList
            .toggle("dark");


        themeButton.textContent =
            isDark ?
            "☀️" :
            "🌙";


        saveTheme(isDark);


        if (currentWeather) {

            setTimeout(
                () => {

                    renderTemperatureChart(
                        currentWeather
                    );

                },
                50
            );

        }

    }
);


// ==========================================
// TABS
// ==========================================

const tabs =
    document.querySelectorAll(
        ".tab"
    );


const tabContents =
    document.querySelectorAll(
        ".tab-content"
    );


tabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            const target =
                tab.dataset.tab;


            tabs.forEach(item =>
                item.classList.remove(
                    "active"
                )
            );


            tabContents.forEach(
                content =>
                content.classList.remove(
                    "active"
                )
            );


            tab.classList.add(
                "active"
            );


            document
                .getElementById(target)
                .classList.add("active");


            if (
                target === "charts" &&
                currentWeather
            ) {

                setTimeout(
                    () => {

                        renderTemperatureChart(
                            currentWeather
                        );

                    },
                    50
                );

            }

        }
    );

});


// ==========================================
// HISTÓRICO
// ==========================================

clearHistory.addEventListener(
    "click",
    () => {

        clearHistoryStorage();

        renderHistoryList(
            searchWeather
        );

    }
);


// ==========================================
// CONFIGURAÇÕES
// ==========================================

function loadSettings() {

    if (getTheme()) {

        document.body.classList.add(
            "dark"
        );

        themeButton.textContent =
            "☀️";

    }


    renderHistoryList(
        searchWeather
    );

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

loadSettings();


// Cidade inicial
searchWeather("São Paulo");