<script setup lang="ts">
/**
 * Configurações > Sistema > Módulos.
 *
 * Cópia da prévia: as abas do Sistema e a lista de módulos com a chave de cada um. PROPOSTA (M16): desligar o módulo de
 * assinaturas com envelope aguardando assinatura avisa antes quantos são e o que acontece com eles. Ligar continua
 * direto, e a 1ª credencial liga o módulo sozinha.
 */
import { aberto } from './estado'
import { estado } from './estado'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, avisoAberto?: boolean }>()
const s = computed(() => props.t.sistema)
const toast = useToast()

const aba = ref(1)
const pendentes = computed(() => estado.envelopes.filter(aberto).length)
const aviso = ref(!!props.avisoAberto)

const modulos = computed(() => [
  { chave: 'correcao', nome: s.value.correcao, ligado: true },
  { chave: 'comparacoes', nome: s.value.comparacoes, ligado: false },
  { chave: 'juridico', nome: s.value.juridico, ligado: false },
])

function trocar(v: boolean) {
  if (v) { estado.moduloLigado = true; return }
  if (pendentes.value) aviso.value = true
  else estado.moduloLigado = false
}
function desligar() {
  estado.moduloLigado = false
  aviso.value = false
  toast.add({ title: s.value.salvo, icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto max-w-4xl space-y-5 px-6 py-5">
      <h1 class="text-xl font-semibold text-highlighted">{{ s.titulo }}</h1>
      <UTabs v-model="aba" :items="s.abas.map((label, i) => ({ label, value: i }))" :content="false" variant="link" size="sm" />

      <section class="rounded-lg border border-default bg-default">
        <h2 class="border-b border-default px-4 py-3 font-semibold text-highlighted">{{ s.modulos }}</h2>
        <ul class="divide-y divide-default">
          <li class="flex items-center justify-between gap-3 px-4 py-3">
            <span class="flex items-center gap-2 text-sm font-medium text-highlighted"><UIcon name="i-lucide-signature" class="size-4 text-muted" />{{ s.assinatura }}</span>
            <USwitch :model-value="estado.moduloLigado" :aria-label="s.assinatura" @update:model-value="trocar" />
          </li>
          <li v-for="m in modulos" :key="m.chave" class="flex items-center justify-between gap-3 px-4 py-3 opacity-70">
            <span class="text-sm text-toned">{{ m.nome }}</span>
            <USwitch :model-value="m.ligado" disabled :aria-label="m.nome" />
          </li>
        </ul>
      </section>
    </div>

    <UModal v-model:open="aviso" :title="s.desligar.titulo">
      <template #body>
        <UAlert color="warning" variant="subtle" icon="i-lucide-triangle-alert" :description="s.desligar.texto(pendentes)" />
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="s.desligar.manter" color="neutral" variant="ghost" @click="aviso = false" />
          <UButton :label="s.desligar.confirmar" color="error" @click="desligar" />
        </div>
      </template>
    </UModal>
  </div>
</template>
