<script setup lang="ts">
/**
 * A área de conteúdo, a mesma nas 2 cascas (menu novo e menu atual): só o menu lateral muda.
 */
import type { Textos } from './textos'
import { useProjetos } from './estado'
import TelaInicio from './_TelaInicio.vue'
import TelaTarefas from './_TelaTarefas.vue'
import ListaDaCategoria from './_ListaDaCategoria.vue'
import PaginaDoProjeto from './_PaginaDoProjeto.vue'
import DiretorioDeProjetos from './_DiretorioDeProjetos.vue'
import SemAcesso from './_SemAcesso.vue'

defineProps<{ t: Textos }>()
const { tela } = useProjetos()
</script>

<template>
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
</template>
