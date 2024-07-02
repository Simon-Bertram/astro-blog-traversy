import type { APIRoute, APIContext } from "astro";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({ url }: APIContext<Record<string, any>, Record<string, string | undefined>>): Promise<Response> => {
  const query: string | null = url.searchParams.get("query");
  console.log("query", query);

  // Hanlde if query is not present
  if (query === null) {
    return new Response(JSON.stringify({ error: "Query is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection("blog");

  // Filter articles based on search query
const searchResults = allBlogArticles.filter((article) => {
  const titleMatch: boolean = article.data.title
    .toLowerCase()
    .includes(query!.toLowerCase());

  const bodyMatch: boolean = article.body
    .toLowerCase()
    .includes(query!.toLowerCase());

  const slugMatch: boolean = article.slug
    .toLowerCase()
    .includes(query!.toLowerCase());

  return titleMatch || bodyMatch || slugMatch;
});

  // Handle if query is present

  return new Response(JSON.stringify(searchResults), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      },
  });
};