  // Elementos principales
  const workspace = document.getElementById("workspace");
  const contextMenu = document.getElementById("context-menu");

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

  // Crear nuevo bloque según el tipo
  function createNewBlock(type, clientX, clientY) {
    const x = clientX - workspace.getBoundingClientRect().left + workspace.scrollLeft;
    const y = clientY - workspace.getBoundingClientRect().top + workspace.scrollTop;

    let element;

    switch (type) {
      case "text":
        element = createTextBlock();
        break;
      case "checklist":
        element = createChecklistBlock();
        break;
      case "image":
        element = createImageBlock(x, y);
        break;
      case "heading":
        element = createHeadingBlock();
        break;
      default:
        return;
    }

    if (element) {
      element.style.position = type === "image" ? "absolute" : "relative";
      
      if (type !== "image") {
        element.innerHTML = '<span class="menu-button">⋮</span>' + element.innerHTML;
      }
      
      workspace.appendChild(element);
    }
  }

  function createTextBlock() {
    const container = document.createElement("div");
    container.className = "block-container";
  
    const handle = document.createElement("div");
    handle.className = "block-handle";
    handle.innerHTML = "⋮";
    handle.addEventListener("click", (e) => {
      e.stopPropagation();
      showContextMenu(container.querySelector(".block"));
    });
  
    const block = document.createElement("div");
    block.className = "block";
    block.contentEditable = true;
    block.setAttribute('data-placeholder', 'Escribe aquí...'); // Placeholder visible cuando vacío
    block.innerHTML = ''; // Empieza vacío para que se vea el placeholder
  
  
    container.appendChild(handle);
    container.appendChild(block);
  
    return container;
  }

  
  workspace.addEventListener('focusin', (e) => {
    const block = e.target;
    if (block.classList.contains('block') && block.isContentEditable) {
      if (block.innerText.trim() === 'Escribe aquí...') {
        block.innerHTML = ''; // 🔥 Borra el placeholder al enfocarlo si todavía estaba
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
  
  
  

  // Crear bloque de checklist
  function createChecklistBlock() {
    const element = document.createElement("div");
    element.className = "block";
    
    for (let i = 0; i < 3; i++) {
      const item = document.createElement("div");
      item.className = "checklist-item";
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      
      const label = document.createElement("span");
      label.textContent = "Tarea " + (i + 1);
      label.contentEditable = true;
      
      item.appendChild(checkbox);
      item.appendChild(label);
      element.appendChild(item);
    }
    
    return element;
  }

  // Crear bloque de imagen
  function createImageBlock(x, y) {
    const element = document.createElement("img");
    element.src = "../assets/imagenes/elemento.svg";
    element.className = "draggable";
    element.style.left = x + "px";
    element.style.top = y + "px";
    element.style.width = "300px";
    element.style.height = "auto";
    element.draggable = false;
    element.style.borderRadius = "8px";

    // Hacer la imagen arrastrable
    let offsetX, offsetY;
    element.addEventListener("mousedown", e => {
      e.preventDefault();
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      
      const onMouseMove = ev => {
        element.style.left = (ev.pageX - workspace.getBoundingClientRect().left - offsetX + workspace.scrollLeft) + "px";
        element.style.top = (ev.pageY - workspace.getBoundingClientRect().top - offsetY + workspace.scrollTop) + "px";
      };
      
      document.addEventListener("mousemove", onMouseMove);
      
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
      }, { once: true });
    });

    return element;
  }

  // Crear bloque de título
  function createHeadingBlock() {
    const element = document.createElement("div");
    element.className = "block";
    element.contentEditable = true;
    element.style.fontSize = "24px";
    element.style.fontWeight = "bold";
    element.textContent = "Título";
    return element;
  }

  // Mostrar menú contextual
  function showContextMenu(block, clientX, clientY) {
    if (selectedBlock) selectedBlock.classList.remove("selected");

    selectedBlock = block;
    selectedBlock.classList.add("selected");

    const rect = selectedBlock.getBoundingClientRect();
    const workspaceRect = workspace.getBoundingClientRect();

    // Posicionar el menú contextual
    if (clientX && clientY) {
      contextMenu.style.left = (clientX - workspaceRect.left) + "px";
      contextMenu.style.top = (clientY - workspaceRect.top) + "px";
    } else {
      contextMenu.style.left = (rect.left - workspaceRect.left + 10) + "px";
      contextMenu.style.top = (rect.top - workspaceRect.top + selectedBlock.offsetHeight + 10) + "px";
    }
    
    contextMenu.style.display = "flex";

    // Cargar estilos actuales del bloque
    updateContextMenuWithBlockStyles();
  }

  // Actualizar menú contextual con estilos del bloque
  function updateContextMenuWithBlockStyles() {
    if (!selectedBlock) return;
    
    document.getElementById("font-select").value = 
      selectedBlock.style.fontFamily || "Segoe UI";
    
    document.getElementById("font-size").value = 
      parseInt(selectedBlock.style.fontSize) || 16;
    
    document.getElementById("text-color").value = 
      rgbToHex(getComputedStyle(selectedBlock).color);
    
    document.getElementById("bg-color").value = 
      rgbToHex(getComputedStyle(selectedBlock).backgroundColor);
  }

  // Inicializar interacción con bloques
  function initBlockInteractions() {
    workspace.addEventListener("click", e => {
      let target = e.target;

      // Si se hace clic en los controles de menú
      if (target.classList.contains("menu-button") || target.classList.contains("block-handle")) {
        e.stopPropagation();
        target = target.closest(".block") || target.parentElement.closest(".block");
        showContextMenu(target, e.clientX, e.clientY);
        return;
      }

      // Si el clic fue en un bloque
      if (target.classList.contains("block")) {
        e.stopPropagation();
        showContextMenu(target, e.clientX, e.clientY);
      } else {
        // Clic fuera de un bloque - cerrar menú
        closeContextMenu();
      }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!contextMenu.contains(e.target) && e.target !== openEmojiPickerBtn) {
        closeContextMenu();
      }
    });

    // Manejar cambios de estilo desde el menú contextual
    document.getElementById("font-select").addEventListener("change", e => {
      if (selectedBlock) selectedBlock.style.fontFamily = e.target.value;
    });

    document.getElementById("font-size").addEventListener("input", e => {
      if (selectedBlock) selectedBlock.style.fontSize = e.target.value + "px";
    });

    document.getElementById("text-color").addEventListener("input", e => {
      if (selectedBlock) selectedBlock.style.color = e.target.value;
    });

    document.getElementById("bg-color").addEventListener("input", e => {
      if (selectedBlock) selectedBlock.style.backgroundColor = e.target.value;
    });

    // Botón eliminar bloque
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
  
  function closeImagePicker() {
    document.getElementById("image-picker-modal").style.display = "none";
    document.getElementById("modal-overlay").style.display = "none";
  }
  

  function initImageClick(selector, callback) {
    document.querySelectorAll(selector).forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation(); 
        callback(img);
      });
    });
  }

  function initEditableTitle() {
    const title = document.getElementById('editable-title');
  
    title.addEventListener('focus', () => {
      if (title.innerText.trim() === '[Escribe tu título aquí]') {
        title.innerText = '';
      }
    });
  
    title.addEventListener('blur', () => {
      if (title.innerText.trim() === '') {
        title.innerText = '[Escribe tu título aquí]';
      }
    });
  }
  
  
  // Inicializar la aplicación
  function init() {
    initToolDrag();
    initWorkspaceDrop();
    initBlockInteractions();
    initEditableTitle();
    initImageClick('.portada', openImagePicker);
    initImageClick('.icono', openImagePicker);
  }

  // Iniciar cuando el DOM esté listo
  document.addEventListener("DOMContentLoaded", init);