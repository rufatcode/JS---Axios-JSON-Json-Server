/*
let xhr=new XMLHttpRequest();

xhr.onreadystatechange=function(){
    
    if (xhr.readyState===4&&xhr.status===200) {
        console.log(xhr.statusText);
    }
    else if(xhr.status===404){
        console.log("not found ");
        console.log(xhr.statusText);
    }

}
xhr.onprogress=function(){
    console.log("proses in progress");
}

xhr.open("GET",'../file.txt',true);
xhr.send();
var first=()=>{
    console.log("first");
    second();
}
var second=()=>{
    console.log("second");
    setTimeout(()=>{
        console.log("next");
    },1000)
    third()
}
var third=()=>{
    console.log("third");
}
first();
*/
// let xhr=new XMLHttpRequest();
// xhr.onreadystatechange=function(){
//     if (xhr.readyState===4&&xhr.status===200) {
//         console.log(JSON.parse(xhr.response));
//     }
// }
// const json = {
//     email: 'eve.holt@reqres.in',
//     password: 'cityslicka'
// }

// // open request
// xhr.open('GET', 'http://localhost:3000/posts',true)

// // set `Content-Type` header
// xhr.setRequestHeader('Content-Type', 'application/json')

// // send rquest with JSON payload
// xhr.send(JSON.stringify(json))

let ImgSrcInput=document.querySelector("#ImgSrc");
let UserNameInput=document.querySelector("#UserName");
let ShareContentInput=document.querySelector("#ShareContent");
let UserTagsInput=document.querySelector("#UserTags");
let CreateBtn=document.querySelector("#CreateBtn");
let xhrPost=new XMLHttpRequest();
CreateBtn.addEventListener("click",function(){
    if (ImgSrcInput.value.trim().length>0&&UserNameInput.value.trim().length&&ShareContentInput.value.trim().length&&UserTagsInput.value.trim().length) {
        xhrPost.open("POST","http://localhost:3000/posts",true);
        xhrPost.setRequestHeader('Content-Type', 'application/json');
        xhrPost.send(JSON.stringify({
            ImgSrc:ImgSrcInput.value,
            UserName:UserNameInput.value,
            Content:ShareContentInput.value,
            Tag:UserTagsInput.value
        }))
    }
    else{
        ImgSrcInput.value="";
        UserNameInput.value="";
        ShareContentInput.value="";
        UserTagsInput.value="";
    }
})

let xhrGetAll=new XMLHttpRequest();
xhrGetAll.onreadystatechange=function(){
    if (xhrGetAll.readyState===4&&xhrGetAll.status===200) {
        
        let datas=JSON.parse(xhrGetAll.responseText);
        datas.forEach(data => {
            let div=document.createElement("div");
            div.classList.add("card");
            div.classList.add("col-3");
            div.classList.add("my-3");
            div.innerHTML=`
            <img src="${data.ImgSrc}" class="card-img-top rounded my-1 alt="..." style="height: 150px;">
            <div class="card-body">
              <h5 class="card-title">${data.UserName}</h5>
              <p class="card-text">${data.Content}</p>
              <p class="card-text">${data.Tag}</p>
              <button data-Id="${data.id}"  class="mx-1 px-2 py-1 text-white bg-danger border rounded EditBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
              <button data-Id="${data.id}"   class="px-3 mx-1 py-1 text-white bg-info border rounded DetailBtn" data-bs-toggle="modal" data-bs-target="#exampleModal1">Detail</button>
              <button data-Id="${data.id}"   class="px-3 py-1 text-white  border rounded  bg-warning DeleteBtn">Delete</button>
            </div>
          `
          document.querySelector("#Content").append(div);
          
        });
    }
}
xhrGetAll.open("GET","http://localhost:3000/posts",false);
xhrGetAll.send();

let xhrDelete=new XMLHttpRequest();

document.querySelectorAll("#Content>div").forEach(element=>{
    element.lastElementChild.lastElementChild.addEventListener("click",function(){
        xhrDelete.open("DELETE",`http://localhost:3000/posts/${element.lastElementChild.lastElementChild.getAttribute("data-Id")}`);
        xhrDelete.send();
    })
})
let ImgSrcEdit=document.querySelector("#ImgSrcEdit");
let UserNameEdit=document.querySelector("#UserNameEdit");
let ShareContentEdit=document.querySelector("#ShareContentEdit");
let UserTagsEdit=document.querySelector("#UserTagsEdit");
document.querySelectorAll("#Content>div").forEach(element=>{
    element.lastElementChild.lastElementChild.previousElementSibling.previousElementSibling.addEventListener("click",function(){
        ImgSrcEdit.value=element.firstElementChild.getAttribute("src");
        UserNameEdit.value=element.lastElementChild.firstElementChild.innerHTML;
        ShareContentEdit.value=element.lastElementChild.firstElementChild.nextElementSibling.innerHTML;
        UserTagsEdit.value=element.lastElementChild.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
        UserTagsEdit.setAttribute("data-Id",this.getAttribute("data-Id"));
    })
})
let saveEditBtn=document.querySelector(".modal-content").lastElementChild.lastElementChild;
let xhrUpdate=new XMLHttpRequest();
saveEditBtn.addEventListener("click",function(){
    if (ImgSrcEdit.value.trim().length>0&&UserNameEdit.value.trim().length>0&&ShareContentEdit.value.trim().length>0&&UserTagsEdit.value.trim().length>0) {
        xhrUpdate.open("PUT",`http://localhost:3000/posts/${UserTagsEdit.getAttribute("data-Id")}`,true);
        xhrUpdate.setRequestHeader('Content-Type', 'application/json');
        xhrUpdate.send(JSON.stringify({
            ImgSrc:ImgSrcEdit.value,
            UserName:UserNameEdit.value,
            Content:ShareContentEdit.value,
            Tag:UserTagsEdit.value,
        }))
    }
    else{
        ImgSrcEdit.value="";
        UserNameEdit.value="";
        ShareContentEdit.value="";
        UserTagsEdit.value="";
    }
})

let xhrGetById=new XMLHttpRequest();
document.querySelectorAll("#Content>div").forEach(element=>{
    element.lastElementChild.lastElementChild.previousElementSibling.addEventListener("click",function(){
        xhrGetById.onreadystatechange=function(){
            if (xhrGetById.readyState===4&&xhrGetById.status===200) {
                let div=document.createElement("div");
                let data=JSON.parse(xhrGetById.response);
                div.innerHTML=`
                    <img src="${data.ImgSrc}" style="height: 250px;" class="card-img-top rounded my-2 mb-4" alt="..." >
                    <h5 class="card-title my-2">${data.UserName}</h5>
                    <p class="card-text">${data.Content}</p>
                    <p class="card-text text-warning">${data.Tag}</p>
                `
                document.querySelector("#exampleModal1>div>div").firstElementChild.nextElementSibling.append(div);
            }
        }
       xhrGetById.open("GET",`http://localhost:3000/posts/${this.getAttribute("data-Id")}`);
       xhrGetById.send();
    })
})
