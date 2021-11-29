import React from 'react';
import Lod from '../assets/img/loader.png';
export default function Loader(){
return(
             <div>
                 <div id="loader_div_modal" className="popup_loader">  
               </div> 
               <img src={Lod} className="logo_load_modal spin_round" id="logo_spin_modal" /> 
               <p className="logo_text_modal">Don't refresh the page until the transaction completed</p>
               </div>

)}