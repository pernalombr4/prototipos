<script setup lang="ts">
/**
 * A conversa, igual no chat flutuante e na aba Testar (demanda 4).
 *
 * Mensagens com o UChatMessage do Nuxt UI. Cada ferramenta aparece:
 * - a que só lê, em 1 linha (UChatTool inline), com o nome em português;
 * - a que grava, envia ou cobra, no cartão de confirmação;
 * - a minuta, no bloco próprio.
 * Embaixo de cada resposta, o modelo que respondeu.
 */
import type { Textos } from './textos'
import type { Mensagem } from './conversa'
import AvatarDoAgente from './_AvatarDoAgente.vue'
import CartaoDeConfirmacao from './_CartaoDeConfirmacao.vue'
import Minuta from './_Minuta.vue'
import { modeloPorId, iconeDoProvedor } from './catalogo'

const props = withDefaults(defineProps<{
  t: Textos
  mensagens: Mensagem[]
  cor: string
  pensando?: boolean
  compact?: boolean
}>(), { pensando: false, compact: false })

const emit = defineEmits<{ resolvido: [estado: 'confirmado' | 'cancelado', sempre: boolean] }>()

const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Markdown mínimo: negrito e lista. */
function html(texto: string) {
  const linhas = escapar(texto).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').split('\n')
  let out = ''
  let lista = false
  for (const l of linhas) {
    if (l.startsWith('- ')) {
      if (!lista) { out += '<ul class="my-1.5 list-disc space-y-0.5 pl-5">'; lista = true }
      out += `<li>${l.slice(2)}</li>`
    }
    else {
      if (lista) { out += '</ul>'; lista = false }
      out += l ? `<p class="my-1">${l}</p>` : ''
    }
  }
  return lista ? `${out}</ul>` : out
}

const nomeDaFerramenta = (slug: string) => props.t.ferramentas.nomes[slug] ?? slug
const modelo = (id?: string) => id ? modeloPorId(id) : undefined
</script>

<template>
  <div class="space-y-4">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
    >
      <UChatMessage
        v-for="msg in mensagens"
        :id="msg.id"
        :key="msg.id"
        :role="msg.papel"
        :parts="[]"
        :side="msg.papel === 'user' ? 'right' : 'left'"
        :variant="msg.papel === 'user' ? 'soft' : 'naked'"
        :compact="compact"
        :ui="{ content: msg.papel === 'assistant' ? 'w-full' : '' }"
      >
        <template v-if="msg.papel === 'assistant'" #leading>
          <AvatarDoAgente :cor="cor" tamanho="sm" />
        </template>
        <template #content>
          <div class="text-sm">
            <template v-for="(p, i) in msg.partes" :key="i">
              <span v-if="p.tipo === 'anexo'" class="mb-1.5 inline-flex max-w-full items-center gap-1.5 rounded-md bg-default px-2 py-1 text-xs ring ring-default">
                <UIcon name="i-lucide-file-text" class="size-3.5 shrink-0 text-error" />
                <span class="truncate">{{ p.nome }}</span>
              </span>
              <!-- eslint-disable-next-line vue/no-v-html: texto escapado antes -->
              <div v-else-if="p.tipo === 'texto'" class="leading-relaxed" v-html="html(p.texto)" />
              <UChatTool
                v-else-if="p.tipo === 'leitura'"
                variant="inline"
                icon="i-lucide-eye"
                :text="nomeDaFerramenta(p.ferramenta)"
                :suffix="p.resumo"
                :ui="{ root: 'my-1', suffix: 'truncate' }"
              />
              <CartaoDeConfirmacao v-else-if="p.tipo === 'confirmacao'" :t="t" :parte="p" @resolvido="(e, s) => emit('resolvido', e, s)" />
              <Minuta v-else-if="p.tipo === 'minuta'" :t="t" :parte="p" />
            </template>
            <p v-if="msg.papel === 'assistant' && modelo(msg.modelo)" class="mt-1.5 flex items-center gap-1 text-[11px] text-dimmed">
              <UIcon :name="iconeDoProvedor[modelo(msg.modelo)!.provider]" class="size-3" />
              {{ modelo(msg.modelo)!.name }}
            </p>
          </div>
        </template>
      </UChatMessage>
    </TransitionGroup>

    <div v-if="pensando" class="flex items-center gap-2 pl-1">
      <AvatarDoAgente :cor="cor" tamanho="sm" estado="working" />
      <UChatShimmer :text="t.chat.pensando" class="text-sm" />
    </div>
  </div>
</template>
