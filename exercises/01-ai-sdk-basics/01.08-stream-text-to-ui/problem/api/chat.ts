import { google } from '@ai-sdk/google';
import {
  streamText,
  type ModelMessage,
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
} from 'ai';

type ChatRequest = Omit<Request, 'json'> & {
  json: () => Promise<{
    id: string;
    messages: UIMessage[];
    trigger: string;
  }>;
};

export const POST = async (
  req: ChatRequest,
): Promise<Response> => {
  const body = await req.json();

  const uiMessages: UIMessage[] = body.messages;

  const modelMessages: ModelMessage[] =
    await convertToModelMessages(uiMessages);

  const streamTextResult = streamText({
    model: google('gemini-2.5-flash'),
    messages: modelMessages,
  });

  const stream = streamTextResult.toUIMessageStream();

  return createUIMessageStreamResponse({
    stream,
  });
};
