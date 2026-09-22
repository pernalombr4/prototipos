<script setup lang="ts">
/**
 * ANDAIME: o mapa dos selos.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Esta tela não existe no produto e não vai para o
 * dev implementar: ela existe para explicar a proposta. É o desenho anotado
 * que normalmente vai num print com seta por cima, só que feito na tela de
 * verdade, então ele nunca fica desatualizado em relação ao protótipo.
 *
 * **São cinco quadros, e não um.** A primeira versão apontava as dezessete
 * peças do cartão de uma vez só, e virou um novelo: dezessete balões em volta
 * de um cartão de 300 px obrigam metade das setas a atravessar a outra metade.
 * Agora cada quadro aponta um pedaço, com no máximo seis balões de cada lado:
 *
 *   1. a cabeça do cartão: identificação, título, texto, ligação e etiquetas;
 *   2. o rodapé do cartão: o que se lê de relance, e as três pessoas;
 *   3. a tarefa atrasada, porque dois selos só existem nesse caso;
 *   4. a tarefa com dez colaboradores, que é onde o contador aparece;
 *   5. a tarefa de descrição gigante, o caso de borda do texto.
 *
 * E embaixo, a legenda inteira, peça por peça, dizendo de qual campo da tarefa
 * cada uma sai e o que é preciso para ter o dado.
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

function tarefaPorId(id: number) {
  return props.tarefas.find(x => x.id === id) ?? props.tarefas[0]!
}

const porChave = (chaves: string[]) => selosDoCartao.filter(s => chaves.includes(s.chave))

const quadros = computed(() => [
  {
    chave: 'cabeca',
    titulo: 'A cabeça do cartão',
    ajuda: 'Tarefa 22078, tamanho grande, com todos os campos ligados. É o pior caso: tudo que pode aparecer, aparecendo junto.',
    tarefa: tarefaPorId(22078),
    selos: selosDoCartao.filter(s => s.quadro === 'cabeca'),
  },
  {
    chave: 'rodape',
    titulo: 'O rodapé do mesmo cartão',
    ajuda: 'A linha que se lê de relance, e as três pessoas na ordem de sempre: quem criou, quem colabora e quem responde.',
    tarefa: tarefaPorId(22078),
    selos: selosDoCartao.filter(s => s.quadro === 'rodape'),
  },
  {
    chave: 'atraso',
    titulo: 'Com a tarefa atrasada',
    ajuda: 'Os selos 3 e 19 só existem aqui. Quando eles aparecem, o prazo normal (10) some do rodapé, para o cartão não dizer a mesma coisa em dois lugares.',
    tarefa: tarefaPorId(22086),
    selos: porChave(['atraso', 'borda']),
  },
  {
    chave: 'time',
    titulo: 'Com dez colaboradores',
    ajuda: 'Tarefa 22079, com um time inteiro avisado pelo spaceflow. O cartão mostra dois avatares e conta o resto: dez avatares empurrariam o responsável para fora da linha, e o responsável é quem tem que agir.',
    tarefa: tarefaPorId(22079),
    selos: porChave(['colaboradores', 'responsavel']),
  },
  {
    chave: 'texto',
    titulo: 'Com a descrição gigante',
    ajuda: 'Tarefa 22089, com uma descrição de mais de trinta linhas. O cartão não cresce: corta em quatro linhas e acende o ícone que avisa que existe mais texto. O texto inteiro está no painel, e lá ele também começa recolhido.',
    tarefa: tarefaPorId(22089),
    selos: porChave(['descricao', 'iconeDescricao']),
  },
])

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
        num balão ou numa linha da legenda para acender só aquela peça. Passando o mouse na peça
        dentro do cartão, aparece o tooltip que ela tem no produto. Para ver as setas do painel
        lateral, abra o cartão: elas aparecem por cima dele do mesmo jeito.
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

    <!-- Os cinco quadros -->
    <section v-for="quadro in quadros" :key="quadro.chave">
      <h3 class="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
        {{ quadro.titulo }}
      </h3>
      <p class="mb-4 max-w-3xl text-xs leading-relaxed text-muted">{{ quadro.ajuda }}</p>

      <Anotacoes
        :selos="quadro.selos"
        :destaque="foco"
        :refazer="`${t.campos.prazo}-${quadro.chave}`"
        @destacar="(c) => foco = c"
      >
        <div class="mx-auto w-72">
          <CartaoDeTarefa
            :tarefa="quadro.tarefa"
            :t="t"
            :campos="campos"
            densidade="grande"
            anotado
            @abrir="emit('abrir', quadro.tarefa)"
          />
        </div>
      </Anotacoes>
    </section>

    <!-- A legenda -->
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
