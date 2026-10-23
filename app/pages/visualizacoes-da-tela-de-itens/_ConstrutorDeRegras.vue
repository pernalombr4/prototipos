<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): o construtor do filtro avançado, no desenho do Notion.
 *
 * - 1ª linha "Onde"; na 2ª, a escolha E ou Ou, que vale para o grupo inteiro; da 3ª em diante, o conector repetido em texto;
 * - cada linha tem "⋯" com Excluir, Duplicar e Transformar em grupo;
 * - "Adicionar regra" oferece regra ou grupo. O grupo fica num fundo próprio e só tem regras (1 nível).
 *
 * O mesmo construtor aparece no chip "N regras" da linha de filtros e na seção Filtros do painel.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FiltroDeCampo, GrupoDeRegras } from './mocks'
import type { Textos } from './textos'
import { clonar, ehGrupo } from './mocks'
import { campoLivre, regraNova } from './filtros'
import RegraDeFiltro from './_RegraDeFiltro.vue'

defineOptions({ name: 'ConstrutorDeRegras' })

const props = withDefaults(defineProps<{ t: Textos, nivel?: 0 | 1, empilhado?: boolean }>(), { nivel: 0 })
const grupo = defineModel<GrupoDeRegras>({ required: true })

const conectores = computed(() => [
  { label: props.t.filtro.e, value: 'and', description: props.t.filtro.eAjuda },
  { label: props.t.filtro.ou, value: 'or', description: props.t.filtro.ouAjuda },
])

function mudarRegras(regras: (FiltroDeCampo | GrupoDeRegras)[]) {
  grupo.value = { ...grupo.value, regras }
}
function trocar(i: number, item: FiltroDeCampo | GrupoDeRegras) {
  mudarRegras(grupo.value.regras.map((r, j) => j === i ? item : r))
}

const usados = () => grupo.value.regras.flatMap(r => ehGrupo(r) ? r.regras.map(x => (x as FiltroDeCampo).field) : [r.field])
const novaRegra = () => regraNova(campoLivre(usados()).path)

function adicionarRegra() {
  mudarRegras([...grupo.value.regras, novaRegra()])
}
function adicionarGrupo() {
  mudarRegras([...grupo.value.regras, { conector: 'or', regras: [novaRegra()] }])
}

function acoes(i: number): DropdownMenuItem[][] {
  const r = grupo.value.regras[i]!
  const lista = grupo.value.regras
  const comum: DropdownMenuItem[] = [
    { label: props.t.filtro.duplicar, icon: 'i-lucide-copy', onSelect: () => mudarRegras([...lista.slice(0, i + 1), clonar(r), ...lista.slice(i + 1)]) },
  ]
  if (ehGrupo(r)) {
    comum.push({ label: props.t.filtro.desfazerGrupo, icon: 'i-lucide-ungroup', onSelect: () => mudarRegras([...lista.slice(0, i), ...r.regras, ...lista.slice(i + 1)]) })
  }
  else if (props.nivel === 0) {
    comum.push({ label: props.t.filtro.virarGrupo, icon: 'i-lucide-group', onSelect: () => trocar(i, { conector: 'or', regras: [r] }) })
  }
  return [comum, [{ label: props.t.filtro.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => mudarRegras(lista.filter((_, j) => j !== i)) }]]
}

const menuDeAdicionar = computed<DropdownMenuItem[]>(() => [
  { label: props.t.filtro.adicionarRegra, icon: 'i-lucide-plus', onSelect: adicionarRegra },
  { label: props.t.filtro.adicionarGrupo, description: props.t.filtro.grupoAjuda, icon: 'i-lucide-copy-plus', onSelect: adicionarGrupo },
])
</script>

<template>
  <div class="space-y-1.5">
    <p v-if="!grupo.regras.length" class="px-1 py-1 text-sm text-muted">{{ t.filtro.semRegras }}</p>

    <TransitionGroup
      tag="div"
      class="space-y-1.5"
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-for="(r, i) in grupo.regras" :key="`${i}-${ehGrupo(r) ? 'g' : r.field}`" :class="empilhado ? 'space-y-1' : 'flex items-start gap-1.5'">
        <!-- Conector: "Onde", a escolha E ou Ou na 2ª linha, e o mesmo conector em texto depois. No painel, que é estreito, ele vai em cima da regra. -->
        <div :class="empilhado ? 'w-24' : 'w-16 shrink-0'">
          <span v-if="i === 0" class="block px-2 text-sm text-muted" :class="empilhado ? '' : 'pt-1.5'">{{ t.filtro.onde }}</span>
          <USelect
            v-else-if="i === 1"
            :model-value="grupo.conector"
            :items="conectores"
            size="sm"
            variant="ghost"
            class="w-full"
            :content="{ align: 'start' }"
            :ui="{ content: 'min-w-60' }"
            :aria-label="t.filtro.conector"
            @update:model-value="(v: 'and' | 'or') => (grupo = { ...grupo, conector: v })"
          />
          <span v-else class="block px-2 text-sm text-muted" :class="empilhado ? '' : 'pt-1.5'">{{ grupo.conector === 'or' ? t.filtro.ou : t.filtro.e }}</span>
        </div>

        <div class="flex min-w-0 flex-1 items-start gap-1.5">
          <div v-if="ehGrupo(r)" class="min-w-0 flex-1 rounded-lg bg-elevated/70 p-2 ring ring-default">
            <ConstrutorDeRegras
              :model-value="r"
              :t="t"
              :nivel="1"
              :empilhado="empilhado"
              @update:model-value="(g: GrupoDeRegras) => g.regras.length ? trocar(i, g) : mudarRegras(grupo.regras.filter((_, j) => j !== i))"
            />
          </div>
          <RegraDeFiltro
            v-else
            :model-value="r"
            :t="t"
            :empilhado="empilhado"
            class="flex-1"
            @update:model-value="(x: FiltroDeCampo) => trocar(i, x)"
          />

          <UDropdownMenu :items="acoes(i)" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="sm" :aria-label="t.filtro.maisAcoes" />
          </UDropdownMenu>
        </div>
      </div>
    </TransitionGroup>

    <UDropdownMenu v-if="nivel === 0" :items="menuDeAdicionar" :content="{ align: 'start' }">
      <UButton :label="t.filtro.adicionarRegra" icon="i-lucide-plus" trailing-icon="i-lucide-chevron-down" color="neutral" variant="ghost" size="sm" />
    </UDropdownMenu>
    <UButton v-else :label="t.filtro.adicionarRegra" icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" @click="adicionarRegra" />
  </div>
</template>
