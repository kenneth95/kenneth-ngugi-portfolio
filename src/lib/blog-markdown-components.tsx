/* eslint-disable @next/next/no-img-element */
import type { Components } from "react-markdown";
import { CodeBlock } from "@/components/mdx/code-block";

export const blogMarkdownComponents: Components = {
  pre: ({ node, ...props }) => <CodeBlock {...props} />,

  hr: ({ node, ...props }) => (
    <div className="my-10 flex w-full items-center" {...props}>
      <div
        className="flex-1 h-px bg-border"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      />
    </div>
  ),

  table: ({ node, ...props }) => (
    <div className="my-6 border border-border rounded-xl overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table
          className="m-0! w-full min-w-full border-separate border-spacing-0"
          {...props}
        />
      </div>
    </div>
  ),

  code: ({ node, className, children, ...props }) => {
    const isBlock = /language-/.test(className ?? "");

    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-muted/60 dark:bg-muted/40 text-sm font-mono text-foreground/90"
        {...props}
      >
        {children}
      </code>
    );
  },

  img: ({ node, alt, ...props }) => (
    <img className="rounded-lg" alt={alt ?? ""} {...props} />
  ),
};
