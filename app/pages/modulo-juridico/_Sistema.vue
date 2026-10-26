<script setup lang="ts">
/**
 * Configurações › Sistema, o cartão Módulos.
 *
 * Hoje (cópia do develop, 26/10/2026, workspace de exploração): o título "Configurações Gerais", as abas, e o cartão
 * Módulos com 3 interruptores em 2 colunas (Correção Monetária, Comparações e Jurídico), sem texto de ajuda, e o
 * botão Salvar do cartão. Ligar o Jurídico e salvar não muda nada na tela (BRIEFING.md, "O que o develop faz hoje").
 *
 * PROPOSTA:
 * - uma linha de ajuda em cada módulo, que diz o que ele muda;
 * - com o Jurídico salvo como ligado, o botão Configurar, que abre a página do módulo.
 */
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, moduloLigado: boolean }>()
const emit = defineEmits<{ 'update:moduloLigado': [boolean], configurar: [] }>()
const toast = useToast()

const rascunho = ref({ correcao: true, comparacoes: false, juridico: props.moduloLigado })
watch(() => props.moduloLigado, (v) => { rascunho.value.juridico = v })

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  const mudou = rascunho.value.juridico !== props.moduloLigado
  emit('update:moduloLigado', rascunho.value.juridico)
  if (mudou) {
    const m = rascunho.value.juridico ? props.t.sistema.ligado : props.t.sistema.desligado
    toast.add({ title: m.titulo, description: m.desc, icon: rascunho.value.juridico ? 'i-lucide-scale' : 'i-lucide-power-off', color: rascunho.value.juridico ? 'success' : 'neutral' })
  }
}

const modulos = computed(() => [
  { chave: 'correcao' as const, ...props.t.sistema.modulos.correcao },
  { chave: 'comparacoes' as const, ...props.t.sistema.modulos.comparacoes },
  { chave: 'juridico' as const, ...props.t.sistema.modulos.juridico },
])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 p-5">
      <h1 class="text-lg font-semibold text-highlighted">{{ t.sistema.titulo }}</h1>
      <UTabs
        :items="Object.values(t.sistema.abas).map((label, i) => ({ label, value: String(i) }))"
        default-value="0"
        :content="false"
        variant="link"
        size="sm"
        class="border-b border-default"
      />

      <p class="flex items-center gap-1.5 text-xs text-dimmed">
        <UIcon name="i-lucide-construction" class="size-3.5" />{{ t.sistema.foraDoCartao }}
      </p>

      <!-- O cartão Módulos -->
      <section class="rounded-lg border border-default bg-default p-4">
        <h2 class="mb-4 text-lg font-semibold text-highlighted">{{ t.sistema.cartao }}</h2>
        <div class="grid gap-x-10 gap-y-6 md:grid-cols-2">
          <div v-for="m in modulos" :key="m.chave" class="flex flex-col gap-1.5">
            <p class="text-sm font-medium text-highlighted">{{ m.nome }}</p>
            <!-- PROPOSTA: a ajuda -->
            <p class="text-xs text-muted">{{ m.ajuda }}</p>
            <div class="flex items-center gap-3">
              <USwitch v-model="rascunho[m.chave]" :aria-label="m.nome" />
              <!-- PROPOSTA: o caminho para a configuração -->
              <Transition enter-active-class="transition-[opacity,transform] duration-200" enter-from-class="opacity-0 -translate-x-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
                <UButton
                  v-if="m.chave === 'juridico' && moduloLigado"
                  :label="t.sistema.configurar"
                  icon="i-lucide-settings-2"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  @click="emit('configurar')"
                />
              </Transition>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <UButton :label="t.geral.salvar" :loading="salvando" @click="salvar" />
        </div>
      </section>
    </div>
  </div>
</template>
