// External URLs Configuration
export const EXTERNAL_URLS = {
  teamStore:
    import.meta.env.PUBLIC_TEAM_STORE_URL ||
    "https://gear.firecrackersoftball.com/",
  tournament:
    import.meta.env.PUBLIC_TOURNAMENT_URL || "https://tinyurl.com/boombash26",
  tryoutRegistration:
    import.meta.env.PUBLIC_TRYOUT_REGISTRATION_URL ||
    "https://docs.google.com/forms/d/e/1FAIpQLSd3Xiv5M5WycU9bQDIubCt_eAFehdVMxJ-IRgg3rR7nxvEIgw/viewform",
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
