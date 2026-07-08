import { Generator } from "@/components/Generator";
import { TOOLS } from "@/lib/tools";

export const metadata = { title: "Lesson Plan Generator — SuperSchool" };

export default function LessonPage() {
  return <Generator tool={TOOLS[0]} />;
}
