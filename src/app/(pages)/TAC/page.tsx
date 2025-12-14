import React from "react";

export default function TermsAndConditions() {
  const lastUpdated = "2024/06/12";

  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>📄 Terms and Conditions</h1>
          <p style={styles.updated}>
            <strong>Last Updated:</strong> [{lastUpdated}]
          </p>
        </header>

        <p style={styles.paragraph}>
          Welcome to DigitalCV.lk, a service owned and operated by DigitalCV
          (Private) Limited. By accessing or using our website and services, you
          agree to comply with and be bound by the following Terms and
          Conditions. If you do not agree, please do not use our services.
        </p>

        <Section title="1. Company Information">
          <p style={styles.paragraph}>
            DigitalCV.lk is a digital resume platform operated by DigitalCV
            (Private) Limited, a company registered in Sri Lanka.
          </p>
          <p style={styles.paragraph}>
            All references to “DigitalCV”, “we”, “our”, or “us” refer to DigitalCV
            (Private) Limited.
          </p>
        </Section>

        <Section title="2. About the Service">
          <p style={styles.paragraph}>
            DigitalCV.lk converts user-uploaded resumes (PDF, DOC, image, or
            handwritten CVs) into ATS-friendly Digital CVs that can be accessed
            online using a username and 4-digit PIN.
          </p>
        </Section>

        <Section title="3. Eligibility & User Responsibility">
          <ul style={styles.list}>
            <li style={styles.listItem}>Users must provide accurate and lawful information.</li>
            <li style={styles.listItem}>
              Users are solely responsible for keeping their username and PIN confidential.
            </li>
            <li style={styles.listItem}>
              DigitalCV (Private) Limited is not responsible for access gained through shared credentials.
            </li>
          </ul>
        </Section>

        <Section title="4. Digital CV Creation & Access">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Users may upload resumes and preview a non-downloadable Digital CV.
            </li>
            <li style={styles.listItem}>A CV becomes live only after successful payment.</li>
            <li style={styles.listItem}>
              Recruiters can access CVs using the username and PIN provided by the job seeker.
            </li>
          </ul>
        </Section>

        <Section title="5. Payments & Validity">
          <ul style={styles.list}>
            <li style={styles.listItem}>Activation fee: Rs. 2500 for 6 months validity.</li>
            <li style={styles.listItem}>Payments are non-refundable once the CV is activated.</li>
            <li style={styles.listItem}>Expired CVs may be deactivated until renewed.</li>
            <li style={styles.listItem}>Pricing and validity terms may change in the future.</li>
          </ul>
        </Section>

        <Section title="6. CV Updates & Platform Usage">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Users may upload new CVs subject to platform limits.
            </li>
            <li style={styles.listItem}>
              DigitalCV reserves the right to restrict excessive uploads or previews to prevent system abuse.
            </li>
            <li style={styles.listItem}>
              Manual CV replacement or support-based updates are handled at the company’s discretion.
            </li>
          </ul>
        </Section>

        <Section title="7. Username & PIN Policy">
          <ul style={styles.list}>
            <li style={styles.listItem}>Usernames are unique and non-transferable.</li>
            <li style={styles.listItem}>PINs can be changed by the user.</li>
            <li style={styles.listItem}>
              If credentials are leaked or shared, DigitalCV is not liable for resulting access.
            </li>
          </ul>
        </Section>

        <Section title="8. Prohibited Activities">
          <p style={styles.paragraph}>Users must not:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Upload CVs without consent.</li>
            <li style={styles.listItem}>Use false identities or impersonate others.</li>
            <li style={styles.listItem}>Resell DigitalCV services illegally.</li>
            <li style={styles.listItem}>
              Attempt to exploit system previews, APIs, or security.
            </li>
          </ul>
          <p style={styles.paragraph}>
            Violation may result in account suspension or permanent deletion without refund.
          </p>
        </Section>

        <Section title="9. Account Deletion">
          <ul style={styles.list}>
            <li style={styles.listItem}>Users may delete their account at any time.</li>
            <li style={styles.listItem}>
              Once deleted, all CV data is permanently removed.
            </li>
            <li style={styles.listItem}>Deleted usernames may be reused by others.</li>
            <li style={styles.listItem}>Deleted accounts cannot be restored.</li>
          </ul>
        </Section>

        <Section title="10. Intellectual Property">
          <ul style={styles.list}>
            <li style={styles.listItem}>Users retain ownership of their CV content.</li>
            <li style={styles.listItem}>
              All platform designs, systems, watermarking, and branding belong to DigitalCV (Private) Limited.
            </li>
            <li style={styles.listItem}>
              Generated CV formats may not be reused or resold without written permission.
            </li>
          </ul>
        </Section>

        <Section title="11. Service Availability">
          <p style={styles.paragraph}>
            DigitalCV (Private) Limited does not guarantee uninterrupted service and is not
            liable for downtime, technical issues, or data loss beyond reasonable control.
          </p>
        </Section>

        <Section title="12. Limitation of Liability">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              DigitalCV does not guarantee employment, interviews, or hiring outcomes.
            </li>
            <li style={styles.listItem}>
              We are not responsible for recruiter decisions or third-party actions.
            </li>
          </ul>
        </Section>

        <Section title="13. Modifications">
          <p style={styles.paragraph}>
            DigitalCV (Private) Limited may update these Terms at any time. Continued use
            of the service constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="14. Contact Information">
          <p style={styles.paragraph}>📧 support@digitalcv.lk</p>
          <p style={styles.paragraph}>Owned &amp; Operated by DigitalCV (Private) Limited</p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

const styles = {
  page: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Liberation Sans", sans-serif',
    lineHeight: 1.6,
    padding: "24px 16px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
  },
  header: { marginBottom: "14px" },
  title: { margin: 0, fontSize: "28px", fontWeight: 700 },
  updated: { margin: "6px 0 0 0", fontSize: "14px" },
  section: { marginTop: "18px" },
  sectionTitle: { margin: "0 0 8px 0", fontSize: "18px", fontWeight: 700 },
  paragraph: { margin: "0 0 10px 0", fontSize: "15px" },
  list: { margin: "0 0 10px 18px", padding: 0 },
  listItem: { marginBottom: "6px", fontSize: "15px" },
};
