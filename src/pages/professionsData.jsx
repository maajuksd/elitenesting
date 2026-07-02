/* ==========================================================
   professionsData.jsx
   Smart data for CV Maker
========================================================== */

export const SKILL_DATABASE = [
  "Problem Solving",
  "Communication",
  "Team Player",
  "Leadership",
  "Time Management",
  "Critical Thinking",
  "Analytical Skills",
  "Adaptability",
  "Attention to Detail",
  "Project Management",
  "Decision Making",
  "Creativity",
  "Collaboration",
  "Negotiation",
  "Customer Service",
  "Conflict Resolution",
  "Multitasking",

  "AutoCAD",
  "Revit",
  "SketchUp",
  "3ds Max",
  "V-Ray",
  "Lumion",
  "Photoshop",
  "Illustrator",

  "MS Word",
  "MS Excel",
  "PowerPoint",
  "Outlook",
  "Google Workspace",

  "Primavera P6",
  "Microsoft Project",

  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "SQL",

  "ERP",
  "CRM",
  "SAP",

  "Quantity Surveying",
  "Estimation",
  "BOQ Preparation",
  "Site Supervision",
  "Quality Control",
  "RCC",
  "Construction Management",
  "Interior Design",
  "Space Planning",
  "3D Rendering",
  "Material Selection",
  "Financial Reporting",
  "GST",
  "Tally",
  "Lead Generation",
  "Sales",
  "Marketing",
  "Procurement",
  "Vendor Management"
];

export const PROFESSIONS = [
  {
    id: "civil-engineer",

    titles: [
      "civil engineer",
      "site engineer",
      "project engineer",
      "resident engineer"
    ],

    summaryTemplates: [
      "Detail-oriented Civil Engineer with experience in construction management, site supervision, quantity estimation, quality control, and project coordination. Skilled in delivering projects safely, on time, and within budget.",

      "Results-driven Civil Engineer experienced in planning, execution, estimation, RCC works, and supervising construction activities while maintaining quality and safety standards.",

      "Experienced Civil Engineer with strong knowledge of structural works, BOQ preparation, project planning, AutoCAD, and construction supervision."
    ],

    skills: [
      "AutoCAD",
      "Quantity Surveying",
      "Estimation",
      "BOQ Preparation",
      "Site Supervision",
      "Quality Control",
      "Construction Management",
      "RCC",
      "MS Excel",
      "Project Planning"
    ],

    responsibilities: [
      "Supervised day-to-day construction activities.",
      "Prepared quantity estimates and BOQs.",
      "Coordinated with architects, consultants, and contractors.",
      "Ensured quality standards and site safety.",
      "Monitored project progress and prepared reports.",
      "Reviewed structural drawings and specifications.",
      "Managed material inspections.",
      "Assisted in project planning and scheduling."
    ]
  },

  {
    id: "interior-designer",

    titles: [
      "interior designer",
      "3d designer",
      "3d visualizer",
      "designer"
    ],

    summaryTemplates: [
      "Creative Interior Designer experienced in residential and commercial projects with expertise in space planning, 3D visualization, material selection, and client coordination.",

      "Professional Interior Designer skilled in AutoCAD, SketchUp, Lumion, 3ds Max, and V-Ray with a passion for creating functional and aesthetically pleasing interiors."
    ],

    skills: [
      "AutoCAD",
      "SketchUp",
      "Lumion",
      "3ds Max",
      "V-Ray",
      "Photoshop",
      "Space Planning",
      "Material Selection",
      "3D Rendering",
      "Client Coordination"
    ],

    responsibilities: [
      "Designed residential and commercial interiors.",
      "Prepared 2D drawings using AutoCAD.",
      "Created 3D models and rendered visualizations.",
      "Coordinated with clients and vendors.",
      "Selected materials, finishes, and furniture.",
      "Conducted site measurements and inspections.",
      "Prepared presentation boards and mood boards."
    ]
  },

  {
    id: "sales",

    titles: [
      "sales executive",
      "sales officer",
      "sales engineer",
      "business development executive"
    ],

    summaryTemplates: [
      "Motivated Sales Executive with experience in lead generation, customer relationship management, negotiations, and achieving sales targets.",

      "Results-oriented sales professional with strong communication skills and a proven ability to build lasting client relationships."
    ],

    skills: [
      "CRM",
      "Communication",
      "Negotiation",
      "Lead Generation",
      "Customer Service",
      "Sales",
      "Presentation Skills",
      "MS Excel"
    ],

    responsibilities: [
      "Generated leads through networking and referrals.",
      "Managed customer relationships.",
      "Conducted product presentations.",
      "Negotiated pricing and contracts.",
      "Achieved monthly sales targets.",
      "Prepared sales reports."
    ]
  },

  {
    id: "accountant",

    titles: [
      "accountant",
      "accounts executive",
      "finance executive"
    ],

    summaryTemplates: [
      "Experienced Accountant with expertise in bookkeeping, taxation, GST compliance, financial reporting, and reconciliation.",

      "Detail-oriented accounting professional skilled in Tally, Excel, GST filing, and financial statement preparation."
    ],

    skills: [
      "Tally",
      "GST",
      "Financial Reporting",
      "MS Excel",
      "SAP",
      "Bookkeeping",
      "Reconciliation"
    ],

    responsibilities: [
      "Prepared financial statements.",
      "Managed accounts payable and receivable.",
      "Maintained accounting records.",
      "Filed GST returns.",
      "Performed bank reconciliation.",
      "Prepared monthly financial reports."
    ]
  }
];

/* ==========================================================
   Find matching profession
========================================================== */

export function matchProfession(title = "") {
  const value = title.toLowerCase().trim();

  return (
    PROFESSIONS.find((profession) =>
      profession.titles.some((t) => value.includes(t))
    ) || null
  );
}

/* ==========================================================
   Generate professional summary
========================================================== */

export function generateSummary(
  profession,
  customTitle = "",
  variant = 0
) {
  if (!profession) return "";

  const templates = profession.summaryTemplates;

  return templates[variant % templates.length].replace(
    "{title}",
    customTitle
  );
}