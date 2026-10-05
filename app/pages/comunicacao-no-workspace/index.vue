<script setup lang="ts">
/**
 * Comunicação no workspace: as 3 propostas do documento do Felipe num
 * protótipo só, porque as 3 mexem nas mesmas telas e no mesmo botão de e-mail.
 *
 *   1. link do formulário público nas telas de uso;
 *   2. atalhos de contato (e-mail, WhatsApp, SMS) por deep link;
 *   3. o e-mail do ENSPACE de qualquer tela, com vínculo a item.
 *
 * Uma porta: as telas se navegam pelo menu lateral, como no produto.
 */
import type { Component } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { categoriaPorSlug, itemPorId, itens, workspace } from './mocks'
import { type Cenario, type Tela, useComunicacao } from './estado'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import Compositor from './_Compositor.vue'
import RascunhoMinimizado from './_RascunhoMinimizado.vue'
import TelaInicio from './_TelaInicio.vue'
import TelaItens from './_TelaItens.vue'
import TelaItem from './_TelaItem.vue'
import TelaTarefas from './_TelaTarefas.vue'
import TelaAgenda from './_TelaAgenda.vue'
import TelaRequisicoes from './_TelaRequisicoes.vue'
import TelaEmails from './_TelaEmails.vue'
import TelaSistema from './_TelaSistema.vue'
import TelaCategoria from './_TelaCategoria.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Comunicação no workspace',
  descricao: 'Link do formulário público, atalhos de e-mail, WhatsApp e SMS e o e-mail do ENSPACE em qualquer tela, com vínculo a item. Jornada de quem usa e de quem configura.',
  status: 'em-revisao',
  atualizado: '2026-10-05',
  tela: 'Início, itens, tarefas, Agenda, Requisições, E-mails e Sistema › Módulos',
})

const t = useTextos(textos)
const { tela, categoriaAtual, itemAberto, cenario, destacar, ir, abrirItem } = useComunicacao()

const telas: Record<Tela, Component> = {
  inicio: TelaInicio,
  itens: TelaItens,
  item: TelaItem,
  tarefas: TelaTarefas,
  agenda: TelaAgenda,
  requisicoes: TelaRequisicoes,
  emails: TelaEmails,
  sistema: TelaSistema,
  categoria: TelaCategoria,
}

/** A trilha que o develop mostra em cada tela. */
const trilha = computed(() => {
  const c = t.value.casca
  const ws = workspace.name
  const cat = categoriaPorSlug(categoriaAtual.value).name
  switch (tela.value) {
    case 'inicio': return [c.workspaces, workspace.reference]
    case 'itens': return [ws, c.itens.categorias, cat]
    case 'item': return [ws, c.itens.categorias, cat, itemPorId(itemAberto.value)?.reference ?? '']
    case 'tarefas': return [ws, c.itens.tarefas, c.itens.rapidas]
    case 'agenda': return [ws, c.itens.agenda]
    case 'requisicoes': return [ws, 'request']
    case 'emails': return [ws, c.itens.emails]
    case 'sistema': return [ws, c.configuracoes, c.itens.sistema]
    case 'categoria': return [ws, c.configuracoes, c.dados, c.itens.estruturaCategorias, cat]
  }
  return [ws]
})

/* ---------- andaime ---------- */

const exemplo = itens.find(i => i.reference === 'CTR-00231')!

const irPara = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: t.value.andaime.quemUsa }],
  [
    { label: t.value.casca.itens.inicio, icon: 'i-lucide-house', onSelect: () => ir('inicio') },
    { label: t.value.andaime.listaDeItens, icon: 'i-lucide-table', onSelect: () => ir('itens', { categoria: 'contratos' }) },
    { label: t.value.andaime.umItem(exemplo.reference), icon: 'i-lucide-file', onSelect: () => abrirItem(exemplo.id) },
    { label: t.value.andaime.mailBox(exemplo.reference), icon: 'i-lucide-mailbox', onSelect: () => abrirItem(exemplo.id, 'mailbox') },
    { label: t.value.casca.itens.rapidas, icon: 'i-lucide-clipboard-check', onSelect: () => ir('tarefas') },
    { label: t.value.casca.itens.agenda, icon: 'i-lucide-calendar-days', onSelect: () => ir('agenda') },
    { label: t.value.casca.itens.requisicoes, icon: 'i-lucide-clipboard-pen-line', onSelect: () => ir('requisicoes') },
    { label: t.value.casca.itens.emails, icon: 'i-lucide-mail', onSelect: () => ir('emails') },
  ],
  [{ type: 'label', label: t.value.andaime.quemConfigura }],
  [
    { label: t.value.andaime.modulos, icon: 'i-lucide-settings', onSelect: () => ir('sistema') },
    { label: t.value.andaime.atalhosDaCategoria, icon: 'i-lucide-message-circle-more', onSelect: () => ir('categoria', { categoria: 'contratos', vista: 'atalhos' }) },
    { label: t.value.andaime.formularios, icon: 'i-lucide-file-spreadsheet', onSelect: () => ir('categoria', { categoria: 'solicitacoes', vista: 'formularios' }) },
  ],
])

const cenarios = computed<{ value: Cenario, label: string }[]>(() => [
  { value: 'normal', label: t.value.andaime.cenarios.normal },
  { value: 'sem-outlook', label: t.value.andaime.cenarios.semOutlook },
  { value: 'falha', label: t.value.andaime.cenarios.falha },
])
</script>

<template>
  <div>
    <CascaDoEnspace :t="t" :trilha="trilha">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <component :is="telas[tela]" :key="`${tela}-${categoriaAtual}-${itemAberto}`" :t="t" />
      </Transition>
    </CascaDoEnspace>

    <Compositor :t="t" />
    <RascunhoMinimizado :t="t" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>
        <UDropdownMenu :items="irPara" :content="{ side: 'top', align: 'start' }" :ui="{ content: 'w-64' }">
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

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/comunicacao-no-workspace"
          />
        </span>
      </div>
    </div>
  </div>
</template>
