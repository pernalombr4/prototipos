<script setup lang="ts">
/**
 * PROPOSTA (demanda 3): arquivos de referência, lidos inteiros em toda
 * conversa, e as bases de conhecimento (`knowledge_base_ids`, que o servidor
 * já tem e a tela não mostra).
 *
 * O medidor mostra quanto os arquivos ocupam do contexto de cada modelo
 * permitido. Arquivo que não cabe em algum modelo permitido avisa na hora e
 * oferece tirar esses modelos.
 *
 * MAQUETE: enviar um arquivo qualquer gera o PDF grande de exemplo
 * (1.260 páginas), para mostrar o aviso.
 */
import type { Textos } from './textos'
import { pessoaPorId, arquivoGrande, basesDisponiveis, EU, type Agente } from './mocks'
import { modeloPorId } from './catalogo'
import { espera, formatarData, useArquivos } from './estado'

const props = defineProps<{ t: Textos, a: Agente }>()
const arquivos = useArquivos()
const toast = useToast()
const k = computed(() => props.t.conhecimento)
const idioma = useIdioma()

const doAgente = computed(() => arquivos.value.filter(x => props.a.arquivos.includes(x.id)))
const tokens = computed(() => doAgente.value.reduce((s, x) => s + x.tokens, 0))

/* O espaço em cada modelo permitido. Sobra 20% para a conversa. */
const medidas = computed(() => props.a.modelosPermitidos.map((id) => {
  const m = modeloPorId(id)!
  const pct = Math.round((tokens.value / m.contexto) * 100)
  return { id, nome: m.name, pct, cabe: pct <= 80, perto: pct > 60 && pct <= 80 }
}).sort((x, y) => y.pct - x.pct))
const naoCabem = computed(() => medidas.value.filter(x => !x.cabe))

const enviando = ref(false)
const entrada = ref<HTMLInputElement>()
async function enviar() {
  enviando.value = true
  await espera(1200)
  if (!arquivos.value.some(x => x.id === arquivoGrande.id)) arquivos.value.push({ ...arquivoGrande })
  if (!props.a.arquivos.includes(arquivoGrande.id)) props.a.arquivos.push(arquivoGrande.id)
  enviando.value = false
  toast.add({ title: k.value.enviado(arquivoGrande.nome), icon: 'i-lucide-file-check', color: 'success' })
}
function aoEscolher(e: Event) {
  ;(e.target as HTMLInputElement).value = ''
  enviar()
}

function remover(id: string) {
  const arq = arquivos.value.find(x => x.id === id)!
  props.a.arquivos = props.a.arquivos.filter(x => x !== id)
  toast.add({ title: k.value.removido(arq.nome), icon: 'i-lucide-trash-2', color: 'neutral' })
}
function substituir(id: string) {
  const arq = arquivos.value.find(x => x.id === id)!
  arq.versao += 1
  arq.enviadoEm = '2026-11-16'
  arq.enviadoPor = EU
  toast.add({ title: k.value.substituido(arq.nome, arq.versao), icon: 'i-lucide-refresh-cw', color: 'success' })
}
function tirarModelos() {
  const fora = naoCabem.value.map(x => x.id)
  props.a.modelosPermitidos = props.a.modelosPermitidos.filter(id => !fora.includes(id) || id === props.a.model)
}

const tamanho = (kb: number) => kb >= 1024 ? `${(kb / 1024).toFixed(1).replace('.', ',')} MB` : `${kb} KB`

const acoes = (id: string) => [[
  { label: k.value.substituir, icon: 'i-lucide-refresh-cw', onSelect: () => substituir(id) },
  { label: k.value.baixar, icon: 'i-lucide-download' },
], [
  { label: k.value.remover, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => remover(id) },
]]
</script>

<template>
  <div class="space-y-8">
    <section class="space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 class="text-base font-semibold text-highlighted">{{ k.arquivosTitulo }}</h3>
          <p class="mt-0.5 max-w-2xl text-sm text-muted">{{ k.arquivosTexto }}</p>
        </div>
        <input ref="entrada" type="file" accept=".pdf,.docx" class="hidden" @change="aoEscolher">
        <UButton :label="enviando ? k.enviando : k.enviar" icon="i-lucide-upload" :loading="enviando" @click="entrada?.click()" />
      </div>

      <!-- Área de soltar -->
      <button
        type="button"
        class="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-accented px-4 py-5 text-center transition hover:border-primary hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary"
        @click="entrada?.click()"
        @dragover.prevent
        @drop.prevent="enviar"
      >
        <UIcon name="i-lucide-file-up" class="size-6 text-dimmed" />
        <span class="text-sm text-default">{{ k.soltar }}</span>
        <span class="text-xs text-muted">{{ k.formatos }}</span>
      </button>

      <UAlert
        v-if="naoCabem.length"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        :title="k.naoCabeTitulo"
        :description="k.naoCabe(naoCabem.map(x => x.nome).join(', '))"
        :actions="naoCabem.some(x => x.id !== a.model) ? [{ label: k.tirarModelos, color: 'error', variant: 'outline', onClick: tirarModelos }] : []"
      />

      <div v-if="doAgente.length" class="overflow-x-auto rounded-lg border border-default">
        <table class="w-full text-sm">
          <thead class="bg-elevated/50 text-left text-xs text-muted">
            <tr>
              <th class="px-3 py-2 font-medium">{{ k.colunas.nome }}</th>
              <th class="px-3 py-2 font-medium">{{ k.colunas.tamanho }}</th>
              <th class="px-3 py-2 font-medium">{{ k.colunas.enviado }}</th>
              <th class="px-3 py-2 font-medium">{{ k.colunas.por }}</th>
              <th class="w-12 px-3 py-2"><span class="sr-only">{{ k.colunas.acoes }}</span></th>
            </tr>
          </thead>
          <TransitionGroup tag="tbody" class="divide-y divide-default" enter-active-class="transition duration-300" enter-from-class="opacity-0 bg-primary/10" leave-active-class="transition duration-200" leave-to-class="opacity-0">
            <tr v-for="x in doAgente" :key="x.id">
              <td class="px-3 py-2.5">
                <div class="flex items-center gap-2">
                  <UIcon :name="x.tipo === 'pdf' ? 'i-lucide-file-text' : 'i-lucide-file-type'" class="size-5 shrink-0" :class="x.tipo === 'pdf' ? 'text-error' : 'text-info'" />
                  <div class="min-w-0">
                    <p class="truncate font-medium text-highlighted">{{ x.nome }}</p>
                    <p class="text-xs text-muted">{{ k.paginas(x.paginas) }} · {{ k.versao(x.versao) }}</p>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-2.5 tabular-nums text-muted">{{ tamanho(x.tamanho) }}</td>
              <td class="whitespace-nowrap px-3 py-2.5 text-muted">{{ formatarData(x.enviadoEm, idioma) }}</td>
              <td class="px-3 py-2.5">
                <span class="flex items-center gap-1.5">
                  <UAvatar :text="pessoaPorId(x.enviadoPor).iniciais" size="2xs" />
                  <span class="truncate text-muted">{{ pessoaPorId(x.enviadoPor).nome }}</span>
                </span>
              </td>
              <td class="px-3 py-2.5 text-right">
                <UDropdownMenu :items="acoes(x.id)" :content="{ align: 'end' }">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" :aria-label="k.colunas.acoes" />
                </UDropdownMenu>
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
      <p v-else class="rounded-lg bg-elevated/50 px-4 py-6 text-center text-sm text-muted">{{ k.vazio }}</p>

      <!-- Espaço no contexto de cada modelo permitido -->
      <div v-if="doAgente.length" class="rounded-lg border border-default p-4">
        <p class="mb-3 text-sm font-medium text-highlighted">{{ k.contexto }}</p>
        <ul class="space-y-3">
          <li v-for="m in medidas" :key="m.id">
            <div class="mb-1 flex items-center justify-between gap-2 text-xs">
              <span class="font-medium text-default">{{ m.nome }}</span>
              <span class="tabular-nums" :class="!m.cabe ? 'text-error' : m.perto ? 'text-warning' : 'text-muted'">{{ k.contextoUso(tokens, m.nome, m.pct) }}</span>
            </div>
            <UProgress :model-value="Math.min(m.pct, 100)" :color="!m.cabe ? 'error' : m.perto ? 'warning' : 'primary'" size="sm" />
            <p v-if="m.perto" class="mt-1 text-xs text-warning">{{ k.pertoDoLimite(m.nome) }}</p>
          </li>
        </ul>
      </div>
    </section>

    <USeparator />

    <section class="space-y-3">
      <div>
        <h3 class="text-base font-semibold text-highlighted">{{ k.basesTitulo }}</h3>
        <p class="mt-0.5 max-w-2xl text-sm text-muted">{{ k.basesTexto }}</p>
      </div>
      <USelectMenu v-model="a.basesDeConhecimento" :items="basesDisponiveis" multiple :placeholder="k.basesPlaceholder" class="w-full max-w-md" icon="i-lucide-library" />
      <p class="flex items-start gap-1.5 text-xs text-muted"><UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ k.diferenca }}</p>
    </section>
  </div>
</template>
