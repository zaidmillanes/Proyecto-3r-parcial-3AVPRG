let productos = [];

window.addEventListener('DOMContentLoaded', cargarProductos);

async function cargarProductos() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        productos = data.productos;
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos(productosAMostrar) {
    const contenedor = document.getElementById('listaProductos');
    contenedor.innerHTML = '';

    productosAMostrar.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>Precio: $${producto.precio}</p>
                <p>Categoría: ${producto.categoria}</p>
            </div>
            <div class="product-actions">
                <button class="edit-btn" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="delete-btn" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

document.getElementById('productoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const producto = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        categoria: document.getElementById('categoria').value
    };

    const editando = document.getElementById('editando').value === 'true';

    if (editando) {
        producto.id = parseInt(document.getElementById('editando').getAttribute('data-id'));
        actualizarProducto(producto);
    } else {
        producto.id = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        agregarProducto(producto);
    }

    e.target.reset();
    document.getElementById('editando').value = 'false';
});

function agregarProducto(producto) {
    productos.push(producto);
    guardarCambios();
    mostrarProductos(productos);
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('categoria').value = producto.categoria;

        document.getElementById('editando').value = 'true';
        document.getElementById('editando').setAttribute('data-id', id);
    }
}

function actualizarProducto(productoActualizado) {
    const index = productos.findIndex(p => p.id === productoActualizado.id);
    if (index !== -1) {
        productos[index] = productoActualizado;
        guardarCambios();
        mostrarProductos(productos);
    }
}

function eliminarProducto() {
    const productoIDEliminar = document.getElementById("productoIDEliminar").value;

    if (!productoIDEliminar) {
        alert("Por favor, ingresa el ID del producto.");
        return;
    }


    fetch(`/eliminar-producto/${productoIDEliminar}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                alert("Producto eliminado correctamente.");

            } else {
                alert("No se pudo eliminar el producto.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar el producto:", error);
            alert("Hubo un problema al intentar eliminar el producto.");
        });
}


function buscarProducto() {
    const busqueda = document.getElementById('busqueda').value.toLowerCase();
    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.descripcion.toLowerCase().includes(busqueda) ||
        p.categoria.toLowerCase().includes(busqueda)
    );
    mostrarProductos(productosFiltrados);
}

function ordenarProductos() {
    const criterio = document.getElementById('ordenamiento').value;
    const productosOrdenados = [...productos];

    switch (criterio) {
        case 'nombre-asc':
            productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nombre-desc':
            productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        case 'precio-asc':
            productosOrdenados.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosOrdenados.sort((a, b) => b.precio - a.precio);
            break;
    }

    mostrarProductos(productosOrdenados);
}

async function guardarCambios() {
    try {
        const response = await fetch('data.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productos: productos })
        });

        if (!response.ok) {
            throw new Error('Error al guardar los cambios');
        }
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios. Por favor, intenta de nuevo.');
    }
}