<template>
  <div class="w-screen h-screen flex items-center justify-center bg-white">
    <canvas
      ref="canvas"
      @click="regen"
      tabindex="0"
      class="cursor-pointer"
    ></canvas>
    <div class="absolute bottom-4 left-4 text-xs text-black/50 select-none">
      4900 Farben — Simulation
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { palette } from './assets/data.json';

const canvas = ref<HTMLCanvasElement | null>(null);
const colors = ref<string[]>([]);
const seed = ref<number | null>(null);
const dpr = ref(1);

// Dimensions
const panelSize = 5;
const panelsPerRow = 14;
const totalPanels = panelsPerRow * panelsPerRow;
const totalCells = totalPanels * panelSize * panelSize; // 4900

// --- RNG reproductible ---
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Génération palette riche de 196 couleurs ---
function generateRichPalette(seedValue: number) {
  const rng = mulberry32(seedValue);
  const pal: string[] = [];

  while (pal.length < 196) {
    const baseColor = palette[Math.floor(rng() * palette.length)];
    const richColor = colorWithVariation(baseColor, rng);
    if (pal.indexOf(richColor) === -1) {
      pal.push(richColor);
    }
  }
  return pal;
}

// --- Variation subtile par case ---
function colorWithVariation(base: string, rng: () => number) {
  const m = base.match(/hsl\((\d+) (\d+)% (\d+)%\)/);
  if (!m) return base;
  let [_, h, s, l] = m;
  h = ((+h + (rng() * 20 - 10) + 360) % 360).toString();
  s = Math.min(100, Math.max(20, +s + (rng() * 20 - 10))).toString();
  l = Math.min(80, Math.max(30, +l + (rng() * 20 - 10))).toString();
  return `hsl(${h} ${s}% ${l}%)`;
}

// --- Génération des 196 panneaux 5x5 ---
function generatePanels(seedValue: number) {
  const rng = mulberry32(seedValue);
  const palette = generateRichPalette(seedValue);
  const panels: string[][] = [];

  for (let p = 0; p < totalPanels; p++) {
    const panel: string[] = [];
    for (let i = 0; i < panelSize * panelSize; i++) {
      const baseColor = palette[Math.floor(rng() * palette.length)];
      panel.push(colorWithVariation(baseColor, rng));
    }
    panels.push(panel);
  }

  return panels;
}

// --- Assemblage final 70x70 ---
function assembleGrid(panels: string[][]) {
  const grid: string[] = [];

  for (let py = 0; py < panelsPerRow; py++) {
    for (let row = 0; row < panelSize; row++) {
      for (let px = 0; px < panelsPerRow; px++) {
        const panelIndex = py * panelsPerRow + px;
        const panel = panels[panelIndex];
        for (let col = 0; col < panelSize; col++) {
          grid.push(panel[row * panelSize + col]);
        }
      }
    }
  }

  return grid;
}

// --- Dessin sur canvas ---
function draw() {
  console.log('DRAW');
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d')!;
  const size = canvas.value.clientWidth;

  ctx.setTransform(dpr.value, 0, 0, dpr.value, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const cell = size / (panelsPerRow * panelSize); // 70 cases par ligne
  let idx = 0;

  console.log('SDHQSLKDFHQS');

  for (let r = 0; r < panelsPerRow * panelSize; r++) {
    for (let c = 0; c < panelsPerRow * panelSize; c++) {
      ctx.fillStyle = colors.value[idx++];
      ctx.fillRect(c * cell, r * cell, cell + 1, cell + 1);
    }
  }
}

// --- Génération complète ---
function regen() {
  const seedValue = seed.value ?? Math.floor(Math.random() * 1e9);
  // seed.value = seedValue;

  const panels = generatePanels(seedValue);
  colors.value = assembleGrid(panels);
  draw();
}

// --- Canvas responsive ---
function resizeCanvas() {
  if (!canvas.value) return;
  const parent = canvas.value.parentElement!;
  const size = Math.min(parent.clientWidth, parent.clientHeight);

  canvas.value.style.width = `${size}px`;
  canvas.value.style.height = `${size}px`;
  canvas.value.width = size * dpr.value;
  canvas.value.height = size * dpr.value;

  draw();
}

// --- Interactions ---
function onKeydown(e: KeyboardEvent) {
  if (e.code === 'Space') {
    e.preventDefault();
    regen();
  }
}

onMounted(() => {
  dpr.value = window.devicePixelRatio || 1;
  nextTick(() => {
    resizeCanvas();
    regen();
    window.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', resizeCanvas);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<style scoped></style>
