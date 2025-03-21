// set perspective. also set in css right now
var currentPerspective = 1300;
var useOldImages = true;

var spacebarListener = function(event) {
  if (event.code === 'Space') {
      event.preventDefault();
      swapImages();
  }
};

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

function showGridView() {
  imageContainer.classList.remove('perspective-view');
  imageContainer.classList.add('grid-view');
  gridContainer.classList.add('show');

  // Show grid images sequentially with opacity
  gridImages.forEach(function (image, index) {
    setTimeout(function () {
      image.style.opacity = 1;
    }, index * 200);
  });

  // Hide all buttons except slides button
  document.querySelectorAll('.button-container button').forEach(button => {
    button.style.display = button.id === 'slides-button' ? 'block' : 'none';
  });

  document.removeEventListener('keydown', spacebarListener);
}

function showPerspectiveView() {
  imageContainer.classList.remove('grid-view');
  imageContainer.classList.add('perspective-view');
  gridContainer.classList.remove('show');

  // Hide grid images
  gridImages.forEach(function (image) {
    image.style.opacity = 0;
  });

  // Show all buttons
  document.querySelectorAll('.button-container button').forEach(button => {
    button.style.display = 'block';
  });

  document.addEventListener('keydown', spacebarListener);
}

function toggleView() {
  isGridDisplayed ? showPerspectiveView() : showGridView();
  toggleBlurredBackground();

  document.getElementById("slides-button").innerText = isGridDisplayed ? "Display Slides" : "View Tunnel Book";
  
  isGridDisplayed = !isGridDisplayed;
}


function hideContainer() {
  imageContainer.style.display = 'none';
}


function toggleBlurredBackground() {
  var bg = document.querySelector(".background-image");
  const bgImg = `url('${document.getElementById("bg").src}')`;

  bg.style.backgroundImage = bg.style.backgroundImage == '' ? bgImg : '';
}

const newImagePaths = [
  // "newImages/1_alt.png", 
  "christmasScene/smaller/2.png",
  "christmasScene/smaller/3.png",
  "christmasScene/smaller/4.png",
  "christmasScene/smaller/5.png",
];
const newImageBgPath = "christmasScene/smaller/back.png";

const oldImagePaths = [
  "oldImages/peepshow_1.png",
  "oldImages/peepshow_2.png",
  "oldImages/peepshow_3.png",
  "oldImages/peepshow_4.png",
  "oldImages/peepshow_5.png",
]
const oldImageBgPath = "oldImages/peepshow_bg.png";

function injectImages(className, paths, bgPath) {
  let builder = "";
  for (var path of paths) builder += '<img src="' + path + '">';
  builder += '<img src="' + bgPath + '" id="bg">';
  document.querySelector(className).insertAdjacentHTML("beforeend", builder);
}

function swapImages() {
  useOldImages = !useOldImages;
  const imagePaths = useOldImages ? oldImagePaths : newImagePaths;
  const backgroundPath = useOldImages ? oldImageBgPath : newImageBgPath;

  // Clear existing images
  imageContainer.innerHTML = '';
  gridContainer.innerHTML = '';

  // Reinject images
  injectImages('.image-container', imagePaths, backgroundPath);
  injectImages('.grid-container', imagePaths, backgroundPath);

  // Refresh necessary elements
  gridImages = document.querySelectorAll('.grid-container img');
  translateImages();

  const bookInfoButton = document.getElementById('book-info');
  if (!useOldImages) {
    bookInfoButton.textContent = "Franz Bonn's 'The Children's Theatre'";
    bookInfoButton.style.fontSize = '9px';
  } else {
    bookInfoButton.textContent = "The Dance of the Tunnel Book";
    bookInfoButton.style.fontSize = '9px';
    bookInfoButton.onclick = function() {
      window.open('https://library.si.edu/digital-library/exhibition/paper-engineering/dance-tunnel-book', '_blank');
    };
  }
}


// setup
window.onload = function () {
  // buttons
  document.getElementById("click-button").addEventListener("click", function () {
    const container = document.querySelector('.image-container');
    container.classList.toggle("expanded");
    translateImages();
    // toggleBlurredBackground();
  });
  document.getElementById("space-button").addEventListener("click", function () {
    swapImages();
  });
  document.getElementById("slides-button").addEventListener("click", function () {
    toggleView();
  });


  // hardware
  window.addEventListener('wheel', handleMouseWheel);

  document.querySelector('.image-container').addEventListener('mousemove', handleMouseMove);

  document.querySelector('.image-container').addEventListener('click', function () {
    this.classList.toggle("expanded");
    translateImages();
    // toggleBlurredBackground();
  });

  document.addEventListener('keydown', spacebarListener);

  // load images
  swapImages();
  // toggleBlurredBackground();
};
