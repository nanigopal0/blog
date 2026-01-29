import { EditorContent, useEditor } from "@tiptap/react";
import { tiptapEditorExtension } from "./TiptapEditorExtension.js";
import EditorToolbar from "./EditorToolbar.js";

type InitEditorRef = {
  init: (editor: any) => void;
  initialContent?: string;
};

export default function CustomEditor({ init,initialContent }:InitEditorRef) {
  const editor = useEditor({
    extensions: tiptapEditorExtension,
    content: initialContent ? initialContent : "Write here..." ,
  });

  init(editor);

  return (
    // <EditorContext.Provider value={{ editor }}>
      <div className="mx-auto h-full w-full rounded-xl border border-slate-400">
        <EditorToolbar editor={editor} />

        <EditorContent
          editor={editor}
          className="
            tiptap min-h-100 
            border-t border-slate-400
             p-4 text-slate-800 rounded-b-xl
            focus-within:ring-2 focus-within:ring-purple-500/20
              dark:text-slate-100
          "
        />
      </div>
    // </EditorContext.Provider>
  );
}
