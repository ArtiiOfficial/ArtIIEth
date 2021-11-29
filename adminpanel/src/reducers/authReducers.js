import {
    SET_CURRENT_USER,
    USER_ADD,
    USER_LOADING,
    USER_UPDATE,
    USER_REGISTER,
    USER_FORGOT,
    CONTACT,
    SUPPORT,
    SUPPORT_REPLY,
    TRADE,
    ORDER_HISTORY,
    TRADE_HISTORY,
    DYN
} from "../actions/types";
// const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};
export default function(state = initialState, action) {
    switch (action.type) {
        case USER_REGISTER:
            return {
                ...state,
                newuser: action.payload
            };
        case USER_UPDATE:
            return {
                ...state,
                updateprofile: action.payload,
            };
        case USER_FORGOT:
            return {
                ...state,
                forgotuser: action.payload,
            };
        case CONTACT:
           /* //console.lo(action.payload,'action.payload');
            if(typeof action.payload!= 'undefined'){*/
            return {
                ...state,
                contact_us:action.payload,
            };
        case TRADE:
           //console.lo(action.payload,'action.payload');
            return {
                ...state,
                trade:action.payload,
            };
        case DYN:
            //console.lo(action.payload,'action.payload');
            return {
                ...state,
                dyn:action.payload
            };
        case ORDER_HISTORY:
          // //console.lo(action.payload,'action.payload');
            return {
                ...state,
                ordertrade:action.payload,
            };
        case TRADE_HISTORY:
          // //console.lo(action.payload,'action.payload');
            return {
                ...state,
                historytrade:action.payload,
            };
       /* }*/
       case SUPPORT:
            return {
                ...state,
                support:action.payload,
            };
        case SUPPORT_REPLY:
            return {
                ...state,
                supportreply:action.payload,
            };
        case SET_CURRENT_USER:
            return {
                ...state,
               //isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
      
        default:
            return state;
    }
}
