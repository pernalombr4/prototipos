<script setup lang="ts">
/**
 * Os widgets de catálogo que não são lista:
 * - Saúde dos prazos: a barra empilhada do Painel de tarefas, com as 4 faixas
 *   (Vencidas, Vencem em 7 dias, No prazo, Sem prazo) das tarefas abertas do
 *   workspace. A mesma regra do painel, para os 2 números baterem;
 * - Gráfico de um painel: colunas de um painel de uma tela Dashboard;
 * - Bloco de notas: texto só da pessoa. NOVO no produto;
 * - Comunicado: aviso do administrador. NOVO; só o administrador edita;
 * - Resumo do BENI: frases geradas pelo agente de IA. MAQUETE: o texto é fixo.
 */
import type { TarefaDaHome } from './mocks'
import { AGORA, DIA, painelDeCompras } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: 'saudeDosPrazos' | 'graficoDePainel' | 'notas' | 'comunicado' | 'beni'
  tarefas?: TarefaDaHome[]
  comunicado?: { titulo: string, texto: string, autor: string, ha: number }
  podeEditarComunicado?: boolean
  beni?: { linhas: { icone: string, texto: string }[] }
}>()

const emit = defineEmits<{ abrir: [destino: string], salvarComunicado: [texto: string] }>()
const nota = defineModel<string>('nota', { default: '' })

/* Saúde dos prazos */
const faixas = computed(() => {
  const abertas = (props.tarefas ?? []).filter(x => x.status !== 'completed')
  const agora = AGORA.getTime()
  const r = { vencidas: 0, vencem7: 0, noPrazo: 0, semPrazo: 0 }
  for (const x of abertas) {
    if (!x.due_date) r.semPrazo++
    else if (x.due_date.getTime() < agora) r.vencidas++
    else if (x.due_date.getTime() < agora + 7 * DIA) r.vencem7++
    else r.noPrazo++
  }
  const total = abertas.length || 1
  return ([
    ['vencidas', r.vencidas, 'bg-error', 'text-error-700 dark:text-error-300'],
    ['vencem7', r.vencem7, 'bg-warning', 'text-warning-700 dark:text-warning-300'],
    ['noPrazo', r.noPrazo, 'bg-success', 'text-success-700 dark:text-success-300'],
    ['semPrazo', r.semPrazo, 'bg-accented', 'text-toned'],
  ] as const).map(([chave, n, barra, texto]) => ({ chave, n, pct: Math.round((n / total) * 100), barra, texto }))
})

/* Gráfico */
const maximo = Math.max(...painelDeCompras.valores)

/* Comunicado */
const editando = ref(false)
const rascunho = ref('')
function editar() {
  rascunho.value = props.comunicado?.texto ?? ''
  editando.value = true
}
function publicar() {
  emit('salvarComunicado', rascunho.value)
  editando.value = false
}
</script>

<template>
  <!-- Saúde dos prazos -->
  <div v-if="tipo === 'saudeDosPrazos'" class="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-3">
    <div class="flex h-2.5 overflow-hidden rounded-full bg-elevated">
      <span
        v-for="f in faixas"
        :key="f.chave"
        class="h-full transition-[width] duration-500"
        :class="f.barra"
        :style="{ width: `${f.pct}%` }"
      />
    </div>
    <ul class="grid grid-cols-2 gap-2">
      <li v-for="f in faixas" :key="f.chave">
        <button type="button" class="w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated" @click="emit('abrir', t.saude.faixas[f.chave])">
          <span class="block text-xl font-semibold tabular-nums" :class="f.texto">{{ f.n }}</span>
          <span class="block truncate text-xs text-muted">{{ t.saude.faixas[f.chave] }} · {{ f.pct }}%</span>
        </button>
      </li>
    </ul>
    <UButton
      :label="t.saude.abrirPainel"
      trailing-icon="i-lucide-arrow-right"
      color="neutral"
      variant="ghost"
      size="xs"
      class="mt-auto self-start"
      @click="emit('abrir', t.saude.abrirPainel)"
    />
  </div>

  <!-- Gráfico de um painel -->
  <div v-else-if="tipo === 'graficoDePainel'" class="flex min-h-0 flex-1 flex-col px-4 pb-3">
    <div class="flex min-h-0 flex-1 items-end gap-2 pt-2" role="img" :aria-label="painelDeCompras.meses.map((m, i) => `${m}: ${painelDeCompras.valores[i]}`).join(', ')">
      <div v-for="(v, i) in painelDeCompras.valores" :key="i" class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
        <span class="text-xs tabular-nums text-muted">{{ v }}</span>
        <span
          class="w-full max-w-10 origin-bottom animate-[crescer_0.5s_ease-out_both] rounded-t-sm transition-colors"
          :class="i === painelDeCompras.valores.length - 1 ? 'bg-primary/40' : 'bg-primary'"
          :style="{ height: `${(v / maximo) * 100}%`, animationDelay: `${i * 50}ms` }"
        />
        <span class="text-xs text-muted">{{ painelDeCompras.meses[i] }}</span>
      </div>
    </div>
    <button type="button" class="mt-2 self-start text-xs text-muted underline-offset-2 hover:text-primary hover:underline" @click="emit('abrir', painelDeCompras.tela)">
      {{ t.grafico.origem(painelDeCompras.tela) }}
    </button>
  </div>

  <!-- Bloco de notas -->
  <div v-else-if="tipo === 'notas'" class="flex min-h-0 flex-1 flex-col px-3 pb-3">
    <UTextarea
      v-model="nota"
      :placeholder="t.notas.placeholder"
      variant="soft"
      autoresize
      :maxrows="12"
      class="min-h-0 flex-1"
      :ui="{ base: 'h-full resize-none' }"
      :aria-label="t.widgets.notas.titulo"
    />
    <span class="mt-1.5 flex items-center gap-1 text-xs text-dimmed">
      <UIcon name="i-lucide-lock" class="size-3" />{{ t.notas.soVoce }}
    </span>
  </div>

  <!-- Comunicado -->
  <div v-else-if="tipo === 'comunicado'" class="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
    <template v-if="!editando">
      <p class="text-sm font-semibold text-highlighted">
        {{ comunicado?.titulo }}
      </p>
      <p class="line-clamp-4 text-sm text-toned">
        {{ comunicado?.texto }}
      </p>
      <div class="mt-auto flex items-center justify-between gap-2">
        <span class="truncate text-xs text-muted">{{ t.comunicado.por(comunicado?.autor ?? '', comunicado?.ha ?? 0) }}</span>
        <UButton v-if="podeEditarComunicado" :label="t.comunicado.editar" icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" @click="editar" />
      </div>
    </template>
    <template v-else>
      <UTextarea v-model="rascunho" :rows="3" autoresize class="flex-1" :aria-label="t.comunicado.editar" />
      <div class="flex justify-end gap-2">
        <UButton :label="t.config.cancelar" color="neutral" variant="ghost" size="xs" @click="editando = false" />
        <UButton :label="t.comunicado.salvar" size="xs" @click="publicar" />
      </div>
    </template>
  </div>

  <!-- Resumo do BENI -->
  <div v-else class="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
    <ul class="space-y-2">
      <li v-for="(l, i) in beni?.linhas" :key="i" class="flex gap-2.5 animate-[entrada_0.3s_ease-out_both]" :style="{ animationDelay: `${i * 80}ms` }">
        <UIcon :name="l.icone" class="mt-0.5 size-4 shrink-0 text-primary" />
        <span class="text-sm text-toned">{{ l.texto }}</span>
      </li>
    </ul>
    <p class="mt-auto flex items-center gap-1 text-xs text-dimmed">
      <UIcon name="i-lucide-sparkles" class="size-3" />{{ t.beni.aviso }}
    </p>
  </div>
</template>

<style scoped>
/* As colunas crescem de baixo ao entrar. Sem prop no Nuxt UI para isso; o keyframe é deste widget. */
@keyframes crescer { from { transform: scaleY(0); } to { transform: scaleY(1); } }
</style>
