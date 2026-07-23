import Link from "next/link";
import {
  CATEGORY_COLORS,
  categoryEmoji,
  categoryLabel,
  type Model,
} from "@/lib/models";

export default function ModelCard({ model }: { model: Model }) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="card card-hover flex flex-col p-5"
      style={{ borderTopColor: CATEGORY_COLORS[model.category], borderTopWidth: 4 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold leading-tight">
            {model.name}
          </h3>
          <p className="text-xs font-semibold text-faint">{model.maker}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {model.status === "hot" && <span className="badge badge-hot">🔥 hot</span>}
          {model.status === "new" && <span className="badge badge-new">✨ new</span>}
          {model.status === "deprecated" && (
            <span className="badge badge-deprecated">💀 sunset</span>
          )}
          {model.openWeights && <span className="badge badge-open">open</span>}
        </div>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{model.tagline}</p>
      <p className="mt-auto pt-3 text-xs font-semibold text-faint">
        {categoryEmoji(model.category)} {categoryLabel(model.category)} ·{" "}
        {model.pricing}
      </p>
    </Link>
  );
}
