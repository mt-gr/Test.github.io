// Set Event Listeners for Buttons
document.getElementById('play-button').addEventListener('click', () => {
    playSong();
});

document.getElementById('pause-button').addEventListener('click', () => {
    pauseSong();
});

document.getElementById('skip-button').addEventListener('click', () => {
    skipTrack();
});

document.getElementById('previous-button').addEventListener('click', () => {
    previousTrack();
});

// Adjust volume with the slider
document.getElementById('volume-control').addEventListener('input', (event) => {
    const volume = event.target.value / 100;  // Convert to 0-1 range
    setVolume(volume);
});

// Redirect back to the create playlist page
document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'createplaylist.html'; // Redirect back to create playlist page
});


// Declare the player and access token globally
let player;
let accessToken = '';

// Initialize Spotify Player
window.onSpotifyWebPlaybackSDKReady = () => {
    player = new Spotify.Player({
        name: 'Music Generator Player',
        getOAuthToken: cb => {
            cb(accessToken);  // Pass your access token here
        },
        volume: 0.5, // Set default volume
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => {
        console.log(state);
        if (!state) return;
    });

    // Connect to the player
    player.connect();
};

// Play Song Function
function playSong() {
    player.resume().then(() => {
        console.log("Playback started");
    }).catch(e => {
        console.error("Error starting playback", e);
    });
}

// Pause Song Function
function pauseSong() {
    player.pause().then(() => {
        console.log("Playback paused");
    }).catch(e => {
        console.error("Error pausing playback", e);
    });
}

// Skip Track Function
function skipTrack() {
    player.nextTrack().then(() => {
        console.log("Skipped to next track");
    }).catch(e => {
        console.error("Error skipping track", e);
    });
}

// Previous Track Function
function previousTrack() {
    player.previousTrack().then(() => {
        console.log("Skipped to previous track");
    }).catch(e => {
        console.error("Error skipping to previous track", e);
    });
}

// Set Volume Function (0 to 1 scale)
function setVolume(value) {
    player.setVolume(value).then(() => {
        console.log(`Volume set to ${value}`);
    }).catch(e => {
        console.error("Error setting volume", e);
    });
}

// Function to extract the access token from the URL hash
function getAccessTokenFromURL() {
    // Check if the URL contains a hash fragment
    if (window.location.hash) {
        // Extract the hash and parse it into an object
        const hash = window.location.hash.substring(1).split('&').reduce((acc, item) => {
            const parts = item.split('=');
            acc[parts[0]] = decodeURIComponent(parts[1]);
            return acc;
        }, {});

        // Get the access token from the parsed object
        if (hash.access_token) {
            accessToken = hash.access_token; // Set the global accessToken
        } else {
            console.error("No access token found in the URL."); // Delete me
        }

        // Clean up the URL to remove the hash
        window.history.pushState('', document.title, window.location.pathname);
    } else {
        console.error("No hash found in the URL.");
    }
}

// Run the function to get the access token when the page loads
getAccessTokenFromURL();
