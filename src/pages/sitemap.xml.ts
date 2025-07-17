import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
  const pages = [
    "",
    "about",
    "teams",
    "teams/brown",
    "teams/nieman",
    "teams/allen",
    "teams/jones",
    "teams/evans",
    "tryouts",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    page => `
  <url>
    <loc>${site}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
