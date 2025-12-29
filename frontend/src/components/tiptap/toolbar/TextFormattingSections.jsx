
import { useEditorState } from "@tiptap/react";
import { ToolbarButton, ToolbarDropdown, DropdownItem } from "./ToolbarPrimitives";
import {
  UndoIcon,
  RedoIcon,
  HeadingIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikeIcon,
  CodeIcon,
  HighlightIcon,
  SubscriptIcon,
  SuperscriptIcon,
} from "./ToolbarIcons";
import  "../tiptap-node-css/heading-node.scss";


// Undo/Redo section
export const UndoRedoSection = ({ editor }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      canUndo: e?.can().undo() ?? false,
      canRedo: e?.can().redo() ?? false,
    }),
  });

  return (
    <div className="flex items-center">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
        title="Undo"
      >
        <UndoIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
        title="Redo"
      >
        <RedoIcon />
      </ToolbarButton>
    </div>
  );
};

// Headings dropdown
export const HeadingsSection = ({ editor }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isHeading: e?.isActive("heading") ?? false,
      isParagraph: e?.isActive("paragraph") ?? false,
      isH1: e?.isActive("heading", { level: 1 }) ?? false,
      isH2: e?.isActive("heading", { level: 2 }) ?? false,
      isH3: e?.isActive("heading", { level: 3 }) ?? false,
    }),
  });

  return (
    <ToolbarDropdown
      label="Heading"
      icon={<HeadingIcon />}
      isActive={state.isHeading}
    >
      <DropdownItem
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={state.isParagraph}
      >
        Paragraph
      </DropdownItem>
      <DropdownItem
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={state.isH1}
      >
        <span className="text-lg font-bold">Heading 1</span>
      </DropdownItem>
      <DropdownItem
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={state.isH2}
      >
        <span className="text-base font-bold">Heading 2</span>
      </DropdownItem>
      <DropdownItem
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={state.isH3}
      >
        <span className="text-sm font-bold">Heading 3</span>
      </DropdownItem>
    </ToolbarDropdown>
  );
};

// Text formatting buttons (Bold, Italic, Underline, Strike, Code)
export const TextFormattingSection = ({ editor }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isBold: e?.isActive("bold") ?? false,
      isItalic: e?.isActive("italic") ?? false,
      isUnderline: e?.isActive("underline") ?? false,
      isStrike: e?.isActive("strike") ?? false,
      isCode: e?.isActive("code") ?? false,
    }),
  });

  return (
    <div className="flex items-center">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={state.isBold}
        title="Bold"
      >
        <BoldIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={state.isItalic}
        title="Italic"
      >
        <ItalicIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={state.isUnderline}
        title="Underline"
      >
        <UnderlineIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={state.isStrike}
        title="Strikethrough"
      >
        <StrikeIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={state.isCode}
        title="Inline Code"
      >
        <CodeIcon />
      </ToolbarButton>
    </div>
  );
};

// Highlight colors dropdown
const HIGHLIGHT_COLORS = [
  { color: "#ff922b", name: "Orange" },
  { color: "#40c057", name: "Green" },
  { color: "#339af0", name: "Blue" },
  { color: "#845ef7", name: "Purple" },
  { color: "#ff6b6b", name: "Red" },
];

export const HighlightSection = ({ editor }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isHighlight: e?.isActive("highlight") ?? false,
      activeColors: HIGHLIGHT_COLORS.map(({ color }) => ({
        color,
        isActive: e?.isActive("highlight", { color }) ?? false,
      })),
    }),
  });

  return (
    <ToolbarDropdown
      label="Highlight"
      icon={<HighlightIcon />}
      isActive={state.isHighlight}
    >
      {HIGHLIGHT_COLORS.map(({ color, name }, index) => (
        <DropdownItem
          key={color}
          onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
          isActive={state.activeColors[index]?.isActive}
        >
          <span className="h-4 w-4 rounded" style={{ backgroundColor: color }} />
          {name}
        </DropdownItem>
      ))}
      <DropdownItem onClick={() => editor.chain().focus().unsetHighlight().run()}>
        <span className="h-4 w-4 rounded border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700" />
        Remove
      </DropdownItem>
    </ToolbarDropdown>
  );
};

// Subscript/Superscript buttons
export const ScriptSection = ({ editor }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isSubscript: e?.isActive("subscript") ?? false,
      isSuperscript: e?.isActive("superscript") ?? false,
    }),
  });

  return (
    <div className="flex items-center">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={state.isSubscript}
        title="Subscript"
      >
        <SubscriptIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={state.isSuperscript}
        title="Superscript"
      >
        <SuperscriptIcon />
      </ToolbarButton>
    </div>
  );
};

// Export highlight colors for use in mobile menu
export { HIGHLIGHT_COLORS };
