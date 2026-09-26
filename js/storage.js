// ==========================================
// HISTÓRICO
// ==========================================

function getHistory() {

    return JSON.parse(
        localStorage.getItem("weatherHistory")
    ) || [];

}


function saveHistory(city) {

    let history = getHistory();

    history = history.filter(
        item =>
        item.toLowerCase() !==
        city.toLowerCase()
    );

    history.unshift(city);

    history = history.slice(0, 6);

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(history)
    );

}


function clearHistoryStorage() {

    localStorage.removeItem(
        "weatherHistory"
    );

}


// ==========================================
// FAVORITOS
// ==========================================

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("weatherFavorites")
    ) || [];

}


function toggleFavorite(city) {

    let favorites = getFavorites();

    const exists =
        favorites.includes(city);

    if (exists) {

        favorites =
            favorites.filter(
                item => item !== city
            );

    } else {

        favorites.push(city);

    }

    localStorage.setItem(
        "weatherFavorites",
        JSON.stringify(favorites)
    );

    return !exists;
}


// ==========================================
// TEMA
// ==========================================

function saveTheme(dark) {

    localStorage.setItem(
        "darkMode",
        dark
    );

}


function getTheme() {

    return (
        localStorage.getItem("darkMode") ===
        "true"
    );

}