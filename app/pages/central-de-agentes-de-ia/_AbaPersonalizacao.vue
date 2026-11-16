<script setup lang="ts">
/**
 * Aba Personalização: os campos de hoje (ícone, papel, abordagem, estilo,
 * regras), na mesma ordem.
 *
 * PROPOSTA: cada regra é uma linha com o contador de 255 caracteres à vista,
 * em vez de descobrir o limite só ao salvar (achado do develop, BRIEFING).
 * A cor do BENI do agente entra junto do ícone.
 */
import type { Textos } from './textos'
import type { Agente } from './mocks'
import AvatarDoAgente from './_AvatarDoAgente.vue'

const props = defineProps<{ t: Textos, a: Agente, erro: boolean }>()
const p = computed(() => props.t.personalizacao)
const LIMITE = 255

const icones = ['i-lucide-bot', 'i-lucide-scale', 'i-lucide-inbox', 'i-lucide-file-search', 'i-lucide-landmark', 'i-lucide-hand-coins', 'i-lucide-briefcase', 'i-lucide-gavel', 'i-lucide-headset', 'i-lucide-file-text', 'i-lucide-calculator', 'i-lucide-shield-check']
const cores = ['#7c3aed', '#60a5fa', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#64748b']

const estilos = computed(() => Object.entries(p.value.estilos).map(([value, label]) => ({ value, label })))

function adicionar() { props.a.rules.push('') }
function remover(i: number) { props.a.rules.splice(i, 1) }
</script>

<template>
  <div class="grid gap-x-8 gap-y-6 lg:grid-cols-2">
    <div class="space-y-5">
      <UFormField :label="p.icone">
        <div class="flex flex-wrap gap-1.5">
          <UButton
            v-for="i in icones"
            :key="i"
            :icon="i"
            :color="a.icon === i ? 'primary' : 'neutral'"
            :variant="a.icon === i ? 'solid' : 'outline'"
            size="sm"
            :aria-pressed="a.icon === i"
            :aria-label="i.replace('i-lucide-', '')"
            @click="a.icon = i"
          />
          <UButton :label="p.semIcone" color="neutral" :variant="!a.icon ? 'soft' : 'ghost'" size="sm" @click="a.icon = null" />
        </div>
      </UFormField>

      <UFormField :label="p.cor">
        <div class="flex items-center gap-3">
          <AvatarDoAgente :cor="a.cor" tamanho="md" />
          <div class="flex flex-wrap gap-1.5" role="radiogroup" :aria-label="p.cor">
            <button
              v-for="c in cores"
              :key="c"
              type="button"
              role="radio"
              :aria-checked="a.cor === c"
              :aria-label="c"
              class="size-7 rounded-full ring-offset-2 ring-offset-(--ui-bg) transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
              :class="a.cor === c ? 'ring-2 ring-primary' : ''"
              :style="{ backgroundColor: c }"
              @click="a.cor = c"
            />
          </div>
        </div>
      </UFormField>

      <UFormField :label="p.papel" required :error="erro && !a.role.trim() ? ' ' : false">
        <UInput v-model="a.role" :placeholder="p.papelPlaceholder" class="w-full" />
      </UFormField>

      <UFormField :label="p.abordagem" :help="p.abordagemAjuda" required :error="erro && !a.approach.trim() ? ' ' : false">
        <UTextarea v-model="a.approach" :rows="3" autoresize class="w-full" />
      </UFormField>

      <UFormField :label="p.estilo">
        <USelect v-model="a.writing_style" :items="estilos" value-key="value" class="w-full" />
      </UFormField>
    </div>

    <div>
      <UFormField :label="p.regras" :help="p.regrasAjuda">
        <TransitionGroup tag="ol" class="space-y-2" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <li v-for="(r, i) in a.rules" :key="i" class="flex items-start gap-2">
            <span class="mt-2 w-5 text-right text-xs tabular-nums text-dimmed">{{ i + 1 }}.</span>
            <div class="min-w-0 flex-1">
              <UTextarea
                v-model="a.rules[i]"
                :rows="1"
                autoresize
                class="w-full"
                :color="r.length > LIMITE ? 'error' : 'primary'"
                :highlight="r.length > LIMITE"
                :placeholder="p.regraPlaceholder"
                :aria-label="`${p.regras} ${i + 1}`"
              />
              <p class="mt-0.5 text-right text-xs tabular-nums" :class="r.length > LIMITE ? 'text-error' : r.length > LIMITE - 30 ? 'text-warning' : 'text-dimmed'">
                {{ p.restam(LIMITE - r.length) }}
              </p>
              <p v-if="r.length > LIMITE" class="text-xs text-error">{{ p.estouro }}</p>
            </div>
            <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" class="mt-0.5" :aria-label="p.removerRegra" @click="remover(i)" />
          </li>
        </TransitionGroup>
        <UButton :label="p.adicionarRegra" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" class="mt-3" @click="adicionar" />
      </UFormField>
    </div>
  </div>
</template>
