const WEBURL="http://localhost:8000/clients"
const inputTel=document.querySelector("#inputTel")
const inputNom=document.querySelector("#inputNom")
const inputPrenom=document.querySelector("#inputPrenom")
const inputAdresse=document.querySelector("#inputAdresse")
const tBody=document.querySelector("#tBody")

// Declaration tableau 
let clients = [];

// Recuperation de donnees  
fetchDatas().then(data => {
  clients = data;
})



document.addEventListener("DOMContentLoaded", async (event) => {
  await fetchDatas();
  inputTel.addEventListener("change",function(){
    // alert(inputTel.value)
   const client=findClientByTel(inputTel.value.trim());
   if(client!=null){
    inputTel.classList.remove("is-invalid")
    inputTel.classList.add("is-valid")
    inputTel.nextElementSibling.textContent = "";
     tBody.innerHTML=generateTbody(client.dette)
  }
    else{
      inputTel.classList.remove("is-valid")
      inputTel.classList.add("is-invalid")
      inputTel.nextElementSibling.textContent = "Ce client n'existe pas";
    }      
   
 })
// tBody.innerHTML=generateTbody(clients.dette)

 //Events



  })
  

  //Functions

  
  function findClientByTel(tel) {
    return clients.find(function (u) {
        return u.telephone==tel
    })}
                               

  
  async function fetchDatas(){
    let response= await fetch(WEBURL);
    const datas=await response.json();
    return datas;
}  


function generateTbody(elements) {
  console.log(elements);
  let html = ""
  for (const element of elements) {
    html += generateTr(element)
  }
  return html
}

//generer un tr
function generateTr(element) {
  return `<tr"> 
        <td>${element.date}</td>
        <td>${element.montant} </td>
        <td >${element.verse}</td>
        <td>${element.montant-element.verse}</td>
      </tr>`
}



