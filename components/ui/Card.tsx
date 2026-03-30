interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function Card({ title, icon, children, className = "", href }: CardProps) {
  const interactive = !!href;
  const content = (
    <div
      className={`bg-surface border border-border rounded-lg p-6 ${
        interactive ? "card-interactive cursor-pointer" : ""
      } ${className}`}
    >
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-3">
          {icon && <div className="text-accent">{icon}</div>}
          {title && (
            <h3 className="text-lg font-semibold text-text-primary">
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
    </div>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return <a href={href}>{content}</a>;
  }

  return content;
}
