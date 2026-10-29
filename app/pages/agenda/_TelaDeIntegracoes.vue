<script setup lang="ts">
/**
 * A tela de integrações do perfil, aberta pelo "Conectar Outlook" da Agenda (pedido da redatora em 29/10/2026): é ali
 * que o produto conecta o Outlook hoje. O botão abre a janela da Microsoft, a pessoa entra com a conta e autoriza.
 *
 * Copiado do develop (`_CascaDoPerfil.vue` e o miolo): o cabeçalho Integrações, a seção Outlook e os 2 cartões,
 * Calendário e Correio, com o logo, o título e a frase.
 *
 * O que é proposta:
 *  - "Voltar para a Agenda" no alto, quando a pessoa chega pela Agenda, e o aviso de sucesso com o mesmo botão;
 *  - o estado em palavras no cartão: "Não conectado", "Conectado como <conta>", a recusa da Microsoft. No develop, só
 *    um ponto verde e o botão desligado "Integrado";
 *  - antes do clique, o que o botão faz (abre a janela da Microsoft) e o que a Agenda ganha;
 *  - "Reconectar" e "Desconectar" com nome, no lugar do ícone de atualizar sem rótulo nem dica.
 *
 * A janela da Microsoft é simulada e não pede nenhum dado: "Simular autorização" ou "Simular recusa".
 */
import type { Textos } from './textos'
import { estado } from './estado'
import { EU } from './mocks'
import CascaDoPerfil from './_CascaDoPerfil.vue'

defineProps<{ t: Textos, origem: 'agenda' | 'item' }>()
const emit = defineEmits<{ voltar: [] }>()

type Situacao = 'desconectado' | 'aguardando' | 'conectado' | 'recusado'
const cartoes = reactive({
  calendario: estado.outlook === 'desconectado' ? 'desconectado' : 'conectado' as Situacao,
  correio: estado.outlook === 'desconectado' ? 'desconectado' : 'conectado' as Situacao,
})
const lista = [
  { chave: 'calendario', icone: 'i-lucide-calendar-days' },
  { chave: 'correio', icone: 'i-lucide-mail' },
] as const
type Chave = typeof lista[number]['chave']

const janela = ref<Chave | null>(null)
const sucesso = ref(false)

function conectar(c: Chave) {
  cartoes[c] = 'aguardando'
  janela.value = c
}
function responder(autorizou: boolean) {
  const c = janela.value!
  janela.value = null
  cartoes[c] = autorizou ? 'conectado' : 'recusado'
  if (!autorizou || c !== 'calendario') return
  estado.outlook = 'conectado'
  sucesso.value = true
}
function fecharJanela(aberta: boolean) {
  if (aberta || !janela.value) return
  cartoes[janela.value] = 'desconectado'
  janela.value = null
}
function desconectar(c: Chave) {
  cartoes[c] = 'desconectado'
  if (c === 'calendario') {
    estado.outlook = 'desconectado'
    sucesso.value = false
  }
}
</script>

<template>
  <CascaDoPerfil :t="t" @voltar="emit('voltar')">
    <!-- Proposta: a volta para onde a pessoa estava -->
    <UButton :label="origem === 'item' ? t.integracoes.voltarAoItem : t.integracoes.voltar" icon="i-lucide-arrow-left" color="neutral" variant="outline" size="sm" class="-mt-6 mb-6" @click="emit('voltar')" />

    <!-- Cabeçalho (cópia) -->
    <div class="mx-auto flex w-fit items-center gap-4">
      <span class="flex size-16 items-center justify-center rounded-xl bg-info text-inverted shadow-lg shadow-info/30">
        <UIcon name="i-lucide-hexagon" class="size-8" />
      </span>
      <div>
        <h1 class="text-2xl font-bold text-highlighted">{{ t.integracoes.titulo }}</h1>
        <p class="text-xs text-muted">{{ t.integracoes.subtitulo }}</p>
      </div>
    </div>

    <UAlert
      v-if="sucesso"
      class="mt-8 animate-[entrada_.25s_ease-out_both]"
      color="success"
      variant="subtle"
      icon="i-lucide-calendar-check"
      :title="t.integracoes.sucessoTitulo"
      :description="t.integracoes.sucessoTexto"
      :actions="[{ label: origem === 'item' ? t.integracoes.voltarAoItem : t.integracoes.voltar, color: 'success', variant: 'solid', size: 'xs', onClick: () => emit('voltar') }]"
    />

    <!-- Seção Outlook (cópia do quadro e dos cartões; o estado e as ações são proposta) -->
    <section class="mt-8 rounded-lg border border-default p-6">
      <h2 class="flex items-center gap-2 text-lg font-medium text-highlighted">
        <span class="flex size-8 items-center justify-center rounded-md border border-default"><UIcon name="i-lucide-notebook-text" class="size-4" /></span>
        {{ t.integracoes.outlook }}
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="c in lista"
          :key="c.chave"
          class="flex flex-col rounded-lg border-2 p-2.5 transition-colors"
          :class="cartoes[c.chave] === 'conectado' ? 'border-info/60' : 'border-default'"
          :aria-label="t.integracoes.cartoes[c.chave].titulo"
        >
          <span class="mb-1 size-2 rounded-full" :class="cartoes[c.chave] === 'conectado' ? 'bg-success' : 'bg-transparent'" />
          <div class="flex h-24 items-center justify-center gap-1.5 rounded-md bg-elevated text-info">
            <UIcon name="i-simple-icons-microsoftoutlook" class="size-11" />
            <UIcon :name="c.icone" class="size-7" />
          </div>
          <p class="mt-4 font-semibold text-info">
            {{ t.integracoes.cartoes[c.chave].titulo }} <span class="text-success">Outlook</span>
          </p>
          <p class="mt-2 text-xs text-toned">{{ t.integracoes.cartoes[c.chave].texto }}</p>

          <!-- Proposta: o estado em palavras e o que o botão faz -->
          <p class="mt-3 flex items-start gap-1.5 text-xs" :class="cartoes[c.chave] === 'recusado' ? 'text-warning' : cartoes[c.chave] === 'conectado' ? 'text-success' : 'text-muted'">
            <UIcon :name="cartoes[c.chave] === 'recusado' ? 'i-lucide-shield-alert' : cartoes[c.chave] === 'conectado' ? 'i-lucide-circle-check' : 'i-lucide-circle-dashed'" class="mt-0.5 size-3.5 shrink-0" />
            <span>{{ cartoes[c.chave] === 'conectado' ? t.integracoes.conectadoComo(EU.email!) : cartoes[c.chave] === 'recusado' ? t.integracoes.recusado : t.integracoes.naoConectado }}</span>
          </p>
          <p v-if="cartoes[c.chave] !== 'conectado' && t.integracoes.cartoes[c.chave].ganho" class="mt-1 text-xs text-muted">{{ t.integracoes.cartoes[c.chave].ganho }}</p>

          <div class="mt-auto flex gap-2 pt-4">
            <template v-if="cartoes[c.chave] === 'conectado'">
              <UButton :label="t.integracoes.reconectar" icon="i-lucide-refresh-cw" color="neutral" variant="outline" size="sm" class="flex-1 justify-center" @click="conectar(c.chave)" />
              <UButton :label="t.integracoes.desconectar" icon="i-lucide-unplug" color="neutral" variant="ghost" size="sm" @click="desconectar(c.chave)" />
            </template>
            <UButton
              v-else
              :label="cartoes[c.chave] === 'aguardando' ? t.integracoes.aguardando : cartoes[c.chave] === 'recusado' ? t.integracoes.tentar : t.integracoes.conectar"
              icon="i-simple-icons-microsoftoutlook"
              :loading="cartoes[c.chave] === 'aguardando'"
              size="sm"
              block
              @click="conectar(c.chave)"
            />
          </div>
          <p v-if="cartoes[c.chave] === 'desconectado'" class="mt-2 text-[11px] text-muted">{{ t.integracoes.abreJanela }}</p>
        </article>
      </div>
    </section>

    <!-- A janela da Microsoft, simulada: o protótipo não pede nenhum dado -->
    <UModal :open="!!janela" :title="t.integracoes.janela.titulo" :ui="{ content: 'max-w-sm border-2 border-dashed border-accented' }" @update:open="fecharJanela">
      <template #body>
        <div class="flex flex-col items-center gap-3 text-center">
          <UIcon name="i-simple-icons-microsoftoutlook" class="size-10 text-info" />
          <p class="text-sm text-toned">{{ t.integracoes.janela.texto }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.integracoes.janela.recusar" color="neutral" variant="ghost" size="sm" @click="responder(false)" />
          <UButton :label="t.integracoes.janela.autorizar" icon="i-lucide-check" size="sm" @click="responder(true)" />
        </div>
      </template>
    </UModal>
  </CascaDoPerfil>
</template>
