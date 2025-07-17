# Firecrackers Central Ohio

Official website for Firecrackers Central Ohio fastpitch softball teams.

🌐 **Live Site**: [firecrackersohio.com](https://firecrackersohio.com)

## 🏗️ Built With

- **[Astro](https://astro.build)** - Web framework
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[Zod](https://zod.dev)** - Content validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/firecrackers-ohio.github.io.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript checks
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Nav.astro       # Navigation component
│   ├── Footer.astro    # Footer component
│   └── teams/          # Team-specific components
├── content/            # Content collections
│   └── teams/          # Team data (JSON files)
├── layouts/            # Page layouts
│   └── Layout.astro    # Main layout with SEO
├── pages/              # File-based routing
│   ├── index.astro     # Homepage
│   ├── about.astro     # About page
│   ├── teams.astro     # Teams overview
│   ├── tryouts.astro   # Tryout information
│   ├── 404.astro       # Custom 404 page
│   ├── sitemap.xml.ts  # Dynamic sitemap
│   └── teams/          # Individual team pages
└── styles/
    └── global.css      # Global styles and Tailwind config
```

## 🎨 Content Management

Team information is stored in JSON files in `src/content/teams/`. Each team file follows this structure:

```json
{
  "title": "Team Name",
  "staff": [
    {
      "name": "Coach Name - Title",
      "bio": ["Biography paragraph 1", "Biography paragraph 2"]
    }
  ]
}
```

## 🔧 Development

### Adding New Teams

1. Create a new JSON file in `src/content/teams/`
2. Add the team page in `src/pages/teams/`
3. Update the navigation in `src/components/Nav.astro`
4. Update the sitemap in `src/pages/sitemap.xml.ts`

### SEO Best Practices

- Use the Layout component with custom title and description
- Add appropriate meta tags for social media sharing
- Include descriptive alt text for images
- Use semantic HTML structure

## 🚀 Deployment

The site is deployed via GitHub Pages. Push to the `main` branch to trigger automatic deployment.

### Environment Variables

No environment variables are required for basic functionality.

## 📊 Performance & SEO

- ✅ Lighthouse score optimization
- ✅ SEO meta tags and Open Graph
- ✅ Accessibility features (skip links, semantic HTML)
- ✅ Responsive design
- ✅ Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Contact

For questions about the website, please contact the team administrators.
