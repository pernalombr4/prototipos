<script setup lang="ts">
import { useAplicarCaso, type CasoDeUso, type ModoDeAplicar } from './casos'
import { rotuloDoNo } from './rotulos'
import type { TextosDaTela } from './textos'

/**
 * O QUE ENTRA, E O QUE FAZER COM O QUE JÁ EXISTE (rodada 18).
 *
 * A mesma escolha em "Usar caso de uso" e em "Importar", porque é a mesma
 * operação: um pacote de estrutura chegando num menu que já tem coisa.
 *
 *   "e na hora seleciono se quero que sobrescreva ou some com o que ja tem"
 *   (Mikaela)
 *
 * A estrutura aparece como árvore, nunca como arquivo: é a regra do
 * protótipo `migracao-de-workspace` ("o user é leigo e não pode ver json").
 * E substituir mostra o que SAI antes do clique, porque é a parte que dói.
 */
const props = defineProps<{
  t: TextosDaTela
  caso: CasoDeUso
}>()

const modo = defineModel<ModoDeAplicar>('modo', { required: true })
const lugar = defineModel<'inicio' | 'trilha'>('lugar', { required: true })

const { saemSeSubstituir } = useAplicarCaso()
</script>

<template>
  <div class="space-y-5">
    <!-- O que entra -->
    <section>
      <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.oQueEntra }}</p>
      <div class="space-y-2 rounded-lg border border-default p-3">
        <div v-for="m in props.caso.menus" :key="m.rotulo">
          <p class="flex items-center gap-2 text-sm font-medium text-default">
            <UIcon :name="m.icone" class="size-4 text-toned" />{{ m.rotulo }}
            <UBadge :label="props.t.telaNovaSelo" size="sm" color="success" variant="subtle" />
          </p>
          <ul class="ml-6 mt-1 space-y-0.5">
            <li v-for="x in m.telas" :key="x.rotulo" class="flex items-center gap-2 text-sm text-default">
              <UIcon :name="x.icone" class="size-3.5 text-toned" />{{ x.rotulo }}
              <span class="text-xs text-muted">{{ props.t.tipos[x.tipoDeTela] }}</span>
            </li>
          </ul>
        </div>
        <div v-if="props.caso.categorias.length" class="flex flex-wrap gap-1.5 border-t border-default pt-2" :class="props.caso.menus.length ? '' : 'border-t-0 pt-0'">
          <UBadge
            v-for="c in props.caso.categorias"
            :key="c.nome"
            :label="c.nome"
            :icon="c.icone"
            color="neutral"
            variant="subtle"
          />
        </div>
      </div>
    </section>

    <!-- E com o que já existe? -->
    <section>
      <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.comOQueExiste }}</p>
      <div class="grid gap-2 sm:grid-cols-2" role="radiogroup" :aria-label="props.t.comOQueExiste">
        <button
          v-for="op in [{ v: 'somar', ti: props.t.modoSomarTitulo, d: props.t.modoSomarDica, i: 'i-lucide-list-plus' }, { v: 'substituir', ti: props.t.modoSubstituirTitulo, d: props.t.modoSubstituirDica, i: 'i-lucide-replace' }]"
          :key="op.v"
          type="button"
          role="radio"
          :aria-checked="modo === op.v"
          class="flex gap-2.5 rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary"
          :class="modo === op.v ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-default hover:bg-elevated'"
          @click="modo = op.v as ModoDeAplicar"
        >
          <UIcon :name="op.i" class="mt-0.5 size-4 shrink-0" :class="modo === op.v ? 'text-primary' : 'text-toned'" />
          <span>
            <span class="block text-sm font-medium text-highlighted">{{ op.ti }}</span>
            <span class="block text-xs text-muted">{{ op.d }}</span>
          </span>
        </button>
      </div>

      <!-- Substituir: o que sai, antes do clique. -->
      <div v-if="modo === 'substituir'" class="mt-3 animate-[entrada_0.2s_ease-out_both] rounded-lg border border-error/30 bg-error/5 p-3">
        <p class="mb-1.5 text-sm font-semibold text-error-700 dark:text-error-300">{{ props.t.oQueSai }}</p>
        <p v-if="!saemSeSubstituir.length" class="text-xs text-muted">{{ props.t.nadaSai }}</p>
        <ul v-else class="space-y-0.5">
          <li v-for="s in saemSeSubstituir" :key="s.id" class="flex items-center gap-2 text-sm text-default line-through decoration-error/60">
            <UIcon :name="s.icone" class="size-4 text-toned" />{{ rotuloDoNo(s, props.t) }}
          </li>
        </ul>
      </div>
    </section>

    <!-- Onde os menus entram -->
    <section v-if="props.caso.menus.length">
      <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.ondeEntram }}</p>
      <div class="flex gap-2">
        <UButton
          v-for="op in [{ v: 'inicio', r: props.t.noInicio, i: 'i-lucide-house' }, { v: 'trilha', r: props.t.naTrilhaRotulo, i: 'i-lucide-panel-left' }]"
          :key="op.v"
          :label="op.r"
          :icon="op.i"
          size="sm"
          :color="lugar === op.v ? 'primary' : 'neutral'"
          :variant="lugar === op.v ? 'soft' : 'outline'"
          :aria-pressed="lugar === op.v"
          @click="lugar = op.v as 'inicio' | 'trilha'"
        />
      </div>
    </section>
  </div>
</template>
