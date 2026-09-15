import Markdown from "react-markdown";

/** CommonMark only: no raw HTML or executable MDX. Contextual images render as figures with captions. */
export function GuideMarkdown({ children }: { children?: string }) {
  return (
    <Markdown
      skipHtml
      components={{
        img: ({ src, alt }) => (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt || ""} loading="lazy" decoding="async" />
            {alt ? <figcaption>{alt}</figcaption> : null}
          </figure>
        ),
      }}
    >
      {children}
    </Markdown>
  );
}
