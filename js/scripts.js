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
    src: 'images/dashboard.svg',
    alt: 'llustration of a awesome dashboard'
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
  