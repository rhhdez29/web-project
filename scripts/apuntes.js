// Elementos principales
const workspace = document.getElementById("workspace");
const contextMenu = document.getElementById("context-menu");
const addImageBtn = document.getElementById('add-image-btn');
const contenedorPrincipal = document.getElementById("contenedor-bloques");
const fontSize = document.getElementById("font-size");
const textColor = document.getElementById("text-color");
const bgColor = document.getElementById("bg-color");
const fontSelect = document.getElementById("font-select");

const boldBtn = document.getElementById("bold-btn");
const italicBtn = document.getElementById("italic-btn");
const underlineBtn = document.getElementById("underline-btn");
const highlightBtn = document.getElementById("highlight-btn");

const alignLeftBtn = document.getElementById("align-left");
const alignCenterBtn = document.getElementById("align-center");
const alignRightBtn = document.getElementById("align-right");
const alignJustifyBtn = document.getElementById("align-justify");

const deleteBtn = document.getElementById("delete-block");

// Variables de estado
let selectedBlock = null;


// Inicializar arrastre de herramientas
function initToolDrag() {
  document.querySelectorAll(".tool").forEach(tool => {
    tool.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", tool.dataset.type);
    });
  });
}

// Manejar soltar elementos en el área de trabajo
function initWorkspaceDrop() {
  workspace.addEventListener("drop", e => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    createNewBlock(type, e.clientX, e.clientY);
  });
}

// Manejar arrastre sobre el área de trabajo
function createNewBlock(type) {
  let element;

  switch (type) {
    case "text":
      element = createTextBlock(); // Bloque de texto
      break;
    case "list":
      element = createListBlock(); // Bloque de lista numerada
      break;
    case "bullet":
      element = createBulletListBlock(); // Bloque de lista con viñetas
      break;
    case "heading":
      element = createHeadingBlock(); // Bloque de encabezado
      break;
    case "hyperText":
      element = createHyperText(); // Bloque de hiperenlace
      break;
    case "table":
      element = createTableBlock(); // Bloque de tabla
      break;
    case "note":
      element = createNoteBlock(); // opción para nota
      break;
    case "formula":
      element = CreateFormulaBlock(); // opción para fórmula
      break;
    default:
      return;
  }

  if (element) {
    // Estilo normal, sin posición absoluta
    element.style.position = "relative";

    // Insertar al final (flujo vertical)
    workspace.appendChild(element);
  }
}


// Crear bloque de texto
function createTextBlock() {
  const container = document.createElement("div");
  container.className = "block-container";

  const block = document.createElement("div");
  block.className = "content-block text-block";
  block.contentEditable = true;
  block.setAttribute('data-placeholder', 'Escribe aquí...');

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.innerHTML = "⋮";
  handle.addEventListener("click", (e) => {
    e.stopPropagation();
    showContextMenu(block);
  });

  // Cambiar orden en el DOM (primero el bloque, luego el handle)
  container.appendChild(block);
  container.appendChild(handle);

  return container;
}

// Crear bloque de subtítulo
function createHeadingBlock() {
  const container = document.createElement("div");
  container.className = "block-container";

  const block = document.createElement("div");
  block.className = "content-block heading-block";
  block.contentEditable = true;
  block.setAttribute('data-placeholder', 'Escribe tu título aquí...');

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.innerHTML = "⋮";
  handle.addEventListener("click", (e) => {
    e.stopPropagation();
    showContextMenu(block);
  });

  container.appendChild(block);
  container.appendChild(handle);

  return container;
}

function createListBlock() {
  const container = document.createElement("div");
  container.className = "block-container list-container";

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.innerHTML = "⋮";
  handle.addEventListener("click", (e) => {
    e.stopPropagation();
    showContextMenu(container);
  });

  const listItemsWrapper = document.createElement("div");
  listItemsWrapper.className = "list-items-wrapper";

  // Agrega el primer ítem
  listItemsWrapper.appendChild(createListItem());

  const buttons = document.createElement("div");
  buttons.className = "block-buttons";
  buttons.style.flexDirection = "column";

  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.onclick = () => {
    const newItem = createListItem();
    listItemsWrapper.appendChild(newItem);
    actualizarNumeracionInterna(listItemsWrapper);
    return isFirst = false;
  };

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "×";
  deleteButton.onclick = () => {
    const items = listItemsWrapper.querySelectorAll(".list-item");
    if (items.length > 1) {
      items[items.length - 1].remove();
      actualizarNumeracionInterna(listItemsWrapper);
    }
  };

  buttons.appendChild(addButton);
  buttons.appendChild(deleteButton);

  container.appendChild(handle);
  container.appendChild(listItemsWrapper);
  container.appendChild(buttons);

  actualizarNumeracionInterna(listItemsWrapper);

  return container;
}

function createListItem() {
  const itemWrapper = document.createElement("div");
  itemWrapper.className = "content-block text-block-wrapper list-item";

  const bullet = document.createElement("span");
  bullet.className = "block-number";

  const block = document.createElement("div");
  block.className = "content-block listBlock";
  block.contentEditable = true;
  block.setAttribute("data-placeholder", "Escribe aquí...");

  itemWrapper.appendChild(bullet);
  itemWrapper.appendChild(block);

  return itemWrapper;
}


function actualizarNumeracionInterna(wrapper) {
  const items = wrapper.querySelectorAll(".list-item");
  items.forEach((item, index) => {
    const label = item.querySelector(".block-number");
    if (label) label.textContent = `${index + 1}.`;
  });
}


function createBulletListBlock() {
  const container = document.createElement("div");
  container.className = "block-container list-container";

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.innerHTML = "⋮";
  handle.addEventListener("click", (e) => {
    e.stopPropagation();
    showContextMenu(container);
  });

  const listItemsWrapper = document.createElement("div");
  listItemsWrapper.className = "list-items-wrapper";

  // Agrega el primer ítem
  listItemsWrapper.appendChild(createBulletListItem());

  const buttons = document.createElement("div");
  buttons.className = "block-buttons";
  buttons.style.flexDirection = "column";

  const addButton = document.createElement("button");
  addButton.textContent = "+";
  addButton.onclick = () => {
    const newItem = createBulletListItem();
    listItemsWrapper.appendChild(newItem);
    return isFirst = false;
  };

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "×";
  deleteButton.onclick = () => {
    const items = listItemsWrapper.querySelectorAll(".list-item");
    if (items.length > 1) {
      items[items.length - 1].remove();
    }
  };

  buttons.appendChild(addButton);
  buttons.appendChild(deleteButton);

  container.appendChild(handle);
  container.appendChild(listItemsWrapper);
  container.appendChild(buttons);

  actualizarNumeracionInterna(listItemsWrapper);

  return container;
}

function createBulletListItem() {
  const itemWrapper = document.createElement("div");
  itemWrapper.className = "content-block text-block-wrapper list-item";

  const bullet = document.createElement("span");
  bullet.className = "block-bullet";
  bullet.textContent = "•";

  const block = document.createElement("div");
  block.className = "content-block listBlock";
  block.contentEditable = true;
  block.setAttribute("data-placeholder", "Escribe aquí...");

  itemWrapper.appendChild(bullet);
  itemWrapper.appendChild(block);

  return itemWrapper;
}

function createHyperText() {
  const container = document.createElement("div");
  container.className = "block-container";

  const block = document.createElement("div");
  block.className = "content-block text-block hyperText";
  block.contentEditable = true;
  block.setAttribute("data-placeholder", "Escribe aquí...");

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.innerHTML = "⋮";
  handle.addEventListener("click", (e) => {
    e.stopPropagation();
    showContextMenu(block);
  });

  const buttons = document.createElement("div"); // Contenedor para los botones
  buttons.className = "block-buttons";

  const editButton = document.createElement("button"); // Botón para editar
  editButton.textContent = "✎";
  editButton.title = "Editar";
  editButton.addEventListener("click", () => {
    block.contentEditable = true;
    block.focus();
  });

  buttons.appendChild(editButton);

  // Detectar URL al salir del bloque
  block.addEventListener("blur", () => {
    const text = block.innerText.trim();
    const urlPattern = /^(https?:\/\/)?(www\.)?[\w\-]+\.[a-z]{2,}(\S*)?$/i;
    if (urlPattern.test(text)) {
      block.classList.add("link");
      block.contentEditable = false;
    } else {
      block.classList.remove("link");
    }
  });

  // Click para abrir si es link
  block.addEventListener("click", () => {
    if (!block.isContentEditable && block.classList.contains("link")) {
      let url = block.innerText.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      window.open(url, "_blank");
    }
  });

  container.appendChild(block);
  container.appendChild(handle);
  container.appendChild(buttons);
  return container;
}

function createCell(isHeader) {
  const cell = document.createElement(isHeader ? "th" : "td");
  cell.contentEditable = true;
  cell.setAttribute("data-placeholder", isHeader ? "Encabezado" : "Escribe...");
  return cell;
}

function createTableBlock() {
  const container = document.createElement("div");
  container.className = "block-container table-block";

  const table = document.createElement("table");
  table.className = "editable-table";

  const handle = document.createElement("div");
  handle.className = "block-handle";
  handle.innerHTML = "⋮";
  handle.addEventListener("click", (e) => {
    e.stopPropagation();
    showContextMenu(table);
  });

  // Crear encabezado
  const headerRow = document.createElement("tr");
  headerRow.appendChild(createCell(true));
  table.appendChild(headerRow);

  // Crear primera fila
  const row = document.createElement("tr");
  row.appendChild(createCell(false));
  table.appendChild(row);

  // Crear contenedor para controles
  const controlsWrapper = document.createElement("div");
  controlsWrapper.className = "table-controls-wrapper";

  const controls = document.createElement("div");
  controls.className = "table-controls";

  const addRowBtn = document.createElement("button");
  addRowBtn.textContent = "+ Fila";
  addRowBtn.onclick = () => {
    const newRow = document.createElement("tr");
    const colCount = table.rows[0].cells.length;
    for (let i = 0; i < colCount; i++) {
      newRow.appendChild(createCell(false));
    }
    table.appendChild(newRow);
  };

  const removeRowBtn = document.createElement("button"); // Botón para eliminar fila
  removeRowBtn.textContent = "− Fila";
  removeRowBtn.onclick = () => {
    if (table.rows.length > 2) {
      table.deleteRow(-1);
    }
  };

  const addColBtn = document.createElement("button"); // Botón para añadir columna
  addColBtn.textContent = "+ Columna";
  addColBtn.onclick = () => {
    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].appendChild(createCell(i === 0));
    }
    ajustarTamañoTabla(); // Ajustar tamaño de la tabla
  };

  const removeColBtn = document.createElement("button"); // Botón para eliminar columna
  removeColBtn.textContent = "− Columna";
  removeColBtn.onclick = () => {
    const colCount = table.rows[0].cells.length;
    if (colCount > 1) {
      for (let row of table.rows) {
        row.deleteCell(-1);
      }
      ajustarTamañoTabla(); // Ajustar tamaño de la tabla
    }
  };

  controls.appendChild(addRowBtn);
  controls.appendChild(removeRowBtn);
  controls.appendChild(addColBtn);
  controls.appendChild(removeColBtn);

  controlsWrapper.appendChild(controls);

  container.appendChild(table);
  container.appendChild(handle);
  container.appendChild(controlsWrapper);

  return container;
}

const ajustarTamañoTabla = () => {
  const tabla = document.querySelector(".editable-table");
  const columnas = tabla.rows[0]?.cells.length || 1;

  const nuevoTamaño = Math.max(10, 16 - columnas); // ej: 16px base, mínimo 10px
  tabla.style.fontSize = `${nuevoTamaño}px`;
};

function createNoteBlock() {
  const container = document.createElement("div");
  container.className = "block-container note-container";

  const title = document.createElement("div");
  title.className = "note-title";
  title.contentEditable = true;
  title.setAttribute("data-placeholder", "Título...");

  const content = document.createElement("div");
  content.className = "note-content";
  content.contentEditable = true;
  content.setAttribute("data-placeholder", "Escribe tu nota...");

  const handle = document.createElement("div");
      handle.className = "block-handle";
      handle.innerHTML = "×";
      handle.addEventListener("click", () => container.remove());


  container.appendChild(title);
  container.appendChild(content);
  container.appendChild(handle);

  return container;
}

function createFileBlock(file) {
      const container = document.createElement("div");
      container.className = "block-container";

      const block = document.createElement("div");
      block.className = "content-block file-block";

      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        block.appendChild(img);
      } else if (file.type === "application/pdf") {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.target = "_blank";
        link.textContent = "Abrir PDF";
        block.appendChild(link);
      } else {
        const text = document.createElement("p");
        text.textContent = `Archivo: ${file.name}`;
        block.appendChild(text);
      }

      const handle = document.createElement("div");
      handle.className = "block-handle";
      handle.innerHTML = "×";
      handle.addEventListener("click", () => container.remove());

      container.appendChild(block);
      container.appendChild(handle);

      return container;
    }

    document.getElementById("fileUploader").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const block = createFileBlock(file);
        workspace.appendChild(block);
      }
      e.target.value = ""; // Permitir volver a subir el mismo archivo
    });

    function CreateFormulaBlock() {
      const container = document.createElement("div");
      container.className = "block-container";

      const block = document.createElement("div");
      block.className = "content-block formula-block";
      block.dataset.latex = "\\frac{a}{b}";

      const render = document.createElement("div");
      render.className = "formula-render";
      render.innerHTML = `\\(${block.dataset.latex}\\)`;
      MathJax.typesetPromise([render]);

      const button = document.createElement("button");
      button.className = "edit-formula";
      button.textContent = "✎ Editar fórmula";
      button.onclick = () => openFormulaEditor(block, render);

      const handle = document.createElement("div");
      handle.className = "block-handle";
      handle.innerHTML = "×";
      handle.addEventListener("click", () => container.remove());


      block.appendChild(render);
      block.appendChild(button);
      container.appendChild(block);
      container.appendChild(handle);
      document.getElementById("workspace").appendChild(container);
    }

    function openFormulaEditor(block, renderTarget) {
      const modal = document.createElement("div");
      modal.className = "formula-modal";

      const textarea = document.createElement("textarea");
      textarea.value = block.dataset.latex;

      const controls = document.createElement("div");
      controls.className = "formula-controls";

      const insert = (text) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.setRangeText(text, start, end, 'end');
        textarea.focus();
      };

      const buttons = [
        { label: "Fracción", code: "\\frac{a}{b}" },
        { label: "Raíz", code: "\\sqrt{x}" },
        { label: "Integral", code: "\\int x\\,dx" },
        { label: "Sumatoria", code: "\\sum_{i=1}^n i^2" },
        { label: "Pi", code: "\\pi" },
        { label: "Theta", code: "\\theta" }
      ];

      buttons.forEach(btn => {
        const b = document.createElement("button");
        b.textContent = btn.label;
        b.onclick = () => insert(btn.code);
        controls.appendChild(b);
      });

      const actions = document.createElement("div");
      actions.className = "modal-actions";

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Guardar";
      saveBtn.className = "save-btn";
      saveBtn.onclick = () => {
        block.dataset.latex = textarea.value;
        renderTarget.innerHTML = `\\(${textarea.value}\\)`;
        MathJax.typesetPromise([renderTarget]);
        modal.remove();
      };

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancelar";
      cancelBtn.className = "cancel-btn";
      cancelBtn.onclick = () => modal.remove();

      actions.appendChild(cancelBtn);
      actions.appendChild(saveBtn);

      modal.appendChild(textarea);
      modal.appendChild(controls);
      modal.appendChild(actions);
      document.body.appendChild(modal);
    }



// Mostrar menú contextual
function showContextMenu(block, clientX = null, clientY = null) {
  if (!block) return;

  if (selectedBlock) selectedBlock.classList.remove("selected");

  selectedBlock = block;
  selectedBlock.classList.add("selected");

  const rect = selectedBlock.getBoundingClientRect();
  const workspaceRect = workspace.getBoundingClientRect();

  contextMenu.style.left = `${clientX ? clientX - workspaceRect.left : rect.left - workspaceRect.left + 10}px`;
  contextMenu.style.top = `${clientY ? clientY - workspaceRect.top : rect.top - workspaceRect.top + selectedBlock.offsetHeight + 10}px`;
  contextMenu.style.display = "flex";

  updateContextMenuWithBlockStyles();
}

// Inicializar menú contextual de formato
function initContextMenuFormatting() {
  const fuentes = ["Arial", "Georgia", "Courier New", "Segoe UI", "Verdana"];
  fuentes.forEach(fuente => {
    const option = document.createElement("option");
    option.value = fuente;
    option.textContent = fuente;
    fontSelect.appendChild(option);
  });

  fontSelect.addEventListener("change", () => applyStyleToSelectionOrBlock("fontFamily", fontSelect.value));
  fontSize.addEventListener("input", () => applyStyleToSelectionOrBlock("fontSize", fontSize.value + "px"));

  textColor.addEventListener("input", () => applyStyleToSelectionOrBlock("color", textColor.value));
  bgColor.addEventListener("input", () => applyStyleToSelectionOrBlock("backgroundColor", bgColor.value));

  boldBtn.addEventListener("click", () => toggleStyle("fontWeight", "bold", "normal", boldBtn));
  italicBtn.addEventListener("click", () => toggleStyle("fontStyle", "italic", "normal", italicBtn));
  underlineBtn.addEventListener("click", () => toggleStyle("textDecoration", "underline", "none", underlineBtn));
  highlightBtn.addEventListener("click", () => toggleStyle("backgroundColor", "yellow", "transparent", highlightBtn));

  alignLeftBtn.addEventListener("click", () => applyTextAlign("left", alignLeftBtn));
  alignCenterBtn.addEventListener("click", () => applyTextAlign("center", alignCenterBtn));
  alignRightBtn.addEventListener("click", () => applyTextAlign("right", alignRightBtn));
  alignJustifyBtn.addEventListener("click", () => applyTextAlign("justify", alignJustifyBtn));

  deleteBtn.addEventListener("click", () => {
    if (selectedBlock) {
      selectedBlock.remove();
      closeContextMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (!contextMenu.contains(e.target) && !e.target.classList.contains("block-handle")) {
      closeContextMenu();
    }
  });
}

// Aplicar alineación de texto
function applyTextAlign(alignment, activeButton) {
  if (selectedBlock) {
    selectedBlock.style.textAlign = alignment;
  }

  ["align-left", "align-center", "align-right", "align-justify"].forEach(id => {
    document.getElementById(id).classList.remove("active");
  });
  activeButton.classList.add("active");
}

// Actualizar menú contextual con estilos del bloque seleccionado
function updateContextMenuWithBlockStyles() {
  if (!selectedBlock) return;

  const computed = getComputedStyle(selectedBlock);

  document.getElementById("font-select").value = selectedBlock.style.fontFamily || computed.fontFamily;
  document.getElementById("font-size").value = parseInt(computed.fontSize) || 16;
  document.getElementById("text-color").value = rgbToHex(computed.color);
  document.getElementById("bg-color").value = rgbToHex(computed.backgroundColor);

  setButtonState(boldBtn, computed.fontWeight === "bold" || selectedBlock.style.fontWeight === "bold");
  setButtonState(italicBtn, computed.fontStyle === "italic" || selectedBlock.style.fontStyle === "italic");
  setButtonState(underlineBtn, computed.textDecoration.includes("underline") || selectedBlock.style.textDecoration === "underline");
  setButtonState(highlightBtn, computed.backgroundColor === "rgb(255, 255, 0)" || selectedBlock.style.backgroundColor === "yellow");

  setButtonState(alignLeftBtn, computed.textAlign === "left" || selectedBlock.style.textAlign === "left");
  setButtonState(alignCenterBtn, computed.textAlign === "center" || selectedBlock.style.textAlign === "center");
  setButtonState(alignRightBtn, computed.textAlign === "right" || selectedBlock.style.textAlign === "right");
  setButtonState(alignJustifyBtn, computed.textAlign === "justify" || selectedBlock.style.textAlign === "justify");
}

// Establecer estado del botón
function setButtonState(button, isActive) {
  button.classList.toggle("active", isActive);
}

// Aplicar estilo a la selección o bloque
function applyStyleToSelectionOrBlock(style, value) {
  const sel = window.getSelection();

  if (sel.rangeCount && !sel.isCollapsed) {
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style[style] = value;
    span.appendChild(range.extractContents());
    range.deleteContents();
    range.insertNode(span);
  } else if (selectedBlock) {
    applyStyleRecursively(selectedBlock, style, value);
  }
}

// Aplicar estilo recursivamente a los elementos hijos
function applyStyleRecursively(element, style, value) {
  if (!element) return;

  if (element.nodeType === Node.ELEMENT_NODE) {
    if (["P", "DIV", "SPAN"].includes(element.tagName) || element.classList.contains("content-block")) {
      element.style[style] = value;
    }
    Array.from(element.childNodes).forEach(child => applyStyleRecursively(child, style, value));
  }
}

// Alternar estilo
function toggleStyle(property, activeValue, inactiveValue, button) {
  const sel = window.getSelection();

  if (sel.rangeCount && !sel.isCollapsed) {
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.style[property] = activeValue;
    span.appendChild(range.extractContents());
    range.deleteContents();
    range.insertNode(span);
  } else if (selectedBlock) {
    const current = selectedBlock.style[property];
    const newValue = current === activeValue ? inactiveValue : activeValue;
    selectedBlock.style[property] = newValue;
  }

  if (button) {
    button.classList.toggle("active");
  }
}

// Cerrar menú contextual
function closeContextMenu() {
  contextMenu.style.display = "none";
  if (selectedBlock) selectedBlock.classList.remove("selected");
  selectedBlock = null;
}

// Convertir color RGB a HEX
function rgbToHex(rgb) {
  if (!rgb) return "#000000";

  const tempElem = document.createElement("div");
  tempElem.style.color = rgb;
  document.body.appendChild(tempElem);
  const computedColor = getComputedStyle(tempElem).color;
  document.body.removeChild(tempElem);

  const result = computedColor.match(/\d+/g);
  if (!result || result.length < 3) return "#000000";

  return "#" + result.slice(0, 3).map(x => (+x).toString(16).padStart(2, "0")).join("");
}



function openImagePicker(imgElement) {
  const modal = document.getElementById("image-picker-modal");
  const overlay = document.getElementById("modal-overlay");
  const optionsContainer = document.getElementById("image-picker-options");

  // Lista de imágenes disponibles
  const images = [
    "../assets/imagenes/fondo2.jpg",
    "../assets/imagenes/elemento.svg",
    "../assets/imagenes/otro1.svg",
    "../assets/imagenes/otro2.svg"
  ];

  // Limpiar opciones anteriores
  optionsContainer.innerHTML = "";

  // Crear miniaturas de imágenes
  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.objectFit = "cover";
    img.style.cursor = "pointer";
    img.style.borderRadius = "6px";
    img.style.border = "2px solid transparent";

    // Evento al hacer clic en una miniatura
    img.addEventListener("click", () => {
      imgElement.src = src;
      closeImagePicker();
    });

    optionsContainer.appendChild(img);
  });

  // Mostrar el modal y overlay
  modal.style.display = "block";
  overlay.style.display = "block";

  // Botón para cerrar
  document.getElementById("close-image-picker").onclick = closeImagePicker;
}

// Función para cerrar el modal
function closeImagePicker() {
  document.getElementById("image-picker-modal").style.display = "none";
  document.getElementById("modal-overlay").style.display = "none";
}

// Función de inicialización
function initModal() {
  // Configurar botón de cerrar
  const closeButton = document.getElementById("close-image-picker");
  if (closeButton) {
    closeButton.addEventListener("click", closeImagePicker);
  }

  // Opcional: Cerrar con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeImagePicker();
    }
  });
}

// Inicializar eventos de clic en imágenes
function initImageClick(selector, callback) {
  document.querySelectorAll(selector).forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      callback(img);
    });
  });
}

// Placeholder para encabezados
document.querySelectorAll('.editable-h1').forEach(editable => {
  // Limpiar placeholder al enfocar
  editable.addEventListener('focus', () => {
    if (editable.textContent.trim() === '') {
      editable.innerHTML = '';
    }
  });

  // Restaurar placeholder si está vacío al perder foco
  editable.addEventListener('blur', () => {
    if (editable.textContent.trim() === '') {
      editable.innerHTML = '';
    }
  });
});

// Placeholder para bloques de texto
workspace.addEventListener('focusin', (e) => {
  const block = e.target;
  if (block.classList.contains('block') && block.isContentEditable) {
    if (block.innerText.trim() === 'Escribe aquí...') {
      block.innerHTML = ''; // Borra el placeholder al enfocarlo si todavía estaba
    }
  }
});

// Restaurar placeholder si está vacío al perder foco
workspace.addEventListener('input', (e) => {
  const block = e.target;
  if (block.classList.contains('block') && block.isContentEditable) {
    // Si se borra todo y quedan <br>, limpiar para que ::before funcione
    if (block.innerHTML.trim() === '<br>' || block.innerHTML.trim() === '') {
      block.innerHTML = '';
    }
  }
});


// Inicializar la aplicación
function init() {
  initToolDrag();
  initWorkspaceDrop();
  initContextMenuFormatting();
  initImageClick('.portada', openImagePicker);
  initImageClick('.icono', openImagePicker);
  initModal();
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);

// Sincronizar foto de perfil desde localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Cargar foto de perfil desde localStorage si existe
    const savedPhoto = localStorage.getItem('profilePictureUpdated');
    if (savedPhoto) {
        const profilePic = document.getElementById('apuntes-profile-picture');
        if (profilePic) profilePic.src = savedPhoto;
    }
    
    // Escuchar cambios
    window.addEventListener('storage', function(e) {
        if (e.key === 'profilePictureUpdated' && e.newValue) {
            const profilePic = document.getElementById('apuntes-profile-picture');
            if (profilePic) profilePic.src = e.newValue;
        }
    });
});

// Exportar contenido a PDF
async function exportarContenido() {
    const { jsPDF } = window.jspdf;
    const contenido = document.getElementById("Contenido");
    const rawTitle = document.getElementById("editable-title").innerText.trim() || "Archivo";
    const titulo = rawTitle.replace(/[^a-z0-9áéíóúñü \-_]/gi, '').substring(0, 50);

    try {
        // 1. Aplicar estilos de impresión antes de capturar
        document.getElementById('Contenido').classList.add('printing-pdf');

        // 2. Forzar cálculo de estilos (reflow)
        void document.getElementById('Contenido').offsetHeight;

        // 3. Configurar html2canvas con las dimensiones reales del contenido
        const canvas = await html2canvas(contenido, {
            scale: 2,
            logging: true,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: contenido.scrollWidth,
            windowHeight: contenido.scrollHeight,
            backgroundColor: '#FFFFFF'
        });

        // 4. Remover estilos de impresión después de capturar
        document.getElementById('Contenido').classList.remove('printing-pdf');

        const imgData = canvas.toDataURL("image/png", 1.0);

        // 5. Crear PDF con tamaño adecuado (A4 en mm)
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        // 6. Calcular dimensiones para ajustar al PDF manteniendo relación de aspecto
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Margen 10mm cada lado
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // 7. Centrar la imagen en el PDF con márgenes
        const xPos = 10; // Margen izquierdo 10mm
        const yPos = 10; // Margen superior 10mm

        pdf.addImage(imgData, 'PNG', xPos, yPos, pdfWidth, pdfHeight);

        // 8. Guardar el PDF
        pdf.save(titulo + ".pdf");

    } catch (err) {
        document.getElementById('Contenido').classList.remove('printing-pdf')
        console.error("Error al generar el PDF:", err);
        alert("Ocurrió un error al generar el PDF. Revisa la consola.");
    }
}

// Botón para cambiar color de fondo (modo oscuro/claro)
document.addEventListener('DOMContentLoaded', function() {
    const cambiarColorBtn = document.getElementById('cambiarColorBtn');
    if (cambiarColorBtn) {
        cambiarColorBtn.addEventListener('click', function() {
            // Obtener el color actual del body
            var currentColor = document.body.style.backgroundColor;
            
            // Cambiar entre colores
            if (currentColor === 'rgb(255, 255, 255)' || currentColor === '' || currentColor === 'white') {
                document.body.style.backgroundColor = '#121212';
                document.body.style.color = '#ffffff';
            } else {
                document.body.style.backgroundColor = 'white';
                document.body.style.color = '#000000';
            }
            
            // Guardar la preferencia en localStorage
            localStorage.setItem('modoOscuro', document.body.style.backgroundColor === '#121212');
        });

        // Verificar el modo al cargar la página
        if (localStorage.getItem('modoOscuro') === 'true') {
            document.body.style.backgroundColor = '#121212';
            document.body.style.color = '#ffffff';
        }
    }
});

// Sincronizar modo oscuro con localStorage/cookie
function syncDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
                    document.cookie.includes('darkMode=true');
    
    if (darkMode) {
        document.body.classList.add('modo-oscuro');
    } else {
        document.body.classList.remove('modo-oscuro');
    }
}

// Escuchar cambios en el modo oscuro
window.addEventListener('storage', function(event) {
    if (event.key === 'darkMode') {
        syncDarkMode();
    }
});

window.addEventListener('message', function(event) {
    console.log("Mensaje recibido en editor:", event.data);
    if (event.data && event.data.type === 'cargarApunte') {
        document.getElementById('editable-title').innerText = event.data.titulo || '';
        document.getElementById('workspace').innerHTML = event.data.contenido_html || '';
        document.getElementById('workspace').dataset.id = event.data.idApuntes || '';
        // Si necesitas re-inicializar eventos en los bloques cargados, llama a tus funciones de inicialización aquí
        initImageClick('.portada', openImagePicker);
        initImageClick('.icono', openImagePicker);
        // ...otros inits si es necesario
    }
});

// Sincronizar al cargar
document.addEventListener('DOMContentLoaded', syncDarkMode);

document.getElementById('Guardar-apuntes').addEventListener('click', function() {
    const titulo = document.getElementById('editable-title').innerText.trim() || 'Sin título';
    const contenido_html = document.getElementById('workspace').innerHTML;
    const apunteId = document.getElementById('workspace').dataset.id;

    if (apunteId) {
        // ACTUALIZAR (PUT)
        fetch('../includes/apuntes.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                idApuntes: apunteId,
                titulo: titulo,
                contenido_html: contenido_html
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                alert('Apunte actualizado correctamente');
            } else {
                alert('Error al actualizar: ' + (data.error || ''));
            }
        })
        .catch(err => {
            alert('Error de red al actualizar');
        });
    } else {
        // CREAR NUEVO (POST)
        fetch('../includes/apuntes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                titulo: titulo,
                contenido_html: contenido_html
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                alert('Apunte guardado correctamente');
                // Opcional: guardar el nuevo id en el DOM
                // document.getElementById('workspace').dataset.id = data.idApuntes;
            } else {
                alert('Error al guardar: ' + (data.error || ''));
            }
        })
        .catch(err => {
            alert('Error de red al guardar');
        });
    }
});