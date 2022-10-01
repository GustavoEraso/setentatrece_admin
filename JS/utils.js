import { login, logout } from "./auth.js";
import { btnLogIn , btnLogOut  } from "./index.js"

let currentUser;



const userMenu = document.querySelector('#userMenu');
const imgUser = document.querySelector('#imgUser');
const userName = document.querySelector('#userName');
const UserMenuBtnContainer = document.querySelector('#UserMenuBtnContainer');

const inicioBtnContainer = document.querySelector('#inicioBtnContainer');


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
    toggleVisibility(inicioBtnContainer);
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
    // loadPedidos();
    // asideChartAlertLogin.classList.add('inactive');

  }