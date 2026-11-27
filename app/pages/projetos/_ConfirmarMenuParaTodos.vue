<script setup lang="ts">
/**
 * Rodada 13: a confirmação do "Salvar para todos" do menu de projetos, com os mesmos botões da confirmação da
 * barra de informações do item no ENSPACE (Cancelar e Salvar para todos).
 */
import { useProjetos } from './estado'
import { useMenuDoProjeto } from './menuDoProjeto'

const prj = useProjetos()
const menu = useMenuDoProjeto()
const tm = menu.tm
const projeto = computed(() => prj.projetos.value.find(p => p.id === menu.pendente.value?.id))
const mostrar = computed(() => menu.pendente.value?.mostrar ?? true)
</script>

<template>
  <UModal
    :open="!!menu.pendente.value"
    :title="mostrar ? tm.confirmarAdicionarTitulo : tm.confirmarOcultarTitulo"
    :description="projeto ? (mostrar ? tm.confirmarAdicionarTexto(projeto.nome) : tm.confirmarOcultarTexto(projeto.nome)) : ''"
    :ui="{ footer: 'justify-end gap-2' }"
    @update:open="(v: boolean) => { if (!v) menu.pendente.value = null }"
  >
    <template #footer>
      <UButton :label="tm.cancelar" color="neutral" variant="outline" @click="menu.pendente.value = null" />
      <UButton :label="tm.salvarParaTodos" icon="i-lucide-users" color="warning" @click="menu.confirmar()" />
    </template>
  </UModal>
</template>
