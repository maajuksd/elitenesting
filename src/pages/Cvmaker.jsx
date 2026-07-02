import { useEffect, useMemo, useRef, useState } from "react";
import "./Cvmaker.css";
import "./Cvmaker.ai.css";
import {
  SKILL_DATABASE,
  matchProfession,
  generateSummary,
} from "./professionsData.jsx";

/* ---------- helpers ---------- */
let uid = 0;
const nextId = () => `id-${++uid}`;

const emptyEducation = () => ({
  id: nextId(),
  school: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  gpa: "",
});

const emptyExperience = () => ({
  id: nextId(),
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: "",
});

/* ---------- main component ---------- */
export default function CVMaker() {
  const [personal, setPersonal] = useState({
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  });

  const [education, setEducation] = useState([emptyEducation()]);
  const [experience, setExperience] = useState([emptyExperience()]);
  const [skills, setSkills] = useState([]);
  const [skillDraft, setSkillDraft] = useState("");

  /* ----- Designation intelligence ----- */
  const matchedProfession = useMemo(
    () => matchProfession(personal.title),
    [personal.title]
  );

  const [summaryVariant, setSummaryVariant] = useState(0);
  const [summarySuggestionDismissed, setSummarySuggestionDismissed] = useState(false);
  const [skillsSuggestionDismissed, setSkillsSuggestionDismissed] = useState(false);

  // Reset dismissal / variant whenever the matched profession changes
  useEffect(() => {
    setSummaryVariant(0);
    setSummarySuggestionDismissed(false);
    setSkillsSuggestionDismissed(false);
  }, [matchedProfession?.id]);

  const suggestedSummary = useMemo(() => {
    if (!matchedProfession) return "";
    return generateSummary(matchedProfession, personal.title, summaryVariant);
  }, [matchedProfession, personal.title, summaryVariant]);

  const recommendedSkills = useMemo(() => {
    if (!matchedProfession) return [];
    return matchedProfession.skills.filter((s) => !skills.includes(s));
  }, [matchedProfession, skills]);

  const keywordTags = useMemo(() => {
    if (!matchedProfession) return [];
    return matchedProfession.skills.slice(0, 6);
  }, [matchedProfession]);

  const showSummaryPanel =
    Boolean(matchedProfession) && !summarySuggestionDismissed;
  const showSkillsPanel =
    Boolean(matchedProfession) &&
    !skillsSuggestionDismissed &&
    recommendedSkills.length > 0;

  const acceptSuggestedSummary = () => {
    updatePersonal("summary", suggestedSummary);
  };
  const regenerateSummary = () => setSummaryVariant((v) => v + 1);

  /* ----- Skills autocomplete ----- */
  const [skillInputFocused, setSkillInputFocused] = useState(false);
  const skillBlurTimeout = useRef(null);

  const skillSuggestions = useMemo(() => {
    const query = skillDraft.trim().toLowerCase();
    const pool = matchedProfession
      ? [...matchedProfession.skills, ...SKILL_DATABASE]
      : SKILL_DATABASE;
    const unique = Array.from(new Set(pool)).filter((s) => !skills.includes(s));

    if (!query) {
      // No text yet: lead with profession-recommended skills if we have them
      if (matchedProfession) {
        return matchedProfession.skills.filter((s) => !skills.includes(s)).slice(0, 8);
      }
      return [];
    }
    return unique.filter((s) => s.toLowerCase().includes(query)).slice(0, 8);
  }, [skillDraft, skills, matchedProfession]);

  const showSkillDropdown = skillInputFocused && skillSuggestions.length > 0;

  const handleSkillInputFocus = () => {
    if (skillBlurTimeout.current) clearTimeout(skillBlurTimeout.current);
    setSkillInputFocused(true);
  };
  const handleSkillInputBlur = () => {
    // slight delay so a click on a suggestion registers before the dropdown unmounts
    skillBlurTimeout.current = setTimeout(() => setSkillInputFocused(false), 150);
  };

  /* ----- Responsibilities assistant ----- */
  const [activeResponsibilityFor, setActiveResponsibilityFor] = useState(null);
  const [dismissedResponsibilityFor, setDismissedResponsibilityFor] = useState(() => new Set());

  const handleBulletsFocus = (exp) => {
    if (dismissedResponsibilityFor.has(exp.id)) return;
    const match = matchProfession(exp.role);
    if (match) setActiveResponsibilityFor(exp.id);
  };

  const closeResponsibilitySuggestion = (id) => {
    setActiveResponsibilityFor((current) => (current === id ? null : current));
  };

  const dismissResponsibilitySuggestion = (id) => {
    setDismissedResponsibilityFor((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setActiveResponsibilityFor((current) => (current === id ? null : current));
  };

  const insertResponsibility = (id, line) => {
    setExperience((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        const existingLines = item.bullets
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        if (existingLines.includes(line)) return item;
        const nextBullets = existingLines.length
          ? [...existingLines, line].join("\n")
          : line;
        return { ...item, bullets: nextBullets };
      })
    );
  };

  const insertAllResponsibilities = (id, lines) => {
    setExperience((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        const existingLines = item.bullets
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const merged = [...existingLines];
        lines.forEach((line) => {
          if (!merged.includes(line)) merged.push(line);
        });
        return { ...item, bullets: merged.join("\n") };
      })
    );
  };

  /* personal info */
  const updatePersonal = (field, value) =>
    setPersonal((prev) => ({ ...prev, [field]: value }));

  /* education */
  const updateEducation = (id, field, value) =>
    setEducation((list) =>
      list.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  const addEducation = () => setEducation((list) => [...list, emptyEducation()]);
  const removeEducation = (id) =>
    setEducation((list) => (list.length > 1 ? list.filter((i) => i.id !== id) : list));

  /* experience */
  const updateExperience = (id, field, value) =>
    setExperience((list) =>
      list.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  const addExperience = () => setExperience((list) => [...list, emptyExperience()]);
  const removeExperience = (id) =>
    setExperience((list) => (list.length > 1 ? list.filter((i) => i.id !== id) : list));

  /* skills */
  const addSkill = (value) => {
    const skillValue = (value ?? skillDraft).trim();
    if (skillValue && !skills.includes(skillValue)) {
      setSkills((list) => [...list, skillValue]);
    }
    setSkillDraft("");
  };
  const removeSkill = (skill) =>
    setSkills((list) => list.filter((s) => s !== skill));
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };
  const selectSuggestedSkill = (skill) => {
    addSkill(skill);
    setSkillInputFocused(false);
  };

  const handlePrint = () => window.print();

  return (
    <div className="cv-app">
      {/* ---------------- FORM PANEL ---------------- */}
      <aside className="cv-form" aria-label="CV details form">
        <div className="cv-form-header">
          <p className="cv-eyebrow">Draft</p>
          <h1 className="cv-form-title">Build your CV</h1>
          <p className="cv-form-sub">
            Fill in your details. The document on the right updates as you type.
          </p>
        </div>

        {/* Personal info */}
        <section className="cv-section-block">
          <h2 className="cv-block-label">Personal information</h2>
          <div className="cv-field-grid">
            <label className="cv-field">
              <span>Full name</span>
              <input
                type="text"
                value={personal.fullName}
                onChange={(e) => updatePersonal("fullName", e.target.value)}
                placeholder="Jordan Alvarez"
              />
            </label>
            <label className="cv-field">
              <span>Professional title</span>
              <input
                type="text"
                value={personal.title}
                onChange={(e) => updatePersonal("title", e.target.value)}
                placeholder="Frontend Engineer"
              />
            </label>
            <label className="cv-field">
              <span>Email</span>
              <input
                type="email"
                value={personal.email}
                onChange={(e) => updatePersonal("email", e.target.value)}
                placeholder="jordan@email.com"
              />
            </label>
            <label className="cv-field">
              <span>Phone</span>
              <input
                type="text"
                value={personal.phone}
                onChange={(e) => updatePersonal("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>
            <label className="cv-field">
              <span>Location</span>
              <input
                type="text"
                value={personal.location}
                onChange={(e) => updatePersonal("location", e.target.value)}
                placeholder="Kochi, Kerala"
              />
            </label>
            <label className="cv-field">
              <span>LinkedIn / Portfolio</span>
              <input
                type="text"
                value={personal.linkedin}
                onChange={(e) => updatePersonal("linkedin", e.target.value)}
                placeholder="linkedin.com/in/jordan"
              />
            </label>
          </div>

          {/* AI: Designation intelligence — summary suggestion */}
          {showSummaryPanel && (
            <div className="cv-ai-panel">
              <div className="cv-ai-panel-header">
                <span className="cv-ai-badge">Suggested</span>
                <span className="cv-ai-panel-title">
                  Professional summary for &ldquo;{personal.title}&rdquo;
                </span>
                <button
                  type="button"
                  className="cv-ai-dismiss"
                  aria-label="Dismiss summary suggestion"
                  onClick={() => setSummarySuggestionDismissed(true)}
                >
                  ×
                </button>
              </div>
              <p className="cv-ai-panel-text">{suggestedSummary}</p>
              {keywordTags.length > 0 && (
                <div className="cv-ai-keyword-row">
                  {keywordTags.map((kw) => (
                    <span className="cv-ai-keyword-tag" key={kw}>
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              <div className="cv-ai-panel-actions">
                <button
                  type="button"
                  className="cv-btn-primary cv-ai-btn-sm"
                  onClick={acceptSuggestedSummary}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="cv-btn-outline cv-ai-btn-sm"
                  onClick={regenerateSummary}
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          <label className="cv-field cv-field-full">
            <span>Profile summary</span>
            <textarea
              rows={4}
              value={personal.summary}
              onChange={(e) => updatePersonal("summary", e.target.value)}
              placeholder="A short paragraph on who you are, your strengths, and what you're looking for."
            />
          </label>
        </section>

        {/* Skills */}
        <section className="cv-section-block">
          <h2 className="cv-block-label">Skills</h2>
          <div className="cv-skill-input-row cv-ai-combobox">
            <input
              type="text"
              value={skillDraft}
              onChange={(e) => setSkillDraft(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onFocus={handleSkillInputFocus}
              onBlur={handleSkillInputBlur}
              placeholder="Search or type a skill and press Enter"
              autoComplete="off"
            />
            <button type="button" className="cv-btn-outline" onClick={() => addSkill()}>
              Add
            </button>

            {showSkillDropdown && (
              <ul className="cv-ai-dropdown" role="listbox">
                {!skillDraft.trim() && matchedProfession && (
                  <li className="cv-ai-dropdown-heading">
                    Recommended for {personal.title}
                  </li>
                )}
                {skillSuggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className="cv-ai-dropdown-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSuggestedSkill(s)}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {skills.length > 0 && (
            <ul className="cv-skill-chip-list">
              {skills.map((skill) => (
                <li key={skill} className="cv-skill-chip">
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* AI: Recommended skills row for matched designation */}
          {showSkillsPanel && (
            <div className="cv-ai-inline-panel">
              <div className="cv-ai-panel-header">
                <span className="cv-ai-badge">Suggested</span>
                <span className="cv-ai-panel-title">
                  Recommended skills for {personal.title}
                </span>
                <button
                  type="button"
                  className="cv-ai-dismiss"
                  aria-label="Dismiss skill suggestions"
                  onClick={() => setSkillsSuggestionDismissed(true)}
                >
                  ×
                </button>
              </div>
              <ul className="cv-ai-suggestion-chip-list">
                {recommendedSkills.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className="cv-ai-suggestion-chip"
                      onClick={() => addSkill(s)}
                    >
                      + {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Experience */}
        <section className="cv-section-block">
          <div className="cv-block-header-row">
            <h2 className="cv-block-label">Work experience</h2>
            <button type="button" className="cv-btn-outline" onClick={addExperience}>
              + Add role
            </button>
          </div>

          {experience.map((exp, idx) => {
            const respMatch = matchProfession(exp.role);
            const showRespPanel = activeResponsibilityFor === exp.id && Boolean(respMatch);
            const availableBullets = respMatch
              ? respMatch.responsibilities.filter((line) => {
                  const existing = exp.bullets
                    .split("\n")
                    .map((l) => l.trim());
                  return !existing.includes(line);
                })
              : [];

            return (
              <div className="cv-repeat-card" key={exp.id}>
                <div className="cv-repeat-card-top">
                  <span className="cv-repeat-index">Role {idx + 1}</span>
                  {experience.length > 1 && (
                    <button
                      type="button"
                      className="cv-btn-remove"
                      onClick={() => removeExperience(exp.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="cv-field-grid">
                  <label className="cv-field">
                    <span>Job title</span>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                      placeholder="Senior Frontend Engineer"
                    />
                  </label>
                  <label className="cv-field">
                    <span>Company</span>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Elite Nesting Pvt Ltd"
                    />
                  </label>
                  <label className="cv-field">
                    <span>Location</span>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      placeholder="Kochi, Kerala"
                    />
                  </label>
                  <label className="cv-field">
                    <span>Start date</span>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      placeholder="Jun 2023"
                    />
                  </label>
                  <label className="cv-field">
                    <span>End date</span>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      placeholder="Present"
                      disabled={exp.current}
                    />
                  </label>
                  <label className="cv-field cv-checkbox-field">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        updateExperience(exp.id, "current", e.target.checked)
                      }
                    />
                    <span>I currently work here</span>
                  </label>
                </div>
                <label className="cv-field cv-field-full">
                  <span className="cv-ai-label-row">
                    Key responsibilities / achievements (one per line)
                    {respMatch && !showRespPanel && (
                      <button
                        type="button"
                        className="cv-ai-suggest-link"
                        onClick={() => setActiveResponsibilityFor(exp.id)}
                      >
                        💡 Suggest responsibilities
                      </button>
                    )}
                  </span>
                  <textarea
                    rows={4}
                    value={exp.bullets}
                    onChange={(e) => updateExperience(exp.id, "bullets", e.target.value)}
                    onFocus={() => handleBulletsFocus(exp)}
                    placeholder={
                      "Led migration of the React frontend to TypeScript, cutting production bugs by 30%\nMentored 2 junior engineers on component architecture"
                    }
                  />
                </label>

                {/* AI: Responsibilities assistant */}
                {showRespPanel && (
                  <div className="cv-ai-panel">
                    <div className="cv-ai-panel-header">
                      <span className="cv-ai-badge">Suggested</span>
                      <span className="cv-ai-panel-title">
                        Responsibilities for {exp.role}
                      </span>
                      <button
                        type="button"
                        className="cv-ai-dismiss"
                        aria-label="Dismiss responsibility suggestions"
                        onClick={() => dismissResponsibilitySuggestion(exp.id)}
                      >
                        ×
                      </button>
                    </div>
                    {availableBullets.length > 0 ? (
                      <ul className="cv-ai-bullet-suggestion-list">
                        {availableBullets.map((line) => (
                          <li key={line}>
                            <button
                              type="button"
                              className="cv-ai-bullet-suggestion"
                              onClick={() => insertResponsibility(exp.id, line)}
                            >
                              + {line}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="cv-ai-panel-text">
                        All suggested responsibilities have been added.
                      </p>
                    )}
                    <div className="cv-ai-panel-actions">
                      {availableBullets.length > 0 && (
                        <button
                          type="button"
                          className="cv-btn-primary cv-ai-btn-sm"
                          onClick={() => insertAllResponsibilities(exp.id, availableBullets)}
                        >
                          Insert all
                        </button>
                      )}
                      <button
                        type="button"
                        className="cv-btn-outline cv-ai-btn-sm"
                        onClick={() => closeResponsibilitySuggestion(exp.id)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Education */}
        <section className="cv-section-block">
          <div className="cv-block-header-row">
            <h2 className="cv-block-label">Education</h2>
            <button type="button" className="cv-btn-outline" onClick={addEducation}>
              + Add education
            </button>
          </div>

          {education.map((edu, idx) => (
            <div className="cv-repeat-card" key={edu.id}>
              <div className="cv-repeat-card-top">
                <span className="cv-repeat-index">Education {idx + 1}</span>
                {education.length > 1 && (
                  <button
                    type="button"
                    className="cv-btn-remove"
                    onClick={() => removeEducation(edu.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="cv-field-grid">
                <label className="cv-field">
                  <span>School / University</span>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    placeholder="University of Kerala"
                  />
                </label>
                <label className="cv-field">
                  <span>Degree</span>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    placeholder="B.Tech"
                  />
                </label>
                <label className="cv-field">
                  <span>Field of study</span>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    placeholder="Computer Science"
                  />
                </label>
                <label className="cv-field">
                  <span>Grade / GPA (optional)</span>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                    placeholder="8.4 CGPA"
                  />
                </label>
                <label className="cv-field">
                  <span>Start date</span>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                    placeholder="2019"
                  />
                </label>
                <label className="cv-field">
                  <span>End date</span>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                    placeholder="2023"
                  />
                </label>
              </div>
            </div>
          ))}
        </section>

        <button type="button" className="cv-btn-primary cv-print-btn" onClick={handlePrint}>
          Print / Save as PDF
        </button>
      </aside>

      {/* ---------------- CV PREVIEW ---------------- */}
      <main className="cv-preview-wrap">
        <div className="cv-page" id="cv-page">
          <header className="cv-doc-header">
            <h1 className="cv-doc-name">
              {personal.fullName || "Your Full Name"}
            </h1>
            {personal.title && <p className="cv-doc-title">{personal.title}</p>}
            <p className="cv-doc-contact">
              {[
                personal.location,
                personal.email,
                personal.phone,
                personal.linkedin,
                personal.website,
              ]
                .filter(Boolean)
                .join("   ·   ")}
            </p>
          </header>

          {personal.summary && (
            <section className="cv-doc-section">
              <h2 className="cv-doc-label">
                <span>Profile Summary</span>
              </h2>
              <p className="cv-doc-summary">{personal.summary}</p>
            </section>
          )}

          {skills.length > 0 && (
            <section className="cv-doc-section">
              <h2 className="cv-doc-label">
                <span>Skills</span>
              </h2>
              <ul className="cv-doc-skill-list">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {experience.some((exp) => exp.role || exp.company) && (
            <section className="cv-doc-section">
              <h2 className="cv-doc-label">
                <span>Professional Experience</span>
              </h2>
              <div className="cv-doc-timeline">
                {experience
                  .filter((exp) => exp.role || exp.company)
                  .map((exp) => {
                    const bulletLines = exp.bullets
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean);
                    return (
                      <article className="cv-doc-entry" key={exp.id}>
                        <div className="cv-doc-entry-marker" aria-hidden="true" />
                        <div className="cv-doc-entry-body">
                          <div className="cv-doc-entry-top">
                            <div>
                              <h3 className="cv-doc-entry-role">
                                {exp.role || "Job Title"}
                              </h3>
                              <p className="cv-doc-entry-company">
                                {[exp.company, exp.location]
                                  .filter(Boolean)
                                  .join("   ·   ")}
                              </p>
                            </div>
                            <p className="cv-doc-entry-dates">
                              {[
                                exp.startDate,
                                exp.current ? "Present" : exp.endDate,
                              ]
                                .filter(Boolean)
                                .join(" — ")}
                            </p>
                          </div>
                          {bulletLines.length > 0 && (
                            <ul className="cv-doc-bullets">
                              {bulletLines.map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                    );
                  })}
              </div>
            </section>
          )}

          {education.some((edu) => edu.school || edu.degree) && (
            <section className="cv-doc-section">
              <h2 className="cv-doc-label">
                <span>Education</span>
              </h2>
              <div className="cv-doc-timeline">
                {education
                  .filter((edu) => edu.school || edu.degree)
                  .map((edu) => (
                    <article className="cv-doc-entry" key={edu.id}>
                      <div className="cv-doc-entry-marker" aria-hidden="true" />
                      <div className="cv-doc-entry-body">
                        <div className="cv-doc-entry-top">
                          <div>
                            <h3 className="cv-doc-entry-role">
                              {[edu.degree, edu.field].filter(Boolean).join(", ") ||
                                "Degree"}
                            </h3>
                            <p className="cv-doc-entry-company">
                              {edu.school}
                              {edu.gpa ? `   ·   ${edu.gpa}` : ""}
                            </p>
                          </div>
                          <p className="cv-doc-entry-dates">
                            {[edu.startDate, edu.endDate].filter(Boolean).join(" — ")}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}