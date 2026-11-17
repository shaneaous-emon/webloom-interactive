// All copy is kept from the original Webloom Interactive site.

export const nav = [
  { label: "Work", href: "/work", num: "01" },
  { label: "Expertise", href: "/services", num: "02" },
  { label: "Studio", href: "/about", num: "03" },
];

export const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Three.js / R3F",
  "GSAP",
  "Motion",
  "Lenis",
  "anime.js",
  "Chart.js",
];

export const hero = {
  eyebrow: "Independent minds. Interactive worlds.",
  lines: ["Good websites", "get seen."],
  accent: ["Great ones", "get felt."],
  body: "We bring brands to life through expressive design, creative code, and a little unexpected interaction.",
  cta: "Explore our world",
  experiment: "W / Experiment 001",
  hint: "Move your cursor. See what happens.",
  scroll: "Scroll to discover",
  tagline: "Design × Technology × Feeling",
};

export const statement = {
  label: "01 / Our point of view",
  text: "The internet has enough ordinary. We build digital experiences that make people stop, explore, and feel something.",
  sub: ["Independent thinking.", "One shared obsession: the experience."],
};

export const services = {
  label: "02 / What we bring",
  title: ["Creative ambition.", "Technical precision."],
  intro: ["Designers who think in code.", "Developers who care about design.", "Good things happen in the overlap."],
  hint: "Keep scrolling to explore our expertise",
  items: [
    {
      num: "01",
      title: ["Digital", "experiences"],
      body: "A website can do more than tell your story. It can let people step inside it.",
      tags: ["Creative direction", "Experience design", "Interactive websites"],
    },
    {
      num: "02",
      title: ["Creative", "technology"],
      body: "Impossible in the brief. Interesting in the browser. We like that part.",
      tags: ["WebGL & Three.js", "Scroll choreography", "Generative systems"],
    },
    {
      num: "03",
      title: ["Motion", "with meaning"],
      body: "The details that guide a hand, explain an idea, and make an interface feel alive.",
      tags: ["Motion systems", "Micro-interactions", "Interface development"],
    },
    {
      num: "04",
      title: ["Built to", "keep growing"],
      body: "Expressive on the surface. Accessible, fast, and thoughtfully engineered underneath.",
      tags: ["Headless CMS", "Commerce & platforms", "Performance & accessibility"],
    },
  ],
};

export const playground = {
  label: "03 / Less explaining. More playing.",
  title: ["Don’t just take", "our word for it."],
  intro: ["This is our playground.", "Pick a tool. Try an interaction.", "Imagine what we could make for you."],
  heading: "A new dimension.",
  sub: "Interactive 3D, made for the browser.",
  live: "Live experiment",
  tools: [
    { id: "three", num: "01", name: "Three.js", kicker: "Real-time 3D", hint: "Drag the sculpture to rotate it. Use the slider to change its shape." },
    { id: "gsap", num: "02", name: "GSAP", kicker: "Scroll choreography", hint: "Scrub the timeline to choreograph the composition." },
    { id: "motion", num: "03", name: "Motion", kicker: "Interface physics", hint: "Drag the shapes. Switch layouts. Feel how the interface responds." },
    { id: "lenis", num: "04", name: "Lenis", kicker: "Smooth scrolling", hint: "Scroll inside the framed landscape. Adjust the smoothing." },
    { id: "anime", num: "05", name: "anime.js", kicker: "SVG & micro-motion", hint: "Replay the sequence to watch a line become a system." },
    { id: "chart", num: "06", name: "Chart.js", kicker: "Data storytelling", hint: "Select a chart type to see the same sample data from a new angle." },
  ] as const,
};

export type ToolId = (typeof playground.tools)[number]["id"];

export type Project = {
  slug: string;
  name: string;
  tagline: string[];
  sector: string;
  index: string;
  type: string;
  year: string;
  category: "Websites" | "Commerce" | "Products";
  image: string;
  heroTitle: string;
  summary: string;
  challenge: string;
  approach: string;
  concept: string;
  next: string;
};

export const projects: Project[] = [
  {
    slug: "shoreline",
    name: "Shoreline",
    tagline: ["Closer to the", "extraordinary."],
    sector: "Architecture & lifestyle",
    index: "Studio concept / 01",
    type: "Digital experience",
    year: "2026",
    category: "Websites",
    image: "/images/architecture.webp",
    heroTitle: "A different perspective on coastal living.",
    summary:
      "A concept for a considered coastal destination, told through sculptural architecture, open space and a slow, cinematic browsing rhythm.",
    challenge: "Translate the stillness of a place into a website that rewards exploration.",
    approach:
      "A restrained editorial layout, a tactile project explorer and fluid image transitions bring the architecture into focus.",
    concept: "An interactive concept that connects a strong point of view with a clear path to inquiry.",
    next: "minto",
  },
  {
    slug: "minto",
    name: "Minto",
    tagline: ["A little outside", "the ordinary."],
    sector: "Culture & independent publishing",
    index: "Studio concept / 02",
    type: "Brand & commerce",
    year: "2026",
    category: "Commerce",
    image: "/images/culture.webp",
    heroTitle: "Fresh energy. A new kind of culture.",
    summary:
      "An expressive commerce concept for people who collect ideas, not just things. Bold type and playful motion meet a fast, intuitive shop.",
    challenge: "Give an independent cultural brand a digital world as distinctive as its point of view.",
    approach: "A modular identity, playful product interactions and a considered checkout journey.",
    concept: "A flexible design concept that makes discovery and shopping part of the same experience.",
    next: "rail",
  },
  {
    slug: "rail",
    name: "Rail",
    tagline: ["Your city.", "In motion."],
    sector: "Mobility & travel",
    index: "Studio concept / 03",
    type: "Digital product",
    year: "2026",
    category: "Products",
    image: "/images/transit.webp",
    heroTitle: "Making the next move feel simple.",
    summary:
      "A mobility product concept that makes complex journeys feel simple, with a clear interface and just enough motion to show the way.",
    challenge: "Bring clarity to a journey with many moving parts.",
    approach:
      "A responsive visual system, guided route planning and clear states that help people move with confidence.",
    concept: "An accessible product concept that balances clarity, character and speed.",
    next: "shoreline",
  },
];

export const workSection = {
  label: "04 / Possibilities in practice",
  title: ["Different worlds.", "One curious studio."],
  intro: ["A glimpse of what’s possible.", "Independent concepts, built to explore."],
  cta: "Explore all work",
};

export const results = {
  label: "05 / Beyond the first impression",
  title: ["Good experiences.", "Meaningful results."],
  intro: ["Beautiful is a starting point.", "What people do next is what matters."],
  note: "Illustrative results · not client claims",
  stats: [
    { prefix: "−", value: 42, decimals: 0, suffix: "%", label: "Faster to first impression" },
    { prefix: "", value: 3.4, decimals: 1, suffix: "×", label: "More time exploring" },
    { prefix: "+", value: 28, decimals: 0, suffix: "%", label: "More meaningful actions" },
  ],
};

export const process = {
  label: "06 / From the first what if",
  title: ["A little method", "to the magic."],
  intro: "No disappearing acts. Just a clear process, an open conversation, and a shared drive to make it better.",
  steps: [
    { num: "01", name: "Discover", title: "Find the interesting part.", body: "We ask questions, listen closely, and find the opportunity worth building around." },
    { num: "02", name: "Define", title: "Give the idea a shape.", body: "A clear strategy becomes a creative direction, a prototype, and a shared ambition." },
    { num: "03", name: "Create", title: "Make it feel alive.", body: "Design and code evolve together. We test the details on real screens, with real hands." },
    { num: "04", name: "Launch", title: "Release. Learn. Refine.", body: "We tune performance, check accessibility, and keep improving after the launch." },
  ],
};

export const principles = {
  label: "A few things we believe",
  title: ["Same mindset.", "Different perspectives."],
  hint: "Drag to explore ↔",
  items: [
    { num: "01", glyph: "✳", title: "Curiosity first.", body: "The most interesting answer usually starts with a better question." },
    { num: "02", glyph: "↗", title: "Craft all the way down.", body: "A strong idea deserves the same attention in design, motion, code and accessibility." },
    { num: "03", glyph: "⊕", title: "Built together.", body: "One conversation across disciplines, with you involved throughout the process." },
  ],
};

export const cta = {
  label: "Have something in mind?",
  ears: "We’re all ears ↗",
  title: ["Let’s make it", "unforgettable."],
  body: "A small idea. A big ambition. A very interesting problem. We’re ready for all three.",
  button: "Start a conversation",
};

export const about = {
  label: "The studio / Dhaka ↗ Worldwide",
  title: ["Curious people.", "Considered work."],
  body: "Webloom Interactive is a creative technology studio and a concern of Dcastalia Limited. We bring design and development into the same conversation, from the first sketch to the final interaction.",
  belief: "We believe the best digital experiences happen when creative ambition and technical precision move together.",
  foundation: {
    title: ["An independent spirit.", "A shared foundation."],
    badge: "Webloom × Dcastalia",
    body: "A concern of Dcastalia Limited. A dedicated home for expressive digital experiences, built with a wider foundation of design and technology.",
  },
};

export const servicesPage = {
  label: "Our expertise",
  title: ["A good idea deserves", "a great experience."],
  body: "From the first creative direction to the last performance check, we work across the full experience.",
};

export const workPage = {
  label: "Selected work / Studio concepts",
  title: ["Different worlds.", "The same curiosity."],
  body: "Independent concepts that explore what a brand can become when design and technology share the same ambition.",
  note: "Independent studio concepts · Real client work coming soon",
  conceptNote: "Independent concept — not commissioned client work",
};

export const contactPage = {
  label: "Start a conversation",
  title: ["The next great thing", "starts with a conversation."],
  body: "Tell us what you’re imagining. We’ll help you find the right shape for it.",
  side: {
    label: "A good place to start",
    title: ["Big ambition?", "We’re listening."],
    body: "Websites, creative technology, and the interesting ideas that don’t fit a category.",
    location: "Dhaka, Bangladesh · Working worldwide",
    note: "Contact details will be published with the final brand launch.",
  },
  form: {
    title: "Tell us about your idea.",
    note: "Demo inquiry form. Your details stay in this browser; messages are not sent yet.",
    name: "Your name",
    email: "Email address",
    company: "Company",
    budget: "What’s the budget looking like?",
    budgets: ["Under $10k", "$10k–25k", "$25k–50k", "Let’s discuss"],
    idea: "What are you imagining?",
    ideaHint: "A few sentences about your idea, goals, and timeline. At least 15 characters.",
    submit: "Prepare project brief",
  },
};

export const footer = {
  concern: "A concern of Dcastalia Limited",
  back: "Back to top",
  copyright: "© 2026 Webloom Interactive",
  built: "How we built this",
  replay: "Replay the intro ↗",
};
