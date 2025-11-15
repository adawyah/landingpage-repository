import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef, useMemo } from "react";

// PDF.js worker
import workerSrc from "pdfjs-dist/build/pdf.worker.min?url";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer({ fileId }) {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef();

  if (!fileId) return <p>No PDF selected.</p>;

  const pdfUrl = `/api/files/${fileId}/stream`;

  // Memoize the file object so React-PDF doesn't reload unnecessarily
  const pdfFile = useMemo(() => ({
    url: pdfUrl,
    httpHeaders: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }), [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // Responsive width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth - 20);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        backgroundColor: "#f0f0f0",
        padding: "10px",
      }}
    >
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={pageWidth}
            renderTextLayer={false}
            renderAnnotationLayer={true}
          />
        ))}
      </Document>
    </div>
  );
}
