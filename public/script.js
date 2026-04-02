const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

if (terminalForm && terminalInput && terminalOutput) {
    const initialTerminalLineCount = terminalOutput.childElementCount;

    const scrollOutputToBottom = () => {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    requestAnimationFrame(() => {
        requestAnimationFrame(scrollOutputToBottom);
    });

    terminalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const command = terminalInput.value.trim().toLowerCase();

        if (!command) {
            return;
        }

        const commandLine = document.createElement("p");
        commandLine.textContent = `> ${command}`;
        terminalOutput.appendChild(commandLine);

        switch (command) {
            case "leaderboard": {
                const leaderboard = [
                    "1st peter - 500 Bottles",
                    "2nd john - 300 Bottles",
                    "3rd mary - 200 Bottles",
                    "4th Alice - 100 Bottles",
                    "5th bob - 50 Bottles"
                ];
                leaderboard.forEach((entry) => {
                    const line = document.createElement("p");
                    line.textContent = entry;
                    terminalOutput.appendChild(line);
                });
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
                helpText.forEach((text) => {
                    const p = document.createElement("p");
                    p.textContent = text;
                    terminalOutput.appendChild(p);
                });
                break;
            }
            case "clear": {
                while (terminalOutput.childElementCount > initialTerminalLineCount) {
                    terminalOutput.removeChild(terminalOutput.lastElementChild);
                }
                break;
            }
            case "login":
            case "signup":
            case "logout":
            case "predict":
            case "associate":
            case "disassociate": {
                const line = document.createElement("p");
                line.textContent = `${command[0].toUpperCase() + command.slice(1)} functionality is not implemented yet.`;
                terminalOutput.appendChild(line);
                break;
            }

            case "count": {
                getCount().then((count) => {
                    const line = document.createElement("p");
                    line.textContent = `Total bottles deposited: ${count}`;
                    terminalOutput.appendChild(line);
                    scrollOutputToBottom();
                }).catch((error) => {
                    const line = document.createElement("p");
                    line.textContent = `Error fetching count: ${error.message}`;
                    terminalOutput.appendChild(line);
                    scrollOutputToBottom();
                });

                break;
            }

            case "stats": {
                const line = document.createElement("p");
                line.textContent = "Your stats: 150 bottles, 5-day streak, Rank: 2nd";
                terminalOutput.appendChild(line);
                break;
            }

            default: {
                const line = document.createElement("p");
                line.textContent = "Unknown command";
                terminalOutput.appendChild(line);
            }
        }

        terminalInput.value = "";
        scrollOutputToBottom();
    });
}

async function getCount(params) {
    const response = await fetch("https://102710.stu.sd-lab.nl/bottle_counter/api/count/");
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const count = await response.json();
    console.log("Count response:", count);
    return count[0].bottleCount;
}