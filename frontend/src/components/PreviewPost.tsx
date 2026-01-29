import Dialog from "./Dialog";
import { EditorContent, useEditor, type Content } from "@tiptap/react";
import { tiptapEditorExtension } from "./tiptap/TiptapEditorExtension";

interface PreviewPostProps {
  jsonPost: Content;
  onClose: () => void;
}

export default function PreviewPost({ jsonPost, onClose }: PreviewPostProps) {
  const editor = useEditor({
    editable: false,
    extensions: tiptapEditorExtension,
    content: jsonPost,
  });
  
  return (
    <div>
      <Dialog title={"Preview"} onClose={onClose} isOpen={true}>
        {/* <TipTapRenderer content={jsonPost}/> */}
        <EditorContent
          editor={editor}
          className="tiptap w-full mx-auto lg:max-w-4/5"
        />
      </Dialog>
    </div>
  );
}
