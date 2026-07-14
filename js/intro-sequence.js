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

    window.introEngine={

        current:0,

        showStep,

        hideAllSteps

    };

    /* ---------- INITIAL STATE ---------- */

    showStep(0);

});
