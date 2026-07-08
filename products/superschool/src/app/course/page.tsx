import { Generator } from "@/components/Generator";
import { TOOLS } from "@/lib/tools";

export const metadata = { title: "Course Builder — SuperSchool" };

export default function CoursePage() {
  return <Generator tool={TOOLS[1]} />;
}
