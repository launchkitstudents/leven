# LaunchKit AI App

This is the real AI-connected version of LaunchKit.

## What it does
Users enter their application information and LaunchKit returns AI-generated results directly inside the app. No copy/paste into another AI product.

## Run locally
1. Install Node.js 20+.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env` and add your OpenAI API key.
5. Load the environment variables, then run `npm start`.

## Production
Keep `OPENAI_API_KEY` on the SERVER only. Never put it in `public/index.html` or other browser code.
Before selling this as a gated web service, add buyer authentication/access control, rate limits, logging/usage limits, and deployment configuration.
