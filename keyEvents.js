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
  let keyCode = evt.keyCode || evt.which;
  document.querySelector(".top>div:nth-child(1)").textContent = `JavaScript Key Code ${keyCode}`;
  keycode_top.textContent = keyCode;
  if (evt.code == "Space") {
    keKey.textContent = "(blank space)";
  } else {
    keKey.textContent = evt.key;
  }
  if (evt.code.startsWith("Numpad")) {
    keLocation.textContent = "Numpad";
  } else if (evt.code.endsWith("Left") && !evt.code.startsWith("Arrow")) {
    keLocation.textContent = "Left-side modifier keys";
  } else if (evt.code.endsWith("Right") && !evt.code.startsWith("Arrow")) {
    keLocation.textContent = "Right-side modifier keys";
  } else {
    keLocation.textContent = "General keys"; //evt.location;
  }
  keCode.textContent = evt.code;
  keWhich.textContent = evt.which;
  keUnicode.textContent = keyCodesWithEvents[keyCode]?.unicode || "-";
  if (evt.metaKey) {
    keSuperkey.style.color = "#262d3d";
    keSuperkey.style.borderColor = "#262d3d";
  } else {
    keSuperkey.style.color = "#c4c6ca";
    keSuperkey.style.borderColor = "#c4c6ca";
  }
  if (evt.shiftKey) {
    keShiftkey.style.color = "#262d3d";
    keShiftkey.style.borderColor = "#262d3d";
  } else {
    keShiftkey.style.color = "#c4c6ca";
    keShiftkey.style.borderColor = "#c4c6ca";
  }
  if (evt.altKey) {
    keAltkey.style.color = "#262d3d";
    keAltkey.style.borderColor = "#262d3d";
  } else {
    keAltkey.style.color = "#c4c6ca";
    keAltkey.style.borderColor = "#c4c6ca";
  }
  if (evt.ctrlKey) {
    keCtrlkey.style.color = "#262d3d";
    keCtrlkey.style.borderColor = "#262d3d";
  } else {
    keCtrlkey.style.color = "#c4c6ca";
    keCtrlkey.style.borderColor = "#c4c6ca";
  }
  keEventdump.textContent = `   {
    "key": "${evt.key}",
    "keyCode": ${evt.keyCode},
    "which": ${evt.which},
    "code": "${evt.code}",
    "location": ${evt.location},
    "altKey": ${evt.altKey},
    "ctrlKey": ${evt.ctrlKey},
    "metaKey": ${evt.metaKey},
    "shiftKey": ${evt.shiftKey},
    "repeat": ${evt.repeat},
   }`;
}, 100);

addEventListener("keydown", onKeyDownFn);
