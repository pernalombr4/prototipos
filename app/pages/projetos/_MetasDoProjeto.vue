<script setup lang="ts">
/**
 * PROPOSTA (rodada 12): as metas do projeto, na Visão geral. Até a rodada 11 só a meta mostrava os projetos;
 * agora o projeto mostra as metas que dependem dele. A meta entra aqui quando liga o projeto inteiro ou liga
 * pelo menos 1 marco dele. Cada linha diz por qual caminho, o andamento da meta e a parte deste projeto nela
 * (a média dos marcos dele que estão na meta). Clicar abre a meta na tela Metas.
 */
import type { Textos } from './textos'
import type { Situacao } from './mocks'
import { pessoa } from './mocks'
import { COR_DA_SITUACAO, ICONE_DA_SITUACAO, useMarcaDeProposta, useProjetos } from './estado'
import { useMetasEDiscussoes } from './metasEDiscussoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'
import { textosDasRelacoes } from './textosDasRelacoes'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const md = useMetasEDiscussoes()
const tx = useTextos(textosDeMetasEDiscussoes)
const tg = computed(() => tx.value.metas)
const idioma = useIdioma()
const { marca } = useMarcaDeProposta()

const metas = computed(() => md.metasDoProjeto(props.id))

/**
 * Rodada 14 (B2): o projeto se liga a uma meta daqui, sem abrir Metas. É a mesma ligação do painel da meta: os
 * marcos do projeto entram na lista, e "Incluir marcos novos" diz se os criados depois entram. Liga quem administra
 * o projeto ou quem edita a meta (P1, suposição).
 */
const tr = useTextos(textosDasRelacoes)
const toast = useToast()
const projeto = computed(() => prj.projetos.value.find(p => p.id === props.id))
const opMetas = computed(() => md.metas.value
  .filter(g => !g.projetos.includes(props.id) && md.podeLigarProjeto(g, props.id))
  .map(g => ({ value: g.id, label: g.nome, icon: 'i-lucide-target' })))
const ligando = ref(false)
const lMeta = ref<number | undefined>()
const lNovos = ref(true)
function abrirLigar() {
  lMeta.value = opMetas.value[0]?.value
  lNovos.value = true
  ligando.value = true
}
function ligar() {
  const g = md.metas.value.find(x => x.id === lMeta.value)
  if (!g || !projeto.value) return
  md.ligarProjeto(g, props.id, lNovos.value)
  ligando.value = false
  toast.add({ title: tr.value.projeto.ligado(projeto.value.nome, g.nome), icon: 'i-lucide-target', color: 'success' })
}
const data = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short', year: 'numeric' })
function caminho(m: (typeof metas.value)[number]) {
  if (m.projetos.includes(props.id)) return tg.value.doProjetoLigado
  return tg.value.doProjetoPelosMarcos(md.marcosDoProjetoNaMeta(m, props.id).length)
}
</script>

<template>
  <section class="rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" :class="marca">
    <header class="flex items-center gap-2 border-b border-default px-4 py-3">
      <UIcon name="i-lucide-target" class="size-4 text-muted" />
      <h2 class="flex-1 text-sm font-semibold text-highlighted">{{ tg.doProjetoTitulo }}</h2>
      <UTooltip :text="tg.doProjetoDica">
        <UIcon name="i-lucide-info" class="size-4 text-muted" :aria-label="tg.doProjetoDica" />
      </UTooltip>
      <UButton v-if="opMetas.length" :label="tr.projeto.ligarMeta" icon="i-lucide-link" size="xs" color="neutral" variant="outline" @click="abrirLigar" />
      <UButton :label="tg.verMetas" trailing-icon="i-lucide-arrow-right" size="xs" color="neutral" variant="outline" @click="prj.tela.value = { tipo: 'metas' }" />
    </header>
    <ul v-if="metas.length" class="divide-y divide-default">
      <li v-for="m in metas" :key="m.id">
        <button type="button" class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-primary" @click="md.abrirMeta(m.id)">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><UIcon name="i-lucide-target" class="size-4" /></span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-highlighted">{{ m.nome }}</span>
            <span class="block truncate text-xs text-muted">{{ caminho(m) }} · {{ pessoa(m.dono)?.nome }} · {{ data(m.dataAlvo) }}</span>
          </span>
          <UBadge v-if="md.situacaoDaMeta(m)" :label="t.situacao[md.situacaoDaMeta(m) as Situacao]" :icon="ICONE_DA_SITUACAO[md.situacaoDaMeta(m) as Situacao]" :color="COR_DA_SITUACAO[md.situacaoDaMeta(m) as Situacao]" variant="soft" size="sm" class="hidden sm:inline-flex" />
          <span class="hidden w-32 shrink-0 flex-col gap-0.5 md:flex">
            <span v-if="m.medicao === 'automatica' && md.progressoDoProjetoNaMeta(m, id) !== null" class="text-right text-xs text-muted">{{ tg.doProjetoParte(md.progressoDoProjetoNaMeta(m, id)!) }}</span>
            <UProgress :model-value="md.progressoDaMeta(m)" :color="md.progressoDaMeta(m) === 100 ? 'success' : 'primary'" size="sm" />
          </span>
          <span class="w-9 shrink-0 text-right text-xs tabular-nums text-toned">{{ md.progressoDaMeta(m) }}%</span>
        </button>
      </li>
    </ul>
    <p v-else class="px-4 py-8 text-center text-sm text-muted">{{ tg.doProjetoVazio }}</p>

    <UModal v-model:open="ligando" :title="tr.projeto.ligarMetaTitulo" :description="projeto ? tr.projeto.ligarMetaTexto(projeto.nome) : ''" :ui="{ footer: 'justify-end gap-2' }">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField :label="tr.projeto.meta" required>
            <USelectMenu v-model="lMeta" :items="opMetas" value-key="value" class="w-full" />
          </UFormField>
          <UCheckbox v-model="lNovos" :label="tr.meta.incluirNovos" :description="tr.projeto.incluirNovosDica" />
        </div>
      </template>
      <template #footer>
        <UButton :label="tr.projeto.cancelar" color="neutral" variant="outline" @click="ligando = false" />
        <UButton :label="tr.projeto.ligar" icon="i-lucide-link" :disabled="!lMeta" @click="ligar" />
      </template>
    </UModal>
  </section>
</template>
