const insertEditButton = () => {
  try {
    // Execute script in the active YouTube tab
    chrome.tabs.query(
      { active: true, url: "https://www.youtube.com/watch*" },
      (tabs) => {
        if (tabs.length === 0) {
          console.error("No active YouTube tab found");
          return;
        }

        const tab = tabs[0];

        // Use the same insertButton.js script for consistency
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            files: ["insertButton.js"],
          })
          .catch((err) => console.error("Error inserting button:", err));
      }
    );
  } catch (error) {
    console.error("Error inserting edit button:", error);
  }
};

export default insertEditButton;
