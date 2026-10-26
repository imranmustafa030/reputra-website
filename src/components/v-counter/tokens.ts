// The counter page's type scale: five text sizes and one figure size, nothing in between.
export const t = {
  // one display moment per screen: the hero line, the estimate's figure, the final call
  display: "text-[clamp(38px,6.7vw,100px)] font-semibold leading-[0.98] tracking-[-0.035em]",
  // section headings and the film captions
  h2: "text-[clamp(30px,3.7vw,54px)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance",
  // supporting sentences, statements, questions
  lead: "text-[clamp(19px,1.75vw,25px)] leading-[1.4] tracking-[-0.014em]",
  body: "text-[17px] leading-[1.6] tracking-[-0.004em] lg:text-[18px]",
  small: "text-[14px] leading-[1.5]",
  // the estimate's figure only
  figure: "text-[clamp(112px,14vw,200px)] font-semibold leading-[0.88] tracking-[-0.05em] tabular-nums",
};

/** One frame for every section: the same outer margins (80px at 1440) and the same left edge. */
export const wrap = "mx-auto w-full max-w-[1440px] px-5 sm:px-10 lg:px-20";

/** A 12-column grid inside the frame. */
export const grid = "grid grid-cols-1 gap-x-8 lg:grid-cols-12";

/** Photographs share one treatment: the stage radius and a slightly calmer, cooler grade. */
export const photo = "rounded-[28px] object-cover [filter:saturate(0.82)_contrast(1.03)]";

export const ink2 = "text-[#3E5068]";
