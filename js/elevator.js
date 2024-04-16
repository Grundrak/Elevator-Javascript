document.addEventListener("DOMContentLoaded", function () {
  const elevator = document.querySelector(".elv");
  const buildingHeight = document.querySelector(".building").offsetHeight;
  const startButton = document.querySelector(".Start");
  const display = document.querySelectorAll(".grp-button button");
  const floorDisplay = document.querySelector(".floor-display");
  const floorHeight = buildingHeight / 5;
  let floorArray = [];
  console.log("floorHeight", floorHeight);
  console.log("buildingHeight", buildingHeight);

  function moveToFloor(floorNumber) {
    return new Promise((res) => {
      let target = floorHeight * floorNumber;
      const current = parseInt(elevator.style.bottom || 0);
      const distance = target - current;
      let startTime = null;
      const animationDuration = 2000;
      // console.log("current", current);
      // console.log("distance", distance);
      // console.log("target", target);
      const animationStep = (timestamp) => {
        if (!startTime) startTime = timestamp;

        const progress = (timestamp - startTime) / animationDuration;
        // console.log("progress", progress);

        const easedProgress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - (-2 * progress + 2) * (1 - progress);

        elevator.style.bottom = `${current + distance * easedProgress}px`;

        if (progress < 1) {
          window.requestAnimationFrame(animationStep);
        } else {
          changeStateDoor("7ol");
          setTimeout (()=> {

            res();
          },4000)
        }
      };

      window.requestAnimationFrame(animationStep);
    });
  }

  function changeStateDoor(state) {
    const doorLeft = document.querySelector(".elevator .left");
    const doorRight = document.querySelector(".elevator .right");
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

  async function processingFloors() {
    for (let i = 0; i < floorArray.length; i++) {
      await moveToFloor(floorArray[i]);
    }
    floorArray = [];
  }


  startButton.addEventListener("click", function () {
    processingFloors();
  });

  display.forEach((button) => {
    button.addEventListener("click", function () {
      const floorNumber = parseInt(this.innerText);
      const buttonDisplay = document.createElement("button");
      const textButton = document.createTextNode(floorNumber);
      buttonDisplay.appendChild(textButton);
      floorDisplay.appendChild(buttonDisplay);
      console.log("floorNumber is", floorNumber);
      floorArray.push(floorNumber);
      console.log("floorArray", floorArray);
    });
  });
});
