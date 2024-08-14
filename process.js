import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { program } from 'commander';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path) {
  const spinner = ora('Uploading video to Gemini').start();
  try {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType: 'video/mp4',
      displayName: path,
    });
    const file = uploadResult.file;
    spinner.succeed(`Uploaded video ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    spinner.fail(`Failed to upload video: ${error.message}`);
    throw error;
  }
}

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForFileProcessing(fileName, spinner) {
  while (true) {
    const videoFile = await fileManager.getFile(fileName);
    if (videoFile.state === 'ACTIVE') {
      spinner.succeed('Video processing complete. File is ready for analysis.');
      return videoFile;
    } else if (videoFile.state === 'FAILED') {
      throw new Error(`Video processing failed: ${videoFile.state.name}`);
    }
    spinner.text = 'Video processing in progress...';
    await delay(10000); // Wait for 10 seconds before checking again
  }
}

async function run(filePath, prompt) {
  const spinner = ora('Initializing').start();

  try {
    const uploadedFile = await uploadToGemini(filePath);

    spinner.text = 'Verifying video file state';
    const activeFile = await waitForFileProcessing(uploadedFile.name, spinner);

    spinner.text = 'Preparing video analysis';
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: 'video/mp4',
                fileUri: activeFile.uri,
              },
            },
          ],
        },
      ],
    });

    spinner.text = 'Analyzing video and generating response';
    const result = await chatSession.sendMessage(prompt);
    spinner.succeed('Analysis complete. Generating response.');
    console.log('\nResponse:');
    console.log(result.response.text());
  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
  }
}

program
  .version('1.0.0')
  .description('Gemini AI Video Analysis CLI')
  .requiredOption('-f, --file <path>', 'Path to the video file (MP4)')
  .requiredOption('-p, --prompt <text>', 'Prompt for video analysis')
  .parse(process.argv);

const options = program.opts();

run(options.file, options.prompt);
