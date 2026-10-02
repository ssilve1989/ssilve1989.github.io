import type { Playable } from "./engine";
import { isSceneName } from "./meta";
import { mounters } from "./registry";

/** Mount every scene on the page; each one plays once when it first scrolls into view. */
export function initScenes() {
	const playables = new Map<Element, Playable>();
	for (const root of document.querySelectorAll<HTMLElement>("[data-scene]")) {
		const name = root.dataset.scene;
		if (isSceneName(name)) playables.set(root, mounters[name](root));
	}

	if (!("IntersectionObserver" in window)) {
		for (const p of playables.values()) p.play();
		return;
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const en of entries) {
				if (!en.isIntersecting) continue;
				const p = playables.get(en.target);
				if (p && !p.played) p.play();
			}
		},
		{ threshold: 0.45 },
	);
	for (const root of playables.keys()) io.observe(root);
}
