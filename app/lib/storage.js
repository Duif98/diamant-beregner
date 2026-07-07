// localStorage keys — kept identical to the original so existing users
// keep their price lists, settings and quote history.
export const LS = { dia: "diam_d", settings: "diam_s", history: "diam_h" };

export const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};

export const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export const remove = (k) => {
  try {
    localStorage.removeItem(k);
  } catch {}
};
