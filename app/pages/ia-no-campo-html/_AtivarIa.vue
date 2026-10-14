<script setup lang="ts">
/**
 * Ativar a IA sem sair do campo. PROPOSTA (rodada 6).
 *
 * Com a IA desligada, o botão IA, o Ctrl J e o "/" não bloqueiam: abrem esta
 * caixa no lugar da caixa do BENI. É a tela de hoje de Configurações ›
 * Integrações › OpenAI (botão "Instalar Integração" e modal com "Api Key"),
 * trazida para o contexto do campo e com o que falta nela:
 * - o que a pessoa ganha e o que precisa ter (chave com créditos);
 * - "Onde pego a chave?" levando à página de chaves da OpenAI;
 * - erro no próprio campo quando a chave não tem o formato certo;
 * - ao ativar, a caixa vira a do BENI ali mesmo, com o pedido que a pessoa
 *   tinha feito (se veio de uma ação do "/" ou da barra).
 *
 * Quem não administra o workspace não instala integração: vê quem administra
 * e pede a ativação.
 *
 * SIMULAÇÃO: a chave não sai do navegador. Qualquer chave que começa com
 * "sk-" e tem 20 caracteres ou mais passa.
 */
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  papel: 'admin' | 'membro'
  /** Rótulo da ação que a pessoa escolheu antes de ver esta caixa, se houve. */
  pendente?: string
}>()

const emit = defineEmits<{
  ativada: []
  fechar: []
}>()

const ta = computed(() => props.t.ativar)
const toast = useToast()

const chave = ref('')
const mostrar = ref(false)
const erro = ref('')
const conferindo = ref(false)
const pronto = ref(false)
const pedido = ref(false)

const administradores = 'Renata Albuquerque, Otávio Nunes'

async function ativar() {
  const c = chave.value.trim()
  erro.value = ''
  if (!c) {
    erro.value = ta.value.vazia
    return
  }
  conferindo.value = true
  await new Promise(r => setTimeout(r, 1100))
  conferindo.value = false
  if (!/^sk-[\w-]{17,}$/.test(c)) {
    erro.value = ta.value.invalida
    return
  }
  pronto.value = true
  chave.value = ''
  await new Promise(r => setTimeout(r, 900))
  emit('ativada')
}

function pedirAtivacao() {
  pedido.value = true
  toast.add({ title: ta.value.pedido, icon: 'i-lucide-bell-ring', color: 'success', duration: 4000 })
}
</script>

<template>
  <div
    role="dialog"
    :aria-label="ta.titulo"
    class="overflow-hidden rounded-xl border border-default bg-default shadow-xl ring-1 ring-primary/15"
    @keydown.esc.stop.prevent="emit('fechar')"
  >
    <!-- ATIVADA: a confirmação, antes de virar a caixa do BENI -->
    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="pronto" key="pronto" class="flex items-center gap-3 px-4 py-5" aria-live="polite">
        <span class="flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
          <UIcon name="i-lucide-check" class="size-5" />
        </span>
        <div>
          <p class="text-sm font-semibold text-highlighted">{{ ta.ativada }}</p>
          <p class="text-xs text-muted">{{ ta.abrindo }}</p>
        </div>
      </div>

      <!-- QUEM ADMINISTRA: a chave, ali mesmo -->
      <form v-else-if="papel === 'admin'" key="admin" class="flex flex-col gap-3 p-4" @submit.prevent="ativar">
        <div class="flex items-start gap-3">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-elevated ring-1 ring-default">
            <UIcon name="i-simple-icons-openai" class="size-5 text-highlighted" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-highlighted">{{ ta.titulo }}</p>
            <p class="text-sm text-muted">{{ ta.texto }}</p>
            <p v-if="pendente" class="mt-1.5 flex items-center gap-1.5 text-xs text-primary">
              <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />{{ ta.emSeguida(pendente) }}
            </p>
          </div>
        </div>

        <UFormField :label="ta.chave" :error="erro || undefined" :ui="{ label: 'text-xs' }">
          <template #hint>
            <ULink to="https://platform.openai.com/api-keys" target="_blank" class="inline-flex items-center gap-1 text-xs text-primary">
              {{ ta.ondePego }}<UIcon name="i-lucide-arrow-up-right" class="size-3" />
            </ULink>
          </template>
          <UInput
            v-model="chave"
            :type="mostrar ? 'text' : 'password'"
            :placeholder="ta.placeholder"
            autocomplete="off"
            spellcheck="false"
            class="w-full font-mono"
            autofocus
            @update:model-value="erro = ''"
          >
            <template #trailing>
              <UButton
                :icon="mostrar ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                color="neutral"
                variant="link"
                size="xs"
                :aria-label="mostrar ? ta.esconder : ta.mostrar"
                :aria-pressed="mostrar"
                @click="mostrar = !mostrar"
              />
            </template>
          </UInput>
          <template #help>
            <span class="flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-coins" class="size-3.5" />{{ ta.creditos }}</span>
          </template>
        </UFormField>

        <div class="flex flex-wrap items-center justify-end gap-2">
          <UButton :label="ta.agoraNao" color="neutral" variant="ghost" size="sm" @click="emit('fechar')" />
          <UButton type="submit" :label="ta.ativar" icon="i-lucide-sparkles" size="sm" :loading="conferindo" />
        </div>
      </form>

      <!-- MEMBRO: não instala; pede a quem administra -->
      <div v-else key="membro" class="flex flex-col gap-3 p-4">
        <div class="flex items-start gap-3">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-elevated ring-1 ring-default">
            <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-highlighted">{{ ta.membroTitulo }}</p>
            <p class="text-sm text-muted">{{ ta.membroTexto }}</p>
            <p class="mt-1.5 flex items-center gap-1.5 text-xs text-dimmed"><UIcon name="i-lucide-shield-check" class="size-3.5" />{{ ta.quemAdministra(administradores) }}</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-2">
          <UButton :label="ta.fechar" color="neutral" variant="ghost" size="sm" @click="emit('fechar')" />
          <UButton
            :label="pedido ? ta.pedidoFeito : ta.pedir"
            :icon="pedido ? 'i-lucide-check' : 'i-lucide-bell-ring'"
            size="sm"
            :disabled="pedido"
            @click="pedirAtivacao"
          />
        </div>
      </div>
    </Transition>

    <!-- RODAPÉ -->
    <div v-if="!pronto" class="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-default bg-elevated/50 px-4 py-2 text-xs text-muted">
      <span v-if="papel === 'admin'" class="flex items-center gap-1.5"><UIcon name="i-lucide-settings" class="size-3.5" />{{ ta.ondeMuda }}</span>
      <span class="flex items-center gap-1.5"><UIcon name="i-lucide-lock" class="size-3.5" />{{ ta.privacidade }}</span>
      <span v-if="papel === 'admin'" class="ms-auto flex items-center gap-1 text-dimmed"><UIcon name="i-lucide-flask-conical" class="size-3.5" />{{ ta.simulacao }}</span>
    </div>
  </div>
</template>
