import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { tiptapEditorExtension } from "./TiptapEditorExtension";
import EditorToolbar from "./EditorToolbar";


export default function CustomEditor({ init }) {
  const editor = useEditor({
    extensions: tiptapEditorExtension,
    content: "Write here...",
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
