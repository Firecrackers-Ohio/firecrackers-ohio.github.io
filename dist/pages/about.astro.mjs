import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_vuwm5PAE.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_FG1C4Etn.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col mx-6 mt-8 sm:w-3/4 md:w-2/3 md:ml-36"> <div> <h1 class="p-heading">Firecracker Central Ohio</h1> <p class="p-body">
We are a group of fastpitch softball teams located in central Ohio who
        proudly represent the national <a class="p-link" href="https://firecrackersoftball.com/" target="_blank">Firecracks Softball Organization</a>.
</p> </div> <div> <h1 class="p-heading">Mission Statement</h1> <p class="p-body">
At Firecrackers Ohio, our mission is to provide our athletes with
        exceptional training that fosters both athletic excellence and personal
        growth. We are committed to developing confident, respectful, and
        resilient young women—on and off the field.
<br> <br>
Rooted in professionalism, self-respect, and respect for others, our program
        empowers each player to embrace her individuality, believe in her abilities,
        and play the game with passion and purpose. At the same time, we emphasize
        the power of teamwork—recognizing that true success is built through collaboration,
        shared effort, and a deep commitment to one another.
<br> <br>
To be a Firecracker is to know your worth, trust in your potential, and understand
        that your strength is amplified by the team around you. It means striving
        to make choices that lead to lifelong happiness—both in softball and in life.
</p> </div> <div> <h1 class="p-heading">Culture</h1> <p class="p-body">
The Central Ohio Firecrackers foster a team culture that is tightly
        knit, family-oriented, and grounded in mutual support. We believe in a
        “work hard, play hard” mentality—where competitive drive is matched by
        laughter, camaraderie, and lasting friendships. Our players, coaches,
        and families are all in this together, committed to one another’s growth
        on and off the field. We lift each other up, celebrate each other&#39;s
        wins, and never let anyone fall behind. It’s more than softball—it’s a
        united team built on encouragement, effort, and shared purpose.
</p> </div> </div> ` })}`;
}, "/Users/mike/code/mike/firecrackers/src/pages/about.astro", void 0);

const $$file = "/Users/mike/code/mike/firecrackers/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
