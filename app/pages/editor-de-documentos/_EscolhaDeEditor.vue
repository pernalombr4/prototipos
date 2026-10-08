<script setup lang="ts">
/**
 * PROPOSTA: a pergunta "onde abrir", feita UMA vez.
 *
 * Aparece no primeiro Abrir de quem ainda não escolheu (e quando o
 * configurador deixou "Perguntar na primeira vez"). Com "Lembrar minha
 * escolha", o botão Abrir do campo passa a dizer o editor ("Abrir no Word") e
 * a seta ao lado troca quando a pessoa quiser. É o padrão "Abrir no navegador
 * / Abrir no aplicativo" de Box, Dropbox e Teams (PESQUISA.md), guardado por
 * pessoa e por campo.
 *
 * URadioGroup na variante card, consultado no MCP `nuxt-ui` (get-component,
 * seção usage) e conferido em `.nuxt/ui/radio-group.ts`.
 */
import type { RadioGroupItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { Editor } from './mocks'
import { useDocumentos } from './estado'

const props = defineProps<{ t: Textos }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ escolher: [editor: Editor, lembrar: boolean] }>()

const { config, editoresLigados } = useDocumentos()

const familia = ref<'onlyoffice' | 'word'>('onlyoffice')
const qualWord = ref<'word-desktop' | 'word-web'>('word-desktop')
const lembrar = ref(true)

watch(aberto, (v) => {
  if (v) familia.value = config.value.padrao === 'word' ? 'word' : 'onlyoffice'
})

const itens = computed<RadioGroupItem[]>(() => (['onlyoffice', 'word'] as const)
  .filter(f => (f === 'onlyoffice' ? config.value.onlyoffice : config.value.word))
  .map(f => ({
    value: f,
    label: props.t.escolha.nomes[f],
    description: props.t.escolha.detalhes[f],
  })))

const itensDoWord = computed<RadioGroupItem[]>(() => [
  { value: 'word-desktop', label: props.t.campo.descricaoDoEditor['word-desktop'], description: props.t.escolha.wordDesktopAjuda },
  { value: 'word-web', label: props.t.campo.descricaoDoEditor['word-web'], description: props.t.escolha.wordWebAjuda },
])

const temWordWeb = computed(() => editoresLigados.value.includes('word-web'))

function continuar() {
  const e: Editor = familia.value === 'onlyoffice' ? 'onlyoffice' : (temWordWeb.value ? qualWord.value : 'word-desktop')
  aberto.value = false
  emit('escolher', e, lembrar.value)
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.escolha.titulo"
    :description="t.escolha.descricao"
    :ui="{ content: 'max-w-lg', footer: 'justify-between' }"
  >
    <template #body>
      <URadioGroup
        v-model="familia"
        :items="itens"
        variant="card"
        :ui="{ fieldset: 'gap-2', label: 'font-medium' }"
      >
        <template #label="{ item }">
          <span class="flex items-center gap-2">
            <UIcon :name="(item as RadioGroupItem & { value: string }).value === 'word' ? 'i-lucide-monitor' : 'i-lucide-file-pen-line'" class="size-4 text-primary" />
            {{ (item as RadioGroupItem).label }}
          </span>
        </template>
        <template #description="{ item }">
          <span class="block">{{ (item as RadioGroupItem).description }}</span>
          <span class="mt-1 block text-xs text-dimmed">
            {{ t.escolha.recomendadoPara[(item as RadioGroupItem & { value: 'onlyoffice' | 'word' }).value] }}
          </span>
        </template>
      </URadioGroup>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="familia === 'word' && temWordWeb" class="mt-4">
          <p class="mb-2 text-xs font-medium text-muted">
            {{ t.escolha.ondeAbrirWord }}
          </p>
          <URadioGroup v-model="qualWord" :items="itensDoWord" size="sm" />
        </div>
      </Transition>
    </template>

    <template #footer>
      <UCheckbox v-model="lembrar" :label="t.escolha.lembrar" :description="t.escolha.lembrarAjuda" size="sm" />
      <UButton :label="t.escolha.continuar" trailing-icon="i-lucide-arrow-right" @click="continuar" />
    </template>
  </UModal>
</template>
