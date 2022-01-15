let UsarCloud = true;
let usarServidorProdiccion = true;
export const Urlbase = {
  //auth [0]
  auth:'https://'+(UsarCloud ? (usarServidorProdiccion ? 'tienda724.com':'pruebas.tienda724.com') : 'localhost') + ':8449',
  // tercero [1]
  tercero:'https://'+(UsarCloud ? (usarServidorProdiccion ? 'tienda724.com':'pruebas.tienda724.com') : 'localhost') + ':8446/v1',
  // tienda [2]
  tienda:'https://'+(UsarCloud ? (usarServidorProdiccion ? 'tienda724.com':'pruebas.tienda724.com') : 'localhost') + ':8447/v1',
  // facturacion [3]
  facturacion:'https://'+(UsarCloud ? (usarServidorProdiccion ? 'tienda724.com':'pruebas.tienda724.com') : 'localhost') + ':8448/v1'
};
