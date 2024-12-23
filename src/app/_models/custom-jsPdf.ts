declare module 'jspdf' {
    interface jsPDF {
      fromHTML(HTML: string | HTMLElement, x: number, y: number, settings?: object, callback?: Function): void;
    }
}