const ring = document.getElementById("ringProgress");
const percentText = document.getElementById("progressPercent");

function setPrayerProgress(percent){

const circumference = 597;

const offset = circumference - (percent / 100) * circumference;

ring.style.strokeDashoffset = offset;

percentText.textContent = Math.round(percent) + "%";

}

/* Demo */

setPrayerProgress(35);
