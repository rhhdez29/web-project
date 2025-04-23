const menusItemsDropDown = document.querySelectorAll('.menu-item-dropdown');
const menusItemsStatic = document.querySelectorAll('.menu-item-static');
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menu-btn');

// Botón de minimizar
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('minimize');
});

// Manejo de submenús
menusItemsDropDown.forEach((menuItem) => {
    const subMenu = menuItem.querySelector('.sub-menu');

    // Abrir / cerrar submenú con click
    menuItem.addEventListener('click', (e) => {
        e.stopPropagation(); // evitar conflictos

        const isActive = menuItem.classList.toggle('sub-menu-toggle');

        if (isActive) {
            subMenu.style.height = `${subMenu.scrollHeight + 6}px`;
            subMenu.style.padding = '0.2rem 0';
        } else {
            subMenu.style.height = '0';
            subMenu.style.padding = '0';
        }

        // Cerrar otros submenús
        menusItemsDropDown.forEach((item) => {
            if (item !== menuItem) {
                const otherSubMenu = item.querySelector('.sub-menu');
                item.classList.remove('sub-menu-toggle');
                otherSubMenu.style.height = '0';
                otherSubMenu.style.padding = '0';
            }
        });
    });

    // 🧠 Manejar cierre diferido solo si el mouse realmente se va
    let timeout;

    menuItem.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            if (!menuItem.matches(':hover')) {
                menuItem.classList.remove('sub-menu-toggle');
                subMenu.style.height = '0';
                subMenu.style.padding = '0';
            }
        }, 200); // pequeña espera para permitir clics
    });

    menuItem.addEventListener('mouseenter', () => {
        clearTimeout(timeout); // si el mouse vuelve, cancela el cierre
    });
});

// Cierre de submenús desde ítems estáticos
menusItemsStatic.forEach((menuItem) => {
    menuItem.addEventListener('click', () => {
        if (sidebar.classList.contains('minimize')) return;

        menusItemsDropDown.forEach((item) => {
            const otherSubmenu = item.querySelector('.sub-menu');
            if (otherSubmenu) {
                item.classList.remove('sub-menu-toggle');
                otherSubmenu.style.height = '0';
                otherSubmenu.style.padding = '0';
            }
        });
    });
});
