import { SERVICE_NAMES } from "../data";
import {
	arrow,
	attr,
	BW,
	bounce,
	box,
	cylinder,
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
	ph,
	type Rec,
	rec,
	type SceneDef,
	type Slot,
	setClass,
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
	slot: number;
}

interface Lookup {
	svc: number;
	key: Key;
	at: number;
}

interface Service {
	bx: number;
	by: number;
	box: SVGGElement;
	face: Face;
	memT: SVGTextElement;
	line: SVGLineElement;
	lbl: SVGTextElement;
	ret: Rec;
	hold: SVGTextElement;
}

interface State {
	slots: Slot[];
	storeT: SVGTextElement;
	oneWrite: SVGTextElement;
	svcs: Service[];
	copiesN: SVGTextElement;
	lookN: SVGTextElement;
	puts: Put[];
	putCopies: Rec[];
	looks: Lookup[];
	putT: SVGTextElement;
}

const INITIAL_PUTS: readonly [Key, number][] = [
	["I", 18],
	["U", 3],
	["D", 3],
	["T", 2],
];
const UPDATE: Put = { key: "I", ver: 19, at: 5200, slot: 0 };

const LOOKUP_SERVICES = [0, 2, 1, 3, 2, 0, 3, 1, 0, 2, 1, 3];
const LOOKUP_KEYS: readonly Key[] = [
	"I",
	"U",
	"I",
	"T",
	"D",
	"I",
	"U",
	"I",
	"T",
	"I",
	"D",
	"I",
];

export const keyedScene: SceneDef<State> = {
	dur: 8400,
	build({ svg }) {
		box(svg, 40, 66, 160, 64, "publisher", "publishes updates");
		const putT = txt(svg, 206, 84, "put(id, record)", "req");
		arrow(svg, 206, 98, 394, 98);
		txt(svg, 400, 44, "NATS JetStream KV  ·  Redis", "topic");
		cylinder(svg, 400, 52, 190, 96);
		const slots = KEYS.map((_, j) => slot(svg, 418 + j * 40, 88));
		const storeT = txt(svg, 495, 166, "1 copy", "ok-label", "middle");
		const oneWrite = txt(svg, 934, 84, "", "ok-label", "end");

		const svcs = SERVICE_NAMES.map((name, i): Service => {
			const bx = 40 + i * 230;
			const by = 290;
			const boxG = box(svg, bx, by, 210, 84, name, "no Map · no hydration");
			const fc = face(svg, bx + 184, by + 72, "💪");
			const memT = txt(svg, bx + 12, by + 52, "memory: flat", "small");
			const line = el(
				"line",
				{ x1: bx + 105, y1: by, x2: bx + 105, y2: by, class: "req-line" },
				svg,
			);
			const lbl = txt(svg, bx + 112, by - 14, "", "small");
			const ret = rec(svg, "I", 1);
			show(ret, false);
			const hold = txt(svg, bx + 12, by + 66, "", "req");
			return { bx, by, box: boxG, face: fc, memT, line, lbl, ret, hold };
		});

		txt(svg, 40, 412, "ingested at startup", "small");
		txt(svg, 40, 442, "0", "big");
		txt(svg, 300, 412, "copies of the data", "small");
		const copiesN = txt(svg, 300, 442, "0", "big");
		txt(svg, 560, 412, "lookups served", "small");
		const lookN = txt(svg, 560, 442, "0", "big");

		const puts: Put[] = INITIAL_PUTS.map(([key, ver], j) => ({
			key,
			ver,
			at: 300 + j * 420,
			slot: j,
		}));
		puts.push(UPDATE);
		const putCopies = puts.map((p) => {
			const r = rec(svg, p.key, p.ver);
			show(r, false);
			return r;
		});
		const looks = LOOKUP_SERVICES.map(
			(svc, j): Lookup => ({ svc, key: LOOKUP_KEYS[j], at: 2300 + j * 470 }),
		);

		return {
			slots,
			storeT,
			oneWrite,
			svcs,
			copiesN,
			lookN,
			puts,
			putCopies,
			looks,
			putT,
		};
	},
	render(t, st) {
		const stored: Partial<Record<Key, { ver: number; at: number }>> = {};
		st.puts.forEach((p, j) => {
			if (p.at + 450 <= t) stored[p.key] = { ver: p.ver, at: p.at + 450 };
			const q = ph(t, p.at, 450);
			const g = st.putCopies[j];
			if (q <= 0 || q >= 1) show(g, false);
			else {
				show(g, true);
				flight(g, { x: 170, y: 87 }, st.slots[p.slot], q, -22);
			}
		});
		const anyPut = st.puts.some((p) => p.at <= t && p.at + 450 > t);
		op(st.putT, anyPut ? 1 : 0.35);
		KEYS.forEach((k, j) => {
			const o = stored[k];
			setSlot(
				st.slots[j],
				o ? k : null,
				o ? o.ver : null,
				o && t - o.at < 300 ? "flash" : "",
			);
		});

		const ready = Object.keys(stored).length > 0;
		st.copiesN.textContent = ready ? "1" : "0";
		op(st.storeT, ready ? 1 : 0);
		st.oneWrite.textContent =
			t >= UPDATE.at + 450 ? "one write · every service sees I19" : "";

		st.svcs.forEach((sv, i) => {
			show(sv.ret, false);
			sv.hold.textContent = "";
			attr(sv.line, "x2", sv.bx + 105);
			attr(sv.line, "y2", sv.by);
			sv.lbl.textContent = "";
			setClass(sv.box, "svc", ready ? "healthy" : "");
			const flex = Math.floor(t / 700 + i) % 2 === 0;
			bounce(
				sv.face,
				t,
				ready ? 3 : 0,
				350,
				ready ? (flex ? "💪" : "😎") : "🙂",
			);
		});

		let served = 0;
		for (const lk of st.looks) {
			const sv = st.svcs[lk.svc];
			if (lk.at + 900 <= t) served++;
			const a = ph(t, lk.at, 250);
			const b = ph(t, lk.at + 250, 400);
			const c = ph(t, lk.at + 650, 300);
			if (a <= 0 || c >= 1) continue;
			const sl = st.slots[KEY_INDEX[lk.key]];
			const tx = sl.x + BW / 2;
			const ty = 148;
			attr(sv.line, "x2", lerp(sv.bx + 105, tx, ease(a)));
			attr(sv.line, "y2", lerp(sv.by, ty, ease(a)));
			sv.lbl.textContent = `get(${lk.key})`;
			if (b > 0) {
				const o = stored[lk.key];
				setRec(sv.ret, lk.key, o ? o.ver : 0);
				show(sv.ret, true);
				flight(sv.ret, sl, { x: sv.bx + 165, y: sv.by + 50 }, b, 0);
				op(sv.ret, 1 - ease(c));
				sv.hold.textContent = c > 0 ? "used, not kept" : "";
			}
		}
		st.lookN.textContent = String(served);
		for (const sv of st.svcs) {
			sv.memT.textContent = served ? "memory flat · by key" : "memory flat";
		}
	},
};
