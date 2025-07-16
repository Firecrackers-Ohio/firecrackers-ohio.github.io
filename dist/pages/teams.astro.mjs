import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_vuwm5PAE.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_FG1C4Etn.mjs';
export { renderers } from '../renderers.mjs';

const $$Teams = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="font-poppins min-h-screen flex items-center justify-center"> <div class="text-center"> <h1 class="text-6xl md:text-8xl font-bold text-gray-800 mb-4 tracking-tight">
Coming Soon!
</h1> <p class="text-xl md:text-2xl text-gray-600 max-w-md mx-auto mb-8">
We're working on something amazing. Stay tuned!
</p> <img src="/cracker-dude-ohio.svg" alt="Cracker Dude Ohio" class="h-36 mx-auto dark:hidden"> <img src="/cracker-dude-ohio-dark.svg" alt="Cracker Dude Ohio" class="h-36 mx-auto hidden dark:block"> </div> </div> ` })}`;
}, "/Users/mike/code/mike/firecrackers/src/pages/teams.astro", void 0);

const $$file = "/Users/mike/code/mike/firecrackers/src/pages/teams.astro";
const $$url = "/teams";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Teams,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
