import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Upload, XIcon } from 'lucide-react';

export const Wrapper = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full max-w-xl py-24 mx-auto stretch">
      {props.children}
    </div>
  );
};

export const Message = ({
  role,
  parts,
}: {
  role: string;
  parts: UIMessagePart<UIDataTypes, UITools>[];
}) => {
  const prefix = role === 'user' ? 'User: ' : 'AI: ';

  const text = parts
    .map((part) => {
      if (part.type === 'text') {
        return part.text;
      }
      return '';
    })
    .join('');
  return (
    <div className="prose prose-invert my-6">
      <ReactMarkdown>{prefix + text}</ReactMarkdown>
    </div>
  );
};

export const ChatInput = ({
  chatMessage,
  onChatMessageChange,
  onFileSelect,
  selectedFile,
  onSubmitChatMessage,
}: {
  chatMessage: string;
  onChatMessageChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onFileSelect: (
    e: React.ChangeEvent<HTMLInputElement> | null,
  ) => void;
  selectedFile: File | null;
  onSubmitChatMessage: (e: React.FormEvent) => void;
}) => {
  const clearSelectedFile = (_e: React.MouseEvent) => {
    onFileSelect(null);
  };

  const AddFile = () => (
    <div className="flex flex-col gap-1">
      <label
        // Use the label for styling the file upload with an icon
        // Input is hidden from the UI and only stores the selected file
        // This is the easiest way to do it without adding an additional button
        // ---
        className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        htmlFor="file"
      >
        <Upload className="w-5 h-5 text-gray-300" />
      </label>
      <input
        className="hidden"
        type="file"
        id="file"
        name="file"
        onChange={onFileSelect}

        // You cannot set this to required due to it being a hidden element
        // https://stackoverflow.com/a/22148483/3559330
        // The browser will throw an error in the console
        // Thus, we'll have to accept that the file can be null
        // This will need to be handled during submission
        // required
        // ---

        // When type="file" value is a string path to the file
        // We can't use it to bind to the target's File object directly
        // Keep it up-to-date via onChange (optionally use a ref as a backup)
        // value=""
        // ---
      />
    </div>
  );

  const ClearSelection = () => (
    <div className="text-xs text-gray-400 bg-gray-700 py-1 px-2 flex-shrink-0 flex gap-2 items-center rounded -ml-1">
      <button
        type="button"
        onClick={clearSelectedFile}
        className="text-gray-400 hover:text-gray-300"
      >
        <XIcon className="size-4" />
      </button>
      <span>{selectedFile?.name}</span>
    </div>
  );

  return (
    <form
      // Technically this is not a Web Standard
      // The native <form/> only accepts URLs
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#action
      // ---

      // However, React allows you to pass a function
      // It is a bit simpler, but good to know
      // https://react.dev/reference/react-dom/components/form#props
      // ---

      // "onSubmit" is also allowed as an event handler
      // Setting "action" to a function has issues, see more below
      onSubmit={onSubmitChatMessage}
      // ---

      // Very odd, this results in react-dom setting the function to an error string
      // https://github.com/react/react/blob/52912a14531dad54d7844c83bc0e35f2c6a74c11/packages/react-dom-bindings/src/client/ReactDOMComponent.js#L543-L557
      // action={onSubmitChatMessage}
      // ---

      className="fixed bottom-0 w-full max-w-xl p-2 mb-8 rounded shadow-xl bg-gray-800 flex gap-2 items-center"
    >
      <AddFile />
      <div className="flex-1 flex gap-3 items-center p-2 px-3 border-2 border-zinc-700 rounded shadow-xl bg-gray-800 focus-within:outline-2">
        {selectedFile && <ClearSelection />}
        <input
          // Submits the form when the user presses "Enter"
          // The "type" of input is "text" by default
          // The submit event will fire on "Enter" for text inputs
          // https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
          // ---

          className="w-full outline-0"
          value={chatMessage}
          placeholder="Say something..."
          onChange={onChatMessageChange}
          required

          // Not recommended for screen readers
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#autofocus
          // autoFocus
          // ---
        />
      </div>
    </form>
  );
};
