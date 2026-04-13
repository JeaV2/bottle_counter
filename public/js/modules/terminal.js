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
                    "- associate: Associates the user with the next deposit, so they can get credit for it.",
                    "- disassociate: Disassociates the user from the next deposit, in case they accidentally pressed the associate button or changed their mind."
                ];
                helpText.forEach(appendLine);
                break;
            }
            case "leaderboard": {
                try {
                    const leaderboard = await leaderboardRequest();
                    appendLine("Leaderboard:");
                    let index = 0;
                    leaderboard.forEach(() => {
                        appendLine(`${leaderboard[index].username}: ${leaderboard[index].bottles} bottles`);
                        index++;
                    });
                } catch (error) {
                    appendLine(`Error fetching leaderboard: ${error.message}`);
                }
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
            case "associate": {
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
                const token = localStorage.getItem("authToken");
                if (!token) {
                    addTerminalLine("Please log in first.");
                    break;
                }

                try {
                    await disassociateNextDeposit(token);
                    addTerminalLine("Disassociation request submitted.");
                } catch (error) {
                    addTerminalLine(`Disassociate failed: ${error.message}`);
                }
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
                const token = localStorage.getItem("authToken");
                if (!token) {
                    addTerminalLine("Please log in first.");
                    break;
                }
            
                try {
                    const stats = await statsRequest(token);
                    appendLine(`Your stats:`);
                    appendLine(`- Total bottles deposited: ${stats.bottles}`);
                    appendLine(`- Streak counting will be added in a future update!`);
                    appendLine(`- Ranks will be added in a future update!`);
                } catch (error) {
                    appendLine(`Error fetching stats: ${error.message}`);
                }
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
