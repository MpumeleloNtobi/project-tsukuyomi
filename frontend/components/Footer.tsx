import { Separator } from "@/components/ui/separator";
import { Dribbble, Github, Twitch, Twitter } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { title: "Overview", href: "#" },
  { title: "Features", href: "#" },
  { title: "Pricing", href: "#" },
  { title: "Help", href: "#" },
  { title: "Privacy", href: "#" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-t from-[#0f0f10] to-[#1a1a1d] text-white mt-24">
      <Separator className="bg-zinc-700" />
      <div className="max-w-screen-xl mx-auto px-4 py-16 flex flex-col items-center gap-8 text-center">
        {/* Logo Title */}
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-600 tracking-tight">
          Storify
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          {footerLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 mt-4">
          <Link href="https://github.com" target="_blank" aria-label="GitHub">
            <Github className="w-5 h-5 text-pink-500 hover:text-fuchsia-600 transition-colors" />
          </Link>
          <Link href="https://twitter.com" target="_blank" aria-label="Twitter">
            <Twitter className="w-5 h-5 text-pink-500 hover:text-fuchsia-600 transition-colors" />
          </Link>
          <Link
            href="https://dribbble.com"
            target="_blank"
            aria-label="Dribbble"
          >
            <Dribbble className="w-5 h-5 text-pink-500 hover:text-fuchsia-600 transition-colors" />
          </Link>
          <Link href="https://twitch.tv" target="_blank" aria-label="Twitch">
            <Twitch className="w-5 h-5 text-pink-500 hover:text-fuchsia-600 transition-colors" />
          </Link>
        </div>

        {}
        <p className="text-xs text-gray-500 mt-4">
          © 2025 Storify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
