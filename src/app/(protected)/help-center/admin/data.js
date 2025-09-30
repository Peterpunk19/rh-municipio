const helpCategories = [
 {
  id: 1,
  displayName: "Inicio de Sesión",
  articles: [
   {
    displayName: "Acceder al sistema RH Municipio",
    url: "01"
   },
  ]
 },
 {
  id: 2,
  displayName: "Ejemplo",
  articles: [
   {
    displayName: "Articulo 02",
    url: "02"
   },
   {
    displayName: "Articulo 03",
    url: "03",
    children: [
     {
      displayName: "Articulo 03.1",
      url: "031",
     },
    ]
   },
  ]
 },
];

export default helpCategories;