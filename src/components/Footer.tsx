import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

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
    <footer className="bg-foreground text-background">
      {/* Newsletter Section */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-primary-foreground mb-3">
              Join the Nail Drop Club
            </h3>
            <p className="text-primary-foreground/80 mb-6 text-sm sm:text-base">
              Get exclusive access to new designs, special offers, and nail care tips delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-full px-6"
              />
              <Button 
                type="submit" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-display text-xl sm:text-2xl font-semibold mb-4">
              YourPrettySets
            </h2>
            <p className="text-background/60 text-sm mb-6 leading-relaxed">
              Handcrafted luxury press-on nails designed to make every moment beautiful.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@yourprettysets.com"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-background text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-background text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-background text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2024 YourPrettySets. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-background/50">
            <a href="/privacy" className="hover:text-background transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-background transition-colors">
              Terms
            </a>
            <a href="/accessibility" className="hover:text-background transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;