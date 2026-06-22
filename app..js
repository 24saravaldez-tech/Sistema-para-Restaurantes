const estados = {
    'Ocupada': 'Ocupada',
    'Libre': 'Libre',
    'Pendiente': 'Pendiente de Pago'
}



class Producto {
    #id;
    #nombre;
    #precio;
    #imagen

    constructor(nombre, precio, imagen) {
        this.#nombre = nombre
        this.#precio = precio
        this.#id = Date.now() + Math.ceil(Math.random() * 1000)
        this.#imagen = imagen
    }



    get nombre() {
        return this.#nombre
    }

    get precio() {
        return this.#precio;
    }

    get id() {
        return this.#id
    }

    get imagen() {
        return this.#imagen
    }

    notificarAEstacion() {
        console.log("Enviar a Cocina")
    }
}



class BebidaCaliente extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Caliente'
    }
}

class BebidaFria extends Producto {
    #tipo;
    constructor() {
        this.#tipo = 'Bebida Fria'
    }

    notificarAEstacion() {
        console.log("Enviar al Bar")
    }
}

class Mesa {
    #nombre;
    #estado;
    #comandas;
    #total;
    #personas;
    #id;
    #mesasUnidas;

    constructor(nombre, personas) {
        this.#nombre = nombre
        this.#estado = 'Libre'
        this.#personas = personas
        this.#total = 0
        this.#comandas = []
        this.#mesasUnidas = []
        this.#id = Math.ceil(Math.random() * 1000) + Date.now()
    }

    get nombre() {
        return this.#nombre;
    }

    get estado() {
        return this.#estado;
    }

    get id() {
        return this.#id;
    }

    get personas() {
        return this.#personas
    }

    get mesasUnidas() {
        return this.#mesasUnidas
    }

    get comandas() {
        return this.#comandas
    }


    cobrarMesa() {
        this.#cambiarEstado(estados.Libre)
        this.#mesasUnidas = []
    }

    #cambiarEstado(estado) {
        if (estados[estado] != undefined) {
            this.#estado = estado
        } else {
            throw new Error('Estado no Autorizado')
        }

    }

    ingresarComanda(comanda) {

        this.#comandas = [...this.#comandas, comanda]
    }

    eliminarComanda() {
        this.#comandas.pop()
    }

    aperturarMesa() {
        this.#cambiarEstado(estados.Ocupada)
    }

    muestrame() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`

        mesaDetalleInfo.innerHTML = `<p><strong>Mesa:</strong> ${this.nombre.split(' ')[1]} </p>
            <p><strong>Capacidad:</strong> ${this.personas} comensales</p>`
        estadoMesa.innerHTML = this.estado
        estadoMesa.className = `mesa-estado ${this.estado.toLowerCase()}`

        panelComanda.classList.remove('d-none')
        mesaDetalle.classList.remove('d-none')
        tablaWrap.classList.add('d-none')
        totales.classList.add('d-none')
        acciones.classList.add('d-none')

        botonUnirMesa.setAttribute('data-id', this.id)
    }

    mostrarCuenta() {
        tituloMesa.innerHTML = `<i class="fa-solid fa-ticket" aria-hidden="true"></i> Comanda ${this.nombre}`

        mesaDetalle.classList.add('d-none')
        tablaWrap.classList.remove('d-none')
        totales.classList.remove('d-none')
        acciones.classList.remove('d-none')
    }

    unirme(ids) {
        this.#mesasUnidas = [...this.#mesasUnidas, ids]
        let mesaQueEstoyUniendo = restaurante.mesas.find(mesa => mesa.id == ids)

        if (!mesaQueEstoyUniendo.mesasUnidas.includes(this.id)) {
            mesaQueEstoyUniendo.unirme(this.id)
        }
    }
}

class Restaurante {
    #nombre;
    #mesasNo;
    #mesas;

    constructor(nombre, mesas) {
        this.#mesasNo = mesas;
        this.#nombre = nombre;
        this.#mesas = this.crearMesas()
    }

    crearMesas() {
        let mesas = []
        for (let i = 1; i <= this.#mesasNo; i++) {
            mesas.push(new Mesa(`Mesa ${i}`, 4))
        }

        return mesas
    }

    get mesasNo() {
        return this.#mesasNo;
    }

    get mesas() {
        return this.#mesas;
    }

    normalizeMesasHTML() {
        let html = ''
        for (let item of this.#mesas) {
            html += `<article data-id=${item.id} class="mesa-card ${item.estado.toLowerCase()}">
                    <h3 data-id=${item.id}>${item.nombre}</h3>
                    <p data-id=${item.id}><span class="dot"></span> ${item.estado}</p>
            </article>`
        }
        return html;
    }
}

class Pedido {
    #cantidad
    #subtotal
    #nombre
    #precio

    constructor(cantidad, nombre, precio) {
        this.#cantidad = cantidad
        this.#nombre = nombre
        this.#precio = precio
    }

    get cantidad() {
        return this.#cantidad
    }

    set cantidad(value) {
        this.#cantidad = value
    }

    get nombre() {
        return this.#nombre
    }

    get precio() {
        return this.#precio
    }

    get subtotal() {
        this.#subtotal = this.#cantidad * this.#precio
        return this.#subtotal
    }
}

class Comanda {
    #pedidos;
    #mesas;
    #impuestos;
    #estados;

    constructor(mesa) { //mesas sera un arreglo
        this.#pedidos = []
        this.#mesas = mesa
        this.#estados = 'Pendiente'
    }

    get subTotal() {
        return this.#pedidos.reduce((acumulador, acrual) => acumulador + parseFloat(acrual.subtotal), 0)
    }

    get pedidos() {
        return this.#pedidos
    }

    agregarPedido(pedido) {
        let pedidoEncontrar = this.#pedidos.find(item => item.nombre == pedido.nombre)
        if (pedidoEncontrar == undefined) {
            this.#pedidos = [...this.#pedidos, pedido]
        } else {
            pedidoEncontrar.cantidad++
        }

    }

    agregarMesa(mesa) {
        this.#mesas = [...this.#mesas, mesa]
    }

    renderizar() {
        let html = ''
        for (let pedido of this.#pedidos) {
            html += `              
            <tr>
                <td>${pedido.cantidad}</td>
                <td>${pedido.nombre}</td>
                <td>${pedido.precio.toFixed(2)}</td>
                <td>${pedido.subtotal.toFixed(2)}</td>
              </tr>`
        }
        let subto = this.subTotal
        let impues = this.subTotal * 0.05
        let totalito = (subto + impues).toFixed(2)

        tablaPedido.innerHTML = html
        subtotal.textContent = subto.toFixed(2)
        impuestos.textContent = impues.toFixed(2)
        total.textContent = totalito

    }

    cobrar() {
        this.#estados = 'Preparando';
        tablaPedido.innerHTML = '';
        subtotal.textContent = '00.00'
        impuestos.textContent = '00.00'
        total.textContent = '00.00'

        alert('Comanda enviada')
    }
}

//objetos
const restaurante = new Restaurante('El gordo', 8)
const productos = [
    new Producto('Cafe Latte', 25, './img/cafe-late.jpeg'),
    new Producto('Cafe Helado', 20, './img/cafe-helado.jpeg'),
    new Producto('Hamburguesa', 35, './img/hamburguesa.jpeg'),
    new Producto('Pasta Italiana', 45, './img/pasta-italiana.jpeg'),
    new Producto('Helado de menta', 10, './img/helado-menta.jpeg'),
    new Producto('Ensalada variada', 32, './img/ensalada.jpeg'),
    new Producto('Parrillada de Pollo Asado', 50, './img/parrillada.jpeg'),
    new Producto('Cheescake', 23, './img/cheesecake.jpeg'),
    new Producto('Frappe de Chocolate', 18, './img/frappe-chocolate.jpg'),
    new Producto('Fresas con crema', 31, './img/fresas-crema.jpeg'),
    new Producto('Cappuccino doble', 25, './img/capuccino.webp'),
    new Producto('Salchipapa', 30, './img/salchipapa.jpeg')
]



///DOM
let contenedorMesas = document.querySelector('.mesas-grid')
let contenedorNoMesas = document.querySelector('.badge')
let cantidadProductos = document.querySelector('#cantidad-productos')
let tituloMesa = document.querySelector('#tituloMesa')
let mesaDetalleInfo = document.querySelector('.mesa-detalle-info')
let estadoMesa = document.querySelector('.mesa-estado')
let panelComanda = document.querySelector('.panel-comanda')
let detalleMesaAcciones = document.querySelector('.mesa-detalle-acciones')
let botonUnirMesa = document.querySelector('.unir-mesa')
let tablaWrap = document.querySelector('.tabla-wrap')
let mesaDetalle = document.querySelector('.mesa-detalle')
let totales = document.querySelector('.totales')
let acciones = document.querySelector('.acciones')
let menuGrid = document.querySelector('.menu-grid')

let subtotal = document.querySelector('#subtotal')
let impuestos = document.querySelector('#impuestos')
let total = document.querySelector('#Total')
let tablaPedido = document.querySelector('#tabla-pedido')
let btnCobrar = document.querySelector('.cobrar')
let btnFinalizar = document.querySelector('.cerrar')
let btnAbrir = document.querySelector('.abrir-cuenta')

contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
contenedorNoMesas.textContent = `${restaurante.mesasNo} Mesas`
cantidadProductos.textContent = `${productos.length} productos`
let mesaActualSeleccionada;
let mesaSeleccionada;
let modoSeleccion = false

//btnAbrir.disabled = false


let btnEvento = (event) => {

    mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)

    if (!event.target.className.includes('mesas-grid')) {

        if (mesaActualSeleccionada != undefined) {
            mesaActualSeleccionada.style = ''
        }
        event.target.style = 'background: green'

        if (mesaSeleccionada.estado == estados.Libre) {
            mesaSeleccionada.muestrame()
            btnCobrar.classList.remove('cobrar')
            btnCobrar.disabled = true

        } else {
            if (mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].pedidos.length > 0) {
                btnCobrar.disabled = false;
            } else {
                btnCobrar.disabled = true;
            }
            mesaSeleccionada.mostrarCuenta()
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()

            if (mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].pedidos.length == 0) {
                btnFinalizar.disabled = false
            } else {
                btnFinalizar.disabled = true
            }
        }
        mesaActualSeleccionada = event.target

        if (panelComanda.classList.contains('d-none')) {
            panelComanda.classList.remove('d-none')
        }
    }

}

let btnEventoRojo = (event) => {
    let mesaActualSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)

    if (mesaActualSeleccionada.estado != estados.Ocupada && modoSeleccion) {

        if (!event.target.className.includes('mesas-grid')) {
            event.target.style = 'background-color: red'
            mesaSeleccionada.unirme(event.target.dataset.id)
        }

    } else {
        alert('Seleccione una mesa libre')
    }

}

contenedorMesas.addEventListener('click', btnEvento)

let click = false;

botonUnirMesa.addEventListener('click', (event) => {
    //  btnAbrir.disabled = true
    contenedorMesas.removeEventListener('click', btnEvento)
    contenedorMesas.addEventListener('click', btnEventoRojo)


    if (click) {
        modoSeleccion = false
        let comandaObjeto = new Comanda([mesaSeleccionada.id])

        for (let i = 0; i < mesaSeleccionada.mesasUnidas.length; i++) {

            let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])

            mesaAUnir.aperturarMesa();
            comandaObjeto.agregarMesa(mesaAUnir.id)
            mesaAUnir.ingresarComanda(comandaObjeto)
        }

        mesaSeleccionada.aperturarMesa();
        mesaSeleccionada.ingresarComanda(comandaObjeto)
        contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()

        botonUnirMesa.textContent = 'Seleccionar Mesas'
        click = false
        contenedorMesas.removeEventListener('click', btnEventoRojo)
        contenedorMesas.addEventListener('click', btnEvento)
        mesaSeleccionada.mostrarCuenta()
        comandaObjeto.renderizar();
        btnAbrir.disabled = false
    } else {
        modoSeleccion = true
        btnAbrir.disabled = true
        botonUnirMesa.textContent = "Unir Mesas"
        botonUnirMesa.style = 'background-color: skyblue'
        //Mesa2
        mesaSeleccionada = restaurante.mesas.find(item => item.id == event.target.dataset.id)
        click = true
    }

})


let productosHtml = ''

for (let producto of productos) {
    productosHtml += `
<article class="producto-card">
    <img src="${producto.imagen}"
            alt="${producto.nombre}" />
    <div class="producto-info">
        <h3>${producto.nombre}</h3>
        <p class="categoria comida"><i class="fa-solid fa-utensils"></i> Comida</p>
        <p class="precio">Q${producto.precio}</p>
        <button data-id= ${producto.id} type="button">Agregar</button>
    </div>
</article>`
}

menuGrid.innerHTML = productosHtml

menuGrid.addEventListener('click', (event) => {

    if (event.target.type == 'button') {
        btnCobrar.disabled = false
        btnFinalizar.disabled = true

        //buscar btn
        let producto = productos.find(item => item.id == event.target.dataset.id)

        //Crear el pedido
        const pedido = new Pedido(1, producto.nombre, producto.precio)

        if (mesaSeleccionada && mesaSeleccionada.comandas.length > 0) {

            //Agregar el pedido ala comanda
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].agregarPedido(pedido)
            console.log(mesaSeleccionada)

            //Dibujar visualmente la comanda
            mesaSeleccionada.comandas[mesaSeleccionada.comandas.length - 1].renderizar()

        } else {
            alert('Aperture una mesa antes de iniciar')
        }

        //  btnFinalizar.disabled = true
    }
})

btnCobrar.addEventListener('click', () => {
    let cambianoMesaPrincipal = mesaSeleccionada;
    //cuando sellecionan una mesa secundaria, voy a buscar la principal
    if (mesaSeleccionada.mesasUnidas.length == 1) {
        cambianoMesaPrincipal = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[0])
    }


    const nuevaComanda = new Comanda([cambianoMesaPrincipal.id])

    for (let i = 0; i < cambianoMesaPrincipal.mesasUnidas.length - 1; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[i])
        mesaAUnir.ingresarComanda(nuevaComanda)
    }
    mesaSeleccionada.ingresarComanda(nuevaComanda)

    if (cambianoMesaPrincipal.comandas[cambianoMesaPrincipal.comandas.length - 1].pedidos.length == 0) {
        btnFinalizar.disabled = false
    } else {
        btnFinalizar.disabled = true
    }

    cambianoMesaPrincipal.comandas[cambianoMesaPrincipal.comandas.length - 1].cobrar()
    btnCobrar.disabled = true
})

btnFinalizar.addEventListener('click', () => {
    let cambianoMesaPrincipal = mesaSeleccionada;
    //cuando sellecionan una mesa secundaria, voy a buscar la principal
    if (mesaSeleccionada.mesasUnidas.length == 1) {
        cambianoMesaPrincipal = restaurante.mesas.find(item => item.id == mesaSeleccionada.mesasUnidas[0])
    }

    for (let i = 0; i < cambianoMesaPrincipal.mesasUnidas.length; i++) {
        let mesaAUnir = restaurante.mesas.find(item => item.id == cambianoMesaPrincipal.mesasUnidas[i])
        mesaAUnir.cobrarMesa()
    }
    cambianoMesaPrincipal.cobrarMesa()
    cambianoMesaPrincipal.eliminarComanda()
    contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
    panelComanda.classList.add('d-none')
})

btnAbrir.addEventListener('click', () => {
    mesaSeleccionada.aperturarMesa()
    let comandaObjeto = new Comanda([mesaSeleccionada.id])
    comandaObjeto.agregarMesa(mesaSeleccionada.id)
    mesaSeleccionada.ingresarComanda(comandaObjeto)
    contenedorMesas.innerHTML = restaurante.normalizeMesasHTML()
    mesaSeleccionada.mostrarCuenta()
    comandaObjeto.renderizar()
})