import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [authStatus, setAuthStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNotionAuth = async () => {
    try {
      setIsLoading(true);
      setAuthStatus("Opening Notion authentication...");

      const authUrl = "http://localhost:8000/notion/oauth/start";

      chrome.tabs.create({ url: authUrl }, (tab) => {
        const authTabId = tab.id;

        const listener = (tabId, changeInfo, updatedTab) => {
          if (tabId === authTabId && changeInfo.url) {
            if (changeInfo.url.includes("/notion/oauth/callback")) {
              setAuthStatus("Processing authentication...");

              const url = new URL(changeInfo.url);
              const code = url.searchParams.get("code");
              const state = url.searchParams.get("state");

              if (code) {
                handleAuthCallback(code, state);

                chrome.tabs.remove(authTabId);

                chrome.tabs.onUpdated.removeListener(listener);
              }
            }
          }
        };

        chrome.tabs.onUpdated.addListener(listener);

        setTimeout(() => {
          chrome.tabs.onUpdated.removeListener(listener);
          setIsLoading(false);
          setAuthStatus("");
        }, 300000);
      });
    } catch (error) {
      console.error("Error starting auth:", error);
      setAuthStatus("Error starting authentication");
      setIsLoading(false);
    }
  };

  const handleAuthCallback = async (code, state) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/notion/oauth/callback",
        { code, state }
      );

      if (response.data && response.data.success) {
        setAuthStatus("✅ Successfully connected to Notion!");

        chrome.storage.local.set({
          notionAuth: {
            connected: true,
            timestamp: Date.now(),
          },
        });

        setTimeout(() => setAuthStatus(""), 3000);
      } else {
        setAuthStatus("❌ Authentication failed");
        setTimeout(() => setAuthStatus(""), 3000);
      }
    } catch (error) {
      console.error("Error completing auth:", error);
      setAuthStatus("❌ Authentication failed");
      setTimeout(() => setAuthStatus(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <button
        onClick={handleNotionAuth}
        className="action-button"
        disabled={isLoading}
      >
        {isLoading ? "🔄 Connecting..." : "🔗 Connect to Notion"}
      </button>

      {authStatus && <div className="auth-status">{authStatus}</div>}
    </div>
  );
};

export default SignUp;
