# Servantium Claude Code Skills Plan

## Skill 1: `/new-blog-post`

**Purpose:** Scaffold a new blog post MDX file with correct frontmatter.

**Trigger:** User types `/new-blog-post "Post Title Here"`

**Behavior:**
1. Prompt for: description, category (Strategy/Product/Technology/Culture), author (christopher-veale/maxwell-friel)
2. Generate slug from title (lowercase, hyphenated)
3. Set today's date
4. Estimate reading time (default "5 min read")
5. Suggest an Unsplash image URL based on the topic
6. Create `src/content/blog/{slug}.mdx` with frontmatter + starter content outline
7. Open the file for editing

**Template:**
```mdx
---
title: "{title}"
description: "{description}"
date: "{YYYY-MM-DD}"
author: "{author-slug}"
category: "{category}"
image: "https://images.unsplash.com/..."
imageAlt: "{alt text}"
readingTime: "{X} min read"
---

## Introduction

[Your intro here]

## [Main Section]

[Content]

## Key Takeaways

- Takeaway 1
- Takeaway 2
- Takeaway 3
```

---

## Skill 2: `/new-help-doc`

**Purpose:** Create a new help documentation page in the Starlight docs.

**Trigger:** User types `/new-help-doc "Page Title"` with optional `--section guides|getting-started|support`

**Behavior:**
1. Prompt for: section (guides, getting-started, support), description
2. Generate slug from title
3. Create `src/content/docs/help/{section}/{slug}.mdx`
4. Include Starlight component imports (Steps, Aside, Tabs)
5. Add placeholder structure appropriate for the section type

**Template (guides):**
```mdx
---
title: {title}
description: {description}
---

import { Steps, Aside } from '@astrojs/starlight/components';

## Overview

[Feature overview]

## Getting started

<Steps>

1. Step one
2. Step two
3. Step three

</Steps>

<Aside type="tip">
Pro tip here.
</Aside>

## What's next?

- [Related doc 1](/help/guides/related)
- [Related doc 2](/help/guides/related)
```

---

## Skill 3: `/new-release-note`

**Purpose:** Manually create a release note (for when the automated pipeline isn't appropriate).

**Trigger:** User types `/new-release-note "v1.2.0 — Feature Name"`

**Behavior:**
1. Prompt for: description, badge type (Feature/Fix/Improvement/Internal), version
2. Set today's date
3. Create `src/content/docs/help/release-notes/{date}-{slug}.mdx`
4. Use release note template with badge frontmatter

**Template:**
```mdx
---
title: "v{version} — {title}"
description: "{description}"
badge:
  text: {badge_type}
  variant: {variant}
---

import { Aside } from '@astrojs/starlight/components';

## What changed

[Description of changes]

## Why this matters

- Impact point 1
- Impact point 2

## What's next

- Upcoming feature 1
- Upcoming feature 2
```

---

## Skill 4: `/preview-site`

**Purpose:** Quick-start the dev server and open in browser.

**Trigger:** User types `/preview-site`

**Behavior:**
1. Run `npm run dev` in the website directory
2. Open localhost:4321 in the default browser
3. Report the URL and status

---

## Skill 5: `/deploy-test`

**Purpose:** Push current branch to develop for test.servantium.com preview.

**Trigger:** User types `/deploy-test`

**Behavior:**
1. Show current git status and branch
2. Confirm with user
3. Push to develop branch (merges current branch into develop)
4. Report the test.servantium.com URL

---

## Implementation Priority

1. `/new-blog-post` — Most frequently used, saves the most time
2. `/new-release-note` — Needed for the automation pipeline testing
3. `/new-help-doc` — Used as help docs grow
4. `/preview-site` — Convenience
5. `/deploy-test` — Convenience

## Implementation Notes

- Skills are defined as `.md` files in `.claude/commands/`
- Each skill file contains the prompt template and instructions
- Claude Code executes them as slash commands
- No external dependencies needed
