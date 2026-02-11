const form = document.querySelector("#form")
form.addEventListener('submit',function(event){
    event.preventDefault()
    console.log(event_title.value)
    console.log(event_date.value)
    console.log(category.value)
    console.log(description.value)
    const eventCards=document.querySelector('.cards')
        event.preventDefault()
        const title=event_title.value
        const date=event_date.value
        const cat=category.value
        const desc=description.value

        const card=document.createElement('div')
        card.classList.add('card')
        card.innerHTML=`
        <h2>${title}</h2>
        <p>📆${date}</p>
        <button>${cat}</button>
        <p>${desc}</p>
        <div class="deleteCard">x</div>
        `
        card.querySelector('.deleteCard').addEventListener('click',function(){
            card.remove()
        })
        
        eventCards.appendChild(card)
})

document.addEventListener('keydown',(event)=>{
    let pressed=event.key;
    document.querySelector(".dom").textContent=`You pressed: ${pressed}`
})