const clientId = 'efe131fac3c74d3cac20ae0886b01ff9';
const redirectUri = 'https://carbonate1.github.io/Test.github.io/callback';
let accessToken = '';

document.getElementById('log-in-button').addEventListener('click', authorizeSpotify);


function authorizeSpotify() {
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const scope = 'playlist-modify-public';
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&show_dialog=true`;
}

function getAccessToken() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1).split('&').reduce((acc, item) => {
            const parts = item.split('=');
            acc[parts[0]] = decodeURIComponent(parts[1]);
            return acc;
        }, {});
        accessToken = hash.access_token;
        window.history.pushState('', document.title, window.location.pathname);
        sessionStorage.setItem('accessToken', accessToken);
    }
}

// Get access token from URL on page load
getAccessToken();
