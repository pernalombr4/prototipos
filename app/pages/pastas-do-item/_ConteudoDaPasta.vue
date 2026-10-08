<script setup lang="ts">
/**
 * O conteúdo de cada folder. NADA AQUI É PROPOSTA, com 1 exceção:
 * no estilo "hoje" a Visão Geral abre com a linha solta que a preview mostra
 * logo abaixo da barra; nos estilos propostos ela sai, porque a linha de base
 * da barra já separa a barra do conteúdo.
 *
 * Copiado da preview de 08/10/2026 (item de Contratos): campos da Visão Geral
 * na ordem do formulário, "Adicionar Arquivo" e a tabela Documentos em Anexos.
 * Comentários, Logs, Spaceflows e Notas são maquete simples, só para a troca
 * de folder mostrar conteúdo diferente.
 */
import type { Pasta } from './mocks'
import type { Textos } from './textos'
import type { Estilo } from './_BarraDePastas.vue'
import { anexos, campos, comentarios, item, logs } from './mocks'

const props = defineProps<{
  t: Textos
  pasta: Pasta
  estilo: Estilo
}>()

const valores = reactive({ ...item.data } as Record<string, string>)
const novoComentario = ref('')
const lista = ref([...comentarios])

function comentar() {
  if (!novoComentario.value.trim()) return
  lista.value.unshift({ autor: 'Mikaela Jardim', iniciais: 'MJ', quando: 'agora', texto: novoComentario.value.trim() })
  novoComentario.value = ''
}

const linhaSolta = computed(() => props.estilo === 'hoje' && props.pasta.tipo === 'campos')
</script>

<template>
  <div class="px-5 py-5">
    <!-- HOJE: a linha horizontal que abre a Visão Geral, sem ligação com a barra. -->
    <USeparator v-if="linhaSolta" class="mb-6 mt-1" />

    <!-- Visão Geral: os campos do formulário -->
    <div v-if="pasta.tipo === 'campos'" class="flex flex-col gap-5">
      <UFormField v-for="c in campos" :key="c.chave" :label="c.rotulo" :ui="{ label: 'font-semibold text-highlighted' }">
        <USelect
          v-if="c.tipo === 'relacao'"
          v-model="valores[c.chave]"
          :items="[valores[c.chave]!]"
          :placeholder="t.conteudo.porFavorSelecione"
          class="w-full"
        />
        <div v-else-if="c.tipo === 'moeda'" class="flex gap-1.5">
          <USelect v-model="valores[c.moeda]" :items="['BRL', 'USD', 'EUR']" class="w-1/3" />
          <UInput v-model="valores[c.chave]" class="flex-1" />
          <UButton v-if="c.chave === 'valor'" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" />
        </div>
        <UInput v-else v-model="valores[c.chave]" class="w-full" />
      </UFormField>
    </div>

    <!-- Comentários -->
    <div v-else-if="pasta.tipo === 'comentarios'" class="flex max-w-3xl flex-col gap-4">
      <div class="flex gap-2">
        <UTextarea v-model="novoComentario" :placeholder="t.conteudo.escrevaComentario" :rows="2" autoresize class="flex-1" />
        <UButton :label="t.conteudo.comentar" class="self-end" :disabled="!novoComentario.trim()" @click="comentar" />
      </div>
      <TransitionGroup
        tag="ul"
        class="flex flex-col gap-3"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
      >
        <li v-for="(c, i) in lista" :key="c.texto + i" class="flex gap-3 rounded-lg border border-default p-3">
          <UAvatar :text="c.iniciais" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="text-sm">
              <span class="font-semibold text-highlighted">{{ c.autor }}</span>
              <span class="ml-2 text-xs text-muted">{{ c.quando }}</span>
            </p>
            <p class="mt-1 text-sm text-default">{{ c.texto }}</p>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <!-- Logs de Auditoria -->
    <ul v-else-if="pasta.tipo === 'logs'" class="max-w-3xl divide-y divide-default rounded-lg border border-default">
      <li v-for="(l, i) in logs" :key="i" class="flex items-center gap-3 px-4 py-3 text-sm">
        <UIcon name="i-lucide-history" class="size-4 shrink-0 text-muted" />
        <span class="flex-1"><span class="font-medium text-highlighted">{{ l.quem }}</span> <span class="text-toned">{{ l.acao }}</span></span>
        <span class="shrink-0 text-xs text-muted">{{ l.quando }}</span>
      </li>
    </ul>

    <!-- Anexos -->
    <div v-else-if="pasta.tipo === 'anexos'" class="flex flex-col gap-3">
      <UButton :label="t.conteudo.adicionarArquivo" color="success" variant="soft" class="self-start" />
      <div class="rounded-lg border border-default">
        <div class="flex items-center gap-2 border-b border-default px-3 py-2.5">
          <span class="flex size-7 items-center justify-center rounded-md bg-info/15 text-info"><UIcon name="i-lucide-file" class="size-4" /></span>
          <span class="font-semibold text-highlighted">{{ t.conteudo.documentos }}</span>
        </div>
        <ul class="divide-y divide-default">
          <li v-for="a in anexos" :key="a.nome" class="flex items-center gap-3 px-4 py-3 text-sm">
            <UIcon name="i-lucide-file-text" class="size-4 text-muted" />
            <span class="flex-1 truncate text-default">{{ a.nome }}</span>
            <span class="text-xs text-muted">{{ a.tamanho }}</span>
            <span class="w-24 text-right text-xs text-muted">{{ a.quando }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Spaceflows, Notas e folders do cliente: estado vazio -->
    <UEmpty
      v-else
      :icon="pasta.tipo === 'spaceflows' ? 'i-lucide-workflow' : pasta.tipo === 'notas' ? 'i-lucide-notebook-text' : 'i-lucide-folder-open'"
      :title="pasta.tipo === 'spaceflows' ? t.conteudo.nenhumSpaceflow : pasta.tipo === 'notas' ? t.conteudo.nenhumaNota : t.conteudo.pastaVazia"
      :description="pasta.tipo === 'spaceflows' ? t.conteudo.nenhumSpaceflowDica : pasta.tipo === 'notas' ? undefined : t.conteudo.pastaVaziaDica"
      :actions="pasta.tipo === 'notas' ? [{ label: t.conteudo.novaNota, icon: 'i-lucide-plus', color: 'neutral', variant: 'outline' }] : undefined"
      variant="naked"
      class="py-16"
    />
  </div>
</template>
