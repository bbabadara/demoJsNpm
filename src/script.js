const WEBURL="http://localhost:8000/clients"
const inputTel=document.querySelector("#inputTel")
const telephone=document.querySelector("#telephone")
const inputNom=document.querySelector("#inputNom")
const inputPrenom=document.querySelector("#inputPrenom")
const inputAdresse=document.querySelector("#inputAdresse")
const tBody=document.querySelector("#tBody")
const pagination=document.querySelector("#pagination")
const navInfo=document.querySelector("#nav-info")
const inputDateFilter=document.querySelector("#inputDateFilter")
const btnDateFilter=document.querySelector("#btnDateFilter")
const triedate=document.querySelectorAll(".triedate")
const oblis=document.querySelectorAll(".obli")
const elementPerPage=2
let client=[]
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
    client=findClientByTel(inputTel.value.trim());
   if(client!=null){
    // console.log(getSommeVerse(client.dette));
    inputTel.classList.remove("is-invalid")
    inputTel.classList.add("is-valid")
    inputTel.nextElementSibling.textContent = "";
    generatePagination(client.dette,pagination,tBody,generateTbody)
    navInfo.innerHTML=generateInfoClient(client,getSommeDette(client.dette),getSommeVerse(client.dette))
  }
    else{
      inputTel.classList.remove("is-valid")
      inputTel.classList.add("is-invalid")
      inputTel.nextElementSibling.textContent = "Ce client n'existe pas";
    }      
   
 })

 for (const trie of triedate) {
  trie.addEventListener("click", function () {
      tabl = trierdate(this.getAttribute("data-order"), "date",client.dette);
      generatePagination(tabl,pagination,tBody,generateTbody)

  })
}

 btnDateFilter.addEventListener("click",function(){
  const dateFilter=inputDateFilter.value.trim()
    const dette=getDetteByDate(dateFilter,client.dette)
   generatePagination(dette,pagination,tBody,generateTbody)
    
      
 })

 for (const obli of oblis) {
  obli.addEventListener("input", function () {
      if (fieldsRequired(obli)) {
          success(obli)
      }
      // let inputValid = document.querySelectorAll(".is-valid")
      // disabledBtn = !(Array.from(inputs).length == Array.from(inputValid).length)
      // activeButton(btn, disabledBtn)
  })
}


telephone.addEventListener("input", function () {
  if (fieldsRequired(telephone)) {
      if (validerNumber(telephone.value)) {
        success(telephone)
      }else{
        error(telephone,"saisir un numero valide")
      }
    
  }
  
})
  
  
  })

  //Functions

  function getElement(name, bool = false) {
    if (!bool) {
        return document.querySelector(name)
    } else {
        return document.querySelectorAll(name)
    }
}

function getSommeDette(dette){
    let somme=0
    dette.forEach(u=> {
        somme+=u.montant
        
    })
    return somme
}
function getSommeVerse(dette){
    let somme=0
    dette.forEach(u=> {
        somme+=u.verse
        
    })
    return somme
}
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

   function generateInfoClient(client,montant,verse){
    return `
    <div class="container d-flex align-items-center justify-content-around mt-3">
                  <div class="col-5">
                    <img src="${client.photo}" class=" rounded-circle" alt alt="">
                  </div>
                  <div class="col-5">
                    <p class="text-md-start fs-4">Nom: ${client.nom}</p>
                    <p class="text-md-start fs-4">Prenom: ${client.prenom}</p>
                    <p class="text-md-start fs-4">Telephone: ${client.telephone}</p>
                    <p class="text-md-start fs-4">Adresse: ${client.adresse}</p>
                  </div>
                </div>
                <div class="container mt-3">
                  <p class="text-md-start fs-4">Total Dette: ${montant}</p>
                  <p class="text-md-start fs-4">Montant Versé: ${verse}</p>
                  <p class="text-md-start fs-4">Montant du: ${montant-verse}</p>
                  
                </div>
    `
   }

   function getDetteByDate(date,tab) {
   
    return tab.filter(function (d) {
        return d.date == date
    })
  }



function trierdate(order, trie,tab) {
  if (order == "asc") {
      return tab.sort((a, b) => a[trie].localeCompare(b[trie]));
  } else if (order == "dsc") {
      return tab.sort((a, b) => b[trie].localeCompare(a[trie]));
  }
}

function fieldsRequired(field) {
  if (field.value.trim() === '') {
      this.error(field)
      return false
  }
  return true

}
function success(field) {
  field.classList.remove("is-invalid")
  field.classList.add("is-valid")
}

function error(field, msg = "Champ est obligatoire") {
  field.classList.remove("is-valid")
  field.classList.add("is-invalid")
  field.nextElementSibling.textContent = msg
}

function activeButton(btn, etat) {
  if (etat) {
      btn.setAttribute("disabled", true)
  } else (
      btn.removeAttribute("disabled")
  )

}

function validerNumber(numero) {
  const regex = /^(70|75|76|77|78)\d{7}$/;
  return regex.test(numero);
}

// function getCurrentDate() {
//   return new Date().toISOString().split("T")[0]
// }

