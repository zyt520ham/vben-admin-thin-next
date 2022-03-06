const projectName = import.meta.env.VITE_GLOB_APP_TITLE;

export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`);
}

export function log(...args: any[]) {
  console.log(...args);
  console.trace('JS 堆栈：');
}
