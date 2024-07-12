const WEBURL="http://localhost:8000/clients"
const inputTel=document.querySelector("#inputTel")
const inputNom=document.querySelector("#inputNom")
const inputPrenom=document.querySelector("#inputPrenom")
const inputAdresse=document.querySelector("#inputAdresse")
const tBody=document.querySelector("#tBody")
const pagination=document.querySelector("#pagination")
const elementPerPage=2

// Declaration tableau 
let clients = [];

// Recuperation de donnees  
fetchDatas().then(data => {
  clients = data;
})



document.addEventListener("DOMContentLoaded", async (event) => {
  await fetchDatas();

   //Events
  inputTel.addEventListener("change",function(){
    // alert(inputTel.value)
   const client=findClientByTel(inputTel.value.trim());
   if(client!=null){
    inputTel.classList.remove("is-invalid")
    inputTel.classList.add("is-valid")
    inputTel.nextElementSibling.textContent = "";
    generatePagination(client.dette,pagination,tBody,generateTbody)
  }
    else{
      inputTel.classList.remove("is-valid")
      inputTel.classList.add("is-invalid")
      inputTel.nextElementSibling.textContent = "Ce client n'existe pas";
    }      
   
 })






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
        <td>${element.montant}  </td>
        <td >${element.verse} </td>
        <td>${element.montant-element.verse} </td>
      </tr>`
}



function getDatasPaginate(tab,start,elementPage){
    let firstPosition=(start-1)*elementPage;
    let lastPosition=firstPosition+elementPage;
    return {
      datas:tab.slice(firstPosition,lastPosition),
      page:Math.ceil(tab.length/elementPage)
    };
   }
    
   function generatePagination(allDatas,elementUl,elementTboby,generateTbody){
  const {datas,page}=this.getDatasPaginate(allDatas,1,elementPerPage);
  let html=''
    // html+=`<li class="page-item" ><button class="page-link" href="#">Previous</button></li>`;
  for (let i = 1; i <=page; i++) {
    html+=`<li class="page-item ${i==1?'active':''}" data-number="${i}"><button class="page-link" >${i}</button></li>` 
  }
  
//   html+=`<li class="page-item" ><button class="page-link" href="#">Next</button></li>`;
  
  elementUl.innerHTML= html
  elementTboby.innerHTML=generateTbody(datas)
  const itemsLi=elementUl.querySelectorAll(".page-item")
  itemsLi.forEach((item)=>{
    item.addEventListener("click",(e)=>{
        elementUl.querySelector(".active").classList.remove("active")
      item.classList.add("active")
      let {datas}=this.getDatasPaginate(allDatas,parseInt(item.dataset.number),elementPerPage)
      elementTboby.innerHTML=generateTbody(datas)
  })
  })
  
   }