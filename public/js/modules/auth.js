import { loginRequest, signupRequest } from "./api.js";

export function initAuth({ addTerminalLine, onSessionChanged }) {
    const loginModal = document.getElementById("loginModal");
    const loginForm = document.getElementById("loginForm");
    const loginCancel = document.getElementById("loginCancel");
    const loginUsername = document.getElementById("loginUsername");

    const signupModal = document.getElementById("signupModal");
    const signupForm = document.getElementById("signupForm");
    const signupCancel = document.getElementById("signupCancel");
    const signupUsername = document.getElementById("signupUsername");

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

    const persistSession = ({ token, username, user_id: userId }) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", username);
        localStorage.setItem("user_id", userId);
        onSessionChanged();
    };

    const clearSession = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        localStorage.removeItem("user_id");
        onSessionChanged();
    };

    if (signupForm) {
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = signupForm.username.value.trim() || "user";
            const email = signupForm.email.value.trim() || "user@example.com";
            const password = signupForm.password.value.trim() || "password";

            addTerminalLine(`Signup requested for: ${username}`);

            try {
                const data = await signupRequest(username, email, password);
                persistSession(data);
                setSignupModalVisible(false);
                addTerminalLine(`Signup successful! You can now log in with your new account, ${username}.`);
            } catch (error) {
                addTerminalLine(`Signup failed: ${error.message}`);
            }
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

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = loginForm.username.value.trim() || "user";
            const password = loginForm.password.value.trim() || "password";

            addTerminalLine(`Login requested for: ${username}`);

            try {
                const data = await loginRequest(username, password);
                persistSession(data);
                setLoginModalVisible(false);
                addTerminalLine(`Login successful! Welcome, ${username}.`);
            } catch (error) {
                addTerminalLine(`Login failed: ${error.message}`);
            }
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

    return {
        openLoginModal: () => setLoginModalVisible(true),
        openSignupModal: () => setSignupModalVisible(true),
        logout: () => {
            clearSession();
            addTerminalLine("Logged out successfully.");
        }
    };
}
