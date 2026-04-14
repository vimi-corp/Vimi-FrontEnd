# Workflow: Fetch and Apply Template
**Purpose:** A unified end-to-end framework to discover, download, and seamlessly adapt third-party open-source web templates into the Vimi application workspace.

## Step 1: Discovery
Invoke the **`template-discovery.md`** skill.
* Decide on a specific niche (e.g., minimalist SaaS landing page).
* Extract a live demo link of an MIT-licensed template.

## Step 2: Mirroring
Invoke the **`website-mirror.md`** skill.
* Run the Python script targeting the live demo URL.
* Wait for the assets (HTML/CSS/JS/images) to be recursively cloned into the `/templates/` directory.

## Step 3: Integration Analysis
* Parse the mirrored `index.html` file to determine the main structure (e.g., Header, Hero, Features, Footer).
* Identify CSS styling dependencies (Vanilla CSS, Tailwind, Bootstrap).
* Analyze where these components fit within `vimi-frontend`'s React hierarchy.

## Step 4: Component Implementation
* Slice the `index.html` into independent `.jsx` React components.
* Migrate CSS classes gracefully into Vimi's existing TailwindCSS scope or `index.css`.
* Migrate images and static assets to Vimi's `/public` directory.
