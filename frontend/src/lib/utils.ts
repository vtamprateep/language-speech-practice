import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function chooseRandom(options: any[]): any {
    return options[Math.floor(Math.random() * options.length)];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shuffle(arr: any[]): any[] {
    return arr.sort(() => 0.5 - Math.random());
}