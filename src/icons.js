const paths={
 property:'<path d="m12 3 8 7v10H4V10Z"/><path d="M9 20v-7h6v7"/>',
 start:'<circle cx="12" cy="12" r="9"/><path d="M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3"/>',
 heal:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
 event:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m12 6 1.5 4.5L18 12l-4.5 1.5L12 18l-1.5-4.5L6 12l4.5-1.5Z"/>',
 wild:'<path d="m12 2 2.5 6 6.5 1-5 4.5 1.5 7L12 17l-5.5 3.5 1.5-7L3 9l6.5-1Z"/>',
 station:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M8 18l-3 4m11-4 3 4M9 7h6M8 15h1m6 0h1"/>',
 rocket:'<path d="M6 21V3h8a5 5 0 0 1 0 10H6m7 0 6 8"/>',
 tax:'<circle cx="12" cy="12" r="9"/><path d="M12 5v14m4-12H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H8"/>',
 rest:'<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>',
 visit:'<path d="M6 21V3h8a5 5 0 0 1 0 10H6m7 0 6 8"/>'
};
export const icon=type=>`<svg class="game-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[type]||paths.start}</svg>`;
