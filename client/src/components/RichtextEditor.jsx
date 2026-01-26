import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

function RichtextEditor({ input, setInput }) {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: "Write course description here...",
  });

  useEffect(() => {
    if (!quill) return;

    if (input?.description) {
      quill.clipboard.dangerouslyPasteHTML(input.description);
    }

    quill.on("text-change", () => {
      setInput((prev) => ({
        ...prev,
        description: quill.root.innerHTML,
      }));
    });
  }, [quill]);

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div ref={quillRef} />
    </div>
  );
}

export default RichtextEditor;
