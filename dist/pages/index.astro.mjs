import {
  c as createComponent,
  r as renderComponent,
  a as renderTemplate,
  m as maybeRenderHead,
} from "../chunks/astro/server_vuwm5PAE.mjs";
import "kleur/colors";
import "html-escaper";
import { $ as $$Layout } from "../chunks/Layout_FG1C4Etn.mjs";
export { renderers } from "../renderers.mjs";

const $$Index = createComponent(
  ($$result, $$props, $$slots) => {
    return renderTemplate`${renderComponent(
      $$result,
      "Layout",
      $$Layout,
      {},
      {
        default:
          $$result2 => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen"> <div class="container mx-auto px-4 py-8"> <!-- Header --> <div class="mb-12 text-center"> <img src="/logo-text-outline.svg" alt="FIRECRACKERS" class="h-24 mx-auto filter brightness-50 dark:brightness-80 dark:invert"> <h2 class="text-4xl font-bold text-gray-900 dark:text-gray-400 font-almarai">TRYOUTS</h2> <p class="py-6 text-lg text-gray-700 dark:text-gray-300 mt-2">All tryouts will be held at Lou Beriner Sports Park. Players are encouraged to attend both dates. See below for age group details. Please reach out to the team coach with any questions.</p> <a href="https://docs.google.com/forms/d/e/1FAIpQLSd3Xiv5M5WycU9bQDIubCt_eAFehdVMxJ-IRgg3rR7nxvEIgw/viewform" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-6 py-3 bg-red text-white font-bold rounded-lg transition-colors">
Click here to register
</a> </div> <!-- Age Groups Grid --> <div class="grid grid-cols-1 gap-8 lg:grid-cols-2"> ${[
            {
              age: "10U",
              coach: "BROWN",
              birthYears: "SEPT 2014 - DEC 2015",
              dateOne: "JULY 15",
              fieldOne: "FIELD 28",
              dateTwo: "JULY 20",
              fieldTwo: "FIELD TBD",
              time: "6-8p",
              coachName: "Coach Gary",
              phone: "(614) 989-6569",
            },
            {
              age: "11U",
              coach: "NIEMAN",
              birthYears: "SEPT 2013 - DEC 2014",
              dateOne: "JULY 16",
              fieldOne: "FIELD 28",
              dateTwo: "JULY 20",
              fieldTwo: "FIELD 28",
              time: "6-8p",
              coachName: "Coach Matt",
              phone: "(724) 252-6396",
            },
            {
              age: "12U",
              coach: "ALLEN",
              birthYears: "SEPT 2012 - DEC 2013",
              dateOne: "JULY 9",
              fieldOne: "FIELD 26",
              dateTwo: "JULY 16",
              fieldTwo: "FIELD 26",
              time: "6-8p",
              coachName: "Coach Casey",
              phone: "(614) 917-8858",
            },
            {
              age: "13U",
              coach: "JONES",
              birthYears: "SEPT 2011 - DEC 2012",
              dateOne: "JULY 15",
              fieldOne: "FIELD 26",
              dateTwo: "JULY 20",
              fieldTwo: "FIELD 26",
              time: "6-8p",
              coachName: "Coach Phil",
              phone: "(614) 440-8009",
            },
            {
              age: "14U",
              coach: "EVANS",
              birthYears: "SEPT 2010 - DEC 2011",
              dateOne: "JULY 15",
              fieldOne: "FIELD 22",
              dateTwo: "JULY 20",
              fieldTwo: "FIELD 22",
              time: "6-8p",
              coachName: "Coach Andy",
              phone: "(614) 206-9110",
            },
          ].map(
            team =>
              renderTemplate`<div class="rounded-lg bg-red-600 p-6 space-y-4"> <!-- Team Info --> <div class="border-b-2 border-gray-800/30 dark:border-gray-300/30 pb-3"> <h3 class="text-3xl font-bold text-red">${team.age} - ${team.coach}</h3> <p class="text-lg">${team.birthYears}</p> </div> <!-- Tryout Details --> <div class="space-y-2"> <p class="text-lg">LOU BERLINER SPORTS PARK</p> <div class="flex items-baseline justify-between"> <div class="text-lg"> <span class="font-bold">${team.dateOne}</span> | ${team.fieldOne} | ${team.time} </div> </div> <div class="flex items-baseline justify-between"> <div class="text-lg"> <span class="font-bold">${team.dateTwo}</span> | ${team.fieldTwo} | ${team.time} </div> </div> <p class="text-lg"> ${team.coachName}: ${team.phone} </p> </div> </div>`
          )} </div> </div> </main> `,
      }
    )}`;
  },
  "/Users/mike/code/mike/firecrackers/src/pages/index.astro",
  void 0
);

const $$file = "/Users/mike/code/mike/firecrackers/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Index,
      file: $$file,
      url: $$url,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const page = () => _page;

export { page };
