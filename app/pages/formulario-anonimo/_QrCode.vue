<script setup lang="ts">
/**
 * MAQUETE: desenho fixo com cara de QR code, gerado a partir do texto. Não é
 * um QR legível. "Baixar" entrega esse desenho em SVG.
 */
const props = defineProps<{ texto: string, rotulo: string }>()

const qr = computed(() => {
  let s = props.texto.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7)
  const n = 25
  const celulas: boolean[] = []
  for (let i = 0; i < n * n; i++) {
    s = (s * 16807) % 2147483647
    celulas.push(s % 3 === 0)
  }
  const olho = (x: number, y: number) => {
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]] as const) {
      const dx = x - ox
      const dy = y - oy
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0
    }
    return -1
  }
  const pretos: [number, number][] = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const o = olho(x, y)
      if (o === 1 || (o === -1 && celulas[y * n + x])) pretos.push([x, y])
    }
  }
  return { n, pretos }
})

function baixar() {
  const { n, pretos } = qr.value
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${n + 4} ${n + 4}" width="400" height="400"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/>${pretos.map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1"/>`).join('')}</svg>`
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  a.download = 'canal-de-denuncia-qr.svg'
  a.click()
  URL.revokeObjectURL(a.href)
}

defineExpose({ baixar })
</script>

<template>
  <svg :viewBox="`-2 -2 ${qr.n + 4} ${qr.n + 4}`" class="rounded-md border border-default bg-white p-1" role="img" :aria-label="rotulo">
    <rect v-for="([x, y], i) in qr.pretos" :key="i" :x="x" :y="y" width="1" height="1" fill="black" />
  </svg>
</template>
