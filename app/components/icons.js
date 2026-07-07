const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
const I = (w = 16) => ({ viewBox: "0 0 24 24", width: w, height: w, ...s });

export const Drill = (p) => (<svg {...I(p.size)} {...p}><path d="M4 5h10v5H4z" /><path d="M14 6h3l2 2v1l-2 1h-3" /><path d="M8 10v4h2v3l-1 3-1-3v-3" /></svg>);
export const Blade = (p) => (<svg {...I(p.size)} {...p}><circle cx="12" cy="12" r="8" /><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1" /><circle cx="12" cy="12" r="2" /></svg>);
export const Clock = (p) => (<svg {...I(p.size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const Doc = (p) => (<svg {...I(p.size)} {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>);
export const Sliders = (p) => (<svg {...I(p.size)} {...p}><path d="M4 8h10M18 8h2M4 16h2M10 16h10" /><circle cx="16" cy="8" r="2" /><circle cx="8" cy="16" r="2" /></svg>);
export const History = (p) => (<svg {...I(p.size)} {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4M12 8v4l3 2" /></svg>);
export const Search = (p) => (<svg {...I(p.size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>);
export const Diamond = (p) => (<svg {...I(p.size)} {...p}><path d="M6 3h12l3 6-9 12L3 9z" /><path d="M3 9h18M9 3 7 9l5 12M15 3l2 6-5 12M7 9h10" strokeWidth={1.2} /></svg>);
export const Plus = (p) => (<svg {...I(p.size)} {...p}><path d="M12 5v14M5 12h14" /></svg>);
export const X = (p) => (<svg {...I(p.size)} {...p} strokeWidth={2}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const Printer = (p) => (<svg {...I(p.size)} {...p}><path d="M6 9V3h12v6" /><path d="M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></svg>);
export const Save = (p) => (<svg {...I(p.size)} {...p}><path d="M5 3h11l3 3v15H5z" /><path d="M8 3v5h7M8 15h8v6H8z" /></svg>);
export const Trash = (p) => (<svg {...I(p.size)} {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" /></svg>);
export const Info = (p) => (<svg {...I(p.size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
export const Check = (p) => (<svg {...I(p.size)} {...p} strokeWidth={2}><path d="m5 12 5 5L20 6" /></svg>);
export const Edit = (p) => (<svg {...I(p.size)} {...p}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M14 6l4 4" /></svg>);
