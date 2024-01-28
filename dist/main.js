
const routesMap = {
    "home": "Home",
    "skills": "Skills",
    "projects": "Projects",
    "contact": "Contact"
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page based on the query string
    switchPage('initial');
    // Toggle the drawer
    document.getElementById('toggleDrawerBtn').addEventListener('click', () => {
        const drawer = document.getElementById('drawerContainer');
        drawer.classList.toggle('hidden');
    });
    // Click outside the drawer
    document.getElementById('drawerContainer').addEventListener('click', (e) => {
        if (!e.currentTarget.closest('.drawer')) {
            const drawer = document.getElementById('drawerContainer');
            drawer.classList.toggle('hidden');
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
    fetch("/dist/mySkills.json")
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
    let icon = s.icon ? `<img src="../src/skill_icons/${s.icon}" />` : '';
    let el = `
        <li>
            <span>${i !== -1 ? `<span>${++i}.</span> ` : ''}${s.name}</span>
            ${icon}
        </li>
    `;
    parent.innerHTML += el;
}

function switchPage(target) {
    let page = '';
    // If initial get page from query string
    if (target === 'initial') {
        page = getPage();
    }
    // If not initial but the page is the same, then return
    else if (target === getPage()) {
        return;
    } else {
        page = target;
    }

    const routeKeys = Object.keys(routesMap);

    // Get direction of sliding in
    const direction = routeKeys.indexOf(getPage()) <= routeKeys.indexOf(page) ? 'right' : 'left';
    // Get page or default 'home'
    const targetPage = page ? page : 'home';

    // Get next page and listen click event
    const nextPageButton = document.getElementById('nextPage');
    const nextIndex = (routeKeys.indexOf(targetPage) + 1) % routeKeys.length;
    nextPageButton.innerText = Object.values(routesMap)[nextIndex];

    // Update the query string
    const newUrl = `${window.location.pathname}${targetPage !== 'home' ? `?page=${targetPage}` : ''}`;
    history.pushState({}, '', newUrl);

    // Hide all pages
    const pages = document.querySelectorAll('main > section');
    pages.forEach(targetPage => {
        if (targetPage.classList.contains('active')) {
            const slideOutClass = `post-slide-out-${direction === 'right' ? 'left' : 'right'}`;
            targetPage.classList.add(slideOutClass);
            setTimeout(() => {
                targetPage.classList.remove('active');
                targetPage.classList.remove(slideOutClass);
            }, 1000);
        }
    });

    // Show the selected page
    const selectedPage = document.getElementById(targetPage + 'Page');
    selectedPage.classList.add('active');

    // Check if initial
    if (target !== 'initial') {
        // Slide in the selected page
        const slideInClass = `post-slide-in-${direction === 'right' ? 'right' : 'left'}`;
        selectedPage.classList.add(slideInClass);
        setTimeout(() => {
            selectedPage.classList.remove(slideInClass);
        }, 1000);
    }
}

// Go to the next page from the route keys, if it's the end, return to index 0
let isCooldownActive = false;
function nextPage() {
    if (isCooldownActive) {
        // Do nothing if the cooldown is still active
        return;
    }
    // Set the cooldown flag to true
    isCooldownActive = true;
    // Get the next index and the key, then run switchPage
    const routeKeys = Object.keys(routesMap);
    const nextIndex = (routeKeys.indexOf(getPage()) + 1) % routeKeys.length;
    switchPage(routeKeys[nextIndex]);
    // Reset cooldown after 2 seconds
    setTimeout(() => {
        isCooldownActive = false;
    }, 1000);
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)) };

function getPage() {
    const queryString = window.location.search;
    const page = new URLSearchParams(queryString).get('page');
    return page ? page : 'home';
}