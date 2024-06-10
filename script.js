let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");

//List of fontlist
let fontList = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Garamond",
  "Georgia",
  "Courier New",
  "cursive",
];

//Initial Settings
const initializer = () => {
  //function calls for highlighting buttons
  //No highlights for link, unlink,lists, undo,redo since they are one time operations
  highlighter(alignButtons, true);
  highlighter(spacingButtons, true);
  highlighter(formatButtons, false);
  highlighter(scriptButtons, true);

  //create options for font names
  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });

  //fontSize allows only till 7
  for (let i = 1; i <= 7; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    fontSizeRef.appendChild(option);
  }

  //default size
  fontSizeRef.value = 3;
};

//main logic
const modifyText = (command, defaultUi, value) => {
  //execCommand executes command on selected text
  document.execCommand(command, defaultUi, value);
};

//For basic operations which don't need value parameter
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

//options that require value parameter (e.g colors, fonts)
advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

//link
linkButton.addEventListener("click", () => {
  let userLink = prompt("Enter a URL");
  //if link has http then pass directly else add https
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
  } else {
    userLink = "http://" + userLink;
    modifyText(linkButton.id, false, userLink);
  }
});

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      //needsRemoval = true means only one button should be highlight and other would be normal
      if (needsRemoval) {
        let alreadyActive = false;

        //If currently clicked button is already active
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }

        //Remove highlight from other buttons
        highlighterRemover(className);
        if (!alreadyActive) {
          //highlight clicked button
          button.classList.add("active");
        }
      } else {
        //if other buttons can be highlighted
        button.classList.toggle("active");
      }
    });
  });
};

const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

window.onload = initializer();

let symbols = [];
let imageCount = 0;
let keyCount = {
  'y': 0,
  'u': 0,
  'i': 0
};

document.addEventListener('keydown', function(event) {
  if (imageCount < 20 && (event.key === 'y' || event.key === 'u' || event.key === 'i')) {
    const camera = document.getElementById('camera');
    camera.style.animation = 'shake 0.2s';
    
    setTimeout(function() {
      camera.style.animation = '';
    }, 200);

    const image = new Image();
    image.src = 'images/brokeGlass.png';
    image.style.position = 'fixed'; // Set position to fixed
    image.style.left = Math.random() * (window.innerWidth - 100) + 'px'; // Adjust for image width
    image.style.top = Math.random() * (window.innerHeight - 100) + 'px'; // Adjust for image height
    const size = Math.floor(Math.random() * 21) + 5; // Random size between 5% and 25%
    image.style.width = size + '%';
    image.style.zIndex = '8'; // Set a high z-index value to display above other elements
    
    document.body.appendChild(image);
    
    imageCount++;
    keyCount[event.key]++;
    
    if (imageCount === 20) {
      const counter = document.createElement('div');
      counter.style.position = 'fixed';
      counter.style.bottom = '20px';
      counter.style.left = '80px';
      counter.style.transform = 'translate(-50%, -50%)';
      counter.style.backgroundColor = 'black';
      counter.style.color = 'white';
      counter.style.padding = '10px';
      counter.style.borderRadius = '10px';
      counter.innerText = `y: ${keyCount['y']} | u: ${keyCount['u']} | i: ${keyCount['i']}`;
      counter.style.zIndex = '9999'
      
      document.body.appendChild(counter);
    }
  }

  const symbol = event.key;
  if (symbol.match(/[a-z]/i) || symbol.match(/[^a-z]/i)) {
    symbols.push(symbol);
    updateBackground();
  }
});

function updateBackground() {
  const backgroundText = symbols.join(" "); // Join symbols without reversing for the left side
  const backgroundDivLeft = createBackgroundDiv("left", backgroundText, "0", "0", "black");

  const backgroundTextRight = symbols.reverse().join(" "); // Reverse symbols for the right side
  const backgroundDivRight = createBackgroundDiv("right", backgroundTextRight, "auto", "0", "white");

  // Remove any existing background divs
  const existingBackgroundLeft = document.getElementById("background-div-left");
  if (existingBackgroundLeft) {
    existingBackgroundLeft.remove();
  }

  const existingBackgroundRight = document.getElementById("background-div-right");
  if (existingBackgroundRight) {
    existingBackgroundRight.remove();
  }

  document.body.appendChild(backgroundDivLeft);
  document.body.appendChild(backgroundDivRight);
}

function createBackgroundDiv(side, text, top, right, background) {
  const backgroundDiv = document.createElement("div");
  backgroundDiv.style.position = "fixed";
  backgroundDiv.style.top = top;
  backgroundDiv.style.right = right;
  backgroundDiv.style.bottom = "0";
  backgroundDiv.style.width = "70vw"; // Set width to half the viewport width
  backgroundDiv.style.overflow = "hidden"; // Prevent text from exceeding div width
  backgroundDiv.style.color = side === "left" ? "white" : "black"; // Set text color based on side
  backgroundDiv.style.fontSize = "2rem";
  backgroundDiv.style.padding = "20px";
  backgroundDiv.style.zIndex = "-1"; // Set z-index to be behind other content
  backgroundDiv.id = side === "left" ? "background-div-left" : "background-div-right";

  if (side === "right") {
    backgroundDiv.style.transform = "rotate(180deg)"; // Rotate text upside-down for the right side
    backgroundDiv.style.background = "white"; // Set white background for the right side
  } else {
    backgroundDiv.style.background = "black"; // Set black background for the left side
  }

  const textNode = document.createTextNode(text);
  backgroundDiv.appendChild(textNode);

  return backgroundDiv;
}
interact('#draggablePopup')
    .draggable({
        onmove: function (event) {
            var target = event.target,
                // keep the dragged position in the data-x/data-y attributes
                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

            // translate the element
            target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

            // update the position attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    })
    .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
            move(event) {
                let { x, y } = event.target.dataset;

                x = (parseFloat(x) || 0) + event.deltaRect.left;
                y = (parseFloat(y) || 0) + event.deltaRect.top;

                Object.assign(event.target.style, {
                    width: `${event.rect.width}px`,
                    height: `${event.rect.height}px`,
                    transform: `translate(${x}px, ${y}px)`
                });

                Object.assign(event.target.dataset, { x, y });
            }
        }
    });
    
interact('.container')
  .draggable({
    onmove: function (event) {
      const target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.transform = `translate(${x}px, ${y}px)`;

      // update the position attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  })
  .resizable({
    // Resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        let { x, y } = event.target.dataset;

        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;

        // Update the element's style
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`
        });

        // Update the data attributes
        Object.assign(event.target.dataset, { x, y });
      }
    },
    modifiers: [
      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 }
      })
    ],
    inertia: true
  });

  document.getElementById('reset-button').addEventListener('click', function() {
    window.location.reload(); // Refreshes the page
  });

  function openPopup() {
    document.getElementById('popup').style.display = 'block';
  }
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }