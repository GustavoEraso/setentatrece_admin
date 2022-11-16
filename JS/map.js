import { toggleVisibility } from "./utils.js";
import { loadChart } from "./cards.js";


let orderMap = L.map('orderMap').setView([-34.9087642861, -54.9581809946], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(orderMap);
   
let marker = L.marker([-34.9087642861, -54.9581809946]).addTo(orderMap);

export function setMap(order){
    let locations = order.location;
    let sistemLocation = locations.sistemLocation;
    let manualLocation = locations.manualLocation;
    const deliveryDescription = document.querySelector('#deliveryDescription')
    deliveryDescription.innerText = locations.locationObs || 'El cliente no escribio una descripcion';
    

    orderMap.setView([manualLocation.lat || sistemLocation.lat , manualLocation.lng || sistemLocation.lng], 16);
    marker.setLatLng([manualLocation.lat || sistemLocation.lat , manualLocation.lng || sistemLocation.lng]); 
}


let allOrdersMap = L.map('allOrdersMap').setView([-34.9087642861, -54.9581809946], 16);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(allOrdersMap);


function icon ({
    iconUrl = "../assets/leaflet/green-icon.png" ,
    shadowUrl =  "../assets/leaflet/icon-shadow.png",
    iconSize =     [32, 50], // size of the icon
    shadowSize =   [50, 40], // size of the shadow
    iconAnchor =  [16, 50], // point of the icon which will correspond to marker's location
    shadowAnchor = [0, 40],  // the same for the shadow
    popupAnchor =  [0, -30] // point from which the popup should open relative to the iconAnchor
})
{
    return L.icon({
        iconUrl ,
        shadowUrl,
        iconSize,
        shadowSize,
        iconAnchor,
        shadowAnchor,
        popupAnchor
        })
}


let greenIcon = new icon({iconUrl: "../assets/leaflet/green-icon.png" });

let yellowIcon = new icon({iconUrl: "../assets/leaflet/yellow-icon.png" });

let redIcon = new icon({iconUrl: "../assets/leaflet/red-icon.png"});



export function addMarker (orders){

  allOrdersMap.eachLayer((layer) => {

        layer.remove();
    
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(allOrdersMap);  
    



orders.map((order)=>{
        const delayedTime = parseInt((Date.now() - order.date) / 60000);

    let delayedIcon;

    if (delayedTime < 20){
        delayedIcon = greenIcon
    }else if (delayedTime < 40){
        delayedIcon = yellowIcon
    } else {
        delayedIcon = redIcon
    };

    


    L.marker([
        order.location.manualLocation.lat || order.location.sistemLocation.lat, 
        order.location.manualLocation.lng || order.location.sistemLocation.lng
    ],
    {icon: delayedIcon})
    .addTo(allOrdersMap)
    .bindPopup(`
    <span> ${order.name} </span>
    <div> demora: <span>${delayedTime} minutos</span></div>           
    <button id= "btn-popUp-leaflet" class="primary-button inactive">ver</button>`
    ,
    {
        className: 'popUpMarker'
    }).on('click', ()=> {      
       setTimeout(btnLeafletFunction,500,order)
    }) ;
    

    });

    function btnLeafletFunction(order){
        const popUpBtn = document.querySelector('#btn-popUp-leaflet')
        popUpBtn.addEventListener('click', function(){
            loadChart(order);
            toggleVisibility(sectionAllOrdersLocations);
            toggleVisibility(cartCard)
            
        })
        popUpBtn.classList.remove('inactive');
        
    };

    allOrdersMap.fitBounds([
        ...orders.map(order=>[
            order.location.manualLocation.lat || order.location.sistemLocation.lat, 
            order.location.manualLocation.lng || order.location.sistemLocation.lng
        ])
    ]);

   
    
    
};

