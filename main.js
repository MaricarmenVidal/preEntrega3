let platosPedidos=[]
let total=0
const cards = document.querySelector(".cards")
const card = document.querySelectorAll(".card")
const filterBotones =document.querySelectorAll(".filtrado")
const pedido=document.querySelector('.pedido')
const DOMpedido = document.querySelector('#lista-pedido');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');

const miLocalStorage = window.localStorage


function Plato(id, nombre, descripcion, precio, categoria, image){
    this.id=id
    this.nombre = nombre,
    this.descripcion = descripcion,
    this.precio = precio,
    this.categoria = categoria,
    this.image=image
}

const menestron=new Plato (1, "Menestrón", "Una sopa de menestras acompañadas de una buena porción de carne de res, a la que se incorpora la misma salsa de los también famosos tallarines verdes.", 6, "entrada", "images/menestron.jpg")
const sopa_minuta=new Plato (2, "Sopa a la Minuta", "Una sopa reconfortante a base de carne de res y tomate con papa y fideo cabello de ángel.", 5, "entrada", "images/sopa_a_la_minuta.PNG")
const lomo_saltado=new Plato (3, "Lomo Saltado", "Jugosos trozos de lomo al wok, servidos con cebolla, tomate, papas fritas y arroz blanco.", 18, "plato-fondo", "images/lomo_saltado.jpg")
const tallarin_saltado = new Plato (4,"Tallarín Saltado", "Plato típico de la gastronomía peruana, propio de la cocina chifa con pollo, ají amarillo, cebolla china y tomates salteados al wok.", 17, "plato-fondo", "images/tallarin_saltado.jpg")
const mazamorra_morada =new Plato(5, "Mazamorra Morada", "Postre típico de nuestra gastronomía elaborado a base de maíz morado concentrado con fécula.", 2, "postre", "images/mazamorra_morada.jpeg")
const arroz_con_leche =new Plato(6, "Arroz con Leche", "Postre típico de nuestra gastronomía elaborado a base de arroz cocido en leche con azúcar y canela, servido con una pizca de canela en polvo y leche condesada", 3, "postre", "images/arroz_con_leche.jpg")
const chicha_morada=new Plato(7, "Chicha Morada", "Concentrado de maíz morado, piña, manzana, membrillo, clavo de olor, canela y aceite esencial de limón", 7, "bebida", "images/chicha-morada.jpg")
const limonada_tropical=new Plato (8, "Limonada Tropical", "Fresa, piña golden y zumo de limón", 6, "bebida", "images/limonada-tropical.jpg")

const platos = [menestron, sopa_minuta, lomo_saltado, tallarin_saltado, mazamorra_morada, arroz_con_leche, chicha_morada, limonada_tropical]



window.addEventListener("DOMContentLoaded", ()=>{
    displayMenuItems(platos)
})

filterBotones.forEach(function(btn){
    btn.addEventListener('click', (evt)=>{
        const categoria=evt.currentTarget.dataset.id;
        const categoriaMenu = platos.filter(function(menuItems){
            if (menuItems.categoria==categoria){
                return menuItems
            }
            
        })
        if (categoria=="todo"){
            displayMenuItems(platos)
        }else{
            displayMenuItems(categoriaMenu)
        }
    })
})

function displayMenuItems(menuItems){
    let displayMenu = menuItems.map (item=>{
        return  `
        <article class="card individual-card ${item.categoria}" style="width: 18rem;">
            <img src="${item.image}" class="card-img-top" alt="${item.nombre}"/>
            <div class="card-body">
                <h5 class="card-title card-titulo">${item.nombre}</h5>
                <p class="card-texto">${item.descripcion}</p>
                <p class="card-texto"> Precio <span>S/. ${item.precio}.00</span> </p>
                <a href="#" class="btn btn-primary boton-agregar" data-id=${item.id}>Pedir</a>
            </div>
        </article> `
    })
    displayMenu=displayMenu.join("")
    cards.innerHTML=displayMenu
}

cards.addEventListener('click', agregarProductos)

function agregarProductos(evt){
    evt.preventDefault()
    if(evt.target.classList.contains('boton-agregar')){
        platosPedidos.push(evt.target.getAttribute('data-id'))
        calcularTotal();
        renderizarCarrito();
        guardarPedidoEnLocalStorage();
        displayMenuItems(platos)
    }
}

function renderizarCarrito() {
    cards.textContent = '';
    while(DOMpedido.firstChild) {
        DOMpedido.removeChild(DOMpedido.firstChild)
    }
    const carritoSinDuplicados = [...new Set(platosPedidos)];
    carritoSinDuplicados.forEach((item) => {
        const miItem = platos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        const numeroUnidadesItem = platosPedidos.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2',`${miItem[0].id}`);
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - S/. ${miItem[0].precio}`;
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5', `${miItem[0].id}`);
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemPedido);
        miNodo.appendChild(miBoton);
        DOMpedido.appendChild(miNodo);
    });
}


function borrarItemPedido(evt) {
    evt.preventDefault();
    displayMenuItems(platos)
    console.log(evt.target.parentElement)

    if(evt.target.classList.contains('btn-danger')){

        const id = evt.target.dataset.item

        platosPedidos = platosPedidos.filter((pedidoId) => {
            return pedidoId !== id;
        });
    

    renderizarCarrito();
    calcularTotal();
    guardarPedidoEnLocalStorage();
    }

}

function calcularTotal() {
    total = 0;
    platosPedidos.forEach((item) => {
        const miItem = platos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        total = total + miItem[0].precio;
    });
    DOMtotal.textContent = total.toFixed(2);
}


function vaciarCarrito() {
    platosPedidos = [];
    renderizarCarrito();
    calcularTotal();
    localStorage.clear();
    displayMenuItems(platos)
    DOMpedido.textContent = '';

}

function guardarPedidoEnLocalStorage () {
    miLocalStorage.setItem('pedido', JSON.stringify(platosPedidos));
}

function cargarPedidoDeLocalStorage () {
    if (miLocalStorage.getItem('pedido') !== null) {

        platosPedidos = JSON.parse(miLocalStorage.getItem('pedido'));
    }
}

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);

// Inicio
cargarPedidoDeLocalStorage();
calcularTotal();
renderizarCarrito();

