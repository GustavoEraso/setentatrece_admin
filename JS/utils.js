import { login, logout } from "./auth.js";
import { btnLogIn , btnLogOut, statusSection  } from "./index.js"
import { loadOrders } from "./cards.js";
import { addMarker } from "./map.js";


const db = firebase.firestore();
let currentUser;



const userMenu = document.querySelector('#userMenu');
const imgUser = document.querySelector('#imgUser');
const userName = document.querySelector('#userName');
const UserMenuBtnContainer = document.querySelector('#UserMenuBtnContainer');

const inicioBtnContainer = document.querySelector('#inicioBtnContainer');
const sectionPendingOrders = document.querySelector('#sectionPendingOrders');
const cartCard = document.querySelector('#cartCard');
const sectionOptions = document.querySelector('#sectionOptions');
const deliveryCard =document.querySelector('#deliveryCard');
const sectionAllOrdersLocations= document.querySelector('#sectionAllOrdersLocations');
const sectionPopUp = document.querySelector('#sectionPopUp');



document.addEventListener("mouseup", function(event) {

  if (!userMenu.contains(event.target) 
       && !menuUserButton.contains(event.target) 
         && !userMenu.classList.contains('inactive')) {

      toggleVisibility(userMenu);

  }
  
});


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

  export async function loadPedidos(status,section,title) {
    let orders = [];    
  
    try {
      const response = await getItems(status);
      orders = [...response];

      orders.sort((a,b)=> a.date - b.date); 
  
      listaPedidos = orders;

  
       loadOrders(section, orders, title);
       startUpdateTimePendingOrders();
    } catch (error) {
      console.error(error);
    }
  }






  export async function loadLocations(status) {
    let pedidos = [];
  
    try {
      const response = await getItems(status);
      pedidos = [...response];
  
      listaPedidos = pedidos;

      addMarker(pedidos);
      
    } catch (error) {
      console.error(error);
    }
  }






  async function getItems(status) {
    try {
      let items = [];
      const response = await db
        .collection("ventas")
        .where("status", "==", status)
        .get();
  
      response.forEach(function (item) {
        items.push(item.data());
      });
  
      return items;
    } catch (error) {
      throw new Error(error);
    }
  };


  export async function update( collection, order, newStatus) {
    
    try {
      let docId;
      let docHistory;
      const doc = await db.collection(collection).where("id", "==", order.id).get();
      doc.forEach((i) => {
        docId = i.id;
        docHistory = order.history ||[];
      });

            
      docHistory.push({
        status: newStatus,
        date: Number(Date.now()),
        user : {
          name:currentUser.displayName,
          id: currentUser.uid
        }
      })
      
      await db.collection(collection).doc(docId).update({
        status: newStatus, 
        history: docHistory
        });
      

    } catch (error) {
      throw new Error(error);
    }
  }

 export  async function orderChangeStatus(colecction,order,newStatus){
    try{
      await update(colecction,order,newStatus);
      switch (statusSection) {
          case "pending-orders" :
              await loadPedidos('ingresado',ordenesPendientesContainer,'Ordenes Pendientes:')
              startUpdateTimePendingOrders();
              toggleVisibility(sectionPendingOrders);
              
              break;
              case "all-orders-locations":    
              await loadLocations("ingresado");
              toggleVisibility(sectionAllOrdersLocations);            
              break;                    
          }
  toggleVisibility(cartCard);    
}catch(error){
  throw new Error(error)
}
  }



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

      const delayedTime = parseInt((Date.now() - pedido.date) / 60000);
      
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
    const cart_backgroundCard = document.querySelector('#cart_clientData');
    const options_backgroundCard = document.querySelector('#options_clientData');
    const delivery_backgroundCard = document.querySelector('#delivery_clientData');
    const cart_spanDelayedTime = document.querySelector('#cart_delayedTime')
    const options_spanDelayedTime = document.querySelector('#optionsDelayedTime')
    const delivery_spanDelayedTime = document.querySelector('#delivery_delayedTime')

      const delayedTime = parseInt((Date.now() - order.date) / 60000);
      
      if(delayedTime < 20 ){
        cart_backgroundCard.classList.remove('background-orange')
        options_backgroundCard.classList.remove('background-orange')
        delivery_backgroundCard.classList.remove('background-orange')
        cart_backgroundCard.classList.remove('background-red')
        options_backgroundCard.classList.remove('background-red')
        delivery_backgroundCard.classList.remove('background-red')
        cart_backgroundCard.classList.add('background-white')
        options_backgroundCard.classList.add('background-white')
        delivery_backgroundCard.classList.add('background-white')
    }else if(delayedTime < 40 ){
      
        cart_backgroundCard.classList.remove('background-white')
        options_backgroundCard.classList.remove('background-white')
        delivery_backgroundCard.classList.remove('background-white')
        cart_backgroundCard.classList.remove('background-red')
        options_backgroundCard.classList.remove('background-red')
        delivery_backgroundCard.classList.remove('background-red')
        cart_backgroundCard.classList.add('background-orange')
        options_backgroundCard.classList.add('background-orange')
        delivery_backgroundCard.classList.add('background-orange')
      }else{
        cart_backgroundCard.classList.remove('background-white')
        options_backgroundCard.classList.remove('background-white')
        delivery_backgroundCard.classList.remove('background-white')
        cart_backgroundCard.classList.remove('background-orange')
        options_backgroundCard.classList.remove('background-orange')
        delivery_backgroundCard.classList.remove('background-orange')
        cart_backgroundCard.classList.add('background-red')            
        options_backgroundCard.classList.add('background-red')            
        delivery_backgroundCard.classList.add('background-red')            
    };
      cart_spanDelayedTime.innerText = delayedTime ;          
      options_spanDelayedTime.innerText = delayedTime ;          
      delivery_spanDelayedTime.innerText = delayedTime ;          
    
  }

  export function sendWhatsApp(numero){
    window.open(`https://wa.me/${numero}`);
  };
  
  

const popUpText = document.querySelector('#popUpText');
let popUpFunction_calback;
let popUpFunction_parametros;

let popUpFunction = ()=> popUpFunction_calback(...popUpFunction_parametros);

const popUpCancelBtn = document.querySelector('#btn_popUpCancel');
popUpCancelBtn.addEventListener('click', function(){
  toggleVisibility(sectionPopUp);
  
});

const popUpConfirmBtn = document.querySelector('#btn_popUpConfirm');
popUpConfirmBtn.addEventListener('click',function(){    
  popUpFunction();
  toggleVisibility(sectionPopUp);
});



export function popUp(text, calback, ...parametros){

  popUpText.innerText = text;
  popUpFunction_calback = calback;
  popUpFunction_parametros = parametros
  
  toggleVisibility(sectionPopUp);
  
}


  