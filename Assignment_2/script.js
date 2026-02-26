const API_KEY="0133cc5316757ac730cc46ae342334e4"
const form=document.querySelector("#form")
const weatherDetail=document.querySelector(".info")
const searchHistory=document.querySelector(".historyBtn")

let cityHistory=[]

form.addEventListener('submit',async function(event){
    event.preventDefault()
    const searchCity=city.value
    console.log(searchCity)

    if(searchCity){
        try{
            const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`)
            const data=await res.json()
            if(data.cod===200){
                weatherDetail.innerHTML=`
                <p>City: ${data.name}</p>
                <p>Temp: ${(data.main.temp-273).toFixed(1)}C</p>
                <p>Weather: ${data.weather[0].main}</p>
                <p>Humidity: ${data.main.humidity}</p>
                <p>Wind: ${data.wind.speed}m/s</p>`
                cityHistory.push(searchCity)
                localStorage.setItem("cityHistory",JSON.stringify([...new Set(cityHistory)]))
                displayHistory()
            }else{
                weatherDetail.innerHTML=`<p>City not found</p>`
            }
        }catch(e){
            console.log(e)
        }
    }
})

function displayHistory(){
    searchHistory.innerHTML=""
    const history=JSON.parse(localStorage.getItem("cityHistory"))
    console.log(history)
    if(history){
        history.forEach((city)=>{
            const btn=document.createElement("button")
            btn.innerText=city
            searchHistory.appendChild(btn)
        })
    }
}
displayHistory()