import Markdown from "react-markdown";

/** CommonMark only: no raw HTML, executable MDX, or remote image embeds. */
export function GuideMarkdown({ children }: { children?: string }) {
  return <Markdown skipHtml disallowedElements={["img"]}>{children}</Markdown>;
}
