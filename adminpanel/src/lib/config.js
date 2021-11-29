
let key = {};
// var EnvName = 'demoVib';
// var EnvName = 'demoVibnew';
 var EnvName = 'local';
// var EnvName = 'production';
// var EnvName = 'demo';
let IPFS_IMG = "https://ipfs.infura.io/ipfs"
let networkVersion='56'
let decimalValues = 1000000000000000000;
let toasterOption = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}
if (EnvName === "production") {
  
}
 else if(EnvName === "demo") {
    var exchangeAddress = "0xb45C318F00ac28b815E9CB91903Fe02CD836cFdC";
    var adminaddress = "0x15ef25d309ba26f84771eb2de7043b1194b02bcf";
    var single = "0x44F93237d73e66aCbDe6670b94503505362AEabe";
    var multiple = "0xEb4E27b88dddFcCf10070A6310245b9e4dD7dFa2";
    var API_URL = 'https://api.artii.org';
    var IMAGE_URL = 'https://api.artii.org/images/user';
    var PORT = 2053;
}
else if(EnvName === "local") {
    var exchangeAddress = "0xb45C318F00ac28b815E9CB91903Fe02CD836cFdC";
    var adminaddress = "0x15ef25d309ba26f84771eb2de7043b1194b02bcf";
    var single = "0x55A561AbE39707E4Ac831d61D2dC231B1CF6B7a5";
    var multiple = "0xB4409Ef41437F984Bf63e78bC1CFd3a093b1769d";
    // var API_URL = 'http://54.87.227.212';
    // var multiple = "0x7b18C8CEE53574CCDd43cEf30f3d3f243a38B63c";
    // var IMAGE_URL = 'http://54.87.227.212:2053/images/user';
    var API_URL = 'http://localhost';
    var IMAGE_URL = 'http://localhost:4003/images/user';
    var PORT = 4003;
}
else if(EnvName === "demoVib"){
  
}
else if(EnvName === "demoVibnew"){

}
key = {
    secretOrKey: "",
    Recaptchakey: "",
    API:`${API_URL}:${PORT}/v1`,
    IMAGE_URL:IMAGE_URL,
    exchangeAddress:exchangeAddress,
    toasterOption:toasterOption,
    IPFS_IMG:IPFS_IMG,
    networkVersion:networkVersion,
    singleAddress : single,
    multipleAddress : multiple,
    adminaddress:adminaddress,
    decimalValues:decimalValues
};

export default key;