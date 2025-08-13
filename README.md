# FineNotes.AI - YouTube Notes

A Chrome extension that allows you to take notes while watching YouTube videos.

## Features

- Take screenshots of YouTube videos
- Copy video transcripts with timestamps
- Add a "Take Notes" button below YouTube video titles
- Detect when videos are paused for note-taking

## How to Use

1. Install the extension from the Chrome Web Store or load it unpacked in developer mode
2. Open a YouTube video
3. Click on the extension icon to open the popup
4. Use the "Insert Notes Button" to add a note-taking button below the video title
5. When you click the "Take Notes" button or pause the video, the timestamp and video title will be captured

## Development

This extension is built with React and Vite.

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Start development server
npm run dev
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
