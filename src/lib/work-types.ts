/** Project categories, in display order. Shared by the content schema and the Works filter. */
export const workTypes = ['oss', 'app', 'saas', 'client', 'infra'] as const;
export type WorkType = (typeof workTypes)[number];
