import React from "react";

export function renderMarkdownLinks(
  input: string,
  classNameLink?: string,
  classNameText?: string
) {
  if (!input) return null;

  const md = /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;
  const trimmed = input.trim();

  // формат: [Текст](https://ссылка)
  if (md.test(trimmed)) {
    const [, text, href] = trimmed.match(md)!;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classNameLink}>
        {text}
      </a>
    );
  }

  // формат: "Текст | https://ссылка"
  const parts = input.split("|");
  if (parts.length === 2) {
    const text = parts[0].trim();
    const href = parts[1].trim();
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classNameLink}>
        {text}
      </a>
    );
  }

  return <span className={classNameText}>{input}</span>;
}
