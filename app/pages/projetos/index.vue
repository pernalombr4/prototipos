<script setup lang="ts">
/**
 * Projetos dentro do workspace: o nível entre o workspace e as categorias.
 *
 * 2 cascas, trocadas pela chave Menu do andaime (rodada 2):
 *   - o menu novo (protótipo menu-lateral, rodada 35), congelado em _CascaDoMenuNovo.vue;
 *   - o menu de hoje do develop, em _CascaDoMenuAtual.vue, para o caso de os projetos chegarem antes do
 *     menu novo. No menu atual, Projetos é uma seção abaixo de Spaceflows (_ProjetosNoMenuAtual.vue).
 * A proposta:
 *   - o ícone Projetos na trilha, abaixo de Início, só quando a pessoa enxerga 1 projeto ou mais;
 *   - clicar em Projetos abre o diretório (Todos os projetos), com o painel Projetos ao lado (rodada 4);
 *   - o painel Projetos, com o menu de cada pessoa, busca e "Ver todos os N projetos";
 *   - o diretório, a página do projeto, criar, configurar, mover categoria e a tela sem acesso;
 *   - "Item sem acesso" no campo de vínculo e a coluna Projeto em Minhas tarefas;
 *   - o painel Dados com só as categorias do workspace.
 *
 * Rodada 3 (o que o projeto guarda além das categorias, pela pesquisa e pelo código de 2026-11-26):
 *   - a página do projeto com 4 abas: Visão geral (com o status), Itens, Automações e Painel;
 *   - o mapa Campos comuns nas configurações e o modelo de projeto (salvar e começar de);
 *   - as 3 camadas convivendo: projeto, seção do workspace (Comercial) e favoritos pessoais;
 *   - a 2ª chave do andaime, que marca o que pede peça nova no back-end.
 *
 * Uma porta: tudo se navega pelo menu lateral, como no produto.
 * Fonte: o relatório "Usabilidade de projetos no ENSPACE" (2026-11-25), resumido no PESQUISA.md.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { iniciais, secaoComercial, workspace } from './mocks'
import { personas, useMarcaDeProposta, useProjetos, type Cenario } from './estado'
import CascaDoMenuNovo from './_CascaDoMenuNovo.vue'
import PainelInicio from './_PainelInicio.vue'
import PainelDados from './_PainelDados.vue'
import PainelDeProjetos from './_PainelDeProjetos.vue'
import PainelSecaoDoWorkspace from './_PainelSecaoDoWorkspace.vue'
import CascaDoMenuAtual from './_CascaDoMenuAtual.vue'
import ProjetosNoMenuAtual from './_ProjetosNoMenuAtual.vue'
import TodasAsCategorias from './_TodasAsCategorias.vue'
import Telas from './_Telas.vue'
import CriarProjeto from './_CriarProjeto.vue'
import ConfiguracoesDoProjeto from './_ConfiguracoesDoProjeto.vue'
import MoverCategoria from './_MoverCategoria.vue'
import JanelasDoProjeto from './_JanelasDoProjeto.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Projetos no workspace',
  descricao: 'Um nível entre o workspace e as categorias, no menu novo ou no menu de hoje: a página do projeto com itens de todas as categorias, automações, status e painel, o modelo de projeto, o acesso por visibilidade e as 3 camadas do menu (projeto, seção do workspace e favoritos).',
  status: 'rascunho',
  atualizado: '2026-11-26',
  tela: 'Menu lateral (novo e atual), diretório e página do projeto, lista da categoria e Minhas tarefas',
})

const t = useTextos(textos)
const prj = useProjetos()
const { area, tela, cenario, estadoDaTela, menu, eu, souDono, souConvidado, visiveis } = prj
const { destacar, destacarBack, marca } = useMarcaDeProposta()
const toast = useToast()

/** O ícone Projetos só aparece depois do 1º projeto que a pessoa enxerga (como Favoritos). */
const comProjetos = computed(() => visiveis.value.length > 0)

/** O ícone da trilha acompanha o objeto aberto; Início e Tarefas ficam no Início. */
watch(tela, (v) => {
  if (v.tipo === 'inicio' || v.tipo === 'tarefas') return
  if (v.tipo === 'categoria') {
    // A categoria aberta pelo atalho da seção do workspace mantém a seção ativa na trilha.
    if (area.value === 'comercial' && secaoComercial.categorias.includes(v.id)) return
    const c = prj.categorias.value.find(x => x.id === v.id)
    area.value = c?.projeto ? 'projetos' : 'dados'
    return
  }
  area.value = 'projetos'
}, { deep: true })

function irParaArea(id: string) {
  area.value = id as typeof area.value
  if (id === 'inicio') tela.value = { tipo: 'inicio' }
  // Rodada 4: clicar em Projetos abre direto Todos os projetos, com o painel ao lado.
  if (id === 'projetos') tela.value = { tipo: 'diretorio' }
}

/* ---------- favoritos (camada pessoal) ---------- */
const favorito = computed(() => !!prj.chaveDaTela.value && prj.ehFavorito(prj.chaveDaTela.value))
function favoritar() {
  const chave = prj.chaveDaTela.value
  if (!chave) return
  const v = tela.value
  const nome = v.tipo === 'projeto'
    ? prj.projetos.value.find(x => x.id === v.id)?.nome ?? ''
    : v.tipo === 'categoria' ? prj.categorias.value.find(x => x.id === v.id)?.name ?? '' : ''
  const era = prj.ehFavorito(chave)
  prj.alternarFavorito(chave)
  toast.add({ title: era ? t.value.camadas.desfavoritado(nome) : t.value.camadas.favoritado(nome), icon: 'i-lucide-star', color: era ? 'neutral' : 'warning' })
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

/* ---------- menu atual ---------- */
/** O item da casca de hoje que corresponde à tela aberta (projetos e categorias marcam a si mesmos). */
const ativoNoAtual = computed(() => tela.value.tipo === 'inicio' ? 'inicio' as const : tela.value.tipo === 'tarefas' ? 'painel' as const : null)
function irNoAtual(chave: string) {
  if (chave === 'inicio') tela.value = { tipo: 'inicio' }
  else if (chave === 'painel') tela.value = { tipo: 'tarefas' }
}
const vendoTodasCategorias = ref(false)
const categoriasVisiveis = computed(() => prj.categorias.value.filter(c => prj.veCategoria(c)).length)
const categoriaAtiva = computed(() => tela.value.tipo === 'categoria' ? tela.value.id : null)

/* ---------- andaime ---------- */
const menus = computed(() => [
  { value: 'novo' as const, label: t.value.andaime.menuNovo },
  { value: 'atual' as const, label: t.value.andaime.menuAtual },
])
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
      v-if="menu === 'novo'"
      :t="t"
      :area="area"
      :breadcrumb="breadcrumb"
      :itens-de-criar="itensDeCriar"
      :pode-configurar="souDono"
      :trilha-do-convidado="souConvidado"
      :iniciais="iniciais(prj.euPessoa.value.nome)"
      :favorito="favorito"
      :favoritavel="!!prj.chaveDaTela.value"
      @area="irParaArea"
      @inicio="irParaArea('inicio')"
      @favoritar="favoritar"
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
        <PainelSecaoDoWorkspace v-else-if="area === 'comercial'" key="comercial" class="animate-[entrada_0.2s_ease-out_both]" :t="t" @recolher="recolher" />
        <PainelDados v-else-if="area === 'dados'" key="dados" class="animate-[entrada_0.2s_ease-out_both]" :t="t" @recolher="recolher" />
        <PainelInicio v-else key="inicio" class="animate-[entrada_0.2s_ease-out_both]" :t="t" @recolher="recolher" />
      </template>

      <Telas :t="t" />
    </CascaDoMenuNovo>

    <CascaDoMenuAtual
      v-else
      :t="t"
      :breadcrumb="breadcrumb"
      :convidado="souConvidado"
      :pode-configurar="souDono"
      :iniciais="iniciais(prj.euPessoa.value.nome)"
      :ativo="ativoNoAtual"
      :favorito="favorito"
      :favoritavel="!!prj.chaveDaTela.value"
      @ir="irNoAtual"
      @favoritar="favoritar"
    >
      <template #projetos>
        <ProjetosNoMenuAtual :t="t" />
      </template>

      <!-- PROPOSTA: Categorias mostra só as do workspace; as de projeto ficam no projeto. -->
      <template #categorias>
        <div :class="marca">
          <button
            v-for="c in prj.categoriasDoWorkspace.value"
            :key="c.id"
            type="button"
            class="flex w-full items-center gap-2.5 py-2 pl-10 pr-4 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            :class="categoriaAtiva === c.id ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
            :aria-current="categoriaAtiva === c.id ? 'page' : undefined"
            @click="prj.abrirCategoria(c.id)"
          >
            <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0" />
            <span class="truncate text-sm">{{ c.name }}</span>
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2.5 py-2 pl-10 pr-4 text-left text-muted transition-colors hover:bg-elevated hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            @click="vendoTodasCategorias = true"
          >
            <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0" />
            <span class="truncate text-sm">{{ t.menuAtual.verTodasCategorias(categoriasVisiveis) }}</span>
          </button>
        </div>
      </template>

      <Telas :t="t" />
    </CascaDoMenuAtual>

    <CriarProjeto :t="t" />
    <ConfiguracoesDoProjeto :t="t" />
    <MoverCategoria :t="t" />
    <JanelasDoProjeto />
    <TodasAsCategorias v-model:open="vendoTodasCategorias" :t="t" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>

        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.menu }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="m in menus"
            :key="m.value"
            :label="m.label"
            :color="menu === m.value ? 'primary' : 'neutral'"
            :variant="menu === m.value ? 'solid' : 'subtle'"
            :aria-pressed="menu === m.value"
            @click="menu = m.value"
          />
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />

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
        <USwitch v-model="destacarBack" :label="t.andaime.mostrarBack" size="sm" color="info" :ui="{ label: 'text-xs' }" />

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
