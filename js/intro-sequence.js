/* ==========================================================
   GrowWithHR
   Executive Intro Engine
   Version 1.0
========================================================== */

class IntroEngine {

    constructor() {

        this.current = 0;

        this.timeline = [];

        this.steps = {

            hero: document.getElementById("introHero"),

            messages: document.getElementById("introMessages"),

            cards: document.getElementById("introCards"),

            transition: document.getElementById("introTransition"),

            coach: document.getElementById("coachIntroduction"),

            actions: document.getElementById("introActions")

        };

    }

    register(step) {

        this.timeline.push(step);

    }

    hideAll() {

        Object.values(this.steps).forEach(step => {

            if (step) {

                step.classList.remove("is-active");

            }

        });

    }

    show(name) {

        this.hideAll();

        if (this.steps[name]) {

            this.steps[name].classList.add("is-active");

        }

    }

}

document.addEventListener("DOMContentLoaded", () => {

    window.introEngine = new IntroEngine();

});
