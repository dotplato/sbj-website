import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";

interface RichTextRendererProps {
  content: string | RichTextDocument | null | undefined;
  /** Extra className applied to the wrapper div */
  className?: string;
  /** Variant controls colour/size theme */
  variant?: "blog" | "product";
}

/** Contentful Rich Text → React elements with nice typography */
export default function RichTextRenderer({
  content,
  className = "",
  variant = "blog",
}: RichTextRendererProps) {
  // ── Nothing to render ──────────────────────────────────────────────────
  if (!content) {
    return (
      <span className="text-gray-400 italic">Content coming soon.</span>
    );
  }

  // ── Plain string fallback (e.g. legacy Short Text fields) ──────────────
  if (typeof content === "string") {
    return (
      <div className={`whitespace-pre-wrap text-sm leading-relaxed ${className}`}>
        {content}
      </div>
    );
  }

  // ── Contentful Rich Text document ──────────────────────────────────────
  const blogOptions: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong className="font-semibold text-gray-900">{text}</strong>,
      [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u className="underline">{text}</u>,
      [MARKS.CODE]: (text) => (
        <code className="bg-gray-100 text-gray-800 text-[0.85em] px-1.5 py-0.5 rounded font-mono">
          {text}
        </code>
      ),
    },
    renderNode: {
      [BLOCKS.HEADING_1]: (_node, children) => (
        <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 leading-snug">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (_node, children) => (
        <h2 className="text-2xl font-bold text-gray-900 mt-7 mb-3 leading-snug">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3 leading-snug">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (_node, children) => (
        <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-2">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (_node, children) => (
        <h5 className="text-base font-semibold text-gray-700 mt-4 mb-2">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (_node, children) => (
        <h6 className="text-sm font-semibold text-gray-700 mt-3 mb-2">{children}</h6>
      ),
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">{children}</p>
      ),
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul className="list-disc list-outside ml-5 mb-4 space-y-1 text-sm sm:text-base text-gray-700">
          {children}
        </ul>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 text-sm sm:text-base text-gray-700">
          {children}
        </ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node, children) => (
        <li className="leading-relaxed">{children}</li>
      ),
      [BLOCKS.QUOTE]: (_node, children) => (
        <blockquote className="border-l-4 border-[#C6A15B] pl-5 my-6 italic text-gray-600 text-base">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-8 border-gray-200" />,
      [INLINES.HYPERLINK]: (node, children) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C6A15B] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {children}
        </a>
      ),
    },
  };

  const productOptions: Options = {
    ...blogOptions,
    renderNode: {
      ...blogOptions.renderNode,
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="text-sm text-[#5a7a9a] leading-relaxed mb-3">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (_node, children) => (
        <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h2>
      ),
      [BLOCKS.HEADING_2]: (_node, children) => (
        <h3 className="text-lg font-bold text-gray-800 mt-5 mb-2">{children}</h3>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <h4 className="text-base font-semibold text-gray-700 mt-4 mb-2">{children}</h4>
      ),
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul className="list-disc list-outside ml-5 mb-3 space-y-1 text-sm text-[#5a7a9a]">
          {children}
        </ul>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol className="list-decimal list-outside ml-5 mb-3 space-y-1 text-sm text-[#5a7a9a]">
          {children}
        </ol>
      ),
      [BLOCKS.QUOTE]: (_node, children) => (
        <blockquote className="border-l-4 border-[#C6A15B] pl-4 my-4 italic text-gray-500 text-sm">
          {children}
        </blockquote>
      ),
    },
  };

  const options = variant === "product" ? productOptions : blogOptions;

  return (
    <div className={className}>
      {documentToReactComponents(content as RichTextDocument, options)}
    </div>
  );
}
