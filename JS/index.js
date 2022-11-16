import { currentOrder } from "./cards.js";
import { toggleVisibility , doLogIn, doLogout, loadPedidos , stopTimeControl, startUpdateTimePendingOrders, popUp, sendWhatsApp, update, loadLocations, orderChangeStatus } from "./utils.js";


export let statusSection;

const menuUserButton = document.querySelector('#menuUserButton')
menuUserButton.addEventListener('click', function(){toggleVisibility(userMenu)})

export const btnLogIn = document.querySelector('#btnLogIn');
btnLogIn.addEventListener('click', function(){ doLogIn() });

export const btnLogOut = document.querySelector('#btnLogOut');
btnLogOut.addEventListener('click', function(){ doLogout()})


const userMenu_pendingOrders= document.querySelector('#userMenu_pendingOrders');
userMenu_pendingOrders.addEventListener('click', function(){    
    
    statusSection = 'pending-orders'
    btnUserMenuFunction('ingresado')
  
})
const userMenu_deliveryOrders= document.querySelector('#userMenu_deliveryOrders');
userMenu_deliveryOrders.addEventListener('click', async function(){  

    statusSection = 'delivery-orders';
    btnUserMenuFunction('pronto_para_reparto'); 

    
})

async function btnUserMenuFunction(status){   
    await loadPedidos(status,ordenesPendientesContainer,'Ordenes Pendientes:')
    if(sectionPendingOrders.classList.contains('inactive')){
        cartCard.classList.add('inactive');
        deliveryCard.classList.add('inactive');
        inicioBtnContainer.classList.add('inactive');
        sectionPendingOrders.classList.remove('inactive');
    }
    toggleVisibility(userMenu);      
}


const userMenu_btnWhatsApp = document.querySelector('#userMenu_btnWhatsApp');
userMenu_btnWhatsApp.addEventListener('click', function(){
    popUp('Enviar WhatsApp a Setenta Trece?', sendWhatsApp,'94638229')
})




const btn_ordenesPendientes= document.querySelector('#inicioBtnPendingOrders');
btn_ordenesPendientes.addEventListener('click',async function(){
    statusSection = 'pending-orders';
    await loadPedidos('ingresado',ordenesPendientesContainer,'Ordenes Pendientes:');
    toggleVisibility(inicioBtnContainer);
    toggleVisibility(sectionPendingOrders);    
})

const btn_ordenesParaReparto= document.querySelector('#inicioDeliveryOrders');
btn_ordenesParaReparto.addEventListener('click', async function(){
    statusSection = 'delivery-orders';
    await loadPedidos('pronto_para_reparto',ordenesPendientesContainer,'Ordenes prontas para reparto:')
    toggleVisibility(inicioBtnContainer);
    toggleVisibility(sectionPendingOrders);
});


const inicioAllOrdersLocations = document.querySelector('#inicioAllOrdersLocations');
inicioAllOrdersLocations.addEventListener('click', async function(){
    statusSection = 'all-orders-locations';
    await loadLocations("ingresado");
    toggleVisibility(inicioBtnContainer);
    toggleVisibility(sectionAllOrdersLocations);
})



const returnButtonAllOrdersLocations = document.querySelector('#returnButtonAllOrdersLocations');
returnButtonAllOrdersLocations.addEventListener('click', function(){
    toggleVisibility(sectionAllOrdersLocations)
    toggleVisibility(inicioBtnContainer);

})




const btn_ordenesEntregadas= document.querySelector('.navigator-button--yellow');
btn_ordenesEntregadas.addEventListener('click', function(){
   
});


const btn_ordenesPendientesVolver = document.querySelector('#btn_ordenesPendientesVolver');
btn_ordenesPendientesVolver.addEventListener('click', function(){ 
    toggleVisibility(sectionPendingOrders);    
    toggleVisibility(inicioBtnContainer);
    stopTimeControl();
});

const cart_btnVolver = document.querySelector('#cart_btnVolver');
cart_btnVolver.addEventListener('click',async function(){

    switch (statusSection) {
        case "pending-orders" :            
            await loadPedidos('ingresado',ordenesPendientesContainer,'Ordenes Pendientes:')
            toggleVisibility(sectionPendingOrders);
            
            break;
            case "all-orders-locations":  
            await loadLocations("ingresado");
            toggleVisibility(sectionAllOrdersLocations);            
            
            break;
            
    }
        toggleVisibility(cartCard);    
        
    })
    
    const cartDeliveryInfo = document.querySelector('#cartDeliveryInfo');
    cartDeliveryInfo.addEventListener('click', function(){
        toggleVisibility(deliveryCard);
        toggleVisibility(cartCard); 
    })
    
    const cartReadyForDeliveryBtn = document.querySelector('#cartReadyForDeliveryBtn')
    cartReadyForDeliveryBtn.addEventListener('click', async function(){
        popUp('quieres camiar el estado de esta orden a "pronto para reparto"?', orderChangeStatus, 'ventas', currentOrder , 'pronto_para_reparto')
        
})

const optionsDeliveryInfo = document.querySelector('#optionsDeliveryInfo');
optionsDeliveryInfo.addEventListener('click', function(){
    toggleVisibility(deliveryCard);
    toggleVisibility(sectionOptions); 
})




const options_btnVolver = document.querySelector('#options_btnVolver')
options_btnVolver.addEventListener('click', function(){
    toggleVisibility(sectionOptions);
    toggleVisibility(cartCard);
})

const deliveryBtnReturn = document.querySelector('#deliveryBtnReturn')
deliveryBtnReturn.addEventListener('click', async function(){
    switch (statusSection) {
        case 'pending-orders':
        toggleVisibility(cartCard);

        break;
        
        case 'all-orders-locations':
            toggleVisibility(cartCard);
            
            break;
        case 'delivery-orders':
           await loadPedidos('pronto_para_reparto',ordenesPendientesContainer,'Ordenes prontas para reparto:')
            toggleVisibility(sectionPendingOrders);
            
            break;
    
        default:
            break;
    }
    
    
    toggleVisibility(deliveryCard);
})

const deliveryBtnDelivered = document.querySelector('#deliveryBtnDelivered')
