"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { LLM_RESPONSE_HTML_ELEMENT_ID } from "~/constants";

type LlmResponseContentContextType = {
  append: (content: string) => void;
};

const LlmResponseContentContext = createContext<
  LlmResponseContentContextType | undefined
>(undefined);

export const LlmResponseContentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const elementRef = useRef<HTMLElement | undefined>(undefined);
  const contentRef = useRef<string>("");

  const append = useCallback((content: string) => {
    contentRef.current += content;

    if (!elementRef.current) {
      elementRef.current =
        document.getElementById(LLM_RESPONSE_HTML_ELEMENT_ID) ?? undefined;
    }

    if (elementRef.current) {
      elementRef.current.innerHTML = contentRef.current;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      append,
    }),
    [append],
  );

  return (
    <LlmResponseContentContext.Provider value={contextValue}>
      {children}
    </LlmResponseContentContext.Provider>
  );
};

export const useLlmResponseContent = () => {
  const context = useContext(LlmResponseContentContext);

  if (context === undefined) {
    throw new Error(
      "useLlmResponseContent must be used within a LlmResponseContentProvider",
    );
  }

  return context;
};
