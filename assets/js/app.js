// ================================
// IQRANIX
// Dashboard Features
// ================================

const features = [

    {
        title: "Prayer Times",
        subtitle: "Today's Salah Schedule",
        icon: "🕌"
    },

    {
        title: "Holy Quran",
        subtitle: "Read & Listen",
        icon: "📖"
    },

    {
        title: "Qibla",
        subtitle: "Find Kaaba Direction",
        icon: "🧭"
    },

    {
        title: "Tasbih",
        subtitle: "Digital Dhikr Counter",
        icon: "📿"
    },

    {
        title: "Duas & Adhkar",
        subtitle: "Morning & Evening",
        icon: "🤲"
    },

    {
        title: "Daily Ayah",
        subtitle: "Verse of the Day",
        icon: "🌅"
    },

    {
        title: "Daily Hadith",
        subtitle: "Authentic Hadith",
        icon: "📚"
    },

    {
        title: "Hijri Calendar",
        subtitle: "Islamic Calendar",
        icon: "📅"
    },

    {
        title: "99 Names",
        subtitle: "Asma ul Husna",
        icon: "☪️"
    }

];

function loadDashboardCards() {

    const grid = document.querySelector(".featureGrid");

    if (!grid) return;

    grid.innerHTML = "";

    features.forEach(feature => {

        grid.innerHTML += `

        <article class="featureCard">

            <div class="featureIcon">

                ${feature.icon}

            </div>

            <h3>${feature.title}</h3>

            <p>${feature.subtitle}</p>

            <button class="featureArrow">

                →

            </button>

        </article>

        `;

    });

}

window.addEventListener("DOMContentLoaded", () => {

    loadDashboardCards();

});
