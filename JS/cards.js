import { toggleVisibility , stopTimeControl, startUpdateTimeChart , popUp , sendWhatsApp } from "./utils.js";

const ordenesPendientesContainer = document.querySelector('#ordenesPendientesContainer');


export function loadOrders(section, array, titulo){

    section.innerText = "";

    const title = document.createElement('h2');
    title.classList.add('upper-title-cards-cardXs')
    title.innerText = titulo.toUpperCase();
    section.appendChild(title);
    
    for(let order of array){
        

        const cardXs = document.createElement('article');
        cardXs.classList.add('card-order-small');
        if((Date.now() - order.fecha) < 1200000 ){
            cardXs.classList.add('background-white')
        }else if((Date.now() - order.fecha) < 2400000 ){
            cardXs.classList.add('background-orange')
        }else{
            cardXs.classList.add('background-red')            
        };
        cardXs.setAttribute('id',`cardOrderSmall${array.indexOf(order)}`);

        cardXs.addEventListener('click',function(){
            loadChart(order);
            toggleVisibility(sectionPendingOrders);
            toggleVisibility(chartCard);
            
            
        });

        const orderSmallData = document.createElement('div');
        orderSmallData.classList.add('order-small-data');

        const textCliente = document.createElement('div');
        textCliente.classList.add('card-order-small-cliente');
        textCliente.innerText = order.nombre;

        const idClient = document.createElement('span');
        idClient.classList.add('card-order-small-id');
        idClient.innerText = order.tel;


        const listContainer = document.createElement('div');
        listContainer.classList.add('order-small-list-container');

        const ul = document.createElement('ul');
                            let tortu = 0;
                            let burger = 0;
                        for (const item of order.items) {
                            if(item.familia =='Hamburguesas'){
                                burger++;
                            }else if(item.familia =='Tortugones'){
                                tortu++;
                            }
                        }
                        if(tortu){
                            const liTortu = document.createElement('li');
                            liTortu.innerText = `Tortugones: ${tortu}`
                            ul.appendChild(liTortu);
                        }
                        if(burger){
                            const liBurger = document.createElement('li');
                            liBurger.innerText = `Hamburguesas: ${burger}`
                            ul.appendChild(liBurger);
                        }
        
        const timeContainer = document.createElement('div');
        timeContainer.classList.add('order-small-time-container');

        const delayedTime = document.createElement('span');
        delayedTime.classList.add('order-small-delayed-time');
        delayedTime.setAttribute('id',`delayedTime${array.indexOf(order)}`)
        delayedTime.innerText = parseInt((Date.now() - order.fecha) / 60000);

        const spanMin = document.createElement('span');
        spanMin.innerText = 'min'

        listContainer.appendChild(ul);
        timeContainer.appendChild(delayedTime);
        timeContainer.appendChild(spanMin);

        orderSmallData.appendChild(textCliente);
        orderSmallData.appendChild(idClient);
        orderSmallData.appendChild(listContainer);

        cardXs.append(orderSmallData,timeContainer);

        section.appendChild(cardXs);
    }
}

let currentOrder ={};



const chart_clientData = document.querySelector('#chart_clientData');
const chart_textCliente = document.querySelector('#chartClientName');
const chart_idClient = document.querySelector('#chartClientTel');
chart_idClient.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.nombre}`,sendWhatsApp , currentOrder.tel);
})
const chart_listItems = document.querySelector('#chart_listItems');
const chart_delayedTime = document.querySelector('#chart_delayedTime');

const options_clientData = document.querySelector('#options_clientData');
const options_textClient = document.querySelector('#options_textClient');
const options_idClient = document.querySelector('#options_idClient');
options_idClient.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.nombre}`,sendWhatsApp , currentOrder.tel);
})
const options_listItems = document.querySelector('#options_listItems');
const options_delayedTime = document.querySelector('#options_delayedTime');

const options_itemsScrollX = document.querySelector('#options_itemsScrollX');



export function loadChart(order){
    currentOrder= {};
    currentOrder = order;

    startUpdateTimeChart(order);    
        

        chart_idClient.innerText= order.tel;
        chart_textCliente.innerText= order.nombre;
        options_idClient.innerText= order.tel;
        options_textClient.innerText= order.nombre;

       
        

        
    
        chart_listItems.innerText= "";
        options_listItems.innerText= "";
                            let tortu = 0;
                            let burger = 0;
                        for (const item of order.items) {
                            if(item.familia =='Hamburguesas'){
                                burger++;
                            }else if(item.familia =='Tortugones'){
                                tortu++;
                            }
                        };
                        if(tortu){
                            const liTortu = document.createElement('li');
                            liTortu.innerText = `Tortugones: ${tortu}`
                            chart_listItems.appendChild(liTortu.cloneNode(true));
                            options_listItems.appendChild(liTortu.cloneNode(true));
                        };
                        if(burger){
                            const liBurger = document.createElement('li');
                            liBurger.innerText = `Hamburguesas: ${burger}`
                            chart_listItems.appendChild(liBurger.cloneNode(true));
                            options_listItems.appendChild(liBurger.cloneNode(true));
                        };

        const delayedTime = parseInt((Date.now() - order.fecha) / 60000);
        chart_delayedTime.innerText =delayedTime;
        options_delayedTime.innerText =delayedTime;

       
        if(delayedTime < 20 ){
            chart_clientData.classList.remove('background-orange')
            options_clientData.classList.remove('background-orange')
            chart_clientData.classList.remove('background-red')
            options_clientData.classList.remove('background-red')
            chart_clientData.classList.add('background-white')
            options_clientData.classList.add('background-white')
        }else if(delayedTime < 40 ){
          
           chart_clientData.classList.remove('background-white')
           options_clientData.classList.remove('background-white')
           chart_clientData.classList.remove('background-red')
           options_clientData.classList.remove('background-red')
            chart_clientData.classList.add('background-orange')
            options_clientData.classList.add('background-orange')
          }else{
            chart_clientData.classList.remove('background-white')
            options_clientData.classList.remove('background-white')
            chart_clientData.classList.remove('background-orange')
            options_clientData.classList.remove('background-orange')
            chart_clientData.classList.add('background-red')            
            options_clientData.classList.add('background-red')            
        };

    const chartItemsContainer = document.querySelector('#chartItemsContainer');  
    
    chartItemsContainer.innerText= "";

    
    for(let product of order.items){

        const cardXs = document.createElement('article');
        cardXs.classList.add('card-small');

        const internalContainer = document.createElement('div');
        internalContainer.classList.add('card-small-internalContainer');
        internalContainer.addEventListener('click',function(){
            loadOptions(options_itemsScrollX);
            toggleVisibility(chartCard);
            toggleVisibility(sectionOptions);   

            
        });

        const tittle = document.createElement('h3');
        tittle.classList.add('card-small-tittle');
        tittle.innerText = product.nombre;        

        const precio = document.createElement('span');
        precio.classList.add('card-small-precio');
        precio.innerText = `$${product.precio}`;


        internalContainer.appendChild(tittle);
        
        internalContainer.appendChild(precio);

        cardXs.appendChild(internalContainer);


        chartItemsContainer.appendChild(cardXs);

    }
}


function loadOptions(section){
    section.innerText= '';
    
    for (const item of currentOrder.items) {

        const card = document.createElement('div');
        card.classList.add('section-items-options-card');
        
        const tittle = document.createElement('h4');
        tittle.classList.add('options-item-name');
        tittle.innerText = item.nombre;

        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('section-items-options-container');

        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add('chart-items-options-container-cards');

        for (const gusto of item.ingredientesOpcionales) {
            const CardPrueba = document.createElement('div');
            CardPrueba.classList.add('card-prueba')
            CardPrueba.innerText = 'prueba';  
            cardsContainer.appendChild(CardPrueba);          
        }

        itemsContainer.appendChild(cardsContainer);

        card.appendChild(tittle);
        card.appendChild(itemsContainer);

        section.appendChild(card);


        
            
        }  

    }
