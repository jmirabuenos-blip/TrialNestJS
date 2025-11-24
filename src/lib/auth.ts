declare const window: Window & typeof globalThis;

export const TOKEN_KEY = "accessToken";

export function saveToken(token: string) {
    if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, token);
    }
}

export function getToken(): string | null {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(TOKEN_KEY);
    }
    return null;
}

export function logoutUser() {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_KEY);
    }
}
