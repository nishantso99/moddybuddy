document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "AIzaSyD8yYd5Rn9nvD9oa6ga3xiPX-6r4LZOTmM"; // 🔴  API key

  const moods = ["happy", "sad", "angry", "stressed", "excited", "lonely"];

  moods.forEach((mood) => {
    const section = document.getElementById(mood);
    if (!section) return;

    const buttons = section.querySelectorAll("button");

    buttons[0].addEventListener("click", () => {
      fetchYouTubeVideos(`${mood} mood music`, `🎵 ${mood} Music`);
    });

    buttons[1].addEventListener("click", () => {
      fetchYouTubeVideos(`${mood} mood video`, `📺 ${mood} Video`);
    });

    buttons[2].addEventListener("click", () => {
      const tips = getTips(mood);
      openModal("📖 Tips", `<p class="text-lg">${tips}</p>`, "html");
    });

    // Optional: Add a search button per mood
    const searchBtn = document.createElement("button");
    searchBtn.textContent = "🔍 Search";
    searchBtn.className = "ml-2 px-3 py-1 bg-blue-500 text-white rounded";
    section.appendChild(searchBtn);

    searchBtn.addEventListener("click", () => {
      const query = prompt("Enter a YouTube search term:");
      if (query) fetchYouTubeVideos(query, `🔍 Results for "${query}"`);
    });
  });

  function getTips(mood) {
    const tipsMap = {
      happy: "Share your joy with someone today!",
      sad: "Write down your feelings and talk to someone you trust.",
      angry: "Take deep breaths or go for a walk to cool down.",
      stressed: "Do a 5-minute guided meditation.",
      excited: "Channel your excitement into a creative project!",
      lonely: "Join a community group or call an old friend."
    };
    return tipsMap[mood] || "Be kind to yourself today!";
  }

  function fetchYouTubeVideos(query, title) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${API_KEY}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const videosHtml = data.items.map(item => {
          const videoId = item.id.videoId;
          const videoTitle = item.snippet.title;
          return `
            <div class="mb-4">
              <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
              <p class="text-sm mt-1">${videoTitle}</p>
            </div>`;
        }).join("");
        openModal(title, videosHtml, "html");
      })
      .catch(err => {
        console.error(err);
        openModal("Error", "<p>Could not fetch videos. Try again later.</p>", "html");
      });
  }

  function openModal(title, content, type) {
    let modal = document.getElementById("contentModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "contentModal";
      modal.className = "fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50";
      modal.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-xl text-black relative max-h-[90vh] overflow-y-auto">
          <button id="closeModal" class="absolute top-2 right-4 text-xl">✖</button>
          <h2 class="text-2xl font-bold mb-4" id="modalTitle"></h2>
          <div id="modalContent"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#closeModal").addEventListener("click", () => {
        modal.remove();
      });
    }

    modal.querySelector("#modalTitle").textContent = title;
    modal.querySelector("#modalContent").innerHTML = content;
  }
});
