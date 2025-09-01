
import React from "react";

const TipTapRenderer = ({ content }) => {
  if (!content) return null;

  let jsonContent;
  try {
    jsonContent = typeof content === "string" ? JSON.parse(content) : content;
  } catch (error) {
    console.error("Invalid JSON content:", error);
    return <div>Invalid content</div>;
  }

  const renderNode = (node, index = 0) => {
    if (!node) return null;

    const { type, content: nodeContent, attrs, marks } = node;

    // Handle text nodes
    if (type === "text") {
      let text = node.text;

      // Apply marks
      if (marks) {
        marks.forEach((mark) => {
          switch (mark.type) {
            case "bold":
              text = (
                <strong key={index} className="font-bold">
                  {text}
                </strong>
              );
              break;
            case "italic":
              text = (
                <em key={index} className="italic">
                  {text}
                </em>
              );
              break;
            case "code":
              text = (
                <code
                  key={index}
                  className="px-2 py-1 rounded font-mono text-sm"
                >
                  {text}
                </code>
              );
              break;
            case "strike":
              text = (
                <span key={index} className="line-through">
                  {text}
                </span>
              );
              break;
            case "underline":
              text = (
                <span key={index} className="underline">
                  {text}
                </span>
              );
              break;
            case "highlight":
              const highlightColor = mark.attrs?.color || "#ffeb3b";
              text = (
                <span
                  key={index}
                  className="p-1 rounded-md"
                  style={{ backgroundColor: highlightColor }}
                >
                  {text}
                </span>
              );
              break;
            case "link":
              const linkHref = mark.attrs?.href || "#";
              const linkTarget = mark.attrs?.target || "_blank";
              text = (
                <a
                  key={index}
                  href={linkHref}
                  target={linkTarget}
                  rel="noopener noreferrer"
                  className="text-blue-600 no-underline hover:underline"
                >
                  {text}
                </a>
              );
              break;
            case "subscript":
              text = (
                <sub key={index} className="align-sub">
                  {text}
                </sub>
              );
              break;
            case "superscript":
              text = (
                <sup key={index} className="align-super">
                  {text}
                </sup>
              );
              break;
          }
        });
      }

      return text;
    }

    // Handle block nodes
    switch (type) {
      case "doc":
        return (
          <div key={index}>
            {nodeContent?.map((child, i) => renderNode(child, i))}
          </div>
        );

      case "paragraph":
        const align = attrs?.textAlign || "left";
        
        return (
          <p key={index} className={`leading-relaxed text-${align}`}>
            {nodeContent?.map((child, i) => renderNode(child, i)) || <br />}
          </p>
        );

      case "heading":
        const HeadingTag = `h${attrs?.level || 4}`;
        const headingClasses = {
          1: "text-3xl font-extrabold mb-4 mt-6 ",
          2: "text-2xl font-bold mb-3 mt-5 ",
          3: "text-xl font-semibold mb-3 mt-4 ",
          4: "text-lg font-normal mb-2 mt-3 ",
        };

        return React.createElement(
          HeadingTag,
          {
            key: index,
            className:
              headingClasses[attrs.level] || "text-lg font-semibold mb-2 mt-3",
          },
          nodeContent?.map((child, i) => renderNode(child, i))
        );

      case "blockquote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic"
          >
            {nodeContent?.map((child, i) => renderNode(child, i))}
          </blockquote>
        );

      case "bulletList":
        return (
          <ul key={index} className="list-disc ml-6 mb-4">
            {nodeContent?.map((child, i) => renderNode(child, i))}
          </ul>
        );

      case "orderedList":
        return (
          <ol key={index} className="list-decimal ml-6 mb-4">
            {nodeContent?.map((child, i) => renderNode(child, i))}
          </ol>
        );

      case "listItem":
        return (
          <li key={index} className="mb-2">
            {nodeContent?.map((child, i) => renderNode(child, i))}
          </li>
        );

      case "taskList":
        return (
          <ul key={index} className="list-none pl-0 mb-4" data-type="taskList">
            {nodeContent?.map((child, i) => renderNode(child, i))}
          </ul>
        );

      case "taskItem":
        return (
          <li key={index} className="mb-2 flex items-center">
            {node.attrs?.checked !== undefined && (
              <input
                type="checkbox"
                checked={node.attrs.checked}
                readOnly
                className="mr-2 "
              />
            )}
            <div>{nodeContent?.map((child, i) => renderNode(child, i))}</div>
          </li>
        );

      case "codeBlock":
        return (
          <pre
            key={index}
            className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"
          >
            <code>{nodeContent?.map((child, i) => renderNode(child, i))}</code>
          </pre>
        );

      case "image":
        return (
          <img
            key={index}
            src={attrs.src}
            alt={attrs.alt || ""}
            className="max-w-full h-auto rounded-lg shadow-md mx-auto my-6 block"
          />
        );

      default:
        return (
          <div key={index}>
            {nodeContent?.map((child, i) => renderNode(child, i))}
          </div>
        );
    }
  };

  return renderNode(jsonContent);
};

export default TipTapRenderer;
