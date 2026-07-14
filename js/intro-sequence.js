/* ==========================================================
   GrowWithHR
   Executive Intro Experience
   Version 1.0
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const intro = document.getElementById("introApp");

    if (!intro) return;

    intro.innerHTML = `

        <img
            src="assets/hrtechify-logo.png"
            class="exec-intro-logo"
            alt="HRTechify">

        <h1 class="exec-intro-title">

            Executive Advisory Intelligence

        </h1>

        <p class="exec-intro-subtitle">

            Powered by HRTechify

        </p>

        <div class="exec-scene">

            <h2>

                Every organisation has a story.

            </h2>

        </div>

    `;

});
