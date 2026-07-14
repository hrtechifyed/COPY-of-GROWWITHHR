/* ==========================================================
   GrowWithHR
   Executive Intro Engine
   Version 2.0
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const steps = [

        document.getElementById("introHero"),

        document.getElementById("introMessages"),

        document.getElementById("introCards"),

        document.getElementById("introTransition"),

        document.getElementById("coachIntroduction"),

        document.getElementById("introActions")

    ];

    function hideAllSteps(){

        steps.forEach(step=>{

            if(step){

                step.classList.remove("is-active");

            }

        });

    }

    function showStep(index){

        hideAllSteps();

        if(steps[index]){

            steps[index].classList.add("is-active");

        }

    }

 window.introEngine = {

    current:0,

    showStep,

    hideAllSteps

};

/* ==========================================================
   INTRO TIMELINE
========================================================== */

const introMessages = document.querySelectorAll(".intro-scene");

let currentScene = 0;

function showMessage(index){

    introMessages.forEach(scene=>{

        scene.classList.remove("active");

    });

    introMessages[index].classList.add("active");

}

function playIntroMessages(){

    if(currentScene >= introMessages.length){

        showStep(2);

        return;

    }

    showStep(1);

    showMessage(currentScene);

    currentScene++;

    const delay = currentScene === 3 ? 2500 : 2000;

    setTimeout(playIntroMessages, delay);

}

/* ---------- START ---------- */

showStep(0);

setTimeout(() => {

    playIntroMessages();

}, 2000);

});
