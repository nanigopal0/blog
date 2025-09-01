import TipTapRenderer from "@/util/TipTapRenderer";
import Dialog from "./Dialog";

export default function PreviewPost({ jsonPost, onClose }) {

  return (
    <div>
      <Dialog title={"Preview"} onClose={onClose} isOpen={true}>
        <TipTapRenderer content={jsonPost}/>
      </Dialog>
    </div>
  );
}
