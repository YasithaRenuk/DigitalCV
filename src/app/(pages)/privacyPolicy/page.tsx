import React from "react";

export default function PrivacyPolicy() {
  const lastUpdated = "2024/06/12";

  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>🔐 Privacy Policy</h1>
          <p style={styles.updated}>
            <strong>Last Updated:</strong> [{lastUpdated}]
          </p>
        </header>

        <p style={styles.paragraph}>
          This Privacy Policy explains how DigitalCV.lk, owned and operated by
          DigitalCV (Private) Limited, collects, uses, stores, and protects your
          personal information when you use our platform.
        </p>
        <p style={styles.paragraph}>
          By using DigitalCV.lk, you agree to the practices described in this
          policy.
        </p>

        <Section title="1. Who We Are">
          <p style={styles.paragraph}>
            DigitalCV.lk is an online digital resume platform operated by
            DigitalCV (Private) Limited, Sri Lanka.
          </p>
          <p style={styles.paragraph}>
            All references to “DigitalCV”, “we”, “our”, or “us” refer to DigitalCV
            (Private) Limited.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <SubTitle>a) Information You Provide</SubTitle>
          <p style={styles.paragraph}>When you use our services, we may collect:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Name</li>
            <li style={styles.listItem}>Email address (via Google Login)</li>
            <li style={styles.listItem}>Username and 4-digit PIN</li>
            <li style={styles.listItem}>
              Uploaded CV files (PDF, DOC, image, handwritten CV)
            </li>
            <li style={styles.listItem}>
              Payment confirmation details (we do not store card details)
            </li>
          </ul>

          <SubTitle>b) Automatically Collected Information</SubTitle>
          <ul style={styles.list}>
            <li style={styles.listItem}>IP address</li>
            <li style={styles.listItem}>Device and browser type</li>
            <li style={styles.listItem}>Access time and usage logs</li>
            <li style={styles.listItem}>
              CV access activity (for security and audit purposes)
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p style={styles.paragraph}>We use your information to:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Create and host your Digital CV</li>
            <li style={styles.listItem}>Authenticate users and recruiters</li>
            <li style={styles.listItem}>
              Enable secure CV access via username &amp; PIN
            </li>
            <li style={styles.listItem}>Process payments and manage validity</li>
            <li style={styles.listItem}>Provide customer support</li>
            <li style={styles.listItem}>
              Improve system performance and prevent abuse
            </li>
            <li style={styles.listItem}>
              Comply with legal or regulatory obligations
            </li>
          </ul>
        </Section>

        <Section title="4. CV Access & Visibility">
          <ul style={styles.list}>
            <li style={styles.listItem}>Your Digital CV is private by default.</li>
            <li style={styles.listItem}>
              Only people who know your username and PIN can access your CV.
            </li>
            <li style={styles.listItem}>
              Recruiters can download your CV only after you activate it.
            </li>
            <li style={styles.listItem}>
              DigitalCV does not publicly list or promote your CV.
            </li>
          </ul>
        </Section>

        <Section title="5. CV Content & Ownership">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              You retain full ownership of your CV content.
            </li>
            <li style={styles.listItem}>DigitalCV does not sell or reuse your CV data.</li>
            <li style={styles.listItem}>
              We do not edit CV content beyond formatting for ATS compatibility.
            </li>
          </ul>
        </Section>

        <Section title="6. Payments & Financial Data">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              All payments are processed via secure third-party payment gateways.
            </li>
            <li style={styles.listItem}>
              DigitalCV does not store debit/credit card information.
            </li>
            <li style={styles.listItem}>
              Payment records are stored only for accounting and support purposes.
            </li>
          </ul>
        </Section>

        <Section title="7. Data Storage & Security">
          <p style={styles.paragraph}>
            We take reasonable security measures to protect your data, including:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Secure servers</li>
            <li style={styles.listItem}>Access controls</li>
            <li style={styles.listItem}>Limited admin access</li>
            <li style={styles.listItem}>
              Encrypted authentication mechanisms where applicable
            </li>
          </ul>
          <p style={styles.paragraph}>
            However, no system is 100% secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="8. Username & PIN Responsibility">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              You are responsible for keeping your username and PIN confidential.
            </li>
            <li style={styles.listItem}>
              DigitalCV is not responsible for unauthorized access caused by shared or leaked credentials.
            </li>
            <li style={styles.listItem}>You may change your PIN through your dashboard.</li>
          </ul>
        </Section>

        <Section title="9. Data Retention">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Your CV and account data are stored while your account is active.
            </li>
            <li style={styles.listItem}>
              If your CV expires, data may be retained for a limited time.
            </li>
            <li style={styles.listItem}>
              If you delete your account, all associated data is permanently removed.
            </li>
          </ul>
        </Section>

        <Section title="10. Account Deletion">
          <ul style={styles.list}>
            <li style={styles.listItem}>
              You can delete your account at any time via the dashboard.
            </li>
            <li style={styles.listItem}>
              Once deleted, your CV and personal data cannot be recovered.
            </li>
            <li style={styles.listItem}>Deleted usernames may be reused.</li>
          </ul>
        </Section>

        <Section title="11. Third-Party Services">
          <p style={styles.paragraph}>We use trusted third-party services such as:</p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Google Authentication</li>
            <li style={styles.listItem}>Payment gateways</li>
            <li style={styles.listItem}>AI processing services (for CV formatting)</li>
          </ul>
          <p style={styles.paragraph}>
            These services process data only as required to provide our functionality.
          </p>
        </Section>

        <Section title="12. Legal Disclosure">
          <p style={styles.paragraph}>
            We may disclose information if required by law, court order, or government authority.
          </p>
        </Section>

        <Section title="13. Changes to This Policy">
          <p style={styles.paragraph}>
            DigitalCV (Private) Limited may update this Privacy Policy at any time.
            Continued use of the platform indicates acceptance of the updated policy.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p style={styles.paragraph}>
            If you have questions or concerns about this Privacy Policy:
          </p>
          <p style={styles.paragraph}>📧 support@digitalcv.lk</p>
          <p style={styles.paragraph}>DigitalCV (Private) Limited</p>
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

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={styles.subTitle}>{children}</h3>;
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
  subTitle: { margin: "8px 0 6px 0", fontSize: "15px", fontWeight: 700 },
  paragraph: { margin: "0 0 10px 0", fontSize: "15px" },
  list: { margin: "0 0 10px 18px", padding: 0 },
  listItem: { marginBottom: "6px", fontSize: "15px" },
};
