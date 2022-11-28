import { statusSection } from "./index.js";
import { setMap } from "./map.js";
import { toggleVisibility , stopTimeControl, startUpdateTimeChart , popUp , sendWhatsApp } from "./utils.js";

const sectionPendingOrders_ordersContainer = document.querySelector('#sectionPendingOrders_ordersContainer');

const endedOrders_ordersDelivered = document.querySelector('#endedOrders_ordersDelivered');
const endedOrders_amount = document.querySelector('#endedOrders_amount');
const endedOrders_averageDelay = document.querySelector('#endedOrders_averageDelay');
const endedOrders_minDelay = document.querySelector('#endedOrders_minDelay');
const endedOrders_maxDelay = document.querySelector('#endedOrders_maxDelay');


export function renderOrders(section, array, title){

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

        const cartCard_amount = document.querySelector('#cartCard_amount')
        cartCard_amount.innerText =`Monto total: $${order.amount}`;

        const deliveryCard_amount = document.querySelector('#deliveryCard_amount');
        deliveryCard_amount.innerText =`$${order.amount}`;

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


export function renderEndedOrders(section, array, title){

    section.innerText = "";

    const upperTitle = document.createElement('h2');
    upperTitle.classList.add('upper-title-cards-cardXs')
    upperTitle.innerText = title.toUpperCase();
    section.appendChild(upperTitle);
    let delayList= [];
    let amountList= [];
    
    for(let order of array){    
        
        const orderDelay = (order.history.at(-1).date - order.date)
        delayList.push(orderDelay);
        if(order.history.at(-1).status !== 'cancelado'){
            amountList.push(order.amount);
        }

        const cardXs = document.createElement('article');
        cardXs.classList.add('info-card');
        if( orderDelay < 1200000 ){
            cardXs.classList.add('background-white')
        }else if(orderDelay < 2400000 ){
            cardXs.classList.add('background-orange')
        }else{
            cardXs.classList.add('background-red')            
        };
        cardXs.setAttribute('id',`cardOrderSmall${array.indexOf(order)}`);

        cardXs.addEventListener('click',function(){
            loadChart(order);
            switch (statusSection) {
                case 'pending-orders':
                            toggleVisibility(sectionPendingOrders);
                            toggleVisibility(cartCard);
                    break;
                    case 'delivery-orders':
                            toggleVisibility(sectionPendingOrders);
                            toggleVisibility(deliveryCard);
                    break;
                case 'ended-orders':
                            toggleVisibility(sectionEndedOrders)
                            toggleVisibility(cartCard);
                    break;
            
            }
            
        });

        const orderSmallData = document.createElement('div');
        orderSmallData.classList.add('info-card__data-container', 'info-card__data-container--ended-order');

        const orderStatus = document.createElement('span');
        orderStatus.classList.add('info-card__status');
        orderStatus.innerText = order.history.at(-1).status.toUpperCase()


        const textCliente = document.createElement('div');
        textCliente.classList.add('info-card__client-name');
        textCliente.innerText = order.name;

        const idClient = document.createElement('span');
        idClient.classList.add('info-card__client-cel');
        idClient.innerText = order.cel;


        const listContainer = document.createElement('div');
        listContainer.classList.add('info-card__list-container');

        const cartCard_amount = document.querySelector('#cartCard_amount')
        cartCard_amount.innerText =`Monto total: $${order.amount}`;

        const deliveryCard_amount = document.querySelector('#deliveryCard_amount');
        deliveryCard_amount.innerText =`$${order.amount}`;

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
                        };
        
        
        const amountContainer = document.createElement('div');
        amountContainer.classList.add('info-card__amount-container');
                
        const amount = document.createElement('span');
        amount.classList.add('info-card__amount');
        amount.innerText = `$ ${order.amount}`;
                    
        
        const timeContainer = document.createElement('div');
        timeContainer.classList.add('info-card__time-container');

        const delayedTime = document.createElement('span');
        delayedTime.classList.add('info-card__delayed-time');
        delayedTime.innerText = parseInt(orderDelay / 60000);

        const spanMin = document.createElement('span');
        spanMin.innerText = 'min'

        listContainer.appendChild(ul);
        timeContainer.appendChild(delayedTime);
        timeContainer.appendChild(spanMin);
        
        amountContainer.appendChild(amount);
        
        orderSmallData.appendChild(textCliente);
        orderSmallData.appendChild(idClient);
        orderSmallData.appendChild(listContainer);
        
        cardXs.append(orderSmallData,amountContainer,timeContainer);
        
        if(order.history.at(-1).status == 'cancelado'){
            cardXs.appendChild(orderStatus);
        }
        
        section.appendChild(cardXs);
    }

    endedOrders_ordersDelivered.innerText = amountList.length;
    endedOrders_amount.innerText = `$ ${amountList.reduce((a, b) => a + b, 0)}`;
    endedOrders_averageDelay.innerText = parseInt((delayList.reduce((a, b) => a + b, 0) / delayList.length)/ 60000) // canceled orders included.
    endedOrders_minDelay.innerText = parseInt(Math.min(...delayList)/ 60000);
    endedOrders_maxDelay.innerText = parseInt(Math.max(...delayList)/ 60000);

}



export let currentOrder ={};


const cartCard_clientDataMainContainer = document.querySelector('#cartCard_clientDataMainContainer');
const cartCard_clientName = document.querySelector('#cartCard_clientName');
const cartCard_clientPhone = document.querySelector('#cartCard_clientPhone');
cartCard_clientPhone.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.name}`,sendWhatsApp , `${currentOrder.prefix}${currentOrder.cel}`);
})
const cartCard_itemsSumary = document.querySelector('#cartCard_itemsSumary');
const cartCard_delayedTime = document.querySelector('#cartCard_delayedTime');

const sectionOptions_clientData = document.querySelector('#sectionOptions_clientData');
const sectionOptions_clientName = document.querySelector('#sectionOptions_clientName');
const sectionOptions_clientPhone = document.querySelector('#sectionOptions_clientPhone');
sectionOptions_clientPhone.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.name}`,sendWhatsApp ,`${currentOrder.prefix}${currentOrder.cel}`);
})
const sectionOptions_itemsSumary = document.querySelector('#sectionOptions_itemsSumary');
const sectionOptions_delayedTime = document.querySelector('#sectionOptions_delayedTime');

const sectionOptions_itemsScrollX = document.querySelector('#sectionOptions_itemsScrollX');

const deliveryCard_clientData = document.querySelector('#deliveryCard_clientData');
const deliveryCard_clientName = document.querySelector('#deliveryCard_clientName');
const deliveryCard_clientPhone = document.querySelector('#deliveryCard_clientPhone');
deliveryCard_clientPhone.addEventListener('click', function(){
    popUp(`Quiere enviar un WhatsApp a ${currentOrder.name}`,sendWhatsApp , `${currentOrder.prefix}${currentOrder.cel}`);
})
const deliveryCard_itemsSumary = document.querySelector('#deliveryCard_itemsSumary');
const deliveryCard_delayedTime = document.querySelector('#deliveryCard_delayedTime');

const endedOrders_itemsContainer = document.querySelector('#endedOrders_itemsContainer');




export function loadChart(order){
    currentOrder= {};
    currentOrder = order;    
    setMap(order);
    
        cartCard_btn_ready.classList.remove('inactive');
        cartCard_btn_cancel.classList.remove('inactive');        
        deliveryCard_btn_ready.classList.remove('inactive');
        sectionOptions_btn_ready.classList.remove('inactive');

switch (order.status){
    case 'ingresado':
        currentOrder.nextStatus = 'pronto_para_reparto';
        cartCard_btn_ready.innerText = 'Pronto para reparto';
        deliveryCard_btn_ready.innerText = 'Pronto para reparto';
        sectionOptions_btn_ready.innerText='Pronto para reparto';
        
        break
    case 'pronto_para_reparto':
        currentOrder.nextStatus = 'entregado'
        cartCard_btn_ready.innerText = 'Entregado';
        deliveryCard_btn_ready.innerText = 'Entregado';
        sectionOptions_btn_ready.innerText='Entregado';
        break

    case 'entregado' :
        cartCard_btn_ready.classList.add('inactive');
        cartCard_btn_cancel.classList.add('inactive');        
        deliveryCard_btn_ready.classList.add('inactive');
        sectionOptions_btn_ready.classList.add('inactive');
        break

    case 'cancelado' :
        cartCard_btn_ready.classList.add('inactive');
        cartCard_btn_cancel.classList.add('inactive');        
        deliveryCard_btn_ready.classList.add('inactive');
        sectionOptions_btn_ready.classList.add('inactive');
        break
    }

    startUpdateTimeChart(order);  
        

        cartCard_clientPhone.innerText= order.cel;
        cartCard_clientName.innerText= order.name;
        sectionOptions_clientPhone.innerText= order.cel;
        sectionOptions_clientName.innerText= order.name; 
        deliveryCard_clientPhone.innerText= order.cel;
        deliveryCard_clientName.innerText= order.name; 

        
    
        cartCard_itemsSumary.innerText= "";
        sectionOptions_itemsSumary.innerText= "";
        deliveryCard_itemsSumary.innerText= "";
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
                            cartCard_itemsSumary.appendChild(liTortu.cloneNode(true));
                            sectionOptions_itemsSumary.appendChild(liTortu.cloneNode(true));
                            deliveryCard_itemsSumary.appendChild(liTortu.cloneNode(true));
                        };
                        if(burger){
                            const liBurger = document.createElement('li');
                            liBurger.innerText = `Hamburguesas: ${burger}`
                            cartCard_itemsSumary.appendChild(liBurger.cloneNode(true));
                            sectionOptions_itemsSumary.appendChild(liBurger.cloneNode(true));
                            deliveryCard_itemsSumary.appendChild(liBurger.cloneNode(true));
                        };

        const delayedTime = parseInt((Date.now() - order.date) / 60000);
        cartCard_delayedTime.innerText =delayedTime;
        sectionOptions_delayedTime.innerText =delayedTime;
        deliveryCard_delayedTime.innerText =delayedTime;

       
        if(delayedTime < 20 ){
            cartCard_clientDataMainContainer.classList.remove('background-orange')
            sectionOptions_clientData.classList.remove('background-orange')
            deliveryCard_clientData.classList.remove('background-orange')
            cartCard_clientDataMainContainer.classList.remove('background-red')
            sectionOptions_clientData.classList.remove('background-red')
            deliveryCard_clientData.classList.remove('background-red')
            cartCard_clientDataMainContainer.classList.add('background-white')
            sectionOptions_clientData.classList.add('background-white')
            deliveryCard_clientData.classList.add('background-white')
        }else if(delayedTime < 40 ){
          
           cartCard_clientDataMainContainer.classList.remove('background-white')
           sectionOptions_clientData.classList.remove('background-white')
           deliveryCard_clientData.classList.remove('background-white')
           cartCard_clientDataMainContainer.classList.remove('background-red')
           sectionOptions_clientData.classList.remove('background-red')
           deliveryCard_clientData.classList.remove('background-red')
            cartCard_clientDataMainContainer.classList.add('background-orange')
            sectionOptions_clientData.classList.add('background-orange')
            deliveryCard_clientData.classList.add('background-orange')
          }else{
            cartCard_clientDataMainContainer.classList.remove('background-white')
            sectionOptions_clientData.classList.remove('background-white')
            deliveryCard_clientData.classList.remove('background-white')
            cartCard_clientDataMainContainer.classList.remove('background-orange')
            sectionOptions_clientData.classList.remove('background-orange')
            deliveryCard_clientData.classList.remove('background-orange')
            cartCard_clientDataMainContainer.classList.add('background-red')            
            sectionOptions_clientData.classList.add('background-red')            
            deliveryCard_clientData.classList.add('background-red')            
        };

    const cartCard_itemsContainer = document.querySelector('#cartCard_itemsContainer');  
    
    cartCard_itemsContainer.innerText= "";
    
    for(let product of order.items){

        const cardXs = document.createElement('article');
        cardXs.classList.add('card-small');

        const internalContainer = document.createElement('div');
        internalContainer.classList.add('card-small-internalContainer');
        internalContainer.addEventListener('click',function(){
            loadOptions(sectionOptions_itemsScrollX);
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


        cartCard_itemsContainer.appendChild(cardXs);

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
        
        createNegativeList(item, item.ingredientesFijos, cardsContainer);
        createPositiveList(item, item.ingredientesOpcionales, cardsContainer);
                    
        

        itemsContainer.appendChild(cardsContainer);

        card.appendChild(title);
        card.appendChild(itemsContainer);

        section.appendChild(card);


        
            
        }  

    }

    function createPositiveList(item, list, container){
        for (let gusto of list) {
                        
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
                        container.appendChild(liItem); 
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
        
                container.appendChild(liItem); 
               }
              }
       
    };
    
    
    };


    function createNegativeList(item, list, container){
        for (let gusto of list) {
                        
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
                        container.appendChild(liItem); 
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
            
                    container.appendChild(liItem); 
                }
              }
       
    };
    
    
    };
