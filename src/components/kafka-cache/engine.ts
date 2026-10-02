const SVG_NS = "http://www.w3.org/2000/svg";

export type Key = "I" | "U" | "D" | "T";
export type Entry = readonly [Key, number];

export const KEYS: readonly Key[] = ["I", "U", "D", "T"];
export const KEY_INDEX: Record<Key, number> = { I: 0, U: 1, D: 2, T: 3 };

export const BW = 30;
export const BH = 22;
export const PITCH = 36;

export interface Point {
	x: number;
	y: number;
}

type Attrs = Record<string, string | number>;

/** Anything that owns a single SVG node we can move, hide or fade. */
export type Target = SVGElement | { g: SVGElement };

const nodeOf = (t: Target): SVGElement => (t instanceof SVGElement ? t : t.g);

/* ---------- math ---------- */

export const clamp = (v: number, a: number, b: number) =>
	Math.max(a, Math.min(b, v));
/** Progress (0..1) of a phase that starts at `s` and lasts `d` ms. */
export const ph = (t: number, s: number, d: number) => clamp((t - s) / d, 0, 1);
export const ease = (p: number) =>
	p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/* ---------- DOM helpers ---------- */

export function el<K extends keyof SVGElementTagNameMap>(
	tag: K,
	attrs: Attrs,
	parent?: Element,
): SVGElementTagNameMap[K] {
	const e = document.createElementNS(SVG_NS, tag);
	for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
	parent?.appendChild(e);
	return e;
}

export function attr(e: Element, name: string, v: string | number) {
	e.setAttribute(name, String(v));
}

export function txt(
	parent: Element,
	x: number,
	y: number,
	s: string | number,
	cls = "",
	anchor?: string,
): SVGTextElement {
	const t = el("text", { x, y, class: cls }, parent);
	if (anchor) t.setAttribute("text-anchor", anchor);
	t.textContent = String(s);
	return t;
}

function move(t: Target, x: number, y: number) {
	attr(nodeOf(t), "transform", `translate(${x},${y})`);
}
export function show(t: Target, on: boolean) {
	nodeOf(t).style.visibility = on ? "visible" : "hidden";
}
export function op(t: Target, v: number) {
	nodeOf(t).style.opacity = String(v);
}
export function setClass(e: Element, base: string, extra = "") {
	e.setAttribute("class", extra ? `${base} ${extra}` : base);
}

export function flight(t: Target, from: Point, to: Point, p: number, arc = 36) {
	const q = ease(p);
	move(
		t,
		lerp(from.x, to.x, q),
		lerp(from.y, to.y, q) - Math.sin(q * Math.PI) * arc,
	);
}

/* ---------- records, slots, boxes ---------- */

export interface Rec {
	g: SVGGElement;
	label: SVGTextElement;
	key: Key;
	ver: number;
	x: number;
	y: number;
}

export function rec(parent: Element, key: Key, ver: number, x = 0, y = 0): Rec {
	const g = el("g", { class: `rec k-${key}` }, parent);
	move(g, x, y);
	el("rect", { width: BW, height: BH, rx: 4 }, g);
	const label = txt(g, BW / 2, 15, `${key}${ver}`, "", "middle");
	return { g, label, key, ver, x, y };
}

export function styleRec(r: Rec, extra = "") {
	setClass(r.g, `rec k-${r.key}`, extra);
}

/** Re-point a record at a different key/version (used for reusable "in flight" records). */
export function setRec(r: Rec, key: Key, ver: number, extra = "") {
	r.key = key;
	r.ver = ver;
	r.label.textContent = `${key}${ver}`;
	styleRec(r, extra);
}

export function strip(
	parent: Element,
	x0: number,
	y: number,
	seq: readonly Entry[],
	withOffsets: boolean,
): Rec[] {
	return seq.map(([key, ver], i) => {
		const x = x0 + i * PITCH;
		const r = rec(parent, key, ver, x, y);
		if (withOffsets)
			txt(parent, x + BW / 2, y + BH + 14, i, "offset", "middle");
		return r;
	});
}

export interface Slot {
	g: SVGGElement;
	label: SVGTextElement;
	x: number;
	y: number;
}

export function slot(parent: Element, x: number, y: number): Slot {
	const g = el("g", { class: "slot" }, parent);
	move(g, x, y);
	el("rect", { width: BW, height: BH, rx: 4 }, g);
	const label = txt(g, BW / 2, 15, "", "", "middle");
	return { g, label, x, y };
}

export function setSlot(
	s: Slot,
	key: Key | null,
	ver: number | null,
	state = "",
) {
	setClass(s.g, `slot${key ? ` filled k-${key}` : ""}`, state);
	s.label.textContent = key ? `${key}${ver}` : state === "missing" ? "?" : "";
}

export function box(
	parent: Element,
	x: number,
	y: number,
	w: number,
	h: number,
	title: string,
	sub?: string,
): SVGGElement {
	const g = el("g", { class: "svc" }, parent);
	move(g, x, y);
	el("rect", { width: w, height: h, rx: 6 }, g);
	txt(g, 12, 20, title, "svc-title");
	if (sub) txt(g, 12, 36, sub, "svc-sub");
	return g;
}

export function cylinder(
	parent: Element,
	x: number,
	y: number,
	w: number,
	h: number,
): SVGGElement {
	const g = el("g", { class: "store" }, parent);
	move(g, x, y);
	const ry = 9;
	el(
		"path",
		{
			d: `M0 ${ry} v${h - 2 * ry} a${w / 2} ${ry} 0 0 0 ${w} 0 v-${h - 2 * ry}`,
		},
		g,
	);
	el("ellipse", { cx: w / 2, cy: ry, rx: w / 2, ry }, g);
	return g;
}

/** Straight arrow using the marker defined inside the scene's own <svg>. */
export function arrow(
	parent: SVGElement,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	extra = "",
): SVGLineElement {
	const owner =
		parent instanceof SVGSVGElement ? parent : parent.ownerSVGElement;
	const marker = owner?.querySelector("marker");
	const attrs: Attrs = { x1, y1, x2, y2, class: `arrow ${extra}`.trim() };
	if (marker) attrs["marker-end"] = `url(#${marker.id})`;
	return el("line", attrs, parent);
}

/* ---------- bars and faces ---------- */

export interface Bar {
	fill: SVGRectElement;
	w: number;
}

export function bar(
	parent: Element,
	x: number,
	y: number,
	w: number,
	h: number,
	fillCls = "bar-fill",
): Bar {
	el("rect", { x, y, width: w, height: h, rx: 2, class: "bar-bg" }, parent);
	const fill = el(
		"rect",
		{ x, y, width: 0, height: h, rx: 2, class: fillCls },
		parent,
	);
	return { fill, w };
}

export function setBar(b: Bar, p: number) {
	attr(b.fill, "width", Math.max(0, b.w * clamp(p, 0, 1)));
}

export interface Face {
	g: SVGTextElement;
	x: number;
	y: number;
}

export function face(parent: Element, x: number, y: number, ch: string): Face {
	return { g: txt(parent, x, y, ch, "face", "middle"), x, y };
}

export function bounce(
	f: Face,
	t: number,
	amp: number,
	speed: number,
	ch?: string,
) {
	attr(f.g, "y", f.y - Math.abs(Math.sin(t / speed)) * amp);
	if (ch !== undefined) f.g.textContent = ch;
}

/* ---------- scene runtime ---------- */

export const prefersReducedMotion = () =>
	window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface SceneCtx {
	root: HTMLElement;
	svg: SVGSVGElement;
	/** Cancel a running animation (used when the viewer takes over, e.g. a slider). */
	stop(): void;
}

export interface SceneDef<S> {
	dur: number;
	build(ctx: SceneCtx): S;
	render(t: number, state: S): void;
}

export interface Playable {
	played: boolean;
	play(): void;
}

export function mountScene<S>(root: HTMLElement, def: SceneDef<S>): Playable {
	const svg = root.querySelector<SVGSVGElement>("svg");
	if (!svg) throw new Error("scene root has no <svg>");

	const reduced = prefersReducedMotion();
	let raf: number | null = null;
	const stop = () => {
		if (raf !== null) cancelAnimationFrame(raf);
		raf = null;
	};

	const state = def.build({ root, svg, stop });
	const draw = (t: number) => def.render(t, state);

	const playable: Playable = {
		played: false,
		play() {
			stop();
			playable.played = true;
			if (reduced) {
				draw(def.dur);
				return;
			}
			const t0 = performance.now();
			const step = (now: number) => {
				const t = Math.min(now - t0, def.dur);
				draw(t);
				raf = t < def.dur ? requestAnimationFrame(step) : null;
			};
			raf = requestAnimationFrame(step);
		},
	};

	root
		.querySelector(".replay")
		?.addEventListener("click", () => playable.play());
	draw(def.dur);
	return playable;
}
