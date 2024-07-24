"use client";

import { useLayoutEffect, useRef } from "react";
import { LLM_RESPONSE_HTML_ELEMENT_ID } from "~/constants";
import { useLlmResponseContent } from "./llm-response-content-context";

export default function LlmResponseContentPieceRenderer({
  content,
}: {
  content: string;
}) {
  const { append } = useLlmResponseContent();
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (firstRender.current) {
      append(content);
    }
    firstRender.current = false;
  }, [append, content]);

  return <></>;
}
