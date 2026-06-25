import { useChat } from '@ai-sdk/react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { ChatInput, Message, Wrapper } from './components.tsx';

import type { FileUIPart, TextUIPart, UIMessagePart } from 'ai';

import './tailwind.css';

const App = () => {
  // AI SDK is the glue between the user's input, the form, the browser, and the API
  // The useChat() hook stores the message history and handles sending data to an internally configured endpoint
  // e.g. defaults to "POST /api/chat"
  // ---

  // You can override this, but it looks a bit invovled
  // https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat#api-signature
  // ---
  const { messages, sendMessage } = useChat({});

  const [chatMessage, setChatMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
  );

  const onSubmitChatMessage = async (e: React.FormEvent) => {
    console.log(`onSubmitChatMessage()`);

    // Prevent the form's default action from making a browser request
    // We're submitting the data ourselves
    e.preventDefault();

    // We have to validate here because the input is hidden
    // Hidden inputs cannot have "required" set or be included in form validation
    if (!selectedFile) {
      console.warn(
        `onSubmitChatMessage(): no file chosen, continuing with just the chat message`,
      );
    }

    const id = crypto.randomUUID();
    const parts = [];

    const textPart: TextUIPart = {
      type: 'text',
      text: chatMessage,
    };
    parts.push(textPart);

    // selectedFile is optional, chatMessage is required
    if (selectedFile) {
      const fileDataUrl = await fileToDataURL(selectedFile);
      const filePart: FileUIPart = {
        type: 'file',
        mediaType: selectedFile.type,
        filename: selectedFile.name,
        url: fileDataUrl,
      };

      parts.push(filePart);
    }

    // Note:
    // Do not await here so we can immediately clear the inputs
    // This is a better UX since the LLM takes time to respond
    sendMessage({
      id,
      role: 'user',
      parts,
    });

    setChatMessage('');
    setSelectedFile(null);
  };

  return (
    <Wrapper>
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          parts={message.parts}
        />
      ))}
      <ChatInput
        chatMessage={chatMessage}
        onChatMessageChange={(e) => {
          setChatMessage(e.target.value);
        }}
        // ---

        selectedFile={selectedFile}
        onFileSelect={(e) => {
          setSelectedFile(e?.target?.files?.[0] || null);
        }}
        // ---

        // File input is hidden so the selectedFile may be null at this point
        // Validation performed in the event handler
        onSubmitChatMessage={onSubmitChatMessage}
        // ---
      />
    </Wrapper>
  );
};

/**
 * Converts a file to a data URL.
 *
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} - The data URL.
 */
const fileToDataURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
