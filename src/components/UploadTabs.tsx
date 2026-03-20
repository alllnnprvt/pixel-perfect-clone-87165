import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface UploadTabsProps {
  onContentReady: (text: string) => void;
}

const tabs = [
  { id: "text", label: "Type Text" },
  { id: "pdf", label: "Upload PDF" },
  { id: "markdown", label: "Paste Markdown" },
] as const;

const UploadTabs = ({ onContentReady }: UploadTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [text, setText] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfLoading(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      setText(fullText.trim());
      onContentReady(fullText.trim());
    } catch (err) {
      console.error("PDF extraction failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleTextChange = (value: string) => {
    setText(value);
    onContentReady(value);
  };

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "text" && (
        <Textarea
          placeholder="Type or paste your study notes here..."
          className="min-h-[250px] rounded-2xl text-base resize-none"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
      )}

      {activeTab === "pdf" && (
        <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center">
          {pdfLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              <p className="text-muted-foreground">Extracting text from PDF...</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">Upload a PDF file to extract notes</p>
              <Input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="max-w-xs mx-auto"
              />
            </>
          )}
        </div>
      )}

      {activeTab === "markdown" && (
        <Textarea
          placeholder="Paste your Markdown notes here..."
          className="min-h-[250px] rounded-2xl text-base resize-none font-mono"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default UploadTabs;
