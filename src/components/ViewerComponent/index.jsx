"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import PageLoading from "../Loading/PageLoading";
import BackPage from "@/assets/images/svg/backPage.svg";
import Button from "../Button";
import { useEffect } from "react";
import axios from "axios";

export default function ViewerComponent({ notesId, pdfUrl, showPdf, setShowPdf, loading }) {

  const noteView = async () => {
    if (!showPdf) {
      return;
    }
    try {
      await axios.get(`/api/notes/${notesId}/view`);
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error(error.message);
    }
  };

  useEffect(() => {
    noteView()
  }, [showPdf])

  if (loading) {
    return <PageLoading />;
  }
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs">
      <Button
        icon={BackPage}
        iconPosition="left"
        className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border  rounded btn-sm"
        onClick={() => setShowPdf(false)}
      />
      <div
        className="rajat mt-2"
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          height: "750px",
          overflow: "auto"
        }}
      >
        <Viewer fileUrl={pdfUrl} />
      </div>
    </Worker>
  );
}

// "use client";

// import dynamic from "next/dynamic";
// import PageLoading from "../Loading/PageLoading";
// import BackPage from "@/assets/images/svg/backPage.svg";
// import Button from "../Button";
// import { useEffect } from "react";
// import axios from "axios";

// // Dynamically import Viewer and Worker with SSR disabled
// const Viewer = dynamic(
//   () =>
//     import("@react-pdf-viewer/core").then((mod) => mod.Viewer),
//   { ssr: false }
// );

// const Worker = dynamic(
//   () =>
//     import("@react-pdf-viewer/core").then((mod) => mod.Worker),
//   { ssr: false }
// );

// export default function ViewerComponent({ notesId, pdfUrl, showPdf, setShowPdf, loading }) {

//   const noteView = async () => {
//     if (!showPdf) {
//       return;
//     }
//     try {
//       await axios.get(`/api/notes/${notesId}/view`);
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         return router.push("/login");
//       }
//       console.error(error.message);
//     }
//   };

//   useEffect(() => {
//     noteView();
//   }, [showPdf]);

//   if (loading) {
//     return <PageLoading />;
//   }

//   return (
//     <Worker workerUrl="https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs">
//       <Button
//         icon={BackPage}
//         iconPosition="left"
//         className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border rounded btn-sm"
//         onClick={() => setShowPdf(false)}
//       />
//       <div
//         className="rajat mt-2"
//         style={{
//           border: "1px solid rgba(0, 0, 0, 0.3)",
//           height: "750px",
//           overflow: "auto"
//         }}
//       >
//         {pdfUrl && <Viewer fileUrl={pdfUrl} />}
//       </div>
//     </Worker>
//   );
// }

