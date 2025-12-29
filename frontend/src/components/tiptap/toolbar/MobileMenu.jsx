
import { ToolbarButton, ToolbarSection } from "./ToolbarPrimitives";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikeIcon,
  CodeIcon,
  SubscriptIcon,
  SuperscriptIcon,
  ListIcon,
  OrderedListIcon,
  QuoteIcon,
  CodeBlockIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from "./ToolbarIcons";
import { HIGHLIGHT_COLORS } from "./TextFormattingSections";
import { ImageInsert, LinkInsert } from "./BlockSections";
import "../tiptap-node-css/list-node.scss";
import "../tiptap-node-css/blockquote-node.scss";
import "../tiptap-node-css/code-block-node.scss";
import  "../tiptap-node-css/heading-node.scss";



export const MobileMenu = ({ editor, onClose }) => (
  
  <div
    className="
      absolute left-0 right-0 top-full z-50
      border border-t-0 border-slate-200 bg-white p-3 shadow-lg
      max-h-80 overflow-y-auto scrollbar-thin
      dark:border-slate-600 dark:bg-slate-800
    "
  >
    {/* Section: Text Formatting */}
    <ToolbarSection title="Text Formatting">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <BoldIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <ItalicIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <StrikeIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Inline Code"
      >
        <CodeIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={editor.isActive("subscript")}
        title="Subscript"
      >
        <SubscriptIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive("superscript")}
        title="Superscript"
      >
        <SuperscriptIcon />
      </ToolbarButton>
    </ToolbarSection>

    {/* Section: Headings */}
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Headings
      </p>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`
            rounded-md px-3 py-1.5 text-sm
            ${editor.isActive("paragraph") ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"}
          `}
        >
          P
        </button>
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level: level}).run()}
            className={`
              rounded-md px-3 py-1.5 text-sm font-bold
              ${editor.isActive("heading", { level }) ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"}
            `}
          >
            H{level}
          </button>
        ))}
      </div>
    </div>

    {/* Section: Highlight Colors */}
    <div className="mb-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Highlight
      </p>
      <div className="flex flex-wrap gap-2">
        {HIGHLIGHT_COLORS.map(({ color, name }) => (
          <button
            key={color}
            onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
            title={name}
            className={`
              h-8 w-8 rounded-full border-2 transition-transform
              ${editor.isActive("highlight", { color })
                ? "border-slate-800 scale-110"
                : "border-transparent hover:scale-105"
              }
            `}
            style={{ backgroundColor: color }}
          />
        ))}
        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          title="Remove highlight"
          className="h-8 w-8 rounded-full border-2 border-slate-300 bg-white text-xs"
        >
          ✕
        </button>
      </div>
    </div>

    {/* Section: Lists & Blocks */}
    <ToolbarSection title="Lists & Blocks">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <ListIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <OrderedListIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <QuoteIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <CodeBlockIcon />
      </ToolbarButton>
    </ToolbarSection>

    {/* Section: Alignment */}
    <ToolbarSection title="Alignment">
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeftIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenterIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRightIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustifyIcon />
      </ToolbarButton>
    </ToolbarSection>

    {/* Section: Insert */}
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Insert
      </p>
      <div className="flex flex-wrap gap-2">
        <ImageInsert editor={editor} onComplete={onClose} />
        <LinkInsert editor={editor} onComplete={onClose} />
      </div>
    </div>
  </div>
);
