import MarkdownIt from "markdown-it";
import HighlightJS from "highlight.js";
import { ReactNode } from "react";
import slugify from "@sindresorhus/slugify";
import mdit_anchor from "markdown-it-anchor";
import mdit_mathjax from "markdown-it-mathjax3";
import htmr from "htmr";
import AllenyouLink from "@/components/AllenyouLink";
import LazyloadImage from "@/components/LazyloadImage";

export const hljs = (str: string, lang: string): string => {
	const l = HighlightJS.getLanguage(lang);
	try {
		return HighlightJS.highlight(str, {
			language: l === undefined ? "plaintext" : lang,
		}).value;
	} catch (__) {}
	return "";
};

export const mdit = MarkdownIt({
	highlight: hljs,
	html: true,
})
	.enable("table")
	.use(mdit_mathjax)
	.use(mdit_anchor, {
		slugify: (s: string) => {
			return `content-${slugify(s)}`;
		},
	});

function parseMarkdownToHtml(markdown: string): string {
	return mdit.render(markdown);
}

export default function parseMarkdown(
	markdown: string
): ReactNode[] | ReactNode {
	const html = parseMarkdownToHtml(markdown);
	// console.log(html);
	return htmr(html, {
		transform: {
			a: AllenyouLink,
			img: LazyloadImage,
		},
	});
}
