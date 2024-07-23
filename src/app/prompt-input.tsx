"use client";

import { type CSSProperties, useState } from "react";
import { useFormStatus } from "react-dom";

export default function PromptInput({ maxLength }: { maxLength: number }) {
  const [prompt, setPrompt] = useState("");
  const { pending } = useFormStatus();
  return (
    <div className="form-control form-control-primary">
      <input
        autoFocus
        type="text"
        name="prompt"
        placeholder="I want to see..."
        className="w-full !bg-white/90 !text-xl !text-black"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={maxLength}
        disabled={pending}
      />
      <span className="form-control-suffix !bg-white/90 p-2 !pr-2">
        <button type="submit" className="btn-primary btn" disabled={pending}>
          {!pending ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-[1.125rem] w-[1.125rem]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
              />
            </svg>
          ) : (
            <div
              className="radial-progress progress-surface progress-sm m-auto animate-spin"
              style={
                {
                  "--progress": "25%",
                  "--size": "1.125rem",
                  "--bar-width": "3px",
                } as CSSProperties
              }
            />
          )}
        </button>
      </span>
      <span className="form-control-hint text-right !text-base">
        {prompt.length} / {maxLength}
      </span>
    </div>
  );
}
