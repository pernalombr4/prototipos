<script setup lang="ts">
/**
 * A documentação do ENSPACE com seletor de produto.
 *
 * A demanda: a doc cobre mais de um produto, então precisa de um controle para
 * escolher de qual produto é a documentação que está sendo lida. Referência de
 * padrão: o seletor de versão do Nuxt docs, com o produto no lugar da versão.
 *
 * O que é proposta: o seletor no topo (`_SeletorDeProduto.vue`), o menu lateral
 * e o conteúdo trocarem junto com ele, o escopo da busca dizer o produto, e o
 * aviso de quando a página não existe no produto para onde a pessoa foi.
 * Todo o resto é casca copiada do docs.enspace.io.
 *
 * 100% front-end: o conteúdo vem do `mocks.ts` desta pasta. Nada de rede.
 */
import CascaDaDoc from './_CascaDaDoc.vue'
import CorpoDaPagina from './_CorpoDaPagina.vue'
import MenuDaDoc from './_MenuDaDoc.vue'
import SeletorDeProduto from './_SeletorDeProduto.vue'
import { destinosExternos, navegacao, paginas, produtos, type ChaveDeProduto } from './mocks'
import { textos } from './textos'

import briefingMd from './BRIEFING.md?raw'
import decisoesMd from './DECISOES.md?raw'
import pesquisaMd from './PESQUISA.md?raw'

definePageMeta({
  titulo: 'Seletor de produto na doc',
  descricao: 'Escolher de qual produto é a documentação, sem sair da página que está sendo lida.',
  status: 'em-revisao',
  atualizado: '2026-09-22',
  tela: 'docs.enspace.io, página de documentação',
})

const t = useTextos(textos)
const idioma = useIdioma()

/* ------------------------------------------------------------------ *
 * ANDAIME: o seletor de estados não faz parte da proposta. Existe     *
 * para percorrer os estados e comparar com a doc de hoje.             *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'vazio' | 'carregando' | 'erro' | 'bloqueado' | 'hoje'
const estado = ref<Estado>('cheio')
const estadosPossiveis: Estado[] = ['cheio', 'vazio', 'carregando', 'erro', 'bloqueado', 'hoje']

const comSeletor = computed(() => estado.value !== 'hoje')

/**
 * "Como é hoje" volta ao ENSPACE: hoje a doc não tem produto, e deixar um
 * subproduto aberto sem o seletor mostraria uma tela que não existe.
 */
watch(estado, (novo) => {
  if (novo === 'hoje') {
    produto.value = 'enspace'
    semEquivalente.value = null
  }
})

/* ----------------------------- estado da tela ----------------------------- */

const produto = ref<ChaveDeProduto>('enspace')

/**
 * A página aberta começa numa página funda de propósito: é lá que a troca de
 * produto tem consequência. Em "Primeiros passos" toda troca dá certo, e o
 * caso interessante nunca aparece.
 */
const pagina = ref('selo-do-documento')

/** O aviso de que a página não existia do outro lado. */
const semEquivalente = ref<{ pagina: string, voltarPara: ChaveDeProduto } | null>(null)

/** Meio segundo de troca, para a mudança ser percebida em vez de piscar. */
const trocando = ref(false)
let relogioDaTroca: ReturnType<typeof setTimeout> | null = null

watch(produto, (novo, antigo) => {
  const chaveAnterior = pagina.value
  const existeLa = !!paginas[novo]?.[chaveAnterior]

  if (existeLa) {
    semEquivalente.value = null
  }
  else {
    semEquivalente.value = { pagina: chaveAnterior, voltarPara: antigo }
    pagina.value = 'inicio'
  }

  trocando.value = true
  if (relogioDaTroca) clearTimeout(relogioDaTroca)
  relogioDaTroca = setTimeout(() => { trocando.value = false }, 260)
})

onBeforeUnmount(() => { if (relogioDaTroca) clearTimeout(relogioDaTroca) })

function abrirPagina(chave: string) {
  pagina.value = chave
  semEquivalente.value = null
}

function voltarParaProduto(destino: ChaveDeProduto) {
  const paginaDeVolta = semEquivalente.value?.pagina
  semEquivalente.value = null
  produto.value = destino
  if (paginaDeVolta && paginas[destino]?.[paginaDeVolta]) {
    nextTick(() => { pagina.value = paginaDeVolta })
  }
}

/* ----------------------------- o que aparece ----------------------------- */

const nomeDoProduto = computed(() => t.value.produtos[produto.value].nome)

const arvore = computed(() =>
  estado.value === 'vazio' ? [] : navegacao[produto.value])

const paginaAberta = computed(() =>
  paginas[produto.value]?.[pagina.value] ?? paginas[produto.value]?.inicio ?? null)

const chaveDaDescricao = computed(() =>
  `${produto.value}:${paginaAberta.value?.chave ?? 'inicio'}`)

/** O sumário sai dos títulos da própria página, como o "Nesta página" do site. */
const sumario = computed(() =>
  (paginaAberta.value?.corpo ?? [])
    .filter(b => b.tipo === 'titulo' && b.id)
    .map(b => ({ id: b.id!, texto: b.texto?.[idioma.value] ?? '' })))

const tituloAtivo = ref('')
let observador: IntersectionObserver | null = null

/** Acompanha a rolagem para marcar o título em uso, como o site faz. */
async function observarTitulos() {
  if (!observador) return
  observador.disconnect()
  await nextTick()
  const alvos = sumario.value
    .map(s => document.getElementById(s.id))
    .filter((e): e is HTMLElement => !!e)
  alvos.forEach(a => observador!.observe(a))
  tituloAtivo.value = alvos[0]?.id ?? ''
}

onMounted(() => {
  observador = new IntersectionObserver(
    (entradas) => {
      const visivel = entradas
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visivel) tituloAtivo.value = visivel.target.id
    },
    { rootMargin: '-120px 0px -70% 0px' },
  )
  watch(sumario, observarTitulos, { immediate: true })
})

onBeforeUnmount(() => observador?.disconnect())

function irPara(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * O endereço que a proposta desenha. Andaime: serve para discutir a URL.
 *
 * O produto vem ANTES da seção, porque ele escopa as quatro (`docs`, `dev`,
 * `blog` e `releases`), e não só a documentação. O ENSPACE fica sem prefixo,
 * então todo link de hoje continua valendo sem redirecionamento.
 */
const enderecoProposto = computed(() => {
  const prefixo = produtos.find(p => p.id === produto.value)?.prefixo
  const idiomaCurto = idioma.value === 'pt-BR' ? 'pt' : idioma.value
  return ['docs.enspace.io', idiomaCurto, prefixo, 'docs', paginaAberta.value?.chave]
    .filter(Boolean)
    .join('/')
})
</script>

<template>
  <CascaDaDoc :t="t" :com-seletor="comSeletor" secao-ativa="docs">
    <!-- ✅ A PROPOSTA -->
    <template #produto>
      <SeletorDeProduto v-model="produto" :t="t" :produtos="produtos" :externos="destinosExternos" />
    </template>

    <!-- A mesma peça, em linha cheia, dentro do menu do celular. -->
    <template #produto-celular>
      <SeletorDeProduto v-model="produto" :t="t" :produtos="produtos" :externos="destinosExternos" largura-cheia />
    </template>

    <!-- Menu lateral: troca de árvore junto com o produto -->
    <template #menu>
      <MenuDaDoc
        :t="t"
        :itens="arvore"
        :pagina-ativa="pagina"
        :nome-do-produto="nomeDoProduto"
        :produto="produto"
        :carregando="estado === 'carregando'"
        @abrir="abrirPagina"
      />
    </template>

    <!-- Coluna "Nesta página" -->
    <template #sumario>
      <nav
        v-if="estado === 'cheio' && sumario.length"
        :aria-label="t.casca.nestaPagina"
        class="hidden lg:block"
      >
        <p class="mb-3 text-sm font-semibold text-highlighted">
          {{ t.casca.nestaPagina }}
        </p>
        <ul class="flex flex-col border-l border-default">
          <li v-for="item in sumario" :key="item.id">
            <button
              type="button"
              class="-ml-px block w-full cursor-pointer border-l-2 py-1.5 pl-3 text-left text-sm transition-colors"
              :class="tituloAtivo === item.id
                ? 'border-primary font-medium text-primary'
                : 'border-transparent text-muted hover:text-highlighted'"
              @click="irPara(item.id)"
            >
              {{ item.texto }}
            </button>
          </li>
        </ul>
      </nav>
    </template>

    <!-- ------------------------------------------------------------- -->
    <!-- A COLUNA DO MEIO                                               -->
    <!--                                                                -->
    <!-- Tudo dentro de um elemento só: um slot com vários nós de raiz  -->
    <!-- (os comentários mais o v-if) vira fragmento no cliente e nó    -->
    <!-- único no servidor, e o Vue reclama de hidratação.              -->
    <!-- ------------------------------------------------------------- -->
    <div class="min-w-0">
      <!-- Carregando -->
      <div v-if="estado === 'carregando'" class="flex flex-col gap-4 pt-8 lg:pt-14" :aria-label="t.estados.carregando" role="status">
        <div class="h-8 w-40 rounded bg-elevated" style="animation: pulso-suave 1.4s ease-in-out infinite" />
        <div class="h-10 w-3/4 rounded bg-elevated" style="animation: pulso-suave 1.4s ease-in-out infinite; animation-delay: 120ms" />
        <div class="h-5 w-full rounded bg-elevated" style="animation: pulso-suave 1.4s ease-in-out infinite; animation-delay: 220ms" />
        <div class="mt-6 flex flex-col gap-3">
          <div
            v-for="n in 6"
            :key="n"
            class="h-4 rounded bg-elevated"
            :style="{ animation: 'pulso-suave 1.4s ease-in-out infinite', animationDelay: `${300 + n * 90}ms`, width: `${70 + ((n * 17) % 30)}%` }"
          />
        </div>
      </div>

      <!-- Produto ainda sem documentação -->
      <div v-else-if="estado === 'vazio'" class="pt-8 lg:pt-14">
        <div class="flex flex-col items-start gap-4 rounded-xl border border-dashed border-default px-6 py-10">
          <div class="flex size-12 items-center justify-center rounded-xl bg-elevated">
            <UIcon name="i-lucide-book-open" class="size-6 text-dimmed" />
          </div>
          <h1 class="text-2xl font-bold text-highlighted">
            {{ t.estados.vazioTitulo(nomeDoProduto) }}
          </h1>
          <p class="max-w-prose text-muted">
            {{ t.estados.vazioTexto }}
          </p>
          <!-- A saída só faz sentido quando não é a própria plataforma que está vazia. -->
          <UButton
            v-if="produto !== 'enspace'"
            :label="t.estados.vazioAcao"
            color="primary"
            variant="solid"
            trailing-icon="i-lucide-arrow-right"
            class="cursor-pointer"
            @click="produto = 'enspace'"
          />
        </div>
      </div>

      <!-- Erro -->
      <div v-else-if="estado === 'erro'" class="pt-8 lg:pt-14">
        <div class="flex flex-col items-start gap-4 rounded-xl border border-error/30 bg-error/5 px-6 py-10">
          <div class="flex size-12 items-center justify-center rounded-xl bg-error/10">
            <UIcon name="i-lucide-triangle-alert" class="size-6 text-error" />
          </div>
          <h1 class="text-2xl font-bold text-highlighted">
            {{ t.estados.erroTitulo }}
          </h1>
          <p class="max-w-prose text-muted">
            {{ t.estados.erroTexto }}
          </p>
          <UButton
            :label="t.estados.erroAcao"
            color="neutral"
            variant="outline"
            icon="i-lucide-rotate-ccw"
            class="cursor-pointer"
            @click="estado = 'cheio'"
          />
        </div>
      </div>

      <!-- Conteúdo restrito -->
      <div v-else-if="estado === 'bloqueado'" class="pt-8 lg:pt-14">
        <div class="flex flex-col items-start gap-4 rounded-xl border border-default bg-elevated/50 px-6 py-10">
          <div class="flex size-12 items-center justify-center rounded-xl bg-elevated">
            <UIcon name="i-lucide-lock" class="size-6 text-dimmed" />
          </div>
          <h1 class="text-2xl font-bold text-highlighted">
            {{ t.estados.bloqueadoTitulo }}
          </h1>
          <p class="max-w-prose text-muted">
            {{ t.estados.bloqueadoTexto }}
          </p>
          <UButton :label="t.estados.bloqueadoAcao" color="primary" class="cursor-pointer" />
        </div>
      </div>

      <!-- Documentação cheia -->
      <div v-else>
        <!--
          ✅ PROPOSTA. O aviso de quando a troca de produto não achou a página.
          Fica acima do cabeçalho, onde o Nuxt põe o aviso de versão sem suporte,
          e sai da tela assim que a pessoa navega.
        -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="-translate-y-2 opacity-0"
          leave-active-class="transition duration-150"
          leave-to-class="-translate-y-2 opacity-0"
        >
          <div
            v-if="semEquivalente"
            class="mt-6 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 lg:mt-12"
            role="status"
          >
            <UIcon name="i-lucide-corner-up-right" class="mt-0.5 size-5 shrink-0 text-warning" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-highlighted">
                {{ t.semEquivalente.titulo(nomeDoProduto) }}
              </p>
              <p class="mt-1 text-sm leading-6 text-toned">
                {{ t.semEquivalente.texto(t.titulos[semEquivalente.pagina] ?? semEquivalente.pagina) }}
              </p>
              <UButton
                class="mt-2 cursor-pointer"
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-lucide-undo-2"
                :label="t.semEquivalente.voltar(t.produtos[semEquivalente.voltarPara].nome)"
                @click="voltarParaProduto(semEquivalente.voltarPara)"
              />
            </div>
            <UButton
              class="cursor-pointer"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              :aria-label="t.semEquivalente.fechar"
              @click="semEquivalente = null"
            />
          </div>
        </Transition>

        <div
          v-if="paginaAberta"
          :key="`${produto}-${paginaAberta.chave}`"
          class="transition-opacity duration-200"
          :class="trocando ? 'opacity-0' : 'opacity-100'"
        >
          <CorpoDaPagina :t="t" :pagina="paginaAberta" :chave-da-descricao="chaveDaDescricao" />
        </div>
      </div>
    </div>

    <!-- ------------------------------------------------------------- -->
    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta                -->
    <!-- ------------------------------------------------------------- -->
    <template #andaime>
      <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
        <div class="flex flex-wrap items-center gap-2 px-4 py-3">
          <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
            {{ t.andaime.estado }}
          </span>
          <UButton
            v-for="e in estadosPossiveis"
            :key="e"
            :label="t.andaime.estados[e]"
            size="xs"
            class="cursor-pointer transition-transform hover:-translate-y-0.5"
            :color="estado === e ? 'primary' : 'neutral'"
            :variant="estado === e ? 'solid' : 'subtle'"
            @click="estado = e"
          />

          <span class="ml-1 hidden items-center gap-1.5 xl:flex">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">
              {{ t.andaime.endereco }}
            </span>
            <code class="rounded bg-accented px-2 py-1 text-xs text-toned">{{ enderecoProposto }}</code>
          </span>

          <ControlesDePrototipo class="ml-auto" />

          <span class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
            <PainelDeContexto
              :briefing="briefingMd"
              :pesquisa="pesquisaMd"
              :decisoes="decisoesMd"
              repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/seletor-de-produto-na-doc"
            />
          </span>
        </div>
      </div>
    </template>
  </CascaDaDoc>
</template>
