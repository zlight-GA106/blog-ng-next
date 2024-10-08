import { cache } from "react";
import { LinkType, PostType } from "./types";
import { links as ln } from "@/data/links";
import { readFile, readFileSync, readdir, readdirSync } from "fs";
import path from "path";
import fm from "front-matter";
import getOrDefault from "./getOrDefault";

export class CMS {
	links: LinkType[] = [];
	postIds: number[] = [];
	private postContents: PostType[] = [];
	constructor(subdir: string | undefined = undefined) {
		this.links = ln;
		const p =
			subdir === undefined
				? path.join(process.cwd(), "src", "data", "posts")
				: path.join(process.cwd(), "src", "data", "posts", subdir);
		const files = readdirSync(p);
		files.forEach((filename) => {
			if (!filename.endsWith(".md")) {
				return;
			}
			const data = readFileSync(path.join(p, filename));
			const ret = fm(data.toString());
			const attr: any = ret.attributes;
			this.postContents.push({
				id: parseInt(attr.id),
				title: getOrDefault(attr.title, ""),
				content: ret.body,
				description: getOrDefault(attr.description, ""),
				created_at: new Date(
					getOrDefault(attr.created_at, "1919-08-10T11:45:14Z")
				),
				modified_at: new Date(
					getOrDefault(
						attr.modified_at,
						getOrDefault(attr.created_at, "1919-08-10T11:45:14Z")
					)
				),
			});
		});
		this.postContents.sort((a, b) => {
			if (a.created_at == b.created_at) {
				return a.id < b.id ? -1 : 1;
			}
			return a.created_at < b.created_at ? 1 : -1;
		});
		for (var index = 0; index < this.postContents.length; ++index) {
			this.postIds.push(this.postContents[index].id);
		}
	}
	getPost(id: number) {
		return this.postContents.find((val) => {
			return val.id == id;
		});
	}
	getPosts(page: number) {
		const begin = (page - 1) * 10;
		const end = Math.min(page * 10, this.postIds.length);
		return this.postContents.slice(begin, end);
	}
}

var INSTANCE: CMS | null = null;

export const initCMS = (): CMS => {
	if (INSTANCE !== null) {
		return INSTANCE;
	}
	const cms = new CMS();
	INSTANCE = cms;
	return cms;
};

var INSTANCE_ESSAY: CMS | null = null;

export const initCMS_essay = (): CMS => {
	if (INSTANCE_ESSAY !== null) {
		return INSTANCE_ESSAY;
	}
	const cms = new CMS("essay");
	INSTANCE_ESSAY = cms;
	return cms;
};
