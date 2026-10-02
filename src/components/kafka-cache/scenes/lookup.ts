import { SEQ1 } from "../data";
import {
	arrow,
	attr,
	box,
	cylinder,
	ease,
	el,
	flight,
	KEYS,
	type Key,
	op,
	ph,
	type Rec,
	rec,
	type SceneDef,
	setSlot,
	show,
	slot,
	strip,
	styleRec,
	txt,
} from "../engine";

const STORED_VERSION: Record<Key, number> = { I: 9, U: 2, D: 2, T: 2 };

interface State {
	req: SVGTextElement;
	arrow: SVGLineElement;
	recs: Rec[];
	noidx: SVGRectElement;
	q: SVGTextElement;
	noidxT: SVGTextElement;
	cursor: SVGLineElement;
	scanT: SVGTextElement;
	req2: SVGTextElement;
	arrow2: SVGLineElement;
	ret: Rec;
	retT: SVGTextElement;
}

export const lookupScene: SceneDef<State> = {
	dur: 5200,
	build({ svg }) {
		txt(svg, 400, 44, "inventory updates topic", "topic");
		box(svg, 40, 62, 160, 64, "service A", "needs one SKU");
		const req = txt(svg, 206, 80, "get(sku = 88123)", "req");
		const arrowToLog = arrow(svg, 206, 94, 206, 94);
		const recs = strip(svg, 400, 72, SEQ1, true);
		const noidx = el(
			"rect",
			{ x: 394, y: 66, width: 552, height: 34, rx: 6, class: "noindex" },
			svg,
		);
		const q = txt(svg, 950, 60, "?", "question", "end");
		const noidxT = txt(
			svg,
			934,
			140,
			"offsets only. no key index",
			"bad-label",
			"end",
		);
		const cursor = el(
			"line",
			{ x1: 400, y1: 64, x2: 400, y2: 102, class: "cursor" },
			svg,
		);
		const scanT = txt(svg, 400, 140, "", "bad-label");

		txt(svg, 400, 212, "NATS JetStream KV  ·  Redis", "topic");
		box(svg, 40, 230, 160, 64, "service A", "needs one SKU");
		const req2 = txt(svg, 206, 248, "get(sku = 88123)", "req");
		const arrow2 = arrow(svg, 206, 262, 206, 262);
		cylinder(svg, 400, 222, 190, 84);
		KEYS.forEach((k, i) => {
			setSlot(slot(svg, 418 + i * 40, 253), k, STORED_VERSION[k]);
		});
		const ret = rec(svg, "I", 9);
		show(ret, false);
		const retT = txt(svg, 934, 316, "1 request · 1 record", "ok-label", "end");

		return {
			req,
			arrow: arrowToLog,
			recs,
			noidx,
			q,
			noidxT,
			cursor,
			scanT,
			req2,
			arrow2,
			ret,
			retT,
		};
	},
	render(t, st) {
		const a = ph(t, 200, 700);
		attr(st.arrow, "x2", 206 + (394 - 206) * ease(a));
		op(st.req, a > 0 ? 1 : 0);

		const b = ph(t, 1000, 300);
		op(st.noidx, b);
		op(st.q, b);
		op(st.noidxT, b);

		const c = ph(t, 1500, 3000);
		const cx = 400 + 540 * c;
		attr(st.cursor, "x1", cx);
		attr(st.cursor, "x2", cx);
		op(st.cursor, c > 0 ? 1 : 0);
		const n = Math.floor(c * 15);
		st.scanT.textContent = c > 0 ? `scanned ${n} of 15 offsets for 1 key` : "";
		st.recs.forEach((r, i) => {
			styleRec(r, c > 0 && i === Math.min(14, n) ? "active" : "");
		});

		const d = ph(t, 2400, 600);
		attr(st.arrow2, "x2", 206 + (394 - 206) * ease(d));
		op(st.req2, d > 0 ? 1 : 0);
		const e = ph(t, 3100, 800);
		show(st.ret, e > 0);
		flight(st.ret, { x: 418, y: 253 }, { x: 156, y: 262 }, e, 30);
		op(st.retT, ph(t, 3900, 300));
	},
};
