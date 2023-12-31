
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
            const otherSkills = document.getElementById("otherSkills");
            const pastSkills = document.getElementById("pastSkills");
            data.frontEndSkills.forEach(s => addSkill(s.name, s.level, frontEndSkills));
            data.backEndSkills.forEach(s => addSkill(s.name, s.level, backEndSkills));
            data.otherSkills.forEach(s => addSkill(s.name, s.level, otherSkills));
            data.pastSkills.forEach(s => addSkill(s.name, s.level, pastSkills));
        })
        .catch(e => console.log(e));
});

// Adds skill to the given skill-set
function addSkill(name, level, parent) {
    // Level can be undefined
    let levelWrapper = '';
    if (level) {
        for (let i = 0; i < 5; i++) {
            levelWrapper += `<li ${level > i ? 'class="active"' : ''}></li>`;
        }
    }
    let skill = `
        <li>
            <span>${name}</span>
            <ul class="level">
                ${level ? levelWrapper : ''}
            </ul>
        </li>
    `;
    parent.innerHTML += skill;
}

// Create stars for the background
async function createStars(direction) {
    const bg = document.getElementById('skyBackground');

    // Remove existing
    const stars = document.getElementsByClassName('bg-star');
    const starsExist = stars.length > 0;
    if (starsExist) {
        Array.from(stars).forEach(star => {
            star.classList.add(`slide-out-${direction === 'right' ? 'left' : 'right'}`);
            setTimeout(() => star.remove(), 2000);
        });
    }

    const starCount = window.innerWidth >= 768 ? 50 : 10;

    for (let i = 0; i < starCount; i++) {
        createStar(bg, direction, starsExist);
    }
}
async function createStar(bg, direction, slideIn = false) {
    // Set up random elements
    let xPos = random(0, 100);
    let yPos = random(0, 100);
    let alpha = random(0.5, 1);
    let size = random(1, 2);
    let blurry = Math.random() > 0.5;
    let colour = '#ffffff';
    // Add them to the body
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.left = xPos + '%';
    star.style.top = yPos + '%';
    star.style.opacity = alpha;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.backgroundColor = colour;
    star.style.borderRadius = '1px';
    star.classList.add('bg-star');
    if (slideIn) {
        const _direction = direction === 'right' ? 'right' : 'left';
        star.classList.add('slide-in-' + _direction);
        // Await 2 seconds for star to slide in, and remove the class
        setTimeout(() => star.classList.remove('slide-in-' + _direction), 2000);
    }
    // Blur half of them
    if (blurry) {
        star.style.filter = 'blur(1px)';
    } else {
        // Shining
        let animated = Math.random() > 0.3;
        if (animated) {
            // Set randomly timed shining animation
            setTimeout(() => {
                star.classList.add('star-animated-1');
            }, random(1, 3000));
        }
    }
    bg.appendChild(star);
}

function random(min, max) {
    return min + Math.random() * (max + 1 - min);
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
    // Animate the page switch
    if (window.innerWidth >= 768) {
        createStars(direction);
    }
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