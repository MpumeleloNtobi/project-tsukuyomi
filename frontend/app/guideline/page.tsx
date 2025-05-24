"use client";

import Link from "next/link";

const sections = [
  {
    id: "what-is-storify",
    title: "What is Storify?",
    content:
      "Storify is a digital marketplace that connects skilled local individuals with customers. Whether you're an artisan, designer, or seller, Storify empowers you to showcase and sell your products with ease.",
   
  },
  {
    id: "overview",
    title: "Overview",
    content:
      "The platform provides a simple, beautiful interface to browse, buy, and manage your store. Discover featured products, trending sellers, and personalized recommendations.",
    faqHref: "/faq", 
  },
  {
    id: "buyer",
    title: "Buyer",
    content:
      "As a buyer, you can browse artisan shops, add items to your cart, and complete secure checkout. We provide order tracking and customer support to make your experience seamless and fun.",
    faqHref: "/faq#buyer",
  },
  {
    id: "seller",
    title: "Seller",
    content:
      "As a seller (artisan), you can create and manage your own shop, list products, set pricing, and process orders. Use your dashboard to track sales, handle returns, and communicate with customers.",
    faqHref: "/faq#artisan",
  },
  {
    id: "admin",
    title: "Admin",
    content:
      "Admin users oversee the platform: approve artisan registrations, manage disputes, monitor performance metrics, and update site-wide policies. Admin tools ensure everything runs smoothly behind the scenes.",
    faqHref: "/faq#admin",
  },
  {
    id: "privacy",
    title: "Privacy",
    content:
      "We respect your privacy. All personal data is encrypted and stored securely. We do not sell your information to third parties. You can review and delete your data at any time in account settings.",
    
  },
  {
    id: "payment",
    title: "Payment",
    content:
      "We support multiple secure payment options including credit/debit cards, mobile money, and PayPal. Payments are processed instantly and safely — learn more about refunds and disputes below.",
    faqHref: "/faq#payment",
  },
];

export default function GuidelinePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-3xl mx-auto py-16 px-6">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-pink-500 to-fuchsia-600 text-transparent bg-clip-text">
          Storify Guidelines
        </h1>

        {/* Table of Contents */}
        <nav className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Jump to section</h2>
          <div className="bg-gray-800 rounded-lg p-4">
            <ul className="space-y-3 text-base text-purple-400">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="hover:underline hover:text-purple-200 transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Guideline Sections */}
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-gray-900 rounded-xl p-8 shadow-md scroll-mt-24"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {section.title}
              </h2>
              <p className="leading-relaxed text-gray-300 mb-4">
                {section.content}
              </p>
              {section.faqHref && (
                <Link
                  href={section.faqHref}
                  className="inline-block text-sm text-blue-400 hover:text-blue-200 underline transition-colors"
                >
                  View related FAQs
                </Link>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
