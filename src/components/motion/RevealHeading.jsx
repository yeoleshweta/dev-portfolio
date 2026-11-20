export function RevealHeading({ as: Tag = "h2", lines, italic = -1, id, className = "", intro = false }) {
  return (
    <Tag id={id} className={`motionHeading ${intro ? "introHeading" : ""} ${className}`} data-reveal={intro ? undefined : "heading"} aria-label={lines.join(" ")}>
      {lines.map((line, index) => (
        <span className="motionLine" aria-hidden="true" key={line} style={{ "--line-index": index }}>
          <span>{index === italic ? <em>{line}</em> : line}</span>
        </span>
      ))}
    </Tag>
  );
}
