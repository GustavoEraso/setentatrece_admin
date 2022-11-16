import { statusSection } from "./index.js";
import { setMap } from "./map.js";
import { toggleVisibility , stopTimeControl, startUpdateTimeChart , popUp , sendWhatsApp } from "./utils.js";

const ordenesPendientesContainer = document.querySelector('#ordenesPendientesContainer');


export function loadOrders(section, array, title){

    section.innerText = "";

    const upperTitle = document.createElement('h2');
    upperTitle.classList.add('upper-title-cards-cardXs')
    upperTitle.innerText = title.toUpperCase();
    section.appendChild(upperTitle);
    
    for(let order of array){        

        const cardXs = document.createElement('article');
        cardXs.classList.add('info-card');
        if((Date.now() - order.date) < 1200000 ){
            cardXs.classList.add('background-white')
        }else if((Date.now() - order.date) < 2400000 ){
            cardXs.classList.add('background-orange')
        }else{
            cardXs.classList.add('background-red')            
        };
        cardXs.setAttribute('id',`cardOrderSmall${array.indexOf(order)}`);

        cardXs.addEventListener('click',function(){
            loadChart(order);
            toggleVisibility(sectionPendingOrders);
            switch (statusSection) {
                case 'pending-orders':
                    toggleVisibility(cartCard);
                    break;
                case 'delivery-orders':
                    toggleVisibility(deliveryCard);
                    break;
            
            }



            
            
            
        });

        const orderSmallData = document.createElement('div');
        orderSmallData.classList.add('info-card__data-container');

        const textCliente = document.createElement('div');
        textCliente.classList.add('info-card__client-name');
        textCliente.innerText = order.name;

        const idClient = document.createElement('span');
        idClient.classList.add('info-card__client-cel');
        idClient.innerText = order.cel;


        const listContainer = document.createElement('div');
        listContainer.classList.add('info-card__list-container');

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
        timeContainer.classList.add('info-card__time-container');

        const delayedTime = document.createElement('span');
        delayedTime.classList.add('info-card__delayed-time');
        delayedTime.setAttribute('id',`delayedTime${array.indexOf(order)}`)
        delayedTime.innerText = parseInt((Date.now() - order.date) / 60000);

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

export let currentOrder ={};


const cart_clientData = document.querySelector('#cart_clientData');
const cart_textCliente = document.querySelector('#cartClientName');
const cart_idClient = document.querySelector('#cartClientTel');
cart_idClient.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.name}`,sendWhatsApp , `${currentOrder.prefix}${currentOrder.cel}`);
})
const cart_listItems = document.querySelector('#cart_listItems');
const cart_delayedTime = document.querySelector('#cart_delayedTime');

const options_clientData = document.querySelector('#options_clientData');
const options_textClient = document.querySelector('#options_textClient');
const options_idClient = document.querySelector('#options_idClient');
options_idClient.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.name}`,sendWhatsApp ,`${currentOrder.prefix}${currentOrder.cel}`);
})
const optionsListItems = document.querySelector('#optionsListItems');
const optionsDelayedTime = document.querySelector('#optionsDelayedTime');

const options_itemsScrollX = document.querySelector('#options_itemsScrollX');

const delivery_clientData = document.querySelector('#delivery_clientData');
const delivery_textClient = document.querySelector('#delivery_ClientName');
const delivery_idClient = document.querySelector('#delivery_ClientTel');
delivery_idClient.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.name}`,sendWhatsApp , `${currentOrder.prefix}${currentOrder.cel}`);
})
const delivery_listItems = document.querySelector('#delivery_listItems');
const delivery_delayedTime = document.querySelector('#delivery_delayedTime');





export function loadChart(order){
    currentOrder= {};
    currentOrder = order;    
    setMap(order);
    order.status == 'pronto_para_reparto'
    ? deliveryBtnDelivered.classList.remove('inactive')
    : deliveryBtnDelivered.classList.add('inactive');

    startUpdateTimeChart(order);  
        

        cart_idClient.innerText= order.cel;
        cart_textCliente.innerText= order.name;
        options_idClient.innerText= order.cel;
        options_textClient.innerText= order.name; 
        delivery_idClient.innerText= order.cel;
        delivery_textClient.innerText= order.name; 

        
    
        cart_listItems.innerText= "";
        optionsListItems.innerText= "";
        delivery_listItems.innerText= "";
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
                            cart_listItems.appendChild(liTortu.cloneNode(true));
                            optionsListItems.appendChild(liTortu.cloneNode(true));
                            delivery_listItems.appendChild(liTortu.cloneNode(true));
                        };
                        if(burger){
                            const liBurger = document.createElement('li');
                            liBurger.innerText = `Hamburguesas: ${burger}`
                            cart_listItems.appendChild(liBurger.cloneNode(true));
                            optionsListItems.appendChild(liBurger.cloneNode(true));
                            delivery_listItems.appendChild(liBurger.cloneNode(true));
                        };

        const delayedTime = parseInt((Date.now() - order.date) / 60000);
        cart_delayedTime.innerText =delayedTime;
        optionsDelayedTime.innerText =delayedTime;
        delivery_delayedTime.innerText =delayedTime;

       
        if(delayedTime < 20 ){
            cart_clientData.classList.remove('background-orange')
            options_clientData.classList.remove('background-orange')
            delivery_clientData.classList.remove('background-orange')
            cart_clientData.classList.remove('background-red')
            options_clientData.classList.remove('background-red')
            delivery_clientData.classList.remove('background-red')
            cart_clientData.classList.add('background-white')
            options_clientData.classList.add('background-white')
            delivery_clientData.classList.add('background-white')
        }else if(delayedTime < 40 ){
          
           cart_clientData.classList.remove('background-white')
           options_clientData.classList.remove('background-white')
           delivery_clientData.classList.remove('background-white')
           cart_clientData.classList.remove('background-red')
           options_clientData.classList.remove('background-red')
           delivery_clientData.classList.remove('background-red')
            cart_clientData.classList.add('background-orange')
            options_clientData.classList.add('background-orange')
            delivery_clientData.classList.add('background-orange')
          }else{
            cart_clientData.classList.remove('background-white')
            options_clientData.classList.remove('background-white')
            delivery_clientData.classList.remove('background-white')
            cart_clientData.classList.remove('background-orange')
            options_clientData.classList.remove('background-orange')
            delivery_clientData.classList.remove('background-orange')
            cart_clientData.classList.add('background-red')            
            options_clientData.classList.add('background-red')            
            delivery_clientData.classList.add('background-red')            
        };

    const cartItemsContainer = document.querySelector('#cartItemsContainer');  
    
    cartItemsContainer.innerText= "";
    
    for(let product of order.items){

        const cardXs = document.createElement('article');
        cardXs.classList.add('card-small');

        const internalContainer = document.createElement('div');
        internalContainer.classList.add('card-small-internalContainer');
        internalContainer.addEventListener('click',function(){
            loadOptions(options_itemsScrollX);
            toggleVisibility(cartCard);
            toggleVisibility(sectionOptions);             
        });
        

        const title = document.createElement('h3');
        title.classList.add('card-small-title');
        title.innerText = product.name;        

        const precio = document.createElement('span');
        precio.classList.add('card-small-precio');
        precio.innerText = `$${product.precio}`;

        internalContainer.appendChild(title);
        
        internalContainer.appendChild(precio);

        cardXs.appendChild(internalContainer);


        cartItemsContainer.appendChild(cardXs);

    }
}


function loadOptions(section){
    section.innerText= '';
    
    for (const item of currentOrder.items) {

        const card = document.createElement('div');
        card.classList.add('section-items-options-card');
        
        const title = document.createElement('h4');
        title.classList.add('options-item-name');
        title.innerText = item.name;
        
        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('section-items-options-container');

        const cardsContainer = document.createElement('ul');
        cardsContainer.classList.add('cart-items-options-container-cards');
        
        armadorListaNegative(item, item.ingredientesFijos, cardsContainer);
        armadorListaPositive(item, item.ingredientesOpcionales, cardsContainer);
                    
        

        itemsContainer.appendChild(cardsContainer);

        card.appendChild(title);
        card.appendChild(itemsContainer);

        section.appendChild(card);


        
            
        }  

    }

    function armadorListaPositive(item, lista, contenedor){
        for (let gusto of lista) {
                        
            const liItem = document.createElement('li');
            const checkerContainer = document.createElement('div');
            checkerContainer.classList.add('ingrediente-checker-container');
            const spanItem = document.createElement('span');
            spanItem.innerText = gusto;
            checkerContainer.append(spanItem);
            
            if(item.familia == 'Tortugones'){

                if(item.gustosSelecionados[gusto + '-A']
                    ||item.gustosSelecionados[gusto + '-B']
                    ||item.gustosSelecionados[gusto + '-C']
                    ||item.gustosSelecionados[gusto + '-D']){
                        const labelPorcionA = document.createElement('div');
                        labelPorcionA.classList.add('porcion-A'); 
                        if(item.gustosSelecionados[gusto + '-A']){
                            labelPorcionA.classList.add('background-green')
                        } else{
                            labelPorcionA.classList.add('background-white')
                        }                     
                        const labelPorcionB = document.createElement('div');
                        labelPorcionB.classList.add('porcion-B'); 
                        if(item.gustosSelecionados[gusto + '-B']){
                            labelPorcionB.classList.add('background-green')
                        } else{
                            labelPorcionB.classList.add('background-white')
                        }                     
                        const labelPorcionC = document.createElement('div');
                        labelPorcionC.classList.add('porcion-C'); 
                        if(item.gustosSelecionados[gusto + '-C']){
                            labelPorcionC.classList.add('background-green')
                        } else{
                            labelPorcionC.classList.add('background-white')
                        }                     
                        const labelPorcionD = document.createElement('div');
                        labelPorcionD.classList.add('porcion-D'); 
                        if(item.gustosSelecionados[gusto + '-D']){
                            labelPorcionD.classList.add('background-green')
                        } else{
                            labelPorcionD.classList.add('background-white')
                        }   

                        checkerContainer.append(labelPorcionA,labelPorcionB,labelPorcionC,labelPorcionD);
                        liItem.appendChild(checkerContainer);
                        contenedor.appendChild(liItem); 
                    }
            } else{

                if(item.gustosSelecionados[gusto]){
                const labelPorcionAll = document.createElement('div');
                labelPorcionAll.classList.add('porcion-All');
        
                labelPorcionAll.classList.add('inputAll');
                if(item.gustosSelecionados[gusto]){
                    labelPorcionAll.classList.add('background-green')
                } else{
                    labelPorcionAll.classList.add('background-white')
                } 
                checkerContainer.append(labelPorcionAll);

                liItem.appendChild(checkerContainer);
        
                contenedor.appendChild(liItem); 
               }
              }
       
    };
    
    
    };


    function armadorListaNegative(item, lista, contenedor){
        for (let gusto of lista) {
                        
            const liItem = document.createElement('li');
            const checkerContainer = document.createElement('div');
            checkerContainer.classList.add('ingrediente-checker-container');
            checkerContainer.classList.add('background-orange');
            const spanItem = document.createElement('span');
            spanItem.innerText = gusto;
            checkerContainer.append(spanItem);
            
            if(item.familia == 'Tortugones'){
                
                if(!item.gustosSelecionados[gusto + '-A']
                    ||!item.gustosSelecionados[gusto + '-B']
                    ||!item.gustosSelecionados[gusto + '-C']
                    ||!item.gustosSelecionados[gusto + '-D']){
                    spanItem.innerText = `ATENCIÓN !!! ${gusto}`
                        const labelPorcionA = document.createElement('div');
                        labelPorcionA.classList.add('porcion-A'); 
                        if(item.gustosSelecionados[gusto + '-A']){
                            labelPorcionA.classList.add('background-green')
                        } else{
                            labelPorcionA.classList.add('background-red')
                        }                     
                        const labelPorcionB = document.createElement('div');
                        labelPorcionB.classList.add('porcion-B'); 
                        if(item.gustosSelecionados[gusto + '-B']){
                            labelPorcionB.classList.add('background-green')
                        } else{
                            labelPorcionB.classList.add('background-red')
                        }                     
                        const labelPorcionC = document.createElement('div');
                        labelPorcionC.classList.add('porcion-C'); 
                        if(item.gustosSelecionados[gusto + '-C']){
                            labelPorcionC.classList.add('background-green')
                        } else{
                            labelPorcionC.classList.add('background-red')
                        }                     
                        const labelPorcionD = document.createElement('div');
                        labelPorcionD.classList.add('porcion-D'); 
                        if(item.gustosSelecionados[gusto + '-D']){
                            labelPorcionD.classList.add('background-green')
                        } else{
                            labelPorcionD.classList.add('background-red')
                        }   

                        checkerContainer.append(labelPorcionA,labelPorcionB,labelPorcionC,labelPorcionD);
                        liItem.appendChild(checkerContainer);
                        contenedor.appendChild(liItem); 
                    }
            } else{

                if(!item.gustosSelecionados[gusto]){
                    spanItem.innerText = `ATENCIÓN !!! ${gusto}`
                    const labelPorcionAll = document.createElement('div');
                    labelPorcionAll.classList.add('porcion-All');
            
                    labelPorcionAll.classList.add('inputAll');
                    if(item.gustosSelecionados[gusto]){
                        labelPorcionAll.classList.add('background-green')
                    } else{
                        labelPorcionAll.classList.add('background-red')
                    } 
                    checkerContainer.append(labelPorcionAll);

                    liItem.appendChild(checkerContainer);
            
                    contenedor.appendChild(liItem); 
                }
              }
       
    };
    
    
    };
