import { currentOrder } from "./cards.js";
import { toggleVisibility , doLogIn, doLogout, loadOrders , loadEndedOrders , stopTimeControl, startUpdateTimePendingOrders, popUp, sendWhatsApp, update, loadLocations, orderChangeStatus , processOrders } from "./utils.js";


export let statusSection;

const floatButton = document.querySelector('#floatButton')
floatButton.addEventListener('click', function(){toggleVisibility(userMenu)})

export const btnLogIn = document.querySelector('#btnLogIn');
btnLogIn.addEventListener('click', function(){ doLogIn() });

export const btnLogOut = document.querySelector('#btnLogOut');
btnLogOut.addEventListener('click', function(){ doLogout()})


const userMenu_btn_pendingOrders= document.querySelector('#userMenu_btn_pendingOrders');
userMenu_btn_pendingOrders.addEventListener('click', function(){    
    
    statusSection = 'pending-orders'
    btnUserMenuFunction('ingresado')
  
})
const userMenu_btn_deliveryOrders= document.querySelector('#userMenu_btn_deliveryOrders');
userMenu_btn_deliveryOrders.addEventListener('click', async function(){  

    statusSection = 'delivery-orders';
    btnUserMenuFunction('pronto_para_reparto'); 

    
})

async function btnUserMenuFunction(status){   
    await loadOrders(status,sectionPendingOrders_ordersContainer,'Ordenes Pendientes:')
    if(sectionPendingOrders.classList.contains('inactive')){
        cartCard.classList.add('inactive');
        deliveryCard.classList.add('inactive');
        inicio_BtnContainer.classList.add('inactive');
        sectionPendingOrders.classList.remove('inactive');
    }
    toggleVisibility(userMenu);      
}


const userMenu_btnWhatsApp = document.querySelector('#userMenu_btnWhatsApp');
userMenu_btnWhatsApp.addEventListener('click', function(){
    popUp('Enviar WhatsApp a Setenta Trece?', sendWhatsApp,'59894638229')
})




const inicio_btn_pendingOrders= document.querySelector('#inicio_btn_pendingOrders');
inicio_btn_pendingOrders.addEventListener('click',async function(){
    statusSection = 'pending-orders';
    await loadOrders('ingresado',sectionPendingOrders_ordersContainer,'Ordenes Pendientes:');
    toggleVisibility(inicio_BtnContainer);
    toggleVisibility(sectionPendingOrders);    
})

const inicio_btn_deliveryOrders= document.querySelector('#inicio_btn_deliveryOrders');
inicio_btn_deliveryOrders.addEventListener('click', async function(){
    statusSection = 'delivery-orders';
    await loadOrders('pronto_para_reparto',sectionPendingOrders_ordersContainer,'Ordenes prontas para reparto:')
    toggleVisibility(inicio_BtnContainer);
    toggleVisibility(sectionPendingOrders);
});


const inicio_btn_allOrdersLocations = document.querySelector('#inicio_btn_allOrdersLocations');
inicio_btn_allOrdersLocations.addEventListener('click', async function(){
    statusSection = 'all-orders-locations';
    await loadLocations("ingresado","pronto_para_reparto");
    toggleVisibility(inicio_BtnContainer);
    toggleVisibility(sectionAllOrdersLocations);
})

const inicio_btn_endedOrders = document.querySelector('#inicio_btn_endedOrders');
inicio_btn_endedOrders.addEventListener('click', async function(){
    statusSection = 'ended-orders';
    await loadEndedOrders(endedOrders_itemsContainer,'Ordenes finalizdas:', 'entregado', 'cancelado')
    toggleVisibility(inicio_BtnContainer);
    toggleVisibility(sectionEndedOrders);
})




const sectionAllOrdersLocations_btn_return = document.querySelector('#sectionAllOrdersLocations_btn_return');
sectionAllOrdersLocations_btn_return.addEventListener('click', function(){
    toggleVisibility(sectionAllOrdersLocations)
    toggleVisibility(inicio_BtnContainer);

})




const sectionPendingOrders_btn_return = document.querySelector('#sectionPendingOrders_btn_return');
sectionPendingOrders_btn_return.addEventListener('click', function(){ 
    toggleVisibility(sectionPendingOrders);    
    toggleVisibility(inicio_BtnContainer);
    stopTimeControl();
});

const cartCard_btn_return = document.querySelector('#cartCard_btn_return');
cartCard_btn_return.addEventListener('click',async function(){

    switch (statusSection) {
        case "pending-orders" :            
            await loadOrders('ingresado',sectionPendingOrders_ordersContainer,'Ordenes Pendientes:')
            toggleVisibility(sectionPendingOrders);
            
            break;
            case "all-orders-locations":  
            await loadLocations("ingresado","pronto_para_reparto");
            toggleVisibility(sectionAllOrdersLocations);            
            
            break;
            
    }
        toggleVisibility(cartCard);    
        
    })
    
const cartCard_btn_deliveryData = document.querySelector('#cartCard_btn_deliveryData');
cartCard_btn_deliveryData.addEventListener('click', function(){
    toggleVisibility(deliveryCard);
    toggleVisibility(cartCard); 
})
    

const cartCard_btn_ready = document.querySelector('#cartCard_btn_ready')
cartCard_btn_ready.addEventListener('click', async function(){
      
        popUp(`Quieres cambiar el estado de esta orden a ${currentOrder.nextStatus}?`, orderChangeStatus, 'ventas', currentOrder , currentOrder.nextStatus)

    })



const cartCard_btn_cancel = document.querySelector('#cartCard_btn_cancel')
cartCard_btn_cancel.addEventListener('click', async function(){
      
        popUp('Quieres cambiar el estado de esta orden a "Cancelado"?', orderChangeStatus, 'ventas', currentOrder , 'cancelado')
        
})

const sectionOptions_btn_deliveryData = document.querySelector('#sectionOptions_btn_deliveryData');
sectionOptions_btn_deliveryData.addEventListener('click', function(){
    toggleVisibility(deliveryCard);
    toggleVisibility(sectionOptions); 
})




const sectionOptions_btn_return = document.querySelector('#sectionOptions_btn_return')
sectionOptions_btn_return.addEventListener('click', function(){
    toggleVisibility(sectionOptions);
    toggleVisibility(cartCard);
})

const sectionOptions_btn_ready = document.querySelector('#sectionOptions_btn_ready')
    sectionOptions_btn_ready.addEventListener('click', async function(){
      
        popUp(`Quieres cambiar el estado de esta orden a ${currentOrder.nextStatus}?`, orderChangeStatus, 'ventas', currentOrder , currentOrder.nextStatus)
        
})

const deliveryCard_btn_return = document.querySelector('#deliveryCard_btn_return')
deliveryCard_btn_return.addEventListener('click', async function(){
    switch (statusSection) {

        case 'pending-orders':
        toggleVisibility(cartCard);
        break;
        
        case 'all-orders-locations':
            toggleVisibility(cartCard);
            
            break;
        case 'delivery-orders':
           await loadOrders('pronto_para_reparto',sectionPendingOrders_ordersContainer,'Ordenes prontas para reparto:')
            toggleVisibility(sectionPendingOrders);
            
            break;
    }
    
    
    toggleVisibility(deliveryCard);
})

const deliveryCard_btn_ready = document.querySelector('#deliveryCard_btn_ready');
deliveryCard_btn_ready.addEventListener('click',function(){
    popUp(`Quieres cambiar el estado de esta orden a ${currentOrder.nextStatus}?`, orderChangeStatus, 'ventas', currentOrder , currentOrder.nextStatus)

})


const endedOrders_btn_return = document.querySelector('#endedOrders_btn_return');
endedOrders_btn_return.addEventListener('click', function(){
    toggleVisibility(sectionEndedOrders);    
    toggleVisibility(inicio_BtnContainer);
})

const endedOrders_btn_process = document.querySelector('#endedOrders_btn_process');
endedOrders_btn_process.addEventListener('click', async function(){

    popUp(`Quieres procesar todas las ordenes finalizadas?`, processOrders)
    
})