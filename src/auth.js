export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const ACCESS_TOKEN = () => {
    return localStorage.getItem('access_token');
};

export const REFRESH_TOKEN = () => {
    return localStorage.getItem('refresh_token');
};