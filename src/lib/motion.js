/** Shared motion — invisible but intentional */
export const easeEditorial = [0.22, 1, 0.36, 1];

export const reveal = {
  hidden: { opacity: 0, y: 14 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: easeEditorial },
  }),
};

export const revealScroll = {
  hidden: { opacity: 0, y: 12 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: easeEditorial },
  }),
};
