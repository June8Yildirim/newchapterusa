/**
 * A single event shown in the Happening Soon (upcoming) and Past Events sections.
 * Declared as a `type` (not `interface`) so it stays assignable to the admin
 * editor's generic `Json` tree, which relies on a string index signature.
 */
export interface NCWENEvent {
  date: string;
  title: string;
  body: string;
  isHappened: boolean;
  url?: string;
  thumbstone: string;
}
