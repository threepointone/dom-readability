import type * as Party from "partykit/server";
// @ts-expect-error - no types available for this module
import JSDOMParser from "@mozilla/readability/JSDOMParser";
import { Readability } from "@mozilla/readability";

export default class Server implements Party.Server {
  static async onFetch(req: Party.Request) {
    const htmlRes = await fetch(
      "https://www.actsnotfacts.com/made/large-language-models"
    );
    const html = await htmlRes.text();
    // since we don't have a document model in the worker,
    // we need to manually parse the html string into a document object
    const document = new JSDOMParser().parse(html, req.url);

    // now let's use Readability to extract the article content
    const reader = new Readability(document);
    const article = reader.parse();

    if (article?.textContent) {
      return new Response(article.textContent);
    }

    return new Response("No article found");
  }
}

Server satisfies Party.Worker;
