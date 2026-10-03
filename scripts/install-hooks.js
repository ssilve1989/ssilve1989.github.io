#!/usr/bin/env node

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const isGitRepo = existsSync(".git");

if (isGitRepo) {
	try {
		execSync("lefthook install", { stdio: "inherit" });
	} catch (error) {
		console.error("Failed to install lefthook hooks:", error);
		process.exit(1);
	}
} else {
	console.log("Skipping lefthook install (not in a git repository)");
}
