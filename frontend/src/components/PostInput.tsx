import { useState } from "react";
import { TextInput, Button } from "@cfa/react-core";
import { getApiToken, getApiUrl } from "../apiConfig";

interface Message {
  id: string;
  message: string;
  date: string;
  time: number;
}

interface PostInputProps {
  onPosted?: (message: Message) => void;
}

export default function PostInput({ onPosted }: PostInputProps) {
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const postMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || posting) {
      return;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      message: trimmed,
      date: new Date().toISOString(),
      // DB column is INTEGER — milliseconds overflow; use unix seconds
      time: Math.floor(Date.now() / 1000),
    };

    setPosting(true);
    try {
      const response = await fetch(getApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getApiToken()}`,
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error("Failed to post message");
      }

      const created: Message = await response.json();
      setText("");
      onPosted?.(created);
    } catch (error) {
      console.error("Error posting message:", error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <TextInput
        label="Type in a message to enter!"
        placeholder="Hello..."
        value={text}
        onChange={setText}
      />
      <Button onPress={postMessage} isDisabled={!text.trim() || posting}>
        {posting ? "Posting..." : "Post"}
      </Button>
    </div>
  );
}
