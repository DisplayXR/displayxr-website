interface DiagramBlockProps {
  children: React.ReactNode;
  title?: string;
}

export function DiagramBlock({ children, title }: DiagramBlockProps) {
  return (
    <div className="my-8">
      {title && (
        <p className="text-sm text-text-secondary mb-3 font-medium">{title}</p>
      )}
      <div className="bg-surface border border-border rounded-lg p-6 overflow-x-auto font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
