  // Elementos principales
  const workspace = document.getElementById("workspace");
  const contextMenu = document.getElementById("context-menu");
  const addImageBtn = document.getElementById('add-image-btn');
  const contenedorPrincipal = document.getElementById("contenedor-bloques");

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

  function createNewBlock(type) {
    let element;
  
    switch (type) {
      case "text":
        element = createTextBlock();
        break;
      case "list":
        element = createListBlock();
        break;
      case "bullet":
        element = createBulletListBlock();
        break;
      case "heading":
        element = createHeadingBlock();
        break;
      case "hyperText":
        element = createHyperText();
        break;
      case "table":
        element = createTableBlock();
        break;
      default:
        return;
    }
  
    if (element) {
      if (type !== "image") {
        const menu = document.createElement("span");
        menu.className = "menu-button";
        menu.textContent = "⋮";
        element.insertBefore(menu, element.firstChild);
      }
  
      // Estilo normal, sin posición absoluta
      element.style.position = "relative";
  
      // Insertar al final (flujo vertical)
      workspace.appendChild(element);
    }
  }
  
  

// Función de inicialización
function initImage() {
  // Configurar event listeners
  function setupEventListeners() {
      addImageBtn.addEventListener('click', addNewImage);
  }
  
  // Añadir nueva imagen centrada
  function addNewImage() {
      const workspaceRect = workspace.getBoundingClientRect();
      const centerX = workspace.scrollLeft + workspaceRect.width / 2 - 150;
      const centerY = workspace.scrollTop + workspaceRect.height / 2 - 100;
      
      createResizableImage(centerX, centerY, workspace);
  }
  
  // Inicializar
  setupEventListeners();
}

function createResizableImage(x, y, container) {
  const imageContainer = document.createElement('div');
  imageContainer.className = 'resizable-image-container';
  imageContainer.style.left = `${x}px`;
  imageContainer.style.top = `${y}px`;
  imageContainer.style.width = '300px';
  imageContainer.style.height = '200px';
  
  // Crear elemento de imagen
  const img = document.createElement('img');
  img.className = 'resizable-image';
  img.src = '../assets/imagenes/elemento.svg'; // Imagen de ejemplo
  img.draggable = false;
  
  // Crear handles de redimensionamiento
  const handles = ['nw', 'ne', 'sw', 'se'].map(pos => {
      const handle = document.createElement('div');
      handle.className = `resize-handle handle-${pos}`;
      handle.dataset.position = pos;
      return handle;
  });
  
  // Añadir elementos al contenedor
  imageContainer.appendChild(img);
  handles.forEach(handle => imageContainer.appendChild(handle));
  container.appendChild(imageContainer);
  
  // Variables de estado
  let isDragging = false;
  let isResizing = false;
  let activeHandle = null;
  let startX, startY, startWidth, startHeight, startLeft, startTop;
  
  // Evento para comenzar interacción
  imageContainer.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('resize-handle')) {
          // Redimensionamiento
          isResizing = true;
          activeHandle = e.target;
          imageContainer.style.cursor = e.target.style.cursor;
      } else {
          // Arrastre
          isDragging = true;
          imageContainer.classList.add('dragging');
          imageContainer.style.cursor = 'grabbing';
      }
      
      // Guardar estado inicial
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(imageContainer.style.width);
      startHeight = parseInt(imageContainer.style.height);
      startLeft = parseInt(imageContainer.style.left);
      startTop = parseInt(imageContainer.style.top);
      
      e.preventDefault();
  });
  
  // Evento para mover
  document.addEventListener('mousemove', (e) => {
      if (!isDragging && !isResizing) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      if (isResizing && activeHandle) {
          // Lógica de redimensionamiento
          const position = activeHandle.dataset.position;
          const newWidth = startWidth + (position.includes('e') ? dx : -dx);
          const newHeight = startHeight + (position.includes('s') ? dy : -dy);
          
          // Aplicar límites mínimos
          imageContainer.style.width = `${Math.max(100, newWidth)}px`;
          imageContainer.style.height = `${Math.max(100, newHeight)}px`;
          
          // Ajustar posición para handles noroeste y suroeste
          if (position.includes('w')) {
              imageContainer.style.left = `${startLeft + dx}px`;
          }
          
          // Ajustar posición para handles noroeste y noreste
          if (position.includes('n')) {
              imageContainer.style.top = `${startTop + dy}px`;
          }
      } else if (isDragging) {
          // Lógica de arrastre
          imageContainer.style.left = `${startLeft + dx}px`;
          imageContainer.style.top = `${startTop + dy}px`;
      }
  });
  
  // Evento para finalizar interacción
  document.addEventListener('mouseup', () => {
      if (isDragging || isResizing) {
          isDragging = false;
          isResizing = false;
          activeHandle = null;
          imageContainer.classList.remove('dragging');
          imageContainer.style.cursor = 'grab';
      }
  });
  
  return imageContainer;
}

workspace.addEventListener('focusin', (e) => {
  const block = e.target;
  if (block.classList.contains('block') && block.isContentEditable) {
    if (block.innerText.trim() === 'Escribe aquí...') {
      block.innerHTML = ''; // Borra el placeholder al enfocarlo si todavía estaba
    }
  }
});

workspace.addEventListener('input', (e) => {
  const block = e.target;
  if (block.classList.contains('block') && block.isContentEditable) {
  // Si se borra todo y quedan <br>, limpiar para que ::before funcione
  if (block.innerHTML.trim() === '<br>' || block.innerHTML.trim() === '') {
    block.innerHTML = '';
  }
}
});

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

  function actualizarNumeracionInterna() {
    const items = listItemsWrapper.querySelectorAll(".list-item");
    items.forEach((item, index) => {
      const label = item.querySelector(".block-number");
      if (label) label.textContent = `${index + 1}.`;
    });
  }

  function createListItem(isFirst = false) {
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "content-block text-block-wrapper list-item";

    const bullet = document.createElement("span");
    bullet.className = "block-number";

    const block = document.createElement("div");
    block.className = "content-block listBlock";
    block.contentEditable = true;
    block.setAttribute("data-placeholder", "Escribe aquí...");

    const buttons = document.createElement("div");
    buttons.className = "block-buttons";

    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.onclick = () => {
      const newItem = createListItem();
      listItemsWrapper.insertBefore(newItem, itemWrapper.nextSibling);
      actualizarNumeracionInterna();
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "×";
    deleteButton.onclick = () => {
      const items = listItemsWrapper.querySelectorAll(".list-item");
      if (items.length > 1 && itemWrapper !== items[0]) {
        itemWrapper.remove();
        actualizarNumeracionInterna();
      }
    };

    if (isFirst) {
      deleteButton.disabled = true;
      deleteButton.style.opacity = 0.3;
      deleteButton.style.cursor = "not-allowed";
    }

    buttons.appendChild(addButton);
    buttons.appendChild(deleteButton);

    itemWrapper.appendChild(bullet);
    itemWrapper.appendChild(block);
    itemWrapper.appendChild(buttons);

    return itemWrapper;
  }

  // Agrega el primer ítem
  listItemsWrapper.appendChild(createListItem(true));
  actualizarNumeracionInterna(); // Numeración inicial

  container.appendChild(handle);
  container.appendChild(listItemsWrapper);

  return container;
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

  // Función para crear un ítem de lista individual
  function createListItem(isFirst=false) {
    const itemWrapper = document.createElement("div");
    itemWrapper.className = "content-block text-block-wrapper list-item";

    const bullet = document.createElement("span");
    bullet.className = "block-bullet";
    bullet.textContent = "•";

    const content = document.createElement("div");
    content.className = "content-block listBlock";
    content.contentEditable = true;
    content.setAttribute("data-placeholder", "Escribe aquí...");

    const buttons = document.createElement("div");
    buttons.className = "block-buttons";

    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.onclick = () => {
      const newItem = createListItem();
      listItemsWrapper.insertBefore(newItem, itemWrapper.nextSibling);
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "×";
    deleteButton.onclick = () => {
      const items = listItemsWrapper.querySelectorAll(".list-item");
      if (items.length > 1 && itemWrapper !== items[0]) {
        itemWrapper.remove();
      }
    };

    if (isFirst) {
      deleteButton.disabled = true;
      deleteButton.style.opacity = 0.3;
      deleteButton.style.cursor = "not-allowed";
    }

    buttons.appendChild(addButton);
    buttons.appendChild(deleteButton);

    itemWrapper.appendChild(bullet);
    itemWrapper.appendChild(content);
    itemWrapper.appendChild(buttons);

    return itemWrapper;
  }

  // Crear el primer ítem
  const firstItem = createListItem(true);
  listItemsWrapper.appendChild(firstItem);

  container.appendChild(handle);
  container.appendChild(listItemsWrapper);

  return container;
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

  const buttons = document.createElement("div");
  buttons.className = "block-buttons";

  const editButton = document.createElement("button");
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
    if (text.startsWith("http")) {
      block.classList.add("link");
      block.contentEditable = false;
    } else {
      block.classList.remove("link");
    }
  });

  // Click para abrir si es link
  block.addEventListener("click", () => {
    if (!block.isContentEditable && block.classList.contains("link")) {
      window.open(block.innerText.trim(), "_blank");
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

  const removeRowBtn = document.createElement("button");
  removeRowBtn.textContent = "− Fila";
  removeRowBtn.onclick = () => {
    if (table.rows.length > 2) {
      table.deleteRow(-1);
    }
  };

  const addColBtn = document.createElement("button");
  addColBtn.textContent = "+ Columna";
  addColBtn.onclick = () => {
    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].appendChild(createCell(i === 0));
    }
  };

  const removeColBtn = document.createElement("button");
  removeColBtn.textContent = "− Columna";
  removeColBtn.onclick = () => {
    const colCount = table.rows[0].cells.length;
    if (colCount > 1) {
      for (let row of table.rows) {
        row.deleteCell(-1);
      }
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







// Mostrar menú contextual
function showContextMenu(block, clientX = null, clientY = null) {
  if (!block) return; // Evita errores si no se pasó un bloque válido

  if (selectedBlock) selectedBlock.classList.remove("selected");

  selectedBlock = block;
  selectedBlock.classList.add("selected");

  const rect = selectedBlock.getBoundingClientRect();
  const workspaceRect = workspace.getBoundingClientRect();

  // Posicionar el menú contextual
  contextMenu.style.left = (clientX ? clientX - workspaceRect.left : rect.left - workspaceRect.left + 10) + "px";
  contextMenu.style.top = (clientY ? clientY - workspaceRect.top : rect.top - workspaceRect.top + selectedBlock.offsetHeight + 10) + "px";
  contextMenu.style.display = "flex";

  // Cargar estilos actuales del bloque
  updateContextMenuWithBlockStyles();
}

// Actualizar menú contextual con estilos del bloque
function updateContextMenuWithBlockStyles() {
  if (!selectedBlock) return;

  const computedStyles = getComputedStyle(selectedBlock);

  document.getElementById("font-select").value = selectedBlock.style.fontFamily || "Segoe UI";
  document.getElementById("font-size").value = parseInt(selectedBlock.style.fontSize) || 16;
  document.getElementById("text-color").value = rgbToHex(computedStyles.color);
  document.getElementById("bg-color").value = rgbToHex(computedStyles.backgroundColor);
}

// Inicializar interacción con bloques
function initBlockInteractions() {
  workspace.addEventListener("click", (e) => {
    let target = e.target;

    // Clic en los botones del menú o el handle del bloque
    if (target.classList.contains("menu-button") || target.classList.contains("block-handle")) {
      e.stopPropagation();
      const block = target.closest(".block");
      if (block) showContextMenu(block, e.clientX, e.clientY);
      return;
    }

    // Clic en cualquier bloque
    const block = target.closest(".block");
    if (block) {
      e.stopPropagation();
      showContextMenu(block, e.clientX, e.clientY);
    } else {
      // Clic fuera: cerrar menú
      closeContextMenu();
    }
  });

  // Cerrar menú si se hace clic fuera
  document.addEventListener("click", (e) => {
    if (!contextMenu.contains(e.target)) {
      closeContextMenu();
    }
  });

  // Estilos desde menú contextual
  document.getElementById("font-select").addEventListener("change", (e) => {
    if (selectedBlock) selectedBlock.style.fontFamily = e.target.value;
  });

  document.getElementById("font-size").addEventListener("input", (e) => {
    if (selectedBlock) selectedBlock.style.fontSize = e.target.value + "px";
  });

  document.getElementById("text-color").addEventListener("input", (e) => {
    if (selectedBlock) selectedBlock.style.color = e.target.value;
  });

  document.getElementById("bg-color").addEventListener("input", (e) => {
    if (selectedBlock) selectedBlock.style.backgroundColor = e.target.value;
  });

  // Eliminar bloque
  document.getElementById("delete-block").addEventListener("click", () => {
    if (selectedBlock) {
      const container = selectedBlock.closest(".block-container");
      if (container) {
        container.remove();
      } else {
        selectedBlock.remove();
      }
      closeContextMenu();
    }
  });
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
    
    // Manejar diferentes formatos (rgb(), rgba(), nombre de color)
    const tempElem = document.createElement("div");
    tempElem.style.color = rgb;
    document.body.appendChild(tempElem);
    const computedColor = getComputedStyle(tempElem).color;
    document.body.removeChild(tempElem);
    
    const result = computedColor.match(/\d+/g);
    if (!result || result.length < 3) return "#000000";
    
    return "#" + result.slice(0, 3)
      .map(x => (+x).toString(16).padStart(2, "0"))
      .join("");
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
  

  function initImageClick(selector, callback) {
    document.querySelectorAll(selector).forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation(); 
        callback(img);
      });
    });
  }

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
  
  
  // Inicializar la aplicación
  function init() {
    initToolDrag();
    initWorkspaceDrop();
    initBlockInteractions();
    initImageClick('.portada', openImagePicker);
    initImageClick('.icono', openImagePicker);
    initModal();
    initImage();
  }

  // Iniciar cuando el DOM esté listo
  document.addEventListener("DOMContentLoaded", init);
