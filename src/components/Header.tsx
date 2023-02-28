import { Github, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const navLinks = [
  {
    name: "Github",
    icon: <Github aria-hidden="true" className="h-6 w-6" />,
    href: "https://github.com/sadmann7/game-rec.git",
    isExternal: true,
  },
];

const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // handle scroll
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      aria-label="header"
      className={`fixed top-0 left-0 z-20 flex w-full items-center gap-4 ${
        isScrolled
          ? "bg-neutral-500/80 shadow-md backdrop-blur-md backdrop-saturate-150 backdrop-filter transition-all duration-300 ease-in-out"
          : "bg-transparent"
      }`}
      onScroll={handleScroll}
    >
      <nav className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          aria-label="navigate to home page"
          href="/"
          className="flex items-center gap-2 text-gray-100 transition-colors hover:text-white active:text-gray-100"
        >
          <ImageIcon aria-hidden="true" className="h-6 w-6" />
          <span className="text-xl font-medium">PhotoTweak</span>
        </Link>
        <div className="flex items-center gap-2">
          {navLinks.map((link, index) =>
            link.isExternal ? (
              <a
                aria-label={`navigate to ${link.name} page`}
                key={index}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-transparent p-1.5 font-mono text-base text-white transition-colors hover:text-violet-500 active:text-violet-300"
              >
                {link.icon}
              </a>
            ) : (
              <Link
                aria-label={`navigate to ${link.name} page`}
                key={index}
                href={link.href}
                className={`rounded-md p-1.5 font-mono text-base transition-colors hover:text-violet-500 active:text-violet-300 ${
                  router.pathname === link.href
                    ? "text-violet-500"
                    : "text-white"
                }`}
              >
                {link.icon}
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
