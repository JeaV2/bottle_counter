import { initAuth } from "./modules/auth.js";
import { initTerminal } from "./modules/terminal.js";
import { refreshSessionUI } from "./modules/session.js";

const terminalOutput = document.getElementById("terminalOutput");

const addTerminalLine = (text) => {
    if (!terminalOutput) {
        return;
    }

    const line = document.createElement("p");
    line.textContent = text;
    terminalOutput.appendChild(line);
};

refreshSessionUI();

const auth = initAuth({
    addTerminalLine,
    onSessionChanged: refreshSessionUI
});

initTerminal({
    openLoginModal: auth.openLoginModal,
    openSignupModal: auth.openSignupModal,
    logout: auth.logout,
    addTerminalLine
});

if (localStorage.getItem("authToken")) {
    addTerminalLine("Existing session detected. You are already logged in.");
}