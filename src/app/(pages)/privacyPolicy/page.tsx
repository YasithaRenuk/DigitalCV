import React from "react";
import { Shield, Mail, Lock, FileText, CreditCard, User, Server, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "2024/06/12";

  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">
        <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Shield className="w-8 h-8 text-blue-400" />
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Privacy Policy</h1>
            <p className="text-gray-300 text-sm font-medium uppercase tracking-wider">
              Last Updated: <span className="text-white">{lastUpdated}</span>
            </p>
          </div>
        </header>

        <div className="p-8 sm:p-12 space-y-12">
          {/* Introduction */}
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
              This Privacy Policy explains how DigitalCV.lk, owned and operated by
              DigitalCV (Private) Limited, collects, uses, stores, and protects your
              personal information when you use our platform. By using DigitalCV.lk, you agree to the practices described in this policy.
            </p>
          </div>

          <Section title="1. Who We Are" icon={<User className="w-5 h-5" />}>
            <p className="text-gray-600 leading-relaxed">
              DigitalCV.lk is an online digital resume platform operated by
              DigitalCV (Private) Limited, Sri Lanka. All references to “DigitalCV”, “we”, “our”, or “us” refer to DigitalCV
              (Private) Limited.
            </p>
          </Section>

          <Section title="2. Information We Collect" icon={<FileText className="w-5 h-5" />}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <SubTitle>a) Information You Provide</SubTitle>
                <p className="text-gray-600 mb-4">When you use our services, we may collect:</p>
                <ul className="space-y-2">
                  <ListItem>Name</ListItem>
                  <ListItem>Email address (via Google Login)</ListItem>
                  <ListItem>Username and 4-digit PIN</ListItem>
                  <ListItem>Uploaded CV files</ListItem>
                  <ListItem>Payment confirmation details</ListItem>
                </ul>
              </div>
              
              <div>
                <SubTitle>b) Automatically Collected</SubTitle>
                <p className="text-gray-600 mb-4">We automatically collect certain data:</p>
                <ul className="space-y-2">
                  <ListItem>IP address</ListItem>
                  <ListItem>Device and browser type</ListItem>
                  <ListItem>Access time and usage logs</ListItem>
                  <ListItem>CV access activity</ListItem>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="3. How We Use Your Information" icon={<Server className="w-5 h-5" />}>
            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
              <ul className="grid sm:grid-cols-2 gap-4">
                <ListItem>Create and host your Digital CV</ListItem>
                <ListItem>Authenticate users and recruiters</ListItem>
                <ListItem>Enable secure CV access via PIN</ListItem>
                <ListItem>Process payments and manage validity</ListItem>
                <ListItem>Provide customer support</ListItem>
                <ListItem>Improve system performance</ListItem>
                <ListItem>Comply with legal obligations</ListItem>
              </ul>
            </div>
          </Section>

          <Section title="4. CV Access & Visibility" icon={<Lock className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>Your Digital CV is <strong>private by default</strong>.</ListItem>
              <ListItem>Only people who know your username and PIN can access your CV.</ListItem>
              <ListItem>Recruiters can download your CV only after you activate it.</ListItem>
              <ListItem>DigitalCV does not publicly list or promote your CV.</ListItem>
            </ul>
          </Section>

          <Section title="5. CV Content & Ownership" icon={<FileText className="w-5 h-5" />}>
            <ul className="space-y-3">
              <ListItem>You retain full ownership of your CV content.</ListItem>
              <ListItem>DigitalCV does not sell or reuse your CV data.</ListItem>
              <ListItem>We do not edit CV content beyond formatting for ATS compatibility.</ListItem>
            </ul>
          </Section>

          <Section title="6. Payments & Financial Data" icon={<CreditCard className="w-5 h-5" />}>
            <div className="bg-yellow-50/50 rounded-xl p-6 border border-yellow-100">
              <ul className="space-y-3">
                <ListItem>All payments are processed via secure third-party payment gateways.</ListItem>
                <ListItem>DigitalCV <strong>does not store</strong> debit/credit card information.</ListItem>
                <ListItem>Payment records are stored only for accounting and support purposes.</ListItem>
              </ul>
            </div>
          </Section>

          <Section title="7. Data Storage & Security" icon={<Shield className="w-5 h-5" />}>
            <p className="text-gray-600 mb-4">
              We take reasonable security measures to protect your data, including secure servers, access controls, and encryption.
            </p>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
              <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <p>However, no system is 100% secure, and we cannot guarantee absolute security.</p>
            </div>
          </Section>

          <Section title="8. Account & Data Management" icon={<User className="w-5 h-5" />}>
            <div className="space-y-6">
              <div>
                <SubTitle>Username & PIN</SubTitle>
                <ul className="space-y-2">
                  <ListItem>Keep your username and PIN confidential.</ListItem>
                  <ListItem>We are not responsible for unauthorized access via shared credentials.</ListItem>
                </ul>
              </div>
              
              <div>
                <SubTitle>Data Retention & Deletion</SubTitle>
                <ul className="space-y-2">
                  <ListItem>Data is stored while your account is active.</ListItem>
                  <ListItem>Expired CV data may be retained for a limited time.</ListItem>
                  <ListItem>Account deletion permanently removes all associated data.</ListItem>
                </ul>
              </div>
            </div>
          </Section>

          <div className="border-t border-gray-100 my-8"></div>

          <Section title="Contact Us" icon={<Mail className="w-5 h-5" />}>
            <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
              <p className="text-gray-300 mb-4">If you have questions about this Privacy Policy, please contact us:</p>
              <a href="mailto:support@digitalcv.lk" className="text-2xl font-bold hover:text-blue-400 transition-colors">
                support@digitalcv.lk
              </a>
              <p className="text-gray-400 mt-4 text-sm">DigitalCV (Private) Limited</p>
            </div>
          </Section>
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

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-gray-800 mb-3">{children}</h3>;
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-gray-600">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}
