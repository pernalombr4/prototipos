<script setup lang="ts">
/**
 * A MATRIZ DE DADOS: linhas x colunas, uma resposta por linha.
 *
 * Medido em tela no develop em 23/09/2026, criando o campo do zero:
 *
 * - o campo tem "Rótulo Complementar", e é ele que vira o TÍTULO do bloco;
 * - "Linhas" e "Colunas" são duas listas ordenadas, cada item com rótulo e
 *   referência técnica própria, com Exportar e Importar nas duas;
 * - a linha aceita UMA resposta: marcar a segunda desmarca a primeira. As
 *   linhas são independentes entre si;
 * - com resposta gravada, aparece um "Limpar" no pé do bloco;
 * - a leitura fora do formulário é uma lista `linha: coluna`, e o produto a
 *   mostra num quadro chamado "Perguntas".
 *
 * ────────────────── por que este componente existe ──────────────────
 *
 * O Nuxt UI tem `URadioGroup`, e ele é o certo para UMA pergunta. O que não
 * existe é a grade: um grupo por linha, alinhado à mesma coluna de todas as
 * outras, com o cabeçalho de coluna escrito uma vez só. Então o radio aqui
 * continua sendo o `URadioGroup` da biblioteca (com o rótulo de cada item
 * vazio, que é o jeito que ele desenha só o controle) e o que este arquivo
 * acrescenta é a grade que alinha os grupos.
 *
 * ─────────── o que MUDOU em relação ao produto, e por quê ───────────
 *
 * O develop imprime, embaixo de cada radio, o NÚMERO DA COLUNA (1, 2, 3).
 * Saiu. O número é o índice da configuração vazando para quem responde: o
 * rótulo da coluna já está no cabeçalho, e o número só concorre com ele. Fica
 * registrado como achado, não como preferência.
 */
interface Opcao {
  value: string
  label: string
}

const props = defineProps<{
  /** O "Rótulo Complementar" do campo, que titula o bloco. */
  rotulo?: string
  linhas: Opcao[]
  colunas: Opcao[]
  /** Linha -> coluna escolhida. Linha ausente é linha sem resposta. */
  modelValue: Record<string, string>
  /** Texto do botão de limpar, já traduzido. */
  rotuloLimpar: string
  /**
   * O bloco desenha o próprio "Limpar".
   *
   * O produto põe um Limpar no pé do bloco, e ele fica. Mas o quadro de edição
   * da tabela JÁ tem um Limpar no cabeçalho, igual para todos os tipos: dois
   * botões idênticos a dois centímetros um do outro é exatamente o
   * frankenstein que este protótipo não pode ser. Então dentro do quadro vale
   * o do quadro, e no formulário e no cru vale o do bloco.
   */
  mostrarLimpar?: boolean
  somenteLeitura?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [Record<string, string>]
}>()

const respostas = computed(() => props.modelValue ?? {})

const temResposta = computed(() => Object.values(respostas.value).some(Boolean))

/**
 * O `URadioGroup` só desenha o controle quando o item não tem rótulo: o
 * `<div>` do rótulo e da descrição é condicional no template dele. É por isso
 * que os itens aqui vão só com `value`.
 */
const itensSemRotulo = computed(() => props.colunas.map(c => ({ value: c.value })))

function responder(linha: string, coluna: unknown) {
  emit('update:modelValue', { ...respostas.value, [linha]: String(coluna) })
}

function limpar() {
  emit('update:modelValue', {})
}
</script>

<template>
  <div class="matriz rounded-md border border-default" :style="{ '--n': colunas.length }">
    <p v-if="rotulo" class="border-b border-default bg-elevated/40 px-3 py-2 text-sm font-semibold text-highlighted">
      {{ rotulo }}
    </p>

    <!-- O cabeçalho das colunas, escrito uma vez para toda a grade. -->
    <div class="linha border-b border-default px-3 py-1.5">
      <span />
      <span
        v-for="col in colunas"
        :key="col.value"
        class="text-center text-xs font-medium text-muted"
      >
        {{ col.label }}
      </span>
    </div>

    <div
      v-for="(linha, i) in linhas"
      :key="linha.value"
      class="linha px-3 py-2"
      :class="i > 0 && 'border-t border-default'"
    >
      <span class="min-w-0 pr-2 text-sm text-highlighted">{{ linha.label }}</span>
      <URadioGroup
        :model-value="respostas[linha.value] ?? null"
        :items="itensSemRotulo"
        :disabled="somenteLeitura"
        orientation="horizontal"
        size="sm"
        class="grupo col-start-2 col-end-[-1]"
        @update:model-value="(v: unknown) => responder(linha.value, v)"
      />
    </div>

    <div v-if="mostrarLimpar && temResposta && !somenteLeitura" class="flex justify-end border-t border-default px-2 py-1.5">
      <UButton
        :label="rotuloLimpar"
        icon="i-lucide-eraser"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="limpar"
      />
    </div>
  </div>
</template>

<style scoped>
/*
 * Uma grade só, declarada aqui e usada pelo cabeçalho e por cada linha: é o
 * que garante que o radio caia embaixo do rótulo da coluna. A largura mínima
 * de 4,5 rem é o que faz "Não se aplica" caber sem quebrar em duas linhas.
 */
.matriz {
  --grade: repeat(var(--n), minmax(4.5rem, 1fr));
}

.linha {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--grade);
  align-items: center;
}

/* O grupo ocupa as colunas de resposta e distribui os radios nelas. */
.grupo :deep(fieldset) {
  display: grid;
  grid-template-columns: var(--grade);
  place-items: center;
  gap: 0;
}
</style>
