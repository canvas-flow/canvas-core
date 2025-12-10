import React, { createContext, createElement, forwardRef, memo, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Background, Controls, Handle, MarkerType, NodeResizer, NodeToolbar, Position, ReactFlow, addEdge, useEdges, useEdgesState, useNodesData, useNodesState, useReactFlow } from "@xyflow/react";
import { createPortal } from "react-dom";
var __commonJSMin = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), __require = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function.");
}), toKebabCase = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), mergeClasses = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, Icon = forwardRef(({ color: e = "currentColor", size: t = 24, strokeWidth: r = 2, absoluteStrokeWidth: i, className: a = "", children: o, iconNode: s, ...c }, l) => createElement("svg", {
	ref: l,
	...defaultAttributes,
	width: t,
	height: t,
	stroke: e,
	strokeWidth: i ? Number(r) * 24 / Number(t) : r,
	className: mergeClasses("lucide", a),
	...c
}, [...s.map(([e, t]) => createElement(e, t)), ...Array.isArray(o) ? o : [o]])), createLucideIcon = (e, t) => {
	let i = forwardRef(({ className: r, ...i }, a) => createElement(Icon, {
		ref: a,
		iconNode: t,
		className: mergeClasses(`lucide-${toKebabCase(e)}`, r),
		...i
	}));
	return i.displayName = `${e}`, i;
}, ChevronRight = createLucideIcon("ChevronRight", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), Clipboard = createLucideIcon("Clipboard", [["rect", {
	width: "8",
	height: "4",
	x: "8",
	y: "2",
	rx: "1",
	ry: "1",
	key: "tgr4d6"
}], ["path", {
	d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
	key: "116196"
}]]), Copy = createLucideIcon("Copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]), FileText = createLucideIcon("FileText", [
	["path", {
		d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
		key: "1rqfz7"
	}],
	["path", {
		d: "M14 2v4a2 2 0 0 0 2 2h4",
		key: "tnqrlb"
	}],
	["path", {
		d: "M10 9H8",
		key: "b1mrlr"
	}],
	["path", {
		d: "M16 13H8",
		key: "t4e002"
	}],
	["path", {
		d: "M16 17H8",
		key: "z1uh3a"
	}]
]), FolderInput = createLucideIcon("FolderInput", [
	["path", {
		d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",
		key: "fm4g5t"
	}],
	["path", {
		d: "M2 13h10",
		key: "pgb2dq"
	}],
	["path", {
		d: "m9 16 3-3-3-3",
		key: "6m91ic"
	}]
]), Group = createLucideIcon("Group", [
	["path", {
		d: "M3 7V5c0-1.1.9-2 2-2h2",
		key: "adw53z"
	}],
	["path", {
		d: "M17 3h2c1.1 0 2 .9 2 2v2",
		key: "an4l38"
	}],
	["path", {
		d: "M21 17v2c0 1.1-.9 2-2 2h-2",
		key: "144t0e"
	}],
	["path", {
		d: "M7 21H5c-1.1 0-2-.9-2-2v-2",
		key: "rtnfgi"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "7",
		y: "7",
		rx: "1",
		key: "1eyiv7"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "10",
		y: "12",
		rx: "1",
		key: "1qlmkx"
	}]
]), Image = createLucideIcon("Image", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		ry: "2",
		key: "1m3agn"
	}],
	["circle", {
		cx: "9",
		cy: "9",
		r: "2",
		key: "af1f0g"
	}],
	["path", {
		d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
		key: "1xmnt7"
	}]
]), Layers = createLucideIcon("Layers", [
	["path", {
		d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
		key: "zw3jo"
	}],
	["path", {
		d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
		key: "1wduqc"
	}],
	["path", {
		d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
		key: "kqbvx6"
	}]
]), LoaderCircle = createLucideIcon("LoaderCircle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), MousePointerClick = createLucideIcon("MousePointerClick", [
	["path", {
		d: "M14 4.1 12 6",
		key: "ita8i4"
	}],
	["path", {
		d: "m5.1 8-2.9-.8",
		key: "1go3kf"
	}],
	["path", {
		d: "m6 12-1.9 2",
		key: "mnht97"
	}],
	["path", {
		d: "M7.2 2.2 8 5.1",
		key: "1cfko1"
	}],
	["path", {
		d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
		key: "s0h3yz"
	}]
]), Music = createLucideIcon("Music", [
	["path", {
		d: "M9 18V5l12-2v13",
		key: "1jmyc2"
	}],
	["circle", {
		cx: "6",
		cy: "18",
		r: "3",
		key: "fqmcym"
	}],
	["circle", {
		cx: "18",
		cy: "16",
		r: "3",
		key: "1hluhg"
	}]
]), PenLine = createLucideIcon("PenLine", [["path", {
	d: "M12 20h9",
	key: "t2du7b"
}], ["path", {
	d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
	key: "1ykcvy"
}]]), Play = createLucideIcon("Play", [["polygon", {
	points: "6 3 20 12 6 21 6 3",
	key: "1oa8hb"
}]]), Plus = createLucideIcon("Plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), Save = createLucideIcon("Save", [
	["path", {
		d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
		key: "1c8476"
	}],
	["path", {
		d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
		key: "1ydtos"
	}],
	["path", {
		d: "M7 3v4a1 1 0 0 0 1 1h7",
		key: "t51u73"
	}]
]), Sparkles = createLucideIcon("Sparkles", [
	["path", {
		d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
		key: "4pj2yx"
	}],
	["path", {
		d: "M20 3v4",
		key: "1olli1"
	}],
	["path", {
		d: "M22 5h-4",
		key: "1gvqau"
	}],
	["path", {
		d: "M4 17v2",
		key: "vumght"
	}],
	["path", {
		d: "M5 18H3",
		key: "zchphs"
	}]
]), Trash2 = createLucideIcon("Trash2", [
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",
		key: "4alrt4"
	}],
	["path", {
		d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",
		key: "v07s0e"
	}],
	["line", {
		x1: "10",
		x2: "10",
		y1: "11",
		y2: "17",
		key: "1uufr5"
	}],
	["line", {
		x1: "14",
		x2: "14",
		y1: "11",
		y2: "17",
		key: "xtxkd"
	}]
]), Ungroup = createLucideIcon("Ungroup", [["rect", {
	width: "8",
	height: "6",
	x: "5",
	y: "4",
	rx: "1",
	key: "nzclkv"
}], ["rect", {
	width: "8",
	height: "6",
	x: "11",
	y: "14",
	rx: "1",
	key: "4tytwb"
}]]), Upload = createLucideIcon("Upload", [
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["polyline", {
		points: "17 8 12 3 7 8",
		key: "t8dd8p"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "3",
		y2: "15",
		key: "widbto"
	}]
]), Video = createLucideIcon("Video", [["path", {
	d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
	key: "ftymec"
}], ["rect", {
	x: "2",
	y: "6",
	width: "14",
	height: "12",
	rx: "2",
	key: "158x01"
}]]), X = createLucideIcon("X", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
const generateId = (e = "node") => `${e}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, toReactFlowNodes = (e, t = []) => {
	let n = new Map(t.map((e) => [e.id, e])), r = e.map((e) => {
		let t = e.groupId, r = t ? n.get(t) : void 0, i = e.position, a;
		return r && (a = r.id, i = e.position), {
			id: e.id,
			type: e.type,
			position: i,
			parentId: a,
			extent: a ? "parent" : void 0,
			expandParent: !0,
			draggable: !0,
			zIndex: 10,
			width: e.width || 250,
			height: e.height || 250,
			style: {
				width: e.width ? `${e.width}px` : "250px",
				height: e.height ? `${e.height}px` : "250px"
			},
			data: {}
		};
	});
	return [...t.map((e) => ({
		id: e.id,
		type: "group",
		position: e.position,
		zIndex: -1,
		draggable: !0,
		width: e.width,
		height: e.height,
		style: {
			width: e.width,
			height: e.height
		},
		data: {
			label: e.label,
			style: e.style
		}
	})), ...r];
}, fromReactFlowNodes = (e, t = []) => {
	let n = [], r = [], i = new Map(t.map((e) => [e.id, e])), a = /* @__PURE__ */ new Map();
	return e.forEach((e) => {
		if (e.type === "group") {
			a.set(e.id, { position: e.position });
			let t = i.get(e.id);
			r.push({
				id: e.id,
				label: t?.label || "Group",
				position: e.position,
				width: e.measured?.width || e.width || 200,
				height: e.measured?.height || e.height || 100,
				style: t?.style
			});
		}
	}), e.forEach((e) => {
		if (e.type === "group") return;
		let t = e.position, r = e.parentId;
		if (r) {
			let n = a.get(r);
			n && (t = {
				x: e.position.x + n.position.x,
				y: e.position.y + n.position.y
			});
		}
		n.push({
			id: e.id,
			type: e.type || "default",
			position: t,
			width: e.measured?.width || e.width || 250,
			height: e.measured?.height || e.height || 250,
			groupId: r
		});
	}), {
		nodes: n,
		groups: r
	};
}, toReactFlowEdges = (e) => e.map((e) => ({
	id: e.id,
	source: e.source,
	target: e.target,
	sourceHandle: e.sourceHandle,
	targetHandle: e.targetHandle,
	data: e.data,
	markerEnd: {
		type: MarkerType.ArrowClosed,
		width: 20,
		height: 20,
		color: "#888"
	}
})), fromReactFlowEdges = (e) => e.map((e) => ({
	id: e.id,
	source: e.source,
	target: e.target,
	sourceHandle: e.sourceHandle,
	targetHandle: e.targetHandle,
	data: e.data
})), getBounds = (e) => {
	if (e.length === 0) return {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	let t = Infinity, n = Infinity, r = -Infinity, i = -Infinity;
	return e.forEach((e) => {
		let a = e.width || 200, o = e.height || 40;
		t = Math.min(t, e.position.x), n = Math.min(n, e.position.y), r = Math.max(r, e.position.x + a), i = Math.max(i, e.position.y + o);
	}), {
		x: t,
		y: n,
		width: r - t,
		height: i - n
	};
}, checkIsDag = (e, t, n) => {
	let { source: r, target: i } = n;
	if (r === i) return !1;
	let a = /* @__PURE__ */ new Map();
	e.forEach((e) => a.set(e.id, [])), t.forEach((e) => {
		let t = a.get(e.source) || [];
		t.push(e.target), a.set(e.source, t);
	});
	let o = /* @__PURE__ */ new Set(), s = [i];
	for (; s.length > 0;) {
		let e = s.pop();
		if (e === r) return !1;
		if (!o.has(e)) {
			o.add(e);
			let t = a.get(e) || [];
			for (let e of t) s.push(e);
		}
	}
	return !0;
};
let StandardNodeType = /* @__PURE__ */ function(e) {
	return e.TEXT = "text", e.IMAGE = "image", e.VIDEO = "video", e.AUDIO = "audio", e.UPLOAD = "user-upload", e;
}({});
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), require_react_jsx_runtime_development = /* @__PURE__ */ __commonJSMin(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === O ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case _: return "Fragment";
				case y: return "Profiler";
				case v: return "StrictMode";
				case S: return "Suspense";
				case C: return "SuspenseList";
				case E: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case g: return "Portal";
				case x: return e.displayName || "Context";
				case b: return (e._context.displayName || "Context") + ".Consumer";
				case he:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case w: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case T:
					n = e._payload, e = e._init;
					try {
						return t(e(n));
					} catch {}
			}
			return null;
		}
		function n(e) {
			return "" + e;
		}
		function r(e) {
			try {
				n(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var r = t.error, i = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return r.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", i), n(e);
			}
		}
		function i(e) {
			if (e === _) return "<>";
			if (typeof e == "object" && e && e.$$typeof === T) return "<...>";
			try {
				var n = t(e);
				return n ? "<" + n + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function a() {
			var e = k.A;
			return e === null ? null : e.getOwner();
		}
		function o() {
			return Error("react-stack-top-frame");
		}
		function s(e) {
			if (A.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function c(e, t) {
			function n() {
				N || (N = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function l() {
			var e = t(this.type);
			return P[e] || (P[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function u(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: h,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: l
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function d(e, n, i, o, l, d) {
			var p = n.children;
			if (p !== void 0) if (o) if (j(p)) {
				for (o = 0; o < p.length; o++) f(p[o]);
				Object.freeze && Object.freeze(p);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else f(p);
			if (A.call(n, "key")) {
				p = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", L[p + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, p, m, p), L[p + o] = !0);
			}
			if (p = null, i !== void 0 && (r(i), p = "" + i), s(n) && (r(n.key), p = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return p && c(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), u(e, p, i, a(), l, d);
		}
		function f(e) {
			p(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === T && (e._payload.status === "fulfilled" ? p(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function p(e) {
			return typeof e == "object" && !!e && e.$$typeof === h;
		}
		var m = __require("react"), h = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), _ = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), b = Symbol.for("react.consumer"), x = Symbol.for("react.context"), he = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), w = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), E = Symbol.for("react.activity"), O = Symbol.for("react.client.reference"), k = m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, A = Object.prototype.hasOwnProperty, j = Array.isArray, M = console.createTask ? console.createTask : function() {
			return null;
		};
		m = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var N, P = {}, F = m.react_stack_bottom_frame.bind(m, o)(), I = M(i(o)), L = {};
		e.Fragment = _, e.jsx = function(e, t, n) {
			var r = 1e4 > k.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !1, r ? Error("react-stack-top-frame") : F, r ? M(i(e)) : I);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > k.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !0, r ? Error("react-stack-top-frame") : F, r ? M(i(e)) : I);
		};
	})();
})), import_jsx_runtime = (/* @__PURE__ */ __commonJSMin(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = require_react_jsx_runtime_production() : t.exports = require_react_jsx_runtime_development();
})))(), DEFAULT_NODE_TYPES = [
	{
		type: StandardNodeType.TEXT,
		label: "文本",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { size: 16 })
	},
	{
		type: StandardNodeType.IMAGE,
		label: "图片",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 16 })
	},
	{
		type: StandardNodeType.VIDEO,
		label: "视频",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { size: 16 })
	},
	{
		type: StandardNodeType.AUDIO,
		label: "音频",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { size: 16 })
	},
	{
		type: StandardNodeType.UPLOAD,
		label: "上传",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 16 })
	}
];
const FloatingNodeMenu = ({ onAddNode: e, availableTypes: t = DEFAULT_NODE_TYPES, position: n, onClose: r }) => {
	let [i, a] = useState(!1), o = useRef(null), c = !!n, l = c || i;
	return useEffect(() => {
		if (c && r) {
			let e = (e) => {
				o.current && !o.current.contains(e.target) && r();
			};
			return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
		}
	}, [c, r]), c ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: o,
		style: {
			position: "fixed",
			left: n.x,
			top: n.y,
			background: "#222",
			border: "1px solid #444",
			borderRadius: 8,
			padding: 8,
			display: "flex",
			flexDirection: "column",
			gap: 4,
			boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
			zIndex: 1e3,
			minWidth: 140
		},
		children: t.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: () => {
				e(t.type), c || a(!1);
			},
			style: {
				padding: "8px 12px",
				borderRadius: 4,
				cursor: "pointer",
				color: "#eee",
				fontSize: 14,
				transition: "background 0.2s",
				display: "flex",
				alignItems: "center",
				gap: 10
			},
			onMouseEnter: (e) => e.currentTarget.style.background = "#444",
			onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
			children: [t.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label })]
		}, t.type))
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "absolute",
			left: 24,
			top: "50%",
			transform: "translateY(-50%)",
			width: 48,
			height: 48,
			borderRadius: "50%",
			background: i ? "#666" : "#333",
			border: "1px solid #444",
			color: "#fff",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			cursor: "pointer",
			boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
			zIndex: 100,
			transition: "all 0.2s"
		},
		onClick: () => a(!i),
		onMouseEnter: (e) => e.currentTarget.style.background = i ? "#666" : "#444",
		onMouseLeave: (e) => e.currentTarget.style.background = i ? "#666" : "#333",
		title: "Add Node",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
			size: 24,
			style: {
				transform: i ? "rotate(45deg)" : "none",
				transition: "transform 0.2s"
			}
		})
	}), l && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "absolute",
			left: 84,
			top: "50%",
			transform: "translateY(-50%)",
			background: "#222",
			border: "1px solid #444",
			borderRadius: 8,
			padding: 8,
			display: "flex",
			flexDirection: "column",
			gap: 4,
			boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
			zIndex: 100,
			minWidth: 140
		},
		children: t.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: () => {
				e(t.type), a(!1);
			},
			style: {
				padding: "8px 12px",
				borderRadius: 4,
				cursor: "pointer",
				color: "#eee",
				fontSize: 14,
				transition: "background 0.2s",
				display: "flex",
				alignItems: "center",
				gap: 10
			},
			onMouseEnter: (e) => e.currentTarget.style.background = "#444",
			onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
			children: [t.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label })]
		}, t.type))
	})] });
}, ContextMenu = ({ items: e, position: t, onClose: n }) => {
	let r = useRef(null);
	return useEffect(() => {
		let e = (e) => {
			r.current && !r.current.contains(e.target) && n();
		};
		return document.addEventListener("mousedown", e), () => document.removeEventListener("mousedown", e);
	}, [n]), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: r,
		className: "canvas-context-menu",
		style: {
			position: "fixed",
			top: t.y,
			left: t.x,
			zIndex: 1e3,
			backgroundColor: "#222",
			border: "1px solid #444",
			borderRadius: "8px",
			boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
			padding: "8px",
			minWidth: "140px",
			display: "flex",
			flexDirection: "column",
			gap: "4px"
		},
		children: e.map((e, t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `context-menu-item ${e.disabled ? "disabled" : ""}`,
			onClick: () => {
				e.disabled || (e.onClick(), n());
			},
			style: {
				padding: "8px 12px",
				borderRadius: "4px",
				cursor: e.disabled ? "not-allowed" : "pointer",
				opacity: e.disabled ? .5 : 1,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				fontSize: "14px",
				color: "#eee",
				transition: "background 0.2s"
			},
			onMouseEnter: (t) => {
				e.disabled || (t.currentTarget.style.backgroundColor = "#444");
			},
			onMouseLeave: (t) => {
				e.disabled || (t.currentTarget.style.backgroundColor = "transparent");
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: "8px"
				},
				children: [e.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						display: "flex",
						alignItems: "center"
					},
					children: e.icon
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.label })]
			}), e.shortcut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				style: {
					color: "#999",
					fontSize: "12px",
					marginLeft: "10px"
				},
				children: e.shortcut
			})]
		}, t))
	});
};
var CanvasContext = createContext(null);
const CanvasProvider = ({ children: e, ...t }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasContext.Provider, {
	value: t,
	children: e
}), useCanvasContext = () => {
	let e = useContext(CanvasContext);
	if (!e) throw Error("useCanvasContext must be used within a CanvasProvider");
	return e;
};
function useDebouncedCallback(e, t) {
	let n = useRef(e), r = useRef(void 0);
	return useEffect(() => {
		n.current = e;
	}, [e]), useCallback((...e) => {
		r.current && clearTimeout(r.current), r.current = setTimeout(() => {
			n.current(...e);
		}, t);
	}, [t]);
}
const UniversalNode = memo((e) => {
	let { id: t, data: n, selected: r, style: i } = e, { config: a, components: o, readOnly: c, onNodeRun: u, runningNodeId: f, isExecuting: p, onNodeDataChange: h, inspectingNodeId: g, mediaMap: y, mediaEmitter: b, updateNodeMedia: he, renderNodeInspector: C } = useCanvasContext(), { setNodes: T, getNode: E } = useReactFlow(), D = useEdges(), [O, k] = useState(() => {
		let e = y.get(t);
		return e && Object.keys(e).length > 0 ? e : n || {};
	});
	useEffect(() => {
		let e = (e) => {
			k(e);
		};
		return b.on(t, e), () => b.off(t, e);
	}, [t, b]);
	let A = e.type || "default", j = a.nodeDefinitions.find((e) => e.type === A);
	if (!j) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			padding: 10,
			border: "1px solid red",
			borderRadius: 4,
			background: "#fff0f0"
		},
		children: ["Unknown node type: ", A]
	});
	let M = o[j.component], N = useDebouncedCallback((e, t) => {
		h && h(e, t);
	}, 500), P = (e) => {
		k((t) => ({
			...t,
			...e
		})), N(t, e);
	}, F = D.some((e) => e.source === t || e.target === t), I = useNodesData(useMemo(() => D.filter((e) => e.target === t).map((e) => e.source), [D, t]));
	useMemo(() => I ? (Array.isArray(I) ? I : [I]).map((e) => {
		if (!e) return null;
		let t = a.nodeDefinitions.find((t) => t.type === e.type);
		return {
			id: e.id,
			type: e.type,
			label: t?.label,
			data: e.data
		};
	}).filter((e) => !!e) : [], [I, a.nodeDefinitions]);
	let L = {
		nodeId: t,
		data: {
			...n,
			...O
		},
		selected: !!r,
		isConnected: F,
		onChange: P,
		onRun: u ? () => u(t) : void 0,
		style: i
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `canvas-node ${r ? "selected" : ""}`,
		style: {
			width: "100%",
			height: "100%"
		},
		children: [
			C && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeToolbar, {
				isVisible: t === g && !c,
				position: Position.Bottom,
				children: C({
					nodeId: t,
					node: {
						id: t,
						type: A,
						position: {
							x: 0,
							y: 0
						},
						data: O
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "canvas-node-label",
				children: j.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "target",
				position: Position.Left,
				className: "canvas-handle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "canvas-node-body",
				style: { position: "relative" },
				children: [
					M ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(M, { ...L }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { padding: 10 },
						children: ["Missing Component: ", j.component]
					}),
					(O._loading || O._executionStatus === "running") && !O.src && !O.output && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cf-upload-loading-overlay",
						style: {
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background: "rgba(0,0,0,0.7)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 20,
							color: "#fff",
							gap: 8,
							borderRadius: "inherit"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "cf-spinner",
								size: 24,
								style: { animation: "spin 1s linear infinite" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: { fontSize: 12 },
								children: "Running..."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }" })
						]
					}),
					O._error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cf-node-error-overlay",
						style: {
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background: "rgba(220, 38, 38, 0.9)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 20,
							color: "#fff",
							gap: 8,
							borderRadius: "inherit",
							padding: 12
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 14,
								fontWeight: 600
							},
							children: "⚠️ Error"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 12,
								textAlign: "center",
								wordBreak: "break-word"
							},
							children: O._error
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "source",
				position: Position.Right,
				className: "canvas-handle"
			})
		]
	});
}), ActionToolbar = ({ actions: t, className: n = "", style: r, visible: i = !0 }) => !i || t.length === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: `canvas-node-toolbar ${n}`,
	style: r,
	onMouseDown: (e) => e.stopPropagation(),
	children: t.map((t) => {
		let n = t.icon;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: `canvas-node-toolbar-item ${t.className || ""}`,
			onClick: t.onClick,
			title: t.title || t.label,
			children: [t.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "toolbar-item-icon",
				children: React.isValidElement(t.icon) ? t.icon : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, { size: 14 })
			}), t.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "toolbar-item-label",
				children: t.label
			})]
		}, t.id);
	})
}), GroupNode = memo(({ id: e, data: t, selected: n }) => {
	let { setNodes: r } = useReactFlow(), { onGroupAction: i } = useCanvasContext(), [o, s] = useState(!1), [c, u] = useState(t.label || "Group"), f = t.style, p = useCallback(() => {
		s(!1), r((t) => t.map((t) => t.id === e ? {
			...t,
			data: {
				...t.data,
				label: c
			}
		} : t)), i && i("update", {
			id: e,
			label: c
		});
	}, [
		e,
		c,
		r,
		i
	]), m = useCallback((t) => {
		t.stopPropagation(), i && i("ungroup", { id: e });
	}, [e, i]), h = useCallback((t) => {
		t.stopPropagation(), i && i("run", { id: e });
	}, [e, i]), _ = useMemo(() => [
		{
			id: "run",
			label: "整组执行",
			icon: Play,
			onClick: h,
			className: "text-green"
		},
		{
			id: "save",
			label: "保存",
			icon: Save,
			onClick: (t) => {
				t.stopPropagation(), i && i("save", { id: e });
			}
		},
		{
			id: "ungroup",
			label: "解组",
			icon: Ungroup,
			onClick: m
		}
	], [h, m]), v = t.toolbarActions || _, y = useCallback((t, n) => {
		i && i("update", {
			id: e,
			width: n.width,
			height: n.height,
			style: {
				...f,
				width: n.width,
				height: n.height
			}
		});
	}, [
		e,
		f,
		i
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			height: "100%",
			backgroundColor: f?.backgroundColor || "rgba(30, 30, 30, 0.6)",
			border: n ? "1px solid #ffffff" : "1px solid rgba(255,255,255,0.1)",
			borderRadius: 12,
			position: "relative",
			transition: "all 0.2s ease",
			boxShadow: n ? "0 0 0 2px rgba(255, 255, 255, 0.2)" : "none"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeResizer, {
			minWidth: 100,
			minHeight: 100,
			isVisible: !!n,
			lineStyle: { border: "none" },
			handleStyle: {
				width: 10,
				height: 10,
				borderRadius: 2
			},
			color: "#ffffff",
			onResizeEnd: y
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: -34,
				left: 0,
				right: 0,
				height: 30,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				pointerEvents: "none"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					padding: "4px 8px",
					backgroundColor: "rgba(0,0,0,0.5)",
					borderRadius: 4,
					color: "#ccc",
					fontSize: 12,
					cursor: "text",
					fontWeight: 500,
					pointerEvents: "auto",
					display: "flex",
					alignItems: "center",
					maxWidth: "60%"
				},
				onDoubleClick: () => s(!0),
				children: o ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: !0,
					value: c,
					onChange: (e) => u(e.target.value),
					onBlur: p,
					onKeyDown: (e) => e.key === "Enter" && p(),
					onMouseDown: (e) => e.stopPropagation(),
					style: {
						background: "transparent",
						border: "none",
						color: "inherit",
						outline: "none",
						width: "100%",
						minWidth: 50
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis"
					},
					children: t.label
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionToolbar, {
				actions: v,
				visible: !0,
				style: {
					marginLeft: "auto",
					opacity: n ? 1 : 0,
					transition: "opacity 0.2s",
					pointerEvents: n ? "auto" : "none"
				}
			})]
		})]
	});
}), SelectionMenu = ({ selectedNodes: e, onCreateGroup: t }) => {
	let { flowToScreenPosition: n } = useReactFlow(), r = e.filter((e) => e.type !== "group");
	if (r.length < 2) return null;
	let i = getBounds(r.map((e) => ({
		position: e.position,
		width: e.measured?.width || e.width || 0,
		height: e.measured?.height || e.height || 0
	}))), a = n({
		x: i.x + i.width / 2,
		y: i.y
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "absolute",
			left: a.x,
			top: a.y - 40,
			transform: "translate(-50%, -100%)",
			zIndex: 2e3,
			pointerEvents: "all"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: (e) => {
				e.stopPropagation(), t();
			},
			style: {
				display: "flex",
				alignItems: "center",
				gap: 6,
				padding: "8px 16px",
				backgroundColor: "#1a1a1a",
				color: "white",
				border: "1px solid #333",
				borderRadius: 20,
				cursor: "pointer",
				boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
				fontSize: 13,
				fontWeight: 500,
				outline: "none"
			},
			onMouseEnter: (e) => e.currentTarget.style.backgroundColor = "#2a2a2a",
			onMouseLeave: (e) => e.currentTarget.style.backgroundColor = "#1a1a1a",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { size: 14 }), "编组"]
		})
	});
};
function useCanvasConnection({ nodes: e, edges: t, setEdges: n, setNodes: r, onEdgeAdd: i, onNodeAdd: o, config: s, rfInstance: c }) {
	let [f, p] = useState(!1), [m, g] = useState({
		isOpen: !1,
		position: {
			x: 0,
			y: 0
		},
		source: null
	}), _ = useRef(null), v = useCallback((e, t) => {
		let n = s.nodeDefinitions.find((t) => t.type === e), r = s.nodeDefinitions.find((e) => e.type === t);
		return !n || !r ? !0 : !(n.connectionRules?.allowedTargets && !n.connectionRules.allowedTargets.includes(t) || r.connectionRules?.allowedSources && !r.connectionRules.allowedSources.includes(e));
	}, [s.nodeDefinitions]), y = useCallback((n) => {
		if (n.source === n.target) return !1;
		let r = n.source, i = n.target, a = e.find((e) => e.id === r), o = e.find((e) => e.id === i);
		return a && o && !v(a.type || "default", o.type || "default") ? !1 : checkIsDag(e.map((e) => ({ id: e.id })), t.map((e) => ({
			source: e.source,
			target: e.target
		})), {
			source: r,
			target: i
		});
	}, [
		e,
		t,
		v
	]);
	return {
		isConnecting: f,
		connectionMenu: m,
		setConnectionMenu: g,
		isValidConnection: y,
		onConnect: useCallback((e) => {
			if (!e.source || !e.target) {
				console.warn("Skipping invalid connection attempt: missing source or target");
				return;
			}
			if (y(e)) {
				let t = {
					...e,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 20,
						height: 20,
						color: "#888"
					}
				};
				n((e) => addEdge(t, e)), i && i({
					id: `e-${e.source}-${e.target}`,
					source: e.source,
					target: e.target,
					data: {}
				});
			}
		}, [
			n,
			y,
			i
		]),
		onConnectStart: useCallback((e, t) => {
			_.current = t, p(!0);
		}, []),
		onConnectEnd: useCallback((e) => {
			if (p(!1), e.target.classList.contains("react-flow__pane") && _.current && c) {
				let { clientX: t, clientY: n } = e;
				g({
					isOpen: !0,
					position: {
						x: t,
						y: n
					},
					source: {
						..._.current,
						handleType: _.current.handleType
					}
				});
			}
		}, [c]),
		handleMenuAddNode: useCallback((e) => {
			if (!c) return;
			let { position: t, source: a } = m, l = c.screenToFlowPosition({
				x: t.x,
				y: t.y
			});
			l.x -= 100, l.y -= 50;
			let u = s.nodeDefinitions.find((t) => t.type === e), d = u?.width || 250, f = u?.height || 250, p = `node-${Date.now()}`, v = {
				id: p,
				type: e,
				position: l,
				width: d,
				height: f,
				style: {
					width: `${d}px`,
					height: `${f}px`
				},
				data: {}
			};
			if (r((e) => e.concat(v)), o) {
				let { nodes: e } = fromReactFlowNodes([v], []);
				e.length > 0 && o(e[0]);
			}
			if (a?.nodeId) {
				let e;
				e = a.handleType === "target" ? {
					id: `e-${p}-${a.nodeId}`,
					source: p,
					target: a.nodeId,
					targetHandle: a.handleId,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 20,
						height: 20,
						color: "#888"
					}
				} : {
					id: `e-${a.nodeId}-${p}`,
					source: a.nodeId,
					target: p,
					sourceHandle: a.handleId,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 20,
						height: 20,
						color: "#888"
					}
				}, n((t) => addEdge(e, t)), i && i({
					id: e.id,
					source: e.source,
					target: e.target,
					data: {}
				});
			}
			g((e) => ({
				...e,
				isOpen: !1
			})), _.current = null;
		}, [
			m,
			c,
			r,
			n,
			o,
			i,
			s.nodeDefinitions
		]),
		availableNodeTypes: useMemo(() => {
			let t = s.nodeDefinitions.map((e) => ({
				type: e.type,
				label: e.label
			}));
			if (!m.source || !m.source.nodeId) return t;
			let n = m.source.nodeId, r = e.find((e) => e.id === n);
			if (!r) return t;
			let i = m.source.handleType;
			return t.filter((e) => i === "target" ? v(e.type, r.type || "default") : v(r.type || "default", e.type));
		}, [
			s.nodeDefinitions,
			m.source,
			e,
			v
		])
	};
}
const CanvasEditor = React.forwardRef(({ initialFlow: t, readOnly: n = !1, onChange: r, onSelectionChange: i, renderEmpty: o, onNodeAdd: c, onNodeMove: m, onNodeDelete: h, onNodeDataChange: g, onEdgeAdd: _, onEdgeDelete: v, onGroupAdd: b, onGroupDelete: x, onGroupUngroup: S, onGroupUpdate: w }, T) => {
	let { config: E, onNodeDataChange: D } = useCanvasContext(), [O, k, A] = useNodesState([]), [j, M, N] = useEdgesState([]), [I, _e] = useState(null), { isConnecting: ve, connectionMenu: R, setConnectionMenu: ye, isValidConnection: z, onConnect: B, onConnectStart: V, onConnectEnd: H, handleMenuAddNode: U, availableNodeTypes: be } = useCanvasConnection({
		nodes: O,
		edges: j,
		setEdges: M,
		setNodes: k,
		onEdgeAdd: _,
		onNodeAdd: c,
		config: E,
		rfInstance: I
	}), [W, G] = useState(null), [K, Se] = useState(null), [Te, Ee] = useState({
		x: 0,
		y: 0
	}), [De, q] = useState(null), J = useRef([]);
	useEffect(() => {
		t && (k(toReactFlowNodes(t.nodes, t.groups)), M(toReactFlowEdges(t.edges)), J.current = t.groups || []);
	}, []);
	let Oe = useRef(r);
	useEffect(() => {
		Oe.current = r;
	}, [r]), useEffect(() => {
		if (Oe.current) {
			let { nodes: e, groups: t } = fromReactFlowNodes(O, J.current), n = {
				nodes: e,
				edges: fromReactFlowEdges(j),
				groups: t
			};
			Oe.current(n);
		}
	}, [O, j]), useEffect(() => {
		let e = (e) => {
			Ee({
				x: e.clientX,
				y: e.clientY
			});
		};
		return window.addEventListener("mousemove", e), () => window.removeEventListener("mousemove", e);
	}, []);
	let ke = useMemo(() => {
		let e = { group: GroupNode };
		return E.nodeDefinitions.forEach((t) => {
			e[t.type] = UniversalNode;
		}), e;
	}, [E.nodeDefinitions]), Ae = useCallback((e) => {
		A(e), e.forEach((e) => {
			e.type === "remove" && (O.find((t) => t.id === e.id)?.type === "group" ? x && x(e.id) : h && h(e.id));
		});
	}, [
		A,
		h,
		x,
		O
	]), je = useCallback((e) => {
		N(e), e.forEach((e) => {
			e.type === "remove" && v && v(e.id);
		});
	}, [N, v]), Me = useCallback(({ nodes: e }) => {
		if (e.length > 0) {
			let t = e[0];
			t.type === "group" ? q(null) : q(t.id);
		} else q(null);
		i && i(e.filter((e) => e.type !== "group").map((e) => e.id));
	}, [i]), Ne = useCallback((e, t, n) => {
		if (t.type === "group") {
			w && w({
				id: t.id,
				position: t.position,
				width: t.measured?.width || t.width,
				height: t.measured?.height || t.height
			});
			return;
		}
		if (m) {
			let { nodes: e } = fromReactFlowNodes(n, J.current), r = e.find((e) => e.id === t.id);
			r && m(r);
		}
		if (t.parentId && w) {
			let e = n.find((e) => e.id === t.parentId);
			e && e.measured && (w({
				id: e.id,
				position: e.position,
				width: e.measured.width,
				height: e.measured.height
			}), console.log(`[编组自动扩展] 保存编组 ${e.id} 的新尺寸:`, {
				width: e.measured.width,
				height: e.measured.height
			}));
		}
	}, [
		m,
		w,
		O,
		J
	]), Pe = useCallback((e) => {
		e.detail === 2 && !n && ye({
			isOpen: !0,
			position: {
				x: e.clientX,
				y: e.clientY
			},
			source: null
		}), G(null);
	}, [n]), Fe = useCallback((e, t) => {
		e.preventDefault(), e.stopPropagation(), G({
			isOpen: !0,
			position: {
				x: e.clientX,
				y: e.clientY
			},
			type: t.type === "group" ? "group" : "node",
			targetId: t.id
		});
	}, []), Ie = useCallback((e) => {
		e.preventDefault();
		let t = O.filter((e) => e.selected && e.type !== "group");
		G({
			isOpen: !0,
			position: {
				x: e.clientX,
				y: e.clientY
			},
			type: t.length > 1 ? "multi" : "pane"
		});
	}, [O]), Le = useCallback((e, t) => {
		e.preventDefault(), e.stopPropagation(), G({
			isOpen: !0,
			position: {
				x: e.clientX,
				y: e.clientY
			},
			type: "edge",
			targetId: t.id
		});
	}, []), Y = useCallback(() => {
		let e = O.filter((e) => e.selected && e.type !== "group");
		if (e.length === 0) return;
		let { nodes: t } = fromReactFlowNodes(O, J.current), n = new Map(t.map((e) => [e.id, e])), r = /* @__PURE__ */ new Set();
		e.forEach((e) => {
			e.parentId && r.add(e.parentId);
		});
		let i = /* @__PURE__ */ new Map();
		e.forEach((e) => {
			let t = n.get(e.id);
			t && i.set(e.id, t);
		}), r.size > 0 && t.forEach((e) => {
			e.groupId && r.has(e.groupId) && e.type !== "group" && i.set(e.id, e);
		});
		let a = Array.from(i.values()), o = getBounds(a.map((e) => ({
			position: e.position,
			width: 200,
			height: 100
		}))), s = new Map(O.map((e) => [e.id, e])), c = getBounds(a.map((e) => {
			let t = s.get(e.id);
			return {
				position: e.position,
				width: t?.measured?.width || t?.width,
				height: t?.measured?.height || t?.height
			};
		})), l = a.some((e) => {
			let t = s.get(e.id);
			return !!(t?.measured || t?.width || t?.height);
		}) ? c : o, u = generateId("group"), d = {
			id: u,
			label: "新建分组",
			position: {
				x: l.x - 20,
				y: l.y - 20
			},
			width: l.width + 40,
			height: l.height + 40
		};
		b && b(d), J.current = [...J.current.filter((e) => !r.has(e.id)), d], r.forEach((e) => {
			x && x(e);
		});
		let f = {
			id: u,
			type: "group",
			position: d.position,
			width: d.width,
			height: d.height,
			zIndex: -1,
			data: {},
			style: {
				width: d.width,
				height: d.height,
				zIndex: -1
			},
			selected: !0,
			draggable: !0
		};
		k((e) => [f, ...e.filter((e) => e.type !== "group" || !r.has(e.id)).map((e) => {
			if (i.has(e.id)) {
				let t = n.get(e.id), r = t?.position.x ?? e.position.x, i = t?.position.y ?? e.position.y;
				return {
					...e,
					parentId: u,
					extent: "parent",
					expandParent: !0,
					draggable: !0,
					position: {
						x: r - d.position.x,
						y: i - d.position.y
					},
					selected: !1
				};
			}
			return e;
		})]), G(null);
	}, [
		O,
		k,
		b,
		x,
		D
	]), Z = useCallback((e) => {
		let t = e || W?.targetId || O.find((e) => e.selected && e.type === "group")?.id;
		if (!t) return;
		let { nodes: n } = fromReactFlowNodes(O, J.current), r = new Map(n.map((e) => [e.id, e])), i = O.filter((e) => e.parentId === t).map((e) => e.id);
		S && S(t, i), J.current = J.current.filter((e) => e.id !== t), k((e) => e.filter((e) => e.id !== t).map((e) => {
			if (e.parentId === t) {
				let t = r.get(e.id), n = t?.position.x ?? e.position.x, i = t?.position.y ?? e.position.y;
				return {
					...e,
					parentId: void 0,
					position: {
						x: n,
						y: i
					}
				};
			}
			return e;
		})), G(null);
	}, [
		W,
		O,
		k,
		S,
		D
	]), Q = useCallback(() => {
		let e = W?.type === "node" ? W.targetId : null;
		if (!e && De && (e = De), e) {
			let t = O.find((t) => t.id === e);
			t && Se(t);
		}
	}, [
		W,
		O,
		De
	]), $ = useCallback(() => {
		if (K && I) {
			let e;
			e = W ? I.screenToFlowPosition({
				x: W.position.x,
				y: W.position.y
			}) : I.screenToFlowPosition({
				x: Te.x,
				y: Te.y
			});
			let t = generateId(), n = {
				...K,
				id: t,
				position: e,
				selected: !0,
				data: {}
			};
			if (k((e) => e.map((e) => ({
				...e,
				selected: !1
			})).concat(n)), q(t), c) {
				let [e] = fromReactFlowNodes([n], J.current).nodes;
				c(e);
			}
		}
	}, [
		K,
		I,
		W,
		Te,
		k,
		c
	]), Re = useCallback(() => {
		let e, t = !1, n = !1;
		if (W) e = W.targetId, t = W.type === "edge", n = W.type === "group";
		else {
			let r = O.find((e) => e.selected), i = j.find((e) => e.selected);
			r ? (e = r.id, n = r.type === "group") : i && (e = i.id, t = !0);
		}
		e && (t ? (M((t) => t.filter((t) => t.id !== e)), v && v(e)) : n ? (k((t) => t.filter((t) => !(t.id === e || t.parentId === e))), M((t) => t.filter((t) => {
			let n = O.find((n) => n.id === t.source && (n.id === e || n.parentId === e)), r = O.find((n) => n.id === t.target && (n.id === e || n.parentId === e));
			return !n && !r;
		})), x && x(e)) : (k((t) => t.filter((t) => t.id !== e)), M((t) => t.filter((t) => t.source !== e && t.target !== e)), h && h(e)), G(null));
	}, [
		W,
		O,
		j,
		k,
		M,
		h,
		v,
		x
	]);
	useEffect(() => {
		let e = (e) => {
			if (n) return;
			let t = document.activeElement;
			t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.getAttribute("contenteditable") === "true") || ((e.ctrlKey || e.metaKey) && e.key === "c" ? Q() : (e.ctrlKey || e.metaKey) && e.key === "v" ? $() : (e.ctrlKey || e.metaKey) && e.key === "g" && (e.preventDefault(), Y()));
		};
		return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e);
	}, [
		Q,
		$,
		Y,
		n
	]);
	let ze = useMemo(() => {
		let e = [], t = W?.type === "edge";
		return W?.type === "multi" && e.push({
			label: "创建分组 (Group)",
			onClick: Y,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderInput, { size: 16 }),
			shortcut: "Ctrl+G"
		}), (W?.type === "node" || W?.type === "edge") && e.push({
			label: "复制 (Copy)",
			onClick: Q,
			disabled: W.type !== "node",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 16 }),
			shortcut: "Ctrl+C"
		}), (W?.type === "pane" || W?.type === "node") && e.push({
			label: "粘贴 (Paste)",
			onClick: $,
			disabled: !K || t,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { size: 16 }),
			shortcut: "Ctrl+V"
		}), e.push({
			label: "删除 (Delete)",
			onClick: Re,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 }),
			shortcut: "Del"
		}), W?.type === "group" && e.push({
			label: "解散分组 (Ungroup)",
			onClick: () => Z(W.targetId),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, { size: 16 })
		}), e;
	}, [
		W,
		K,
		Q,
		$,
		Re,
		Y,
		Z
	]);
	return React.useImperativeHandle(T, () => ({
		fitView: () => I?.fitView(),
		getViewport: () => I?.getViewport(),
		setFlow: (e) => {
			k(toReactFlowNodes(e.nodes, e.groups)), M(toReactFlowEdges(e.edges)), J.current = e.groups || [];
		},
		getFlow: () => {
			let { nodes: e, groups: t } = fromReactFlowNodes(O, J.current);
			return {
				nodes: e,
				edges: fromReactFlowEdges(j),
				groups: t
			};
		},
		ungroup: (e) => Z(e)
	}), [
		I,
		k,
		M,
		Z,
		O,
		j
	]), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `canvas-flow-wrapper ${ve ? "is-connecting" : ""}`,
		style: { backgroundColor: E.style?.background },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ReactFlow, {
				nodes: O,
				edges: j,
				onNodesChange: Ae,
				onEdgesChange: je,
				onConnect: B,
				onConnectStart: V,
				onConnectEnd: H,
				onNodeDragStop: Ne,
				isValidConnection: z,
				onPaneClick: Pe,
				onNodeContextMenu: Fe,
				onPaneContextMenu: Ie,
				onEdgeContextMenu: Le,
				onInit: _e,
				nodeTypes: ke,
				onSelectionChange: Me,
				fitView: !0,
				nodesDraggable: !n,
				nodesConnectable: !n,
				deleteKeyCode: ["Backspace", "Delete"],
				selectionKeyCode: ["Shift"],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectionMenu, {
						selectedNodes: O.filter((e) => e.selected && e.type !== "group"),
						onCreateGroup: Y
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls, {}),
					O.length === 0 && o && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cf-empty-state-overlay",
						children: o
					})
				]
			}),
			R.isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingNodeMenu, {
				position: R.position,
				onAddNode: U,
				availableTypes: be,
				onClose: () => ye((e) => ({
					...e,
					isOpen: !1
				}))
			}),
			W?.isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextMenu, {
				items: ze,
				position: W.position,
				onClose: () => G(null)
			})
		]
	});
});
CanvasEditor.displayName = "CanvasEditor";
var FlowRunner = class {
	config;
	constructor(e) {
		this.config = e;
	}
	async runFlow(e, t) {
		if (this.config.runFlow) return this.config.runFlow(e);
		let n = {};
		for (let r of e.nodes) {
			t?.(r.id, "running");
			try {
				let i = await this.runSingleNode(r, e, n);
				n[r.id] = i, t?.(r.id, "success");
			} catch (e) {
				throw console.error(`Node ${r.id} execution failed:`, e), t?.(r.id, "error"), e;
			}
		}
		return n;
	}
	async runSingleNode(e, t, n) {
		if (!this.config.runNode) return console.warn("No runNode implementation provided, skipping execution"), { output: null };
		let r = {
			node: e,
			flow: t,
			incoming: t.edges.filter((t) => t.target === e.id).map((e) => n[e.source]?.output)
		};
		return this.config.runNode(r);
	}
}, NodeMediaEmitter = class {
	listeners = /* @__PURE__ */ new Map();
	on(e, t) {
		this.listeners.has(e) || this.listeners.set(e, /* @__PURE__ */ new Set()), this.listeners.get(e).add(t);
	}
	off(e, t) {
		let n = this.listeners.get(e);
		n && (n.delete(t), n.size === 0 && this.listeners.delete(e));
	}
	emit(e, t) {
		let n = this.listeners.get(e);
		n && n.forEach((e) => e(t));
	}
	batchEmit(e) {
		e.forEach(({ nodeId: e, data: t }) => {
			this.emit(e, t);
		});
	}
	clear() {
		this.listeners.clear();
	}
	getListenerCount() {
		let e = 0;
		return this.listeners.forEach((t) => {
			e += t.size;
		}), e;
	}
};
const NodeEmptyState = ({ title: e = "尝试：", items: t, onAction: n }) => {
	let [r, i] = useState(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cf-node-empty-state",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "cf-node-empty-title",
			children: e
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "cf-node-empty-menu",
			children: t.map((e) => {
				let t = r === e.id, a = e.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `cf-menu-item ${t ? "hovered" : ""}`,
					onMouseEnter: () => i(e.id),
					onMouseLeave: () => i(null),
					onClick: (t) => {
						t.stopPropagation(), n(e.id);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "cf-menu-item-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(a, { size: 14 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "cf-menu-item-label",
							children: e.label
						}),
						t && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "cf-menu-item-arrow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 14 })
						})
					]
				}, e.id);
			})
		})]
	});
}, TextNode = ({ data: e, isConnected: t, onChange: n }) => {
	let [r, i] = useState(!1), a = t || e.isInteracted, o = [
		{
			id: "edit",
			icon: PenLine,
			label: "自己编写内容"
		},
		{
			id: "text-to-video",
			icon: Video,
			label: "文生视频"
		},
		{
			id: "image-to-prompt",
			icon: Image,
			label: "图片反推提示词"
		},
		{
			id: "text-to-audio",
			icon: Music,
			label: "文生音乐"
		}
	];
	return a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cf-text-node-container",
		onDoubleClick: () => i(!0),
		children: r ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			className: "nodrag cf-text-node-input",
			autoFocus: !0,
			onBlur: () => i(!1),
			placeholder: "输入文本或者编辑生成结果...",
			value: e.text || "",
			onChange: (e) => n({ text: e.target.value }),
			onKeyDown: (e) => e.stopPropagation()
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `cf-text-node-display ${e.text ? "" : "placeholder"}`,
			children: e.text || "双击输入文本..."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "cf-text-node-overlay",
			children: "双击编辑"
		})] })
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeEmptyState, {
		items: o,
		onAction: (e) => {
			e === "edit" ? (n({ isInteracted: !0 }), i(!0)) : console.log("Action triggered:", e);
		}
	});
}, MediaViewerModal = ({ isOpen: e, onClose: t, src: n, type: r }) => (useEffect(() => (e ? document.body.style.overflow = "hidden" : document.body.style.overflow = "unset", () => {
	document.body.style.overflow = "unset";
}), [e]), !e || !n ? null : createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "cf-media-modal-overlay",
	onClick: t,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cf-media-modal-content",
		onClick: (e) => e.stopPropagation(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "cf-media-modal-close",
			onClick: t,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 24 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cf-media-modal-body",
			children: [
				r === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: n,
					alt: "Preview",
					className: "cf-media-modal-image"
				}),
				r === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: n,
					controls: !0,
					className: "cf-media-modal-video",
					autoPlay: !0
				}),
				r === "audio" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cf-media-modal-audio-wrapper",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cf-media-modal-audio-icon",
						children: "🎵"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						src: n,
						controls: !0,
						className: "cf-media-modal-audio",
						autoPlay: !0
					})]
				})
			]
		})]
	})
}), document.body)), ImageNode = ({ data: e, isConnected: t, onChange: n }) => {
	let r = useRef(null), [i, a] = useState(!1), o = [
		{
			id: "img-to-img",
			icon: Image,
			label: "图生图"
		},
		{
			id: "img-to-video",
			icon: Image,
			label: "图生视频"
		},
		{
			id: "remove-bg",
			icon: Layers,
			label: "图片换背景"
		},
		{
			id: "first-frame-video",
			icon: Video,
			label: "首帧图生视频"
		}
	], s = e.src || e.output;
	return s || t ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cf-media-node-container",
		onDoubleClick: () => s && a(!0),
		title: "双击查看大图",
		children: s && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			ref: r,
			src: s,
			alt: "generated",
			className: "cf-media-node-content",
			onLoad: (e) => {
				let t = e.currentTarget;
				t.naturalWidth && t.naturalHeight && n({ _contentSize: {
					width: t.naturalWidth,
					height: t.naturalHeight
				} });
			},
			style: {
				display: "block",
				cursor: "zoom-in"
			}
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaViewerModal, {
		isOpen: i,
		onClose: () => a(!1),
		src: s,
		type: "image"
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeEmptyState, {
		items: o,
		onAction: (e) => console.log("Image action:", e)
	});
}, VideoNode = ({ data: e, isConnected: t, onChange: n }) => {
	let r = useRef(null), [i, a] = useState(!1), o = [{
		id: "first-last-frame-to-video",
		icon: Layers,
		label: "首尾帧生成视频"
	}, {
		id: "first-frame-to-video",
		icon: Sparkles,
		label: "首帧生成视频"
	}], s = t || e.output || e.src, c = e.src || e.output;
	return s ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cf-media-node-container",
		title: "双击全屏预览",
		children: c && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: r,
			src: c,
			controls: !0,
			controlsList: "nofullscreen",
			className: "cf-media-node-content",
			onLoadedMetadata: (e) => {
				let t = e.currentTarget;
				t.videoWidth && t.videoHeight && n({ _contentSize: {
					width: t.videoWidth,
					height: t.videoHeight
				} });
			},
			style: { display: "block" },
			onDoubleClick: (e) => {
				e.preventDefault(), e.stopPropagation(), c && a(!0);
			}
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaViewerModal, {
		isOpen: i,
		onClose: () => a(!1),
		src: c,
		type: "video"
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeEmptyState, {
		items: o,
		onAction: (e) => console.log("Video action:", e)
	});
}, AudioNode = ({ data: e, isConnected: t }) => {
	let [n, r] = useState(!1), i = [{
		id: "audio-to-video",
		icon: Music,
		label: "音频生视频"
	}], a = t || e.output || e.src, o = e.src || e.output;
	return a ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cf-media-node-container",
		onDoubleClick: () => o && r(!0),
		title: "双击打开播放器",
		style: { cursor: "pointer" },
		children: o && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			src: o,
			controls: !0,
			className: "cf-media-node-content",
			style: {
				width: "100%",
				marginTop: "auto",
				marginBottom: "auto"
			}
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaViewerModal, {
		isOpen: n,
		onClose: () => r(!1),
		src: o,
		type: "audio"
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeEmptyState, {
		items: i,
		onAction: (e) => console.log("Audio action:", e)
	});
}, UploadNode = ({ data: e, onChange: t }) => {
	let [n, r] = useState(!1), [i, a] = useState(!1), o = e.params?.action, s = e.params?.accept || "*";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `cf-upload-container ${e.output ? "has-content" : ""}`,
		onMouseEnter: () => r(!0),
		onMouseLeave: () => r(!1),
		children: [i && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cf-upload-loading-overlay",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "cf-spinner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Uploading..." })]
		}), e.output ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cf-upload-content-wrapper",
			children: [(() => {
				if (!e.output) return null;
				let t = e.fileType || "", n = t.startsWith("image/"), r = t.startsWith("video/"), i = t.startsWith("audio/");
				return n ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: e.output,
					alt: "uploaded",
					className: "cf-upload-preview-image"
				}) : r ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: e.output,
					className: "cf-upload-preview-video",
					controls: !0
				}) : i ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "cf-upload-preview-audio",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, {
						size: 48,
						strokeWidth: 1.5
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						src: e.output,
						controls: !0,
						style: { maxWidth: "90%" }
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "cf-upload-preview-file",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
						size: 48,
						strokeWidth: 1.5
					})
				});
			})(), n && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				onClick: (n) => {
					n.stopPropagation(), e.output && e.output.startsWith("blob:") && URL.revokeObjectURL(e.output), t({
						output: null,
						fileName: null,
						fileType: null
					});
				},
				className: "cf-upload-delete-btn",
				title: "移除文件",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 14 })
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "cf-upload-placeholder",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					style: { display: "none" },
					onChange: async (e) => {
						let n = e.target.files?.[0];
						if (n) if (o) {
							a(!0);
							try {
								let e = new FormData();
								e.append("file", n);
								let r = await fetch(o, {
									method: "POST",
									body: e
								});
								if (!r.ok) throw Error(`Upload failed: ${r.statusText}`);
								let i = await r.json(), a = i.url || i.data?.url || i.fileUrl || i.data?.file_url;
								if (!a) {
									console.warn("Upload successful but could not find URL in response:", i), alert("Upload successful but URL not found in response. See console.");
									return;
								}
								t({
									output: a,
									src: a,
									fileName: n.name,
									fileType: n.type,
									_uploadResult: i.data
								});
							} catch (e) {
								console.error("Upload error:", e), alert(`上传失败: ${e.message}`);
							} finally {
								a(!1);
							}
						} else t({
							output: URL.createObjectURL(n),
							fileName: n.name,
							fileType: n.type
						});
					},
					accept: s
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 24 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cf-upload-label-text",
					children: "点击上传文件"
				}),
				s !== "*" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "cf-upload-subtext",
					style: {
						fontSize: 10,
						color: "#444",
						marginTop: 4
					},
					children: s
				})
			]
		})]
	});
}, createDefaultNodeData = (e) => {
	switch (e) {
		case StandardNodeType.TEXT: return {
			text: "",
			resourceType: "text/plain"
		};
		case StandardNodeType.IMAGE: return {
			src: "",
			resourceType: "image/png"
		};
		case StandardNodeType.VIDEO: return {
			src: "",
			resourceType: "video/mp4"
		};
		case StandardNodeType.AUDIO: return {
			src: "",
			resourceType: "audio/mp3"
		};
		case StandardNodeType.UPLOAD: return {
			src: "",
			resourceType: ""
		};
		default: return {};
	}
}, defaultComponentRegistry = {
	TextNode,
	ImageNode,
	VideoNode,
	AudioNode,
	UploadNode
}, defaultCanvasConfig = {
	style: { background: "#0f1115" },
	nodeDefinitions: [
		{
			type: StandardNodeType.TEXT,
			label: "文本",
			component: "TextNode",
			width: 280,
			height: 220,
			defaultData: createDefaultNodeData(StandardNodeType.TEXT),
			connectionRules: { allowedTargets: [StandardNodeType.IMAGE, StandardNodeType.VIDEO] }
		},
		{
			type: StandardNodeType.IMAGE,
			label: "图片",
			component: "ImageNode",
			width: 260,
			height: 260,
			defaultData: createDefaultNodeData(StandardNodeType.IMAGE),
			connectionRules: {
				allowedSources: [StandardNodeType.TEXT, StandardNodeType.UPLOAD],
				allowedTargets: [StandardNodeType.VIDEO]
			}
		},
		{
			type: StandardNodeType.VIDEO,
			label: "视频",
			component: "VideoNode",
			width: 300,
			height: 200,
			defaultData: createDefaultNodeData(StandardNodeType.VIDEO),
			connectionRules: { allowedSources: [StandardNodeType.TEXT, StandardNodeType.IMAGE] }
		},
		{
			type: StandardNodeType.UPLOAD,
			label: "上传",
			component: "UploadNode",
			width: 240,
			height: 200,
			defaultData: createDefaultNodeData(StandardNodeType.UPLOAD)
		}
	]
}, CanvasFlow = React.forwardRef((e, t) => {
	let { initialFlow: n = {
		nodes: [],
		edges: []
	}, config: r = defaultCanvasConfig, components: i = defaultComponentRegistry, execution: o = {}, mode: s = "edit", ui: l = { showToolbar: !0 }, renderEmpty: f, renderNodeInspector: p, onChange: m, onSave: h, onRunFlow: g, onNodeRun: _, onGroupRun: v, onGroupSave: y, onSelectionChange: b, onNodeAdd: x, onNodeDelete: he, onNodeMove: S, onNodeDataChange: C, onEdgeAdd: w, onEdgeDelete: T, onGroupAdd: E, onGroupDelete: D, onGroupUngroup: O, onGroupUpdate: k, className: A, style: j } = e, [M, N] = useState(n), [P, F] = useState(!1), [I, L] = useState(null), [ge, _e] = useState(null), ve = useRef(new FlowRunner(o)), R = useRef(null), ye = useRef(""), z = useRef(/* @__PURE__ */ new Map()), B = useRef(new NodeMediaEmitter()), V = useCallback((e) => {
		let t = R.current?.getFlow?.();
		return t && t.nodes.find((t) => t.id === e) || null;
	}, []), H = useCallback((e, t, n) => {
		let r = V(e);
		if (!r) return console.warn(`[${n}] 节点不存在: ${e}`), null;
		let i = Array.isArray(t) ? t : [t];
		return i.includes(r.type) ? r : (console.error(`[${n}] 节点 ${e} 的类型是 "${r.type}"，不符合要求。`, `期望的类型: ${i.join(", ")}`), null);
	}, [V]), U = useCallback((e, t) => {
		let n = [
			"src",
			"text",
			"outputData",
			"output",
			"_loading",
			"_error",
			"_executionStatus",
			"_contentSize",
			"fileName",
			"fileType",
			"fileSize",
			"resourceType"
		], r = z.current.get(e) || {}, i = { ...r };
		console.log(`[Core updateMediaData] 节点 ${e}:`, {
			currentMedia: r,
			updates: t,
			willMerge: i
		}), Object.keys(t).forEach((r) => {
			n.includes(r) ? t[r] === void 0 ? delete i[r] : i[r] = t[r] : console.warn(`[updateMediaData] 忽略非媒体字段 "${r}" (节点 ${e})`, `\n允许的字段: ${n.join(", ")}`);
		}), z.current.set(e, i), B.current.emit(e, i), console.log("[Core updateMediaData] 更新后:", i);
	}, []);
	useImperativeHandle(t, () => ({
		init: (e, t) => {
			let n = t || generateId();
			return ye.current = n, e && (N(e), R.current?.setFlow && (R.current.setFlow(e), setTimeout(() => {
				R.current?.fitView();
			}, 10))), n;
		},
		getFlow: () => R.current?.getFlow?.() || M,
		setFlow: (e) => {
			N(e), R.current?.setFlow && R.current.setFlow(e);
		},
		runFlow: async () => W(),
		fitView: () => {
			R.current?.fitView();
		},
		getViewport: () => R.current?.getViewport() || {
			x: 0,
			y: 0,
			zoom: 1
		},
		getNode: (e) => {
			let t = R.current?.getFlow?.();
			return t && t.nodes.find((t) => t.id === e) || null;
		},
		getUpstreamNodes: (e) => {
			let t = R.current?.getFlow?.();
			if (!t) return [];
			let n = t.edges.filter((t) => t.target === e).map((e) => e.source);
			return t.nodes.filter((e) => n.includes(e.id)).map((e) => {
				let t = r.nodeDefinitions.find((t) => t.type === e.type), n = z.current.get(e.id) || {};
				return {
					id: e.id,
					type: e.type,
					label: t?.label || e.type,
					position: e.position,
					data: n
				};
			});
		},
		setNodeImage: (e, t) => {
			H(e, [
				"image",
				"video",
				"audio",
				"user-upload"
			], "setNodeImage") && U(e, { src: t });
		},
		setNodeVideo: (e, t) => {
			H(e, "video", "setNodeVideo") && U(e, { src: t });
		},
		setNodeAudio: (e, t) => {
			H(e, "audio", "setNodeAudio") && U(e, { src: t });
		},
		setNodeText: (e, t) => {
			H(e, "text", "setNodeText") && U(e, { text: t });
		},
		setNodeOutput: (e, t) => {
			V(e) ? U(e, { outputData: t }) : console.warn(`[setNodeOutput] 节点不存在: ${e}`);
		},
		setNodeContent: (e, t) => {
			U(e, t);
		},
		clearNodeContent: (e) => {
			let { src: t, text: n, outputData: r, ...i } = z.current.get(e) || {};
			z.current.set(e, i), B.current.emit(e, i);
		},
		setNodeLoading: (e) => {
			let t = z.current.get(e) || {};
			z.current.set(e, {
				...t,
				_loading: !0
			}), B.current.emit(e, z.current.get(e));
		},
		clearNodeLoading: (e) => {
			let t = z.current.get(e) || {};
			console.log(`[Core clearNodeLoading] 节点 ${e} 清除前:`, t);
			let n = { ...t };
			delete n._loading, z.current.set(e, n), B.current.emit(e, n), console.log(`[Core clearNodeLoading] 节点 ${e} 清除后:`, n);
		},
		setNodeError: (e, t) => {
			let n = z.current.get(e) || {};
			z.current.set(e, {
				...n,
				_error: t
			}), B.current.emit(e, z.current.get(e));
		},
		clearNodeError: (e) => {
			let t = { ...z.current.get(e) || {} };
			delete t._error, z.current.set(e, t), B.current.emit(e, t);
		},
		updateNodeMedia: (e, t) => {
			let n = {
				...z.current.get(e) || {},
				...t
			};
			Object.keys(n).forEach((e) => {
				n[e] === void 0 && delete n[e];
			}), z.current.set(e, n), B.current.emit(e, n);
		},
		batchUpdateNodeMedia: (e) => {
			e.forEach(({ nodeId: e, data: t }) => {
				let n = {
					...z.current.get(e) || {},
					...t
				};
				z.current.set(e, n);
			}), B.current.batchEmit(e.map((e) => ({
				nodeId: e.nodeId,
				data: z.current.get(e.nodeId)
			})));
		},
		getNodeMedia: (e) => z.current.get(e) || {},
		updateNodeStatus: (e, t) => {
			let n = {
				...z.current.get(e) || {},
				_executionStatus: t
			};
			z.current.set(e, n), B.current.emit(e, n);
		}
	}));
	let be = useCallback((e) => {
		N(e), m?.(e);
	}, [m]), xe = useCallback((e) => {
		e.length === 1 ? _e(e[0]) : _e(null), b?.(e);
	}, [b]), W = async () => {
		if (!P) {
			F(!0), g?.(M);
			try {
				return await ve.current.runFlow(M, (e, t) => {});
			} catch (e) {
				console.error("Flow execution failed", e);
			} finally {
				F(!1);
			}
		}
	}, G = async (e) => {
		if (P) return;
		if (v) {
			F(!0);
			try {
				await v(e);
			} catch (t) {
				console.error(`Group ${e} execution failed`, t);
			} finally {
				F(!1);
			}
			return;
		}
		let t = M.nodes.filter((t) => t.groupId === e);
		if (t.length === 0) return;
		let n = new Set(t.map((e) => e.id)), r = {
			nodes: t,
			edges: M.edges.filter((e) => n.has(e.source) && n.has(e.target)),
			groups: [],
			meta: M.meta
		};
		F(!0);
		try {
			await ve.current.runFlow(r, (e, t) => {});
		} catch (t) {
			console.error(`Group ${e} execution failed`, t);
		} finally {
			F(!1);
		}
	}, K = async (e) => {
		if (!I) {
			L(e);
			try {
				_ ? await _(e) : console.warn("No onNodeRun handler provided");
			} catch (e) {
				console.error("Node execution failed:", e);
			} finally {
				L(null);
			}
		}
	}, Se = useCallback((e, t) => {
		switch (e) {
			case "create":
				E?.(t);
				break;
			case "delete":
				D?.(t);
				break;
			case "update":
			case "move":
				k?.(t);
				break;
			case "ungroup":
				R.current?.ungroup && R.current.ungroup(t.id);
				break;
			case "run":
				G(t.id);
				break;
			case "save":
				let e = M.groups?.find((e) => e.id === t.id);
				if (!e) {
					console.warn(`Group ${t.id} not found for save`);
					return;
				}
				let n = M.nodes.filter((e) => e.groupId === t.id), r = new Set(n.map((e) => e.id)), i = {
					nodes: n,
					edges: M.edges.filter((e) => r.has(e.source) && r.has(e.target)),
					groups: [e],
					meta: M.meta
				};
				y?.(t.id, i);
				break;
		}
	}, [
		E,
		D,
		k,
		M,
		v,
		y
	]), Ce = useCallback((e) => z.current.get(e) || {}, []), we = useCallback((e, t) => {
		let n = z.current.get(e) || {};
		console.log(`[Core updateNodeMedia] 节点 ${e}:`, {
			currentMedia: n,
			newMedia: t,
			willMerge: {
				...n,
				...t
			}
		});
		let r = {
			...n,
			...t
		};
		Object.keys(r).forEach((e) => {
			r[e] === void 0 && delete r[e];
		}), z.current.set(e, r), B.current.emit(e, r), console.log("[Core updateNodeMedia] 更新后的 mediaMap:", r);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasProvider, {
		config: r,
		components: i,
		readOnly: s === "view",
		onNodeRun: K,
		onNodeDataChange: C,
		runningNodeId: I,
		isExecuting: P || !!I,
		onGroupAction: Se,
		inspectingNodeId: ge,
		mediaMap: z.current,
		mediaEmitter: B.current,
		getNodeMedia: Ce,
		updateNodeMedia: we,
		renderNodeInspector: p,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `canvas-flow-container ${A || ""}`,
			style: {
				width: "100%",
				height: "100%",
				position: "relative",
				overflow: "hidden",
				...j
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CanvasEditor, {
				ref: R,
				initialFlow: n,
				readOnly: s === "view",
				renderEmpty: f,
				onChange: be,
				onSelectionChange: xe,
				onNodeAdd: x,
				onNodeMove: S,
				onNodeDelete: he,
				onNodeDataChange: C,
				onEdgeAdd: w,
				onEdgeDelete: T,
				onGroupAdd: E,
				onGroupDelete: D,
				onGroupUngroup: O,
				onGroupUpdate: k
			})
		})
	});
});
CanvasFlow.displayName = "CanvasFlow";
const CanvasEmptyState = ({ onAction: e }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "cf-canvas-empty-state",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "cf-empty-instruction",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "cf-double-click-badge",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointerClick, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "双击" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "cf-instruction-text",
			children: "画布自由生成,或查看工作流模板"
		})]
	})
});
export { ActionToolbar, AudioNode, CanvasEmptyState, CanvasFlow, FloatingNodeMenu, GroupNode, ImageNode, NodeEmptyState, NodeMediaEmitter, StandardNodeType, TextNode, UploadNode, VideoNode, defaultCanvasConfig, defaultComponentRegistry };
