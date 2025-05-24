// app/components/Footer.tsx
import { Separator } from "@/components/ui/separator";
import {
  Dribbble,
  Github,
  Twitch,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { title: "Overview", href: "/guideline#overview" },
  { title: "Buyer", href: "/guideline#buyer" },
  { title: "Seller", href: "/guideline#seller" },
  { title: "Admin", href: "/guideline#admin" },
  { title: "Payment", href: "/guideline#payment" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-[#0f0f10] to-[#1a1a1d] text-white w-full mt-24">
      <Separator className="bg-zinc-700" />
      <div className="max-w-screen-xl mx-auto px-4 py-16 flex flex-col items-center gap-8 text-center">
        {/* Logo Title */}
        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-600 tracking-tight">
          Storify
        </div>

        {/* Navigation Links (only the ones with actual FAQ anchors) */}
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
          <Link href="https://dribbble.com" target="_blank" aria-label="Dribbble">
            <Dribbble className="w-5 h-5 text-pink-500 hover:text-fuchsia-600 transition-colors" />
          </Link>
          <Link href="https://twitch.tv" target="_blank" aria-label="Twitch">
            <Twitch className="w-5 h-5 text-pink-500 hover:text-fuchsia-600 transition-colors" />
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-4">
          © 2025 Storify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
