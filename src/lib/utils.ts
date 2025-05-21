import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timeInSeconds: number): string {
  const HH = Math.floor(timeInSeconds / 3600);
  const MM = Math.floor((timeInSeconds % 3600) / 60);
  const SS = Math.floor(timeInSeconds % 60);
  const MS = Math.floor((timeInSeconds % 1) * 1000);

  const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

  if (HH > 0) {
    return `${pad(HH)}:${pad(MM)}:${pad(SS)}.${pad(MS, 3)}`;
  }
  return `${pad(MM)}:${pad(SS)}.${pad(MS, 3)}`;
}

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
