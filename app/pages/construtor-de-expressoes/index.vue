<script setup lang="ts">
/**
 * Construtor de expressões: o Editor de Expressão do Valor Virtual, refeito para
 * nunca gerar expressão errada e para ser testado num formulário de verdade.
 *
 * Uma porta, 2 telas que se navegam por dentro (andaime "Ir para"):
 *   1. Campos da categoria, com a gaveta do Valor Virtual aberta: o construtor
 *      (Visual e Texto) e o formulário de teste no lugar da pré-visualização;
 *   2. a lista de Orçamentos, onde a expressão salva calcula em 8 itens e no
 *      modal Novo registro.
 * O andaime troca o motor: "O que funciona hoje" (motor do develop, portado) ou
 * "Novas expressões" (proposta de motor com as mesmas bibliotecas).
 */
import type { Component } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { EXEMPLOS, categoria, workspace } from './mocks'
import { type Tela, useConstrutorDeExpressoes } from './estado'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import TelaCampos from './_TelaCampos.vue'
import TelaItens from './_TelaItens.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Construtor de expressões',
  descricao: 'O Editor de Expressão do Valor Virtual refeito: blocos em linha que só geram o que o motor calcula certo, leitura de volta do texto escrito à mão e teste num formulário com os outros campos. 2 motores: o de hoje (sem mudar o back-end) e o de novas expressões.',
  status: 'em-revisao',
  atualizado: '2026-10-15',
  tela: 'Campos da categoria (gaveta do Valor Virtual) e lista de itens com Novo registro',
})

const t = useTextos(textos)
useHead({ title: () => t.value.gaveta.editorDeExpressao })
const toast = useToast()
const { tela, modo, gaveta, trocarModo, carregarExemplo } = useConstrutorDeExpressoes()

const telas: Record<Tela, Component> = { campos: TelaCampos, itens: TelaItens }

const trilha = computed(() => {
  const c = t.value.casca
  return tela.value === 'campos'
    ? [workspace.name, c.configuracoes, c.dados, c.itens.estruturaCategorias, categoria.reference, c.campos]
    : [workspace.name, c.itens.categorias, categoria.reference]
})

/* ---------- andaime ---------- */

const irPara = computed<DropdownMenuItem[][]>(() => [[
  { label: t.value.andaime.telaCampos, icon: 'i-lucide-settings-2', onSelect: () => { tela.value = 'campos'; gaveta.value = true } },
  { label: t.value.andaime.telaItens, icon: 'i-lucide-table', onSelect: () => { tela.value = 'itens' } },
]])

const exemplos = computed<DropdownMenuItem[][]>(() => (['hoje', 'proposta'] as const).map(m => [
  { type: 'label' as const, label: t.value.andaime.exemplosDe[m] },
  ...EXEMPLOS.filter(e => e.modo === m).map(e => ({
    label: t.value.andaime.nomesDosExemplos[e.chave],
    icon: m === 'hoje' ? 'i-lucide-circle-check' : 'i-lucide-sparkles',
    onSelect: () => carregarExemplo(e.chave),
  })),
]))

function escolherModo(m: 'hoje' | 'proposta') {
  if (m === modo.value) return
  trocarModo(m)
  toast.add({ title: t.value.andaime.trocouMotor(t.value.andaime.motores[m]), icon: m === 'hoje' ? 'i-lucide-circle-check' : 'i-lucide-sparkles', color: m === 'hoje' ? 'neutral' : 'secondary' })
}
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
        <component :is="telas[tela]" :key="tela" :t="t" />
      </Transition>
    </CascaDoEnspace>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-[60] border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>
        <UDropdownMenu :items="irPara" :content="{ side: 'top', align: 'start' }" :ui="{ content: 'w-80 z-[110]' }">
          <UButton :label="t.andaime.irPara" icon="i-lucide-map" trailing-icon="i-lucide-chevron-up" size="xs" color="neutral" variant="subtle" />
        </UDropdownMenu>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.motor }}</span>
        <UTooltip v-for="m in (['hoje', 'proposta'] as const)" :key="m" :text="t.andaime.motorAjuda[m]">
          <UButton
            :label="t.andaime.motores[m]"
            :icon="m === 'hoje' ? 'i-lucide-circle-check' : 'i-lucide-sparkles'"
            size="xs"
            class="transition-transform hover:-translate-y-0.5"
            :color="modo === m ? (m === 'hoje' ? 'primary' : 'secondary') : 'neutral'"
            :variant="modo === m ? 'solid' : 'subtle'"
            @click="escolherModo(m)"
          />
        </UTooltip>

        <UDropdownMenu :items="exemplos" :content="{ side: 'top', align: 'start' }" :ui="{ content: 'w-80 z-[110]' }">
          <UButton :label="t.andaime.exemplos" icon="i-lucide-flask-conical" trailing-icon="i-lucide-chevron-up" size="xs" color="neutral" variant="subtle" />
        </UDropdownMenu>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/construtor-de-expressoes"
          />
        </span>
      </div>
    </div>
  </div>
</template>
