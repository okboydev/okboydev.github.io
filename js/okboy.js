const ENV = 'prod'
const DISCOUNT_FIRST_BUY = 100.0
const FEE = 20.0

const schedule = [
  { value: '09:00:00', text: 'De: 08:00 am a 09:00 am', numeric: 8},
  { value: '10:00:00', text: 'De: 09:00 am a 10:00 am', numeric: 9},
  { value: '11:00:00', text: 'De: 10:00 am a 11:00 am', numeric: 10},
  { value: '12:00:00', text: 'De: 11:00 am a 12:00 pm', numeric: 11},
  { value: '13:00:00', text: 'De: 12:00 pm a 01:00 pm', numeric: 12},
  { value: '14:00:00', text: 'De: 01:00 pm a 02:00 pm', numeric: 13},
  { value: '15:00:00', text: 'De: 02:00 pm a 03:00 pm', numeric: 14},
  { value: '16:00:00', text: 'De: 03:00 pm a 04:00 pm', numeric: 15},
  { value: '17:00:00', text: 'De: 04:00 pm a 05:00 pm', numeric: 16}
]

/**
 * Pupulate schedule
 */
function populateTodaySchedule() {
  // Populate calendar when user select: today
  const currentDate = new Date()
  console.log(currentDate);
  const hour = currentDate.getHours() + 2
  const datePart = currentDate.toLocaleDateString()
  console.log('this is datepart= ' + datePart)
  const date = datePart.split('/')
  console.log('this is date= '+ datePart)
  var hours = schedule.filter(function(item) {
    return item.numeric >= hour;
  });
  var options = ['<option value=\'\' disabled>Sin horarios disponibles</option>']
  if(hours.length > 0){
    options = hours.map(item => `<option value=${date[2]}-${date[0].padStart(2,'0')}-${date[1].padStart(2,'0')}T${item.value}>${item.text}</option>`).join('\n')
  }
  const calendar = document.getElementById("timeframe")  
  calendar.innerHTML = options
}

/**
 * Populate schedule for next day.
 */
function populateTomorrowSchedule(){
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const datePart = currentDate.toLocaleDateString()
  const date = datePart.split('/')
  var options = schedule.map(item => `<option value=${date[2]}-${date[0].padStart(2,'0')}-${date[1].padStart(2,'0')}T${item.value}>${item.text}</option>`).join('\n')
  const calendar = document.getElementById("timeframe")  
  calendar.innerHTML = options
}

const tomorrow = document.getElementById("manana");
tomorrow.onclick = function() {
  const dayOfService = document.getElementById("dayOfService")
  dayOfService.value = 'Mañana'
  populateTomorrowSchedule() 
}

const today = document.getElementById("hoy");
today.onclick = function() {
  const dayOfService = document.getElementById("dayOfService")
  dayOfService.value = 'Hoy'
  populateTodaySchedule()
}


const cylinder = document.getElementById("cylinder");
cylinder.onclick = function() {
  document.getElementById("serviceTypeLabel").hidden = false
  document.getElementById("nextbutton").textContent = 'Cerrar'
  document.getElementById("nextbutton").onclick = function(){ MicroModal.close('createorder') }
}

const stationary = document.getElementById("stationary");
stationary.onclick = function() {
  document.getElementById("serviceTypeLabel").hidden = true
  document.getElementById("nextbutton").hidden = false
  document.getElementById("nextbutton").textContent = 'Continuar'
  document.getElementById("nextbutton").onclick = function(){ toNEXT() }
}
const backButton = document.getElementById("backbutton")
backButton.onclick = function() {
  if(step === 1) {
    console.log('Entro')
    document.getElementById("nextbutton").textContent = 'Continuar'
    document.getElementById("nextbutton").onclick = function(){ toNEXT() }
    toPREV()
  } else {
    toPREV()
  }
}
//<button id="backbutton" class="bnb off" onclick="toPREV()">Regresar</button>


function getServiceType() {
  const rows = document.getElementById("serviceType").querySelectorAll("input")
  var type = null
  Array.from(rows).forEach(element => {
    if (element.checked) {
      type = element.value
    }
  })
  return type
}


/**
 * Get amount from screen.
 */
function getQuantity() {
  const rows = document.getElementById("quantity").querySelectorAll("input")
  var quantity = 0
  Array.from(rows).forEach(element => {
    if (element.checked) {
      quantity = element.value
    }
  })
  return quantity
}


/**
 * 
 */

 function getSchedule() {
  const dayOfService = document.getElementById("dayOfService") 
  const options = document.getElementById("timeframe").querySelectorAll("option")
  var selected = null
  if(options){
    options.forEach(option => {
      if(option.selected){
        selected = { day: dayOfService.value, text: option.text, value: option.value }
      }
    })
  }
  return selected
 }

/**
 * Get discount by voucher code.
 */
function getDiscountByVoucherCode(){
  var discount = null;
  const field = document.getElementById("cuponCode")
  if(field && field.value){
    const voucher = vouchers[field.value.toUpperCase()]
    if(voucher){
      discount =  { amount: voucher.amount, symbol: voucher.symbol, code: field.value }
    }
  }
  return discount
}

/**
 * Get contact information from screen.
 */
function getContactInfo() {
  const name = document.getElementById("name")
  const phone = document.getElementById("phone")
  return {
    name: name.value,
    phone: phone.value
  }

}

/**
 * Get address from screen
 */
function getAddress() {
  const address = document.getElementById("address")
  const street = document.getElementById("street")
  const sublocality = document.getElementById("sublocality")
  const locality = document.getElementById('locality')
  const state = document.getElementById('state') 
  const zipCode = document.getElementById('zipCode')
  const latitude = document.getElementById('latitude')
  const longitude = document.getElementById('longitude')
  const streetNumber = document.getElementById('streetNumber')
  data = {
    address: address.value,
    street: street.value,
    streetNumber: streetNumber.value,
    sublocality: sublocality.value,
    locality: locality.value,
    state: state.value,
    zipCode: zipCode.value,
    latitude: latitude.value,
    longitude: longitude.value    
  }
  return data
}

/**
 * Get payment type from screen.
 */
function getPaymentType() {
  const rows = document.getElementById("paymentType").querySelectorAll("input")
  var paymentType = ""
  Array.from(rows).forEach(element => {
    if (element.checked) {
      paymentType = element.value
    }
  })
  if (paymentType === 'card') {
    return { type: 2, value: "Con Tarjeta" }
  }
  return {type: 1, value: "En Efectivo"}
}

/**
 * Get discount from cupon or discount for first buy.
 */
function calculateDiscount(amount){
  const voucher = getDiscountByVoucherCode()
  if ( voucher ) {
    if( voucher.symbol === '$') {
      if(voucher.amount > 0) {
        return { value: voucher.amount, byCupon: true, code: voucher.code }
      }
    }
    if( voucher.symbol === '%') {
      const percentage = voucher.amount / 100
      const discount = amount * percentage
      return { value: discount, byCupon: true, code: voucher.code }
    }    
  }

  return { value: DISCOUNT_FIRST_BUY, byCupon: false }
}

/**
 * 
 * @param {*} quantity 
 * @param {*} discount 
 */
function calculateTotalOfService(quantity, discount){
  return (new Number(quantity) + new Number(FEE)) - new Number(discount.value)
}


/**
 * Show the order summary.
 */
function showOrderSummary() {
  const quantity = getQuantity()
  const contactData = getContactInfo()
  const address = getAddress()
  const paymentType = getPaymentType()
  const discount = calculateDiscount(quantity)
  const total = calculateTotalOfService(quantity, discount)
  const schedule = getSchedule()

  document.getElementById("scheduleValue").textContent = schedule.day + ', ' + schedule.text
  document.getElementById("quantityValue").textContent = "$" + quantity
  
  if(discount.byCupon) {
    document.getElementById("discountValue").textContent = "$" + discount.value + ", por usar tu cupón: " + discount.code
  } else {
    document.getElementById("discountValue").textContent = "$" + discount.value + ", por primera compra"
  }

  document.getElementById("feeValue").textContent = "$" + FEE
  document.getElementById("totalValue").textContent = "$" + total
  document.getElementById("nameValue").textContent = contactData.name
  document.getElementById("phoneValue").textContent = contactData.phone
  
  if (address.zipCode) {
    document.getElementById("addressValue").textContent = address.address + ", CP. " + address.zipCode
  } else {
    document.getElementById("addressValue").textContent = address.address
  }

  document.getElementById("paymentTypeValue").textContent = paymentType.value
}

/**
 * VALIDATORS
 */


function isValidStep(step) {
  var isValidate = true
  switch (step) {
    case 1:
      isValidate = isValidServiceType()
      break;
    case 2: 
      isValidate = isValidQuantity()
      break;
    case 3:
      isValidate = isValidContact()
      break;
    case 4:
      isValidate = isValidAddress()
      break;
    case 5:
      isValidate = isValidSchedule()
      break;
    case 6:
      isValidate = isValidPaymentMethod()
      break;  
    default:
      break;
  }
  return isValidate
}

function isValidServiceType(){
  const serviceType = getServiceType()
  if( serviceType && serviceType === 'stationary'){
      return true
  }
  return false
}


function isValidPaymentMethod(){
  const paymentType = getPaymentType()
  if(paymentType){
    return true
  }
  return false
}

function isValidSchedule(){
  const schedule = getSchedule()
  if(schedule) {
    return true
  }
  return false
}

function isValidQuantity() {
  const quantity = getQuantity()
  if (quantity > 0) {
    return true
  }
  return
}

function isValidContact() {
  const contactData = getContactInfo()
  if (contactData.name && contactData.phone) {
    return true
  }
  return false
}

function isValidAddress() {
  const address = getAddress()
  if (address.address) {
    return true
  }
  return false
}

/**
 * Validator for telephone input
 * @param {*} textbox 
 * @param {*} inputFilter 
 */
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}
setInputFilter(document.getElementById("phone"), function(value) {
  return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});


/**
 * SERVICE BACKEND
 */


function getUrlService(){
  const dev = { 
    url: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/services',
    apikey: 'HrwtPKFdr42LrRbRWlHV3alw5iyN3XFo6Ggbm6ry'
  }

  const qa = { 
    url: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1services',
    apikey: '48FofE5GOB7mw9GL9nvi27rZ7yt2CtKE5ouM7g2A'
  }

  const prod = {
    url: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/services',
    apikey: 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
  }

  if(ENV === 'dev') {
    return dev
  } else if (ENV === 'qa') {
    return qa
  }
  return prod
} 


function makeRequest(data) {
  const service = getUrlService()
  const body = JSON.stringify(data)
  console.log('BODY REQUEST: ', body)
  fetch(service.url, {
    mode: 'cors',
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': service.apikey
    }
  }).then(function (response) {
    return response.text();
  })
    .then(function (data) {
      console.log('data = ', data);
    })
    .catch(function (err) {
      console.log('AN ERROR: ', data)
      console.error("ERROR:", err);
    });

}

/**
 * 
 */
function createServiceOrder() {
  const quantity = getQuantity()
  const discount = calculateDiscount(quantity)
  const contactData = getContactInfo()
  const address = getAddress()
  const paymentType = getPaymentType()
  const schedule = getSchedule()

  data = {
    amount: new Number(quantity * 100),
    fee: new Number(FEE * 100),
    discount: new Number(discount.value * 100),
    serviceDate: schedule.value+'.005Z',
    paymentTypeId: paymentType.type,
    customerData: {
      phoneNumber: contactData.phone,
      deviceType: 'web',
      address: {
        state: address.state,
        street: address.street || address.address.substring(0,50),
        municipality: address.locality,
        suburb: address.sublocality,
        numExt: address.streetNumber || 'SN',
        //numInt: '',
        zipcode: address.zipCode || '00000',
        longitude: address.longitude,
        latitude: address.latitude
      }
    }
  }
  //sendEmail(quantity, contactData, address, paymentType)
  makeRequest(data)
  mixpanel.track("Realizo Pedido", {"Información de Pedido": data});
  dataLayer.push({'event': 'realizopedido'})
}