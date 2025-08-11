import { Monitor } from "lucide-react";
import type React from "react";

export const ChatHeader: React.FC = () => {
  return (
    <div
      className="sticky top-0 z-10 bg-chat-header-bg backdrop-blur-md border-b border-border/50 
                    shadow-header p-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-button rounded-2xl flex items-center justify-center">
            <Monitor className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-inter font-semibold text-lg text-foreground">Hardware Picker AI</h1>
            <p className="text-muted-foreground text-sm">Your Personal PC Builder Assistant</p>
          </div>
        </div>
      </div>
    </div>
  );
};
