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
    })
});