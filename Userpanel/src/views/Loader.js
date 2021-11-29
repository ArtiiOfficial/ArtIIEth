import React from 'react';
import Lod from '../assets/images/loader.png';
export default function Loader(){
return(
             <div>
                 <div id="loader_div_modal" className="popup_loader">  
                 <img src={Lod} className="logo_load_modal spin_round" id="logo_spin_modal" /> 
                

             <p style={{marginTop:70,marginLeft:-100}}>Loading ..... Please Wait</p>
               </div>  
               </div>

)}