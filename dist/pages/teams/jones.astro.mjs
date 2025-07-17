import {
  b as createAstro,
  c as createComponent,
  m as maybeRenderHead,
  a as renderTemplate,
  u as unescapeHTML,
  r as renderComponent,
} from "../../chunks/astro/server_vuwm5PAE.mjs";
import "kleur/colors";
import "html-escaper";
import { $ as $$Layout } from "../../chunks/Layout_FG1C4Etn.mjs";
import "clsx";
export { renderers } from "../../renderers.mjs";

const $$Astro$3 = createAstro("https://firecrackersohio.com");
const $$CoachTitle = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
    Astro2.self = $$CoachTitle;
    const { teamName } = Astro2.props;
    return renderTemplate`${maybeRenderHead()}<div class="flex mt-4 mb-2 mx-0 md:mt-6 md:mb-4 md:mx-10"> <div class="flex grow"> <div class="flex-col w-full mr-0"> <div class="flex-none">&nbsp;</div> <div class="grow h-1 bg-red"></div> <div class="flex-none">&nbsp;</div> </div> </div> <div class="align-middle font-extrabold font-[Orbitron] w-fit text-4xl text-red sm:text-5xl md:text-5xl"> ${teamName} </div> <div class="flex grow"> <div class="flex-col w-full ml-0"> <div class="flex-none">&nbsp;</div> <div class="grow h-1 bg-red"></div> <div class="flex-none">&nbsp;</div> </div> </div> </div>`;
  },
  "/Users/mike/code/mike/firecrackers/src/components/teams/CoachTitle.astro",
  void 0
);

const $$Astro$2 = createAstro("https://firecrackersohio.com");
const $$TeamOverview = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
    Astro2.self = $$TeamOverview;
    const { text } = Astro2.props;
    return renderTemplate`${maybeRenderHead()}<div> <h1>TEAM OVERVIEW</h1> <div>${text}</div> </div>`;
  },
  "/Users/mike/code/mike/firecrackers/src/components/teams/TeamOverview.astro",
  void 0
);

const $$Astro$1 = createAstro("https://firecrackersohio.com");
const $$CoachBio = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
    Astro2.self = $$CoachBio;
    const { coachName, coachBio } = Astro2.props;
    return renderTemplate`${maybeRenderHead()}<h2>${coachName}</h2> <div class="ml-4">${coachBio}</div>`;
  },
  "/Users/mike/code/mike/firecrackers/src/components/teams/CoachBio.astro",
  void 0
);

const $$Astro = createAstro("https://firecrackersohio.com");
const $$VisionPhilosophy = createComponent(
  ($$result, $$props, $$slots) => {
    const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
    Astro2.self = $$VisionPhilosophy;
    const { text } = Astro2.props;
    return renderTemplate`${maybeRenderHead()}<div> <h1 class="mt-8">PROGRAM VISION AND PHILOSOPHY</h1> <div class="mb-20">${text}</div> </div>`;
  },
  "/Users/mike/code/mike/firecrackers/src/components/teams/VisionPhilosophy.astro",
  void 0
);

const html = () => "";

const frontmatter = {
  title: "13U JONES",
  teamOverview:
    "Firecrackers OH - 13U Jones has delivered a standout season with a 44-8 tournament record, claiming championship titles at the Boneyard Bash, Ghouls and Girls Halloween Showdown, Thaw Your Bats, Madison Select Classic, and Bellefontaine Bomber. The team also earned a runner-up finish at the Battle for the Belt and has qualified for the prestigious USSSA National Championship in Destin, Florida. Committed to facing top-tier competition, the team continues to grow through discipline, preparation, and a desire to play the game the right way.\n",
  coaches: [
    {
      name: "Phil Jones - Head Coach",
      bio: "With 8 years of coaching experience and in his third season leading a travel team, Coach Jones emphasizes mental toughness, softball IQ, and team culture. His calm, focused leadership fosters personal growth, accountability, and selfless play.",
    },
    {
      name: "Doug Gray - Associate Head Coach",
      bio: "Now in his fourth season of travel softball, Coach Gray brings five years of coaching experience, specializing in pitching and defensive strategy. His structured and technical approach enhances in-game execution and consistency.",
    },
    {
      name: "Michael Marshack - Assistant Coach",
      bio: "In his second season with the team, Coach Marshack focuses on individual development and communication, using mentorship and positive reinforcement to support each athlete's growth.",
    },
    {
      name: "Chad Howard - Assistant Coach",
      bio: "Also entering year two with the team, Coach Howard leads instruction in baserunning and catching, emphasizing efficiency, effort, and situational awareness.",
    },
    {
      name: "Kyle Rhoad - Assistant Coach",
      bio: "A former Division I player at Eastern Michigan and minor leaguer with the Texas Rangers, Coach Rhoad brings elite-level insight. He focuses on hitting, baserunning, and outfield play, drawing from four years of coaching experience and a professional playing background.",
    },
    {
      name: "Dani Ramos - Assistant Coach",
      bio: "A former First Team All-MAC standout at Kent State University, Coach Ramos brings over six years of coaching experience. As a certified hitting instructor and former head coach at Worthington Christian and the Ohio All-Americans, she combines high-level playing experience with a proven ability to build confidence and elevate performance at the plate.",
    },
  ],
  visionPhilosophy:
    "The Firecrackers OH - 13U Jones coaching staff is committed to building well-rounded athletes through hard work, accountability, and a team-first mentality. With a focus on skill development, game intelligence, and a strong family culture, the program prepares players to compete at a high level-on and off the\n",
};
const file = "/Users/mike/code/mike/firecrackers/src/content/teams/jones.md";
const url = undefined;

const Content = createComponent((result, _props, slots) => {
  const { layout, ...content } = frontmatter;
  content.file = file;
  content.url = url;

  return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
});

const $$Jones = createComponent(
  ($$result, $$props, $$slots) => {
    return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { default: $$result2 => renderTemplate` ${maybeRenderHead()}<div class="w-auto mx-8 sm:w-auto sm:mx-16 md:w-3/4 md:mx-20 lg:w-3xl"> ${renderComponent($$result2, "CoachTitle", $$CoachTitle, { teamName: Content.attributes.title })} <div> ${renderComponent($$result2, "TeamOverview", $$TeamOverview, { text: Content.attributes.teamOverview })} <div> <h1 class="mt-8">COACHING STAFF</h1> ${Content.attributes.coaches.map(coach => renderTemplate`${renderComponent($$result2, "CoachBio", $$CoachBio, { coachName: coach.name, coachBio: coach.bio })}`)} </div> ${renderComponent($$result2, "VisionPhilosophy", $$VisionPhilosophy, { text: Content.attributes.visionPhilosophy })} </div> </div> ` })}`;
  },
  "/Users/mike/code/mike/firecrackers/src/pages/teams/jones.astro",
  void 0
);

const $$file = "/Users/mike/code/mike/firecrackers/src/pages/teams/jones.astro";
const $$url = "/teams/jones";

const _page = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      default: $$Jones,
      file: $$file,
      url: $$url,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);

const page = () => _page;

export { page };
