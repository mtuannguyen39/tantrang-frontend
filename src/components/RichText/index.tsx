"use client";

import React from "react";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS as LexicalTransformers,
  TEXT_FORMAT_TRANSFORMERS,
  ElementTransformer,
  TextMatchTransformer,
} from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  EditorState,
  FORMAT_TEXT_COMMAND,
  $isRangeSelection,
  TextNode,
} from "lexical";
import { useEffect, useCallback, useState } from "react";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $createTextNode, $isTextNode } from "lexical";

// Đây là cách đúng đắn để thêm transformer cho format text
// Bằng cách này, chúng ta không cần tự viết regex cho cả hai chiều
const SUPERSCRIPT_TRANSFORMER = {
  type: "text-format" as const,
  format: ["superscript"] as const,
  tag: "^",
};

const CUSTOM_TRANSFORMERS = [...LexicalTransformers, SUPERSCRIPT_TRANSFORMER];

// Plugin để set initial value
function InitialValuePlugin({ initialValue }: { initialValue: string }) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (initialValue && !hasInitialized) {
      editor.update(() => {
        $convertFromMarkdownString(initialValue, CUSTOM_TRANSFORMERS);
      });
      setHasInitialized(true);
    }
  }, [editor, initialValue, hasInitialized]);
  return null;
}

// Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsSuperscript(selection.hasFormat("superscript"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format: import("lexical").TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="relative border-b p-2 flex gap-1 bg-gray-50">
      <button
        type="button"
        onClick={() => formatText("bold")}
        className={`px-3 py-1 rounded text-sm font-bold hover:bg-gray-200 ${isBold ? "bg-blue-200 text-blue-800" : "bg-white"}`}
        title="Bold (Ctrl+B)"
      >
        B
      </button>

      <button
        type="button"
        onClick={() => formatText("italic")}
        className={`px-3 py-1 rounded text-sm italic hover:bg-gray-200 ${isItalic ? "bg-blue-200 text-blue-800" : "bg-white"}`}
        title="Italic (Ctrl+I)"
      >
        I
      </button>

      <button
        type="button"
        onClick={() => formatText("underline")}
        className={`px-3 py-1 rounded text-sm underline hover:bg-gray-200 ${isUnderline ? "bg-blue-200 text-blue-800" : "bg-white"}`}
        title="Underline (Ctrl+U)"
      >
        U
      </button>

      <button
        type="button"
        onClick={() => formatText("superscript")}
        className={`px-3 py-1 rounded text-sm hover:bg-gray-200 ${isSuperscript ? "bg-blue-200 text-blue-800" : "bg-white"}`}
        title="Superscript"
      >
        X<sup>2</sup>
      </button>

      <div className="w-px bg-gray-300 mx-2"></div>

      <button
        type="button"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h1"));
            }
          });
        }}
        className="px-3 py-1 rounded text-sm font-bold hover:bg-gray-200 bg-white"
        title="Heading 1"
      >
        H1
      </button>

      <button
        type="button"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h2"));
            }
          });
        }}
        className="px-3 py-1 rounded text-sm font-bold hover:bg-gray-200 bg-white"
        title="Heading 2"
      >
        H2
      </button>

      <button
        type="button"
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h3"));
            }
          });
        }}
        className="px-3 py-1 rounded text-sm font-bold hover:bg-gray-200 bg-white"
        title="Heading 3"
      >
        H3
      </button>
    </div>
  );
}

interface RichTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichText({
  value,
  onChange,
  placeholder = "Nhập nội dung ....",
  className = "",
}: RichTextProps) {
  const [isFirstRender, setIsFirstRender] = useState(true);

  const initialConfig = {
    namespace: "RichTextEditor",
    theme: {
      paragraph: "mb-2",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        superscript: "align-super text-xs",
        subscript: "align-sub text-xs",
      },
      list: {
        nested: {
          listitem: "list-item",
        },
        ol: "list-decimal list-inside",
        ul: "list-disc list-inside",
      },
      heading: {
        h1: "text-2xl font-bold mb-2",
        h2: "text-xl font-bold mb-2",
        h3: "text-lg font-bold mb-2",
      },
    },
    onError: (error: Error) => {
      console.error("Lexical error:", error);
    },
  };
  const handleChange = (editorState: EditorState) => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    editorState.read(() => {
      const markdown = $convertToMarkdownString(CUSTOM_TRANSFORMERS);
      onChange(markdown);
    });
  };

  return (
    <div className={`border max-w-screen rounded overflow-hidden ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative">
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[150px] p-3 outline-none resize-none focus:bg-white"
                style={{ minHeight: "150px" }}
              />
            }
            // placeholder={
            //   <div className="absolute top-16 left-3 text-gray-400 pointer-events-none">
            //     {placeholder}
            //   </div>
            // }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <InitialValuePlugin initialValue={value} />
        </div>
      </LexicalComposer>
    </div>
  );
}
