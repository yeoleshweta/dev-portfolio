// Facts checked against the bundled résumé and the linked public repositories.
// Keep architecture diagrams descriptive; they are not live model demonstrations.
export const systems = [
  {
    id: "bias-checker",
    name: "Bias Checker",
    category: "Healthcare · Applied AI",
    status: "Full-stack build",
    title: "A prediction needs an explanation.",
    summary:
      "A healthcare bias-detection system that connects a fine-tuned classifier to an interface people can examine.",
    ownership: "Solo build · model, API, interface",
    repository: "https://github.com/yeoleshweta/Bias-Checker-Healthcare",
    stack: ["Next.js", "Flask", "RoBERTa + LoRA", "GPT-4o", "Hugging Face"],
    evidence: "Model + API + interface",
    evidenceLabel: "One end-to-end implementation",
    nodes: [
      {
        title: "Clinical vignette",
        layer: "01 / INTERFACE",
        technology: "Next.js",
        detail:
          "The web interface brings a clinical vignette into the assessment workflow and gives the model output a readable place to land.",
      },
      {
        title: "Classify the bias",
        layer: "02 / INFERENCE",
        technology: "RoBERTa + LoRA",
        detail:
          "A fine-tuned RoBERTa classifier with LoRA adapters identifies medical bias categories. The taxonomy provides the categories the system is designed to recognize.",
      },
      {
        title: "Explain the finding",
        layer: "03 / INTERPRETATION",
        technology: "GPT-4o · few-shot prompts",
        detail:
          "A separate language-model layer provides explanations alongside the classification. Detection and explanation have distinct responsibilities in the pipeline.",
      },
      {
        title: "Serve the system",
        layer: "04 / DELIVERY",
        technology: "Flask · Hugging Face Spaces",
        detail:
          "A Flask API serves classification and explanation to the frontend. The repository documents a Docker deployment on Hugging Face Spaces.",
      },
    ],
    decision:
      "Separate the classifier from its explanation layer, so a label has context people can inspect.",
  },
  {
    id: "gesturepro",
    name: "GesturePro",
    category: "Computer vision · Interaction",
    status: "Capstone prototype",
    title: "Keep the person in the loop.",
    summary:
      "A webcam-to-text prototype with a correction step built into the experience. Recognition is useful only when the signer stays in control.",
    ownership: "UX lead · landmark pipeline · classifier",
    repository: "https://github.com/yeoleshweta/gesturepro",
    caseStudy: "/work/gesturepro/",
    stack: ["Next.js", "FastAPI", "MediaPipe", "TensorFlow"],
    evidence: "21 landmarks · 6 participants",
    evidenceLabel: "Input representation + usability testing",
    nodes: [
      {
        title: "Capture a gesture",
        layer: "01 / INPUT",
        technology: "Webcam · browser",
        detail:
          "The interaction starts with a standard webcam. The prototype is designed for composing short messages from hand signs.",
      },
      {
        title: "Find the landmarks",
        layer: "02 / REPRESENTATION",
        technology: "MediaPipe",
        detail:
          "Twenty-one hand landmarks represent each frame. I built the landmark pipeline that connects the gesture to the classification step.",
      },
      {
        title: "Predict a sign",
        layer: "03 / MODEL",
        technology: "TensorFlow · FastAPI",
        detail:
          "The classifier and prediction service connect the hand representation to the browser. This was part of a four-person capstone.",
      },
      {
        title: "Edit the message",
        layer: "04 / HUMAN CONTROL",
        technology: "Next.js · usability testing",
        detail:
          "The signer can correct predicted text before using it. Six participants took part in usability testing, keeping the interaction grounded in how people use it.",
      },
    ],
    decision:
      "Treat correction as part of the primary interaction, rather than assuming every prediction is right.",
  },
  {
    id: "pocketsaver",
    name: "PocketSaver",
    category: "Web application · Data",
    status: "Public repository",
    title: "Follow the request all the way through.",
    summary:
      "A finance application with a web frontend, backend API, PostgreSQL database, and a separate Python forecast service.",
    ownership: "Full-stack project",
    repository: "https://github.com/yeoleshweta/PocketSaver",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Python", "Docker"],
    evidence: "Web + API + data + forecast",
    evidenceLabel: "Architecture documented in the repository",
    nodes: [
      {
        title: "Make a request",
        layer: "01 / CLIENT",
        technology: "Next.js",
        detail:
          "The web frontend connects to a configurable backend API. The repository includes separate frontend and backend applications.",
      },
      {
        title: "Route the request",
        layer: "02 / API",
        technology: "Node.js · /api/forecast",
        detail:
          "The backend exposes registration, health, and forecast endpoints. Forecast requests are proxied to the Python service.",
      },
      {
        title: "Keep the data",
        layer: "03 / PERSISTENCE",
        technology: "PostgreSQL · Docker",
        detail:
          "PostgreSQL is configured alongside the frontend and backend in Docker Compose. Each service has its own responsibility.",
      },
      {
        title: "Generate a forecast",
        layer: "04 / PYTHON SERVICE",
        technology: "Python · /predict",
        detail:
          "A dedicated forecast service exposes a prediction endpoint. The setup guide explicitly documents that this service starts separately from the Compose web stack.",
      },
    ],
    decision:
      "Make service boundaries and startup dependencies explicit, including the separately running forecast service.",
  },
];

export const archive = [
  {
    title: "CentralPerk",
    type: "In development",
    description:
      "A personal multi-agent system exploring agent handoffs and making completed versus deferred work visible.",
    stack: "LangGraph / FastAPI / React",
    href: null,
  },
  {
    title: "Self-serve survey platform",
    type: "John Deere · Research operations",
    description:
      "A survey platform designed for 250+ internal products, reducing setup time by 60%.",
    stack: "Information architecture / Research / Figma",
    href: null,
  },
  {
    title: "Clinical Communication",
    type: "ABIM · Supervised NLP",
    description:
      "Annotated dialogue and communication frameworks give reviewers a shared vocabulary for model output.",
    stack: "Python / NLP / Label Studio",
    href: "/work/clinical-communication/",
  },
];
