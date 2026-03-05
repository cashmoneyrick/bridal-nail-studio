import { Link } from "react-router-dom";

const Create = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9f6" }}>
      {/* Logo */}
      <header className="px-6 py-6 sm:px-10 sm:py-8">
        <Link to="/" className="inline-block">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "#c26871" }}>
            YourPrettySets
          </h1>
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight" style={{ color: "#c26871" }}>
            Custom Studio
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-neutral-400 font-light tracking-wide">
            Coming Soon
          </p>
        </div>
      </main>
    </div>
  );
};

export default Create;
