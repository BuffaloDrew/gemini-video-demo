# Gemini Video Demo

This project demonstrates how to use Google's Gemini AI to analyze video content using Node.js.

## Demo


https://github.com/user-attachments/assets/0ad75d61-c1c0-4d84-84f6-e073e147345f



## Prerequisites

- Node.js (version 14 or higher recommended)
- FFmpeg (for video conversion)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/buffalodrew/gemini-video-demo.git
   cd gemini-video-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Usage

To run the video analysis:

```
node process.js -f path/to/your/video.mp4 -p "Your prompt here"
```

For example:
```
node process.js -f nyt_review.mp4 -p "Please provide a summary of this video"
```

## Converting .mov to .mp4

If your video is in .mov format, you'll need to convert it to .mp4 before using it with this demo. Here's how to do it using FFmpeg:

1. Install FFmpeg:
   - On macOS (using Homebrew): `brew install ffmpeg`
   - On Windows: Download from [FFmpeg's official site](https://ffmpeg.org/download.html)
   - On Linux: Use your distribution's package manager (e.g., `sudo apt install ffmpeg` for Ubuntu)

2. Convert your video:
   ```
   ffmpeg -i input.mov output.mp4
   ```
   Replace `input.mov` with your .mov file name and `output.mp4` with your desired output file name.


## License

This project is licensed under the ISC License.
