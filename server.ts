import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface FarmContext {
  farmName?: string;
  crops?: string;
  soilType?: string;
  irrigationMethod?: string;
  waterSource?: string;
  farmArea?: number;
  areaUnit?: string;
  cityName?: string;
  totalWaterLiters?: number;
  recentRecordsSummary?: string;
  recentRecordsCount?: number;
}

const AGRONOMY_GUIDE_MAP: Record<string, { id: string; title: string }> = {
  drip: {
    id: 'drip-irrigation-maintenance',
    title: 'Drip Irrigation Efficiency & Emitter Clog Prevention',
  },
  emitter: {
    id: 'drip-irrigation-maintenance',
    title: 'Drip Irrigation Efficiency & Emitter Clog Prevention',
  },
  clog: {
    id: 'drip-irrigation-maintenance',
    title: 'Drip Irrigation Efficiency & Emitter Clog Prevention',
  },
  filter: {
    id: 'drip-irrigation-maintenance',
    title: 'Drip Irrigation Efficiency & Emitter Clog Prevention',
  },
  soil: {
    id: 'soil-texture-awc',
    title: 'Soil Texture & Available Water Capacity (AWC)',
  },
  awc: {
    id: 'soil-texture-awc',
    title: 'Soil Texture & Available Water Capacity (AWC)',
  },
  texture: {
    id: 'soil-texture-awc',
    title: 'Soil Texture & Available Water Capacity (AWC)',
  },
  etc: {
    id: 'crop-evapotranspiration-etc',
    title: 'Calculating Crop Evapotranspiration (ETc = ET₀ × Kc)',
  },
  evapotranspiration: {
    id: 'crop-evapotranspiration-etc',
    title: 'Calculating Crop Evapotranspiration (ETc = ET₀ × Kc)',
  },
  kc: {
    id: 'crop-evapotranspiration-etc',
    title: 'Calculating Crop Evapotranspiration (ETc = ET₀ × Kc)',
  },
  mulch: {
    id: 'organic-mulching-evaporation',
    title: 'Organic Mulching & Evaporative Loss Mitigation',
  },
  straw: {
    id: 'organic-mulching-evaporation',
    title: 'Organic Mulching & Evaporative Loss Mitigation',
  },
  pond: {
    id: 'farm-pond-rainwater-harvesting',
    title: 'Farm Pond Design & Groundwater Recharge Tactics',
  },
  rainwater: {
    id: 'farm-pond-rainwater-harvesting',
    title: 'Farm Pond Design & Groundwater Recharge Tactics',
  },
  deficit: {
    id: 'regulated-deficit-irrigation-rdi',
    title: 'Regulated Deficit Irrigation (RDI) for Orchards & Field Crops',
  },
  rdi: {
    id: 'regulated-deficit-irrigation-rdi',
    title: 'Regulated Deficit Irrigation (RDI) for Orchards & Field Crops',
  },
  drought: {
    id: 'regulated-deficit-irrigation-rdi',
    title: 'Regulated Deficit Irrigation (RDI) for Orchards & Field Crops',
  },
};

function detectRelatedGuide(prompt: string, reply: string): { id: string; title: string } | null {
  const combined = (prompt + ' ' + reply).toLowerCase();
  for (const [keyword, guide] of Object.entries(AGRONOMY_GUIDE_MAP)) {
    if (combined.includes(keyword)) {
      return guide;
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize official Google GenAI SDK with server-side telemetry
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Chat endpoint
  app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
    try {
      const { message, history = [], farmContext, userId } = req.body as {
        message: string;
        history?: ChatMessage[];
        farmContext?: FarmContext;
        userId?: string;
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Message cannot be empty.' });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error: 'Gemini API key is not configured on the server. Please check the Secrets panel.',
        });
        return;
      }

      // Build real farmer data context
      let farmerDataSection = 'No farm profile or water records currently available for this user.';
      if (farmContext) {
        farmerDataSection = `
Farmer & Farm Profile (REAL USER DATA):
- Farm Name: ${farmContext.farmName || 'Not specified'}
- Crops Cultivated: ${farmContext.crops || 'Not specified'}
- Soil Type: ${farmContext.soilType || 'Not specified'}
- Primary Irrigation Method: ${farmContext.irrigationMethod || 'Not specified'}
- Water Source: ${farmContext.waterSource || 'Not specified'}
- Farm Area: ${farmContext.farmArea ? `${farmContext.farmArea} ${farmContext.areaUnit || 'acres'}` : 'Not specified'}
- Location: ${farmContext.cityName || 'Not specified'}
- Actual Water Consumption Recorded: ${
          farmContext.recentRecordsCount && farmContext.recentRecordsCount > 0
            ? `${farmContext.totalWaterLiters?.toLocaleString()} Liters across ${farmContext.recentRecordsCount} records.`
            : 'No water usage has been recorded yet.'
        }
- Records Breakdown: ${farmContext.recentRecordsSummary || 'None'}
`;
      }

      const systemInstruction = `
You are the "AgriFlow Farmer Assistant", an expert, empathetic, practical agricultural and water-management conversational AI assistant built specifically for farmers.

Your Core Agricultural Domain Specialties:
- Farm water conservation & irrigation scheduling
- Drip irrigation operation, emitter clogging prevention, lateral flushing, filtration, and pressure regulation
- Soil texture classification, Available Water Capacity (AWC), infiltration rates, and hand ribbon testing
- Crop Evapotranspiration calculation principles (ETc = ET₀ × Kc) across different crop growth stages
- Organic mulching, crop residue management, and reducing topsoil evaporative losses
- Farm ponds, rainwater harvesting catchments, silt trap basins, and groundwater recharge
- Regulated Deficit Irrigation (RDI) for orchards and field crops during drought conditions

CRITICAL RULES FOR HANDLING FARMER DATA:
1. When the farmer asks about their water consumption (e.g. "How much water have I used?", "Explain my water usage", "What are my recent water logs?"):
   - Inspect the provided REAL USER DATA section.
   - If there are recorded entries, summarize their exact totals, dates, and crops.
   - If there are NO records, clearly respond: "No water usage has been recorded yet."
   - NEVER invent or simulate water usage quantities (e.g., do not make up fake millions of liters or fake numbers).
2. If the farmer asks about their crops, soil, or farm location, refer to the provided real farm profile. If information is missing, state clearly that it is not in their profile yet and encourage them to set it in Farm Profile or Water Logs.

CRITICAL SAFETY & MEDICAL/CHEMICAL RULES:
1. Disease Diagnosis Caution: You must NOT confidently diagnose crop disease from symptoms alone. If a farmer asks: "My tomato leaves are yellow. What disease is this?" or similar, explicitly explain that yellowing has multiple potential causes (over-watering, under-watering, nitrogen/micronutrient deficiency, root rot, fungal blight, mite infestation, or heat/cold stress). Advise checking root-zone moisture and recommend consulting a local agricultural extension officer or local university farm center for a verified physical sample test.
2. Fertilizers & Chemicals: Do NOT invent unsupported specific chemical cocktails or hazardous acid dosages. Always advise reading the product label, wearing protective gloves/goggles, and consulting a local agricultural specialist.

TONE & STYLE:
- Clear, farmer-friendly, respectful, and practical.
- Use bullet points and concise paragraphs.
- Keep recommendations realistic for small to mid-sized farms.

Current User Context:
${farmerDataSection}
`;

      // Format conversation turns for Gemini
      const contents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];

      // Include recent history (up to last 10 messages)
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }

      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }],
      });

      // Call Gemini model with automatic fallback for high-demand or quota spikes
      // gemini-3.1-flash-lite is the reliable, high-speed flash model
      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let response: { text?: string } | null = null;
      let lastError: unknown = null;

      for (const model of candidateModels) {
        try {
          const genRes = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          response = genRes;
          break;
        } catch (err) {
          console.warn(`Model ${model} failed, trying next candidate:`, err);
          lastError = err;
        }
      }

      if (!response) {
        throw lastError || new Error('All Gemini model candidates failed to respond.');
      }

      const replyText = response.text || 'I could not generate an answer right now. Please try asking again.';
      const relatedGuide = detectRelatedGuide(message, replyText);

      res.json({
        success: true,
        reply: replyText,
        relatedGuide: relatedGuide || undefined,
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
      console.error('Gemini Chat Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown AI generation error';
      res.status(500).json({
        error: `AgriFlow Assistant could not connect: ${errorMessage}`,
        canRetry: true,
      });
    }
  });

  // Mount Vite middleware in development mode or serve static files in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriFlow Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
