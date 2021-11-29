import axios from "axios";
import config from '../../lib/config';


export const reportFunc = async (postdata) => {
  console.log("check allsssss",postdata)
    try {
      let resp = await axios({
        'method': 'post',
        'url'  :`${config.vUrl}/token/report/reportFunc`,
        data:postdata
       
      });
      return {
        data: resp.data
      }
    }
    catch (err) {
    }
  }

  
export const sociallinksfunction = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'get',
      'url'  :`${config.vUrl}/token/social/sociallinksfunction`,
    });
    console.log("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}

export const faqlists = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'get',
      'url'  :`${config.vUrl}/token/social/faqlists`,
     
     
    });
    console.log("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}


export const getPrivacyVal = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/admin/panel/getPrivacyVal`,
      data:postdata   
    });
    console.log("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}


export const notifications = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/token/notifications`,
      data:postdata   
    });
    console.log("soci1",resp.data)
    return {
      data: resp.data
    }
  }
  catch (err) {
  }

}

export const notificationStatusChange = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.vUrl}/token/notificationStatusChange`,
      data:postdata   
    });
    console.log("soci1",resp.data)
    return {
      data: resp.data.data
    }
  }
  catch (err) {
  }

}


export const getcmslistinhome = async (postdata) => {
  try {
    let resp = await axios({
      'method': 'post',
      'url'  :`${config.Back_URL}/v1/token/use/getcmslistinhome`,
      data:postdata   
    });
    console.log("soci1",resp.data)
    return {
      data: resp.data.data
    }
  }
  catch (err) {
  }

}