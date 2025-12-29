
import { useEditorState } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";

// Import from modular toolbar components
import { MenuIcon, CloseIcon, BoldIcon, ItalicIcon, UndoIcon, RedoIcon } from "./toolbar/ToolbarIcons";
import { ToolbarButton, ToolbarDivider } from "./toolbar/ToolbarPrimitives";
import {
  UndoRedoSection,
  HeadingsSection,
  TextFormattingSection,
  HighlightSection,
  ScriptSection,
} from "./toolbar/TextFormattingSections";
import {
  ListsSection,
  BlocksSection,
  AlignmentSection,
  InsertSection,
} from "./toolbar/BlockSections";
import { MobileMenu } from "./toolbar/MobileMenu";

// interface EditorToolbarProps {
//   editor: Editor | null;
// }

export default function EditorToolbar({ editor }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Subscribe to editor state changes to update active states
  const editorState = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isBold: e?.isActive("bold") ?? false,
      isItalic: e?.isActive("italic") ?? false,
      isUnderline: e?.isActive("underline") ?? false,
      isStrike: e?.isActive("strike") ?? false,
      isCode: e?.isActive("code") ?? false,
      isSubscript: e?.isActive("subscript") ?? false,
      isSuperscript: e?.isActive("superscript") ?? false,
      isHighlight: e?.isActive("highlight") ?? false,
      isBulletList: e?.isActive("bulletList") ?? false,
      isOrderedList: e?.isActive("orderedList") ?? false,
      isBlockquote: e?.isActive("blockquote") ?? false,
      isCodeBlock: e?.isActive("codeBlock") ?? false,
      isLink: e?.isActive("link") ?? false,
      isHeading: e?.isActive("heading") ?? false,
      headingLevel: e?.isActive("heading", { level: 1 }) ? 1 
        : e?.isActive("heading", { level: 2 }) ? 2 
        : e?.isActive("heading", { level: 3 }) ? 3 
        : 0,
      textAlign: e?.isActive({ textAlign: "left" }) ? "left"
        : e?.isActive({ textAlign: "center" }) ? "center"
        : e?.isActive({ textAlign: "right" }) ? "right"
        : e?.isActive({ textAlign: "justify" }) ? "justify"
        : "left",
      canUndo: e?.can().undo() ?? false,
      canRedo: e?.can().redo() ?? false,
    }),
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  return (
    <div className="relative" ref={mobileMenuRef}>
      {/* Desktop Toolbar */}
      <div
        className="
          hidden md:flex flex-wrap items-center gap-1
           p-2 rounded-t-xl
           dark:bg-slate-800
        "
      >
        <UndoRedoSection editor={editor} />
        <ToolbarDivider />
        <HeadingsSection editor={editor} />
        <ToolbarDivider />
        <TextFormattingSection editor={editor} />
        <ToolbarDivider />
        <HighlightSection editor={editor} />
        <ScriptSection editor={editor} />
        <ToolbarDivider />
        <ListsSection editor={editor} />
        <BlocksSection editor={editor} />
        <ToolbarDivider />
        <AlignmentSection editor={editor} />
        <ToolbarDivider />
        <InsertSection editor={editor} />
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden">
        {/* Mobile Header Bar */}
        <div
          className="
            flex items-center justify-between
            rounded-t-xl border border-b-0 border-slate-200 bg-slate-50 p-2
            dark:border-slate-600 dark:bg-slate-800
          "
        >
          {/* Quick Actions (always visible on mobile) */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editorState?.isBold ?? false}
              title="Bold"
            >
              <BoldIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editorState?.isItalic ?? false}
              title="Italic"
            >
              <ItalicIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!(editorState?.canUndo ?? false)}
              title="Undo"
            >
              <UndoIcon />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!(editorState?.canRedo ?? false)}
              title="Redo"
            >
              <RedoIcon />
            </ToolbarButton>
          </div>

          {/* Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="
              inline-flex items-center gap-1 rounded-md px-3 py-2
              text-slate-600 hover:bg-slate-100
              dark:text-slate-300 dark:hover:bg-slate-700
              transition-colors duration-150
            "
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            <span className="text-sm">More</span>
          </button>
        </div>

        {/* Mobile Expanded Menu */}
        {mobileMenuOpen && (
          <MobileMenu editor={editor} onClose={() => setMobileMenuOpen(false)} />
        )}
      </div>
    </div>
  );
}
