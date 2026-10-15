<script setup lang="ts">
/**
 * ANDAIME DE PROTÓTIPO, não é tela do ENSPACE.
 *
 * O que acontece fora do produto e faz parte da jornada do denunciante:
 *  - o cartaz da intranet, com QR code e o link do canal;
 *  - a caixa de e-mail pessoal, com o aviso que o nó "Responder ao
 *    denunciante" manda: sem o texto, sem o protocolo e sem a senha.
 */
import type { Textos } from './textos'
import { linkDoFormulario, workspace } from './mocks'
import { useFormularioAnonimo } from './estado'
import QrCode from './_QrCode.vue'

defineProps<{ t: Textos }>()

const { cena, formularioDoCanal, passoPublico, sessaoDoDenunciante, ir } = useFormularioAnonimo()

function abrirCanal() {
  passoPublico.value = 'formulario'
  ir('publico')
}
function abrirAcompanhamento() {
  sessaoDoDenunciante.value = null
  ir('acompanhar')
}
</script>

<template>
  <div class="min-h-screen bg-muted pb-28">
    <p class="flex items-center justify-center gap-2 bg-warning/15 px-4 py-2 text-xs font-medium text-highlighted">
      <UIcon name="i-lucide-theater" class="size-4 text-warning" />{{ t.fora.aviso }}
    </p>

    <Transition
      mode="out-in"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- Cartaz na intranet -->
      <div v-if="cena === 'cartaz'" key="cartaz" class="mx-auto max-w-4xl px-4 pt-8">
        <div class="mb-4 flex items-center gap-2 text-sm text-toned"><UIcon name="i-lucide-building-2" class="size-4" />{{ t.fora.cartaz.intranet }}</div>
        <div class="grid overflow-hidden rounded-2xl border border-default bg-default shadow-lg md:grid-cols-[1fr_16rem]">
          <div class="flex flex-col justify-center gap-4 p-8">
            <span class="flex size-12 items-center justify-center rounded-full bg-primary/15"><UIcon name="i-lucide-megaphone" class="size-6 text-primary" /></span>
            <h1 class="text-3xl font-bold text-highlighted">{{ t.fora.cartaz.titulo }}</h1>
            <p class="max-w-md text-base text-toned">{{ t.fora.cartaz.texto }}</p>
            <p class="text-sm text-muted">{{ workspace.name }}</p>
          </div>
          <div class="flex flex-col items-center justify-center gap-3 bg-elevated/60 p-6">
            <QrCode :texto="formularioDoCanal.identification" :rotulo="t.formulario.anonimato.qrCode" class="size-40" />
            <p class="text-center text-xs text-toned">{{ t.fora.cartaz.acesse }}</p>
            <p class="break-all text-center font-mono text-[11px] text-highlighted">{{ linkDoFormulario(formularioDoCanal) }}</p>
            <UButton icon="i-lucide-external-link" :label="t.fora.cartaz.abrir" @click="abrirCanal" />
          </div>
        </div>
      </div>

      <!-- Caixa de e-mail pessoal -->
      <div v-else key="email" class="mx-auto max-w-3xl px-4 pt-8">
        <div class="mb-4 flex items-center gap-2 text-sm text-toned"><UIcon name="i-lucide-inbox" class="size-4" />{{ t.fora.email.caixa }}</div>
        <div class="overflow-hidden rounded-xl border border-default bg-default shadow-lg">
          <div class="flex items-center gap-3 border-b border-default px-5 py-3">
            <UAvatar icon="i-lucide-shield" size="md" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-highlighted">{{ t.fora.email.de }}</p>
              <p class="truncate text-sm text-highlighted">{{ t.fora.email.assunto }}</p>
            </div>
            <span class="text-xs text-toned">{{ t.fora.email.agora }}</span>
          </div>
          <div class="flex flex-col gap-4 px-5 py-6">
            <p class="text-sm text-highlighted">{{ t.fora.email.corpo }}</p>
            <UButton icon="i-lucide-inbox" :label="t.fora.email.link" class="self-start" @click="abrirAcompanhamento" />
            <p class="flex items-center gap-2 rounded-md bg-elevated/60 p-2.5 text-xs text-toned">
              <UIcon name="i-lucide-lock-keyhole" class="size-3.5 shrink-0" />{{ t.fora.email.semConteudo }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
