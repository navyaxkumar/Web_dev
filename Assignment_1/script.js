const form = document.querySelector('#form')
const eventCards = document.querySelector('#cards')
const event_title = document.querySelector('#event_title')
const event_date = document.querySelector('#event_date')
const category = document.querySelector('#category')
const description = document.querySelector('#description')
const clearBtn = document.querySelector('#clearbtn')
const sampleBtn = document.querySelector('#samplebtn')

form.addEventListener('submit', function (event) {
    event.preventDefault()

    const eventObj = {
        id: Date.now(),
        title: event_title.value,
        date: event_date.value,
        cat: category.value,
        desc: description.value
    }

    createCard(eventObj)
    
    form.reset()
})

function createCard(eventObj) {

    const card = document.createElement('div')
    card.classList.add('card')

    card.innerHTML = `
        <h2>${eventObj.title}</h2>
        <p>📅 ${eventObj.date}</p>
        <button class="catBtn">${eventObj.cat}</button>
        <p>${eventObj.desc}</p>
        <div class="deleteCard">✖</div>
    `

    card.querySelector('.deleteCard').addEventListener('click', function () {
        card.remove()
    })

    eventCards.appendChild(card)
}

clearBtn.addEventListener('click', function () {
    localStorage.removeItem('events')
    eventCards.innerHTML = ''
})

sampleBtn.addEventListener('click', function () {

   const samples = [
    {
        id: Date.now(),
        title: "Meetup with colleagues",
        date: "2026-03-15",
        cat: "Meetup",
        desc: "Catch-up and assess project progress."
    },
    {
        id: Date.now() + 2,
        title: "Frontend Development Workshop",
        date: "2026-04-10",
        cat: "Workshop",
        desc: "Hands-on session on JavaScript frameworks."
    },
    {
        id: Date.now() + 6,
        title: "Cybersecurity Conference",
        date: "2026-06-01",
        cat: "Conference",
        desc: "Learn more about cybersecurity challenges"
    }
]


    samples.forEach(sample => {
        createCard(sample)
    })
})

document.addEventListener('keydown', function (event) {
    document.querySelector('#key').innerText = event.key
})
