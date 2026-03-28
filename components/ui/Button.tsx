import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "secondary";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover",
    secondary:
      "border border-border text-text-primary hover:border-accent hover:text-accent",
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}
