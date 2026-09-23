<script setup lang="ts">
/**
 * O VALOR de um campo, no formato "célula" ou no formato "cru".
 *
 * É o coração da proposta: um componente só, com uma regra por tipo, servindo
 * os dois lugares onde o valor é LIDO. A tabela e o resumo da sidebar não têm
 * desenhos diferentes do mesmo campo. Têm o mesmo desenho, em duas densidades:
 *
 * - `celula`: uma linha, altura fixa, transbordo vira reticências ou contador;
 * - `cru`: pode quebrar linha, mostra mais valores e ganha as ações de apoio
 *   (copiar, baixar, abrir) no hover.
 *
 * O padrão vem do Twenty CRM, que tem um `FieldDisplay` por tipo reusado na
 * célula e no painel do registro. A alternativa (um componente por lugar) é o
 * que o ENSPACE tem hoje e é de onde nasce a divergência: o mesmo campo lido de
 * dois jeitos em duas telas.
 */
import type { Campo } from './campos'
import type { Textos } from './textos'
import {
  corDaOpcao,
  foiCorrigido,
  moedaOriginalFormatada,
  enderecoEmUmaLinha,
  estaVazio,
  estaVencida,
  formatarBytes,
  formatarDataCurta,
  formatarDataMedia,
  relativoEmDias,
  rotuloDaOpcao,
  saidaFormatada,
  semTags,
} from './formatacao'
import { opcoes as todasAsOpcoes } from './mocks'

const props = defineProps<{
  campo: Campo
  valor: unknown
  formato: 'celula' | 'cru'
  t: Textos
  idioma: string
}>()

const emit = defineEmits<{
  /** Clicar no valor entra em edição, que é o que a demanda pediu. */
  /** O alvo vai no evento: quem abre o salto precisa da posição da célula. */
  'editar': [alvo?: HTMLElement]
  /**
   * Tipo que salva no clique (`comoSalva: 'imediato'`) não abre editor: ele
   * troca o valor na hora. É o caso do booleano.
   */
  'alternar': [unknown]
}>()

const vazio = computed(() => estaVazio(props.valor))
const naCelula = computed(() => props.formato === 'celula')

const lista = computed(
  () => (todasAsOpcoes as Record<string, readonly { value: string, label: string, cor?: string }[]>)[props.campo.refId],
)

/** Quantos valores a lista mostra antes de virar contador. */
const limite = computed(() => {
  if (!naCelula.value) return props.campo.maximoNaCelula ? props.campo.maximoNaCelula + 3 : 99
  return props.campo.maximoNaCelula ?? 99
})

/** O texto completo, para o tooltip e para o leitor de tela. */
const textoCompleto = computed(() =>
  saidaFormatada(props.campo, props.valor, props.idioma, todasAsOpcoes as never),
)

/* --------------------------- atalhos por família -------------------------- */

const comoLista = computed<string[]>(() => (Array.isArray(props.valor) ? (props.valor as string[]) : []))
const visiveis = computed(() => comoLista.value.slice(0, limite.value))
const sobrando = computed(() => Math.max(0, comoLista.value.length - visiveis.value.length))

const comoRelacao = computed(() => props.valor as { id: number, display: string, reference: string })
const relacoes = computed(() => (props.valor as { id: number, display: string, reference: string }[]) ?? [])
const relacoesVisiveis = computed(() => relacoes.value.slice(0, limite.value))
const relacoesSobrando = computed(() => Math.max(0, relacoes.value.length - relacoesVisiveis.value.length))

/**
 * Anexo é LISTA, não um arquivo só: o produto aceita vários, com ordem
 * definida pela pessoa. Dado antigo, gravado como objeto único, entra aqui
 * como lista de um.
 */
interface Anexo { url: string, filename: string, mime: string, size?: number }
const comoAnexos = computed<Anexo[]>(() => {
  const v = props.valor
  if (Array.isArray(v)) return v as Anexo[]
  if (v && typeof v === 'object') return [v as Anexo]
  return []
})
const comoArquivo = computed(() => comoAnexos.value[0] ?? ({} as Anexo))
const comoPessoa = computed(() => props.valor as { name: string, email?: string })
const comoEndereco = computed(() => props.valor as Record<string, string>)
const comoGrupo = computed(() => props.valor as Record<string, string>)
const comoRepetidor = computed(() => (props.valor as Record<string, unknown>[]) ?? [])
const comoConversa = computed(() => (Array.isArray(props.valor) ? props.valor : []) as { author: string, at?: string, text: string }[])
const comoAssinatura = computed(() => props.valor as { signer: string, signedAt: string })
/** Iniciais para o avatar da pessoa. */
const iniciais = computed(() =>
  comoPessoa.value?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase() ?? '',
)

/** O "ver mais" do formato cru, para texto que não cabe em três linhas. */
const expandido = ref(false)

const copiado = ref(false)
/**
 * E-mail e URL são o Texto simples com máscara. O que a máscara acrescenta na
 * leitura é o atalho de abrir: `mailto:` no e-mail, nova aba na URL.
 */
function abrirEmail(endereco: string) {
  window.open(`mailto:${endereco}`, '_blank', 'noopener')
}

/**
 * O clique no valor. No binário ele ALTERNA na hora; nos outros ele pede
 * edição e manda junto a célula que foi clicada, porque é dela que sai a
 * posição do quadro de edição.
 */
function aoClicar(e: MouseEvent) {
  if (props.campo.tipo === 'inputSwitch') {
    emit('alternar', !props.valor)
    return
  }
  const alvo = e.currentTarget as HTMLElement
  emit('editar', alvo.closest('td') ?? alvo)
}

/**
 * ───────────────── A BANDEJA DE AÇÕES DA CÉLULA ─────────────────
 *
 * O Notion mostra, no hover de qualquer célula preenchida, uma bandeja
 * flutuante com comentar e copiar, encostada na borda da célula e por cima do
 * conteúdo. Ela pediu esse gesto, e ele resolve um problema real: hoje quem
 * quer o valor em outro lugar abre o campo, seleciona o texto e copia.
 *
 * O que entra na bandeja:
 *
 * - **copiar**, em todo campo cujo valor é uma string que se cola em outro
 *   lugar. Copia a SAÍDA FORMATADA, que é o que a pessoa quer no e-mail, e é
 *   a mesma string que a ficha do campo mostra;
 * - **abrir**, nos campos com máscara de e-mail ou URL, que antes era um ícone
 *   solto na célula e agora mora aqui.
 *
 * Fica de fora o que não tem "o valor" para colar: binário, anexo e conversa.
 */
const TIPOS_SEM_BANDEJA = [
  'inputSwitch',
  'uploadFile',
  'uploadImage',
  'EnPDF',
  'EnOnlyoffice',
  'EnChats',
  'EnNotes',
  'EnESign',
  'EnRepeater',
]

const temBandeja = computed(
  () => naCelula.value && !vazio.value && !TIPOS_SEM_BANDEJA.includes(props.campo.tipo),
)

async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto)
    copiado.value = true
    setTimeout(() => { copiado.value = false }, 1400)
  }
  catch {
    /* Sem área de transferência (protótipo servido sem https, por exemplo).
       Silêncio é melhor que um erro que não ajuda ninguém. */
  }
}
</script>

<template>
  <!--
    O invólucro: na célula ele é uma linha só e corta; no cru ele respira.
    Clicar em qualquer um dos dois abre a ficha do campo, e é por isso que ele
    é um botão de verdade, com foco por teclado.
  -->
  <button
    type="button"
    class="group/valor relative -mx-1 flex w-full min-w-0 rounded px-1 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
    :class="[
      naCelula ? 'h-6 items-center' : 'items-start py-0.5',
      campo.alinhamento === 'fim' && naCelula ? 'justify-end' : '',
      /* O hover promete edição, e a edição acontece. Regra 24. Campo que o
         sistema preenche não ganha hover, porque ele não abre nada. */
      campo.somenteLeitura ? 'cursor-default' : 'cursor-text hover:bg-elevated hover:ring-1 hover:ring-default',
    ]"
    :aria-label="textoCompleto || t.vazio"
    @click="aoClicar"
  >
    <!--
      ───────────────────────────── vazio ─────────────────────────────
      Vazio fica VAZIO. O hífen que eu usava não existe na tela nova: as
      células sem valor ficam em branco mesmo. O que sobra é o alvo de clique,
      com a altura da linha, e o rótulo para quem usa leitor de tela.
      A única exceção é o booleano, que sempre tem caixa: vazio é caixa vazia.
    -->
    <span
      v-if="vazio && campo.tipo !== 'inputSwitch'"
      class="sr-only"
    >{{ t.vazio }}</span>

    <!-- ──────────────────────── texto simples ─────────────────────────── -->
    <span
      v-else-if="campo.tipo === 'inputText'"
      class="min-w-0 text-sm text-highlighted"
      :class="naCelula ? 'truncate' : ''"
      :title="naCelula ? String(valor) : undefined"
    >{{ valor }}</span>

    <!-- texto longo: uma linha na célula, três no cru -->
    <span
      v-else-if="campo.tipo === 'EnTextArea'"
      class="min-w-0 text-sm text-highlighted"
      :class="naCelula ? 'truncate' : (expandido ? '' : 'line-clamp-3')"
      :title="naCelula ? String(valor) : undefined"
    >
      {{ valor }}
      <span
        v-if="!naCelula && String(valor).length > 140"
        class="ml-1 whitespace-nowrap text-xs text-primary underline"
        @click.stop="expandido = !expandido"
      >{{ expandido ? t.verMenos : t.verMais }}</span>
    </span>

    <!-- texto rico: sem tags na célula, formatado no cru -->
    <span
      v-else-if="campo.tipo === 'EnHtml'"
      class="min-w-0 text-sm text-highlighted"
      :class="naCelula ? 'truncate' : 'line-clamp-3 [&_strong]:font-semibold [&_em]:italic'"
      :title="naCelula ? semTags(String(valor)) : undefined"
    >
      <template v-if="naCelula">{{ semTags(String(valor)) }}</template>
      <!-- eslint-disable-next-line vue/no-v-html -- conteúdo do mocks.ts, escrito à mão -->
      <span v-else v-html="valor" />
    </span>

    <!-- máscara, código e e-mail: fonte tabular e botão de copiar -->
    <span
      v-else-if="campo.tipo === 'EnlMask' || campo.tipo === 'EnCustomCode' || campo.tipo === 'email'"
      class="flex min-w-0 items-center gap-1"
    >
      <span
        class="min-w-0 truncate text-sm tabular-nums"
        :class="campo.tipo === 'email' ? 'text-primary underline decoration-dotted' : 'text-highlighted'"
      >{{ valor }}</span>
    </span>

    <!-- ───────────────────────────── número ───────────────────────────── -->
    <span
      v-else-if="campo.tipo === 'EnlNumber'"
      class="text-sm tabular-nums text-highlighted"
    >{{ textoCompleto }}</span>

    <!--
      Moeda: o símbolo sai da moeda GRAVADA NO VALOR, não do idioma de quem lê.
      Quando o valor foi corrigido, a célula marca isso, e o cru mostra o
      valor original ao lado, porque `originalValue` existe justamente para
      não se perder o que foi digitado.
    -->
    <span
      v-else-if="campo.tipo === 'EnCurrency'"
      class="flex min-w-0 items-baseline justify-end gap-1.5"
    >
      <UTooltip v-if="foiCorrigido(valor)" :text="t.valorCorrigido">
        <UIcon name="i-lucide-trending-up" class="size-3 shrink-0 text-info" />
      </UTooltip>
      <span class="text-sm tabular-nums text-highlighted">{{ textoCompleto }}</span>
      <span
        v-if="!naCelula && foiCorrigido(valor)"
        class="shrink-0 text-xs tabular-nums text-muted line-through"
      >
        {{ moedaOriginalFormatada(valor, campo.localeDoCampo ?? 'pt-BR') }}
      </span>
    </span>

    <!-- ──────────────────────── escolha: os selos ─────────────────────── -->
    <!--
      ─────────────────────── escolha única: o selo largo ──────────────────
      Ela pediu que ocupasse boa parte da coluna, para destacar mesmo. Então o
      selo é um bloco de largura cheia, com o rótulo à esquerda e o chevron à
      direita, como no exemplo do Figma. O chevron diz que ali se troca.
    -->
    <span
      v-else-if="campo.tipo === 'EnlDropdown' || campo.tipo === 'radioButton'"
      class="flex w-full min-w-0 items-center justify-between gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
      :class="{
        'bg-primary/10 text-primary': corDaOpcao(lista, String(valor)) === 'primary',
        'bg-info/10 text-info': corDaOpcao(lista, String(valor)) === 'info',
        'bg-success/10 text-success': corDaOpcao(lista, String(valor)) === 'success',
        'bg-warning/10 text-warning': corDaOpcao(lista, String(valor)) === 'warning',
        'bg-error/10 text-error': corDaOpcao(lista, String(valor)) === 'error',
        'bg-elevated text-toned': corDaOpcao(lista, String(valor)) === 'neutral',
      }"
    >
      <span class="min-w-0 truncate">{{ rotuloDaOpcao(lista, String(valor)) }}</span>
      <UIcon name="i-lucide-chevron-down" class="size-3.5 shrink-0 opacity-60" />
    </span>

    <span
      v-else-if="campo.tipo === 'multiSelect' || campo.tipo === 'checkbox' || campo.tipo === 'EnlCheckbox'"
      class="flex min-w-0 items-center gap-1"
      :class="naCelula ? '' : 'flex-wrap'"
    >
      <UBadge
        v-for="v in visiveis"
        :key="v"
        :color="corDaOpcao(lista, v) as never"
        variant="subtle"
        size="sm"
        class="max-w-[12rem] truncate"
      >
        {{ rotuloDaOpcao(lista, v) }}
      </UBadge>
      <UTooltip v-if="sobrando" :text="textoCompleto">
        <UBadge color="neutral" variant="soft" size="sm">{{ t.maisN(sobrando) }}</UBadge>
      </UTooltip>
    </span>

    <span
      v-else-if="campo.tipo === 'EnlChips'"
      class="flex min-w-0 items-center gap-1"
      :class="naCelula ? '' : 'flex-wrap'"
    >
      <UBadge v-for="v in visiveis" :key="v" color="neutral" variant="outline" size="sm">
        {{ v }}
      </UBadge>
      <UTooltip v-if="sobrando" :text="textoCompleto">
        <UBadge color="neutral" variant="soft" size="sm">{{ t.maisN(sobrando) }}</UBadge>
      </UTooltip>
    </span>

    <!-- árvore: a folha na célula, o caminho inteiro no cru -->
    <UTooltip v-else-if="campo.tipo === 'EnTreeSelect'" :text="textoCompleto">
      <UBadge color="neutral" variant="subtle" size="sm">
        {{ naCelula ? textoCompleto.split(' / ').at(-1) : textoCompleto }}
      </UBadge>
    </UTooltip>

    <!--
      ──────────────────────────── booleano ────────────────────────────
      Uma caixa, vazia ou marcada, e clicar alterna na hora. Não é "Sim/Não"
      em texto: Notion, Airtable, ClickUp e Monday mostram caixa, e é isso que
      a pessoa reconhece. O clique alterna porque o tipo salva no clique.
    -->
    <span v-else-if="campo.tipo === 'inputSwitch'" class="flex items-center">
      <span
        class="flex size-4 shrink-0 items-center justify-center rounded border transition-colors"
        :class="valor
          ? 'border-primary bg-primary text-inverted'
          : 'border-default bg-default group-hover/valor:border-primary/50'"
        :aria-label="valor ? t.sim : t.nao"
      >
        <UIcon v-if="valor" name="i-lucide-check" class="size-3" />
      </span>
    </span>

    <!-- ──────────────────────────── data/hora ─────────────────────────── -->
    <span v-else-if="campo.tipo === 'EnlCalendar'" class="flex min-w-0 items-baseline gap-1.5">
      <span
        class="shrink-0 text-sm tabular-nums"
        :class="estaVencida(String(valor)) ? 'text-error' : 'text-highlighted'"
      >
        {{ naCelula ? formatarDataCurta(String(valor), idioma) : formatarDataMedia(String(valor), idioma) }}
      </span>
      <span v-if="!naCelula && relativoEmDias(String(valor), idioma)" class="truncate text-xs text-muted">
        {{ relativoEmDias(String(valor), idioma) }}
      </span>
    </span>

    <!-- ──────────────────────────── relações ──────────────────────────── -->
    <UBadge
      v-else-if="campo.tipo === 'EnRel'"
      color="primary"
      variant="subtle"
      size="sm"
      class="max-w-full truncate"
      :class="comoRelacao.display?.trim() ? '' : 'font-mono text-[11px]'"
    >
      <UIcon name="i-lucide-link" class="size-3 shrink-0" />
      {{ comoRelacao.display?.trim() ? comoRelacao.display : comoRelacao.reference }}
    </UBadge>

    <span
      v-else-if="campo.tipo === 'EnRelMulti'"
      class="flex min-w-0 items-center gap-1"
      :class="naCelula ? '' : 'flex-wrap'"
    >
      <UBadge
        v-for="r in relacoesVisiveis"
        :key="r.id"
        color="primary"
        variant="subtle"
        size="sm"
        class="max-w-[12rem] truncate"
      >
        {{ r.display?.trim() ? r.display : r.reference }}
      </UBadge>
      <UTooltip v-if="relacoesSobrando" :text="textoCompleto">
        <UBadge color="neutral" variant="soft" size="sm">{{ t.maisN(relacoesSobrando) }}</UBadge>
      </UTooltip>
    </span>

    <!-- ───────────────────────────── pessoa ───────────────────────────── -->
    <span v-else-if="campo.tipo === 'EnPerson'" class="flex min-w-0 items-center gap-2">
      <UAvatar size="2xs" :text="iniciais" :alt="comoPessoa.name" />
      <span class="min-w-0">
        <span class="block truncate text-sm text-highlighted">{{ comoPessoa.name }}</span>
        <span v-if="!naCelula && comoPessoa.email" class="block truncate text-xs text-muted">
          {{ comoPessoa.email }}
        </span>
      </span>
    </span>

    <!-- ──────────────────────────── endereço ──────────────────────────── -->
    <span v-else-if="campo.tipo === 'EnAddress'" class="flex min-w-0 items-start gap-1.5">
      <UIcon v-if="!naCelula" name="i-lucide-map-pin" class="mt-0.5 size-3.5 shrink-0 text-dimmed" />
      <span v-if="naCelula" class="min-w-0 truncate text-sm text-highlighted" :title="enderecoEmUmaLinha(comoEndereco)">
        {{ enderecoEmUmaLinha(comoEndereco) }}
      </span>
      <span v-else class="min-w-0 text-sm text-highlighted">
        <span class="block">{{ [comoEndereco.street, comoEndereco.number, comoEndereco.complement].filter(Boolean).join(', ') }}</span>
        <span class="block text-muted">{{ [comoEndereco.zip, comoEndereco.city, comoEndereco.state].filter(Boolean).join(' ') }}</span>
      </span>
    </span>

    <!-- ──────────────────────────── arquivos ──────────────────────────── -->
    <span
      v-else-if="campo.tipo === 'uploadImage'"
      class="flex min-w-0 items-center gap-2"
    >
      <!--
        A miniatura é um bloco de cor com a inicial do formato, e não a imagem:
        o protótipo não carrega arquivo de fora (regra 4). Na implementação é a
        própria imagem, servida pela url do campo.
      -->
      <span
        class="flex shrink-0 items-center justify-center rounded bg-accented text-[9px] font-semibold uppercase text-muted"
        :class="naCelula ? 'size-5' : 'size-10'"
      >
        {{ comoArquivo.filename.split('.').at(-1) }}
      </span>
      <span class="min-w-0">
        <span class="block truncate text-sm text-highlighted">{{ comoArquivo.filename }}</span>
        <span v-if="!naCelula && comoArquivo.size" class="block text-xs text-muted">{{ formatarBytes(comoArquivo.size, idioma) }}</span>
      </span>
      <UBadge v-if="comoAnexos.length > 1" color="neutral" variant="soft" size="sm">
        {{ t.maisN(comoAnexos.length - 1) }}
      </UBadge>
    </span>

    <span
      v-else-if="campo.tipo === 'uploadFile' || campo.tipo === 'EnPDF' || campo.tipo === 'EnOnlyoffice'"
      class="flex min-w-0 items-center gap-1.5"
    >
      <UBadge color="neutral" variant="subtle" size="sm" class="max-w-full">
        <UIcon :name="campo.icone" class="size-3 shrink-0" />
        <span class="truncate">{{ comoArquivo.filename }}</span>
      </UBadge>
      <UBadge v-if="comoAnexos.length > 1" color="neutral" variant="soft" size="sm">
        {{ t.maisN(comoAnexos.length - 1) }}
      </UBadge>
      <span v-if="!naCelula && comoArquivo.size" class="shrink-0 text-xs text-muted">
        {{ formatarBytes(comoArquivo.size, idioma) }}
      </span>
    </span>

    <span v-else-if="campo.tipo === 'EnESign'" class="flex min-w-0 items-center gap-1.5">
      <UIcon name="i-lucide-signature" class="size-3.5 shrink-0 text-success" />
      <span class="min-w-0 truncate text-sm text-highlighted">{{ comoAssinatura.signer }}</span>
      <span v-if="!naCelula" class="shrink-0 text-xs text-muted">
        {{ formatarDataMedia(comoAssinatura.signedAt, idioma) }}
      </span>
    </span>

    <!-- ──────────────────────────── compostos ─────────────────────────── -->
    <span v-else-if="campo.tipo === 'EnRepeater'" class="flex min-w-0 items-center gap-1.5">
      <span class="min-w-0 truncate text-sm text-highlighted">
        {{ String(Object.values(comoRepetidor[0] ?? {})[0] ?? '') }}
      </span>
      <UBadge v-if="comoRepetidor.length > 1" color="neutral" variant="soft" size="sm">
        {{ t.maisN(comoRepetidor.length - 1) }}
      </UBadge>
    </span>

    <span v-else-if="campo.tipo === 'group'" class="min-w-0">
      <span v-if="naCelula" class="block truncate text-sm text-highlighted">
        {{ Object.values(comoGrupo).filter(Boolean)[0] }}
      </span>
      <span v-else class="block space-y-0.5">
        <span v-for="(v, k) in comoGrupo" :key="k" class="flex gap-1.5 text-sm">
          <span class="shrink-0 text-muted">{{ k }}</span>
          <span class="min-w-0 truncate text-highlighted">{{ v }}</span>
        </span>
      </span>
    </span>

    <!--
      Conversa na célula: o ícone é o alvo, como no develop (a coluna mostra só
      um ícone de balão). Clicar abre o compositor sobre a célula. Com
      mensagem, o ícone vem com o contador e a última linha ao lado.
    -->
    <span v-else-if="campo.tipo === 'EnChats' || campo.tipo === 'EnNotes'" class="flex min-w-0 items-center gap-1.5">
      <UChip
        :show="comoConversa.length > 0"
        :text="comoConversa.length"
        size="sm"
        color="primary"
      >
        <span class="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UIcon name="i-lucide-message-square" class="size-3.5" />
        </span>
      </UChip>
      <span v-if="!naCelula && comoConversa.length" class="min-w-0 truncate text-sm text-highlighted">
        {{ comoConversa.at(-1)?.text }}
      </span>
    </span>

    <span v-else-if="campo.tipo === 'valorDinamico'" class="flex min-w-0 items-center gap-1.5">
      <UIcon name="i-lucide-function-square" class="size-3.5 shrink-0 text-dimmed" />
      <span class="min-w-0 truncate text-sm text-highlighted">{{ valor }}</span>
    </span>

    <!-- qualquer coisa que escape das regras acima aparece como texto -->
    <span v-else class="min-w-0 truncate text-sm text-highlighted">{{ textoCompleto }}</span>

    <!--
      A bandeja flutuante, encostada na borda da célula e por cima do conteúdo.
      Em coluna alinhada à direita ela vai para a ESQUERDA, senão taparia o
      número, que é justamente o que se quer ler.
    -->
    <span
      v-if="temBandeja"
      class="absolute top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 rounded-md bg-default p-0.5 opacity-0 shadow-sm ring-1 ring-default transition-opacity group-hover/valor:opacity-100"
      :class="campo.alinhamento === 'fim' ? 'left-0' : 'right-0'"
    >
      <UIcon
        v-if="campo.tipo === 'email'"
        name="i-lucide-external-link"
        class="size-4 cursor-pointer rounded p-0.5 text-dimmed hover:bg-elevated hover:text-highlighted"
        :aria-label="t.abrir"
        @click.stop="abrirEmail(String(valor))"
      />
      <UIcon
        :name="copiado ? 'i-lucide-check' : 'i-lucide-copy'"
        class="size-4 cursor-pointer rounded p-0.5"
        :class="copiado ? 'text-success' : 'text-dimmed hover:bg-elevated hover:text-highlighted'"
        :aria-label="t.copiar"
        @click.stop="copiar(textoCompleto)"
      />
    </span>
  </button>
</template>
