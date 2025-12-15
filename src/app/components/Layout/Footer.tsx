'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-white shadow-[0_-4px_6px_-1px_var(--tw-shadow-color)] shadow-primary mt-1">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-gray-700 text-sm">
        <p className="mb-2 sm:mb-0 text-center sm:text-left">
          © 2025 ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-4">
          <a href="/TAC" className="hover:text-primary transition-colors">
            T &amp; C
          </a>
          <a href="/privacyPolicy" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a
            href="/contactus"
            className="hover:text-primary transition-colors font-medium"
          >
            Contact Us
          </a>
          {/* <span className="text-[10px] mt-2 hidden md:block">
            Powerd by Rootfo
          </span> */}
        </div>
          {/* <span className="text-[10px] mt-2 block md:hidden">
            Powerd by Rootfo
          </span> */}
      </div>
    </footer>
  );
}
