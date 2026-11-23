"use client";

const skillGroups = [
  {
    num: "01",
    category: "Frontend & Fullstack",
    focus: "Interfaces, APIs & persistence",
    items: [
      "React",
      "Next.js",
      "JavaScript",
      "Tailwind CSS",
      "HTML5 / CSS3",
      "Node.js",
      "FastAPI",
      "Flask",
      "PostgreSQL",
      "Docker",
      "Storybook",
      "Git",
    ],
  },
  {
    num: "02",
    category: "Applied AI & ML",
    focus: "Modeling, NLP & evaluation",
    items: [
      "Python",
      "RoBERTa + LoRA",
      "BERT",
      "TensorFlow",
      "MediaPipe",
      "LangGraph",
      "GPT-4o",
      "Label Studio",
      "LLM Evaluation",
      "Annotation Taxonomy",
      "IRR Protocols",
      "AI Bias Detection",
    ],
  },
  {
    num: "03",
    category: "Product & Systems Design",
    focus: "Design systems & interaction",
    items: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Design Systems",
      "Atomic Design",
      "Interaction Design",
      "Information Architecture",
      "Prototyping",
      "Accessibility (WCAG 2.1)",
      "Responsive Design",
    ],
  },
  {
    num: "04",
    category: "Research & Analytics",
    focus: "Discovery & quantitative proof",
    items: [
      "Usability Testing",
      "Contextual Inquiry",
      "A/B Testing",
      "Behavioral Analytics",
      "Hotjar",
      "FullStory",
      "Google Analytics",
      "Amplitude",
      "Dovetail",
      "SQL",
      "Tableau",
      "Power BI",
    ],
  },
];

export function SkillsMatrix() {
  return (
    <section
      id="skills"
      className="skillsSection atelierWrap"
      aria-labelledby="skills-title"
    >
      <div className="skillsHeader" data-reveal>
        <div>
          <span className="chapterMarker">SKILLS &amp; TOOLKIT</span>
          <h2 id="skills-title" className="skillsHeading">
            The working <em>stack.</em>
          </h2>
        </div>
        <p className="sectionSideCopy">
          Languages, frameworks, ML evaluation workflows, and design tools used
          in production across healthcare AI, enterprise research, and
          consumer web products.
        </p>
      </div>

      <div className="skillsGrid" data-reveal>
        {skillGroups.map((group) => (
          <div className="skillCol" key={group.num}>
            <div className="skillColTop">
              <span>{group.num}</span>
              <small>{group.focus}</small>
            </div>
            <h3>{group.category}</h3>
            <ul className="skillTagList">
              {group.items.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
