const ENV = 'prod'
const DISCOUNT_FIRST_BUY = 100.0
const FEE = 20.0

const normalOptions = [
  { value: '09:00:00', text: 'De: 08:00 am a 09:00 am', numeric: 8 },
  { value: '10:00:00', text: 'De: 09:00 am a 10:00 am', numeric: 9 },
  { value: '11:00:00', text: 'De: 10:00 am a 11:00 am', numeric: 10 },
  { value: '12:00:00', text: 'De: 11:00 am a 12:00 pm', numeric: 11 },
  { value: '13:00:00', text: 'De: 12:00 pm a 01:00 pm', numeric: 12 },
  { value: '14:00:00', text: 'De: 01:00 pm a 02:00 pm', numeric: 13 },
  { value: '15:00:00', text: 'De: 02:00 pm a 03:00 pm', numeric: 14 },
  { value: '16:00:00', text: 'De: 03:00 pm a 04:00 pm', numeric: 15 },
  { value: '17:00:00', text: 'De: 04:00 pm a 05:00 pm', numeric: 16 }
]

const optionsWeekend = [
  { value: '10:00:00', text: 'De: 08:00 am a 10:00 am', numeric: 8 },
  { value: '12:00:00', text: 'De: 10:00 am a 12:00 am', numeric: 9 },
  { value: '14:00:00', text: 'De: 12:00 am a 14:00 am', numeric: 12 }
]

document.onkeydown = function (t) {
  if (t.which == 9) {
    return false;
  }
}

/**
 * 
 * @param {Date} date 
 */
function getScheduleOptions(date) {
  const dayOfWeek = date.getDay()
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    return { isWeekend: true, options: optionsWeekend }
  }
  return { isWeekend: false, options: normalOptions }
}


function showScheduleLabels(isWeekend, hours) {
  if (hours.length <= 0) {
    document.getElementById("scheduleOutOfRangelbl").hidden = false
    document.getElementById("wekendLbl").hidden = true
  } else {
    document.getElementById("scheduleOutOfRangelbl").hidden = true
    if (isWeekend) {
      document.getElementById("wekendLbl").hidden = false
    } else {
      document.getElementById("wekendLbl").hidden = true
    }
  }
}


/**
* Pupulate schedule
*/
function populateTodaySchedule() {
  // Populate calendar when user select: today
  const currentDate = new Date()
  const hour = currentDate.getHours() + 2
  const datePart = currentDate.toLocaleDateString()
  const date = datePart.split('/')
  const schedule = getScheduleOptions(currentDate)
  var hours = schedule.options.filter(function (item) {
    return item.numeric >= hour;
  });
  var options = ['<option value=\'\' disabled>Sin horarios disponibles</option>']
  if (hours.length > 0) {
    options = hours.map(item => `<option value=${date[2]}-${date[1].padStart(2, '0')}-${date[0].padStart(2, '0')}T${item.value}>${item.text}</option>`).join('\n')
  }
  showScheduleLabels(schedule.isWeekend, hours)
  const calendar = document.getElementById("timeframe")
  calendar.innerHTML = options
}

/**
 * Populate schedule for next day.
 */
function populateTomorrowSchedule() {
  var currentDate = new Date()
  currentDate.setDate(currentDate.getDate() + 1);
  const datePart = currentDate.toLocaleDateString()
  const date = datePart.split('/')
  const schedule = getScheduleOptions(currentDate)
  var options = schedule.options.map(item => `<option value=${date[2]}-${date[1].padStart(2, '0')}-${date[0].padStart(2, '0')}T${item.value}>${item.text}</option>`).join('\n')
  const calendar = document.getElementById("timeframe")
  calendar.innerHTML = options
  showScheduleLabels(schedule.isWeekend, options)
}


const cleanAddress = document.getElementById("cleanAddress")
cleanAddress.onclick = function() {
  document.getElementById("address").value = ''
  document.getElementById("street").value = ''
  document.getElementById("sublocality").value = ''
  document.getElementById('locality').value = ''
  document.getElementById('state').value = ''
  document.getElementById('zipCode').value = ''
  document.getElementById('latitude').value = ''
  document.getElementById('longitude').value = ''
  document.getElementById('streetNumber').value = ''
  document.getElementById('reference').value = ''
  document.getElementById('addressIsFix').value = 'false'  
}

const tomorrow = document.getElementById("manana");
tomorrow.onclick = function () {
  const dayOfService = document.getElementById("dayOfService")
  dayOfService.value = 'Mañana'
  populateTomorrowSchedule()
}

const today = document.getElementById("hoy");
today.onclick = function () {
  const dayOfService = document.getElementById("dayOfService")
  dayOfService.value = 'Hoy'
  populateTodaySchedule()
}

// When select cylinder.
const cylinder = document.getElementById("cylinder");
cylinder.onclick = function () {
  mixpanel.track("Selecciono Cilindro", { "Tipo de Gas": "Cilindro" })
  document.getElementById("serviceTypeLabel").hidden = false
  document.getElementById("nextbutton").textContent = 'Cerrar'
  document.getElementById("nextbutton").onclick = function () { MicroModal.close('createorder') }
}

// When select stationary
const stationary = document.getElementById("stationary");
stationary.onclick = function () {
  document.getElementById("serviceTypeLabel").hidden = true
  document.getElementById("nextbutton").hidden = false
  document.getElementById("nextbutton").textContent = 'Continuar'
  document.getElementById("nextbutton").onclick = function () { toNEXT() }
  toNEXT()
}

const backButton = document.getElementById("backbutton")
backButton.onclick = function () {
  if (step === 1) {
    document.getElementById("nextbutton").textContent = 'Continuar'
    document.getElementById("nextbutton").onclick = function () { toNEXT() }
    toPREV()
  } else {
    toPREV()
  }
}

const amount = document.getElementById("amount")
const amounts = document.getElementById("quantity").querySelectorAll("input")
Array.from(amounts).forEach(card => {
  card.onclick = function () {
    if (card.type === 'radio' && card.value) {
      amount.value = card.value
    }
  }
})

amount.onkeyup = function () {
  const rows = document.getElementById("quantity").querySelectorAll("input")
  Array.from(rows).forEach(element => {
    if (element.checked) {
      element.checked = false
    }
  })
}


// When select chash
const cash = document.getElementById("cash");
cash.onclick = function () {
  toNEXT()
}

// When select card
const terminal = document.getElementById("card");
terminal.onclick = function () {
  toNEXT()
}

// Avanzar cuando completa el teléfono.
const phone = document.getElementById("phone");
phone.onkeyup = function () {
  if (isValidContact()) {
    toNEXT()
  }
}


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
  const amount = document.getElementById("amount")
  return new Number(amount.value)
}


/**
 * 
 */

function getSchedule() {
  const dayOfService = document.getElementById("dayOfService")
  const options = document.getElementById("timeframe").querySelectorAll("option")
  var selected = null
  if (options) {
    options.forEach(option => {
      if (option.selected) {
        selected = { day: dayOfService.value, text: option.text, value: option.value }
      }
    })
  }
  return selected
}

/**
 * Get discount by voucher code.
 */
async function getDiscountByVoucherCode(phoneNumber) {
  const field = document.getElementById("cuponCode")
  if (field && field.value) {
    const voucher = await checkPromocode(phoneNumber, field.value.toUpperCase()) 
    if (voucher) {
      voucher.code = field.value.toUpperCase()
      return voucher
    }
  }
  return null
}

/**
 * Get contact information from screen.
 */
function getContactInfo() {
  const name = document.getElementById("name").value
  const phone = document.getElementById("phone").value
  return {
    name,
    phone
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
  const reference = document.getElementById('reference')
  const addressIsFix = document.getElementById('addressIsFix').value === 'true'

  data = {
    address: address.value,
    street: street.value,
    streetNumber: streetNumber.value,
    sublocality: sublocality.value,
    locality: locality.value,
    state: state.value,
    zipCode: zipCode.value,
    latitude: latitude.value,
    longitude: longitude.value,
    reference: reference.value,
    addressIsFix
  }
  return data
}

/**
 * Get payment type from screen.
 */
function getPaymentType() {
  const rows = document.getElementById("paymentType").querySelectorAll("input")
  var paymentType = ""
  var selected = false
  Array.from(rows).forEach(element => {
    if (element.checked) {
      selected = true
      paymentType = element.value
    }
  })
  if (selected) {
    if (paymentType === 'card') {
      return { type: 2, value: "Con Terminal" }
    }
    return { type: 1, value: "En Efectivo" }
  }
  return null
}

/**
 * Get discount from cupon or discount for first buy.
 */
async function calculateDiscount(firstBuy, phoneNumber) {
  const voucher = await getDiscountByVoucherCode(phoneNumber)
  if (voucher) {
    return { value: voucher.discount, byCupon: true, code: voucher.code, firstBuy }
  }
  if(firstBuy) {
    return { value: DISCOUNT_FIRST_BUY, byCupon: false, firstBuy }
  }
  return { value: 0, byCupon: false, firstBuy }  
}

/**
 * 
 * @param {*} quantity 
 * @param {*} discount 
 */
function calculateTotalOfService(quantity, discount) {
  return (new Number(quantity) + new Number(FEE)) - new Number(discount.value)
}


/**
 * Show the order summary.
 */
async function showOrderSummary() {
  document.getElementById("feeValue").textContent = "$" + FEE

  const schedule = getSchedule()
  document.getElementById("scheduleValue").textContent = schedule.day + ', ' + schedule.text

  const contactData = getContactInfo()
  document.getElementById("nameValue").textContent = contactData.name
  document.getElementById("phoneValue").textContent = contactData.phone

  const address = getAddress()
  var addressText = ""
  if (address.zipCode) {
    addressText = address.address + ", CP. " + address.zipCode
  } else {
    addressText = address.address
  }
  if (address.reference) {
    addressText = addressText + ". " + address.reference
  }
  document.getElementById("addressValue").textContent = addressText

  const paymentType = getPaymentType()
  document.getElementById("paymentTypeValue").textContent = paymentType.value

  const quantity = getQuantity()
  document.getElementById("quantityValue").textContent = "$" + quantity

  const firstBuy = await isFirstBuy(contactData.phone)
  const discount = await calculateDiscount(firstBuy, contactData.phone)
  const total = calculateTotalOfService(quantity, discount)
  
  var discountText = ''
  if (discount.byCupon) {
    discountText = "$" + discount.value + ", por usar tu cupón: " + discount.code
  } else if (discount.firstBuy) {
    discountText = "$" + discount.value + ", por primera compra"
  } else {
    discountText = "$" + discount.value
  }
  document.getElementById("discountValue").textContent = discountText

  document.getElementById("totalValue").textContent = "$" + total
  mixpanel.track("Llego al Resumen de Pedido")
  sendEmail(contactData.name, contactData.phone, quantity, discountText, total, addressText, schedule.day + ', ' + schedule.text, paymentType.value)
}

/**
 * VALIDATORS
 */


function isValidStep(step) {
  var isValidate = true
  switch (step) {
    case 1:
      isValidate = isValidServiceType()
      if(isValidate) {
        fbq('track', 'Lead');
      }      
      break;
    case 2:
      isValidate = isValidQuantity()
      break;
    case 3:
      isValidate = isValidContact()
      if(isValidate) {
        fbq('track', 'Contact'); 
      }
      break;
    case 4:
      isValidate = isValidAddress()
      break;
    case 5:
      isValidate = isValidSchedule()
      if(isValidate) {
        fbq('track', 'Schedule'); 
      }
      break;
    case 6:
      isValidate = isValidPaymentMethod()
      if(isValidate) {
        fbq('track', 'AddPaymentInfo');  
      }
      break;
    default:
      break;
  }
  return isValidate
}

function isValidServiceType() {
  const serviceType = getServiceType()
  if (serviceType && serviceType === 'stationary') {
    mixpanel.track("Selecciono Tipo de Gas Estacionario", { "Tipo de Gas": "Estacionario" })
    return true
  }
  return false
}


function isValidPaymentMethod() {
  const paymentType = getPaymentType()
  if (paymentType) {
    mixpanel.track("Selecciono Forma de Pago", { "Forma de Pago": paymentType })
    return true
  }
  return false
}

function isValidSchedule() {
  const schedule = getSchedule()
  if (schedule && schedule.day !== "") {
    mixpanel.track("Selecciono horario valido", { "Horario": schedule })
    return true
  }
  return false
}

function isValidQuantity() {
  const quantity = getQuantity()
  if (quantity >= 400) {
    mixpanel.track("Selecciono Cantidad de Gas", { "Cantidad": quantity })
    return true
  }
  return false
}

function fillAddresses(addresses) {
  if(addresses && addresses.length > 0) {
    if(addresses.length === 1) {
      const previousAddres = addresses[0]
      if(previousAddres.latitude != '00000000000' &&  previousAddres.longitude != '00000000000' && document.getElementById("address").value === '') {
        const addressText = previousAddres.street + ' ' +  previousAddres.numExt + ' ' +previousAddres.suburb + ' ' + previousAddres.municipality + ' ' + previousAddres.state
        document.getElementById("address").value = addressText
        document.getElementById("street").value = previousAddres.street
        document.getElementById("sublocality").value = previousAddres.suburb
        document.getElementById('locality').value = previousAddres.municipality
        document.getElementById('state').value = previousAddres.state
        document.getElementById('zipCode').value = previousAddres.zipcode
        document.getElementById('streetNumber').value = previousAddres.numExt
        document.getElementById('reference').value =previousAddres.reference
        document.getElementById('latitude').value = previousAddres.latitude
        document.getElementById('longitude').value = previousAddres.longitude
        document.getElementById('addressIsFix').value = 'true'

      }
    }
  }
  
}

function fixDataAddress(address) {
  console.log('Se va a corregir: ', address)
  if (address.state === '' || address.locality === '' || address.sublocality === '') {
    console.log('Entra a corrección')
    findZipCode(address.zipCode).then(data => {
      if(Array.isArray(data)){
        const item = data[0]
        console.log('ENcontrado: ', item)
        document.getElementById("sublocality").value = item.response.asentamiento
        document.getElementById('locality').value = item.response.municipio
        document.getElementById('state').value = item.response.estado
        document.getElementById('addressIsFix').value = 'true'
      }
    })
  }
}

function isValidContact() {
  const contactData = getContactInfo()
  if (contactData.name && (contactData.phone && contactData.phone.length >= 10)) {
    getAddresses(contactData.phone).then( addresses => {
      if(addresses){
        fillAddresses(addresses)
      }
    })
    mixpanel.track("Lleno Datos de Contacto", { "Nombre": contactData.name, "Telefono": contactData.phone })
    return true
  }
  document.getElementById("name").required = true
  document.getElementById("phone").required = true
  return false
}

function isValidAddress() {
  const address = getAddress()
  var zipCodeIsValid = false
  if (address.zipCode !== '') {
    zipCodeIsValid = validateZipCode(address.zipCode)
    if (!zipCodeIsValid) {
      document.getElementById("invalidZipCodeText").hidden = false
    } else {
      document.getElementById("invalidZipCodeText").hidden = true
    }
  }
  if (address.address !== '' && zipCodeIsValid) {
    fixDataAddress(address)
    mixpanel.track("Selecciono Direccion", { "Dirección": address.address })
    return true
  }
  document.getElementById("address").required = true
  document.getElementById("zipCode").required = true
  return false
}

/**
 * Validator for telephone input
 * @param {*} textbox 
 * @param {*} inputFilter 
 */
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    textbox.addEventListener(event, function () {
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
setInputFilter(document.getElementById("phone"), function (value) {
  return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});


/**
 * SERVICE BACKEND
 */


function getUrlService() {
  const dev = {
    urlEvents: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/logs',
    urlService: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/services',
    urlSms: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/sms',
    urlHasBuy: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/services/${phoneNumber}/has-back-buy',
    urlPromocodes: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/services/promocodes/${promocode}/discount?phoneNumber=${phoneNumber}',
    urlAddresses: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/customer/${phoneNumber}/address',
    urlZipCode: 'https://api-sepomex.hckdrk.mx/query/info_cp/${zipCode}',
    urlEmail: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/mails',
    apikey: 'HrwtPKFdr42LrRbRWlHV3alw5iyN3XFo6Ggbm6ry'
  }

  const qa = {
    urlEvents: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1/logs',
    urlService: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1services',
    urlSms: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1/sms',
    urlHasBuy: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1/services/${phoneNumber}/has-back-buy',
    urlPromocodes: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1/services/promocodes/${promocode}/discount?phoneNumber=${phoneNumber}',
    urlAddresses: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1/customer/${phoneNumber}/address',
    urlZipCode: 'https://api-sepomex.hckdrk.mx/query/info_cp/${zipCode}',
    urlEmail: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/mails',
    apikey: '48FofE5GOB7mw9GL9nvi27rZ7yt2CtKE5ouM7g2A'
  }

  const prod = {
    urlEvents: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/logs',
    urlService: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/services',
    urlSms: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/sms',
    urlHasBuy: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/services/${phoneNumber}/has-back-buy',
    urlPromocodes: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/services/promocodes/${promocode}/discount?phoneNumber=${phoneNumber}',
    urlAddresses: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/customer/${phoneNumber}/address',
    urlZipCode: 'https://api-sepomex.hckdrk.mx/query/info_cp/${zipCode}',
    urlEmail: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/mails',
    apikey: 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
  }

  if (ENV === 'dev') {
    return dev
  } else if (ENV === 'qa') {
    return qa
  }
  return prod
}

function checkPromocode(phoneNumber, promocode) {
  const service = getUrlService()
  var url = service.urlPromocodes.replace('${phoneNumber}', phoneNumber)
  url = url.replace('${promocode}', promocode)
  return fetch(url, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': service.apikey
    }
  }).then(function (response) {
    if(response.status === 200) {
      return response.text();
    } 
    return null
  }).then(function (data) {
      if(data) {
        return JSON.parse(data)  
      }
      return null
    })
    .catch(function (err) {
      console.log("ERROR:", err);
      return null
    });
}

function getAddresses(phoneNumber) {
  const service = getUrlService()
  const url = service.urlAddresses.replace('${phoneNumber}', phoneNumber)
  return fetch(url, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': service.apikey
    }
  }).then(function (response) {
    if(response.status === 200) {
      return response.text();
    } 
    return null
  }).then(function (data) {
      if(data) {
        return JSON.parse(data)  
      }
      return null
    })
    .catch(function (err) {
      console.log("ERROR:", err);
      return null
    });
}

function findZipCode(zipCode) {
  const service = getUrlService()
  const url = service.urlZipCode.replace('${zipCode}', zipCode)
  return fetch(url, {
    mode: 'cors',
    method: 'GET'
  }).then(function (response) {
    if(response.status === 200) {
      return response.text();
    } 
    return null
  }).then(function (data) {
      if(data) {
        return JSON.parse(data)  
      }
      return null
    })
    .catch(function (err) {
      console.log("ERROR:", err);
      return null
    });
}

function isFirstBuy(phoneNumber) {
  const service = getUrlService()
  const url = service.urlHasBuy.replace('${phoneNumber}', phoneNumber)
  return fetch(url, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': service.apikey
    }
  }).then(function (response) {
    return response.text();
  }).then(function (data) {
      const json = JSON.parse(data)
      return !json.hasBuyBack ? true : false 
    })
    .catch(function (err) {
      console.log("ERROR:", err);
      return true
    });
}

function registerEvent(key, data) {
  const service = getUrlService()
  const body = JSON.stringify({
    key,
    data
  })
  fetch(service.urlEvents, {
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
      console.error("ERROR:", err);
    });
}

function makeRequest(data) {
  const service = getUrlService()
  const body = JSON.stringify(data)
  console.log('BODY REQUEST: ', body)
  
  fetch(service.urlService, {
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
      console.error("ERROR:", err);
    });
  sendConfirmationSMS(data.customerData.phoneNumber)
}

/**
 * 
 */
async function createServiceOrder() {
  const quantity = getQuantity()
  const contactData = getContactInfo()
  const firstBuy = await isFirstBuy(contactData.phone)
  const discount = await calculateDiscount(firstBuy, contactData.phone)
  const address = getAddress()
  const paymentType = getPaymentType()
  const schedule = getSchedule()

  data = {
    amount: new Number(quantity * 100),
    fee: new Number(FEE * 100),
    discount: new Number(discount.value * 100),
    serviceDate: schedule.value + '.005Z',
    paymentTypeId: paymentType.type,
    customerData: {
      phoneNumber: contactData.phone,
      deviceType: 'web',
      name: contactData.name,
      address: {
        state: address.state || 'Unknown',
        street: address.street || address.address.substring(0, 50),
        municipality: address.locality || 'Unknown',
        suburb: address.sublocality || 'Unknown',
        numExt: address.streetNumber || 'SN',
        //numInt: '',
        zipcode: address.zipCode || '00000',
        longitude: address.longitude || '00000000000',
        latitude: address.latitude || '00000000000'
      }
    },
    params: window.location.search || ''
  }

  if (address.reference) {
    data.customerData.address.reference = address.reference
  }

  if (discount.byCupon) {
    data.promocode = discount.code
  }

  makeRequest(data)

  mixpanel.track("Realizo Pedido", { "Información de Pedido": data })
  dataLayer.push({ 'event': 'realizopedido' })
  // Reg on fb.
  fbq('track', 'Purchase', {value: 45.00, currency: 'MXN'});
}


function sendConfirmationSMS(phoneNumber) {
  const service = getUrlService()
  var sms = 'Servicio agendado con éxito, recibirás un WhatsApp de confirmación antes de la hora de tu servicio. Gracias por usar OKBOY.'
  const body = {
    recipient: `+52${phoneNumber}`,
    text: sms,
  }
  if (ENV === 'prod') {
    fetch(service.urlSms, {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': service.apikey
      }
    }).then(function (response) {
      console.log(response)
    })
    console.log('Confirmation SMS sent.')
  }

}


function sendEmail(name, phone, amount, discount, total, address, schedule, paymentType) {
  var message = '<b> Este es un cliente potencial de OKBOY: </b> <br>'
    + '<b> Nombre: </b>' + name + ' <br>'
    + '<b> Télefono: </b>' + phone + ' <br>'
    + '<b> Dirección del servicio: </b>' + address + ' <br>'
    + '<b> Cantidad de Gas: </b> $' + amount + ' <br>'
    + '<b> Descuento: </b>' +  discount + ' <br>' 
    + '<b> Total a pagar: </b> $' +  total + ' <br>' 
    + '<b> Fecha y Hora: </b>' + schedule + ' <br>'
    + '<b> Forma de Pago: </b>' + paymentType + ' <br>'


  const service = getUrlService()
  fetch(service.urlEmail, {
    mode: 'cors',
    method: 'POST',
    body: JSON.stringify({
      to: 'julio@vetta.io, didier@vetta.io, christian@vetta.io, hola@okboy.app, ventas@okoby.app, victorh@vetta.io',
      subject: 'Cliente Potencial - OKBOY',
      message: message,
      isHtml: true
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': service.apikey
    }
  }).then(function (response) {
    console.log(response)
  })
}