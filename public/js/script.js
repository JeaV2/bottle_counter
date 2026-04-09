const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginCancel = document.getElementById("loginCancel");
const loginUsername = document.getElementById("loginUsername");
const signupModal = document.getElementById("signupModal");
const signupForm = document.getElementById("signupForm");
const signupCancel = document.getElementById("signupCancel");
const signupUsername = document.getElementById("signupUsername");

const addTerminalLine = (text) => {
    if (!terminalOutput) {
        return;
    }

    const line = document.createElement("p");
    line.textContent = text;
    terminalOutput.appendChild(line);
};

if (localStorage.getItem("authToken")) {
    addTerminalLine("Existing session detected. You are already logged in.");
    let token = localStorage.getItem("authToken");
}

const setSignupModalVisible = (isVisible) => {
    if (!signupModal) {
        return;
    }

    signupModal.setAttribute("aria-hidden", String(!isVisible));

    if (isVisible) {
        requestAnimationFrame(() => {
            if (signupUsername instanceof HTMLInputElement) {
                signupUsername.focus();
            }
        });
    }
};

const isSignupModalVisible = () => signupModal?.getAttribute("aria-hidden") === "false";

if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = signupForm.username.value.trim();
        addTerminalLine(`Signup requested for: ${username}`);
        setSignupModalVisible(false);
    });
}
if (signupCancel) {
    signupCancel.addEventListener("click", () => {
        setSignupModalVisible(false);
    });
}

if (signupModal) {
    signupModal.addEventListener("click", (event) => {
        if (event.target === signupModal) {
            setSignupModalVisible(false);
        }
    });
}

const setLoginModalVisible = (isVisible) => {
    if (!loginModal) {
        return;
    }

    loginModal.setAttribute("aria-hidden", String(!isVisible));

    if (isVisible) {
        requestAnimationFrame(() => {
            if (loginUsername instanceof HTMLInputElement) {
                loginUsername.focus();
            }
        });
    }
};

const isLoginModalVisible = () => loginModal?.getAttribute("aria-hidden") === "false";

if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = loginForm.username.value.trim();
        addTerminalLine(`Login requested for: ${username}`);
        setLoginModalVisible(false);
    });
}

if (loginCancel) {
    loginCancel.addEventListener("click", () => {
        setLoginModalVisible(false);
    });
}

if (loginModal) {
    loginModal.addEventListener("click", (event) => {
        if (event.target === loginModal) {
            setLoginModalVisible(false);
        }
    });
}

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
            case "signup": {
                setSignupModalVisible(true);
                addTerminalLine("Opening signup popup...");
                break;
            }

            case "logout":
            case "predict":
            case "associate":
            case "disassociate": {
                const line = document.createElement("p");
                line.textContent = `${command[0].toUpperCase() + command.slice(1)} functionality is not implemented yet.`;
                terminalOutput.appendChild(line);
                break;
            }

            case "login": {
                setLoginModalVisible(true);
                addTerminalLine("Opening login popup...");
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

async function login() {
    event.preventDefault();

    const username = loginForm.username.value.trim() || "user";
    addTerminalLine(`Login requested for: ${username}`);
    setLoginModalVisible(false);
    const password = loginForm.password.value.trim() || "password";

    try {
        const response = await fetch("https://102710.stu.sd-lab.nl/bottle_counter/auth/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username: username,
                password: password
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            addTerminalLine(`Login failed: ${errorData.error}`);
            throw new Error(`Login failed: ${response.status}`);
        }
        const data = await response.json();
        token = data.token;
        usernameData = data.username;
        user_id = data.user_id;
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", usernameData);
        localStorage.setItem("user_id", user_id);
        addTerminalLine(`Login successful! Welcome, ${username}.`);
    } catch (error) {
        console.error("Login error:", error);
    }
}

async function signup() {
    event.preventDefault();

    const username = signupForm.username.value.trim() || "user";
    addTerminalLine(`Signup requested for: ${username}`);
    setSignupModalVisible(false);
    const email = signupForm.email.value.trim() || "user@example.com";
    const password = signupForm.password.value.trim() || "password";

    try {
        const response = await fetch("https://102710.stu.sd-lab.nl/bottle_counter/auth/sign-up.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username: username,
                email: email,
                password: password
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            addTerminalLine(`Signup failed: ${errorData.error}`);
            throw new Error(`Signup failed: ${response.status}`);
        }
        const data = await response.json();
        token = data.token;
        usernameData = data.username;
        user_id = data.user_id;
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", usernameData);
        localStorage.setItem("user_id", user_id);
        addTerminalLine(`Signup successful! You can now log in with your new account, ${username}.`);
    } catch (error) {
        console.error("Signup error:", error);
    }
}