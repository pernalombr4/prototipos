<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): o "+" da linha do projeto no menu lateral, no lugar do "Criar novo" do
 * espaço do ClickUp (referência em evidencias/ref-clickup-menu-do-espaco.png).
 *
 * Tudo o que entra no projeto entra por aqui, sem passar por Configurações > Interface > Menus:
 *  - Categoria: nova (nasce no projeto) ou do workspace (a janela de categorias do projeto);
 *  - Trabalho: nova tarefa rápida, novo painel e Novo Workflow (o modal do Spaceflow).
 * Quem participa sem administrar vê só a nova tarefa: no produto, criar painel e workflow é de
 * quem administra.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Projeto } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ p: Projeto, classe?: string }>()
const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const { marca } = useMarcaDeProposta()

const itens = computed<DropdownMenuItem[][]>(() => {
  const m = r.value.menu
  const admin = prj.podeAdministrar(props.p)
  const grupos: DropdownMenuItem[][] = []
  if (admin) {
    grupos.push([
      { type: 'label', label: m.grupoCategoria },
      { label: m.novaCategoria, description: m.novaCategoriaDica, icon: 'i-lucide-folder-plus', onSelect: () => { prj.janelas.novaCategoria.value = props.p.id } },
      { label: m.categoriaExistente, description: m.categoriaExistenteDica, icon: 'i-lucide-folder-input', onSelect: () => { prj.janelas.configurar.value = { id: props.p.id, aba: 'categorias' } } },
    ])
  }
  grupos.push([
    { type: 'label', label: m.grupoTrabalho },
    { label: m.novaTarefa, description: m.novaTarefaDica, icon: 'i-lucide-square-check', onSelect: () => { prj.janelas.novaTarefa.value = props.p.id } },
    ...(admin
      ? [
          { label: m.novoPainel, description: m.novoPainelDica, icon: 'i-lucide-chart-column', onSelect: () => { prj.criarDashboard(props.p.id, m.nomeDoPainel) } },
          { label: m.novoWorkflow, description: m.novoWorkflowDica, icon: 'i-lucide-workflow', onSelect: () => { prj.janelas.novoFluxo.value = props.p.id } },
        ]
      : []),
  ])
  return grupos
})
</script>

<template>
  <UDropdownMenu v-if="prj.entra(p) && p.status === 'ativo'" :items="itens" :content="{ align: 'start', side: 'right' }" :ui="{ content: 'w-72' }">
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
