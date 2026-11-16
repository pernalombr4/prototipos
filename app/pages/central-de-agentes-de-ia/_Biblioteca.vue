<script setup lang="ts">
/**
 * PROPOSTA (demanda 5): a biblioteca de modelos de resposta do workspace.
 *
 * A lista é a EnTable do SDK, como as listas do produto. O editor abre na
 * gaveta: texto do modelo com os campos marcados por {{ }}, a tabela dos
 * campos (tipo, de onde vem, obrigatório, exemplo) e a pré-visualização com
 * os valores de exemplo.
 *
 * O editor do texto é um campo de texto simples com a detecção de {{ }}, não o
 * TipTap: o modelo de resposta é texto puro que vai à minuta sem formatação
 * (DECISOES).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { EU, pessoaPorId, type BlocoDeResposta, type CampoDoBloco, type TipoDeCampo } from './mocks'
import { formatarData, useAgentes, useBlocos } from './estado'

const props = defineProps<{ t: Textos, abrirPrimeiro?: boolean }>()
const blocos = useBlocos()
const agentes = useAgentes()
const toast = useToast()
const idioma = useIdioma()
const b = computed(() => props.t.biblioteca)

const busca = ref('')
const normal = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const visiveis = computed(() => {
  const q = normal(busca.value)
  return blocos.value.filter(x => !q || normal(`${x.codigo} ${x.nome} ${x.quandoUsar} ${x.texto}`).includes(q))
})

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'codigo', label: b.value.colunas.codigo },
  { key: 'nome', label: b.value.colunas.nome },
  { key: 'campos', label: b.value.colunas.campos, align: 'right' },
  { key: 'agentes', label: b.value.colunas.agentes },
  { key: 'usos', label: b.value.colunas.usos, align: 'right' },
  { key: 'status', label: b.value.colunas.status },
  { key: 'atualizado', label: b.value.colunas.atualizado },
])
const linhas = computed(() => visiveis.value.map(x => ({ id: x.id, x })))
type Linha = typeof linhas.value[number]

const nomeDoAgente = (slug: string) => agentes.value.find(a => a.slug === slug)?.name ?? slug
const unicos = (x: BlocoDeResposta) => new Set(x.campos.map(c => c.chave)).size

/* ───────── Editor ───────── */
const aberto = ref(false)
const edicao = ref<BlocoDeResposta | null>(null)
const novo = ref(false)
const area = ref<{ textareaRef?: HTMLTextAreaElement } | null>(null)

function abrir(x?: BlocoDeResposta) {
  novo.value = !x
  edicao.value = JSON.parse(JSON.stringify(x ?? {
    id: `b${Date.now() % 10000}`, codigo: `S${blocos.value.length + 1}`, nome: '', quandoUsar: '',
    texto: 'AURORA PAGAMENTOS S.A. informa que {{campo}}.', campos: [], atualizadoEm: '2026-11-16', atualizadoPor: EU, usos30d: 0, agentes: [], status: 'rascunho',
  }))
  aberto.value = true
}
onMounted(() => { if (props.abrirPrimeiro) abrir(blocos.value[0]) })

/* Os campos saem do texto: novo {{x}} entra na tabela; o que sumiu do texto avisa. */
const chavesNoTexto = computed(() => [...new Set([...(edicao.value?.texto ?? '').matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]!))])
watch(chavesNoTexto, (ks) => {
  const e = edicao.value
  if (!e) return
  ks.forEach((k) => {
    if (!e.campos.some(c => c.chave === k)) e.campos.push({ chave: k, tipo: 'texto', obrigatorio: true, origem: 'analista', exemplo: '' })
  })
})
const camposUnicos = computed(() => {
  const vistos = new Set<string>()
  return (edicao.value?.campos ?? []).filter(c => !vistos.has(c.chave) && vistos.add(c.chave))
})
const semUso = computed(() => camposUnicos.value.filter(c => !chavesNoTexto.value.includes(c.chave)))

function inserirCampo(chave: string) {
  const e = edicao.value!
  const el = area.value?.textareaRef
  const pos = el?.selectionStart ?? e.texto.length
  e.texto = `${e.texto.slice(0, pos)}{{${chave}}}${e.texto.slice(pos)}`
}
const itensDeCampo = computed(() => [
  camposUnicos.value.map(c => ({ label: c.chave, icon: 'i-lucide-braces', onSelect: () => inserirCampo(c.chave) })),
  [{ label: b.value.novoCampo, icon: 'i-lucide-plus', onSelect: () => inserirCampo(`campo_${camposUnicos.value.length + 1}`) }],
])

function removerCampo(c: CampoDoBloco) {
  edicao.value!.campos = edicao.value!.campos.filter(x => x.chave !== c.chave)
}

const tipos = computed(() => (Object.keys(b.value.tipos) as TipoDeCampo[]).map(k => ({ value: k, label: b.value.tipos[k] })))
const origens = computed(() => (['oficio', 'analista', 'sistema'] as const).map(k => ({ value: k, label: props.t.minuta.origem[k] })))

const previa = computed(() => {
  const e = edicao.value
  if (!e) return []
  const out: { texto: string, campo?: string, vazio?: boolean }[] = []
  let ultimo = 0
  for (const m of e.texto.matchAll(/\{\{(\w+)\}\}/g)) {
    if (m.index! > ultimo) out.push({ texto: e.texto.slice(ultimo, m.index) })
    const ex = e.campos.find(c => c.chave === m[1])?.exemplo
    out.push({ texto: ex || m[1]!, campo: m[1], vazio: !ex })
    ultimo = m.index! + m[0].length
  }
  out.push({ texto: e.texto.slice(ultimo) })
  return out
})

const vinculos = computed({
  get: () => edicao.value?.agentes ?? [],
  set: (v: string[]) => { if (edicao.value) edicao.value.agentes = v },
})
const opcoesDeAgente = computed(() => agentes.value.map(a => ({ value: a.slug, label: a.name })))

function salvar(aprovar: boolean) {
  const e = edicao.value!
  if (aprovar) e.status = 'aprovado'
  e.atualizadoEm = '2026-11-16'
  e.atualizadoPor = EU
  const i = blocos.value.findIndex(x => x.id === e.id)
  if (i >= 0) blocos.value[i] = JSON.parse(JSON.stringify(e))
  else blocos.value.unshift(JSON.parse(JSON.stringify(e)))
  agentes.value.forEach((a) => {
    const tem = a.blocos.includes(e.id)
    if (e.agentes.includes(a.slug) && !tem) a.blocos.push(e.id)
    if (!e.agentes.includes(a.slug) && tem) a.blocos = a.blocos.filter(x => x !== e.id)
  })
  aberto.value = false
  toast.add({ title: aprovar ? b.value.aprovado : b.value.salvo, icon: 'i-lucide-check', color: 'success' })
}
const marcador = (k: string) => `{{${k}}}`
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-highlighted">{{ b.titulo }}</h1>
        <p class="mt-0.5 text-sm text-muted">{{ b.subtitulo }}</p>
      </div>
      <UButton :label="b.novo" icon="i-lucide-plus" @click="abrir()" />
    </div>

    <UInput v-model="busca" icon="i-lucide-search" :placeholder="b.buscar" class="w-full sm:w-80" />

    <EnTable
      :columns="colunas"
      :rows="linhas"
      :locale="idioma"
      :empty-state="{ icon: 'i-lucide-text-quote', title: b.vazio }"
      class="[&_tbody_tr]:cursor-pointer"
      @row-click="(r: Linha) => abrir(r.x)"
    >
      <template #cell-codigo="{ row }">
        <UBadge :label="(row as Linha).x.codigo" color="primary" variant="soft" size="sm" class="font-mono" />
      </template>
      <template #cell-nome="{ row }">
        <span class="flex min-w-0 flex-col py-1">
          <span class="text-sm font-medium text-highlighted">{{ (row as Linha).x.nome }}</span>
          <span class="max-w-md truncate text-xs text-muted">{{ (row as Linha).x.quandoUsar }}</span>
        </span>
      </template>
      <template #cell-campos="{ row }">
        <span class="tabular-nums">{{ unicos((row as Linha).x) }}</span>
      </template>
      <template #cell-agentes="{ row }">
        <span class="text-sm text-muted">{{ (row as Linha).x.agentes.map(nomeDoAgente).join(', ') || b.nenhumAgente }}</span>
      </template>
      <template #cell-usos="{ row }">
        <span class="tabular-nums">{{ (row as Linha).x.usos30d.toLocaleString(idioma) }}</span>
      </template>
      <template #cell-status="{ row }">
        <UBadge :label="b.status[(row as Linha).x.status]" :color="(row as Linha).x.status === 'aprovado' ? 'success' : 'warning'" variant="soft" size="sm" />
      </template>
      <template #cell-atualizado="{ row }">
        <span class="flex items-center gap-1.5 text-xs text-muted">
          <UAvatar :text="pessoaPorId((row as Linha).x.atualizadoPor).iniciais" size="3xs" />
          {{ formatarData((row as Linha).x.atualizadoEm, idioma) }}
        </span>
      </template>
    </EnTable>

    <USlideover v-model:open="aberto" :title="edicao?.nome || b.editorTitulo" :ui="{ content: 'max-w-6xl w-[95vw]' }">
      <template #body>
        <div v-if="edicao" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <div class="space-y-5">
            <div class="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <UFormField :label="b.codigo" :help="b.codigoAjuda" required>
                <UInput v-model="edicao.codigo" class="w-full font-mono" :maxlength="8" />
              </UFormField>
              <UFormField :label="b.nome" required>
                <UInput v-model="edicao.nome" class="w-full" />
              </UFormField>
            </div>
            <UFormField :label="b.quandoUsar" :help="b.quandoUsarAjuda" required>
              <UInput v-model="edicao.quandoUsar" class="w-full" />
            </UFormField>

            <UFormField :label="b.texto" :help="b.textoAjuda" required>
              <template #hint>
                <UDropdownMenu :items="itensDeCampo" :content="{ align: 'end' }">
                  <UButton :label="b.inserirCampo" icon="i-lucide-braces" color="neutral" variant="outline" size="xs" />
                </UDropdownMenu>
              </template>
              <UTextarea ref="area" v-model="edicao.texto" :rows="14" autoresize :maxrows="28" class="w-full font-mono text-[13px]" />
            </UFormField>

            <UAlert
              v-for="c in semUso"
              :key="c.chave"
              color="warning"
              variant="subtle"
              icon="i-lucide-triangle-alert"
              :title="b.campoSemUso(c.chave)"
              :actions="[{ label: t.conhecimento.remover, color: 'warning', variant: 'outline', onClick: () => removerCampo(c) }]"
            />

            <section>
              <h3 class="text-sm font-semibold text-highlighted">{{ b.camposTitulo }}</h3>
              <p class="mb-2 text-xs text-muted">{{ b.camposTexto }}</p>
              <div class="overflow-x-auto rounded-lg border border-default">
                <table class="w-full text-sm">
                  <thead class="bg-elevated/50 text-left text-xs text-muted">
                    <tr>
                      <th class="px-3 py-2 font-medium">{{ t.biblioteca.colunas.campos }}</th>
                      <th class="px-3 py-2 font-medium">{{ b.tipo }}</th>
                      <th class="px-3 py-2 font-medium">{{ b.origemCol }}</th>
                      <th class="px-3 py-2 text-center font-medium">{{ b.obrigatorio }}</th>
                      <th class="px-3 py-2 font-medium">{{ b.exemplo }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-default">
                    <tr v-for="c in camposUnicos" :key="c.chave" :class="!chavesNoTexto.includes(c.chave) && 'opacity-50'">
                      <td class="px-3 py-1.5"><code class="rounded bg-primary/10 px-1 text-xs text-primary">{{ marcador(c.chave) }}</code></td>
                      <td class="px-3 py-1.5"><USelect v-model="c.tipo" :items="tipos" value-key="value" size="xs" class="w-36" :aria-label="`${b.tipo} ${c.chave}`" /></td>
                      <td class="px-3 py-1.5"><USelect v-model="c.origem" :items="origens" value-key="value" size="xs" class="w-40" :aria-label="`${b.origemCol} ${c.chave}`" /></td>
                      <td class="px-3 py-1.5 text-center"><UCheckbox v-model="c.obrigatorio" class="justify-center" :aria-label="`${b.obrigatorio} ${c.chave}`" /></td>
                      <td class="px-3 py-1.5"><UInput v-model="c.exemplo" size="xs" class="w-44" :aria-label="`${b.exemplo} ${c.chave}`" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside class="space-y-5">
            <section>
              <h3 class="text-sm font-semibold text-highlighted">{{ b.previa }}</h3>
              <p class="mb-2 text-xs text-muted">{{ b.previaAjuda }}</p>
              <div class="max-h-[30rem] overflow-y-auto rounded-lg bg-elevated/40 px-4 py-3 font-serif text-[13px] leading-relaxed ring ring-default">
                <p class="whitespace-pre-wrap break-words"><template v-for="(p, i) in previa" :key="i"><mark v-if="p.campo" class="rounded px-0.5 font-sans text-[12px]" :class="p.vazio ? 'bg-error/15 text-error' : 'bg-primary/12 text-primary'">{{ p.texto }}</mark><template v-else>{{ p.texto }}</template></template></p>
              </div>
            </section>
            <UFormField :label="b.agentesVinculados">
              <USelectMenu v-model="vinculos" :items="opcoesDeAgente" value-key="value" multiple class="w-full" icon="i-lucide-bot" />
            </UFormField>
          </aside>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.editor.cancelar" color="neutral" variant="subtle" @click="aberto = false" />
          <UButton :label="b.salvar" color="neutral" variant="outline" icon="i-lucide-save" @click="salvar(false)" />
          <UButton :label="b.aprovar" icon="i-lucide-badge-check" @click="salvar(true)" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
