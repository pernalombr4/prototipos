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
 * - rodada 3: com o Jurídico ligado, a lista de submódulos, ligados um a um. Hoje só Capturas; o próximo entra
 *   como mais uma linha. Sem submódulo ligado, o menu Jurídico não aparece.
 * - rodada 4: ligar Capturas pede a categoria que guarda os processos e a ligação dos campos (`_LigarCapturas.vue`).
 */
import type { Textos } from './textos'
import { textosCapturas } from './textos-capturas'
import LigarCapturas from './_LigarCapturas.vue'

const props = defineProps<{ t: Textos, moduloLigado: boolean, capturasLigado: boolean }>()
const emit = defineEmits<{ 'update:moduloLigado': [boolean], 'update:capturasLigado': [boolean], configurar: [aba?: 'fontes'] }>()
const toast = useToast()
const tc = useTextos(textosCapturas)

const rascunho = ref({ correcao: true, comparacoes: false, juridico: props.moduloLigado, capturas: props.capturasLigado })
watch(() => props.moduloLigado, (v) => { rascunho.value.juridico = v })
watch(() => props.capturasLigado, (v) => { rascunho.value.capturas = v })

const salvando = ref(false)
const modalLigar = ref(false)
async function salvar() {
  // Rodada 4: Capturas passa a valer só depois de escolher a categoria dos processos.
  const vaiLigarCapturas = rascunho.value.juridico && rascunho.value.capturas && !(props.moduloLigado && props.capturasLigado)
  if (vaiLigarCapturas) return (modalLigar.value = true)
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  const mudou = rascunho.value.juridico !== props.moduloLigado
  const mudouCapturas = rascunho.value.capturas !== props.capturasLigado
  emit('update:moduloLigado', rascunho.value.juridico)
  emit('update:capturasLigado', rascunho.value.capturas)
  if (mudou) {
    const m = rascunho.value.juridico ? props.t.sistema.ligado : props.t.sistema.desligado
    toast.add({ title: m.titulo, description: m.desc, icon: rascunho.value.juridico ? 'i-lucide-scale' : 'i-lucide-power-off', color: rascunho.value.juridico ? 'success' : 'neutral' })
  }
  else if (mudouCapturas && !rascunho.value.capturas) {
    toast.add({ title: tc.value.sistema.desligado.titulo, description: tc.value.sistema.desligado.desc, icon: 'i-lucide-power-off', color: 'neutral' })
  }
}

function ligado() {
  emit('update:moduloLigado', true)
  emit('update:capturasLigado', true)
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

            <!-- PROPOSTA (rodada 3): os submódulos do Jurídico -->
            <Transition enter-active-class="transition-[opacity,transform] duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
              <div v-if="m.chave === 'juridico' && rascunho.juridico" class="mt-2 flex flex-col gap-2 border-l-2 border-default pl-4">
                <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ tc.sistema.submodulos }}</p>
                <div class="flex items-start gap-3">
                  <USwitch v-model="rascunho.capturas" :aria-label="tc.sistema.capturas.nome" class="mt-0.5" />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-highlighted">{{ tc.sistema.capturas.nome }}</p>
                    <p class="text-xs text-muted">{{ tc.sistema.capturas.ajuda }}</p>
                  </div>
                  <UButton
                    v-if="moduloLigado && capturasLigado"
                    :label="t.sistema.configurar"
                    icon="i-lucide-settings-2"
                    size="xs"
                    color="neutral"
                    variant="outline"
                    @click="emit('configurar', 'fontes')"
                  />
                </div>
                <p v-if="!rascunho.capturas" class="text-xs text-warning">{{ tc.sistema.nenhum }}</p>
              </div>
            </Transition>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <UButton :label="t.geral.salvar" :loading="salvando" @click="salvar" />
        </div>
      </section>
    </div>
    <LigarCapturas v-model:open="modalLigar" :t="t" @ligado="ligado" />
  </div>
</template>
