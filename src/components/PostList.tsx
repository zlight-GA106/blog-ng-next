import { PostType } from "@/libs/types";
import Link from "next/link";
import PageSwitcher from "./PageSwitcher";
import { CMS, initCMS } from "@/libs/contents";

export default async function PostList({
	page,
	cms,
	subdir,
}: {
	page: number;
	cms?: CMS;
	subdir?: string;
}) {
	if (cms === undefined) {
		cms = initCMS();
	}
	const posts: PostType[] = cms.getPosts(page);
	const postList = posts.map((post, index) => {
		return (
			<div key={index} className="mb-8">
				<Link
					className="text-primary font-bold text-2xl my-4 hover:text-primary/80"
					href={
						subdir === undefined
							? `/post/${post.id}`
							: `/post/${subdir}/${post.id}`
					}>
					{post.title}
				</Link>
				<p className="opacity-60 my-4">
					{post.created_at.toLocaleDateString()}
				</p>
				<p className="my-4">{post.description}</p>
			</div>
		);
	});
	return (
		<>
			{postList}
			<PageSwitcher
				currentPage={page}
				totalPage={Math.ceil(cms.postIds.length / 10)}
			/>
		</>
	);
}
