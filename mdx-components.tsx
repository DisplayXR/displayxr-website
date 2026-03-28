import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary mt-12 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold tracking-tight text-text-primary mt-10 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold tracking-tight text-text-primary mt-8 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-text-secondary leading-[1.7] mb-4">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-text-secondary leading-[1.7] mb-4 space-y-1">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-text-secondary leading-[1.7] mb-4 space-y-1">
        {children}
      </ol>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-accent hover:text-accent-hover underline underline-offset-2"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-surface text-accent px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-surface border border-border rounded-lg p-4 overflow-x-auto mb-4 font-mono text-sm">
        {children}
      </pre>
    ),
    strong: ({ children }) => (
      <strong className="text-text-primary font-semibold">{children}</strong>
    ),
    ...components,
  };
}
