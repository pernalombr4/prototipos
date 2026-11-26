<script setup lang="ts">
/**
 * Comunicação no workspace: as 3 propostas do documento do Felipe num
 * protótipo só, porque as 3 mexem nas mesmas telas e no mesmo botão de e-mail.
 *
 *   1. link do formulário público nas telas de uso;
 *   2. atalhos de e-mail, WhatsApp e SMS (os 2 saíram na rodada 6; o WhatsApp voltou na 10 e o SMS na 11);
 *   3. o e-mail do ENSPACE de qualquer tela, com vínculo a item, e a central
 *      "E-mails" no menu, que reúne mensagens, modelos, caixas, envios do
 *      sistema e a configuração (rodada 7: o e-mail não é módulo).
 *
 * Dividido em 3 fases, que o andaime alterna:
 *   Fase 1 (MVP): só tela, sobre o que o ENSPACE já tem;
 *   Fase 2: escolher o "De" (Outlook ou caixa do workspace), responder na
 *           mesma conversa, encaminhar, registrar o e-mail sem item;
 *   Fase 3: vincular o e-mail a uma tarefa.
 *
 * Uma porta: as telas se navegam pelo menu lateral, como no produto.
 */
import type { Component } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { categoriaPorSlug, itemPorId, itens, workspace } from './mocks'
import { type Cenario, FASES, type Tela, useComunicacao } from './estado'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import Compositor from './_Compositor.vue'
import RascunhoMinimizado from './_RascunhoMinimizado.vue'
import AppExterno from './_AppExterno.vue'
import PainelDoSms from './_PainelDoSms.vue'
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
  descricao: 'Link do formulário público, atalhos de e-mail e o e-mail do ENSPACE em qualquer tela, com a central E-mails no menu e a Mail Box no item e na tarefa. Em 3 fases: o MVP sobre o que já existe, o remetente e a tarefa.',
  status: 'em-revisao',
  atualizado: '2026-11-24',
  tela: 'Início, itens, tarefas, Agenda, Requisições e a central E-mails',
})

const t = useTextos(textos)
const { tela, categoriaAtual, itemAberto, cenario, destacar, fase, perfil, ehAdmin, abaDaCentral, dados, ir, abrirItem } = useComunicacao()

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
    case 'emails': return [ws, c.itens.emails, t.value.central.abas[abaDaCentral.value]]
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
    { label: t.value.casca.itens.emails, icon: 'i-lucide-mail', onSelect: () => ir('emails', { central: 'mensagens' }) },
  ],
  ...(ehAdmin.value
    ? [
        [{ type: 'label' as const, label: t.value.andaime.quemConfigura }],
        [
          { label: t.value.andaime.configDosEmails, icon: 'i-lucide-settings', onSelect: () => ir('emails', { central: 'configuracoes' }) },
          ...(fase.value >= 2 ? [{ label: t.value.andaime.atalhosDaCategoria, icon: 'i-lucide-contact', onSelect: () => ir('categoria', { categoria: 'contratos', vista: 'atalhos' }) }] : []),
          { label: t.value.andaime.formularios, icon: 'i-lucide-file-spreadsheet', onSelect: () => ir('categoria', { categoria: 'solicitacoes', vista: 'formularios' }) },
        ],
      ]
    : []),
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
    <!-- ANDAIME: a simulação do app de fora (e-mail, formulário público, Microsoft) -->
    <PainelDoSms :t="t" />
    <AppExterno :t="t" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>
        <UDropdownMenu :items="irPara" :content="{ side: 'top', align: 'start' }" :ui="{ content: 'w-64' }">
          <UButton :label="t.andaime.irPara" icon="i-lucide-map" trailing-icon="i-lucide-chevron-up" size="xs" color="neutral" variant="subtle" />
        </UDropdownMenu>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.fase }}</span>
        <UFieldGroup size="xs">
          <UTooltip v-for="f in FASES" :key="f" :text="t.andaime.fasesDica[f]">
            <UButton
              :label="t.andaime.fases[f]"
              :color="fase === f ? 'primary' : 'neutral'"
              :variant="fase === f ? 'solid' : 'subtle'"
              :aria-pressed="fase === f"
              @click="fase = f"
            />
          </UTooltip>
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.perfil }}</span>
        <UTooltip :text="t.andaime.perfilDica">
          <UFieldGroup size="xs">
            <UButton
              v-for="p in (['admin', 'membro'] as const)"
              :key="p"
              :label="t.andaime.perfis[p]"
              :color="perfil === p ? 'primary' : 'neutral'"
              :variant="perfil === p ? 'solid' : 'subtle'"
              :aria-pressed="perfil === p"
              @click="perfil = p"
            />
          </UFieldGroup>
        </UTooltip>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.dados }}</span>
        <UTooltip :text="t.andaime.dadosDica">
          <UFieldGroup size="xs">
            <UButton
              v-for="d in (['novo', 'primeiroUso', 'emUso'] as const)"
              :key="d"
              :label="t.andaime.dadosOpcoes[d]"
              :color="dados === d ? 'primary' : 'neutral'"
              :variant="dados === d ? 'solid' : 'subtle'"
              :aria-pressed="dados === d"
              @click="dados = d"
            />
          </UFieldGroup>
        </UTooltip>

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
