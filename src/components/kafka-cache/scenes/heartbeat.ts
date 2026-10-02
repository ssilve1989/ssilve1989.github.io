import {
	arrow,
	attr,
	type Bar,
	bar,
	box,
	clamp,
	cylinder,
	type Entry,
	flight,
	type Key,
	ph,
	type Rec,
	rec,
	type SceneDef,
	type Slot,
	setBar,
	setClass,
	setSlot,
	show,
	slot,
	strip,
	txt,
} from "../engine";

const FAQ_SEQ: readonly Entry[] = [
	["I", 12],
	["U", 3],
	["I", 13],
	["U", 4],
	["I", 14],
	["I", 15],
];

interface State {
	recs: Rec[];
	proj: SVGGElement;
	projT: SVGTextElement;
	slots: [Slot, Slot];
	age: SVGTextElement;
	fresh: Bar;
	note: SVGTextElement;
	copies: Rec[];
}

export const heartbeatScene: SceneDef<State> = {
	dur: 7200,
	build({ svg }) {
		txt(
			svg,
			16,
			22,
			"topic · still the log of record · offsets 12 … 17",
			"topic",
		);
		const recs = strip(svg, 16, 30, FAQ_SEQ, false);
		const proj = box(
			svg,
			16,
			110,
			150,
			44,
			"projector",
			"one consumer, one writer",
		);
		const projT = txt(svg, 16, 172, "", "bad-label");
		arrow(svg, 170, 132, 254, 132);
		cylinder(svg, 260, 96, 120, 72);
		const slots: [Slot, Slot] = [slot(svg, 285, 120), slot(svg, 325, 120)];
		txt(svg, 260, 188, "_meta.heartbeat", "small");
		const age = txt(svg, 424, 188, "", "req", "end");
		const fresh = bar(svg, 260, 196, 164, 8, "bar-ok");
		const note = txt(svg, 16, 218, "", "small");
		const copies = recs.map((r) => {
			const c = rec(svg, r.key, r.ver);
			show(c, false);
			return c;
		});
		return { recs, proj, projT, slots, age, fresh, note, copies };
	},
	render(t, st) {
		const dead = t >= 1500 && t < 4500;
		setClass(st.proj, "svc", dead ? "dead" : "");
		const slotVals: Record<Key, number> = { I: 12, U: 3, D: 0, T: 0 };
		let ageS: number;
		if (t < 1500) {
			ageS = (t % 600) / 1000;
			st.projT.textContent = "";
			st.note.textContent =
				"heartbeat every 500 ms · entries carry revision + timestamp";
		} else if (dead) {
			ageS = 1 + ((t - 1500) / 3000) * 40;
			st.projT.textContent = "crashed";
			st.note.textContent =
				"readers still get answers, and can see how old they are";
		} else {
			ageS = 0;
			st.projT.textContent = "restarted · resumes at offset 12";
			st.note.textContent = "catch-up happens once, in one place";
		}

		let catchN = 0;
		st.recs.forEach((r, i) => {
			const p = ph(t, 4700 + i * 330, 300);
			const c = st.copies[i];
			if (p <= 0 || p >= 1) show(c, false);
			else {
				show(c, true);
				flight(c, r, { x: r.key === "I" ? 285 : 325, y: 120 }, p, 18);
			}
			if (p >= 1) {
				slotVals[r.key] = r.ver;
				catchN++;
			}
		});
		if (t >= 4500) ageS = catchN ? 0 : 41;

		const state = dead ? "stale" : "";
		setSlot(st.slots[0], "I", slotVals.I, state);
		setSlot(st.slots[1], "U", slotVals.U, state);
		st.age.textContent = `age ${ageS < 1 ? ageS.toFixed(1) : Math.round(ageS)}s`;
		const old = ageS > 5;
		attr(st.fresh.fill, "class", old ? "bar-bad" : "bar-ok");
		setBar(st.fresh, old ? clamp(ageS / 45, 0.15, 1) : 1);
		setClass(st.age, "req", old ? "bad-label" : "");
	},
};
