export const profile = {
  name: "Shweta Sharma",
  title: "Fullstack Dev",
  location: "Philadelphia, PA",
  email: "shwetayeolesharma@gmail.com",
  linkedin: "https://www.linkedin.com/in/sharmashweta08",
  resume: "/shweta-sharma-resume.pdf",
  interests:
    "I’m looking for fullstack developer roles where I can own a feature from its interface to its API. I’m especially drawn to products where good interaction design makes data or machine learning easier to use.",
};

export const projects = [
  {
    slug: "gesturepro",
    name: "GesturePro",
    field: "Applied ML",
    image: "/gesturepro.jpg",
    alt: "GesturePro project artwork",
    headline: "A webcam, a hand, and a message.",
    summary:
      "A browser prototype that recognizes hand signs and gives the signer control over the text.",
    role: "UX lead and ML engineer",
    context: "Four-person capstone",
    stack: ["Next.js", "FastAPI", "MediaPipe", "TensorFlow"],
    question:
      "How can someone use a webcam to compose a short message when the model can misread a gesture?",
    contribution:
      "I led research and interaction design and built the hand-landmark pipeline and classifier. The browser experience turns camera input into editable text. Keeping the signer in charge of the message shaped the interaction design.",
    result:
      "The prototype reads 21 hand landmarks per frame using a standard webcam. Six participants took part in usability testing. The work focused on short exchanges and left room for a person to correct a prediction.",
  },
  {
    slug: "urbanfit",
    name: "Urbanfit Control Panel",
    field: "Product design",
    image: "/urbanfit.jpg",
    alt: "Urbanfit admin dashboard showing sales and franchise inventory",
    headline: "One inventory system, three perspectives.",
    summary:
      "A desktop workspace for the people who move, price, and sell stock across franchise locations.",
    role: "UI/UX designer",
    context: "Urbanfit Wellness",
    stack: ["Figma", "Interaction design", "Design systems"],
    question:
      "How can administrators, warehouse teams, and franchise shops use the same product when each needs a different view of stock?",
    contribution:
      "I designed role-specific dashboards around a common navigation model. Stock status, pricing, permissions, and table actions follow the same patterns across the three views.",
    result:
      "The Figma prototype spans 30 screens and 484 interactions. Its shared components gave the team a consistent reference for inventory, reports, and branch operations.",
  },
  {
    slug: "clinical-communication",
    name: "Clinical Communication",
    field: "Applied ML",
    image: "/abim.jpg",
    alt: "Clinical communication assessment project cover",
    headline: "Making clinical dialogue measurable.",
    summary:
      "A supervised NLP workflow for finding communication behaviors in doctor and patient conversations.",
    role: "Data analyst co-op",
    context: "American Board of Internal Medicine",
    stack: ["Python", "NLP", "Label Studio"],
    question:
      "How can reviewers identify specific communication behaviors across a collection of clinical conversations?",
    contribution:
      "I used Label Studio to build a reference set of annotated dialogues and trained a supervised NLP model to identify behaviors described by established communication frameworks.",
    result:
      "The workflow connects model output to named behaviors in frameworks such as Calgary-Cambridge and NURSE, giving reviewers a common vocabulary for examining a prediction.",
  },
];
export const experience = [
  [
    "2025",
    "American Board of Internal Medicine",
    "Data Analyst Co-op, Data Science",
    "Built clinical NLP pipelines and evaluated language models on SQL generation tasks.",
  ],
  [
    "2025",
    "Drexel University",
    "Course Assistant",
    "Supported graduate AI and machine learning coursework through labs, office hours, and assignment guidance.",
  ],
  [
    "2022 to 2024",
    "John Deere",
    "Senior Technical Lead, Research",
    "Established a UX research practice in India and helped six product teams connect behavioral research to product decisions.",
  ],
  [
    "2021 to 2022",
    "Urbanfit Wellness",
    "UI/UX Designer",
    "Designed wellness and retail experiences, including a franchise operations dashboard and the Poshmera mobile app.",
  ],
  [
    "2018 to 2022",
    "Capita, for Arcadia Group",
    "UX Personalization Designer",
    "Designed shopping experiences for seven retail brands using customer segments and behavioral signals.",
  ],
];
export const capabilities = [
  [
    "Web applications",
    "React, Next.js, JavaScript",
    "Interfaces for real-time input, editable predictions, and role-specific workflows.",
  ],
  [
    "APIs and models",
    "Python, FastAPI, TensorFlow, MediaPipe",
    "Prediction services that connect a model to a browser interface.",
  ],
  [
    "Evaluation and design",
    "Label Studio, Figma, usability testing",
    "Annotated reference data and hands-on testing to understand where a product falls short.",
  ],
];
