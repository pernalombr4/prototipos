<script setup lang="ts">
/**
 * "Conectar uma IA": a seção Inteligência Artificial de Configurações ›
 * Integrações, aberta num modal sobre o campo. PROPOSTA (rodada 7).
 *
 * Hoje (develop, 2026-10-14) a seção tem um cartão só, OpenAI, com
 * "Instalar Integração", uma página e um modal com "Api Key". Aqui:
 * - 1 cartão por IA, no formato do cartão de hoje (logo, frase, botão);
 * - Conectar abre o passo da chave no mesmo modal, com o que falta hoje
 *   (onde pegar a chave, créditos, erro no campo);
 * - conectada, o modal mostra os modelos liberados e "Voltar ao campo";
 *   quem pediu (o campo) recebe a lista do que foi conectado e segue o pedido.
 *
 * Um modal só na página: quem abre é `pedirConexao()` (ias.ts).
 * SIMULAÇÃO: Claude e Gemini não existem no ENSPACE de hoje; qualquer chave
 * preenchida conecta (rodada 8); a chave não sai do navegador.
 */
import type { Textos } from './textos'
import type { IdDaIa } from './ias'
import { conexao, iaPorId, ias, modelosDa, useIasConectadas } from './ias'
import LogoDaIa from './_LogoDaIa.vue'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ conectada: [ia: IdDaIa] }>()

const tc = computed(() => props.t.conectar)
const conectadas = useIasConectadas()

const passo = ref<'lista' | 'chave' | 'pronta'>('lista')
const escolhida = ref<IdDaIa>('openai')
const chave = ref('')
const mostrar = ref(false)
const erro = ref('')
const conectando = ref(false)
/** o que esta abertura do modal conectou, para devolver a quem pediu */
const nestaVez = ref<IdDaIa[]>([])

const ia = computed(() => iaPorId(escolhida.value))

/* O passo entra com animação: o foco vai ao campo da chave (ou ao "Voltar ao campo") quando ela termina. */
function focar(seletor: string) {
  setTimeout(() => document.querySelector<HTMLElement>(seletor)?.focus(), 350)
}

watch(() => conexao.aberto, (aberto) => {
  if (!aberto) return
  nestaVez.value = []
  const direto = conexao.pedido.ia
  if (direto && !conectadas.value.includes(direto)) abrirChave(direto)
  else passo.value = 'lista'
})

function abrirChave(id: IdDaIa) {
  escolhida.value = id
  chave.value = ''
  erro.value = ''
  mostrar.value = false
  passo.value = 'chave'
  focar('[data-chave-da-ia] input')
}

async function conectar() {
  const c = chave.value.trim()
  erro.value = ''
  if (!c) {
    erro.value = tc.value.vazia
    return
  }
  conectando.value = true
  await new Promise(r => setTimeout(r, 1100))
  conectando.value = false
  chave.value = ''
  if (!conectadas.value.includes(ia.value.id)) conectadas.value = [...conectadas.value, ia.value.id]
  nestaVez.value.push(ia.value.id)
  emit('conectada', ia.value.id)
  passo.value = 'pronta'
  focar('[data-voltar-ao-campo]')
}

/* Fechar por qualquer caminho (Voltar ao campo, X, Esc, fora) devolve ao campo. */
watch(() => conexao.aberto, (aberto, antes) => {
  if (aberto || !antes) return
  const { aoVoltar } = conexao.pedido
  conexao.pedido = {}
  aoVoltar?.([...nestaVez.value])
})

const outrasParaConectar = computed(() => ias.some(i => i.disponivel && !conectadas.value.includes(i.id)))
</script>

<template>
  <UModal
    v-model:open="conexao.aberto"
    :title="tc.titulo"
    :description="tc.descricao"
    :ui="{ content: 'sm:max-w-2xl', body: 'p-0 sm:p-0', header: 'pb-3' }"
  >
    <template #body>
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-2"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <!-- 1. AS IAs: a seção Inteligência Artificial de Integrações -->
        <div v-if="passo === 'lista'" key="lista" class="flex flex-col gap-3 p-4 sm:p-6">
          <p class="flex items-center gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-plug" class="size-3.5" />{{ tc.trilha }}
          </p>
          <p v-if="conexao.pedido.pendente" class="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-xs text-primary">
            <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />{{ tc.emSeguida(conexao.pedido.pendente) }}
          </p>
          <ul class="grid gap-3 sm:grid-cols-2">
            <li
              v-for="(i, n) in ias"
              :key="i.id"
              class="flex animate-[entrada_.3s_ease-out_both] flex-col overflow-hidden rounded-lg border border-default bg-default transition"
              :class="i.disponivel ? 'hover:-translate-y-0.5 hover:shadow-md' : 'opacity-70'"
              :style="{ animationDelay: `${n * 40}ms` }"
            >
              <div class="flex items-center gap-3 px-4 pb-2 pt-4">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated ring-1 ring-default">
                  <LogoDaIa :ia="i.id" class="size-5 text-highlighted" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block font-semibold text-highlighted">{{ i.nome }}</span>
                  <span class="block text-xs text-muted">{{ i.empresa }}</span>
                </span>
                <UBadge v-if="conectadas.includes(i.id)" :label="tc.conectada" icon="i-lucide-check" color="success" variant="subtle" size="sm" />
                <UBadge v-else-if="!i.disponivel" :label="tc.emBreve" color="neutral" variant="subtle" size="sm" />
              </div>
              <p class="flex-1 px-4 pb-3 text-sm text-muted">{{ tc.descricoes[i.id] }}</p>
              <div class="border-t border-default bg-elevated/40 px-4 py-2.5">
                <UButton
                  v-if="i.disponivel && !conectadas.includes(i.id)"
                  :label="tc.conectar"
                  icon="i-lucide-plus"
                  color="primary"
                  variant="soft"
                  size="sm"
                  block
                  @click="abrirChave(i.id)"
                />
                <p v-else-if="conectadas.includes(i.id)" class="text-center text-xs text-muted">
                  {{ tc.modelosNoBeni(modelosDa(i.id).length) }}
                </p>
                <p v-else class="text-center text-xs text-dimmed">{{ tc.emBreveDica }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- 2. A CHAVE da IA escolhida -->
        <form v-else-if="passo === 'chave'" key="chave" class="flex flex-col gap-4 p-4 sm:p-6" @submit.prevent="conectar">
          <UButton
            :label="tc.todas"
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="link"
            size="xs"
            class="-ms-1 self-start px-1"
            @click="passo = 'lista'"
          />
          <div class="flex items-start gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated ring-1 ring-default">
              <LogoDaIa :ia="ia.id" class="size-5 text-highlighted" />
            </span>
            <div class="min-w-0">
              <p class="font-semibold text-highlighted">{{ tc.conectarA(ia.nome) }}</p>
              <p class="text-sm text-muted">{{ tc.textoChave(ia.empresa) }}</p>
              <p v-if="conexao.pedido.motivo" class="mt-1.5 flex items-center gap-1.5 text-xs text-warning">
                <UIcon name="i-lucide-info" class="size-3.5 shrink-0" />{{ conexao.pedido.motivo }}
              </p>
              <p v-if="conexao.pedido.pendente" class="mt-1.5 flex items-center gap-1.5 text-xs text-primary">
                <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />{{ tc.emSeguida(conexao.pedido.pendente) }}
              </p>
            </div>
          </div>

          <UFormField :label="tc.chave" :error="erro || undefined" data-chave-da-ia>
            <template #hint>
              <ULink :to="ia.urlDaChave" target="_blank" class="inline-flex items-center gap-1 text-xs text-primary">
                {{ tc.ondePego }}<UIcon name="i-lucide-arrow-up-right" class="size-3" />
              </ULink>
            </template>
            <UInput
              v-model="chave"
              :type="mostrar ? 'text' : 'password'"
              :placeholder="`${ia.inicioDaChave}...`"
              autocomplete="off"
              spellcheck="false"
              class="w-full font-mono"
              @update:model-value="erro = ''"
            >
              <template #trailing>
                <UButton
                  :icon="mostrar ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  color="neutral"
                  variant="link"
                  size="xs"
                  :aria-label="mostrar ? tc.esconder : tc.mostrar"
                  :aria-pressed="mostrar"
                  @click="mostrar = !mostrar"
                />
              </template>
            </UInput>
            <template #help>
              <span class="flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-coins" class="size-3.5 shrink-0" />{{ tc.creditos(ia.empresa) }}</span>
            </template>
          </UFormField>

          <div class="flex flex-wrap items-center justify-end gap-2">
            <UButton :label="tc.voltar" color="neutral" variant="ghost" @click="passo = 'lista'" />
            <UButton type="submit" :label="tc.conectar" icon="i-lucide-plug" :loading="conectando" />
          </div>
        </form>

        <!-- 3. CONECTADA -->
        <div v-else key="pronta" class="flex flex-col gap-4 p-4 sm:p-6" aria-live="polite">
          <div class="flex items-start gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <UIcon name="i-lucide-check" class="size-5" />
            </span>
            <div class="min-w-0">
              <p class="font-semibold text-highlighted">{{ tc.pronta(ia.nome) }}</p>
              <p class="text-sm text-muted">{{ tc.valeParaTodos }}</p>
            </div>
          </div>
          <div>
            <p class="mb-1.5 text-xs font-semibold text-muted">{{ tc.modelosLiberados }}</p>
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="m in modelosDa(ia.id)" :key="m.id" :label="m.nome" color="neutral" variant="subtle" />
            </div>
          </div>
          <p v-if="conexao.pedido.pendente" class="flex items-center gap-1.5 text-xs text-primary">
            <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />{{ tc.emSeguida(conexao.pedido.pendente) }}
          </p>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <UButton v-if="outrasParaConectar" :label="tc.outra" icon="i-lucide-plus" color="neutral" variant="outline" @click="passo = 'lista'" />
            <UButton :label="tc.voltarAoCampo" icon="i-lucide-corner-down-left" data-voltar-ao-campo @click="conexao.aberto = false" />
          </div>
        </div>
      </Transition>
    </template>

    <template #footer>
      <div class="flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span class="flex items-center gap-1.5"><UIcon name="i-lucide-lock" class="size-3.5" />{{ t.ativar.privacidade }}</span>
        <span class="ms-auto flex items-center gap-1 text-dimmed"><UIcon name="i-lucide-flask-conical" class="size-3.5" />{{ tc.simulacao }}</span>
      </div>
    </template>
  </UModal>
</template>
