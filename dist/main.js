document.addEventListener('DOMContentLoaded', () => {
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
    // Create stars for the background
    (() => {
        const bg = document.getElementById('skyBackground');
        for (let i = 0; i < 100; i++) {
            createStar(bg);
        }
    })();
});

async function createStar(bg) {
    // Set up random elements
    let xPos = random(0, 100);
    let yPos = random(0, 100);
    let alpha = random(0.5, 1);
    let size = random(1, 2);
    let blurry = Math.random() > 0.5;
    let colour = '#ffffff';
    // Add them to the body
    const star = document.createElement('div');
    star.style.position = 'relative';
    star.style.left = xPos + '%';
    star.style.top = yPos + '%';
    star.style.opacity = alpha;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.backgroundColor = colour;
    star.style.borderRadius = '1px';
    star.classList.add('bg-star');
    // Blur half of them
    if (blurry) {
        star.style.filter = 'blur(1px)';
    } else {
        // Shining
        let animated = Math.random() > 0.5;
        if (animated) {
            setTimeout(() => {
                star.classList.add('star-animated-1');
            }, random(1, 3000))
        }
    }
    bg.appendChild(star);
}

function random(min, max) {
    return min + Math.random() * (max + 1 - min);
}