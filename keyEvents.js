const debounce = (fn, wait = 250, immediate = false) => {
  try {
    let timeout;
    return (...args) => {
      let context = this;
      let later = () => {
        timeout = null;
        if (!immediate) fn.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) fn.apply(context, args);
    };
  } catch (err) {
    console.log(err);
  }
};

const getUrlParam = (url = window.location.href, param = "", format = "") => {
  if (!url?.includes("?")) return;
  let queryString = url.split("?").pop();
  param = new URLSearchParams(queryString).get(param);
  param = decodeURIComponent(String(param)?.trim());
  if (!param) return;
  if (format === "alphabet") param = param.replace(/[^a-zA-Z]/g, "");
  if (format === "digit") param = param.replace(/[^\d]/g, "");
  if (format === "hex") param = param.replace(/[^a-fA-F0-9]/g, "");
  return param;
};

const getAllUrlParams = (url = window.location.href) => {
  if (!url?.includes("?")) return;
  let queryString = url.split("?").pop();
  const searchParams = new URLSearchParams(queryString);
  let params = {};
  for (const param of searchParams) {
    Object.defineProperty(params, param[0], {value: param[1], writable: true, enumerable: true});
  }
  return params;
};

const setUrlParam = (param = "", value = "") => {
  param = encodeURIComponent(String(param).trim());
  value = encodeURIComponent(String(value).trim());
  if (!param || !value) return;
  if (!window.history.pushState) return;
  let baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  let url = new URL(baseUrl);
  let allUrlParams = getAllUrlParams();
  if (allUrlParams && Object.getOwnPropertyNames(allUrlParams).length > 0) {
    for (const paramKey in allUrlParams) {
      url.searchParams.set(paramKey, allUrlParams[paramKey]);
    }
  }
  url.searchParams.set(param, value);
  window.history.pushState({}, "", url);
};

let keycode_top = document.querySelector(".keycode_top");
let keKey = document.querySelector(".keKey");
let keLocation = document.querySelector(".keLocation");
let keCode = document.querySelector(".keCode");
let keWhich = document.querySelector(".keWhich");
let keSuperkey = document.querySelector(".keSuperkey");
let keShiftkey = document.querySelector(".keShiftkey");
let keAltkey = document.querySelector(".keAltkey");
let keCtrlkey = document.querySelector(".keCtrlkey");
let keEventdump = document.querySelector(".keEventdump>pre");
let keUnicode = document.querySelector(".keUnicode");

let keycode_top_init = true;

const onKeyDownFn = debounce((evt) => {
  if (keycode_top_init) {
    keycode_top.classList.remove("keycode_top_init");
    document.querySelector(".top").classList.remove("card");
    document.querySelector(".container").classList.remove("container--flex");
    document.querySelector(".bottom").classList.remove("hidden");
    keycode_top_init = false;
  }
  let keyCode = evt?.keyCode || evt?.which;
  if (keyCodesWithEvents[keyCode]?.path != `/${getUrlParam(undefined, "path")}`) {
    let baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    let url = new URL(baseUrl);
    window.history.replaceState({}, "", url);
  }
  document.querySelector(".top>div:nth-child(1)").textContent = `JavaScript Key Code ${keyCode}`;
  keycode_top.textContent = keyCode;
  if (evt?.code == "Space") {
    keKey.textContent = "(blank space)";
  } else {
    keKey.textContent = evt?.key || "-";
  }
  if (evt?.code?.startsWith("Numpad")) {
    keLocation.textContent = "Numpad";
  } else if (evt?.code?.endsWith("Left") && !evt?.code?.startsWith("Arrow")) {
    keLocation.textContent = "Left-side modifier keys";
  } else if (evt?.code?.endsWith("Right") && !evt?.code?.startsWith("Arrow")) {
    keLocation.textContent = "Right-side modifier keys";
  } else {
    keLocation.textContent = "General keys"; //evt.location;
  }
  keCode.textContent = evt?.code || "-";
  keWhich.textContent = evt?.which || "-";
  keUnicode.textContent = keyCodesWithEvents[keyCode]?.unicode || "-";
  if (evt?.metaKey) {
    keSuperkey.style.color = "#262d3d";
    keSuperkey.style.borderColor = "#262d3d";
  } else {
    keSuperkey.style.color = "#c4c6ca";
    keSuperkey.style.borderColor = "#c4c6ca";
  }
  if (evt?.shiftKey) {
    keShiftkey.style.color = "#262d3d";
    keShiftkey.style.borderColor = "#262d3d";
  } else {
    keShiftkey.style.color = "#c4c6ca";
    keShiftkey.style.borderColor = "#c4c6ca";
  }
  if (evt?.altKey) {
    keAltkey.style.color = "#262d3d";
    keAltkey.style.borderColor = "#262d3d";
  } else {
    keAltkey.style.color = "#c4c6ca";
    keAltkey.style.borderColor = "#c4c6ca";
  }
  if (evt?.ctrlKey) {
    keCtrlkey.style.color = "#262d3d";
    keCtrlkey.style.borderColor = "#262d3d";
  } else {
    keCtrlkey.style.color = "#c4c6ca";
    keCtrlkey.style.borderColor = "#c4c6ca";
  }
  keEventdump.textContent = `   {
    "key": "${evt?.key || ""}",
    "keyCode": ${evt?.keyCode || 0},
    "which": ${evt?.which || 0},
    "code": "${evt?.code || ""}",
    "location": ${evt?.location || 0},
    "altKey": ${evt?.altKey || false},
    "ctrlKey": ${evt?.ctrlKey || false},
    "metaKey": ${evt?.metaKey || false},
    "shiftKey": ${evt?.shiftKey || false},
    "repeat": ${evt?.repeat || false},
   }`;
}, 100);

const onDOMContentLoaded = (e) => {
  const allUrlParams = getAllUrlParams();
  if (allUrlParams && Object.getOwnPropertyNames(allUrlParams).length > 0) {
    let keyCode = allUrlParams?.keyCode;
    let path = allUrlParams?.path;
    if (!keyCode) return;
    let keyCodeObj = keyCodesWithEvents[keyCode];
    if (!keyCodeObj) return;
    let code = keyCodeObj?.code;
    if (path) {
      code = path.endsWith("right")
        ? keyCodeObj?.code?.replace("Left", "Right")
        : keyCodeObj?.code?.replace("Right", "Left");
    }
    onKeyDownFn({
      key: keyCodeObj?.key,
      keyCode: keyCodeObj?.keyCode,
      which: keyCodeObj?.which,
      code: code,
      location: keyCodeObj?.location,
      altKey: keyCodeObj?.altKey,
      ctrlKey: keyCodeObj?.ctrlKey,
      metaKey: keyCodeObj?.metaKey,
      shiftKey: keyCodeObj?.shiftKey,
      repeat: keyCodeObj?.repeat,
    });
  }
};

addEventListener("keydown", onKeyDownFn);
addEventListener("DOMContentLoaded", onDOMContentLoaded);
