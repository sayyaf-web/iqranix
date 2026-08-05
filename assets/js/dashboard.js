/*=========================================
  IQRANIX DASHBOARD
  PART 1
=========================================*/

document.addEventListener("DOMContentLoaded", initDashboard);

/*=========================================
 INITIALIZE
=========================================*/

function initDashboard(){

    updateGreeting();

    initializeFeatureCards();

    initializeBottomNavigation();

}

/*=========================================
 GREETING
=========================================*/

function updateGreeting(){

    const greeting =
        document.getElementById("greeting");

    const message =
        document.getElementById("greetingMessage");

    const hour = new Date().getHours();

    let title = "";
    let subtitle = "";

    if(hour >= 5 && hour < 12){

        title = "Assalamu Alaikum";

        subtitle = "Good Morning";

    }

    else if(hour >= 12 && hour < 17){

        title = "Assalamu Alaikum";

        subtitle = "Good Afternoon";

    }

    else if(hour >= 17 && hour < 20){

        title = "Assalamu Alaikum";

        subtitle = "Good Evening";

    }

    else{

        title = "Assalamu Alaikum";

        subtitle = "May Allah grant you peace";

    }

    if(greeting){

        greeting.textContent = title;

    }

    if(message){

        message.textContent = subtitle;

    }

}

/*=========================================
 FEATURE CARDS
=========================================*/

function initializeFeatureCards(){

    const cards =
        document.querySelectorAll(".featureCard");

    cards.forEach(card=>{

        card.addEventListener("click",()=>{

            const title =
                card.querySelector("h3").textContent;

            console.log("Opening:",title);

            switch(title){

                case "Holy Quran":

                    // open Quran

                    break;

                case "Prayer Times":

                    // open prayer page

                    break;

                case "Qibla":

                    // open qibla

                    break;

                case "Tasbih":

                    // open tasbih

                    break;

                case "Duas":

                    // open duas

                    break;

                case "Daily Ayah":

                    // open ayah

                    break;

                case "Hadith":

                    // open hadith

                    break;

                case "Hijri Calendar":

                    // open calendar

                    break;

            }

        });

    });

}

/*=========================================
 BOTTOM NAVIGATION
=========================================*/

function initializeBottomNavigation(){

    const buttons =
        document.querySelectorAll(".bottomNav button");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            buttons.forEach(btn=>{

                btn.classList.remove("active");

            });

            button.classList.add("active");

        });

    });

    if(buttons.length){

        buttons[0].classList.add("active");

    }

}
/*=========================================
 LOCATION
=========================================*/

let userLatitude = null;
let userLongitude = null;

async function getUserLocation(){

    const locationElement =
        document.getElementById("currentLocation");

    const heroLocation =
        document.getElementById("heroLocation");

    if(!navigator.geolocation){

        if(locationElement)
            locationElement.textContent = "Location unavailable";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;

            await reverseGeocode();

            await loadPrayerTimes();

        },

        ()=>{

            if(locationElement)
                locationElement.textContent = "Location denied";

            if(heroLocation)
                heroLocation.textContent = "Location denied";

        }

    );

}

/*=========================================
 REVERSE GEOCODING
=========================================*/

async function reverseGeocode(){

    try{

        const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`

        );

        const data = await response.json();

        const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown";

        const country =
            data.address.country || "";

        const text =
            `${city}, ${country}`;

        document.getElementById("currentLocation").textContent = text;

        document.getElementById("heroLocation").textContent = text;

    }

    catch(error){

        console.log(error);

    }

}

/*=========================================
 PRAYER TIMES
=========================================*/

async function loadPrayerTimes(){

    try{

        const today = new Date();

        const day = today.getDate();

        const month = today.getMonth()+1;

        const year = today.getFullYear();

        const response = await fetch(

`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${userLatitude}&longitude=${userLongitude}&method=2`

        );

        const data = await response.json();

        const timings = data.data.timings;

        document.getElementById("fajrTime").textContent = timings.Fajr;
        document.getElementById("sunriseTime").textContent = timings.Sunrise;
        document.getElementById("dhuhrTime").textContent = timings.Dhuhr;
        document.getElementById("asrTime").textContent = timings.Asr;
        document.getElementById("maghribTime").textContent = timings.Maghrib;
        document.getElementById("ishaTime").textContent = timings.Isha;

        document.getElementById("hijriDate").textContent =
            `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year} AH`;

        prayerTimes = timings;

        updatePrayerStatus();

    }

    catch(error){

        console.log("Prayer API Error",error);

    }

}

/*=========================================
 START LOCATION
=========================================*/

getUserLocation();/*=========================================
 PRAYER STATUS
=========================================*/

let prayerTimes = {};

const prayerOrder = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Maghrib",
    "Isha"
];

function updatePrayerStatus(){

    if(!prayerTimes) return;

    const now = new Date();

    let nextPrayer = "";
    let nextTime = null;

    let previousTime = null;

    for(let i=0;i<prayerOrder.length;i++){

        const prayer = prayerOrder[i];

        const value = prayerTimes[prayer];

        if(!value) continue;

        const parts = value.split(":");

        const prayerDate = new Date();

        prayerDate.setHours(
            parseInt(parts[0]),
            parseInt(parts[1]),
            0,
            0
        );

        if(now < prayerDate){

            nextPrayer = prayer;

            nextTime = prayerDate;

            break;

        }

        previousTime = prayerDate;

    }

    if(!nextPrayer){

        nextPrayer = "Fajr";

        const parts = prayerTimes.Fajr.split(":");

        nextTime = new Date();

        nextTime.setDate(nextTime.getDate()+1);

        nextTime.setHours(
            parseInt(parts[0]),
            parseInt(parts[1]),
            0,
            0
        );

    }

    document.getElementById("nextPrayer").textContent =
        nextPrayer;

    highlightCurrentPrayer(nextPrayer);

    updateCountdown(nextTime);

    setInterval(()=>{

        updateCountdown(nextTime);

    },1000);

}

/*=========================================
 COUNTDOWN
=========================================*/

function updateCountdown(target){

    const countdown =
        document.getElementById("countdown");

    const remaining =
        document.getElementById("remainingText");

    let diff = target - new Date();

    if(diff < 0){

        diff = 0;

    }

    const h =
        Math.floor(diff / 3600000);

    const m =
        Math.floor((diff % 3600000)/60000);

    const s =
        Math.floor((diff % 60000)/1000);

    countdown.textContent =
        `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    remaining.textContent =
        `${h}h ${m}m remaining`;

}

/*=========================================
 ACTIVE PRAYER
=========================================*/

function highlightCurrentPrayer(nextPrayer){

    const rows =
        document.querySelectorAll(".prayerItem");

    rows.forEach(row=>{

        row.classList.remove("activePrayer");

    });

    rows.forEach(row=>{

        if(row.innerText.includes(nextPrayer)){

            row.classList.add("activePrayer");

        }

    });

}/*=========================================
 IQRANIX
 PART 4
 FINAL INITIALIZATION
=========================================*/

let countdownTimer = null;

/*=========================================
 REFRESH PRAYER STATUS
=========================================*/

function refreshPrayerStatus(){

    if(!prayerTimes) return;

    updatePrayerStatus();

}

/*=========================================
 AUTO REFRESH
=========================================*/

function startPrayerRefresh(){

    setInterval(()=>{

        refreshPrayerStatus();

    },60000);

}

/*=========================================
 SAFE COUNTDOWN
=========================================*/

function startCountdown(target){

    if(countdownTimer){

        clearInterval(countdownTimer);

    }

    updateCountdown(target);

    countdownTimer = setInterval(()=>{

        updateCountdown(target);

        if(new Date() >= target){

            clearInterval(countdownTimer);

            refreshPrayerStatus();

        }

    },1000);

}

/*=========================================
 VIEW PRAYER BUTTON
=========================================*/

const prayerButton =
document.getElementById("viewPrayerBtn");

if(prayerButton){

    prayerButton.addEventListener("click",()=>{

        console.log("Open Prayer Times Page");

        // window.location.href = "prayer.html";

    });

}

/*=========================================
 NOTIFICATION BUTTON
=========================================*/

const notificationButton =
document.querySelector(".notificationBtn");

if(notificationButton){

    notificationButton.addEventListener("click",()=>{

        console.log("Notifications");

    });

}

/*=========================================
 MENU BUTTON
=========================================*/

const menuButton =
document.querySelector(".menuBtn");

if(menuButton){

    menuButton.addEventListener("click",()=>{

        console.log("Open Drawer");

    });

}

/*=========================================
 DASHBOARD START
=========================================*/

window.addEventListener("load",()=>{

    updateGreeting();

    getUserLocation();

    startPrayerRefresh();

});

console.log("Iqranix Dashboard Loaded");
