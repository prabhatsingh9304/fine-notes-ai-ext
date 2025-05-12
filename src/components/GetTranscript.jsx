const getTranscript = async () => {
  try {
    const tabs = await chrome.tabs.query({
      active: true,
      url: "https://www.youtube.com/watch*",
    });

    if (tabs.length === 0) {
      console.error("No active YouTube tab found");
      return null;
    }

    const tab = tabs[0];

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return new Promise((resolve) => {
          // Function to extract transcript data from YouTube's page
          const extractTranscript = () => {
            // Check if transcript button exists and click it if not already open
            const transcriptButton = document.querySelector(
              'button[aria-label*="transcript" i]'
            );
            if (!transcriptButton) {
              return null; // Transcript button not found
            }

            // If the transcript panel isn't already open, click the button to open it
            const transcriptPanel = document.querySelector(
              "ytd-transcript-renderer"
            );
            if (!transcriptPanel) {
              transcriptButton.click();
              // Give some time for the transcript to load
              setTimeout(extractTranscript, 1000);
              return;
            }

            // Extract the transcript segments
            const segments = Array.from(
              document.querySelectorAll("ytd-transcript-segment-renderer")
            );

            if (!segments || segments.length === 0) {
              resolve(null);
              return;
            }

            const transcript = segments
              .map((segment) => {
                const timeElement = segment.querySelector(
                  "div.segment-timestamp"
                );
                const textElement = segment.querySelector(
                  "yt-formatted-string.segment-text"
                );

                if (!timeElement || !textElement) return null;

                return {
                  timestamp: timeElement.textContent.trim(),
                  text: textElement.textContent.trim(),
                };
              })
              .filter(Boolean);

            // Get full transcript text
            const fullText = transcript
              .map((segment) => segment.text)
              .join(" ");

            // Get video title as well
            const videoTitle =
              document.querySelector("h1.title yt-formatted-string")
                ?.textContent || "";

            resolve({
              title: videoTitle,
              segments: transcript,
              fullText,
            });
          };

          extractTranscript();
        });
      },
    });

    if (!result || !result[0] || !result[0].result) {
      console.error("No transcript found or error getting transcript");
      return null;
    }

    return result[0].result;
  } catch (error) {
    console.error("Error getting transcript:", error);
    return null;
  }
};

export default getTranscript;
