import {
	attr,
	type Bar,
	bar,
	flight,
	lerp,
	op,
	ph,
	type Rec,
	rec,
	type SceneDef,
	setBar,
	show,
	txt,
} from "../engine";

interface Row {
	y: number;
	key: SVGTextElement;
	bar: Bar;
	tag: SVGTextElement;
}

interface State {
	rows: Row[];
	put: Rec;
}

const ROWS: readonly (readonly [key: string, note: string])[] = [
	["inventory.88123", "no ttl · fresh while the heartbeat is"],
	["session.4f2a", "ttl 30s · each put restarts the clock"],
	["reservation.7c1e", "ttl 10s · no put, so it expires"],
];

export const ttlScene: SceneDef<State> = {
	dur: 7000,
	build({ svg }) {
		const rows = ROWS.map(([name, note], i): Row => {
			const y = 40 + i * 62;
			const key = txt(svg, 16, y, name, "req");
			txt(svg, 16, y + 18, note, "small");
			const b = bar(svg, 270, y - 10, 150, 10, "bar-fill");
			const tag = txt(svg, 270, y + 18, "", "small");
			return { y, key, bar: b, tag };
		});
		const put = rec(svg, "U", 4);
		show(put, false);
		return { rows, put };
	},
	render(t, st) {
		const [r0, r1, r2] = st.rows;

		setBar(r0.bar, 1);
		r0.tag.textContent = "rev 8 · stamped 09:14:02";

		const p = ph(t, 3000, 400);
		const lvl =
			t < 3000
				? lerp(1, 0.3, ph(t, 0, 3000))
				: lerp(0.3, 1, p) - (t > 3400 ? ph(t, 3400, 3600) * 0.7 : 0);
		setBar(r1.bar, lvl);
		r1.tag.textContent =
			t >= 3400
				? "put at 3s → 30s again"
				: `expires in ${Math.round(30 * lvl)}s`;
		show(st.put, p > 0 && p < 1);
		flight(st.put, { x: 200, y: r1.y - 16 }, { x: 270, y: r1.y - 16 }, p, 10);

		const q = ph(t, 0, 4000);
		setBar(r2.bar, 1 - q);
		op(r2.key, q >= 1 ? 0.4 : 1);
		r2.tag.textContent =
			q >= 1 ? "expired · tombstone" : `expires in ${Math.ceil(10 * (1 - q))}s`;
		attr(r2.bar.fill, "class", q > 0.7 ? "bar-bad" : "bar-fill");
	},
};
