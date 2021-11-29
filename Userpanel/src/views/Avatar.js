import React from 'react';

import Avatar from 'react-string-avatar';
export default function Avatars(props){
// console.log('props',props);
var { classValue } = props;
return(
        // <div className="img_avatar_space">
        <div>
                {/* <Avatar initials={item!==undefined&&(item!=""&&item.substring(2, 4).toUpperCase())} roundShape="true" /> */}
                <img src={require('../assets/images/Avatars.png')} className={classValue}/>        
        </div>

)}