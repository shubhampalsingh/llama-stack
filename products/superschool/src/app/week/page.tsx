import { Generator } from "@/components/Generator";
import { TOOLS } from "@/lib/tools";

export const metadata = { title: "Homeschool Week Planner — SuperSchool" };

export default function WeekPage() {
  return <Generator tool={TOOLS[3]} />;
}
