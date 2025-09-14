import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import Prism from 'prismjs';

// Load language components for syntax highlighting in dependency order
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-clike.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-rust.js';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-docker.js';

import type { BlogPostMeta } from '../types/index.js';

// Language alias mapping for better compatibility
const languageAliases: { [key: string]: string } = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  powershell: 'bash',
  ps1: 'bash',
  js: 'javascript',
  ts: 'typescript',
  yml: 'yaml',
  html: 'markup',
  xml: 'markup',
  dockerfile: 'docker',
};

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string): string => {
    if (!lang) {
      return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }

    // Normalize language name
    const normalizedLang =
      languageAliases[lang.toLowerCase()] || lang.toLowerCase();

    // Try to highlight with Prism
    if (normalizedLang && Prism.languages[normalizedLang]) {
      try {
        const highlightedCode = Prism.highlight(
          str,
          Prism.languages[normalizedLang],
          normalizedLang
        );
        return `<pre class="language-${normalizedLang}"><code class="language-${normalizedLang}">${highlightedCode}</code></pre>`;
      } catch (error) {
        console.error(
          `Failed to highlight code with language "${normalizedLang}":`,
          error
        );
        // Return unhighlighted code with language class
        return `<pre class="language-${normalizedLang}"><code class="language-${normalizedLang}">${md.utils.escapeHtml(str)}</code></pre>`;
      }
    }

    // Default fallback with language class for CSS styling
    return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export interface ProcessedPost {
  meta: BlogPostMeta & { slug: string };
  content: string;
  excerpt: string;
  readingTime: number;
}

export class MarkdownProcessor {
  static processMarkdown(markdownContent: string, slug: string): ProcessedPost {
    const { data, content } = matter(markdownContent);
    let htmlContent = md.render(content);

    // Post-process HTML for additional enhancements
    htmlContent = this.enhanceHTML(htmlContent);

    // Generate excerpt if not provided
    let excerpt = data.excerpt || '';
    if (!excerpt) {
      const textContent = content
        .replace(/[#*`_\[\]]/g, '')
        .replace(/\n+/g, ' ')
        .trim();
      const sentences = textContent.split(/[.!?]+/);
      excerpt =
        sentences[0] +
        (sentences.length > 1 || textContent.length > 150 ? '...' : '.');
    }

    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
      meta: {
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        published: data.published !== false,
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author || 'Anonymous',
        excerpt,
        slug,
        ...data, // Include all other frontmatter fields
      },
      content: htmlContent,
      excerpt,
      readingTime,
    };
  }

  private static enhanceHTML(html: string): string {
    // Add target="_blank" to external links
    html = html.replace(
      /<a href="(https?:\/\/[^"]+)"([^>]*)>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"$2>'
    );

    // Add responsive classes to images
    html = html.replace(
      /<img([^>]+)>/g,
      '<img$1 class="max-w-full h-auto rounded-lg shadow-md">'
    );

    // Add copy buttons to code blocks
    html = html.replace(
      /<pre class="language-([^"]+)"><code[^>]*>/g,
      (match, lang) => `
        <div class="relative code-block-wrapper">
          <button class="copy-code-btn absolute top-2 right-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 hover:opacity-100 transition-opacity" data-lang="${lang}">
            Copy
          </button>
          ${match}
      `
    );

    html = html.replace(/<\/code><\/pre>/g, '</code></pre></div>');

    return html;
  }

  static generatePageTitle(
    title: string,
    siteName: string = "Feifan Zhou's Blog"
  ): string {
    return title === siteName ? siteName : `${title} — ${siteName}`;
  }

  static generateMetaDescription(
    excerpt: string,
    defaultDescription: string = 'A blog about technology, coding, and ideas'
  ): string {
    return excerpt.length > 10
      ? excerpt.substring(0, 160) + (excerpt.length > 160 ? '...' : '')
      : defaultDescription;
  }
}
