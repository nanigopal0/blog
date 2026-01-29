import { useEditorState } from "@tiptap/react";
import { ToolbarButton, ToolbarDropdown, DropdownItem } from "./ToolbarPrimitives.js";
import {
  ListIcon,
  OrderedListIcon,
  QuoteIcon,
  CodeBlockIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from "./ToolbarIcons.js";
import "../tiptap-node-css/code-block-node.scss";
import "../tiptap-node-css/blockquote-node.scss";
import "../tiptap-node-css/list-node.scss";


import TiptapImage from "./TiptapImage.js";
import TiptapLink from "./TiptapLink.js";
import type { InsertSectionProps, ToolbarSectionProps } from "../types/ToolbarSectionProps.js";


// Lists dropdown
export const ListsSection = ({ editor }: ToolbarSectionProps) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isBulletList: e?.isActive("bulletList") ?? false,
      isOrderedList: e?.isActive("orderedList") ?? false,
    }),
  });

  return (
    <ToolbarDropdown
      label="List"
      icon={<ListIcon />}
      isActive={state.isBulletList || state.isOrderedList}
    >
      <DropdownItem
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={state.isBulletList}
      >
        <ListIcon />
        Bullet List
      </DropdownItem>
      <DropdownItem
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={state.isOrderedList}
      >
        <OrderedListIcon />
        Numbered List
      </DropdownItem>
    </ToolbarDropdown>
  );
};

// Blockquote & Code Block buttons
export const BlocksSection = ({ editor } :ToolbarSectionProps) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isBlockquote: e?.isActive("blockquote") ?? false,
      isCodeBlock: e?.isActive("codeBlock") ?? false,
    }),
  });

  return (
    <div className="flex items-center">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={state.isBlockquote}
        title="Blockquote"
      >
        <QuoteIcon />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={state.isCodeBlock}
        title="Code Block"
      >
        <CodeBlockIcon />
      </ToolbarButton>
    </div>
  );
};

// Text alignment dropdown
export const AlignmentSection = ({ editor }:ToolbarSectionProps) => {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isLeft: e?.isActive({ textAlign: "left" }) ?? false,
      isCenter: e?.isActive({ textAlign: "center" }) ?? false,
      isRight: e?.isActive({ textAlign: "right" }) ?? false,
      isJustify: e?.isActive({ textAlign: "justify" }) ?? false,
    }),
  });

  return (
    <ToolbarDropdown 
      label="Align" 
      icon={<AlignLeftIcon />}
      isActive={state.isCenter || state.isRight || state.isJustify}
    >
      <DropdownItem
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={state.isLeft}
      >
        <AlignLeftIcon />
        Left
      </DropdownItem>
      <DropdownItem
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={state.isCenter}
      >
        <AlignCenterIcon />
        Center
      </DropdownItem>
      <DropdownItem
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={state.isRight}
      >
        <AlignRightIcon />
        Right
      </DropdownItem>
      <DropdownItem
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={state.isJustify}
      >
        <AlignJustifyIcon />
        Justify
      </DropdownItem>
    </ToolbarDropdown>
  );
};

// Re-export the components for easy access
export { TiptapImage as ImageInsert, TiptapLink as LinkInsert };



export const InsertSection = ({ editor, onComplete }: InsertSectionProps) => (
  <div className="flex items-center gap-0.5">
    <TiptapImage editor={editor} onComplete={onComplete ?? (() => {})} />
    <TiptapLink editor={editor} onComplete={onComplete ?? (() => {})} />
  </div>
);
