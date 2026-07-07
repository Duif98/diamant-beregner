"use client";

export default function Pills({ defs, value, onToggle, variant }) {
  return (
    <div className="pill-wrap">
      {defs.map((d) => (
        <button
          key={d.key}
          type="button"
          className={`pill${variant ? " " + variant : ""}${value[d.key] ? " on" : ""}`}
          onClick={() => onToggle(d.key)}
          aria-pressed={!!value[d.key]}
        >
          <span className="dot" />
          {d.label}
          {d.tag && <span className="tag">{d.tag}</span>}
        </button>
      ))}
    </div>
  );
}
