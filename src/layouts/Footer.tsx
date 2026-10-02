// layouts/footer.tsx
import LogoW from "@/organism/LogoW";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Content",
      links: [
        { name: "All Posts", href: "/" },
        { name: "Categories", href: "/categories" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  const socials = [
    { name: "Twitter", href: "https://twitter.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "Instagram", href: "https://instagram.com" },
  ];

  return (
    <footer className="bg-black text-gray-300 pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2 md:col-span-1">
            <LogoW />
            <p className="text-sm text-gray-100 mt-3 max-w-xs">
              Insights on product management and user feedback, written for builders who ship.
            </p>
          </div>

          {footerLinks.map((section, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold mb-3">{section.title}</h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-sm hover:text-orange-400 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-black text-center sm:text-left">
            © {year} Creativity Redefined. All rights reserved.
          </p>
          <div className="flex gap-5">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white hover:text-orange-400 transition-colors"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}