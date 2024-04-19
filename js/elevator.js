document.addEventListener("DOMContentLoaded", function () {
  const elevator = document.querySelector(".elv");
  const buildingHeight = document.querySelector(".building").offsetHeight;
  const startButton = document.querySelector(".Start");
  const resetButton = document.querySelector(".Reset");
  const display = document.querySelectorAll(".grp-button button");
  const doorLeft = document.querySelector(".elevator .left");
  const doorRight = document.querySelector(".elevator .right");
  const floorDisplay = document.querySelector(".floor-display");
  const floorIndicatorAffiche = document.querySelector(".text-cmd .text-f");
  const floorIndicatorElv = document.querySelector(".elv .text-Elv");
  const direction = document.querySelector(".direction");
  const step = document.querySelector(".step");

  const timer = document.querySelector(".timer");
  const floorHeight = buildingHeight / 5;
  let floorArray = [];
  let currentFloor = 0;
  let stepsCount = 0;
  let directionElv = 0;
  let timerCount = 0;
  let timerOpp = 0;
  console.log("floorHeight", floorHeight);
  console.log("buildingHeight", buildingHeight);

  function moveToFloor(floorNumber) {
    return new Promise((res) => {
      let target = floorHeight * floorNumber;
      const current = parseInt(elevator.style.bottom || 0);
      const distance = target - current;
      let startTime = null;
      const animationDuration = 2000;
      let previousFloor = currentFloor;
      if (floorNumber > currentFloor) {
        directionElv = "Up";
      } else if (floorNumber < currentFloor) {
        directionElv = "Down";
      } else {
        directionElv = "Wait";
      }
      updateDirection();

      const animationStep = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / animationDuration;

        const easedProgress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - (-2 * progress + 2) * (1 - progress);

        elevator.style.bottom = `${current + distance * easedProgress}px`;
        if (progress < 1) {
          window.requestAnimationFrame(animationStep);
        } else {
          floorIndicatorAffiche.innerText = floorNumber;
          floorIndicatorElv.innerText = floorNumber;
          changeStateDoor("7ol");
          if (currentFloor != floorNumber) {
            let passedFloor = Math.abs(floorNumber-previousFloor);
            stepsCount += passedFloor;
            updateStep();
            timerRun();
          }
          setTimeout(() => {
            currentFloor = floorNumber;
            res();
          }, 4000);
        }
      };

      window.requestAnimationFrame(animationStep);
    });
  }

  function resetElevator() {
    floorArray = [];
    currentFloor = 0;
    stepsCount = 0;
    directionElv = "Wait";
    timerCount = 0;
    clearInterval(timerOpp);
    timer.innerText = `Elapsed time: 0s`;
    elevator.style.bottom = "0px";
    floorIndicatorAffiche.innerText = "0";
    floorIndicatorElv.innerText = "0";
    floorDisplay.innerText = "";
    updateStep();
    updateDirection();
  }
  function changeStateDoor(state) {
    doorLeft.classList.remove("door-open", "door-close");
    doorRight.classList.remove("door-open", "door-close");
    if (state === "7ol") {
      doorLeft.classList.add("door-open");
      doorRight.classList.add("door-open");
      setTimeout(() => {
        doorLeft.classList.add("door-close");
        doorRight.classList.add("door-close");
      }, 2000);
    } else {
      doorLeft.classList.add("door-close");
      doorRight.classList.add("door-close");
    }
  }
  
  async function processingFloor() {
    for (let i = 0; i < floorArray.length; i++) {
      await moveToFloor(floorArray[i]);
    }
    floorArray = [];
  }

  function debounce(mainFunction, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        mainFunction(...args);
      }, delay);
    };
  }
  function updateStep() {
    step.innerText = `Step : ${stepsCount}`;
  }
  function updateDirection() {
    direction.innerText = `Direction elevator : ${directionElv}`;
  }
  function timerRun() {
    let start = Date.now();
    timerOpp = setInterval(function () {
      timerCount = Math.floor((Date.now() - start) / 1000);
    }, 1000);
    timer.innerText = `Elapsed time : ${timerCount}s`;
  }
  const debounceMoveToFloor = debounce(processingFloor, 3000);

  startButton.addEventListener("click", function() {
     
    debounceMoveToFloor(); 
});  resetButton.addEventListener("click", resetElevator);
  display.forEach((button) => {
    button.addEventListener("click", function () {
      const floorNumber = parseInt(this.innerText);
      const buttonDisplay = document.createElement("button");
      const textButton = document.createTextNode(floorNumber);
      buttonDisplay.appendChild(textButton);
      floorDisplay.appendChild(buttonDisplay);
      floorArray.push(floorNumber);
      debounceMoveToFloor();
    });
  });
});
