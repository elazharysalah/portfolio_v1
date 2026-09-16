import type { PortfolioPayload } from "@/lib/types";

export function Resume({
  settings,
  experiences,
  education,
  skillGroups,
}: {
  settings: PortfolioPayload["settings"];
  experiences: PortfolioPayload["experiences"];
  education: PortfolioPayload["education"];
  skillGroups: PortfolioPayload["skillGroups"];
}) {
  return (
    <section>
      <h2 className="section-title with-rule">{settings.resumeTitle}</h2>

      <h3 className="block-title">{settings.experienceTitle}</h3>
      <ul className="timeline">
        {experiences.map((item) => (
          <li className="timeline-item" key={item.id}>
            <div className="period">{item.period}</div>
            <h4>{item.role}</h4>
            <div className="meta">
              {item.company}
              {item.location ? ` · ${item.location}` : ""}
            </div>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>

      <h3 className="block-title">{settings.educationTitle}</h3>
      <ul className="timeline">
        {education.map((item) => (
          <li className="timeline-item" key={item.id}>
            <div className="period">{item.period}</div>
            <h4>{item.degree}</h4>
            <div className="meta">{item.institution}</div>
            {item.description && <p>{item.description}</p>}
          </li>
        ))}
      </ul>

      <h3 className="block-title">{settings.skillsTitle}</h3>
      <div className="skills-grid">
        {skillGroups.map((group) => (
          <div className="skill-group" key={group.id}>
            <h4>{group.name}</h4>
            <div className="skill-tags">
              {group.skills.map((skill) => (
                <span key={skill.id}>{skill.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
