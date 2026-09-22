<script setup lang="ts">
/**
 * ANDAIME: o mapa dos selos.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Esta tela não existe no produto e não vai para o
 * dev implementar: ela existe para explicar a proposta. É o desenho anotado
 * que normalmente vai num print com seta por cima, só que feito na tela de
 * verdade, então ele nunca fica desatualizado em relação ao protótipo.
 *
 * O que tem aqui:
 *
 *   1. o cartão com TODOS os campos ligados, com balão e seta em cada peça;
 *   2. o mesmo cartão atrasado, porque dois selos só existem nesse caso;
 *   3. o cartão da tarefa de descrição gigante, que é o caso de borda do texto;
 *   4. a legenda inteira, peça por peça, dizendo de qual campo da tarefa cada
 *      uma sai e o que é preciso para ter o dado.
 *
 * O texto é só em português, como o resto do andaime. O que acompanha o idioma
 * é a tela sendo apontada, que é a que vai para o produto.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import Anotacoes from './_Anotacoes.vue'
import CartaoDeTarefa from './_CartaoDeTarefa.vue'
import { origens, selosDoCartao, selosDoPainel } from './selos'
import type { Selo } from './selos'
import type { Textos } from './textos'

const props = defineProps<{
  tarefas: Task[]
  t: Textos
}>()

const emit = defineEmits<{ abrir: [tarefa: Task] }>()

/** No mapa todo campo está ligado: é o cartão no seu pior caso. */
const campos = Object.fromEntries(
  ['referencia', 'tipo', 'descricao', 'prioridade', 'prazo', 'pontos', 'etiquetas',
    'responsavel', 'item', 'colaboradores', 'tempo', 'criador'].map(k => [k, true]),
)

const completa = computed(() => props.tarefas.find(x => x.id === 22078) ?? props.tarefas[0]!)
const atrasada = computed(() => props.tarefas.find(x => x.id === 22086) ?? props.tarefas[0]!)
const textona = computed(() => props.tarefas.find(x => x.id === 22089) ?? props.tarefas[0]!)

/** Cada bloco aponta só o que ele tem para mostrar. */
const selosDoAtraso = selosDoCartao.filter(s => ['atraso', 'borda'].includes(s.chave))
const selosDoTexto = selosDoCartao.filter(s => ['descricao', 'iconeDescricao'].includes(s.chave))

/** A linha da legenda acende o balão dela, e o contrário também. */
const foco = ref<string | null>(null)

const legenda = computed<{ titulo: string, itens: Selo[] }[]>(() => [
  { titulo: 'No cartão fechado', itens: selosDoCartao },
  { titulo: 'No painel, com a tarefa aberta', itens: selosDoPainel },
])

const contagem = computed(() => selosDoCartao.length + selosDoPainel.length)
</script>

<template>
  <div class="space-y-8 pb-4">
    <!-- O que é esta tela -->
    <div class="rounded-xl border border-dashed border-default p-4">
      <h2 class="flex items-center gap-2 text-sm font-semibold text-highlighted">
        <UIcon name="i-lucide-scan-search" class="size-4 text-primary" />
        Mapa dos selos, {{ contagem }} peças
      </h2>
      <p class="mt-1 max-w-3xl text-xs leading-relaxed text-muted">
        Cada balão aponta uma peça da tela e diz de qual campo da tarefa ela sai. Passe o mouse
        num balão ou numa linha da legenda para acender só aquela peça. Para ver as setas do
        painel lateral, abra o cartão: elas aparecem por cima dele do mesmo jeito.
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <UBadge
          v-for="(o, chave) in origens"
          :key="chave"
          :label="o.rotulo"
          :color="o.cor"
          variant="subtle"
          size="sm"
        />
      </div>
    </div>

    <!-- 1. O cartão inteiro -->
    <section>
      <h3 class="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
        O cartão com todos os campos ligados
      </h3>
      <p class="mb-4 text-xs text-muted">
        Tarefa 22078, tamanho grande. É o pior caso: tudo que pode aparecer, aparecendo junto.
      </p>

      <Anotacoes
        :selos="selosDoCartao"
        :destaque="foco"
        :refazer="`${t.campos.prazo}-completa`"
        @destacar="(c) => foco = c"
      >
        <div class="mx-auto w-72">
          <CartaoDeTarefa
            :tarefa="completa"
            :t="t"
            :campos="campos"
            densidade="grande"
            anotado
            @abrir="emit('abrir', completa)"
          />
        </div>
      </Anotacoes>
    </section>

    <!-- 2. Atrasada -->
    <section>
      <h3 class="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
        A mesma peça, com a tarefa atrasada
      </h3>
      <p class="mb-4 text-xs text-muted">
        Os selos 3 e 19 só existem aqui. Quando eles aparecem, o prazo normal (10) some do
        rodapé, para o cartão não dizer a mesma coisa em dois lugares.
      </p>

      <Anotacoes
        :selos="selosDoAtraso"
        :destaque="foco"
        :refazer="`${t.campos.prazo}-atrasada`"
        @destacar="(c) => foco = c"
      >
        <div class="mx-auto w-72">
          <CartaoDeTarefa
            :tarefa="atrasada"
            :t="t"
            :campos="campos"
            densidade="grande"
            anotado
            @abrir="emit('abrir', atrasada)"
          />
        </div>
      </Anotacoes>
    </section>

    <!-- 3. Descrição gigante -->
    <section>
      <h3 class="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
        O caso de borda do texto
      </h3>
      <p class="mb-4 text-xs text-muted">
        Tarefa 22089, com uma descrição de mais de trinta linhas. O cartão não cresce: corta em
        quatro linhas e acende o ícone que avisa que existe mais texto. Quem quer o texto
        inteiro abre o cartão, e lá ele também começa recolhido.
      </p>

      <Anotacoes
        :selos="selosDoTexto"
        :destaque="foco"
        :refazer="`${t.campos.prazo}-textona`"
        @destacar="(c) => foco = c"
      >
        <div class="mx-auto w-72">
          <CartaoDeTarefa
            :tarefa="textona"
            :t="t"
            :campos="campos"
            densidade="grande"
            anotado
            @abrir="emit('abrir', textona)"
          />
        </div>
      </Anotacoes>
    </section>

    <!-- 4. A legenda -->
    <section class="rounded-xl border border-default bg-default">
      <header class="border-b border-default px-4 py-3">
        <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted">
          <UIcon name="i-lucide-list-tree" class="size-4 text-primary" />
          Legenda, peça por peça
        </h3>
        <p class="mt-0.5 text-xs text-muted">
          A coluna do meio é a que decide trabalho de back: campo da tarefa é o que já vem no
          GET /tasks; outra chamada é o que precisa de pessoas, etiquetas ou registro; e o que
          não existe hoje está listado no DECISOES.
        </p>
      </header>

      <div v-for="bloco in legenda" :key="bloco.titulo">
        <p class="border-b border-default bg-elevated/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
          {{ bloco.titulo }}
        </p>
        <ul class="divide-y divide-default">
          <li
            v-for="selo in bloco.itens"
            :key="selo.chave"
            class="flex gap-3 px-4 py-2.5 transition-colors"
            :class="foco === selo.chave ? 'bg-elevated' : ''"
            @mouseenter="foco = selo.chave"
            @mouseleave="foco = null"
          >
            <span
              class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
              :class="foco === selo.chave ? 'bg-primary text-inverted' : 'bg-elevated text-toned'"
            >
              {{ selo.numero }}
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span class="text-sm font-medium text-highlighted">{{ selo.rotulo }}</span>
                <code class="rounded bg-elevated px-1.5 py-0.5 text-[11px] text-toned">{{ selo.campo }}</code>
                <UBadge
                  :label="origens[selo.origem].rotulo"
                  :color="origens[selo.origem].cor"
                  variant="subtle"
                  size="sm"
                />
              </div>
              <p class="mt-1 text-xs leading-relaxed text-muted">{{ selo.comportamento }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
