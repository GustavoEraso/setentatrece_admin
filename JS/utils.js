import { login, logout } from "./auth.js";
import { btnLogIn , btnLogOut  } from "./index.js"
import { loadOrders } from "./cards.js";


const db = firebase.firestore();
let currentUser;



const userMenu = document.querySelector('#userMenu');
const imgUser = document.querySelector('#imgUser');
const userName = document.querySelector('#userName');
const UserMenuBtnContainer = document.querySelector('#UserMenuBtnContainer');

const inicioBtnContainer = document.querySelector('#inicioBtnContainer');
const sectionPendingOrders = document.querySelector('#sectionPendingOrders');
const chartCard = document.querySelector('#chartCard');
const sectionOptions = document.querySelector('#sectionOptions')
const sectionPopUp = document.querySelector('#sectionPopUp');



export function toggleVisibility(elemento){

        elemento.classList.toggle('inactive');    

}

export async function doLogIn(){
    try {
      currentUser = await login();
      console.log(currentUser)
      init();
    } catch (error) {
      console.error(error);
    }}

export function doLogout(){
    logout()
    toggleVisibility(btnLogOut);
    toggleVisibility(btnLogIn);
    imgUser.setAttribute('src','');
    toggleVisibility(imgUser);
    userName.innerText = 'Debe iniciar sesion';
    toggleVisibility(UserMenuBtnContainer);
    inicioBtnContainer.classList.add('inactive');
}

export async function init() {
    //localStorage.setItem("user", JSON.stringify(currentUser));
    toggleVisibility(btnLogIn);
    toggleVisibility(btnLogOut);
    imgUser.setAttribute('src', currentUser.photoURL);
    toggleVisibility(imgUser);
    userName.innerText = currentUser.displayName;
    toggleVisibility(UserMenuBtnContainer);
    toggleVisibility(inicioBtnContainer);
    toggleVisibility(userMenu);
  
  }

  let listaPedidos = [];

  export async function loadPedidos(estado,section,tittle) {
    let pedidos = [];
  
    try {
      const response = await getItems(estado);
      pedidos = [...response];
  
      listaPedidos = pedidos;
  
       loadOrders(section, pedidos, tittle);
       startUpdateTimePendingOrders();
    } catch (error) {
      console.error(error);
    }
  }




  async function getItems(estado) {
    try {
      let items = [];
      const response = await db
        .collection("ventas")
        .where("estado", "==", estado)
        .get();
  
      response.forEach(function (item) {
        items.push(item.data());
      });
  
      return items;
    } catch (error) {
      throw new Error(error);
    }
  };

  let intervalId;

  export function startUpdateTimePendingOrders(){  
    stopTimeControl();
      intervalId = setInterval(updateTimePendingOrders, 60000);    
  }

  export function startUpdateTimeChart(pedido){
    stopTimeControl();     
      intervalId = setInterval(updateTimeChart, 60000, pedido);
    
  }

  export function stopTimeControl(){
    clearInterval(intervalId);
    intervalId= null;
  }
  
  function updateTimePendingOrders(){
    console.log('se esta ejecutando intervalo update time PENDING ORDERS')
    for (const pedido of listaPedidos) {
      const posicion = listaPedidos.indexOf(pedido);
      const backgroundCard = document.querySelector('#cardOrderSmall' + posicion);
      const spanDelayedTime = document.querySelector('#delayedTime' + posicion);

      const delayedTime = parseInt((Date.now() - pedido.fecha) / 60000);
      
      if(delayedTime < 20 ){
        backgroundCard.classList.remove('background-orange')
        backgroundCard.classList.remove('background-red')
        backgroundCard.classList.add('background-white')
    }else if(delayedTime < 40 ){
      
       backgroundCard.classList.remove('background-white')
       backgroundCard.classList.remove('background-red')
        backgroundCard.classList.add('background-orange')
      }else{
        backgroundCard.classList.remove('background-white')
        backgroundCard.classList.remove('background-orange')
        backgroundCard.classList.add('background-red')            
    };
      spanDelayedTime.innerText = delayedTime ;          
    };
  }

  function updateTimeChart(order){
    console.log('se esta ejecutando intervalo update time CHART')
    const chart_backgroundCard = document.querySelector('#chart_clientData');
    const options_backgroundCard = document.querySelector('#options_clientData');
    const chart_spanDelayedTime = document.querySelector('#chart_delayedTime')
    const options_spanDelayedTime = document.querySelector('#options_delayedTime')

      const delayedTime = parseInt((Date.now() - order.fecha) / 60000);
      
      if(delayedTime < 20 ){
        chart_backgroundCard.classList.remove('background-orange')
        options_backgroundCard.classList.remove('background-orange')
        chart_backgroundCard.classList.remove('background-red')
        options_backgroundCard.classList.remove('background-red')
        chart_backgroundCard.classList.add('background-white')
        options_backgroundCard.classList.add('background-white')
    }else if(delayedTime < 40 ){
      
        chart_backgroundCard.classList.remove('background-white')
        options_backgroundCard.classList.remove('background-white')
        chart_backgroundCard.classList.remove('background-red')
        options_backgroundCard.classList.remove('background-red')
        chart_backgroundCard.classList.add('background-orange')
        options_backgroundCard.classList.add('background-orange')
      }else{
        chart_backgroundCard.classList.remove('background-white')
        options_backgroundCard.classList.remove('background-white')
        chart_backgroundCard.classList.remove('background-orange')
        options_backgroundCard.classList.remove('background-orange')
        chart_backgroundCard.classList.add('background-red')            
        options_backgroundCard.classList.add('background-red')            
    };
      chart_spanDelayedTime.innerText = delayedTime ;          
      options_spanDelayedTime.innerText = delayedTime ;          
    
  }

  export function sendWhatsApp(numero){
    window.open(`https://wa.me/${numero}`);
  }
  
  
  const popUpText = document.querySelector('#popUpText');
  
  const btn_popUpCancel = document.querySelector('#btn_popUpCancel');
  btn_popUpCancel.addEventListener('click', function(){
    toggleVisibility(sectionPopUp);
    
  });
  
  const btn_popUpConfirm = document.querySelector('#btn_popUpConfirm');
  btn_popUpConfirm.addEventListener('click',function(){    
    popUpFunction(popUpFunction_parametro, popUpFunction_calback);
    toggleVisibility(sectionPopUp);
  });
  

  let popUpFunction = function(parametro,calback){
    calback(parametro);
  }
  let popUpFunction_parametro;
  let popUpFunction_calback;
  
  export function popUp(text, calback, parametro){
    popUpText.innerText = text;
    popUpFunction_parametro = parametro;
    popUpFunction_calback = calback;
    toggleVisibility(sectionPopUp);
    console.log('popUp')
  }