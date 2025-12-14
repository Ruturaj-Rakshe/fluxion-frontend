import { Suspense } from "react";
import PreviewPage from "./PreviewPage";


export default function PreviewClientPage() {
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <PreviewPage />
    </Suspense>
  );
}