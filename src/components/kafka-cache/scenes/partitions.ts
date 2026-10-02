import {
	attr,
	BH,
	bounce,
	ease,
	el,
	type Face,
	face,
	op,
	PITCH,
	ph,
	type Rec,
	rec,
	type SceneDef,
	setClass,
	styleRec,
	txt,
} from "../engine";

const LANES: readonly (readonly [sku: number, records: number])[] = [
	[88123, 6],
	[88124, 3],
	[88125, 5],
	[88126, 2],
];

const COLS = 40;
const ROWS = 13;
const CELL = 12;
const CELL_PITCH = 14;
const GRID_X = 48;
const GRID_Y = 256;

interface State {
	firstLane: Rec[];
	cursor: SVGLineElement;
	scanT: SVGTextElement;
	scanT2: SVGTextElement;
	cells: SVGRectElement[];
	l1: SVGLineElement;
	l1T: SVGTextElement;
	l2: SVGLineElement;
	l2T: SVGTextElement;
	count: SVGTextElement;
	repl: SVGTextElement;
	face: Face;
	verdict: SVGTextElement;
}

export const partitionsScene: SceneDef<State> = {
	dur: 8400,
	build({ svg }) {
		txt(
			svg,
			48,
			30,
			"to read only one SKU, its updates must be alone in a partition",
			"seg",
		);
		const laneRecs = LANES.map(([sku, records], i) => {
			const y = 44 + i * 34;
			const g = el("g", { class: "part" }, svg);
			txt(g, 48, y + 15, `p${i}`, "req");
			el(
				"rect",
				{ x: 78, y, width: 380, height: BH + 6, rx: 4, class: "lane" },
				g,
			);
			const recs: Rec[] = [];
			for (let j = 0; j < records; j++) {
				recs.push(rec(g, "I", j + 1, 84 + j * PITCH, y + 3));
			}
			txt(g, 470, y + 15, `SKU ${sku}`, "small");
			return recs;
		});
		txt(svg, 48, 44 + 4 * 34 + 15, "p4 … p49,999", "small");
		txt(svg, 470, 44 + 4 * 34 + 15, "49,996 more SKUs", "small");
		const cursor = el(
			"line",
			{ x1: 84, y1: 40, x2: 84, y2: 74, class: "cursor" },
			svg,
		);
		const scanT = txt(svg, 640, 59, "", "ok-label");
		const scanT2 = txt(svg, 640, 93, "", "small");

		txt(svg, 48, 246, "one partition per SKU", "seg");
		txt(svg, 270, 246, "each cell = 100 partitions", "small");
		const cells: SVGRectElement[] = [];
		for (let r = 0; r < ROWS; r++) {
			for (let c = 0; c < COLS; c++) {
				cells.push(
					el(
						"rect",
						{
							x: GRID_X + c * CELL_PITCH,
							y: GRID_Y + r * CELL_PITCH,
							width: CELL,
							height: CELL,
							rx: 2,
							class: "cell",
						},
						svg,
					),
				);
			}
		}
		const gridBottom = GRID_Y + ROWS * CELL_PITCH;
		const labelX = GRID_X + COLS * CELL_PITCH + 12;
		const limitLine = (row: number) =>
			el(
				"line",
				{
					x1: GRID_X - 4,
					y1: GRID_Y + row * CELL_PITCH - 1,
					x2: GRID_X + COLS * CELL_PITCH,
					y2: GRID_Y + row * CELL_PITCH - 1,
					class: "limit",
				},
				svg,
			);
		const l1 = limitLine(1);
		const l1T = txt(
			svg,
			labelX,
			GRID_Y + CELL_PITCH + 3,
			"4,000 · per-broker guidance",
			"bad-label",
		);
		const l2 = limitLine(5);
		const l2T = txt(
			svg,
			labelX,
			GRID_Y + 5 * CELL_PITCH + 3,
			"20,000 · per-cluster guidance",
			"bad-label",
		);
		const count = txt(svg, labelX, GRID_Y + 9 * CELL_PITCH + 4, "0", "big");
		txt(
			svg,
			labelX,
			GRID_Y + 9 * CELL_PITCH + 24,
			"partitions for SKUs alone",
			"small",
		);
		const repl = txt(svg, labelX, GRID_Y + 12 * CELL_PITCH + 4, "", "small");
		const f = face(svg, labelX + 158, GRID_Y + 9 * CELL_PITCH + 4, "🙂");
		const verdict = txt(svg, 48, gridBottom + 24, "", "bad-label");

		return {
			firstLane: laneRecs[0],
			cursor,
			scanT,
			scanT2,
			cells,
			l1,
			l1T,
			l2,
			l2T,
			count,
			repl,
			face: f,
			verdict,
		};
	},
	render(t, st) {
		const a = ph(t, 300, 1800);
		const cx = 84 + 5 * PITCH * a;
		attr(st.cursor, "x1", cx);
		attr(st.cursor, "x2", cx);
		op(st.cursor, a > 0 ? 1 : 0);
		const n = Math.min(6, Math.floor(a * 6) + (a > 0 ? 1 : 0));
		st.scanT.textContent =
			a > 0 ? `get(88123) reads p0 only: ${n} records` : "";
		st.scanT2.textContent =
			a >= 1 ? "works, for exactly one SKU per partition" : "";
		st.firstLane.forEach((r, i) => {
			styleRec(
				r,
				a > 0 && a < 1 && i === Math.min(5, Math.floor(a * 6)) ? "active" : "",
			);
		});

		const b = ph(t, 2800, 4400);
		const count = Math.round(50000 * ease(b));
		const filled = Math.round(count / 100);
		st.cells.forEach((c, i) => {
			const on = i < filled;
			setClass(
				c,
				"cell",
				on ? (i >= 200 ? "on over" : i >= 40 ? "on warn" : "on") : "",
			);
		});
		st.count.textContent = count.toLocaleString();
		st.repl.textContent = count
			? `× 3 replicas = ${(count * 3).toLocaleString()}`
			: "";
		bounce(
			st.face,
			t,
			count < 4000 ? 0 : count < 20000 ? 5 : 10,
			130,
			count < 4000 ? "🙂" : count < 20000 ? "😬" : count < 50000 ? "😵" : "💀",
		);
		const over1 = count >= 4000;
		const over2 = count >= 20000;
		op(st.l1, over1 ? 1 : 0.25);
		op(st.l1T, over1 ? 1 : 0.35);
		op(st.l2, over2 ? 1 : 0.25);
		op(st.l2T, over2 ? 1 : 0.35);
		st.verdict.textContent =
			b >= 1
				? "50,000 partitions for SKUs alone, and each service still needs an SKU → partition table: the index again"
				: "";
	},
};
