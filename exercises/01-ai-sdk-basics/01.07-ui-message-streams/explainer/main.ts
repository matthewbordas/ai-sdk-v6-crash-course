import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

let model = google('gemini-2.5-flash');

model = openai('gpt-5.2');

model = anthropic('claude-sonnet-4-5');

const stream = streamText({
  model,
  prompt: 'Give me a sonnet about a cat called Steven.',
});

for await (const chunk of stream.toUIMessageStream()) {
  console.log(`[${chunk.type}]:`, chunk);
}
