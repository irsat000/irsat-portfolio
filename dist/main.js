document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page based on the query string
    switchPage(getPage());
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
                for (let i = 0; i < newText.length; i++) {
                    setTimeout(() => {
                        title.innerHTML += newText[i]
                    }, (text.length + i) * 50);
                }
            }, 1000);
        }, 5000);
    })();
});

// Create stars for the background
async function createStars(direction) {
    const bg = document.getElementById('skyBackground');

    // Remove existing
    const stars = document.getElementsByClassName('bg-star');
    const starsExist = stars.length > 0;
    if (starsExist) {
        Array.from(stars).forEach(star => {
            star.classList.add(`star-slide-out-${direction === 'right' ? 'left' : 'right'}`);
            setTimeout(() => star.remove(), 2000);
        });
    }

    for (let i = 0; i < 100; i++) {
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
        star.classList.add('star-slide-in-' + _direction);
        // Await 2 seconds for star to slide in, and remove the class
        setTimeout(() => star.classList.remove('star-slide-in-' + _direction), 2000);
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

function switchPage(page) {
    const routes = ['home', 'skills', 'projects', 'hireMe'];
    // Get direction of sliding in
    const direction = routes.indexOf(getPage()) <= routes.indexOf(page) ? 'right' : 'left';
    // Animate the page switch
    createStars(direction);
    // Get page or default 'home'
    const targetPage = page ? page : 'home';

    // Update the query string
    const newUrl = `${window.location.pathname}${targetPage !== 'home' ? `?page=${targetPage}` : ''}`;
    history.pushState({}, '', newUrl);

    // Hide all pages
    const pages = document.querySelectorAll('main > section');
    pages.forEach(targetPage => {
        targetPage.classList.remove('active');
    });

    // Show the selected page
    const selectedPage = document.getElementById(targetPage + 'Page');
    selectedPage.classList.add('active');
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)) };

function getPage() {
    const queryString = window.location.search;
    const page = new URLSearchParams(queryString).get('page');
    return page ? page : 'home';
}