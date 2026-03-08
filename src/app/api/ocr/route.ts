import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'missing imageBase64' }, { status: 400 });
    }

    // Strip data URI prefix if present: "data:image/jpeg;base64,..."
    const base64Data = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 64,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: base64Data },
            },
            {
              type: 'text',
              text: 'This is a photo of a vehicle odometer. Extract the numeric odometer reading (kilometers). Reply with ONLY the number, no units, no explanation. If you cannot read it clearly, reply with the word UNKNOWN.',
            },
          ],
        },
      ],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();

    if (raw === 'UNKNOWN') {
      return NextResponse.json({ value: null, raw });
    }

    const value = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    return NextResponse.json({ value: isNaN(value) ? null : value, raw });
  } catch (err) {
    console.error('OCR error:', err);
    return NextResponse.json({ error: 'שגיאת OCR' }, { status: 500 });
  }
}
