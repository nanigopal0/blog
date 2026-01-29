import { Editor } from '@tiptap/core';

export interface ToolbarSectionProps {
  editor: Editor;
}

// Insert Section with Image & Link components
export interface InsertSectionProps extends ToolbarSectionProps {
  onComplete?: () => void;
}