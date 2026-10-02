import { SEQ2, SERVICE_NAMES } from "../data";
import {
	attr,
	type Bar,
	bar,
	bounce,
	box,
	type Face,
	face,
	flight,
	KEY_INDEX,
	KEYS,
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
	styleRec,
	txt,
} from "../engine";

interface Service {
	box: SVGGElement;
	slots: Slot[];
	read: SVGTextElement;
	mem: Bar;
	memT: SVGTextElement;
	pressure: SVGTextElement;
	face: Face;
	copies: Rec[];
}

interface State {
	recs: Rec[];
	svcs: Service[];
	total: SVGTextElement;
	totalSub: SVGTextElement;
	copiesN: SVGTextElement;
	segs: Bar[];
}

export const fanoutScene: SceneDef<State> = {
	dur: 7600,
	build({ svg }) {
		txt(svg, 120, 34, "inventory updates topic   ·   20 records", "topic");
		const recs = strip(svg, 120, 48, SEQ2, true);
		const svcs = SERVICE_NAMES.map((name, i): Service => {
			const bx = 40 + i * 230;
			const by = 190;
			const boxG = box(svg, bx, by, 210, 190, name, "hydrates at startup");
			txt(svg, bx + 12, by + 62, "in-memory map: key → record", "small");
			const slots = KEYS.map((_, j) => slot(svg, bx + 12 + j * 40, by + 72));
			const read = txt(svg, bx + 12, by + 130, "read 0", "req");
			const mem = bar(svg, bx + 12, by + 148, 186, 8);
			const memT = txt(svg, bx + 12, by + 174, "memory: 0 keys", "small");
			const pressure = txt(svg, bx + 84, by + 130, "", "pressure");
			const fc = face(svg, bx + 184, by + 94, "🙂");
			const copies = SEQ2.map(([k, v]) => {
				const r = rec(svg, k, v);
				show(r, false);
				return r;
			});
			return { box: boxG, slots, read, mem, memT, pressure, face: fc, copies };
		});
		txt(svg, 40, 412, "records processed", "small");
		const total = txt(svg, 40, 448, "0", "big");
		const totalSub = txt(svg, 130, 448, "", "small");
		txt(svg, 400, 412, "copies of the same map", "small");
		const copiesN = txt(svg, 400, 448, "0", "big");
		txt(svg, 640, 412, "total memory (one segment per service)", "small");
		const segs = [0, 1, 2, 3].map((i) => bar(svg, 640 + i * 72, 430, 66, 14));
		return { recs, svcs, total, totalSub, copiesN, segs };
	},
	render(t, st) {
		const starts = SEQ2.map((_, i) => 400 + i * 330);
		const readN = starts.filter((s) => s <= t).length;
		const lastByKey: Partial<Record<Key, { ver: number; at: number }>> = {};
		SEQ2.forEach(([key, ver], i) => {
			if (starts[i] + 520 <= t) lastByKey[key] = { ver, at: starts[i] + 520 };
		});
		const uniq = Object.keys(lastByKey).length;

		st.recs.forEach((r, i) => {
			styleRec(r, t >= starts[i] && t < starts[i] + 330 ? "active" : "");
		});

		for (const sv of st.svcs) {
			SEQ2.forEach(([key], i) => {
				const p = ph(t, starts[i], 520);
				const c = sv.copies[i];
				if (p <= 0 || p >= 1) {
					show(c, false);
					return;
				}
				show(c, true);
				const sl = sv.slots[KEY_INDEX[key]];
				flight(c, st.recs[i], sl, p, -24);
			});
			KEYS.forEach((k, j) => {
				const lb = lastByKey[k];
				setSlot(
					sv.slots[j],
					lb ? k : null,
					lb ? lb.ver : null,
					lb && t - lb.at < 260 ? "flash" : "",
				);
			});
			sv.read.textContent = `read ${readN}`;
			const load = readN / SEQ2.length;
			setBar(sv.mem, load);
			attr(sv.mem.fill, "class", load >= 0.75 ? "bar-bad" : "bar-fill");
			sv.memT.textContent = `live ${uniq} keys · alloc ${readN} recs`;
			const mood =
				load < 0.35 ? "🙂" : load < 0.6 ? "😰" : load < 0.85 ? "🤢" : "🥵";
			bounce(
				sv.face,
				t,
				load < 0.35 ? 0 : 4 + load * 10,
				load < 0.6 ? 220 : 120,
				mood,
			);
			setClass(sv.box, "svc", load >= 0.6 ? "sick" : "");
			sv.pressure.textContent =
				load >= 0.85 ? "out of memory?" : load >= 0.6 ? "memory pressure" : "";
		}

		st.total.textContent = String(readN * 4);
		st.totalSub.textContent = readN ? `= ${readN} × 4 services` : "";
		st.copiesN.textContent = uniq ? "4" : "0";
		for (const b of st.segs) setBar(b, uniq / 4);
	},
};
