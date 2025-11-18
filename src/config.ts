// External URLs Configuration
export const EXTERNAL_URLS = {
  teamStore:
    import.meta.env.PUBLIC_TEAM_STORE_URL ||
    "https://gear.firecrackersoftball.com/",
  tournament:
    import.meta.env.PUBLIC_TOURNAMENT_URL || "https://tinyurl.com/boombash26",
  facebook:
    import.meta.env.PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/firecrackersohio",
  instagram:
    import.meta.env.PUBLIC_INSTAGRAM_URL ||
    "https://www.instagram.com/firecrackers_oh/",
  nationalOrg:
    import.meta.env.PUBLIC_NATIONAL_ORG_URL ||
    "https://firecrackersoftball.com/",
} as const;
