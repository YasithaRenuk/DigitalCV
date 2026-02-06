import React from "react";
import { FileText, Shield, CreditCard, User, AlertTriangle, Scale, Lock, RefreshCw, Slash, Globe, Building } from "lucide-react";

export default function TermsAndConditions() {
  const lastUpdated = "2024/06/12";

  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">
        <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <FileText className="w-8 h-8 text-blue-400" />
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Terms and Conditions</h1>
            <p className="text-gray-300 text-sm font-medium uppercase tracking-wider">
              Last Updated: <span className="text-white">{lastUpdated}</span>
            </p>
          </div>
        </header>

        <div className="p-8 sm:p-12 space-y-12">
          {/* Introduction */}
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
              Welcome to DigitalCV.lk, a service owned and operated by DigitalCV
              (Private) Limited. By accessing or using our website and services, you
              agree to comply with and be bound by the following Terms and
              Conditions. If you do not agree, please do not use our services.
            </p>
          </div>

          <Section title="1. Company Information" icon={<Building className="w-5 h-5" />}>
            <p className="text-gray-600 leading-relaxed">
              DigitalCV.lk is a digital resume platform operated by DigitalCV
              (Private) Limited, a company registered in Sri Lanka. All references to “DigitalCV”, “we”, “our”, or “us” refer to DigitalCV
              (Private) Limited.
            </p>
          </Section>

          <Section title="2. About the Service" icon={<Globe className="w-5 h-5" />}>
            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
              <p className="text-gray-600 leading-relaxed text-center font-medium">
                DigitalCV.lk converts user-uploaded resumes (PDF, DOC, image, or
                handwritten CVs) into ATS-friendly Digital CVs that can be accessed
                online using a username and 4-digit PIN.
              </p>
            </div>
          </Section>

          <Section title="3. Eligibility & User Responsibility" icon={<User className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>Users must provide accurate and lawful information.</ListItem>
              <ListItem>Users are <strong>solely responsible</strong> for keeping their username and PIN confidential.</ListItem>
              <ListItem>DigitalCV (Private) Limited is not responsible for access gained through shared credentials.</ListItem>
            </ul>
          </Section>

          <Section title="4. Digital CV Creation & Access" icon={<Lock className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>Users may upload resumes and preview a non-downloadable Digital CV.</ListItem>
              <ListItem>A CV becomes live only after successful payment.</ListItem>
              <ListItem>Recruiters can access CVs using the username and PIN provided by the job seeker.</ListItem>
            </ul>
          </Section>

          <Section title="5. Payments & Validity" icon={<CreditCard className="w-5 h-5" />}>
            <div className="bg-green-50/50 rounded-xl p-6 border border-green-100">
               <ul className="space-y-3">
                <ListItem>Activation fee: <span className="font-semibold text-green-700">Rs. 2500</span> for 6 months validity.</ListItem>
                <ListItem>Payments are non-refundable once the CV is activated.</ListItem>
                <ListItem>Expired CVs may be deactivated until renewed.</ListItem>
                <ListItem>Pricing and validity terms may change in the future.</ListItem>
              </ul>
            </div>
          </Section>

          <Section title="6. CV Updates & Platform Usage" icon={<RefreshCw className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>Users may upload new CVs subject to platform limits.</ListItem>
              <ListItem>DigitalCV reserves the right to restrict excessive uploads or previews to prevent system abuse.</ListItem>
              <ListItem>Manual CV replacement or support-based updates are handled at the company’s discretion.</ListItem>
            </ul>
          </Section>

          <Section title="7. Username & PIN Policy" icon={<Shield className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>Usernames are unique and non-transferable.</ListItem>
              <ListItem>PINs can be changed by the user.</ListItem>
              <ListItem>If credentials are leaked or shared, DigitalCV is not liable for resulting access.</ListItem>
            </ul>
          </Section>

          <Section title="8. Prohibited Activities" icon={<Slash className="w-5 h-5" />}>
            <div className="bg-red-50/50 rounded-xl p-6 border border-red-100">
              <p className="text-gray-800 font-medium mb-4">Users must not:</p>
              <ul className="space-y-3 mb-6">
                <ListItem>Upload CVs without consent.</ListItem>
                <ListItem>Use false identities or impersonate others.</ListItem>
                <ListItem>Resell DigitalCV services illegally.</ListItem>
                <ListItem>Attempt to exploit system previews, APIs, or security.</ListItem>
              </ul>
              <p className="text-red-600 text-sm font-medium border-t border-red-100 pt-4">
                Violation may result in account suspension or permanent deletion without refund.
              </p>
            </div>
          </Section>

          <Section title="9. Account Deletion" icon={<User className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>Users may delete their account at any time.</ListItem>
              <ListItem>Once deleted, all CV data is <strong>permanently removed</strong>.</ListItem>
              <ListItem>Deleted usernames may be reused by others.</ListItem>
              <ListItem>Deleted accounts cannot be restored.</ListItem>
            </ul>
          </Section>

          <Section title="10. Intellectual Property" icon={<Scale className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>Users retain ownership of their CV content.</ListItem>
              <ListItem>All platform designs, systems, watermarking, and branding belong to DigitalCV.</ListItem>
              <ListItem>Generated CV formats may not be reused or resold without written permission.</ListItem>
            </ul>
          </Section>

          <Section title="11. Disclaimers & Liability" icon={<AlertTriangle className="w-5 h-5" />}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Availability</h3>
                <p className="text-gray-600 leading-relaxed">
                  DigitalCV (Private) Limited does not guarantee uninterrupted service and is not
                  liable for downtime, technical issues, or data loss beyond reasonable control.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
                <ul className="space-y-3">
                  <ListItem>DigitalCV does not guarantee employment, interviews, or hiring outcomes.</ListItem>
                  <ListItem>We are not responsible for recruiter decisions or third-party actions.</ListItem>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="12. Modifications" icon={<RefreshCw className="w-5 h-5" />}>
            <p className="text-gray-600 leading-relaxed">
              DigitalCV (Private) Limited may update these Terms at any time. Continued use
              of the service constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <div className="border-t border-gray-100 my-8"></div>

          <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Questions?</h2>
            <p className="text-gray-300 mb-4">Contact us for any clarifications regarding these terms.</p>
             <a href="mailto:support@digitalcv.lk" className="text-2xl font-bold hover:text-blue-400 transition-colors">
              support@digitalcv.lk
            </a>
            <p className="text-gray-400 mt-4 text-sm">Owned & Operated by DigitalCV (Private) Limited</p>
          </div>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <section className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-6">
        {icon && <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</span>}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
     <li className="flex items-start gap-3 text-gray-600">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}
