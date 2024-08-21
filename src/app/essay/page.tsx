import { generateMetadata } from "@/libs/generateMetadata";
import PostListPage from "./[currentPage]/page";
import { redirect } from "next/navigation";

export const metadata = generateMetadata("杂文列表");

export default async function EssayPage() {
	redirect("/essay/1");
}
