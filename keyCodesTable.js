const keyCWEArray = Object.values(keyCodesWithEvents).filter((x) => x);

const getSiblings = function (e) {
  let siblings = [];
  if (!e.parentNode) {
    return siblings;
  }
  let sibling = e.parentNode.firstChild;
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== e) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return siblings;
};

const addKeyRow = (tbody, keyArrayItm) => {
  let tr = tbody.insertRow();
  let td1 = tr.insertCell(0);
  let td2 = tr.insertCell(1);
  let td3 = tr.insertCell(2);
  let td4 = tr.insertCell(3);
  let td5 = tr.insertCell(4);
  let td6 = tr.insertCell(5);
  let anchorElName = "";
  if (keyArrayItm?.key?.trim()) anchorElName = "key";
  else if (keyArrayItm?.code?.trim()) anchorElName = "code";
  else if (keyArrayItm?.description?.trim()) anchorElName = "description";
  var a = document.createElement("a");
  a.href = `./keyEvents.html?keyCode=${keyArrayItm?.keyCode}&path=${keyArrayItm?.path?.substring(1)}`;
  td1.textContent = keyArrayItm?.key?.trim() || keyArrayItm?.code?.trim() || keyArrayItm?.description?.trim() || "--";
  td2.textContent = keyArrayItm?.keyCode || "--";
  if (anchorElName != "key") td3.textContent = keyArrayItm?.key || "--";
  else {
    a.textContent = keyArrayItm?.key;
    td3.appendChild(a);
  }
  if (anchorElName != "code") td4.textContent = keyArrayItm?.code || "--";
  else {
    a.textContent = keyArrayItm?.code;
    td4.appendChild(a);
  }
  td5.textContent = keyArrayItm?.unicode || "--";
  if (anchorElName != "description") td6.textContent = keyArrayItm?.description || "--";
  else {
    a.textContent = keyArrayItm?.description;
    td6.appendChild(a);
  }
  if (td2.textContent.trim() == "--") td2.style.visibility = "hidden";
  if (td3.textContent.trim() == "--") td3.style.visibility = "hidden";
  if (td4.textContent.trim() == "--") td4.style.visibility = "hidden";
  if (td5.textContent.trim() == "--") td5.style.visibility = "hidden";
  if (td6.textContent.trim() == "--") td6.style.visibility = "hidden";
};

const mapKeyCWEArraytoTbl = (keyArray) => {
  let tbody = document.querySelector(".keyTable > tbody");
  tbody.replaceChildren();
  for (var i = 0; i < keyArray.length; i++) {
    addKeyRow(tbody, keyArray[i]);
    let keyArrayIClone = null;
    if (keyArray[i]?.keyCode > 15 && keyArray[i]?.keyCode < 19) {
      keyArrayIClone = JSON.parse(JSON.stringify(keyArray[i]));
      keyArrayIClone.code = keyArrayIClone?.code?.replace("Left", "Right") || "";
      keyArrayIClone.path = keyArrayIClone?.path?.replace("left", "right") || "";
      addKeyRow(tbody, keyArrayIClone);
    }
  }
};

const enableAccordionAction = () => {
  let col1Cells = document.querySelectorAll("table.keyTable td:nth-child(1)");
  for (i = 0; i < col1Cells.length; i++) {
    col1Cells[i].addEventListener("click", function eventHandler() {
      if (document.documentElement.clientWidth > 767) return;
      this.classList.toggle("selected");
      for (i = 0; i < getSiblings(this).length; i++) {
        if (getSiblings(this)[i].textContent != "--") {
          getSiblings(this)[i].classList.toggle("showMe");
        }
        // $(this).siblings().toggleClass("showMe");
      }
    });
  }
};

const onDOMContentLoaded = (e) => {
  mapKeyCWEArraytoTbl(keyCWEArray);
  enableAccordionAction();
};

addEventListener("DOMContentLoaded", onDOMContentLoaded);
