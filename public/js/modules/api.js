const BASE_URL = "https://102710.stu.sd-lab.nl/bottle_counter";

export async function getCount() {
    const response = await fetch(`${BASE_URL}/api/count/`);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const count = await response.json();
    return count[0].bottleCount;
}

export async function loginRequest(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ username, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Login failed: ${response.status}`);
    }

    return response.json();
}

export async function signupRequest(username, email, password) {
    const response = await fetch(`${BASE_URL}/auth/sign-up/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ username, email, password })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Signup failed: ${response.status}`);
    }

    return response.json();
}

export async function associateNextDeposit(token) {
    const response = await fetch(`${BASE_URL}/api/associate/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        },
        body: JSON.stringify({ token })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Associate failed: ${response.status}`);
    }
}
