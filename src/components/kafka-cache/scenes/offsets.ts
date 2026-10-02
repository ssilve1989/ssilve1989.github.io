import { SEQ3 } from "../data";
import {
	attr,
	type Bar,
	bar,
	ease,
	el,
	KEYS,
	type Key,
	op,
	PITCH,
	ph,
	prefersReducedMotion,
	type Rec,
	type SceneDef,
	setBar,
	setClass,
	setSlot,
	slot,
	strip,
	txt,
} from "../engine";

interface State {
	apply(start: number): void;
}

export const offsetsScene: SceneDef<State> = {
	dur: 5600,
	build({ svg, root, stop }) {
		const recs: Rec[] = strip(svg, 48, 60, SEQ3, true);
		const marker = el(
			"line",
			{ x1: 0, y1: 40, x2: 0, y2: 112, class: "cleaner" },
			svg,
		);
		const markerT = txt(svg, 0, 34, "", "req", "middle");
		txt(svg, 48, 176, "consumer Map", "small");
		const slots = KEYS.map((_, j) => slot(svg, 48 + j * 40, 188));
		const readT = txt(svg, 48, 250, "", "req");
		txt(svg, 400, 176, "keys missing from the map", "small");
		const missBar: Bar = bar(svg, 400, 184, 240, 12, "bar-bad");
		const missT = txt(svg, 652, 195, "0 / 4", "req");
		txt(svg, 400, 232, "records read then discarded", "small");
		const wasteBar: Bar = bar(svg, 400, 240, 240, 12, "bar-bad");
		const wasteT = txt(svg, 652, 251, "0 / 23", "req");

		const latest: Record<Key, number> = { I: 0, U: 0, D: 0, T: 0 };
		SEQ3.forEach(([k], i) => {
			latest[k] = i;
		});

		const input = root.querySelector<HTMLInputElement>("input[type=range]");
		const out = root.querySelector<HTMLOutputElement>("output");

		const apply = (start: number) => {
			if (input) input.value = String(start);
			if (out) out.value = String(start);
			const mx = 48 + start * PITCH - 3;
			attr(marker, "x1", mx);
			attr(marker, "x2", mx);
			attr(markerT, "x", Math.max(80, Math.min(880, mx)));
			markerT.textContent = `start at offset ${start}`;
			recs.forEach((r, i) => {
				op(r, i < start ? 0.18 : 1);
			});

			let present = 0;
			KEYS.forEach((k, j) => {
				const idx = latest[k];
				if (idx >= start) {
					present++;
					setSlot(slots[j], k, SEQ3[idx][1]);
				} else {
					setSlot(slots[j], null, null, "missing");
				}
			});
			const read = SEQ3.length - start;
			const wasted = read - present;
			const missing = KEYS.length - present;
			readT.textContent = `read ${read} records`;
			setBar(missBar, missing / 4);
			missT.textContent = `${missing} / 4`;
			setBar(wasteBar, wasted / 23);
			wasteT.textContent = `${wasted} / 23`;
			setClass(missT, "req", missing ? "bad-label" : "");
			setClass(wasteT, "req", wasted ? "bad-label" : "");
		};

		input?.addEventListener("input", () => {
			stop();
			apply(Number(input.value));
		});

		return { apply };
	},
	render(t, st) {
		const a = ph(t, 0, 3400);
		const b = ph(t, 3800, 1600);
		const start =
			t < 3800 ? Math.round(23 * (1 - ease(a))) : Math.round(12 * ease(b));
		st.apply(prefersReducedMotion() ? 12 : start);
	},
};
