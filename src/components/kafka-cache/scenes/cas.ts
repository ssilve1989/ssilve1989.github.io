import {
	box,
	cylinder,
	flight,
	ph,
	type Rec,
	rec,
	type SceneDef,
	type Slot,
	setRec,
	setSlot,
	show,
	slot,
	txt,
} from "../engine";

interface State {
	slot: Slot;
	rev: SVGTextElement;
	live: Rec;
	stale: Rec;
	r1: SVGTextElement;
	r2: SVGTextElement;
}

export const casScene: SceneDef<State> = {
	dur: 5200,
	build({ svg }) {
		box(svg, 16, 40, 170, 44, "projector · live", "Update(I, I19, rev 7)");
		box(
			svg,
			16,
			150,
			170,
			44,
			"publisher · restarted",
			"Update(I, I18, rev 7)",
		);
		cylinder(svg, 260, 76, 150, 80);
		const s = slot(svg, 300, 106);
		setSlot(s, "I", 18);
		const rev = txt(svg, 345, 122, "rev 7", "req");
		const live = rec(svg, "I", 19);
		show(live, false);
		const stale = rec(svg, "I", 18);
		show(stale, false);
		const r1 = txt(svg, 16, 104, "", "ok-label");
		const r2 = txt(svg, 16, 214, "", "bad-label");
		return { slot: s, rev, live, stale, r1, r2 };
	},
	render(t, st) {
		const a = ph(t, 300, 700);
		show(st.live, a > 0 && a < 1);
		flight(st.live, { x: 156, y: 51 }, { x: 300, y: 106 }, a, 20);
		const accepted = a >= 1;
		setSlot(
			st.slot,
			"I",
			accepted ? 19 : 18,
			accepted && t < 1300 ? "flash" : "",
		);
		st.rev.textContent = accepted ? "rev 8" : "rev 7";
		st.r1.textContent = accepted ? "accepted · rev 7 → 8" : "";

		const b = ph(t, 1800, 700);
		const c = ph(t, 2500, 600);
		if (b > 0 && c <= 0) {
			show(st.stale, true);
			setRec(st.stale, "I", 18);
			flight(st.stale, { x: 156, y: 161 }, { x: 300, y: 106 }, b, -20);
		} else if (c > 0 && c < 1) {
			show(st.stale, true);
			setRec(st.stale, "I", 18, "tossed");
			flight(st.stale, { x: 300, y: 106 }, { x: 156, y: 161 }, c, -20);
		} else {
			show(st.stale, false);
		}
		st.r2.textContent =
			c > 0 ? "rejected · expected rev 7, store is at 8 → reload, retry" : "";
	},
};
