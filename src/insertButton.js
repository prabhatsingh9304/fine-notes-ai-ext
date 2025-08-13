if (document.getElementById("edit-btn")) {
  console.log("Notes button already exists");
} else {
  console.log("Inserting notes button");

  const button = document.createElement("button");
  button.id = "edit-btn";
  button.className = "ytp-button ytp-screenshot";
  button.title = "Take Note";
  button.innerHTML = `
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
      </svg>
    </div>
    <span class="note-button-span">Take Note</span>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #edit-btn {
      display: flex;
      align-items: center;
      margin-top: 8px;
      margin-bottom: 8px;
      background-color: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      border-radius: 3px;
      padding: 5px 10px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    #edit-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .note-button-span {
      margin-left: 5px;
    }
  `;
  document.head.appendChild(style);

  const insertButtonToDOM = () => {
    const titleElement = document.querySelector("h1.ytd-watch-metadata");

    if (titleElement) {
      titleElement.parentNode.insertBefore(button, titleElement.nextSibling);
      setupVideoListeners();
      return true;
    }
    return false;
  };

  const setupVideoListeners = () => {
    const video = document.querySelector("video");
    if (video) {
      let isNoteTakingActive = false;
      let pauseListener = null;

      const handleVideoPause = () => {
        if (isNoteTakingActive) {
          console.log("Video paused during note-taking");
          chrome.runtime.sendMessage({
            action: "videoPaused",
            timestamp: video.currentTime,
            title: document.title,
            isNoteTakingActive: true,
          });
        }
      };

      button.addEventListener("click", () => {
        isNoteTakingActive = !isNoteTakingActive;

        if (isNoteTakingActive) {
          button.title = "Taking notes in progress...";
          button.querySelector(".note-button-span").textContent =
            "Taking notes in progress...";

          if (!pauseListener) {
            pauseListener = handleVideoPause;
            video.addEventListener("pause", pauseListener);
          }
        } else {
          button.title = "Take Note";
          button.querySelector(".note-button-span").textContent = "Take Note";

          if (pauseListener) {
            video.removeEventListener("pause", pauseListener);
            pauseListener = null;
          }
        }

        console.log(
          "Note-taking mode:",
          isNoteTakingActive ? "enabled" : "disabled"
        );
      });
    } else {
      console.error("Video element not found");
    }
  };

  if (!insertButtonToDOM()) {
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts++;
      if (insertButtonToDOM() || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts) {
          console.error("Failed to insert button after multiple attempts");
        }
      }
    }, 1000);
  }
}
