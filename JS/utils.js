import { login, logout } from "./auth.js";
import { btnLogIn , btnLogOut, statusSection  } from "./index.js"
import { renderOrders , renderEndedOrders } from "./cards.js";
import { addAllOrdersToMap } from "./map.js";


const db = firebase.firestore();
let currentUser;



const userMenu = document.querySelector('#userMenu');
const userMenu_img = document.querySelector('#userMenu_img');
const userMenu_name = document.querySelector('#userMenu_name');
const userMenu_BtnContainer = document.querySelector('#userMenu_BtnContainer');

const inicio_BtnContainer = document.querySelector('#inicio_BtnContainer');
const sectionPendingOrders = document.querySelector('#sectionPendingOrders');
const cartCard = document.querySelector('#cartCard');
const sectionOptions = document.querySelector('#sectionOptions');
const deliveryCard =document.querySelector('#deliveryCard');
const sectionAllOrdersLocations= document.querySelector('#sectionAllOrdersLocations');
const sectionEndedOrders = document.querySelector('#sectionEndedOrders');
const sectionPopUp = document.querySelector('#sectionPopUp');

const sectionAwait = document.querySelector('#sectionAwait')



document.addEventListener("mouseup", function(event) {

  if (!userMenu.contains(event.target) 
       && !floatButton.contains(event.target) 
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
      
      init();
    } catch (error) {
      console.error(error);
    }}

export function doLogout(){
    logout()
    toggleVisibility(btnLogOut);
    toggleVisibility(btnLogIn);
    userMenu_img.setAttribute('src','');
    toggleVisibility(userMenu_img);
    userMenu_name.innerText = 'Debe iniciar sesion';
    toggleVisibility(userMenu_BtnContainer);
    inicio_BtnContainer.classList.add('inactive');
}

export async function init() {
    toggleVisibility(btnLogIn);
    toggleVisibility(btnLogOut);
    userMenu_img.setAttribute('src', currentUser.photoURL);
    toggleVisibility(userMenu_img);
    userMenu_name.innerText = currentUser.displayName;
    toggleVisibility(userMenu_BtnContainer);
    toggleVisibility(inicio_BtnContainer);
    toggleVisibility(userMenu);
  
  }

  let ordersList = [];

  export async function loadOrders(status,section,title) {
    let orders = [];    
  
    try {
      const response = await getItems("ventas", status);
      orders = [...response];

      orders.sort((a,b)=> a.date - b.date); 
  
      ordersList = orders;
  
       renderOrders(section, orders, title);
       startUpdateTimePendingOrders();
    } catch (error) {
      console.error(error);
    }
  }

  export async function loadEndedOrders(section,title,...status) {
    let orders = [];    
  
    try {
      const response = await getItems("ventas",...status);
      orders = [...response];

      orders.sort((a,b)=> a.date - b.date); 
  
      renderEndedOrders(section, orders, title);       
    } catch (error) {
      console.error(error);
    }
  }





 let ordersOnMap = [];

  export async function loadLocations(...status) {
   
    let orders = [];
  
    try {   
      const response = await getItems("ventas",...status);
      orders = [...response];    

      orders.sort((a,b)=> a.date - b.date); 
      
      let areDifferent = false

      let oldOrders = [];
      ordersOnMap.map((order)=> oldOrders.push(order.id));

      let newOrders = [];
      orders.map((order)=> newOrders.push(order.id));

      
      newOrders.map((order)=>{
        if(!oldOrders.includes(order)){         
          areDifferent = true;} 
      })     
      
      oldOrders.map((order)=>{
        if(!newOrders.includes(order)){         
          areDifferent = true;} 
      })   
      
      if(areDifferent){
        ordersOnMap = orders;
        addAllOrdersToMap(orders);
        startUpdateAllOrdersMap(status)      
        
      }
     
      
    } catch (error) {
      console.error(error);
    }


  }






  async function getItems(colection,...statusList) {
    sectionAwait.classList.remove('inactive')

    let items = [];

    statusList = statusList.flat()
   

    
    for (const status of statusList) {
    
      
      try {
        const response = await db
          .collection(colection)
          .where("status", "==", status)
          .get();
    
        response.forEach(function (item) {
          items.push(item.data());
        });
    
      } catch (error) {
        throw new Error(error);
      }
    }
    sectionAwait.classList.add('inactive')
    return items;
  };


  export async function update( collection, order, newStatus) {
    sectionAwait.classList.remove('inactive')
    
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
    sectionAwait.classList.add('inactive')
  }


export async function processOrders(){

  sectionAwait.classList.remove('inactive')
  
  try{
    //TRAIGO LAS ORDENES ENTREGADAS Y CANCELADAS, LE AGREGO EL NUEVO ESTADO AL HISTORIAL DE ESTADOS
  const orders = await getItems("ventas","entregado","cancelado");
   orders.map((order)=>{
      order.completed = true;
      order.history.push({      
      status: "procesado",
      date: Number(Date.now()),
      user : {
        name:currentUser.displayName,
        id: currentUser.uid
      }
    })    
  })

  // AGREGO LAS ORDENES CON EL NUEVO STATUS A LA COLECCION ordenes_procesadas

  orders.map(async(order)=>{
    await insert('ordenes_procesadas', order);
  })

  console.log(orders)

  // ELIMINO LAS ORDENES DE COLECCION ventas

  await deleteOrders('ventas',...orders);  

  toggleVisibility(sectionEndedOrders)
  toggleVisibility(inicio_BtnContainer)

  }catch (error){

    throw new Error(error);
  } 

  sectionAwait.classList.add('inactive')

}

async function deleteOrders(collection,...orders){

  let docId = [];
  for (const order of orders) {
    const doc = await db.collection(collection).where("id", "==", order.id).get();
        doc.forEach((i) => {
        docId.push(i.id);
        });    
  }
      for (const doc of docId) {
        db.collection(collection).doc(doc).delete().then(() => {
           console.log("Document successfully deleted!");
        }).catch((error) => {
        console.error("Error removing document: ", error);
        
        })
      }   
}




async function insert(collection,  item) {
  try {
    console.log('insert')
    const response = await db.collection(collection).add(item);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};





 export  async function orderChangeStatus(colecction,order,newStatus){
    try{
      await update(colecction,order,newStatus);
      switch (statusSection) {
          case "pending-orders" :
              await loadOrders('ingresado',sectionPendingOrders_ordersContainer,'Ordenes Pendientes:')
              startUpdateTimePendingOrders();
              toggleVisibility(sectionPendingOrders);
              
              break;
          case "delivery-orders":    
              await loadOrders('pronto_para_reparto',sectionPendingOrders_ordersContainer,'Ordenes prontas para reparto:')
              toggleVisibility(sectionPendingOrders);
              break;
                       
          case "all-orders-locations":    
              await loadLocations("ingresado","pronto_para_reparto");
              toggleVisibility(sectionAllOrdersLocations);            
              break;                    
          }
  cartCard.classList.add('inactive');
  sectionOptions.classList.add('inactive');    
  deliveryCard.classList.add('inactive');    
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

  export function startUpdateAllOrdersMap(...status){
   
    
    stopTimeControl();     
      intervalId = setInterval(updateAllOrdersMap, 30000, ...status);
    
  }

  export function stopTimeControl(){
    clearInterval(intervalId);
    intervalId= null;
  }
  
  function updateTimePendingOrders(){
   
    for (const pedido of ordersList) {
      const posicion = ordersList.indexOf(pedido);
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
   
    const cart_backgroundCard = document.querySelector('#cartCard_clientDataMainContainer');
    const options_backgroundCard = document.querySelector('#sectionOptions_clientData');
    const delivery_backgroundCard = document.querySelector('#deliveryCard_clientData');
    const cart_spanDelayedTime = document.querySelector('#cartCard_delayedTime')
    const options_spanDelayedTime = document.querySelector('#sectionOptions_delayedTime')
    const delivery_spanDelayedTime = document.querySelector('#deliveryCard_delayedTime')

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

  
  function updateAllOrdersMap(status){   
    loadLocations(status)
  }
  
  export function sendWhatsApp(numero){
    window.open(`https://wa.me/${numero}`);
  };
  

const sectionPopUp_text = document.querySelector('#sectionPopUp_text');
let popUpFunction_calback;
let popUpFunction_parametros;

let popUpFunction = ()=> popUpFunction_calback(...popUpFunction_parametros);

const sectionPopUp_btn_cancel = document.querySelector('#sectionPopUp_btn_cancel');
sectionPopUp_btn_cancel.addEventListener('click', function(){
  toggleVisibility(sectionPopUp);
  
});

const sectionPopUp_btn_confirm = document.querySelector('#sectionPopUp_btn_confirm');
sectionPopUp_btn_confirm.addEventListener('click',function(){    
  popUpFunction();
  toggleVisibility(sectionPopUp);
});



export function popUp(text, calback, ...parametros){

  sectionPopUp_text.innerText = text;
  popUpFunction_calback = calback;
  popUpFunction_parametros = parametros
  
  toggleVisibility(sectionPopUp);
  
}


  