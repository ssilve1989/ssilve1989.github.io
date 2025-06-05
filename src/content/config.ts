import { defineCollection, z } from "astro:content";

const experienceCollection = defineCollection({
	type: "content",
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
		website: z.string().url().optional(),
	}),
});

const skillsCollection = defineCollection({
	type: "data",
	schema: z.object({
		category: z.string(),
		skills: z.array(
			z.object({
				name: z.string(),
				level: z.number().min(1).max(100),
				years: z.number().optional(),
				description: z.string().optional(),
			}),
		),
	}),
});

const projectsCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		technologies: z.array(z.string()),
		link: z.string().url().optional(),
		github: z.string().url().optional(),
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
