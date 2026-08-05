/*=========================================
  IQRANIX PRAYER RING
=========================================*/

const ring = document.getElementById("ringProgress");
const percentText = document.getElementById("ringPercent");

/**
 * Updates the circular prayer progress ring.
 * @param {number} percent Value between 0 and 100.
 */
function setPrayerProgress(percent){

    if(!ring || !percentText) return;

    // Keep value between 0 and 100
    percent = Math.max(0, Math.min(100, percent));

    // Circle radius from SVG
    const radius = 100;

    // Full circumference
    const circumference = 2 * Math.PI * radius;

    // Apply stroke values
    ring.style.strokeDasharray = circumference;

    const offset =
        circumference - (percent / 100) * circumference;

    ring.style.strokeDashoffset = offset;

    // Update percentage text
    percentText.textContent =
        `${Math.round(percent)}%`;

}

/*=========================================
  DEMO ANIMATION
  (Temporary - remove later)
=========================================*/

let demoProgress = 0;

const demoAnimation = setInterval(()=>{

    demoProgress++;

    setPrayerProgress(demoProgress);

    if(demoProgress >= 100){

        clearInterval(demoAnimation);

    }

},25);
