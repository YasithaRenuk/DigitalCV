'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-white shadow-[0_-4px_6px_-1px_var(--tw-shadow-color)] shadow-primary mt-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-gray-700 text-sm">
        <p className="mb-2 sm:mb-0 text-center sm:text-left">
          © 2025 ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">
            T &amp; C
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a
            href="/contact"
            className="hover:text-primary transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
