import { Generator } from "@/components/Generator";
import { TOOLS } from "@/lib/tools";

export const metadata = { title: "Worksheet Maker — SuperSchool" };

export default function WorksheetPage() {
  return <Generator tool={TOOLS[2]} />;
}
