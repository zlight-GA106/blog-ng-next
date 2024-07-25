import { config } from "@/libs/config";
import { initCMS } from "@/libs/contents";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

export async function GET() {
	const ret = new SitemapStream({
		hostname: `https://${config.blog.hostname}`,
		lastmodDateOnly: true,
	});
	const cms = initCMS();
	var links = cms.postIds
		.map((id) => {
			const post = cms.getPost(id)!;
			return {
				url: `/post/${id}`,
				lastmod: post.created_at,
			};
		})
		.concat([
			{
				url: `/`,
				lastmod: new Date(),
			},
			{
				url: `/about`,
				lastmod: new Date(),
			},
		]);
	return new Response(
		await streamToPromise(Readable.from(links).pipe(ret)).then((data) => {
			return data.toString();
		}),
		{
			headers: {
				"Content-Type": "application/xml",
			},
		}
	);
}
