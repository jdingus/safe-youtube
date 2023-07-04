
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'e') {
        const adminForm = document.getElementById('admin-form');
        adminForm.classList.toggle('d-none');
    }
});

document.getElementById("add-channel").addEventListener("click", function () {
    const channelName = document.getElementById("admin-channel-name").value;
    const channelId = document.getElementById("admin-channel-id").value;
    if (channelName.trim() !== "" && channelId.trim() !== "") {
        const channelSelect = document.getElementById("channel-input");
        const option = document.createElement("option");
        option.text = channelName;
        option.value = channelId;
        channelSelect.add(option);
        localStorage.setItem('channels', channelSelect.innerHTML);
    }
});

document.getElementById("remove-channel").addEventListener("click", function () {
    const channelName = document.getElementById("admin-channel-name").value;
    const channelSelect = document.getElementById("channel-input");
    for (let i = 0; i < channelSelect.length; i++) {
        if (channelSelect.options[i].text === channelName) {
            channelSelect.remove(i);
            localStorage.setItem('channels', channelSelect.innerHTML);
            break;
        }
    }
});

document.getElementById("channel-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const channelSelect = document.getElementById("channel-input");
    const selectedChannel = channelSelect.value;
    if (localStorage.getItem('channels')) {
        channelSelect.innerHTML = localStorage.getItem('channels');
    }
    channelSelect.value = selectedChannel;
    const channelId = selectedChannel;
    const searchQuery = document.getElementById("search-input").value;
    const maxResults = document.getElementById("max-results").value;
    if (channelId.trim() !== "") {
        getChannelVideos(channelId, searchQuery, maxResults);
    } else {
        showError("Please enter a valid YouTube channel ID.");
    }
});

function getChannelVideos(channelId, searchQuery, maxResults) {
    const baseUrl = "https://safe-youtube-gules.vercel.app";
    const url = `${baseUrl}/api/youtube-api?channelId=${channelId}&maxResults=${maxResults}${searchQuery ? `&searchQuery=${encodeURIComponent(searchQuery)}` : ''}`;

    fetch(url)
        .then(response => {
            if (response.status === 403) {
                throw new Error("API key quota exceeded or invalid. Please check your YouTube API key.");
            }
            return response.json();
        })
    .then(data => {
        if (data.pageInfo && data.pageInfo.totalResults === 0) {
            showError("No videos found for the provided channel ID and search criteria.");
        } else {
            displayVideos(data.items);
        }
    })
        .catch(error => showError(error.message));
}

function displayVideos(videos) {
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = ""; // Clear any previous videos

    if (Array.isArray(videos)) {
        videos.forEach(video => {
            // existing code...
        });
    } else {
        showError("No videos found for the provided channel ID and search criteria.");
    }
}
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
