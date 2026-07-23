import type { Metadata } from "next";
import { Suspense } from "react";
import ModelBrowser from "@/components/ModelBrowser";

export const metadata: Metadata = {
  title: "All models",
  description:
    "Browse every AI model in the directory — chat, open weights, images, video, audio — with plain-language strengths and weaknesses.",
};

export default function ModelsPage() {
  return (
    <Suspense>
      <ModelBrowser />
    </Suspense>
  );
}
