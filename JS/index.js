import { toggleVisibility , doLogIn, doLogout } from "./utils.js";




const menuUserButton = document.querySelector('#menuUserButton')
menuUserButton.addEventListener('click', function(){toggleVisibility(userMenu)})

export const btnLogIn = document.querySelector('#btnLogIn');
btnLogIn.addEventListener('click', function(){ doLogIn() });

export const btnLogOut = document.querySelector('#btnLogOut');
btnLogOut.addEventListener('click', function(){ doLogout()})



const btn_ordenesPendientes= document.querySelector('.btn-ordenes-pendientes');
btn_ordenesPendientes.addEventListener('click', function(){
   
})
const btn_ordenesParaReparto= document.querySelector('.btn-ordenes-para-reparto');
btn_ordenesPendientes.addEventListener('click', function(){
   
})
const btn_ordenesEntregadas= document.querySelector('.btn-ordenes-para-reparto');
btn_ordenesPendientes.addEventListener('click', function(){
   
})
