/* ==========================================================
   GrowWithHR Executive Introduction Engine
   Version 2.0 — Single Story Stage
   ----------------------------------------------------------
   Everything renders into one permanent container, #storyStage.
   There are no separate sections to switch between anymore —
   each scene below is JS-owned data, rendered in place.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* ==========================================================
       DOM REFERENCES
    ========================================================== */

    const storyStage =
        document.getElementById("storyStage");

    const skipButton =
        document.getElementById("skipIntro");

    /* ==========================================================
       TIMINGS (ms). `null` duration means "wait for the user."
    ========================================================== */

    const TIMING = {

        hero: 2000,

        message: 2000,

        lastMessage: 2500,

        card: 2250

    };

    /* ==========================================================
       ENGINE STATE
    ========================================================== */

    const state = {

        index: 0,

        timer: null,

        running: false,

        skipped: false

    };

    /* ==========================================================
       SCENES
       Hero is Scene 0 — it has no special wrapper or treatment,
       it's rendered exactly like every other scene below it.
    ========================================================== */

    const scenes = [

        /* ---------------- Scene 0 : Hero ---------------- */

        {
            name: "hero",
            duration: TIMING.hero,
            render: () => `
                <section id="introHero" class="intro-hero" aria-label="Executive Advisory Intelligence">
                    <img src="assets/hrtechify-logo.png" alt="HRTechify" class="intro-logo">
                    <h1 class="intro-title">Executive Advisory Intelligence</h1>
                    <p class="intro-subtitle">Powered by HRTechify</p>
                </section>
            `
        },

        /* ---------------- Scene 1 : Story beat ---------------- */

        {
            name: "scene-1",
            duration: TIMING.message,
            render: () => `
                <article class="intro-scene active" data-scene="1">
                    <h2>Every organisation has a story.</h2>
                </article>
            `
        },

        /* ---------------- Scene 2 : Story beat ---------------- */

        {
            name: "scene-2",
            duration: TIMING.message,
            render: () => `
                <article class="intro-scene active" data-scene="2">
                    <h2>Every stage of growth brings new responsibilities.</h2>
                </article>
            `
        },

        /* ---------------- Scene 3 : Story beat ---------------- */

        {
            name: "scene-3",
            duration: TIMING.lastMessage,
            render: () => `
                <article class="intro-scene active" data-scene="3">
                    <h2>The decisions you make about people today shape the organisation you become tomorrow.</h2>
                </article>
            `
        },

        /* ---------------- Scene 4 : Company DNA ---------------- */

        {
            name: "card-company-dna",
            duration: TIMING.card,
            render: () => `
                <article class="intro-card active" data-card="1">
                    <div class="intro-card-icon">🧬</div>
                    <h2>Company DNA</h2>
                    <p>We begin by understanding what makes your organisation distinct.</p>
                    <span>Industry • Size • Structure • Operating Model</span>
                </article>
            `
        },

        /* ---------------- Scene 5 : Growth Stage ---------------- */

        {
            name: "card-growth-stage",
            duration: TIMING.card,
            render: () => `
                <article class="intro-card active" data-card="2">
                    <div class="intro-card-icon">📈</div>
                    <h2>Growth Stage</h2>
                    <p>Every stage of growth introduces new people, compliance and leadership responsibilities.</p>
                    <span>Startup • Scaling • Established • Expanding</span>
                </article>
            `
        },

        /* ---------------- Scene 6 : Organisation Story ---------------- */

        {
            name: "card-organisation-story",
            duration: TIMING.card,
            render: () => `
                <article class="intro-card active" data-card="3">
                    <div class="intro-card-icon">🏢</div>
                    <h2>Organisation Story</h2>
                    <p>Your answers help Coach HRTechify prepare recommendations that fit your organisation, not generic best practices.</p>
                    <span>Context • Responsibilities • Next Actions</span>
                </article>
            `
        },

        /* ---------------- Scene 7 : Coach + Begin (terminal) ----------------
           One message, no typing replay, no duplicate lines.
           The Begin Assessment button lives here, inside the
           same scene, and is bound the moment it's rendered. */

        {
            name: "coach",
            duration: null,
            render: () => `
                <div class="coach-card">
                    <div class="coach-avatar">
                        <div class="coach-avatar-circle">GH</div>
                    </div>
                    <div class="coach-dialogue">
                        <p class="coach-line active">
                            Hello, I'm Coach HRTechify. Thank you for taking the time to meet with us —
                            before we offer any recommendations, we'd like to understand your organisation:
                            your business, your people, and the stage of growth you're in. Every response
                            helps us prepare guidance that's specific to you, not generic best practices.
                            When you're ready, let's begin.
                        </p>
                    </div>
                </div>
                <div class="intro-actions">
                    <button id="startAssessment" type="button" class="exec-primary-btn intro-begin-btn">
                        Begin Assessment
                    </button>
                </div>
            `
        }

    ];

    /* ==========================================================
       HELPERS
    ========================================================== */

    function clearTimer() {

        if (state.timer !== null) {

            clearTimeout(state.timer);

            state.timer = null;

        }

    }

    /* ==========================================================
       RENDER A SCENE INTO THE STORY STAGE
    ========================================================== */

    function renderScene(index) {

        const scene = scenes[index];

        if (!scene || !storyStage) {

            return;

        }

        storyStage.classList.remove("scene-fade-in");

        storyStage.innerHTML = scene.render();

        // Force reflow so the fade-in animation replays every time.
        void storyStage.offsetWidth;

        storyStage.classList.add("scene-fade-in");

        if (scene.name === "coach") {

            bindBeginButton();

        }

    }

    /* ==========================================================
       BIND THE DYNAMICALLY-RENDERED BEGIN BUTTON
       This button doesn't exist until the coach scene renders,
       so executive-assessment.js can't bind it at page load —
       we hand off to the real assessment engine directly here.
    ========================================================== */

    function bindBeginButton() {

        const beginButton =
            document.getElementById("startAssessment");

        if (!beginButton) {

            return;

        }

        beginButton.addEventListener(

            "click",

            handOffToAssessment

        );

    }

    /* ==========================================================
       HAND OFF TO THE REAL ASSESSMENT ENGINE
    ========================================================== */

    function handOffToAssessment() {

        clearTimer();

        state.running = false;

        if (

            window.executiveAssessment &&

            typeof window.executiveAssessment.startAssessment === "function"

        ) {

            window.executiveAssessment.startAssessment();

            return;

        }

        console.warn(

            "Executive Assessment engine not available yet."

        );

    }

    /* ==========================================================
       ADVANCE TO THE NEXT SCENE
    ========================================================== */

    function advance() {

        if (state.skipped || !state.running) {

            return;

        }

        const current = scenes[state.index];

        // Terminal scene — never auto-advances, waits for the user.
        if (current && current.duration === null) {

            return;

        }

        state.index++;

        if (state.index >= scenes.length) {

            return;

        }

        renderScene(state.index);

        const next = scenes[state.index];

        if (next.duration !== null) {

            state.timer = setTimeout(advance, next.duration);

        }

    }

    /* ==========================================================
       START THE SEQUENCE
    ========================================================== */

    function start() {

        clearTimer();

        state.index = 0;

        state.running = true;

        state.skipped = false;

        renderScene(0);

        const first = scenes[0];

        if (first.duration !== null) {

            state.timer = setTimeout(advance, first.duration);

        }

    }

    /* ==========================================================
       SKIP INTRODUCTION
       Skips straight to the real assessment, same as before.
    ========================================================== */

    function skipIntroduction() {

        state.skipped = true;

        clearTimer();

        handOffToAssessment();

    }

    /* ==========================================================
       EVENT LISTENERS
    ========================================================== */

    if (skipButton) {

        skipButton.addEventListener(

            "click",

            skipIntroduction

        );

    }

    /* ==========================================================
       PAGE VISIBILITY
       Pause the pending auto-advance when the tab loses focus,
       resume the remaining wait when it regains focus.
    ========================================================== */

    document.addEventListener(

        "visibilitychange",

        () => {

            if (!state.running) {

                return;

            }

            if (document.hidden) {

                clearTimer();

                return;

            }

            const current = scenes[state.index];

            if (current && current.duration !== null) {

                state.timer = setTimeout(advance, current.duration);

            }

        }

    );

    /* ==========================================================
       ACCESSIBILITY
    ========================================================== */

    const prefersReducedMotion = window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    );

    if (prefersReducedMotion.matches) {

        TIMING.hero = 400;

        TIMING.message = 400;

        TIMING.lastMessage = 500;

        TIMING.card = 500;

    }

    /* ==========================================================
       PUBLIC API
       (Available from the browser console for debugging.)
    ========================================================== */

    window.introEngine = {

        start,

        skip: skipIntroduction,

        goTo: renderScene,

        scenes,

        state

    };

    /* ==========================================================
       START ENGINE
    ========================================================== */

    start();

});
