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

// ============================================================================
// SIMULATION SYSTEM PROMPT — Enhanced for all topics
// ============================================================================
const SIMULATION_PROMPT = [
  'You are the KinetiQ Omni-Simulator Engine, an expert educational developer who creates stunning, interactive HTML5 simulations for ANY topic.',
  '',
  'The user will provide a concept from ANY subject — physics, chemistry, biology, mathematics, computer science, history, geography, economics, or any other field.',
  '',
  'You must output ONLY valid, raw HTML, CSS, and vanilla JavaScript to create a visual, interactive simulation/visualization.',
  '',
  'DO NOT wrap the output in markdown ticks or provide any conversational text. Return a pure HTML string starting with <!DOCTYPE html>.',
  '',
  'Choose the BEST visualization approach based on the topic:',
  '',
  '**For 3D/Spatial concepts** (astronomy, molecular structures, geometry):',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></scr' + 'ipt>',
  '',
  '**For Physics simulations** (gravity, collisions, mechanics, waves):',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js"></scr' + 'ipt>',
  '',
  '**For Data/Algorithms/Networks** (sorting, trees, graphs, networking):',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></scr' + 'ipt>',
  '',
  '**For Biology/Chemistry/Art** (cells, reactions, ecosystems, generative art):',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"></scr' + 'ipt>',
  '',
  '**For Charts/Statistics/Economics** (data visualization, supply/demand, population):',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></scr' + 'ipt>',
  '',
  '**For History/Geography/Timelines** (events, maps, processes):',
  'Use pure Canvas API or SVG for timelines, flowcharts, and process diagrams.',
  '',
  '**For Mathematics** (functions, calculus, geometry, fractals):',
  'Use Canvas API to plot graphs, draw geometric constructions, or render fractals with animation.',
  '',
  'CRITICAL RULES:',
  '1. Scale the canvas/renderer to window.innerWidth and window.innerHeight.',
  '2. Use requestAnimationFrame for continuous animation loops where appropriate.',
  '3. Use a dark background (#0a0a0f) with vibrant colors that match a premium dark UI.',
  '4. Add a clear TITLE at the top of the simulation describing what the user is seeing.',
  '5. Add LABELS and ANNOTATIONS so the user understands every element.',
  '6. Include interactive controls (mouse drag, sliders, buttons, keyboard) wherever they make sense.',
  '7. Make it visually STUNNING with smooth animations, gradients, glowing effects, and particle trails.',
  '8. The HTML must be completely self-contained — no external dependencies except the CDN listed above.',
  '9. Always include <meta charset="UTF-8"> and <meta name="viewport" content="width=device-width, initial-scale=1.0">.',
  '10. Add an info panel in the corner explaining what the simulation shows and how to interact with it.',
  '11. Handle errors gracefully — if a library fails to load, show a canvas-based fallback.',
  '12. Make the simulation EDUCATIONAL — not just pretty. The user should learn something from interacting with it.',
  '13. For non-science topics, be creative: use timelines, flowcharts, interactive diagrams, mind maps, or animated infographics.',
  '14. ALWAYS test that your code works. Do not use APIs or syntax that does not exist.',
].join('\n');

// ============================================================================
// SIMULATION EXPLANATION PROMPT
// ============================================================================
const EXPLANATION_PROMPT = [
  'You are the KinetiQ Voice Tutor. The user has generated an interactive simulation about a concept.',
  'Your job is to provide a clear, engaging, spoken explanation that walks the student through what the simulation shows.',
  '',
  'Return ONLY a JSON object with this structure:',
  '{ "explanation": "A 3-5 sentence narration explaining the concept and what the simulation demonstrates. Write it as if you are speaking to the student. Be conversational and educational.", "keyPoints": ["Point 1", "Point 2", "Point 3"] }',
  '',
  'Rules:',
  '- Write naturally as spoken language (no bullet points, no markdown).',
  '- Keep the explanation under 150 words.',
  '- Make key points concise (under 15 words each).',
  '- Do NOT use markdown formatting.',
  '- Return ONLY the JSON object, nothing else.',
].join('\n');

// ============================================================================
// SIMULATION CHAT PROMPT
// ============================================================================
const SIM_CHAT_PROMPT = [
  'You are the KinetiQ Simulation Assistant. The student is viewing an interactive simulation and has a question.',
  'Answer their question clearly and concisely, relating it back to the simulation they are seeing.',
  'Be friendly, educational, and use simple language. Keep responses under 100 words.',
  'Do NOT use markdown formatting — plain text only, as your response will be read aloud.',
].join('\n');

// ============================================================================
// ROUTES
// ============================================================================

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'KinetiQ API' });
});

// Generate Simulation
app.post('/api/simulate', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: "A valid 'query' field is required." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Create an interactive simulation for: ' + query,
      config: {
        systemInstruction: SIMULATION_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 16384,
      },
    });

    let simulation = response.text;
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

// Simulation Explanation (for voice assistant)
app.post('/api/simulation-explain', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: "A valid 'query' field is required." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'The student generated a simulation about: "' + query + '". Provide a voice-narration explanation.',
      config: {
        systemInstruction: EXPLANATION_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    let text = response.text.trim();
    text = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error('Explanation generation error:', error);
    res.status(500).json({ error: 'Failed to generate explanation.' });
  }
});

// Simulation Chat (ask doubts)
app.post('/api/simulation-chat', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { query, simulationTopic, message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "A valid 'message' field is required." });
    }

    const prompt = 'The student is viewing a simulation about "' + (simulationTopic || query || 'a concept') + '". They ask: "' + message + '"';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SIM_CHAT_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Simulation chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response.' });
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
      model: 'gemini-2.5-flash',
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

// Generate Test endpoint — Fixed to use subject + topic properly
app.post('/api/generate-test', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { subject, topic, difficulty, count } = req.body;

    const subjectStr = subject || 'general science';
    const topicStr = topic ? ' specifically about "' + topic + '"' : '';
    const diffStr = difficulty || 'medium';
    const countNum = count || 10;

    const prompt = 'Generate exactly ' + countNum + ' multiple-choice questions about the subject "' + subjectStr + '"' + topicStr + ' at ' + diffStr + ' difficulty level.\n\nIMPORTANT: All questions MUST be about "' + subjectStr + '"' + (topic ? ' and specifically about "' + topic + '"' : '') + '. Do NOT generate questions about any other subject.\n\nReturn ONLY a JSON array with objects containing: question (string), options (array of exactly 4 strings), correctAnswer (index 0-3), explanation (string). No markdown, no extra text, no wrapping.';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a test question generator for an educational platform called KinetiQ. Generate high-quality, accurate multiple-choice questions. The questions MUST match the exact subject and topic requested. Return ONLY a valid JSON array. No markdown fences. No extra text before or after the JSON.',
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
