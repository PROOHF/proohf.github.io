// TYPEWRITER
const texts = [
  { text: "build something together! ", color: "#4133B7" },
  { text: "be friends? ", color: "#ff4081" },
  { text: "make ideas come alive. ", color: "#ffcc00" },
  { text: "have some fun! ", color: "#86BBD8" }
];

const element = document.querySelector(".typewriter");
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const current = texts[textIndex];
  const currentText = current.text;

  element.style.color = current.color;

  if (isDeleting) {
    element.textContent = currentText.substring(0, charIndex--);
  } else {
    element.textContent = currentText.substring(0, charIndex++);
  }

  let speed = isDeleting ? 100 : 130;

  if (!isDeleting && charIndex === currentText.length) {
    speed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    speed = 400;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

// GREETINGS BELOW PICTURE
var date = new Date();
var weekday = new Array(7);
weekday[0] = "Tomorrow is a new week with new possibilities";
weekday[1] = "One day or day one, you decide";
weekday[2] = "It always seems impossible until it's done.";
weekday[3] = "Have a wonderful wednesday";
weekday[4] = "IT'S FRIDAY!! Sorry.. just practicing for tomorrow";
weekday[5] = "Friday means taco, enjoy it!";
weekday[6] = "It's saturday, do something fun today!";

var weekdayNo = weekday[date.getDay()];
document.getElementById("weekdayGreeting").innerHTML = weekdayNo;

const svgImages = [
  {
    src: 'images/bbq.svg',
    alt: 'Illustration of me flipping some hotdogs'
  },
  {
    src: 'images/design.svg',
    alt: 'llustration of me doing some design work'
  },
  {
    src: 'images/maintenance.svg',
    alt: 'llustration of me doing some maintenance'
  }
];


// LOADING RANDOM SVG FROM IMAGES FOLDER ON REFRESH
const randomIndex = Math.floor(Math.random() * svgImages.length);
const randomImage = svgImages[randomIndex];

const imgElement = document.getElementById('random-svg');

imgElement.src = randomImage.src;
imgElement.alt = randomImage.alt;



// FILTER PROJECT BUTTONS
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const tag = button.dataset.tag;

    projects.forEach(project => {
      const tags = project.dataset.tags.split(' ');

      if (tag === 'all' || tags.includes(tag)) {
        project.classList.remove('hidden');
      } else {
        project.classList.add('hidden');
      }
    });
  });
});
  