<script setup lang="ts">
/**
 * Projetos dentro do workspace: o nível entre o workspace e as categorias.
 *
 * A casca é o menu novo (protótipo menu-lateral, rodada 35), congelada em _CascaDoMenuNovo.vue.
 * A proposta:
 *   - o ícone Projetos na trilha, abaixo de Início, só quando a pessoa enxerga 1 projeto ou mais;
 *   - o painel Projetos, com o menu de cada pessoa, busca e "Ver todos os N projetos";
 *   - o diretório, a página do projeto, criar, configurar, mover categoria e a tela sem acesso;
 *   - "Item sem acesso" no campo de vínculo e a coluna Projeto em Minhas tarefas;
 *   - o painel Dados com só as categorias do workspace.
 *
 * Uma porta: tudo se navega pelo menu lateral, como no produto.
 * Fonte: o relatório "Usabilidade de projetos no ENSPACE" (2026-11-25), resumido no PESQUISA.md.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { iniciais, workspace } from './mocks'
import { personas, useMarcaDeProposta, useProjetos, type Cenario } from './estado'
import CascaDoMenuNovo from './_CascaDoMenuNovo.vue'
import PainelInicio from './_PainelInicio.vue'
import PainelDados from './_PainelDados.vue'
import PainelDeProjetos from './_PainelDeProjetos.vue'
import TelaInicio from './_TelaInicio.vue'
import TelaTarefas from './_TelaTarefas.vue'
import ListaDaCategoria from './_ListaDaCategoria.vue'
import PaginaDoProjeto from './_PaginaDoProjeto.vue'
import DiretorioDeProjetos from './_DiretorioDeProjetos.vue'
import SemAcesso from './_SemAcesso.vue'
import CriarProjeto from './_CriarProjeto.vue'
import ConfiguracoesDoProjeto from './_ConfiguracoesDoProjeto.vue'
import MoverCategoria from './_MoverCategoria.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Projetos no workspace',
  descricao: 'Um nível entre o workspace e as categorias: o ícone Projetos na trilha do menu novo, o painel de cada pessoa, o diretório, a página do projeto, criar e configurar, mover categoria, acesso por visibilidade e o "Item sem acesso".',
  status: 'rascunho',
  atualizado: '2026-11-25',
  tela: 'Menu lateral novo, diretório e página do projeto, lista da categoria e Minhas tarefas',
})

const t = useTextos(textos)
const prj = useProjetos()
const { area, tela, cenario, estadoDaTela, eu, souDono, souConvidado, visiveis } = prj
const { destacar, marca } = useMarcaDeProposta()
const toast = useToast()

/** O ícone Projetos só aparece depois do 1º projeto que a pessoa enxerga (como Favoritos). */
const comProjetos = computed(() => visiveis.value.length > 0)

/** O ícone da trilha acompanha o objeto aberto; Início e Tarefas ficam no Início. */
watch(tela, (v) => {
  if (v.tipo === 'inicio' || v.tipo === 'tarefas') return
  if (v.tipo === 'categoria') {
    const c = prj.categorias.value.find(x => x.id === v.id)
    area.value = c?.projeto ? 'projetos' : 'dados'
    return
  }
  area.value = 'projetos'
}, { deep: true })

function irParaArea(id: string) {
  area.value = id as typeof area.value
  if (id === 'inicio') tela.value = { tipo: 'inicio' }
}

const maquete = () => toast.add({ title: t.value.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
const itensDeCriar = computed<DropdownMenuItem[][]>(() => [
  [
    { label: t.value.casca.criarItem, icon: 'i-lucide-file-plus', onSelect: maquete },
    { label: t.value.casca.criarTarefa, icon: 'i-lucide-square-check-big', onSelect: maquete },
  ],
  [
    { label: t.value.casca.criarCategoria, icon: 'i-lucide-database', onSelect: maquete },
    { label: t.value.casca.criarMenu, icon: 'i-lucide-menu', onSelect: maquete },
    ...(souDono.value
      ? [{ label: t.value.nome.singular, description: t.value.casca.criarProjetoDica, icon: 'i-lucide-folder-kanban', class: marca.value, onSelect: () => { prj.janelas.criar.value = true } }]
      : []),
  ],
])

const breadcrumb = computed(() => {
  const v = tela.value
  const ws = workspace.nome
  if (v.tipo === 'inicio') return [ws, t.value.casca.inicio]
  if (v.tipo === 'tarefas') return [ws, t.value.casca.destinos.tarefas]
  if (v.tipo === 'diretorio') return [ws, t.value.nome.plural]
  if (v.tipo === 'categoria') {
    const c = prj.categorias.value.find(x => x.id === v.id)
    const p = c ? prj.projetoDa(c) : null
    return [ws, p ? p.nome : t.value.casca.categorias, c?.name ?? '']
  }
  const p = prj.projetos.value.find(x => x.id === v.id)
  if (v.tipo === 'semAcesso' && (!p || !prj.enxerga(p))) return [ws]
  return [ws, t.value.nome.plural, p?.nome ?? '']
})

/* ---------- andaime ---------- */
const cenarios = computed<{ value: Cenario, label: string }[]>(() => [
  { value: 'semProjetos', label: t.value.andaime.semProjetos },
  { value: 'emUso', label: t.value.andaime.emUso },
  { value: 'volume', label: t.value.andaime.volume },
])
const estados = computed(() => [
  { value: 'normal' as const, label: t.value.andaime.normal },
  { value: 'carregando' as const, label: t.value.andaime.carregando },
  { value: 'erro' as const, label: t.value.andaime.erro },
])
const opcoesDePessoa = computed(() => personas.map(p => ({ value: p.id, label: t.value.andaime[p.chave] })))
const pessoaEscolhida = computed({
  get: () => eu.value,
  set: (id: number) => prj.trocarPessoa(id),
})
</script>

<template>
  <div>
    <CascaDoMenuNovo
      :t="t"
      :area="area"
      :breadcrumb="breadcrumb"
      :itens-de-criar="itensDeCriar"
      :pode-configurar="souDono"
      :trilha-do-convidado="souConvidado"
      :iniciais="iniciais(prj.euPessoa.value.nome)"
      @area="irParaArea"
      @inicio="irParaArea('inicio')"
    >
      <template #projetos="{ classe }">
        <UTooltip v-if="comProjetos" :text="t.trilha.projetosDica" :content="{ side: 'right' }">
          <button
            type="button"
            class="animate-[entrada_0.2s_ease-out_both]"
            :class="[classe, marca]"
            :aria-current="area === 'projetos' ? 'page' : undefined"
            @click="irParaArea('projetos')"
          >
            <UIcon name="i-lucide-folder-kanban" class="size-5" :class="area === 'projetos' ? 'text-primary' : ''" />
            <span class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ t.trilha.projetos }}</span>
          </button>
        </UTooltip>
      </template>

      <template #painel="{ recolher }">
        <PainelDeProjetos v-if="area === 'projetos'" key="projetos" class="animate-[entrada_0.2s_ease-out_both]" :class="marca" :t="t" @recolher="recolher" />
        <PainelDados v-else-if="area === 'dados'" key="dados" class="animate-[entrada_0.2s_ease-out_both]" :t="t" @recolher="recolher" />
        <PainelInicio v-else key="inicio" class="animate-[entrada_0.2s_ease-out_both]" :t="t" @recolher="recolher" />
      </template>

      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <TelaInicio v-if="tela.tipo === 'inicio'" key="inicio" :t="t" />
        <TelaTarefas v-else-if="tela.tipo === 'tarefas'" key="tarefas" :t="t" />
        <DiretorioDeProjetos v-else-if="tela.tipo === 'diretorio'" key="diretorio" :t="t" />
        <ListaDaCategoria v-else-if="tela.tipo === 'categoria'" :key="`c-${tela.id}`" :t="t" :id="tela.id" />
        <PaginaDoProjeto v-else-if="tela.tipo === 'projeto'" :key="`p-${tela.id}`" :t="t" :id="tela.id" />
        <SemAcesso v-else :key="`s-${tela.id}`" :t="t" :id="tela.id" />
      </Transition>
    </CascaDoMenuNovo>

    <CriarProjeto :t="t" />
    <ConfiguracoesDoProjeto :t="t" />
    <MoverCategoria :t="t" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>

        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.verComo }}</span>
        <USelect v-model="pessoaEscolhida" :items="opcoesDePessoa" size="xs" class="w-60" :aria-label="t.andaime.verComo" />

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cenario }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="c in cenarios"
            :key="c.value"
            :label="c.label"
            :color="cenario === c.value ? 'primary' : 'neutral'"
            :variant="cenario === c.value ? 'solid' : 'subtle'"
            :aria-pressed="cenario === c.value"
            @click="prj.aplicarCenario(c.value)"
          />
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.estado }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="e in estados"
            :key="e.value"
            :label="e.label"
            :color="estadoDaTela === e.value ? 'primary' : 'neutral'"
            :variant="estadoDaTela === e.value ? 'solid' : 'subtle'"
            :aria-pressed="estadoDaTela === e.value"
            @click="estadoDaTela = e.value"
          />
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <USwitch v-model="destacar" :label="t.andaime.mostrarOQueMuda" size="sm" :ui="{ label: 'text-xs' }" />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/projetos"
          />
        </span>
      </div>
    </div>
  </div>
</template>
