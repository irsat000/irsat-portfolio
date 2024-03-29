
const routesMap = {
    "home": "Home",
    "skills": "Skills",
    "projects": "Projects",
    "contact": "Contact"
}

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    // Activate the drawer
    document.getElementById('toggleDrawerBtn').addEventListener('click', () => {
        const drawer = document.getElementById('drawerContainer');
        drawer.classList.remove('hidden');
        setTimeout(() => {
            const menu = drawer.querySelector('#drawer');
            menu.classList.add('active');
        }, 50);
    });
    // Click outside the drawer
    document.getElementById('drawerContainer').addEventListener('click', (e) => {
        if (!e.target.closest('#drawer') || e.target.closest('#drawerList > li')) {
            const drawer = document.getElementById('drawerContainer');
            const menu = drawer.querySelector('#drawer');
            menu.classList.remove('active');

            setTimeout(() => {
                drawer.classList.add('hidden');
            }, 150);
        }
    });
    // Switch between job titles
    (() => {
        const titles = ["Full Stack", "Front End", "Back End"];
        const title = document.getElementById('changingJobTitle');
        setInterval(() => {
            let text = title.innerText;
            let currentIndex = titles.indexOf(text);
            const initialLength = text.length;
            for (let i = 0; i < initialLength; i++) {
                setTimeout(() => {
                    text = text.slice(0, -1);
                    title.innerText = text;
                }, i * 50);
            }
            setTimeout(() => {
                let newText = titles[(currentIndex + 1) % titles.length || 0];
                // Make sure to reset for faulty timing caused by various things
                title.innerHTML = "";
                for (let i = 0; i < newText.length; i++) {
                    setTimeout(() => {
                        title.innerHTML += newText[i]
                    }, (text.length + i) * 50);
                }
            }, 1000);
        }, 5000);
    })();

    // Fetch skills
    let skillsUrl = "/mySkills.json";
    if (window.location.hostname.includes('127.0.0.1')
        || window.location.hostname.includes('localhost')) {
        skillsUrl = "/dist/mySkills.json";
    }
    fetch(skillsUrl)
        .then(res => res.json())
        .then(data => {
            const frontEndSkills = document.getElementById("frontEndSkills");
            const backEndSkills = document.getElementById("backEndSkills");
            const pastSkills = document.getElementById("pastSkills");
            data.frontEndSkills.forEach((s, i) => addSkill(s, i, frontEndSkills));
            data.backEndSkills.forEach((s, i) => addSkill(s, i, backEndSkills));
            data.pastSkills.forEach(s => addSkill(s, -1, pastSkills));
        })
        .catch(e => console.log(e));
});

// Adds skill to the given skill-set
function addSkill(s, i, parent) {
    let icon = s.icon ? `<img src="assets/skill_icons/${s.icon}" />` : '';
    let el = `
        <li>
            <span>${i !== -1 ? `<span>${++i}.</span> ` : ''}${s.name}</span>
            ${icon}
        </li>
    `;
    parent.innerHTML += el;
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)) };