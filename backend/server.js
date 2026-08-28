const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = [
  'You are the KinetiQ Omni-Simulator Engine, an expert educational developer.',
  'The user will provide a complex technical or scientific concept.',
  '',
  'You must output ONLY valid, raw HTML, CSS, and vanilla JavaScript to create a visual, interactive simulation of the concept.',
  '',
  'DO NOT wrap the output in markdown ticks or provide any conversational text before or after the code.',
  'Return a pure, renderable HTML string starting with <!DOCTYPE html> or <html>.',
  '',
  'Depending on the concept, dynamically inject the correct CDN script tag into the <head>:',
  '- For 3D space, astronomy, or spatial geometry: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></scr' + 'ipt>',
  '- For kinetics, gravity, collisions, or mechanics: <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js"></scr' + 'ipt>',
  '- For data structures, algorithms, or networking: <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></scr' + 'ipt>',
  '- For generative art, cellular biology, or chemical reactions: <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"></scr' + 'ipt>',
  '',
  'Important rules:',
  '1. Scale the canvas/renderer to window.innerWidth and window.innerHeight.',
  '2. Use requestAnimationFrame for continuous animation loops.',
  '3. Use a dark background (#0a0a0f or similar) that matches a premium dark UI.',
  '4. Add clear, readable labels/titles to the simulation so the user understands what they are seeing.',
  '5. Include interactive controls where appropriate (mouse drag, sliders, buttons).',
  '6. Make the simulation visually stunning with smooth animations, gradients, and glow effects.',
  '7. The HTML must be completely self-contained - no external dependencies other than the CDN above.',
  '8. Always include <meta charset="UTF-8"> and <meta name="viewport" content="width=device-width, initial-scale=1.0">.',
].join('\n');

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'KinetiQ API' });
});

app.post('/api/simulate', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: "A valid 'query' field is required." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: query,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 16384,
      },
    });

    let simulation = response.text;
    // Strip markdown fences if Gemini accidentally wraps them
    const fenceStart = /^```html?\s*/i;
    const fenceEnd = /```\s*$/i;
    simulation = simulation.replace(fenceStart, '').replace(fenceEnd, '').trim();

    res.json({ simulation });
  } catch (error) {
    console.error('Simulation generation error:', error);
    res.status(500).json({
      error: 'Failed to generate simulation. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});


// AI Tutor endpoint
app.post('/api/tutor', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "A valid 'message' field is required." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: 'You are the KinetiQ AI Tutor, a friendly and expert educational assistant. Explain concepts clearly using simple language, analogies, and examples. Format your responses in clean paragraphs. Be concise but thorough. If the student asks about a scientific or technical concept, explain the underlying principles. Do not use markdown formatting.',
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Tutor error:', error);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
});

// Generate Test endpoint
app.post('/api/generate-test', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { subject, topic, difficulty, count } = req.body;

    const prompt = 'Generate ' + (count || 10) + ' multiple-choice questions about ' + (topic || subject || 'general science') + ' at ' + (difficulty || 'medium') + ' difficulty. Return ONLY a JSON array with objects containing: question (string), options (array of 4 strings), correctAnswer (index 0-3), explanation (string). No markdown, no extra text.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a test question generator for an educational platform. Generate high-quality, accurate multiple-choice questions. Return ONLY valid JSON array. No markdown fences. No extra text.',
        temperature: 0.8,
        maxOutputTokens: 8192,
      },
    });

    let text = response.text.trim();
    text = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
    const questions = JSON.parse(text);
    res.json({ questions });
  } catch (error) {
    console.error('Test generation error:', error);
    res.status(500).json({ error: 'Failed to generate test.' });
  }
});

app.listen(PORT, () => {
  console.log('KinetiQ API running on http://localhost:' + PORT);
});
