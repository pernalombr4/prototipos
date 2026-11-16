<script setup lang="ts">
import CascaDasConfiguracoes from './_CascaDasConfiguracoes.vue'
import Central from './_Central.vue'
import CriarAgente from './_CriarAgente.vue'
import EditorDoAgente from './_EditorDoAgente.vue'
import ChatFlutuante from './_ChatFlutuante.vue'
import Biblioteca from './_Biblioteca.vue'
import Atividade from './_Atividade.vue'
import Politicas from './_Politicas.vue'
import Playbooks from './_Playbooks.vue'
import { textos } from './textos'
import { useTela, type AbaDoTopo, type EstadoDoCartao } from './estado'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Central de Agentes de IA',
  descricao: 'Criar, testar e publicar agentes com modelos permitidos, confirmação antes de agir, arquivos de referência e modelos de resposta.',
  status: 'em-revisao',
  atualizado: '2026-11-16',
  tela: 'Proposta',
})

const t = useTextos(textos)
const tela = useTela()

const abas = computed(() => [
  { value: 'agentes', label: t.value.abas.agentes, icon: 'i-lucide-bot' },
  { value: 'respostas', label: t.value.abas.respostas, icon: 'i-lucide-text-quote' },
  { value: 'playbooks', label: t.value.abas.playbooks, icon: 'i-lucide-book-open-check' },
  { value: 'atividade', label: t.value.abas.atividade, icon: 'i-lucide-activity' },
  { value: 'politicas', label: t.value.abas.politicas, icon: 'i-lucide-shield-check' },
])

/* ───────────── Andaime: pular direto para cada estado ───────────── */

type Estado = 'central' | 'vazia' | 'criar' | 'editor' | 'testar' | 'chat' | 'minuta' | 'fixo' | 'respostas'
const estado = ref<Estado>('central')
const estados: Estado[] = ['central', 'vazia', 'criar', 'editor', 'testar', 'chat', 'minuta', 'fixo', 'respostas']

function irPara(e: Estado) {
  estado.value = e
  const s = tela.value
  s.vazia = e === 'vazia'
  s.criarAberto = e === 'criar'
  s.editorAberto = e === 'editor' || e === 'testar'
  s.chatAberto = ['chat', 'minuta', 'fixo'].includes(e)
  s.aba = (e === 'respostas' ? 'respostas' : 'agentes') as AbaDoTopo
  if (s.editorAberto) {
    s.editando = 'respostas-a-oficios'
    s.abaDoEditor = e === 'testar' ? 'testar' : 'essencial'
  }
  if (e === 'chat') { s.chatAgente = 'respostas-a-oficios'; s.cenario = 'confirmacao'; s.cartao = 'pendente' }
  if (e === 'minuta') { s.chatAgente = 'respostas-a-oficios'; s.cenario = 'minuta' }
  if (e === 'fixo') { s.chatAgente = 'revisor-de-contratos'; s.cenario = 'novo' }
}

const cartoes: (EstadoDoCartao | 'lote')[] = ['pendente', 'confirmado', 'cancelado', 'erro', 'lote']
function mostrarCartao(c: EstadoDoCartao | 'lote') {
  if (c === 'lote') { tela.value.cenario = 'lote'; tela.value.cartao = 'pendente' }
  else { tela.value.cenario = 'confirmacao'; tela.value.cartao = c }
}
const cartaoAtivo = computed(() => tela.value.cenario === 'lote' ? 'lote' : tela.value.cartao)
</script>

<template>
  <CascaDasConfiguracoes :t="t" :workspace="t.workspace" slug="operacoes-juridicas">
    <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-3 sm:px-6">
      <UTabs
        v-model="tela.aba"
        :items="abas"
        variant="link"
        :content="false"
        class="mb-5"
        :ui="{ trigger: 'shrink-0' }"
      />

      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <Central v-if="tela.aba === 'agentes'" key="agentes" :t="t" />
        <Biblioteca v-else-if="tela.aba === 'respostas'" key="respostas" :t="t" :abrir-primeiro="estado === 'respostas'" />
        <Playbooks v-else-if="tela.aba === 'playbooks'" key="playbooks" :t="t" />
        <Atividade v-else-if="tela.aba === 'atividade'" key="atividade" :t="t" />
        <Politicas v-else key="politicas" :t="t" />
      </Transition>
    </div>

    <CriarAgente :t="t" />
    <EditorDoAgente :t="t" />
    <ChatFlutuante :t="t" />

    <!-- O botão do BENI, no canto, como no produto: abre o chat flutuante -->
    <UButton
      v-if="!tela.chatAberto"
      icon="i-lucide-bot-message-square"
      size="xl"
      class="fixed bottom-20 right-5 z-30 rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
      :aria-label="t.chat.abrir"
      @click="tela.chatAberto = true"
    />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.estado }}</span>
        <UButton
          v-for="e in estados"
          :key="e"
          :label="t.andaime.estados[e]"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e ? 'primary' : 'neutral'"
          :variant="estado === e ? 'solid' : 'subtle'"
          @click="irPara(e)"
        />
        <template v-if="tela.chatAberto && ['confirmacao', 'lote'].includes(tela.cenario)">
          <USeparator orientation="vertical" class="h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cartao }}</span>
          <UButton
            v-for="c in cartoes"
            :key="c"
            :label="t.andaime.cartoes[c]"
            size="xs"
            :color="cartaoAtivo === c ? 'primary' : 'neutral'"
            :variant="cartaoAtivo === c ? 'soft' : 'ghost'"
            @click="mostrarCartao(c)"
          />
        </template>
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/central-de-agentes-de-ia"
          />
        </span>
      </div>
    </div>
  </CascaDasConfiguracoes>
</template>
