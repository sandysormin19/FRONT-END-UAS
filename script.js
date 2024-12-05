// Script for handling modal behavior
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("login");
    const loginLink = document.querySelector("a[href='#login']");
    const closeButton = document.querySelector(".close-button");

    // Open modal when login link is clicked
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
    });

    // Close modal when close button is clicked
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal if clicking outside modal content
    window.addEventListener("click", (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });
});
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
}
});

let currentSlide = 0;

const featureLinks = document.querySelectorAll('.feature');
const popupModal = document.getElementById('popupModal');
const popupImages = document.querySelectorAll('.popup-image');
const closeButton = document.querySelector('.close');

featureLinks.forEach((link) => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); 
        
       
        const images = JSON.parse(this.getAttribute('data-images'));
        
       
        popupImages.forEach((img, index) => {
            img.src = images[index] || ""; 
            img.style.display = images[index] ? 'block' : 'none'; 
        });
        
    
        popupModal.style.display = 'block';
        currentSlide = 0; 
        showSlide(currentSlide);
    });
});


function showSlide(slideIndex) {
    for (let i = 0; i < popupImages.length; i++) {
        popupImages[i].style.display = 'none'; 
    }
    popupImages[slideIndex].style.display = 'block'; 
}


function changeSlide(direction) {
    currentSlide += direction; 
    if (currentSlide < 0) {
        currentSlide = popupImages.length - 1; 
    } else if (currentSlide >= popupImages.length) {
        currentSlide = 0; 
    }
    showSlide(currentSlide); 
}


closeButton.addEventListener('click', function() {
    popupModal.style.display = 'none'; 
});


window.addEventListener('click', function(event) {
    if (event.target === popupModal) {
        popupModal.style.display = 'none';
    }
});