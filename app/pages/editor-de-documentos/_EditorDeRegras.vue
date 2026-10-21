<script setup lang="ts">
/**
 * PROPOSTA: o montador de 1 teste (a parte "Se" de uma condição, ou o filtro de
 * uma repetição).
 * - "Precisa valer: Todas as condições / Qualquer uma" só aparece com 2 ou
 *   mais linhas, e cada linha repete o conectivo em cinza ("e", "ou");
 * - "Grupo" é uma caixa com o próprio conectivo, 1 nível só (Valor > 100 mil
 *   E (Status é A OU Responsável é B));
 * - a escolha "é um destes" (vários valores numa linha) cobre o OU mais comum
 *   sem abrir grupo.
 */
import type { SelectItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type CampoDeRegra, type Teste, novaRegra } from './regras'
import LinhaDeRegra from './_LinhaDeRegra.vue'

const props = defineProps<{
  teste: Teste
  campos: CampoDeRegra[]
  opcoesDe: (ref: string) => SelectItem[] | null
  grupos: boolean
  t: Textos
  idioma: string
}>()

const conectores = computed<SelectItem[]>(() => [
  { label: props.t.modelo.conector.E, value: 'E' },
  { label: props.t.modelo.conector.OU, value: 'OU' },
])

function junta(c: 'E' | 'OU') {
  return c === 'E' ? props.t.modelo.juntaE : props.t.modelo.juntaOU
}

function adicionarGrupo() {
  props.teste.itens.push({ tipo: 'grupo', conector: 'OU', regras: [novaRegra(), novaRegra()] })
}

function removerDoGrupo(i: number, j: number) {
  const g = props.teste.itens[i]
  if (!g || g.tipo !== 'grupo') return
  g.regras.splice(j, 1)
  // Grupo com 1 linha só vira linha comum.
  if (g.regras.length === 1) props.teste.itens.splice(i, 1, g.regras[0]!)
}
</script>

<template>
  <div class="space-y-2">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
    >
      <div v-if="teste.itens.length > 1" class="flex items-center gap-2 pl-7">
        <span class="text-xs text-muted">{{ t.modelo.precisaValer }}</span>
        <USelect v-model="teste.conector" :items="conectores" size="xs" class="min-w-40" :aria-label="t.modelo.precisaValer" />
      </div>
    </Transition>

    <TransitionGroup
      tag="div"
      class="space-y-2"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <template v-for="(item, i) in teste.itens" :key="i">
        <LinhaDeRegra
          v-if="item.tipo === 'regra'"
          :regra="item"
          :campos="campos"
          :opcoes-de="opcoesDe"
          :rotulo="i === 0 ? '' : junta(teste.conector)"
          :removivel="teste.itens.length > 1"
          :t="t"
          :idioma="idioma"
          @remover="teste.itens.splice(i, 1)"
        />
        <div v-else class="flex items-start gap-1.5">
          <span class="w-6 shrink-0 pt-2 text-right text-xs font-medium text-muted">{{ i === 0 ? '' : junta(teste.conector) }}</span>
          <div class="min-w-0 flex-1 space-y-2 rounded-md bg-elevated/70 p-2 ring-1 ring-default">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-brackets" class="size-3.5 text-muted" />
              <span class="text-xs font-medium text-toned">{{ t.modelo.grupo }}</span>
              <USelect v-model="item.conector" :items="conectores" size="xs" class="min-w-36" :aria-label="t.modelo.precisaValer" />
              <span class="flex-1" />
              <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.removerGrupo" @click="teste.itens.splice(i, 1)" />
            </div>
            <LinhaDeRegra
              v-for="(r, j) in item.regras"
              :key="j"
              :regra="r"
              :campos="campos"
              :opcoes-de="opcoesDe"
              :rotulo="j === 0 ? '' : junta(item.conector)"
              :removivel="true"
              :t="t"
              :idioma="idioma"
              @remover="removerDoGrupo(i, j)"
            />
            <UButton icon="i-lucide-plus" :label="t.modelo.adicionarRegra" color="neutral" variant="ghost" size="xs" class="ml-7" @click="item.regras.push(novaRegra())" />
          </div>
        </div>
      </template>
    </TransitionGroup>

    <div class="flex gap-2 pl-7">
      <UButton icon="i-lucide-plus" :label="t.modelo.adicionarRegra" color="neutral" variant="outline" size="xs" @click="teste.itens.push(novaRegra())" />
      <UButton v-if="grupos" icon="i-lucide-brackets" :label="t.modelo.adicionarGrupo" color="neutral" variant="outline" size="xs" @click="adicionarGrupo" />
    </div>
  </div>
</template>
