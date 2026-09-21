<script setup lang="ts">
import { marked } from 'marked'

/**
 * Andaime de protótipo — não é produto.
 *
 * Traz o briefing, a pesquisa e as decisões para dentro do site, para que o
 * protótipo se defenda sozinho quando for mostrado a outra pessoa, em vez de
 * depender de alguém abrir o repositório.
 *
 * O conteúdo vem dos próprios .md da pasta do protótipo, importados como texto
 * pelo Vite (`?raw`). Não há fonte duplicada: editar o .md muda o painel.
 */
const props = defineProps<{
  briefing: string
  pesquisa: string
  decisoes: string
  /** Link para a pasta do protótipo no GitHub. Opcional. */
  repositorio?: string
}>()

const aberto = ref(false)
const documento = ref('briefing')

const documentos = [
  { value: 'briefing', label: 'O problema', icon: 'i-lucide-search' },
  { value: 'pesquisa', label: 'As referências', icon: 'i-lucide-library' },
  { value: 'decisoes', label: 'As decisões', icon: 'i-lucide-git-branch' },
]

const conteudo = computed(() => {
  const bruto = documento.value === 'briefing'
    ? props.briefing
    : documento.value === 'pesquisa'
      ? props.pesquisa
      : props.decisoes
  return marked.parse(bruto, { async: false }) as string
})

function abrirEm(doc: string) {
  documento.value = doc
  aberto.value = true
}

defineExpose({ abrirEm })
</script>

<template>
  <span>
    <UButton
      v-for="doc in documentos"
      :key="doc.value"
      :label="doc.label"
      :icon="doc.icon"
      size="xs"
      color="neutral"
      variant="subtle"
      class="transition-transform hover:-translate-y-0.5"
      @click="abrirEm(doc.value)"
    />

    <USlideover
      v-model:open="aberto"
      title="Por trás deste protótipo"
      description="O problema observado, as referências pesquisadas e as decisões de desenho."
      :ui="{ content: 'max-w-3xl' }"
    >
      <template #body>
        <UTabs
          v-model="documento"
          :items="documentos"
          :content="false"
          color="neutral"
          variant="link"
          size="sm"
          class="mb-6"
        />

        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <!-- Conteúdo dos .md do próprio repositório, escrito por nós. -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div :key="documento" class="markdown" v-html="conteudo" />
        </Transition>

        <div v-if="repositorio" class="mt-10 border-t border-default pt-5">
          <UButton
            :to="repositorio"
            target="_blank"
            label="Ver os arquivos no GitHub"
            icon="i-lucide-github"
            trailing-icon="i-lucide-external-link"
            color="neutral"
            variant="subtle"
            size="sm"
          />
        </div>
      </template>
    </USlideover>
  </span>
</template>
