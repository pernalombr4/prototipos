<script setup lang="ts">
/**
 * Criar um apontamento, no topo da lista. Proposta.
 *
 * O corpo já vem com o modelo da pasta (Onde, Problema, Correção sugerida, ou
 * Cláusula, Como está, Como deve ficar). Print, arquivo e link entram como
 * anexo. Quem confere salva em rascunho e envia todos de uma vez no "Enviar
 * retorno"; quem resolve adiciona direto.
 */
import type { Anexo } from './mocks'
import type { Lista, NovoApontamento } from './lista'
import type { Textos } from './textos'
import CampoRico from './_CampoRico.vue'
import { iconeDaPrioridade } from './lista'

const props = defineProps<{
  t: Textos
  lista: Lista
  /** Quem confere: o padrão é rascunho. */
  conferente: boolean
}>()

const emit = defineEmits<{
  criar: [n: NovoApontamento, rascunho: boolean]
  cancelar: []
}>()

const titulo = ref('')
const corpo = ref(props.lista.config.modelo)
const responsavel = ref(props.lista.config.responsavelPadrao)
const prioridade = ref<NovoApontamento['prioridade']>('normal')
const anexos = ref<Anexo[]>([])
const erro = ref(false)
const salvando = ref<'rascunho' | 'direto' | null>(null)

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

const linkAberto = ref(false)
const link = ref('')
function adicionarLink() {
  const url = link.value.trim()
  if (!url) return
  anexos.value.push({ id: `link-${Date.now()}`, tipo: 'link', nome: url.replace(/^https?:\/\//, ''), url })
  link.value = ''
  linkAberto.value = false
}

async function salvar(rascunho: boolean) {
  if (!titulo.value.trim()) {
    erro.value = true
    return
  }
  salvando.value = rascunho ? 'rascunho' : 'direto'
  await new Promise(r => setTimeout(r, 350))
  emit('criar', { titulo: titulo.value.trim(), corpo: corpo.value, responsavel: responsavel.value, prioridade: prioridade.value, anexos: anexos.value }, rascunho)
  salvando.value = null
}
</script>

<template>
  <form class="flex flex-col gap-3 border-b border-default bg-elevated/40 px-4 py-4" @submit.prevent="salvar(conferente)">
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

    <CampoRico v-model="corpo" />

    <!-- Anexos já escolhidos -->
    <TransitionGroup v-if="anexos.length" tag="ul" class="flex flex-wrap gap-2" enter-active-class="transition duration-150" enter-from-class="opacity-0 scale-95">
      <li v-for="x in anexos" :key="x.id" class="flex items-center gap-1.5 rounded-md border border-default bg-default py-1 pl-1 pr-1.5 text-xs">
        <img v-if="x.tipo === 'imagem'" :src="x.url" alt="" class="size-7 rounded object-cover">
        <UIcon v-else :name="x.tipo === 'link' ? 'i-lucide-video' : 'i-lucide-file'" class="ml-1 size-4 text-muted" />
        <span class="max-w-44 truncate text-highlighted">{{ x.nome }}</span>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.novo.remover(x.nome)" @click="anexos = anexos.filter(y => y.id !== x.id)" />
      </li>
    </TransitionGroup>

    <div class="flex flex-wrap items-center gap-2">
      <input ref="entradaDeArquivo" type="file" multiple class="sr-only" :aria-label="t.novo.anexar" @change="anexar">
      <UButton :label="t.novo.anexar" icon="i-lucide-paperclip" color="neutral" variant="outline" size="sm" @click="entradaDeArquivo?.click()" />
      <UPopover v-model:open="linkAberto">
        <UButton :label="t.novo.link" icon="i-lucide-link" color="neutral" variant="outline" size="sm" />
        <template #content>
          <form class="flex w-80 gap-2 p-2" @submit.prevent.stop="adicionarLink">
            <UInput v-model="link" :placeholder="t.novo.linkPlaceholder" size="sm" class="flex-1" autofocus />
            <UButton type="submit" :label="t.novo.adicionarLink" size="sm" />
          </form>
        </template>
      </UPopover>

      <span class="mx-1 hidden h-5 w-px bg-accented sm:block" aria-hidden="true" />

      <USelectMenu
        v-model="responsavel"
        :items="opcoesDePessoa"
        value-key="value"
        :search-input="false"
        size="sm"
        class="w-44"
        :avatar="opcoesDePessoa.find(o => o.value === responsavel)?.avatar"
        :aria-label="t.apontamento.responsavel"
      />
      <USelect
        v-model="prioridade"
        :items="opcoesDePrioridade"
        size="sm"
        class="w-32"
        :icon="iconeDaPrioridade[prioridade]"
        :aria-label="t.apontamento.prioridade"
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-info" class="size-3.5 shrink-0" />{{ conferente ? t.novo.dicaRascunho : t.novo.dicaDireto }}
      </p>
      <div class="flex gap-2">
        <UButton :label="t.novo.cancelar" color="neutral" variant="ghost" size="sm" @click="emit('cancelar')" />
        <template v-if="conferente">
          <UButton :label="t.novo.adicionar" color="neutral" variant="outline" size="sm" :loading="salvando === 'direto'" @click="salvar(false)" />
          <UButton type="submit" :label="t.novo.salvarRascunho" icon="i-lucide-pencil-line" size="sm" :loading="salvando === 'rascunho'" />
        </template>
        <UButton v-else type="submit" :label="t.novo.adicionar" icon="i-lucide-plus" size="sm" :loading="salvando === 'direto'" />
      </div>
    </div>
  </form>
</template>
