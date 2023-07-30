
document.getElementById("channel-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const channelId = document.getElementById("channel-input").value;
    const searchQuery = document.getElementById("search-input").value;
    const maxResults = document.getElementById("max-results").value;
    if (channelId.trim() !== "") {
        getChannelVideos(channelId, searchQuery, maxResults);
    } else {
        showError("Please enter a valid YouTube channel ID.");
    }
});

function getChannelVideos(channelId, searchQuery, maxResults) {
    // const apiKey = YOUTUBE_API_KEY;
    // const apiKey = "AIzaSyB6O9dWqWBPXHXFtJJQGqL-LgOThMz81JM"; // Replace with your YouTube API key
    // if (apiKey === "YOUR_API_KEY" || apiKey.trim() === "") {
    //     showError("Please replace 'YOUR_API_KEY' in the app.js file with a valid YouTube API key.");
    //     return;
    // }

    const url = `/api/youtube-api?channelId=${channelId}&maxResults=${maxResults}${searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''}`;

    // const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;

    fetch(url)
        .then(response => {
            // Update debug info
            updateDebugInfo({ channelId, searchQuery, maxResults, url, responseStatus: response.status });
            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                if (response.status === 404) {
                    errorMsg = "The provided YouTube channel ID could not be found. Please check and try again.";
                }
                throw new Error(errorMsg);
            }
            return response.json();
        })
        .then(data => {
            // Update debug info
            updateDebugInfo({ data });
            if (data.pageInfo.totalResults === 0) {
                showError("No videos found for the provided channel ID and search criteria.");
            } else {
                displayVideos(data.items);
            }
        })
        .catch(error => {
            // Update debug info
            updateDebugInfo({ error: error.message });
            showError(error.message);
        });
}


function displayVideos(videos) {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = ""; // Clear any previous videos

    videos.forEach(video => {
        const videoId = video.id.videoId;

        const videoWrapper = document.createElement("div");
        videoWrapper.classList.add("video-wrapper", "col-md-6", "mb-4");

        const videoResponsive = document.createElement("div");
        videoResponsive.classList.add("video-responsive");

        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0`;
        iframe.setAttribute("allowfullscreen", "");

        // Add sandbox attribute to the iframe to restrict its capabilities
        iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");

        videoResponsive.appendChild(iframe);
        videoWrapper.appendChild(videoResponsive);
        videoContainer.appendChild(videoWrapper);
    });
}




function showError(errorMessage) {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
}

function updateDebugInfo(info) {
    const debugInfoElement = document.getElementById("debug-info");
    const existingInfo = JSON.parse(debugInfoElement.textContent || "{}");
    const updatedInfo = { ...existingInfo, ...info };
    if (info.url) {
        const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?key=${info.apiKey}&channelId=${info.channelId}&part=snippet,id&order=date&maxResults=${info.maxResults}${info.searchQuery ? `&q=${encodeURIComponent(info.searchQuery)}` : ''}`;
        updatedInfo.curlCommand = `curl "${youtubeApiUrl}"`;
    }
    debugInfoElement.textContent = JSON.stringify(updatedInfo, null, 2);
}
