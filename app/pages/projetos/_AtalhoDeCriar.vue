<script setup lang="ts">
/**
 * PROPOSTA (rodada 11): o atalho de criar no pé de um seletor, no slot `content-bottom` do USelectMenu,
 * como o "Create new issue" no fim dos menus do GitHub. Regra do protótipo inteiro: todo seletor que
 * escolhe uma coisa que a pessoa pode criar (tarefa, marco, projeto, etiqueta, categoria) tem o atalho.
 *
 * Com texto na busca, o botão cria com esse nome. Sem texto, leva o foco para a busca e mostra a dica.
 * Com `destinos` (o projeto do marco, quando a pessoa administra mais de 1), mostra 1 botão por destino.
 */
const props = defineProps<{
  termo: string
  rotulo: string
  com: (termo: string, destino?: string) => string
  dica: string
  destinos?: { value: number, label: string }[]
}>()
const emit = defineEmits<{ criar: [termo: string, destino?: number] }>()

const raiz = ref<HTMLElement>()
const pedindo = ref(false)
const limpo = computed(() => props.termo.trim())
watch(limpo, (v) => { if (v) pedindo.value = false })

function focar() {
  pedindo.value = true
  const conteudo = raiz.value?.closest('[data-slot="content"]')
  ;(conteudo?.querySelector('input') as HTMLInputElement | null)?.focus()
}
</script>

<template>
  <div ref="raiz" class="border-t border-default p-1">
    <template v-if="limpo && destinos && destinos.length > 1">
      <UButton
        v-for="d in destinos"
        :key="d.value"
        :label="com(limpo, d.label)"
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        block
        class="justify-start"
        :ui="{ label: 'truncate' }"
        @click="emit('criar', limpo, d.value)"
      />
    </template>
    <UButton
      v-else
      :label="limpo ? com(limpo) : rotulo"
      icon="i-lucide-plus"
      color="neutral"
      variant="ghost"
      size="sm"
      block
      class="justify-start"
      :ui="{ label: 'truncate' }"
      @click="limpo ? emit('criar', limpo, destinos?.[0]?.value) : focar()"
    />
    <p v-if="pedindo" class="px-2.5 pb-1 text-xs text-muted">
      {{ dica }}
    </p>
  </div>
</template>
