import {
	box,
	cylinder,
	el,
	flight,
	KEY_INDEX,
	KEYS,
	type Key,
	op,
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

interface Put {
	key: Key;
	ver: number;
	at: number;
}

interface State {
	slots: Slot[];
	pushLine: SVGLineElement;
	storeT: SVGTextElement;
	conT: SVGTextElement;
	count: SVGTextElement;
	putCopies: Rec[];
	push: Rec;
}

const PUTS: readonly Put[] = [
	{ key: "U", ver: 4, at: 500 },
	{ key: "I", ver: 20, at: 2000 },
	{ key: "D", ver: 3, at: 3500 },
	{ key: "I", ver: 21, at: 5000 },
];

const INITIAL: Record<Key, number> = { I: 19, U: 3, D: 2, T: 2 };

export const watchScene: SceneDef<State> = {
	dur: 7000,
	build({ svg }) {
		cylinder(svg, 150, 16, 140, 72);
		const slots = KEYS.map((k, j) => {
			const s = slot(svg, 158 + j * 33, 40);
			setSlot(s, k, INITIAL[k]);
			return s;
		});
		box(svg, 16, 160, 210, 44, "service A", 'Watch("inventory.88123")');
		box(svg, 300, 160, 124, 44, "publisher", "put(...)");
		const pushLine = el(
			"line",
			{ x1: 173, y1: 88, x2: 120, y2: 160, class: "push" },
			svg,
		);
		const storeT = txt(svg, 220, 118, "", "small", "middle");
		const conT = txt(svg, 16, 218, "", "ok-label");
		const count = txt(svg, 424, 218, "", "req", "end");
		const putCopies = PUTS.map((p) => {
			const r = rec(svg, p.key, p.ver);
			show(r, false);
			return r;
		});
		const push = rec(svg, "I", 20);
		show(push, false);
		return { slots, pushLine, storeT, conT, count, putCopies, push };
	},
	render(t, st) {
		const vals: Record<Key, number> = { ...INITIAL };
		const flashing = new Set<Key>();
		let putsDone = 0;
		let pushed = 0;
		op(st.pushLine, 0);
		show(st.push, false);
		st.storeT.textContent = "";
		st.conT.textContent = "";

		PUTS.forEach((p, j) => {
			const a = ph(t, p.at, 450);
			const g = st.putCopies[j];
			const sl = st.slots[KEY_INDEX[p.key]];
			if (a > 0 && a < 1) {
				show(g, true);
				flight(g, { x: 306, y: 150 }, sl, a, 30);
			} else {
				show(g, false);
			}
			if (a >= 1) {
				vals[p.key] = p.ver;
				putsDone++;
				if (t - (p.at + 450) < 260) flashing.add(p.key);
			}
			const b = ph(t, p.at + 450, 500);
			if (a >= 1 && t < p.at + 1500) {
				if (p.key === "I") {
					op(st.pushLine, 1);
					if (b < 1) {
						show(st.push, true);
						setRec(st.push, "I", p.ver);
						flight(st.push, sl, { x: 120, y: 172 }, b, -10);
					}
					st.conT.textContent = `pushed: I${p.ver} · no scan, no Map`;
				} else {
					st.storeT.textContent = `${p.key}${p.ver} stored · not watched · nothing sent`;
				}
			}
			if (p.key === "I" && t >= p.at + 950) pushed++;
		});

		KEYS.forEach((k, j) => {
			setSlot(st.slots[j], k, vals[k], flashing.has(k) ? "flash" : "");
		});
		st.count.textContent = `puts ${putsDone} · pushed ${pushed}`;
	},
};
