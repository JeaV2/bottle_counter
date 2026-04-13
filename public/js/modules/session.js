const capitalizeFirstLetter = (value) => value.charAt(0).toUpperCase() + value.slice(1);

export function updateSessionStatus() {
    const sessionStatusElement = document.getElementById("sessionStatus");
    if (!sessionStatusElement) {
        return;
    }

    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    if (token && username) {
        sessionStatusElement.textContent = capitalizeFirstLetter(username);
    } else {
        sessionStatusElement.textContent = "Guest";
    }
}

export function updateSessionStatusBar() {
    const sessionStatusBarElement = document.getElementById("sessionStatusBar");
    if (!sessionStatusBarElement) {
        return;
    }

    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    if (token && username) {
        sessionStatusBarElement.textContent = username;
    } else {
        sessionStatusBarElement.textContent = "user";
    }
}

export function refreshSessionUI() {
    updateSessionStatus();
    updateSessionStatusBar();
}
