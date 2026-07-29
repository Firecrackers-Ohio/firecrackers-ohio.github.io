import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { SANITY_DATASET, SANITY_PROJECT_ID } from "./client";

const builder = createImageUrlBuilder({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
});

/**
 * Player headshots are displayed in a 4:5 box. Cropping to that ratio on
 * Sanity's CDN means every card lines up regardless of what a coach uploaded —
 * a square phone photo and a tall portrait both come back as 4:5.
 *
 * `fit: "crop"` combined with Sanity's hotspot data crops around whatever the
 * editor marked as the important part of the image, rather than the centre.
 */
const HEADSHOT_WIDTH = 480;
const HEADSHOT_HEIGHT = 600;

export interface RenderedImage {
  src: string;
  /** 2x source for high-density screens. */
  srcset: string;
  width: number;
  height: number;
}

/**
 * Builds a headshot cropped to the card's 4:5 ratio.
 */
export function headshotImage(source: SanityImageSource): RenderedImage {
  const base = builder
    .image(source)
    .fit("crop")
    .crop("focalpoint")
    .auto("format");

  return {
    src: base.width(HEADSHOT_WIDTH).height(HEADSHOT_HEIGHT).url(),
    srcset: `${base
      .width(HEADSHOT_WIDTH * 2)
      .height(HEADSHOT_HEIGHT * 2)
      .url()} 2x`,
    width: HEADSHOT_WIDTH,
    height: HEADSHOT_HEIGHT,
  };
}

/**
 * Builds a wide team photo. Height is left to the source's own proportions,
 * since group shots vary and cropping them to a fixed ratio tends to cut people
 * off at the edges.
 */
export function teamPhotoImage(
  source: SanityImageSource,
  width = 896
): Omit<RenderedImage, "height"> {
  const base = builder.image(source).auto("format");

  return {
    src: base.width(width).url(),
    srcset: `${base.width(width * 2).url()} 2x`,
    width,
  };
}
