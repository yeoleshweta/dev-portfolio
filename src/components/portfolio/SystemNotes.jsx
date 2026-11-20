export function SystemNotes({ system }) {
  return (
    <details className="chapterArchitecture">
      <summary>
        <span>Inside the architecture</span>
        <span aria-hidden="true">+</span>
      </summary>
      <div className="chapterArchitectureBody">
        {system.nodes.map((node, index) => (
          <div key={node.title}>
            <small>0{index + 1}</small>
            <div>
              <strong>{node.title}</strong>
              <code>{node.technology}</code>
              <p>{node.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
