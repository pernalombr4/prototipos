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
  editar: []
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

const comoArquivo = computed(() => props.valor as { url: string, filename: string, mime: string, size: number })
const comoPessoa = computed(() => props.valor as { name: string, email?: string })
const comoEndereco = computed(() => props.valor as Record<string, string>)
const comoGrupo = computed(() => props.valor as Record<string, string>)
const comoRepetidor = computed(() => (props.valor as Record<string, unknown>[]) ?? [])
const comoConversa = computed(() => (props.valor as { author: string, text: string }[]) ?? [])
const comoAssinatura = computed(() => props.valor as { signer: string, signedAt: string })
const comoIntervalo = computed(() => props.valor as { start: string, end: string })
const comoPeriodo = computed(() => props.valor as { start: string, end: string })

/** Quantos dias o período cobre, contando as duas pontas. */
const diasDoPeriodo = computed(() => {
  const p = comoPeriodo.value
  if (!p?.start || !p?.end) return 0
  return Math.round((new Date(p.end).getTime() - new Date(p.start).getTime()) / 86400000) + 1
})

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
    class="group/valor -mx-1 flex w-full min-w-0 rounded px-1 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
    :class="[
      naCelula ? 'h-6 items-center' : 'items-start py-0.5',
      campo.alinhamento === 'fim' && naCelula ? 'justify-end' : '',
      /* O hover promete edição, e a edição acontece. Regra 24. Campo que o
         sistema preenche não ganha hover, porque ele não abre nada. */
      campo.somenteLeitura ? 'cursor-default' : 'cursor-text hover:bg-elevated hover:ring-1 hover:ring-default',
    ]"
    :aria-label="textoCompleto || t.vazio"
    @click="emit('editar')"
  >
    <!-- ───────────────────────────── vazio ───────────────────────────── -->
    <span v-if="vazio" class="text-sm text-dimmed">
      {{ naCelula ? '-' : t.vazio }}
    </span>

    <!-- ──────────────────────── texto simples ─────────────────────────── -->
    <span
      v-else-if="campo.tipo === 'inputText' || campo.tipo === 'EnNotes'"
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
      <UIcon
        :name="copiado ? 'i-lucide-check' : 'i-lucide-copy'"
        class="size-3 shrink-0 text-dimmed opacity-0 transition-opacity group-hover/valor:opacity-100"
        :aria-label="t.copiar"
        @click.stop="copiar(String(valor))"
      />
    </span>

    <!-- ───────────────────────────── número ───────────────────────────── -->
    <span
      v-else-if="campo.tipo === 'EnlNumber' || campo.tipo === 'EnCurrency'"
      class="text-sm tabular-nums text-highlighted"
    >{{ textoCompleto }}</span>

    <!-- ──────────────────────── escolha: os selos ─────────────────────── -->
    <UBadge
      v-else-if="campo.tipo === 'EnlDropdown' || campo.tipo === 'radioButton'"
      :color="corDaOpcao(lista, String(valor)) as never"
      variant="subtle"
      size="sm"
      class="max-w-full truncate"
    >
      {{ rotuloDaOpcao(lista, String(valor)) }}
    </UBadge>

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

    <!-- ──────────────────────────── booleano ──────────────────────────── -->
    <span v-else-if="campo.tipo === 'inputSwitch'" class="flex items-center gap-1.5">
      <span
        class="size-1.5 shrink-0 rounded-full"
        :class="valor ? 'bg-success' : 'bg-muted'"
      />
      <span class="text-sm text-highlighted">{{ valor ? t.sim : t.nao }}</span>
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

    <span v-else-if="campo.tipo === 'EnlTimeRange'" class="flex items-baseline gap-1.5">
      <span class="text-sm tabular-nums text-highlighted">
        {{ comoIntervalo.start }} {{ '→' }} {{ comoIntervalo.end }}
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
        <span v-if="!naCelula" class="block text-xs text-muted">{{ formatarBytes(comoArquivo.size, idioma) }}</span>
      </span>
    </span>

    <span
      v-else-if="campo.tipo === 'uploadFile' || campo.tipo === 'EnPDF' || campo.tipo === 'EnOnlyoffice'"
      class="flex min-w-0 items-center gap-1.5"
    >
      <UBadge color="neutral" variant="subtle" size="sm" class="max-w-full">
        <UIcon :name="campo.icone" class="size-3 shrink-0" />
        <span class="truncate">{{ comoArquivo.filename }}</span>
      </UBadge>
      <span v-if="!naCelula" class="shrink-0 text-xs text-muted">
        {{ formatarBytes(comoArquivo.size, idioma) }}
      </span>
      <UIcon
        v-if="!naCelula"
        name="i-lucide-download"
        class="size-3.5 shrink-0 text-dimmed opacity-0 transition-opacity group-hover/valor:opacity-100"
        :aria-label="t.baixar"
      />
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

    <span v-else-if="campo.tipo === 'EnChats'" class="flex min-w-0 items-center gap-1.5">
      <UIcon name="i-lucide-message-square" class="size-3.5 shrink-0 text-dimmed" />
      <span class="min-w-0 truncate text-sm text-highlighted">
        {{ comoConversa.at(-1)?.text }}
      </span>
      <UBadge color="neutral" variant="soft" size="sm">{{ comoConversa.length }}</UBadge>
    </span>

    <!--
      Duração: as duas datas. NÃO é HH:MM:SS, que é o que o documento do time
      de produtos escreveu. Ver a divergência no DECISOES.md.
    -->
    <span v-else-if="campo.tipo === '__duracao_antigo'" class="flex min-w-0 items-baseline gap-1.5">
      <span class="shrink-0 text-sm tabular-nums text-highlighted">
        {{ formatarDataCurta(comoPeriodo.start, idioma) }} {{ naCelula ? '→' : 'a' }}
        {{ formatarDataCurta(comoPeriodo.end, idioma) }}
      </span>
      <span v-if="!naCelula && diasDoPeriodo" class="shrink-0 text-xs text-muted">
        {{ diasDoPeriodo }}d
      </span>
    </span>

    <span v-else-if="campo.tipo === 'valorDinamico'" class="flex min-w-0 items-center gap-1.5">
      <UIcon name="i-lucide-function-square" class="size-3.5 shrink-0 text-dimmed" />
      <span class="min-w-0 truncate text-sm text-highlighted">{{ valor }}</span>
    </span>

    <!-- qualquer coisa que escape das regras acima aparece como texto -->
    <span v-else class="min-w-0 truncate text-sm text-highlighted">{{ textoCompleto }}</span>
  </button>
</template>
