import { Purchase } from "./Purchase";

export interface scrap_function {
    (html: string): Purchase | undefined
}