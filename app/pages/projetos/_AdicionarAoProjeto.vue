<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): o "+" da linha do projeto no menu lateral, no lugar do "Criar novo" do
 * espaço do ClickUp (referência em evidencias/ref-clickup-menu-do-espaco.png).
 *
 * É o atalho: a mesma lista abre no submenu Adicionar do "•••" (adicionarAoProjeto.ts).
 * Tudo o que entra no projeto entra por aqui, sem passar por Configurações > Interface > Menus:
 *  - Categoria: nova (nasce no projeto) ou do workspace (a janela de categorias do projeto);
 *  - Trabalho: nova tarefa rápida, novo painel e Novo Workflow (o modal do Spaceflow).
 * Quem participa sem administrar vê só a nova tarefa: no produto, criar painel e workflow é de
 * quem administra.
 */
import type { Projeto } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useMarcaDeProposta } from './estado'
import { useAdicionarAoProjeto } from './adicionarAoProjeto'

const props = defineProps<{ p: Projeto, classe?: string }>()
const r = useTextos(textosDoProjeto)
const { marca } = useMarcaDeProposta()
const adicionar = useAdicionarAoProjeto()
const itens = computed(() => adicionar.itens(props.p))
</script>

<template>
  <UDropdownMenu v-if="adicionar.aceita(p)" :items="itens" :content="{ align: 'start', side: 'right' }" :ui="{ content: 'w-72' }">
    <UTooltip :text="r.menu.adicionarEm(p.nome)">
      <UButton
        icon="i-lucide-plus"
        size="xs"
        color="neutral"
        variant="ghost"
        :class="[classe, marca]"
        :aria-label="r.menu.adicionarEm(p.nome)"
      />
    </UTooltip>
  </UDropdownMenu>
</template>
