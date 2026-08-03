import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const experienceCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
	schema: z.object({
		company: z.string(),
		position: z.string(),
		location: z.string(),
		startDate: z.date(),
		endDate: z.date().optional(),
		current: z.boolean().default(false),
		description: z.string(),
		technologies: z.array(z.string()),
		achievements: z.array(z.string()).optional(),
		icon: z.string().optional(),
		website: z.url().optional(),
	}),
});

const skillsCollection = defineCollection({
	loader: glob({ pattern: "**/*.json", base: "./src/content/skills" }),
	schema: z.object({
		category: z.string(),
		slug: z.string(),
		summary: z.string(),
		concepts: z.array(z.string()),
	}),
});

const projectsCollection = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		technologies: z.array(z.string()),
		link: z.url().optional(),
		github: z.url().optional(),
		featured: z.boolean().default(false),
		image: z.string().optional(),
		type: z
			.enum(["professional", "opensource", "personal"])
			.default("personal"),
	}),
});

export const collections = {
	experience: experienceCollection,
	skills: skillsCollection,
	projects: projectsCollection,
};
