# Database Post Extraction

This document describes how to extract posts from the PostgreSQL database and convert them to markdown files.

## Overview

The extraction script connects to the PostgreSQL database, retrieves all non-deleted posts, and converts them to markdown files with YAML frontmatter. The posts are organized by year in the `posts/` directory.

## Usage

### Extract Posts

Run the main extraction script:

```bash
pnpm run extract-posts
```

This will:
- Connect to the PostgreSQL database
- Extract all posts where `is_deleted = false`
- Convert each post to markdown with YAML frontmatter
- Save files as `posts/{year}/{slug}.md`
- Generate a `url-map.json` file for URL redirection
- Display progress and statistics

### Verify Extraction

After extraction, verify the results:

```bash
pnpm run verify-extraction
```

This will:
- Check that all files were created correctly
- Validate frontmatter structure
- Report any issues or missing data
- Display summary statistics

## Output Structure

### File Organization

```
posts/
├── 2023/
│   ├── my-first-post.md
│   ├── another-post.md
│   └── ...
├── 2024/
│   ├── recent-post.md
│   └── ...
└── 2025/
    └── latest-post.md
```

### Frontmatter Format

Each markdown file includes YAML frontmatter:

```yaml
---
title: "Post Title"
date: "2024-01-15"
updated: "2024-01-20"
slug: "post-slug"
excerpt: "First paragraph excerpt..."
---

Post content in markdown format...
```

### URL Mapping

The `url-map.json` file contains mappings from legacy URLs to file paths:

```json
{
  "/posts/my-post-slug": "posts/2024/my-post-slug.md",
  "/2024/my-post-slug": "posts/2024/my-post-slug.md",
  "/blog/my-post-slug": "posts/2024/my-post-slug.md",
  "/p/123": "posts/2024/my-post-slug.md"
}
```

## Database Configuration

The script connects to:
- **Host**: 66.175.221.161
- **Database**: tanagram2
- **Username**: postgres
- **SSL**: Disabled

Connection string is hardcoded in the script for this one-time extraction.

## Features

### Robust Error Handling

- Database connection failures
- Individual post processing errors
- File system errors
- Encoding issues

### Content Processing

- Extracts excerpt from first paragraph
- Sanitizes content (removes null bytes, normalizes line endings)
- Handles special characters and encoding
- Preserves markdown formatting

### Progress Reporting

- Real-time progress updates
- Statistics on completion
- Error reporting for individual posts
- Performance timing

### Graceful Shutdown

- Handles CTRL+C interruption
- Cleans up database connections
- Reports partial progress

## Troubleshooting

### Connection Issues

If you get database connection errors:
1. Check network connectivity to the database server
2. Verify database credentials
3. Ensure the database is running and accessible

### File Permission Errors

If you get file system errors:
1. Ensure the script has write permissions to the project directory
2. Check disk space availability
3. Verify the `posts/` directory can be created

### Memory Issues

For large databases:
1. The script processes posts one at a time to minimize memory usage
2. Monitor system resources during extraction
3. Consider running during off-peak hours

### Encoding Problems

The script handles common encoding issues:
- Removes null bytes
- Normalizes line endings
- Preserves UTF-8 characters
- Escapes YAML special characters in frontmatter

## Post-Extraction Steps

After successful extraction:

1. Run verification script to check results
2. Review any reported issues
3. Update any routing logic to use the URL map
4. Consider backing up the extracted files
5. Test a few sample posts to ensure proper rendering

## Dependencies

The extraction uses existing project dependencies:
- `pg` - PostgreSQL client
- `gray-matter` - YAML frontmatter parsing
- `tsx` - TypeScript execution
- Native Node.js modules for file system operations
