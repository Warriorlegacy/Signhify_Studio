/**
 * Central content registry.
 *
 * Every section that renders structured content (projects, services,
 * sprint checklist, lead schema) re-exports from here so we have a
 * single import surface. When the Supabase-backed CMS comes online,
 * each export below becomes a server-loaded query while consumers
 * stay unchanged.
 */
export { projects, type Project, type ProjectSize } from "../projects";
export { sprintTracks, statusMeta, type SprintStatus } from "../sprint-checklist";
export { leadSchema, emptyLead, type Lead } from "../leads-schema";
