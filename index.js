// set perspective. also set in css right now
var currentPerspective = 1300;


document.querySelector('.image-container').addEventListener('click', function() {
    this.classList.toggle("expanded");
    translateImages();
});

document.getElementById("slides-button").addEventListener("click", function() {
    toggleView();
});



// this sets images apart from each other on load
function translateImages() {
    var images = document.getElementsByTagName('img');
    var translateZ = 0;
    var translateY = 0;
    var translateX = 0;

    const expanded = document.querySelector('.image-container').classList.contains("expanded");        

    for (var i = 0; i < images.length; i++) {
        images[i].style.transform = 'translate3d(' + translateX + 'px,' + translateY + 'px, ' + translateZ + 'px)';
        translateZ -= 250; // You can adjust the amount of translation according to your preference
        if (expanded) {
            translateY += 50; // You can adjust the amount of translation according to your preference
            translateX += 50;
        } 
    }

    var slidesButton = document.getElementById('slides-button'); 
    slidesButton.style.display = expanded ? 'none' : 'block';
    toggleBlurredBackground();
}



function handleMouseMove(event) {
    var container = document.querySelector('.image-container');
    var rect = container.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    // Convert mouse position to percentage values
    var perspectiveOriginX = (mouseX / rect.width) * 100;
    var perspectiveOriginY = (mouseY / rect.height) * 100;

    // Set the perspective origin dynamically
    container.style.perspectiveOrigin = perspectiveOriginX + '% ' + perspectiveOriginY + '%';
}

// Function to handle mouse wheel scroll for perspective
function handleMouseWheel(event) {
    var container = document.querySelector('.image-container');

    // Increase or decrease perspective based on the direction of mouse scroll
    var scrollDelta = -Math.sign(event.deltaY); // Reverse the direction
    currentPerspective += scrollDelta * 100;

    // Ensure perspective doesn't go below 1000 and above 500
    currentPerspective = Math.min(Math.max(currentPerspective, 1000), 5000);

    // Set the new perspective value
    container.style.perspective = currentPerspective + 'px';

    // Prevent default scroll behavior to avoid page scrolling
    event.preventDefault();
}



var isGridDisplayed = false;
var imageContainer = document.querySelector('.image-container');
var gridContainer = document.querySelector('.grid-container');
var gridImages;

function toggleView() {
    if (!isGridDisplayed) {
        imageContainer.classList.remove('perspective-view');
        imageContainer.classList.add('grid-view');
        gridContainer.classList.add('show');
        // Show grid images sequentially with opacity
        gridImages.forEach(function(image, index) {
            setTimeout(function() {
                image.style.opacity = 1;
            }, index * 200); // Adjust the delay time as needed
        });
    } else {
        imageContainer.classList.remove('grid-view');
        imageContainer.classList.add('perspective-view');
        gridContainer.classList.remove('show');
        // Hide grid images
        gridImages.forEach(function(image) {
            image.style.opacity = 0;
        });
    }

    document.getElementById("slides-button").innerText = isGridDisplayed ? "Display Slides" : "View Tunnel Book";
    toggleBlurredBackground();
    isGridDisplayed = !isGridDisplayed;
}


function hideContainer() {
    imageContainer.style.display = 'none';
}



function toggleBlurredBackground() {
    var bg = document.querySelector(".background-image");
    const bgImg = `url('${ document.getElementById("bg").src}')`;

    bg.style.backgroundImage = bg.style.backgroundImage == '' ? bgImg : '';
}

const imagePaths = [
    "images/peepshow_5.png", 
    "images/peepshow_4.png", 
    "images/peepshow_3.png", 
    "images/peepshow_2.png", 
    "images/peepshow_1.png", 
];
const backgroundPath = "images/peepshow_bg.png";

function injectImages(className) {
    let builder = "";
    for (var path of imagePaths) builder += '<img src="' + path + '">';
    builder += '<img src="' + backgroundPath + '" id="bg">';
    document.querySelector(className).insertAdjacentHTML("beforeend", builder);
}


// setup
window.onload = injectImages(".image-container");
translateImages();

window.addEventListener('wheel', handleMouseWheel);
document.querySelector('.image-container').addEventListener('mousemove', handleMouseMove);

injectImages(".grid-container");
gridImages = document.querySelectorAll('.grid-container img');