import { associateNextDeposit, getCount } from "./api.js";

export function initTerminal({ openLoginModal, openSignupModal, logout, addTerminalLine }) {
    const terminalForm = document.getElementById("terminalForm");
    const terminalInput = document.getElementById("terminalInput");
    const terminalOutput = document.getElementById("terminalOutput");

    if (!terminalForm || !terminalInput || !terminalOutput) {
        return;
    }

    const initialTerminalLineCount = terminalOutput.childElementCount;

    const scrollOutputToBottom = () => {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const appendLine = (text) => {
        const line = document.createElement("p");
        line.textContent = text;
        terminalOutput.appendChild(line);
    };

    requestAnimationFrame(() => {
        requestAnimationFrame(scrollOutputToBottom);
    });

    terminalForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const command = terminalInput.value.trim().toLowerCase();
        if (!command) {
            return;
        }

        appendLine(`> ${command}`);

        switch (command) {
            case "leaderboard": {
                const leaderboard = [
                    "1st peter - 500 Bottles",
                    "2nd john - 300 Bottles",
                    "3rd mary - 200 Bottles",
                    "4th Alice - 100 Bottles",
                    "5th bob - 50 Bottles"
                ];
                leaderboard.forEach(appendLine);
                break;
            }
            case "help": {
                const helpText = [
                    "Available commands:",
                    "- leaderboard: Display the leaderboard",
                    "- help: Show this help message",
                    "- clear: Clear the terminal output",
                    "- login: Start an authenticated session.",
                    "- signup: Create a new account.",
                    "- logout: End the current session.",
                    "- count: Shows the total amount of bottles deposited by all users.",
                    "- stats: Show personal bottle totals, streak, and rank.",
                    "- predict: Allows users to predict how many bottles will be deposited the following day.",
                    "- associate: Associates the user with the next deposit, so they can get credit for it.",
                    "- disassociate: Disassociates the user from the next deposit, in case they accidentally pressed the associate button or changed their mind."
                ];
                helpText.forEach(appendLine);
                break;
            }
            case "clear": {
                while (terminalOutput.childElementCount > initialTerminalLineCount) {
                    terminalOutput.removeChild(terminalOutput.lastElementChild);
                }
                break;
            }
            case "signup": {
                openSignupModal();
                addTerminalLine("Opening signup popup...");
                break;
            }
            case "login": {
                openLoginModal();
                addTerminalLine("Opening login popup...");
                break;
            }
            case "logout": {
                logout();
                break;
            }
            case "associate":
            case "predict": {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    addTerminalLine("Please log in first.");
                    break;
                }

                try {
                    await associateNextDeposit(token);
                    addTerminalLine("Association request submitted.");
                } catch (error) {
                    addTerminalLine(`Associate failed: ${error.message}`);
                }
                break;
            }
            case "disassociate": {
                appendLine(`${command[0].toUpperCase() + command.slice(1)} functionality is not implemented yet.`);
                break;
            }
            case "count": {
                try {
                    const count = await getCount();
                    appendLine(`Total bottles deposited: ${count}`);
                } catch (error) {
                    appendLine(`Error fetching count: ${error.message}`);
                }
                break;
            }
            case "stats": {
                appendLine("Your stats: 150 bottles, 5-day streak, Rank: 2nd");
                break;
            }
            default: {
                appendLine("Unknown command");
            }
        }

        terminalInput.value = "";
        scrollOutputToBottom();
    });
}
