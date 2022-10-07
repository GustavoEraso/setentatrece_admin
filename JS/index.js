import { toggleVisibility , doLogIn, doLogout, loadPedidos , stopTimeControl, startUpdateTimePendingOrders, popUp, sendWhatsApp } from "./utils.js";




const menuUserButton = document.querySelector('#menuUserButton')
menuUserButton.addEventListener('click', function(){toggleVisibility(userMenu)})

export const btnLogIn = document.querySelector('#btnLogIn');
btnLogIn.addEventListener('click', function(){ doLogIn() });

export const btnLogOut = document.querySelector('#btnLogOut');
btnLogOut.addEventListener('click', function(){ doLogout()})


const userMenu_pendingOrders= document.querySelector('#userMenu_pendingOrders');
userMenu_pendingOrders.addEventListener('click', function(){
    if(sectionPendingOrders.classList.contains('inactive')){
        loadPedidos('ingresado',ordenesPendientesContainer,'Ordenes Pendientes:')
        toggleVisibility(inicioBtnContainer);
        toggleVisibility(sectionPendingOrders);
    }
    toggleVisibility(userMenu);  
})





const userMenu_btnWhatsApp = document.querySelector('#userMenu_btnWhatsApp');
userMenu_btnWhatsApp.addEventListener('click', function(){
    popUp('Enviar WhatsApp a Setenta Trece?', sendWhatsApp,'94638229')
})




const btn_ordenesPendientes= document.querySelector('#inicioBtnPendingOrders');
btn_ordenesPendientes.addEventListener('click', function(){
    loadPedidos('ingresado',ordenesPendientesContainer,'Ordenes Pendientes:')
    toggleVisibility(inicioBtnContainer);
    toggleVisibility(sectionPendingOrders);    
})

const btn_ordenesParaReparto= document.querySelector('.btn-ordenes-para-reparto');
btn_ordenesParaReparto.addEventListener('click', function(){
   
})
const btn_ordenesEntregadas= document.querySelector('.btn-ordenes-para-reparto');
btn_ordenesEntregadas.addEventListener('click', function(){
   
})


const btn_ordenesPendientesVolver = document.querySelector('#btn_ordenesPendientesVolver');
btn_ordenesPendientesVolver.addEventListener('click', function(){ 
    toggleVisibility(sectionPendingOrders);    
    toggleVisibility(inicioBtnContainer);
    stopTimeControl();
});

const chart_btnVolver = document.querySelector('#chart_btnVolver');
chart_btnVolver.addEventListener('click', function(){
    toggleVisibility(chartCard);    
    toggleVisibility(sectionPendingOrders);
    startUpdateTimePendingOrders();
})


const options_btnVolver = document.querySelector('#options_btnVolver')
options_btnVolver.addEventListener('click', function(){
    toggleVisibility(sectionOptions);
    toggleVisibility(chartCard);
})
