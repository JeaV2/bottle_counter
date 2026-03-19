const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

if (terminalForm && terminalInput && terminalOutput) {
    terminalForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const command = terminalInput.value.trim().toLowerCase();

        if (!command) {
            return;
        }

        const commandLine = document.createElement("p");
        commandLine.textContent = `> ${command}`;
        terminalOutput.appendChild(commandLine);

        if (command === "leaderboard") {
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

        } else if (command === "help") {
            const helpText = [
                "Available commands:",
                "- leaderboard: Display the leaderboard",
                "- help: Show this help message",
                "- login: Start an authenticated session.",
                "- signup: Create a new account.",
                "- logout: End the current session.",
                "- count: Shows the total amount of bottles deposited by all users.",
                "- stats: Show personal bottle totals, streak, and rank.",
                "- predict: Allows users to predict how many bottles will be deposited the following day.",
                "- associate: Associates the user with the next deposit, so they can get credit for it.",
                "- disassociate: Disassociates the user from the next deposit, in case they accidentally pressed the associate button or changed their mind."
            ];

            helpText.forEach((line) => {
                const p = document.createElement("p");
                p.textContent = line;
                terminalOutput.appendChild(p);
            });

        } else if (command === "login") {
            const loginLine = document.createElement("p");
            loginLine.textContent = "Login functionality is not implemented yet.";
            terminalOutput.appendChild(loginLine);
        
        } else if (command === "signup") {
            const signupLine = document.createElement("p");
            signupLine.textContent = "Signup functionality is not implemented yet.";
            terminalOutput.appendChild(signupLine);
            
        } else if (command === "logout") {
            const logoutLine = document.createElement("p");
            logoutLine.textContent = "Logout functionality is not implemented yet.";
            terminalOutput.appendChild(logoutLine);    

        } else if (command === "count") {
            const countLine = document.createElement("p");
            countLine.textContent = "Total bottles deposited: 1050";
            terminalOutput.appendChild(countLine);
            
        } else if (command === "stats") {
            const statsLine = document.createElement("p");
            statsLine.textContent = "Your stats: 150 bottles, 5-day streak, Rank: 2nd";
            terminalOutput.appendChild(statsLine);

        } else if (command === "predict") {
            const predictLine = document.createElement("p");
            predictLine.textContent = "Predict functionality is not implemented yet.";
            terminalOutput.appendChild(predictLine);

        } else if (command === "associate") {
            const associateLine = document.createElement("p");
            associateLine.textContent = "Associate functionality is not implemented yet.";
            terminalOutput.appendChild(associateLine);
        
        } else if (command === "disassociate") {
            const disassociateLine = document.createElement("p");
            disassociateLine.textContent = "Disassociate functionality is not implemented yet.";
            terminalOutput.appendChild(disassociateLine);    

        } else {
            const unknownLine = document.createElement("p");
            unknownLine.textContent = "Unknown command";
            terminalOutput.appendChild(unknownLine);
        }

        terminalInput.value = "";
    });
}