const allowZipCodesPrefix = [
'00', // CdMx
'01', // CdMx
'02', // CdMx
'03', // CdMx
'04', // CdMx
'05', // CdMx
'06', // CdMx
'07', // CdMx
'08', // CdMx
'09', // CdMx
'10', // CdMx
'11', // CdMx
'12', // CdMx
'13', // CdMx
'14', // CdMx
'15', // CdMx
'16', // CdMx
'52', // Naucalpan
'53', // 
'54', // México, Tlalnepantla
'55', // México, Ecatepec
'56', // México, Chalco - Texcoco
'57', // México, Neza
'44', // Guadalajara Jalisco
'45', // Zapopan Jalisco
'76'  // Querétaro
] 

const cylinderAllowZipCodesPrefix = [
  '44',
  '45'
]

function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}

function validateZipCode (zipCode) {
  const obj = zipCode.substring(0,2)
  return include(allowZipCodesPrefix, obj)
}

function validateZipCodeForCylinder (zipCode) {
  const obj = zipCode.substring(0,2)
  return include(cylinderAllowZipCodesPrefix, obj)
}
