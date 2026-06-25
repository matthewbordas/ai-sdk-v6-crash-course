import { useChat } from '@ai-sdk/react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatInput, Message, Wrapper } from './components.tsx';
import './tailwind.css';

const App = () => {
  const { messages, sendMessage } = useChat({});

  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
  );

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
        input={input}
        onInputChange={(e) => {
          console.log(`onInputChange()`);

          setInput(e.target.value);
        }}
        onFileSelect={(e) => {
          console.log(`onFileSelect()`);

          const file = e.target.files?.[0] || null;
          setSelectedFile(file);
        }}
        selectedFile={selectedFile}
        onSubmit={async (e) => {
          console.log(`onSubmit()`);

          e.preventDefault();

          // const formData = new FormData(
          //   e.target as HTMLFormElement,
          // );
          // const file = formData.get('file') as File | null;

          // console.log(
          //   `file === selectedFile:`,
          //   file === selectedFile,
          // );

          // TODO: figure out how to pass the file
          // _as well as the text_ to the
          // /api/chat route!
          if (!selectedFile) {
            console.error(
              `onSubmit Error: selectedFile is null`,
            );
            return;
          }

          // NOTE: You have a helpful function below
          // called fileToDataURL that you can use to
          // convert the file to a data URL. This
          // will be useful!

          // NOTE: Make sure you handle the case where
          // `file` is null!
          sendMessage({
            // NOTE: 'parts' will be useful
            text: input,
          });

          setInput('');
          setSelectedFile(null);
        }}
      />
    </Wrapper>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

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
