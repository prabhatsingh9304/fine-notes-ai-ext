import React, { useState, useEffect } from "react";
import takeScreenshot from "./TakeScreenShot";
import getTranscript from "./GetTranscript";
import insertEditButton from "./HandleControls";
import "./Popup.scss";
import SignUp from "./SignUp";
function Popup() {
  const [copyStatus, setCopyStatus] = useState("");
  const [buttonStatus, setButtonStatus] = useState("");

  useEffect(() => {
    // Check if we're on a YouTube page
    chrome.tabs.query(
      { active: true, url: "https://www.youtube.com/watch*" },
      (tabs) => {
        if (tabs.length > 0) {
          setButtonStatus(
            "Notes button is automatically inserted on YouTube videos"
          );
        } else {
          setButtonStatus("Not a YouTube video page");
        }
      }
    );
  }, []);

  const handleGetAndCopyTranscript = async () => {
    try {
      const result = await getTranscript();

      if (!result || !result.segments) {
        setCopyStatus("Failed to get transcript");
        setTimeout(() => setCopyStatus(""), 2000);
        return;
      }

      // Format transcript with timestamps
      const textToCopy = result.segments
        .map((segment) => `[${segment.timestamp}] ${segment.text}`)
        .join("\n");

      // Copy to clipboard
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopyStatus("Copied to clipboard!");
          setTimeout(() => setCopyStatus(""), 2000);
        })
        .catch((err) => {
          setCopyStatus("Failed to copy");
          console.error("Copy failed: ", err);
        });
    } catch (error) {
      setCopyStatus("Error getting transcript");
      console.error("Error:", error);
    }
  };

  return (
    <div className="popup-container">
      <h2 className="popup-title">FineNotes.AI - YouTube Notes</h2>

      <div className="button-group">
        {/* <button onClick={takeScreenshot} className="action-button">
          📷 Take Screenshot
        </button>
        <button onClick={handleGetAndCopyTranscript} className="action-button">
          📝 Get Transcript
        </button> */}

        <SignUp />
      </div>

      {copyStatus && <div className="status-message">{copyStatus}</div>}
      {buttonStatus && <div className="status-message">{buttonStatus}</div>}
    </div>
  );
}

export default Popup;
