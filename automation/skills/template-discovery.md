# Skill: Template Discovery
**Purpose:** Find top open-source (MIT/Apache 2.0) website templates suited for Vimi integration.

## Execution Steps
1. Determine the category based on the user's need (e.g., ecommerce, landing-page, dashboard).
2. Construct a GitHub search query. Example: `https://github.com/search?q=topic:ecommerce-template+license:mit&type=repositories&s=stars&o=desc`
3. Fetch the search results via the web or ask the user to provide a link to the repository/demo.
4. Filter exclusively for repositories featuring HTML, CSS, React, or Vue (as compatible with Vimi).
5. Extract the repository URL and the Live Demo URL.
6. Present a list of 3-5 templates to the user to choose from.
