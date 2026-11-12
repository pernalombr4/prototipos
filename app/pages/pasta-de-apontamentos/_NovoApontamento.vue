<script setup lang="ts">
/**
 * Criar um apontamento, no topo da lista. Proposta.
 *
 * O corpo começa vazio, só com a dica "Descreva..." (rodada 4: sem modelo).
 * Print e arquivo entram como anexo; link não existe mais (rodada 4). Os campos
 * Responsáveis (seleção múltipla) e Prioridade levam rótulo. Sem rascunho:
 * o apontamento nasce aberto e cada responsável recebe a notificação na hora.
 */
import type { Anexo } from './mocks'
import type { Lista, NovoApontamento } from './lista'
import type { Textos } from './textos'
import CampoRico from './_CampoRico.vue'
import { iconeDaPrioridade } from './lista'

const props = defineProps<{
  t: Textos
  lista: Lista
}>()

const emit = defineEmits<{
  criar: [n: NovoApontamento]
  cancelar: []
}>()

const titulo = ref('')
const corpo = ref('')
const responsaveis = ref<number[]>([props.lista.config.responsavelPadrao])
const prioridade = ref<NovoApontamento['prioridade']>('normal')
const anexos = ref<Anexo[]>([])
const erro = ref(false)
const salvando = ref(false)

const opcoesDePessoa = computed(() => props.lista.pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais, alt: p.nome } })))
const opcoesDePrioridade = computed(() => (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ label: props.t.prioridades[p], value: p, icon: iconeDaPrioridade[p] })))

const entradaDeArquivo = ref<HTMLInputElement | null>(null)
function anexar(e: Event) {
  const arquivos = (e.target as HTMLInputElement).files
  if (!arquivos) return
  for (const f of Array.from(arquivos)) {
    const imagem = f.type.startsWith('image/')
    anexos.value.push({
      id: `novo-${Date.now()}-${f.name}`,
      tipo: imagem ? 'imagem' : 'arquivo',
      nome: f.name,
      url: imagem ? URL.createObjectURL(f) : undefined,
      tamanho: `${Math.max(1, Math.round(f.size / 1024))} KB`,
    })
  }
  ;(e.target as HTMLInputElement).value = ''
}

async function salvar() {
  if (!titulo.value.trim()) {
    erro.value = true
    return
  }
  salvando.value = true
  await new Promise(r => setTimeout(r, 350))
  emit('criar', { titulo: titulo.value.trim(), corpo: corpo.value, responsaveis: responsaveis.value, prioridade: prioridade.value, anexos: anexos.value })
  salvando.value = false
}
</script>

<template>
  <form class="flex flex-col gap-3 border-b border-default bg-elevated/40 px-4 py-4" @submit.prevent="salvar()">
    <UFormField :error="erro ? t.novo.tituloObrigatorio : undefined">
      <UInput
        v-model="titulo"
        :placeholder="t.novo.titulo"
        size="lg"
        class="w-full"
        autofocus
        :aria-label="t.novo.titulo"
        @update:model-value="erro = false"
      />
    </UFormField>

    <CampoRico v-model="corpo" :placeholder="t.novo.corpo" />

    <!-- Anexos já escolhidos -->
    <TransitionGroup v-if="anexos.length" tag="ul" class="flex flex-wrap gap-2" enter-active-class="transition duration-150" enter-from-class="opacity-0 scale-95">
      <li v-for="x in anexos" :key="x.id" class="flex items-center gap-1.5 rounded-md border border-default bg-default py-1 pl-1 pr-1.5 text-xs">
        <img v-if="x.tipo === 'imagem'" :src="x.url" alt="" class="size-7 rounded object-cover">
        <UIcon v-else name="i-lucide-file" class="ml-1 size-4 text-muted" />
        <span class="max-w-44 truncate text-highlighted">{{ x.nome }}</span>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.novo.remover(x.nome)" @click="anexos = anexos.filter(y => y.id !== x.id)" />
      </li>
    </TransitionGroup>

    <div class="flex flex-wrap items-end gap-3">
      <UFormField :label="t.apontamento.responsaveis" size="sm" class="min-w-56 flex-1 sm:max-w-80">
        <USelectMenu
          v-model="responsaveis"
          :items="opcoesDePessoa"
          value-key="value"
          multiple
          :search-input="{ placeholder: t.apontamento.buscarPessoa }"
          :placeholder="t.apontamento.semResponsavel"
          size="sm"
          icon="i-lucide-users"
          class="w-full"
        />
      </UFormField>
      <UFormField :label="t.apontamento.prioridade" size="sm" class="w-36">
        <USelect
          v-model="prioridade"
          :items="opcoesDePrioridade"
          size="sm"
          class="w-full"
          :icon="iconeDaPrioridade[prioridade]"
        />
      </UFormField>
      <input ref="entradaDeArquivo" type="file" multiple class="sr-only" :aria-label="t.novo.anexar" @change="anexar">
      <UButton :label="t.novo.anexar" icon="i-lucide-paperclip" color="neutral" variant="outline" size="sm" class="sm:ml-auto" @click="entradaDeArquivo?.click()" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-info" class="size-3.5 shrink-0" />{{ t.novo.dicaDireto }}
      </p>
      <div class="flex gap-2">
        <UButton :label="t.novo.cancelar" color="neutral" variant="ghost" size="sm" @click="emit('cancelar')" />
        <UButton type="submit" :label="t.novo.adicionar" icon="i-lucide-plus" size="sm" :loading="salvando" />
      </div>
    </div>
  </form>
</template>
