import type React from "react"

export interface ContactInfo {
  full_name: string
  email: string
  phone: string
  address: string | null
  linkedin: string | null
  portfolio: string | null
  github: string | null
}

export interface Experience {
  job_title: string
  company: string | null
  location: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  responsibilities: string[]
  achievements: string[]
}

export interface Education {
  degree: string
  field_of_study: string
  institution: string
  location: string | null
  start_date: string | null
  end_date: string | null
  grade: string | null
}

export interface Certification {
  name: string
  organization: string
  issue_date: string | null
  expiration_date: string | null
  credential_id: string | null
  credential_url: string | null
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  link: string | null
}

export interface ExtracurricularActivity {
  title: string
  organization: string | null
  description: string | null
  start_date: string | null
  end_date: string | null
}

export interface Reference {
  name: string
  company: string
  email: string | null
  phone: string | null
}

export interface CVData {
  contact_info: ContactInfo
  summary: string | null
  skills: string[]
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
  projects: Project[]
  extracurricular_activities: ExtracurricularActivity[]
  achievements: string[]
  references: Reference[]
}

interface CvTemplateProps {
  data: CVData
}

const formatDateRange = (start?: string | null, end?: string | null, isCurrent?: boolean) => {
  if (!start && !end) return null
  if (isCurrent) return `${start || ""} – Present`
  if (start && end) return `${start} – ${end}`
  return start || end || null
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-1 h-6 bg-primary rounded-full"></div>
    <h2 className="text-lg font-semibold tracking-tight text-foreground">{children}</h2>
  </div>
)

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
  } = data

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto bg-card text-foreground p-10 md:p-12">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2 text-balance">
              {contact_info.full_name}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {contact_info.email && <span>{contact_info.email}</span>}
              {contact_info.phone && <span>{contact_info.phone}</span>}
              {contact_info.address && <span>{contact_info.address}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {contact_info.linkedin && (
              <a
                href={
                  contact_info.linkedin.startsWith("http")
                    ? contact_info.linkedin
                    : `https://linkedin.com/in/${contact_info.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full hover:opacity-80 transition-opacity"
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
                className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full hover:opacity-80 transition-opacity"
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
                className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full hover:opacity-80 transition-opacity"
              >
                GitHub
              </a>
            )}
          </div>
        </header>

        <div className="space-y-8 text-sm leading-relaxed">
          {/* Summary */}
          {summary && summary.trim() !== "" && (
            <section>
              <SectionTitle>About</SectionTitle>
              <p className="text-base text-foreground/90 leading-relaxed max-w-3xl">{summary}</p>
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
                    className="px-3 py-1.5 text-xs font-medium bg-muted text-muted-foreground rounded-lg border border-border hover:border-primary transition-colors"
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
              <div className="space-y-6">
                {experiences.map((exp, index) => {
                  const dateRange = formatDateRange(exp.start_date, exp.end_date, exp.is_current)
                  return (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-base text-foreground">{exp.job_title}</h3>
                          {exp.company && <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>}
                          {exp.location && <p className="text-xs text-muted-foreground">{exp.location}</p>}
                        </div>
                        {dateRange && (
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {dateRange}
                          </span>
                        )}
                      </div>

                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 ml-0">
                          {exp.responsibilities.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-3">
                          <p className="font-medium text-xs text-muted-foreground mb-1">Key Achievements:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80 ml-0">
                            {exp.achievements.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-4">
                {education.map((edu, index) => {
                  const dateRange = formatDateRange(edu.start_date, edu.end_date)
                  return (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-foreground">{edu.degree}</h3>
                          <p className="text-sm font-medium text-muted-foreground">{edu.institution}</p>
                          {edu.field_of_study && <p className="text-xs text-muted-foreground">{edu.field_of_study}</p>}
                          {edu.location && <p className="text-xs text-muted-foreground">{edu.location}</p>}
                        </div>
                        {dateRange && (
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {dateRange}
                          </span>
                        )}
                      </div>
                      {edu.grade && <p className="text-xs text-muted-foreground mt-2">GPA: {edu.grade}</p>}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <SectionTitle>Certifications</SectionTitle>
              <div className="space-y-3">
                {certifications.map((cert, index) => {
                  const dateRange = formatDateRange(cert.issue_date, cert.expiration_date)
                  return (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-base text-foreground">{cert.name}</p>
                          <p className="text-sm font-medium text-muted-foreground">{cert.organization}</p>
                          {cert.credential_id && (
                            <p className="text-xs text-muted-foreground mt-1">ID: {cert.credential_id}</p>
                          )}
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-primary hover:underline mt-1 inline-block"
                            >
                              View Credential →
                            </a>
                          )}
                        </div>
                        {dateRange && (
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {dateRange}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <SectionTitle>Projects</SectionTitle>
              <div className="space-y-4">
                {projects.map((proj, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-1">
                      <h3 className="font-semibold text-base text-foreground">{proj.title}</h3>
                      {proj.link && (
                        <a
                          href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-primary hover:underline whitespace-nowrap"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-2">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.map((tech, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Extracurricular Activities */}
          {extracurricular_activities && extracurricular_activities.length > 0 && (
            <section>
              <SectionTitle>Activities</SectionTitle>
              <div className="space-y-3">
                {extracurricular_activities.map((act, index) => {
                  const dateRange = formatDateRange(act.start_date, act.end_date)
                  return (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div className="flex-1">
                          <p className="font-semibold text-base text-foreground">{act.title}</p>
                          {act.organization && (
                            <p className="text-sm font-medium text-muted-foreground">{act.organization}</p>
                          )}
                        </div>
                        {dateRange && (
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {dateRange}
                          </span>
                        )}
                      </div>
                      {act.description && (
                        <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{act.description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Additional Achievements */}
          {achievements && achievements.length > 0 && (
            <section>
              <SectionTitle>Achievements</SectionTitle>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
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
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 bg-card hover:border-primary transition-colors"
                  >
                    <p className="font-semibold text-foreground">{ref.name}</p>
                    <p className="text-sm font-medium text-muted-foreground">{ref.company}</p>
                    {ref.phone && <p className="text-xs text-muted-foreground mt-2">{ref.phone}</p>}
                    {ref.email && <p className="text-xs text-muted-foreground">{ref.email}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default CvTemplate
