import express from 'express';
const Router = express();

import adminpanel from './admin';
Router.use('/panel',adminpanel);
Router.use('/panel',(req,res)=>{
    console.log("admin")
    res.send('ok')
})

export default Router;
