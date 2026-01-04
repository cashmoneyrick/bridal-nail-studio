import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Mail, MapPin, Phone, Check } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "All Sets", href: "/shop" },
      { name: "Everyday", href: "/shop/everyday" },
      { name: "Occasions", href: "/shop/occasions" },
      { name: "Artistic", href: "/shop/artistic" },
      { name: "Gift Cards", href: "/gift-cards" },
    ],
    help: [
      { name: "Sizing Guide", href: "/sizing" },
      { name: "Application Tips", href: "/how-to" },
      { name: "Care Instructions", href: "/care" },
      { name: "FAQ", href: "/faq" },
      { name: "Returns", href: "/returns" },
    ],
    company: [
      { name: "Our Story", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Nail Drop Club", href: "/club" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="bg-foreground text-background w-full max-w-full overflow-hidden">
      {/* Newsletter Section */}
      <div className="bg-primary relative overflow-hidden">
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-primary-foreground mb-4 tracking-tight">
              Join the Nail Drop Club
            </h3>
            {/* Benefits List */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-lg mx-auto mt-4 mb-6">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-primary-foreground">17% off first order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-primary-foreground">Free shipping over $65</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-primary-foreground">Early access to collections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-primary-foreground">Priority member shipping</span>
              </li>
            </ul>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-14 flex-1 bg-[#FDF8F5] border-0 text-primary placeholder:text-primary/60 rounded-2xl px-6 text-base shadow-sm focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary transition-all"
              />
              <Button
                type="submit"
                variant="ghost"
                className="h-14 bg-white text-primary shadow-md hover:bg-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm rounded-2xl px-10 font-semibold transition-all duration-200"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-white/70 mt-3">
              No spam, just pretty nails ✨
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-5 tracking-tight">
              YourPrettySets
            </h2>
            <p className="text-background/70 text-base mb-8 leading-relaxed">
              Handcrafted luxury press-on nails designed to make every moment beautiful.
            </p>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-background/50 font-medium">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-background/5 border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 group-hover:text-primary-foreground" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-background/5 border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 group-hover:text-primary-foreground" />
                </a>
                <a
                  href="mailto:hello@yourprettysets.com"
                  className="w-11 h-11 rounded-xl bg-background/5 border border-background/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 group"
                >
                  <Mail className="w-5 h-5 group-hover:text-primary-foreground" />
                </a>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-background/80 mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary text-base transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-background/80 mb-6">
              Help
            </h4>
            <ul className="space-y-4">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary text-base transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-background/80 mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary text-base transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-16 pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-background/40 text-sm">
            © 2024 YourPrettySets. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-sm text-background/40">
            <a href="/privacy" className="hover:text-primary transition-colors duration-300">
              Privacy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors duration-300">
              Terms
            </a>
            <a href="/accessibility" className="hover:text-primary transition-colors duration-300">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;