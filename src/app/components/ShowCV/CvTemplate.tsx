import React from "react";

export interface ContactInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string | null;
  linkedin: string | null;
  portfolio: string | null;
  github: string | null;
}

export interface Experience {
  job_title: string;
  company: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  degree: string;
  field_of_study: string;
  institution: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
}

export interface Certification {
  name: string;
  organization: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link: string | null;
}

export interface ExtracurricularActivity {
  title: string;
  organization: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface Reference {
  name: string;
  company: string;
  email: string | null;
  phone: string | null;
}

export interface CVData {
  contact_info: ContactInfo;
  summary: string | null;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
  extracurricular_activities: ExtracurricularActivity[];
  achievements: string[];
  references: Reference[];
}

interface CvTemplateProps {
  data: CVData;
}

const formatDateRange = (
  start?: string | null,
  end?: string | null,
  isCurrent?: boolean
) => {
  if (!start && !end) return null;
  if (isCurrent) return `${start || ""} – Present`;
  if (start && end) return `${start} – ${end}`;
  return start || end || null;
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="text-lg font-semibold tracking-wide uppercase text-gray-700 border-b pb-1 mb-3">
    {children}
  </h2>
);

const CvTemplate: React.FC<CvTemplateProps> = ({ data }) => {
  const {
    contact_info,
    summary,
    skills,
    experiences,
    education,
    certifications,
    projects,
    extracurricular_activities,
    achievements,
    references,
  } = data;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-md p-8 rounded-lg text-gray-900">
      {/* Header */}
      <header className="border-b pb-4 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {contact_info.full_name}
        </h1>

        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-700">
          {contact_info.email && (
            <span>
              <strong>Email:</strong> {contact_info.email}
            </span>
          )}
          {contact_info.phone && (
            <span>
              <strong>Phone:</strong> {contact_info.phone}
            </span>
          )}
          {contact_info.address && (
            <span>
              <strong>Address:</strong> {contact_info.address}
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-700">
          {contact_info.linkedin && (
            <a
              href={
                contact_info.linkedin.startsWith("http")
                  ? contact_info.linkedin
                  : `https://linkedin.com/in/${contact_info.linkedin}`
              }
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              LinkedIn
            </a>
          )}
          {contact_info.portfolio && (
            <a
              href={
                contact_info.portfolio.startsWith("http")
                  ? contact_info.portfolio
                  : `https://${contact_info.portfolio}`
              }
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Portfolio
            </a>
          )}
          {contact_info.github && (
            <a
              href={
                contact_info.github.startsWith("http")
                  ? contact_info.github
                  : `https://github.com/${contact_info.github}`
              }
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              GitHub
            </a>
          )}
        </div>
      </header>

      <div className="space-y-6 text-sm leading-relaxed">
        {/* Summary */}
        {summary && summary.trim() !== "" && (
          <section>
            <SectionTitle>Professional Summary</SectionTitle>
            <p>{summary}</p>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <SectionTitle>Skills</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs rounded-full border border-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section>
            <SectionTitle>Experience</SectionTitle>
            <div className="space-y-4">
              {experiences.map((exp, index) => {
                const dateRange = formatDateRange(
                  exp.start_date,
                  exp.end_date,
                  exp.is_current
                );
                return (
                  <div key={index}>
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">
                          {exp.job_title}
                          {exp.company ? ` – ${exp.company}` : ""}
                        </h3>
                        {exp.location && (
                          <p className="text-xs text-gray-600">
                            {exp.location}
                          </p>
                        )}
                      </div>
                      {dateRange && (
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {dateRange}
                        </span>
                      )}
                    </div>

                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside mt-1">
                        {exp.responsibilities.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-1">
                        <p className="font-semibold text-xs">Key Achievements:</p>
                        <ul className="list-disc list-inside">
                          {exp.achievements.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-3">
              {education.map((edu, index) => {
                const dateRange = formatDateRange(edu.start_date, edu.end_date);
                return (
                  <div key={index}>
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-xs text-gray-700">
                          {edu.institution}
                        </p>
                        {edu.field_of_study && (
                          <p className="text-xs text-gray-600">
                            {edu.field_of_study}
                          </p>
                        )}
                        {edu.location && (
                          <p className="text-xs text-gray-500">
                            {edu.location}
                          </p>
                        )}
                      </div>
                      {dateRange && (
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {edu.grade && (
                      <p className="text-xs text-gray-600 mt-1">{edu.grade}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <SectionTitle>Certifications</SectionTitle>
            <ul className="space-y-2">
              {certifications.map((cert, index) => {
                const dateRange = formatDateRange(
                  cert.issue_date,
                  cert.expiration_date
                );
                return (
                  <li key={index}>
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-semibold">{cert.name}</p>
                        <p className="text-xs text-gray-600">
                          {cert.organization}
                        </p>
                        {cert.credential_id && (
                          <p className="text-xs text-gray-600">
                            ID: {cert.credential_id}
                          </p>
                        )}
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-700 underline"
                          >
                            View Credential
                          </a>
                        )}
                      </div>
                      {dateRange && (
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {dateRange}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-3">
              {projects.map((proj, index) => (
                <div key={index}>
                  <div className="flex justify-between gap-4">
                    <h3 className="font-semibold">{proj.title}</h3>
                    {proj.link && (
                      <a
                        href={
                          proj.link.startsWith("http")
                            ? proj.link
                            : `https://${proj.link}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-700 underline whitespace-nowrap"
                      >
                        {proj.link}
                      </a>
                    )}
                  </div>
                  <p className="text-sm mt-1">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      <strong>Technologies:</strong> {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Extracurricular Activities */}
        {extracurricular_activities &&
          extracurricular_activities.length > 0 && (
            <section>
              <SectionTitle>Extracurricular Activities</SectionTitle>
              <div className="space-y-2">
                {extracurricular_activities.map((act, index) => {
                  const dateRange = formatDateRange(
                    act.start_date,
                    act.end_date
                  );
                  return (
                    <div key={index}>
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-semibold">{act.title}</p>
                          {act.organization && (
                            <p className="text-xs text-gray-600">
                              {act.organization}
                            </p>
                          )}
                        </div>
                        {dateRange && (
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {dateRange}
                          </span>
                        )}
                      </div>
                      {act.description && (
                        <p className="text-sm mt-1">{act.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        {/* Additional Achievements */}
        {achievements && achievements.length > 0 && (
          <section>
            <SectionTitle>Achievements</SectionTitle>
            <ul className="list-disc list-inside">
              {achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <section>
            <SectionTitle>References</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((ref, index) => (
                <div key={index} className="border rounded-md p-3">
                  <p className="font-semibold">{ref.name}</p>
                  <p className="text-xs text-gray-700">{ref.company}</p>
                  {ref.phone && (
                    <p className="text-xs text-gray-700 mt-1">
                      Phone: {ref.phone}
                    </p>
                  )}
                  {ref.email && (
                    <p className="text-xs text-gray-700">
                      Email: {ref.email}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CvTemplate;