const websiteWidth = window.innerWidth;
document.getElementById("website-width").innerText = `Website width: ${websiteWidth}px`;

document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.querySelector('header > nav').classList.toggle('show');
});
