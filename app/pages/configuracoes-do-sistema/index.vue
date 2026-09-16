<script setup lang="ts">
import AbaBasicas from './_AbaBasicas.vue'
import AbaCalendario from './_AbaCalendario.vue'
import AbaNotificacoes from './_AbaNotificacoes.vue'
import AbaDicionarios from './_AbaDicionarios.vue'
import AbaCobranca from './_AbaCobranca.vue'

import { documentacao, identidade } from './mocks'
import {
  abas,
  abasPendentes,
  descartar,
  destacar,
  indiceDeBusca,
  marcarSalvo,
  pendente,
  type Aba,
} from './estado'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Configurações do Sistema',
  descricao: 'Cinco assuntos diferentes atrás de uma linha de abas: achar, mudar sem medo e aprender sem sair da tela.',
  status: 'em-revisao',
  atualizado: '2026-09-16',
  tela: 'Proposta',
})

const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ------------------------------------------------------------------ *
 * A aba na URL.
 *
 * Hoje as cinco abas dividem a mesma URL: não há link direto, recarregar
 * volta para a primeira e o botão voltar sai da tela (S3-F6). Aqui a aba
 * ativa vive na query string.
 * ------------------------------------------------------------------ */

const chaves = abas.map(a => a.chave)
const abaInicial = (chaves.includes(route.query.aba as Aba) ? route.query.aba : 'basicas') as Aba
const aba = ref<Aba>(abaInicial)

watch(aba, (nova) => {
  router.replace({ query: { ...route.query, aba: nova } })
})

watch(() => route.query.aba, (nova) => {
  if (typeof nova === 'string' && chaves.includes(nova as Aba) && nova !== aba.value) {
    aba.value = nova as Aba
  }
})

const abaAtual = computed(() => abas.find(a => a.chave === aba.value)!)

const docDaAba: Record<Aba, string> = {
  basicas: documentacao.basicas,
  calendario: documentacao.calendario,
  notificacoes: documentacao.notificacoes,
  dicionarios: documentacao.dicionarios,
  cobranca: documentacao.cobranca,
}

const itensDeAba = computed(() =>
  abas.map(a => ({
    label: a.rotulo,
    value: a.chave,
    slot: a.chave,
    icon: a.icone,
    pendente: pendente(a.chave),
  })),
)

function irPara(destino: string) {
  aba.value = destino as Aba
}

/* ------------------------------------------------------------------ *
 * Busca de configuração — atravessa as cinco abas (padrão do Notion).
 * ------------------------------------------------------------------ */

const buscando = ref(false)

const gruposDeBusca = computed(() => {
  const porAba = abas.map(a => ({
    id: a.chave,
    label: a.rotulo,
    items: indiceDeBusca
      .filter(i => i.aba === a.chave)
      .map(i => ({
        label: i.rotulo,
        description: i.sinonimos.join(' · '),
        suffix: a.rotulo,
        icon: a.icone,
        onSelect: () => {
          aba.value = i.aba
          buscando.value = false
          // O modal trava a rolagem do body enquanto fecha; rolar antes disso
          // não sai do lugar. Esperar o fecho é o que faz o destaque chegar.
          setTimeout(() => {
            destacar(i.secao)
            document.getElementById(i.secao)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 220)
        },
      })),
  }))
  return porAba.filter(g => g.items.length)
})

defineShortcuts({
  meta_k: () => (buscando.value = true),
  ctrl_k: () => (buscando.value = true),
})

/* ------------------------------------------------------------------ *
 * Pendência e gravação.
 *
 * Uma convenção só para a tela inteira (S3-F7), e nada se perde ao trocar
 * de aba (S3-F1): o formulário vive fora do componente da aba.
 * ------------------------------------------------------------------ */

const salvando = ref(false)

const rotuloDasPendencias = computed(() => {
  const nomes = abasPendentes.value.map(c => abas.find(a => a.chave === c)!.rotulo)
  if (nomes.length === 1) return `Alterações não salvas em ${nomes[0]}`
  return `Alterações não salvas em ${nomes.slice(0, -1).join(', ')} e ${nomes.at(-1)}`
})

async function salvarTudo() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 800))
  const quantas = abasPendentes.value.length
  abasPendentes.value.forEach(marcarSalvo)
  salvando.value = false
  toast.add({
    title: quantas > 1 ? `${quantas} abas salvas` : 'Alterações salvas',
    description: 'No protótipo nada persiste: recarregar a página volta tudo ao começo.',
    icon: 'i-lucide-check',
    color: 'success',
  })
}

function descartarTudo() {
  abasPendentes.value.forEach(descartar)
}

/* ------------------------------------------------------------------ *
 * Andaime — os estados que o protótipo precisa mostrar e que não são
 * parte da proposta.
 * ------------------------------------------------------------------ */

type EstadoDemo = 'normal' | 'lendo' | 'carregando'
const estado = ref<EstadoDemo>('normal')
const estados: { valor: EstadoDemo, rotulo: string }[] = [
  { valor: 'normal', rotulo: 'Proprietária' },
  { valor: 'lendo', rotulo: 'Sem permissão de editar' },
  { valor: 'carregando', rotulo: 'Carregando' },
]
</script>

<template>
  <div class="min-h-screen bg-default pb-44">
    <UContainer class="py-8">
      <!-- CABEÇALHO ------------------------------------------------- -->
      <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="flex items-center gap-1.5 text-sm text-muted">
            <UIcon :name="identidade.icon || 'lucide:box'" class="size-4" />
            {{ identidade.name }}
            <span class="text-accented">/</span>
            Configurações
          </p>
          <h1 class="mt-1 text-2xl font-semibold text-highlighted">
            Sistema
          </h1>
        </div>

        <!-- A busca fica no topo, onde a ação da tela sempre esteve. -->
        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide-search"
          class="transition-transform hover:-translate-y-0.5"
          @click="buscando = true"
        >
          Buscar configuração
          <UKbd value="ctrl" />
          <UKbd value="K" />
        </UButton>
      </header>

      <!-- ABAS ------------------------------------------------------ -->
      <UTabs
        v-model="aba"
        :items="itensDeAba"
        :unmount-on-hide="false"
        variant="link"
        class="w-full"
        :ui="{ list: 'overflow-x-auto overflow-y-hidden', content: 'pt-0' }"
      >
        <template #trailing="{ item }">
          <UTooltip v-if="(item as any).pendente" text="Há alteração não salva nesta aba">
            <span class="size-2 shrink-0 rounded-full bg-warning" style="animation: pulso-suave 2s ease-in-out infinite" />
          </UTooltip>
        </template>

        <template v-for="a in abas" #[a.chave] :key="a.chave">
          <!-- O que esta aba decide, dito antes do primeiro campo. -->
          <div class="mb-5 mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-default pb-4">
            <p class="max-w-2xl text-sm text-muted">
              {{ abaAtual.resumo }}
            </p>
            <UButton
              :to="docDaAba[aba]"
              target="_blank"
              icon="i-lucide-book-open"
              :label="`Documentação de ${abaAtual.rotulo}`"
              trailing-icon="i-lucide-arrow-up-right"
              size="xs"
              color="neutral"
              variant="subtle"
              class="shrink-0 transition-transform hover:-translate-y-0.5"
            />
          </div>

          <UAlert
            v-if="estado === 'lendo'"
            class="mb-5"
            color="neutral"
            variant="subtle"
            icon="i-lucide-eye"
            title="Você está vendo, não editando"
            description="Seu cargo não tem permissão para alterar as configurações do sistema. Peça a quem tem a licença Proprietário."
          />

          <!-- carregando -->
          <div v-if="estado === 'carregando'" class="space-y-4">
            <USkeleton v-for="i in 3" :key="i" class="h-40 w-full rounded-xl" />
          </div>

          <!-- `fieldset` desliga a tela inteira de uma vez no modo leitura. -->
          <fieldset v-else :disabled="estado === 'lendo'" class="contents">
            <AbaBasicas v-if="a.chave === 'basicas'" @ir-para="irPara" />
            <AbaCalendario v-else-if="a.chave === 'calendario'" />
            <AbaNotificacoes v-else-if="a.chave === 'notificacoes'" />
            <AbaDicionarios v-else-if="a.chave === 'dicionarios'" @ir-para="irPara" />
            <AbaCobranca v-else />
          </fieldset>
        </template>
      </UTabs>
    </UContainer>

    <!-- BARRA DE PENDÊNCIA ------------------------------------------ -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="abasPendentes.length && estado !== 'lendo'"
        class="fixed inset-x-0 bottom-14 z-40 border-t border-default bg-elevated/95 backdrop-blur"
      >
        <UContainer class="flex flex-wrap items-center gap-3 py-3">
          <UIcon name="i-lucide-circle-alert" class="size-4 shrink-0 text-warning" />
          <p class="text-sm text-highlighted">{{ rotuloDasPendencias }}</p>
          <div class="ml-auto flex gap-2">
            <UButton
              label="Descartar"
              color="neutral"
              variant="ghost"
              :disabled="salvando"
              @click="descartarTudo"
            />
            <UButton
              label="Salvar alterações"
              icon="i-lucide-check"
              :loading="salvando"
              @click="salvarTudo"
            />
          </div>
        </UContainer>
      </div>
    </Transition>

    <!-- BUSCA -------------------------------------------------------- -->
    <UModal v-model:open="buscando">
      <template #content>
        <UCommandPalette
          :groups="gruposDeBusca"
          placeholder="O que você quer configurar?"
          close
          class="h-96"
          @update:open="buscando = false"
        />
      </template>
    </UModal>

    <!-- ANDAIME DE PROTÓTIPO — não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <UContainer class="flex flex-wrap items-center gap-2 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />

        <span class="ml-auto flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">
            Por trás
          </span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/configuracoes-do-sistema"
          />
        </span>
      </UContainer>
    </div>
  </div>
</template>
