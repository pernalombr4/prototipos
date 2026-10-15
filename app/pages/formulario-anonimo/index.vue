<script setup lang="ts">
/**
 * Respostas anônimas e acesso sem login: 2 configurações independentes do
 * formulário, mais o acompanhamento opcional por protocolo e senha.
 *
 * Uma porta, 3 pontos de vista que se navegam por dentro (andaime "Ir para"):
 *   1. quem configura: Formulários (Definição › Acesso pelo link; Avançado ›
 *      Respostas anônimas e Proteção do link), o construtor, a conferência de
 *      anonimato e o Spaceflow (nó "Responder a quem enviou");
 *   2. quem responde: o link público e o acompanhamento com protocolo e senha;
 *   3. quem trata: a lista da categoria e o painel do item, criado por anonymous.
 * Uma resposta enviada pelo link aparece na lista, e a mensagem da equipe
 * aparece no acompanhamento. Tudo em memória.
 */
import type { Component } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { EXEMPLO, ID_DO_CANAL, categoria, workspace } from './mocks'
import { type Cenario, type Tela, useFormularioAnonimo } from './estado'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import CascaPublica from './_CascaPublica.vue'
import TelaFormularios from './_TelaFormularios.vue'
import TelaSpaceflow from './_TelaSpaceflow.vue'
import TelaItens from './_TelaItens.vue'
import PaginaPublica from './_PaginaPublica.vue'
import Acompanhar from './_Acompanhar.vue'
import Construtor from './_Construtor.vue'
import RevisaoDoCanal from './_RevisaoDoCanal.vue'
import ForaDoEnspace from './_ForaDoEnspace.vue'
import Jornada from './_Jornada.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Formulário anônimo',
  descricao: 'Respostas anônimas (Avançado) e acesso sem login (Definição, só com Público) como 2 configurações separadas do formulário, para avaliação de gestor, feedback ou canal de denúncia. Jornadas de quem configura e de quem responde; o item nasce com o usuário genérico anonymous.',
  status: 'em-revisao',
  atualizado: '2026-10-15',
  tela: 'Formulários (Definição e Avançado), construtor, conferência de anonimato, Spaceflow, link público, acompanhamento e lista da categoria',
})

const t = useTextos(textos)
useHead({ title: () => t.value.formulario.anonimas.titulo })
const { tela, cenario, destacar, itemAberto, noAberto, passoPublico, sessao, ir } = useFormularioAnonimo()

const telasDoEnspace: Partial<Record<Tela, Component>> = {
  formularios: TelaFormularios,
  construtor: Construtor,
  spaceflow: TelaSpaceflow,
  itens: TelaItens,
}
const publica = computed(() => tela.value === 'publico' || tela.value === 'acompanhar')

/** A trilha que o develop mostra em cada tela. */
const trilha = computed(() => {
  const c = t.value.casca
  const ws = workspace.name
  switch (tela.value) {
    case 'formularios': return [ws, c.configuracoes, c.dados, c.itens.estruturaCategorias, categoria.name, t.value.categoria.formulario]
    case 'construtor': return [ws, c.configuracoes, c.dados, c.itens.estruturaCategorias, categoria.name, t.value.categoria.formulario, '<identificação>', 'builder']
    case 'spaceflow': return [ws, c.configuracoes, c.dados, c.itens.spaceflows, '612']
    case 'itens': return [ws, c.itens.categorias, categoria.name]
  }
  return [ws]
})

/* ---------- andaime ---------- */

const irPara = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: t.value.andaime.quemConfigura }],
  [
    { label: t.value.andaime.definicao, icon: 'i-lucide-file-spreadsheet', onSelect: () => ir('formularios', { formulario: ID_DO_CANAL, abaDoFormulario: 'definicao' }) },
    { label: t.value.andaime.avancado, icon: 'i-lucide-sliders-horizontal', onSelect: () => ir('formularios', { formulario: ID_DO_CANAL, abaDoFormulario: 'avancado' }) },
    { label: t.value.andaime.construtor, icon: 'i-lucide-blocks', onSelect: () => ir('construtor') },
    { label: t.value.andaime.fluxo, icon: 'i-lucide-workflow', onSelect: () => ir('spaceflow', { no: 'start' }) },
  ],
  [{ type: 'label', label: t.value.andaime.quemResponde }],
  [
    { label: t.value.andaime.paginaPublica, icon: 'i-lucide-globe', onSelect: () => { passoPublico.value = 'formulario'; ir('publico') } },
    { label: t.value.andaime.acompanhar, icon: 'i-lucide-inbox', onSelect: () => { sessao.value = null; ir('acompanhar') } },
  ],
  [{ type: 'label', label: t.value.andaime.quemTrata }],
  [
    { label: t.value.andaime.lista, icon: 'i-lucide-table', onSelect: () => ir('itens', { item: null }) },
    { label: t.value.andaime.umaResposta(EXEMPLO.data.protocolo), icon: 'i-lucide-venetian-mask', onSelect: () => ir('itens', { item: EXEMPLO.id, aba: 'conversa' }) },
  ],
])

const cenarios = computed<{ value: Cenario, label: string }[]>(() => [
  { value: 'normal', label: t.value.andaime.cenarios.normal },
  { value: 'vazio', label: t.value.andaime.cenarios.vazio },
  { value: 'pico', label: t.value.andaime.cenarios.pico },
  { value: 'falha', label: t.value.andaime.cenarios.falha },
])

// Ao trocar de tela pelo menu, fecha o que estava aberto da outra tela.
watch(tela, (nova) => {
  if (nova !== 'itens') itemAberto.value = null
  if (nova !== 'spaceflow') noAberto.value = null
})
</script>

<template>
  <div>
    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- O div dá um elemento só ao Transition: o EnLayout não tem raiz única e travava o out-in. -->
      <div v-if="tela === 'fora'" key="fora">
        <ForaDoEnspace :t="t" />
      </div>

      <div v-else-if="publica" key="publica">
      <CascaPublica :t="t">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <PaginaPublica v-if="tela === 'publico'" key="publico" :t="t" />
          <Acompanhar v-else key="acompanhar" :t="t" />
        </Transition>
      </CascaPublica>
      </div>

      <div v-else key="enspace">
      <CascaDoEnspace :t="t" :trilha="trilha">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <component :is="telasDoEnspace[tela]" :key="tela" :t="t" />
        </Transition>
      </CascaDoEnspace>
      </div>
    </Transition>

    <!-- PROPOSTA: a conferência de anonimato e o aviso de anonimato ativo (abrem do formulário e do construtor) -->
    <RevisaoDoCanal :t="t" />

    <!-- ANDAIME: o guia das 2 jornadas -->
    <Jornada :t="t" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>
        <UDropdownMenu :items="irPara" :content="{ side: 'top', align: 'start' }" :ui="{ content: 'w-72 z-[110]' }">
          <UButton :label="t.andaime.irPara" icon="i-lucide-map" trailing-icon="i-lucide-chevron-up" size="xs" color="neutral" variant="subtle" />
        </UDropdownMenu>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cenario }}</span>
        <UButton
          v-for="c in cenarios"
          :key="c.value"
          :label="c.label"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="cenario === c.value ? 'primary' : 'neutral'"
          :variant="cenario === c.value ? 'solid' : 'subtle'"
          @click="cenario = c.value"
        />

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <USwitch v-model="destacar" :label="t.andaime.mostrarOQueMuda" size="sm" :ui="{ label: 'text-xs' }" />

        <span v-if="tela === 'acompanhar' && !sessao" class="font-mono text-[11px] text-muted">
          {{ t.andaime.senhaDoExemplo(EXEMPLO.data.protocolo, EXEMPLO.senhaDoPrototipo) }}
        </span>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/formulario-anonimo"
          />
        </span>
      </div>
    </div>
  </div>
</template>
