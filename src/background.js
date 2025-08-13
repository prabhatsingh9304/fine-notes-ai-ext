chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "videoPaused") {
    console.log("Video paused at timestamp:", message.timestamp);
    console.log("Video title:", message.title);

    if (message.isNoteTakingActive) {
      chrome.scripting
        .executeScript({
          target: { tabId: sender.tab.id },
          files: ["takeScreenShot.js"],
        })
        .catch((err) => console.error("Error taking screenshot:", err));
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("FineNotes.AI extension installed or updated");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.match(/^https:\/\/www\.youtube\.com\/watch/)
  ) {
    chrome.scripting
      .executeScript({
        target: { tabId: tabId },
        files: ["insertButton.js"],
      })
      .catch((err) => console.error("Error inserting button:", err));
  }
});
