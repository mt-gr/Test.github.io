// TODO: Figure out how to pass information between the previous js file and this or put all of it into one file
//       Figure out how to work the console and where the input actually goes for debugging

document.getElementById('search-button').addEventListener('click', searchSongs);
document.getElementById('create-playlist-button').addEventListener('click', createPlaylist);


async function searchSongs() {
    const query = document.getElementById('song-input').value;
    if (!query) return alert('Please enter a song or artist.');

    if (!accessToken) {
        authorizeSpotify();
        return;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        displayResults(data.tracks.items);
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

function displayResults(tracks) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (tracks.length === 0) {
        resultsDiv.textContent = 'No results found.';
        return;
    }

    const trackUris = [];
    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.textContent = `${track.name} by ${track.artists[0].name}`;
        resultsDiv.appendChild(trackElement);
        trackUris.push(track.uri);
    });

    document.getElementById('create-playlist-button').style.display = 'block';
    document.getElementById('create-playlist-button').trackUris = trackUris;
}

async function createPlaylist() {
    const trackUris = document.getElementById('create-playlist-button').trackUris;

    try {
        // Get user's ID
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const userData = await userResponse.json();
        const userId = userData.id;

        // Create a new playlist
        const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'My Custom Playlist',
                description: 'Playlist created from song search',
                public: true
            })
        });
        const playlistData = await playlistResponse.json();

        // Add songs to the playlist
        await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: trackUris
            })
        });

        alert('Playlist created successfully!');
    } catch (error) {
        console.error('Error creating playlist:', error);
    }
}
