import { CLEANER, SEQ3 } from "../data";
import {
	BH,
	bounce,
	ease,
	el,
	type Face,
	face,
	flight,
	KEY_INDEX,
	KEYS,
	type Key,
	lerp,
	op,
	PITCH,
	ph,
	type Rec,
	rec,
	type SceneDef,
	type Slot,
	setSlot,
	show,
	slot,
	strip,
	styleRec,
	txt,
} from "../engine";

interface State {
	recs: Rec[];
	cleaner: SVGLineElement;
	cleanerT: SVGTextElement;
	/** Offsets removed by compaction. */
	superseded: number[];
	/** Offsets that survive compaction. */
	survivors: number[];
	/** For each survivor, the index (into survivors) of the next survivor with the same key, or -1. */
	next: number[];
	slots: Slot[];
	copies: Rec[];
	tossCopies: Rec[];
	face: Face;
	before: SVGTextElement;
	counts: SVGTextElement;
	verdict: SVGTextElement;
}

const PILE_X = 400;
const PILE_Y = 262;

export const compactionScene: SceneDef<State> = {
	dur: 8600,
	build({ svg }) {
		txt(svg, 48, 44, "tail · cleaned on the last run", "seg");
		txt(svg, 628, 30, "head · written since the last run", "seg");
		txt(svg, 628, 44, "active segment · never cleaned", "seg");
		const recs = strip(svg, 48, 70, SEQ3, true);
		const cx = 48 + CLEANER * PITCH - 3;
		const cleaner = el(
			"line",
			{ x1: cx, y1: 18, x2: cx, y2: 128, class: "cleaner" },
			svg,
		);
		const cleanerT = txt(svg, cx, 142, "cleaner point", "small", "middle");

		const latest: Partial<Record<Key, number>> = {};
		SEQ3.forEach(([k], i) => {
			if (i < CLEANER) latest[k] = i;
		});
		const superseded: number[] = [];
		const survivors: number[] = [];
		SEQ3.forEach(([k], i) => {
			if (i < CLEANER && latest[k] !== i) superseded.push(i);
			else survivors.push(i);
		});

		txt(svg, 48, 250, "consumer Map", "small");
		const slots = KEYS.map((_, j) => slot(svg, 48 + j * 40, 262));
		txt(svg, 400, 250, "read, then thrown away", "small");
		const copies = survivors.map((i) => {
			const [k, v] = SEQ3[i];
			const r = rec(svg, k, v);
			show(r, false);
			return r;
		});
		const tossCopies = survivors.map((i) => {
			const [k, v] = SEQ3[i];
			const r = rec(svg, k, v);
			show(r, false);
			styleRec(r, "tossed");
			return r;
		});
		const next = survivors.map((i, k) => {
			for (let m = k + 1; m < survivors.length; m++) {
				if (SEQ3[survivors[m]][0] === SEQ3[i][0]) return m;
			}
			return -1;
		});
		const f = face(svg, 300, 285, "🙂");
		const before = txt(svg, 48, 370, "", "req");
		const counts = txt(svg, 400, 370, "", "req");
		const verdict = txt(svg, 912, 370, "", "bad-label", "end");
		return {
			recs,
			cleaner,
			cleanerT,
			superseded,
			survivors,
			next,
			slots,
			copies,
			tossCopies,
			face: f,
			before,
			counts,
			verdict,
		};
	},
	render(t, st) {
		op(st.cleaner, ph(t, 0, 500));
		op(st.cleanerT, ph(t, 0, 500));
		st.superseded.forEach((i, r) => {
			const p = ph(t, 900 + r * 110, 420);
			const rc = st.recs[i];
			op(rc, lerp(1, 0.55, ease(p)));
			styleRec(rc, p >= 1 ? "ghost" : "");
		});

		const readStart = 3000;
		const gap = 400;
		const fl = 450;
		const starts = st.survivors.map((_, k) => readStart + k * gap);
		let readN = 0;
		const tossOrder: number[] = [];
		st.survivors.forEach((_, k) => {
			if (starts[k] <= t) readN++;
			const m = st.next[k];
			if (m >= 0 && starts[m] + fl <= t) tossOrder.push(k);
		});
		tossOrder.sort((a, b) => starts[st.next[a]] - starts[st.next[b]]);
		const tossN = tossOrder.length;

		const occupant: Partial<Record<Key, { ver: number; at: number }>> = {};
		st.survivors.forEach((i, k) => {
			const [key, ver] = SEQ3[i];
			if (starts[k] + fl <= t) occupant[key] = { ver, at: starts[k] + fl };
		});

		st.survivors.forEach((i, k) => {
			const g = st.recs[i];
			styleRec(g, t >= starts[k] && t < starts[k] + gap ? "active" : "");
			const p = ph(t, starts[k], fl);
			const c = st.copies[k];
			if (p <= 0 || p >= 1) show(c, false);
			else {
				show(c, true);
				flight(c, g, st.slots[KEY_INDEX[g.key]], p, -30);
			}

			const m = st.next[k];
			const tc = st.tossCopies[k];
			if (m < 0) {
				show(tc, false);
				return;
			}
			const q = ph(t, starts[m] + fl, fl);
			if (q <= 0) {
				show(tc, false);
				return;
			}
			show(tc, true);
			const order = tossOrder.indexOf(k);
			const pile = {
				x: PILE_X + (order % 8) * PITCH,
				y: PILE_Y + Math.floor(order / 8) * (BH + 8),
			};
			flight(tc, st.slots[KEY_INDEX[g.key]], pile, q, 20);
		});

		KEYS.forEach((k, j) => {
			const o = occupant[k];
			setSlot(
				st.slots[j],
				o ? k : null,
				o ? o.ver : null,
				o && t - o.at < 260 ? "flash" : "",
			);
		});

		const kept = Object.keys(occupant).length;
		const faded = st.superseded.filter(
			(_, r) => ph(t, 900 + r * 110, 420) >= 1,
		).length;
		st.before.textContent = `24 records → ${24 - faded} after compaction`;
		st.counts.textContent = `read ${readN}   kept ${kept}   tossed ${tossN}`;
		bounce(
			st.face,
			t,
			tossN ? 3 + tossN : 0,
			140,
			tossN === 0 ? "🙂" : tossN < 3 ? "😕" : tossN < 6 ? "🤢" : "🤮",
		);
		st.verdict.textContent =
			t >= readStart + st.survivors.length * gap + fl
				? "2 of every 3 reads were waste"
				: "";
	},
};
