// const para=document.querySelector("p")
// para.innerText="Hello Shubham"
// para.style.backgroundColor="Black"
// para.style.color="White"

// Selecting elements by class name

// const paras=document.getElementsByClassName("para")
// paras[0].innerText="Hello!"
// paras[0].innerHTML="<h1 style='color:red; background-color:Thistle;'>WOOWWWW</h1>"
// paras[1].style.color='Blue'
// Returns an array of elements if there are multiple.

// Selecting elements by id

// const para=document.getElementById("heading")
// para.innerText="MAIN SHUBHAM HUN"
// para.innerHTML="<p id='heading' style='color:Blue;background-color:Thistle;'>MAIN SHUBHAM HUN</p> " 


// Returns a new array
// let arr=[1, 2, 3, 4, 5, 6 ,7]
// const newarr=arr.map((arr)=>2*arr)
// console.log(newarr)    OUTPUT=> Array(7) [ 2, 4, 6, 8, 10, 12, 14 ]


// Doesn't return a new array
// let arr=[1,2,3,4,5,6,7]
// arr.forEach((ele)=>console.log(arr+=2))

// Difference in .textContent and .innerText

// .textContent applies changes to the hidden elements also (display:none or visibility:hidden).
// .innerText doesn't apply changes to hidden elements.

// const container=document.querySelector(".container")
// const button=document.querySelector("button")
// container.addEventListener("click",()=>{
//     console.log("Container clicked")
// })

// button.addEventListener("click",()=>{
//     console.log("Button clicked")
// })

// console.log(a) ERROR: ReferenceError: Cannot access 'a' before initialization
// console.log(b) Undefined

// let a = 239
// var b = 2595

// function hello(){
//     console.log("Hello World")
// }

// hello()



function first() {
    second()
}
function second() {
    third()
}
function third() {
    console.trace()
}
first()
// 
let val=40

function calc(){
    console.log(val)
    let val=100
}

calc()