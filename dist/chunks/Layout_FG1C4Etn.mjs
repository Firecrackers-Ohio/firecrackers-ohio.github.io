import {
  b as createAstro,
  c as createComponent,
  m as maybeRenderHead,
  d as addAttribute,
  e as renderScript,
  a as renderTemplate,
  f as renderHead,
  r as renderComponent,
  g as renderSlot,
} from "./astro/server_vuwm5PAE.mjs";
import "kleur/colors";
import "html-escaper";
/* empty css                         */
import "clsx";

const $$Astro$1 = createAstro("https://firecrackersohio.com");
const $$Nav = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
    Astro2.self = $$Nav;
    const { pathname } = Astro2.url;
    const pageTitles = {
      "": "Home",
      about: "About",
      teams: "Teams",
    };
    const pageTitle = pageTitles[pathname.slice(1)] || "Home";
    return renderTemplate`${maybeRenderHead()}<nav class="top-0 z-50 bg-black"> <div class="flex flex-row h-16"> <div class="w-24 h-24 md:w-32 md:h-32 p-2 flex-none -mt-1 relative"> <a href="/"> <img src="/logo-round.svg" alt="Firecrackers of Central Ohio Logo"> </a> </div> <div class="w-screen flex flex-row p-2 flex-auto"> <!-- Mobile Page Title --> <div class="md:hidden flex items-center justify-center flex-1"> <h1 class="text-white font-bold text-lg">${pageTitle}</h1> </div> <!-- Desktop Menu --> <div class="hidden md:flex flex-row space-x-6 items-center"> <div class="menu-item"> <a${addAttribute(pathname.slice(1) === "" ? "active" : "", "class")} href="/">Home</a> </div> <div class="menu-item"> <a${addAttribute(pathname.slice(1) === "about" ? "active" : "", "class")} href="/about">About</a> </div> <div class="menu-item"> <a${addAttribute(pathname.slice(1) === "teams" ? "active" : "", "class")} href="/teams">Teams</a> </div> <div class="menu-item"> <a href="https://gear.firecrackersoftball.com/" target="_blank">Store</a> </div> </div> </div> <div class="w-10 h-full bg-[linear-gradient(120deg,_#000000_50%,_#c20202_50%)] flex-none"></div> <div class="bg-[#c20202] text-white flex flex-row p-2"> <!-- Mobile Menu Button --> <div class="md:hidden flex items-center"> <button id="mobile-menu-button" class="text-white p-2"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> <!-- Desktop Social Icons --> <div class="hidden md:flex flex-row"> <div class="social-icon"> <a href="https://www.facebook.com/firecrackersohio" target="_blank"> <img src="/fb.svg" alt="Facebook" class="h-10"> </a> </div> <div class="social-icon"> <a href="https://www.instagram.com/firecrackers_jones_2012/" target="_blank"> <img src="/ig.svg" alt="Instagram" class="h-10"> </a> </div> <div class="social-icon"> <a href="#" target="_blank"> <img src="/email.svg" alt="Email" class="h-10"> </a> </div> </div> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="hidden md:hidden bg-black"> <div class="px-4 py-2 pb-6 space-y-2"> <div class="menu-item"> <a${addAttribute(pathname.slice(1) === "" ? "active" : "", "class")} href="/">Home</a> </div> <div class="menu-item"> <a${addAttribute(pathname.slice(1) === "about" ? "active" : "", "class")} href="/about">About</a> </div> <div class="menu-item"> <a${addAttribute(pathname.slice(1) === "teams" ? "active" : "", "class")} href="/teams">Teams</a> </div> <div class="menu-item"> <a href="https://gear.firecrackersoftball.com/" target="_blank">Store</a> </div> <!-- Mobile Social Icons --> <div class="border-t border-gray-700 pt-4 mt-5"> <div class="flex justify-center space-x-4"> <div class="social-icon"> <a href="https://www.facebook.com/firecrackersohio" target="_blank"> <img src="/fb.svg" alt="Facebook" class="h-8"> </a> </div> <div class="social-icon"> <a href="https://www.instagram.com/firecrackers_jones_2012/" target="_blank"> <img src="/ig.svg" alt="Instagram" class="h-8"> </a> </div> <div class="social-icon"> <a href="#" target="_blank"> <img src="/email.svg" alt="Email" class="h-8"> </a> </div> </div> </div> </div> </div> </nav> ${renderScript($$result, "/Users/mike/code/mike/firecrackers/src/components/Nav.astro?astro&type=script&index=0&lang.ts")}`;
  },
  "/Users/mike/code/mike/firecrackers/src/components/Nav.astro",
  void 0
);

const $$Astro = createAstro("https://firecrackersohio.com");
const $$Layout = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
    Astro2.self = $$Layout;
    const { pathname } = Astro2.url;
    return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Orbitron:wght@400..900&display=swap" rel="stylesheet"><title>Firecrackers Central Ohio Fast Pitch</title>${renderHead()}</head> <body class="font-poppins bg-gray-100 dark:bg-gray-900 text-black dark:text-gray-200 font-display min-h-screen" data-astro-cid-sckkx6r4> ${renderComponent($$result, "Nav", $$Nav, { "data-astro-cid-sckkx6r4": true })} ${renderSlot($$result, $$slots["default"])} <footer class="bg-gray-400 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-t-2 border-red py-8" data-astro-cid-sckkx6r4> <div class="flex justify-center" data-astro-cid-sckkx6r4> <img src="/ohio-logo.svg" alt="Firecrackers Ohio Logo" class="h-16" data-astro-cid-sckkx6r4> </div> </footer> </body></html>`;
  },
  "/Users/mike/code/mike/firecrackers/src/layouts/Layout.astro",
  void 0
);

export { $$Layout as $ };
