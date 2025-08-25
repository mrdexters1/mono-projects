"use client";

import { Button, Input } from "@ui";
import { useState } from "react";

export const ChatInputForm = ({ onSubmit }: { onSubmit: (input: string) => void }) => {
  const [input, setInput] = useState("");
  const [isHotButtonsVisible, setIsHotButtonsVisible] = useState(true);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(input);
          setInput("");
          setIsHotButtonsVisible(false);
        }}
      >
        <Button
          onClick={() => setIsHotButtonsVisible(!isHotButtonsVisible)}
          size="sm"
        >
          {isHotButtonsVisible ? 1 : 2}
        </Button>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask PL8-O anything"
        />
        <Button
          type="submit"
          size="sm"
        >
          3
        </Button>
      </form>
    </div>
  );
};
