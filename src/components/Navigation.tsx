import { useState, useEffect } from "react";
import { Menu, X, Heart, User, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { Link } from "react-router-dom";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import SearchOverlay from "@/components/SearchOverlay";
import { useMenuStore } from "@/stores/menuStore";

const mobileNavLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Custom Studio", href: "/create" },
  { name: "How To", href: "/how-to" },
  { name: "Contact", href: "/contact" },
  { name: "Nail Club", href: "/club" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoClicked, setIsLogoClicked] = useState(false);

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) {
      setIsLogoClicked(prev => !prev);
    }
  };
  const favoritesCount = useFavoritesStore(state => state.items.length);
  const { user, profile, initialized } = useAuthStore();
  const totalCartItems = useCartStore(state => state.getTotalItems());
  const setMobileNavOpen = useMenuStore(state => state.setMobileNavOpen);
  const isSearchOpen = useMenuStore(state => state.isSearchOpen);
  const setSearchOpen = useMenuStore(state => state.setSearchOpen);

  // Get display initial - prefer profile name, then email, then default
  const getDisplayInitial = () => {
    if (profile?.first_name) return profile.first_name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name) return profile.first_name;
    return 'My Account';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    setMobileNavOpen(isMobileMenuOpen);
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, setMobileNavOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Create", href: "/create" },
    { name: "Nail Club", href: "/club" },
    { name: "How To", href: "/how-to" },
    { name: "Contact", href: "/contact" },
  ];

  // Frosted glass icon style when header is transparent, standard ghost when scrolled
  const iconBtnClass = isMobileMenuOpen
    ? "text-white hover:bg-white/10 transition-all duration-500"
    : isScrolled
      ? "hover:bg-primary/10 transition-all duration-500"
      : "bg-background/80 backdrop-blur-md shadow-md hover:bg-background/90 transition-all duration-500";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled && !isMobileMenuOpen
            ? "bg-background/70 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0" onClick={handleLogoClick}>
              <h1 className={`font-display text-2xl sm:text-3xl lg:text-[2.5rem] font-semibold tracking-tight transition-colors duration-300 lg:hover:text-primary ${isMobileMenuOpen ? 'text-white' : isLogoClicked ? 'text-primary' : ''}`}>
                YourPrettySets
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-10 w-10 ${iconBtnClass}`}
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
              >
                <Search className="h-[22px] w-[22px]" />
              </Button>
              <Link to="/favorites" className="relative">
                <Button variant="ghost" size="icon" className={`rounded-full h-10 w-10 ${iconBtnClass}`}>
                  <Heart className="h-[22px] w-[22px]" />
                </Button>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className={`rounded-full h-10 w-10 ${iconBtnClass}`}>
                  <ShoppingBag className="h-[22px] w-[22px]" />
                </Button>
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                    {totalCartItems > 9 ? '9+' : totalCartItems}
                  </span>
                )}
              </Link>
              <CartDrawer />
              <Link
                to={user && initialized ? "/account" : "/auth"}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-500 rounded-full px-3 py-1.5 ${
                  isScrolled && !isMobileMenuOpen
                    ? "text-foreground/80 hover:text-foreground"
                    : "text-foreground/90 bg-background/80 backdrop-blur-md shadow-md hover:bg-background/90"
                } relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300`}
              >
                <User className="h-4 w-4" />
                {user && initialized ? 'My Account' : 'Sign In'}
              </Link>
            </div>

            {/* Mobile: Hamburger only */}
            <div className="flex lg:hidden items-center">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full h-11 w-11 ${iconBtnClass}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Fashion campaign typography overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-neutral-800/50 backdrop-blur-sm animate-slide-down"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full pb-20 gap-0" onClick={(e) => e.stopPropagation()}>
            {mobileNavLinks.map((link, index) => (
              <div key={link.name} className="flex flex-col items-center">
                {index > 0 && <div className="w-6 h-px bg-white/15 my-1" />}
                <Link
                  to={link.href}
                  className="block py-2.5 px-6 font-display text-4xl font-medium tracking-wide text-white/90 text-center transition-all duration-300 hover:text-white hover:tracking-widest"
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.35), 0 0 16px rgba(0,0,0,0.2)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </div>
            ))}
            <div className="w-10 h-px bg-white/20 mt-6 mb-4" />
            <Link
              to={user && initialized ? "/account" : "/auth"}
              className="flex items-center gap-2.5 font-display text-xl text-white/60 hover:text-white/90 transition-colors duration-300"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="h-5 w-5" />
              {user && initialized ? getDisplayName() : 'Sign In'}
            </Link>
          </div>
        </div>
      )}

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navigation;
