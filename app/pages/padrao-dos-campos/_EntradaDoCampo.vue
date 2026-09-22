<script setup lang="ts">
/**
 * A ENTRADA de um campo: o formato "formulário".
 *
 * Um componente só, com uma regra por tipo, servindo os dois lugares onde o
 * valor é ESCRITO: o modal de criação e a coluna 2 da sidebar. É o par do
 * `_ValorDoCampo.vue`, que serve os dois lugares onde o valor é lido.
 *
 * O que funciona de verdade aqui (regra 5): digitar, escolher, marcar, somar e
 * limpar mexem no objeto em memória e o resultado aparece na tabela na hora.
 * O que é maquete: o seletor de arquivo não carrega arquivo nenhum, o editor
 * de documentos não abre editor e o chat não recebe mensagem. Está declarado
 * no DECISOES.md.
 */
import type { Campo } from './campos'
import type { Textos } from './textos'
import { itensRelacionaveis, membros, opcoes as todasAsOpcoes } from './mocks'

const props = defineProps<{
  campo: Campo
  modelValue: unknown
  t: Textos
  idioma: string
  /** No modal de criação alguns tipos ainda não existem. */
  naCriacao?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [unknown], 'inspecionar': [] }>()

const valor = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

/**
 * Proxies tipados do mesmo valor.
 *
 * O `v-model` do Vue não aceita expressão com `as` (não dá para atribuir a um
 * cast), então cada família ganha a sua própria porta de entrada para o mesmo
 * `valor`. Continua sendo um estado só.
 */
const comoTexto = computed<string>({
  get: () => (valor.value ?? '') as string,
  set: v => emit('update:modelValue', v),
})

const comoNumero = computed<number>({
  get: () => (valor.value ?? 0) as number,
  set: v => emit('update:modelValue', v),
})

const comoBooleano = computed<boolean>({
  get: () => Boolean(valor.value),
  set: v => emit('update:modelValue', v),
})

const comoListaDeTexto = computed<string[]>({
  get: () => (valor.value ?? []) as string[],
  set: v => emit('update:modelValue', v),
})

const lista = computed(
  () => (todasAsOpcoes as Record<string, readonly { value: string, label: string, cor?: string }[]>)[props.campo.refId] ?? [],
)

/** O radio vira lista suspensa acima de cinco opções. Regra do catálogo. */
const radioViraLista = computed(() => lista.value.length > 5)
/** A lista ganha busca a partir de dez opções. Regra do catálogo. */
const comBusca = computed(() => lista.value.length >= 10)

const rotuloDoTipo = computed(() => props.t.campos[props.campo.tipo].rotulo)

/** Tipos que não se preenchem na criação: o valor nasce depois do item. */
const soDepoisDeSalvar = computed(
  () => props.campo.tipo === 'EnCustomCode' || props.campo.tipo === 'EnChats' || props.campo.tipo === 'EnOnlyoffice',
)

/* ------------------------------- compostos ------------------------------- */

const endereco = computed({
  get: () => (valor.value as Record<string, string>) ?? {},
  set: v => emit('update:modelValue', v),
})

function mudarSubcampo(chave: string, novo: string) {
  emit('update:modelValue', { ...(valor.value as Record<string, string> ?? {}), [chave]: novo })
}

const linhasDoRepetidor = computed(() => (valor.value as Record<string, unknown>[]) ?? [])

function acrescentarLinha() {
  emit('update:modelValue', [...linhasDoRepetidor.value, { item: '', quantidade: 0 }])
}

function removerLinha(i: number) {
  emit('update:modelValue', linhasDoRepetidor.value.filter((_, j) => j !== i))
}

function mudarLinha(i: number, chave: string, novo: unknown) {
  emit(
    'update:modelValue',
    linhasDoRepetidor.value.map((l, j) => (j === i ? { ...l, [chave]: novo } : l)),
  )
}

const arquivo = computed(() => valor.value as { filename: string, size: number } | null)

function simularAnexo() {
  emit('update:modelValue', {
    url: 'https://exemplo.invalido/anexo-do-prototipo.pdf',
    filename: 'anexo-do-prototipo.pdf',
    mime: 'application/pdf',
    size: 128400,
  })
}

const pessoaEscolhida = computed({
  get: () => (valor.value as { name: string } | null)?.name ?? '',
  set: (nome: string) => {
    const m = membros.find(x => x.nome === nome)
    emit('update:modelValue', m ? { name: m.nome, email: m.email } : null)
  },
})

const relacaoEscolhida = computed({
  get: () => {
    const v = valor.value as { reference: string } | null
    return v?.reference ?? ''
  },
  set: (ref: string) => {
    const i = itensRelacionaveis.find(x => x.reference === ref)
    emit('update:modelValue', i ?? null)
  },
})

const relacoesEscolhidas = computed({
  get: () => ((valor.value as { reference: string }[]) ?? []).map(v => v.reference),
  set: (refs: string[]) => {
    emit(
      'update:modelValue',
      refs.map(r => itensRelacionaveis.find(x => x.reference === r)).filter(Boolean),
    )
  },
})

const opcoesDeRelacao = computed(() =>
  itensRelacionaveis.map(i => ({
    /* Display vazio cai para a referência. É a mesma regra da célula. */
    label: i.display?.trim() ? i.display : i.reference,
    value: i.reference,
  })),
)
</script>

<template>
  <!--
    O rótulo é um botão: clicar nele abre a ficha do campo. O controle fica
    livre para ser controle, e quem quer entender a regra tem um alvo claro.
  -->
  <div class="min-w-0">
    <button
      type="button"
      class="group/rotulo mb-1 flex items-center gap-1.5 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      @click="emit('inspecionar')"
    >
      <UIcon :name="campo.icone" class="size-3.5 shrink-0 text-dimmed" />
      <span class="text-sm font-medium text-highlighted">{{ rotuloDoTipo }}</span>
      <UIcon
        name="i-lucide-info"
        class="size-3 shrink-0 text-dimmed opacity-0 transition-opacity group-hover/rotulo:opacity-100"
      />
    </button>

    <!-- ───────────────── o que só existe depois de salvar ───────────────── -->
    <div
      v-if="soDepoisDeSalvar && naCriacao"
      class="flex items-center gap-2 rounded-md border border-dashed border-default px-3 py-2 text-sm text-muted"
    >
      <UIcon name="i-lucide-clock-3" class="size-4 shrink-0" />
      <span>{{ t.campos[campo.tipo].formulario }}</span>
    </div>

    <!-- ───────────────────────────── texto ──────────────────────────────── -->
    <UInput
      v-else-if="campo.tipo === 'inputText'"
      v-model="comoTexto"
      size="sm"
      class="w-full"
      :maxlength="120"
      :placeholder="t.campos[campo.tipo].descricao"
    />

    <UTextarea
      v-else-if="campo.tipo === 'EnTextArea' || campo.tipo === 'EnNotes'"
      v-model="comoTexto"
      size="sm"
      class="w-full"
      :rows="3"
      :maxrows="6"
      autoresize
    />

    <!--
      O editor de texto rico do Nuxt UI existe (`UEditor`), mas ele carrega o
      TipTap inteiro e o que está em discussão aqui é a MOLDURA do campo, não
      o editor. A barra falsa mostra a altura e o peso que o campo ocupa.
      Declarado como maquete no DECISOES.md.
    -->
    <div v-else-if="campo.tipo === 'EnHtml'" class="rounded-md border border-default">
      <div class="flex items-center gap-0.5 border-b border-default px-1.5 py-1">
        <UIcon
          v-for="i in ['i-lucide-bold', 'i-lucide-italic', 'i-lucide-list', 'i-lucide-link', 'i-lucide-heading-2']"
          :key="i"
          :name="i"
          class="size-4 rounded p-0.5 text-muted hover:bg-elevated"
        />
      </div>
      <UTextarea
        v-model="comoTexto"
        variant="none"
        size="sm"
        class="w-full"
        :rows="3"
        autoresize
      />
    </div>

    <UInput
      v-else-if="campo.tipo === 'EnlMask'"
      v-model="comoTexto"
      size="sm"
      class="w-full font-mono tabular-nums"
      placeholder="00.000.000/0000-00"
    />

    <UInput
      v-else-if="campo.tipo === 'email'"
      v-model="comoTexto"
      type="email"
      size="sm"
      class="w-full"
      icon="i-lucide-at-sign"
      placeholder="nome@empresa.com.br"
    />

    <UInput
      v-else-if="campo.tipo === 'EnCustomCode'"
      :model-value="valor as string"
      size="sm"
      class="w-full font-mono"
      disabled
    />

    <!-- ───────────────────────────── número ─────────────────────────────── -->
    <UInputNumber
      v-else-if="campo.tipo === 'EnlNumber'"
      v-model="comoNumero"
      size="sm"
      class="w-full"
      :step="0.5"
    />

    <UInput
      v-else-if="campo.tipo === 'EnCurrency'"
      v-model="comoNumero"
      type="number"
      size="sm"
      class="w-full"
      :ui="{ base: 'text-right tabular-nums' }"
    >
      <template #leading>
        <span class="text-sm text-muted">{{ idioma === 'en' ? '$' : idioma === 'es' ? '€' : 'R$' }}</span>
      </template>
    </UInput>

    <!-- ───────────────────────────── escolha ────────────────────────────── -->
    <USelectMenu
      v-else-if="campo.tipo === 'EnlDropdown' || (campo.tipo === 'radioButton' && radioViraLista)"
      v-model="comoTexto"
      :items="lista.map(o => ({ label: o.label, value: o.value }))"
      value-key="value"
      size="sm"
      class="w-full"
      :search-input="comBusca ? { placeholder: t.pesquisar } : false"
    />

    <URadioGroup
      v-else-if="campo.tipo === 'radioButton'"
      v-model="comoTexto"
      :items="lista.map(o => ({ label: o.label, value: o.value }))"
      size="sm"
    />

    <USelectMenu
      v-else-if="campo.tipo === 'multiSelect'"
      v-model="comoListaDeTexto"
      multiple
      :items="lista.map(o => ({ label: o.label, value: o.value }))"
      value-key="value"
      size="sm"
      class="w-full"
      :search-input="{ placeholder: t.pesquisar }"
    />

    <div v-else-if="campo.tipo === 'checkbox' || campo.tipo === 'EnlCheckbox'" class="space-y-2">
      <UCheckbox
        v-for="o in lista"
        :key="o.value"
        :model-value="((valor as string[]) ?? []).includes(o.value)"
        :label="o.label"
        size="sm"
        :ui="{ label: 'leading-snug' }"
        @update:model-value="(m: boolean | 'indeterminate') => emit('update:modelValue', m === true
          ? [...((valor as string[]) ?? []), o.value]
          : ((valor as string[]) ?? []).filter(v => v !== o.value))"
      />
    </div>

    <UInputTags
      v-else-if="campo.tipo === 'EnlChips'"
      v-model="comoListaDeTexto"
      size="sm"
      class="w-full"
    />

    <USelectMenu
      v-else-if="campo.tipo === 'EnTreeSelect'"
      v-model="comoTexto"
      :items="lista.flatMap(o => [
        { label: o.label, value: o.value },
        ...((o as { children?: { label: string, value: string }[] }).children ?? []).map(c => ({ label: `  ${c.label}`, value: c.value })),
      ])"
      value-key="value"
      size="sm"
      class="w-full"
    />

    <!-- ──────────────────────────── booleano ────────────────────────────── -->
    <USwitch
      v-else-if="campo.tipo === 'inputSwitch'"
      v-model="comoBooleano"
      :label="valor ? t.sim : t.nao"
      size="sm"
    />

    <!-- ──────────────────────────── data/hora ───────────────────────────── -->
    <UInput
      v-else-if="campo.tipo === 'EnlCalendar'"
      :model-value="valor ? String(valor).slice(0, 10) : ''"
      type="date"
      size="sm"
      class="w-full"
      @update:model-value="(v: string | number) => emit('update:modelValue', v ? `${v}T12:00:00.000Z` : null)"
    />

    <div v-else-if="campo.tipo === 'EnlTimeRange'" class="flex items-center gap-2">
      <UInput
        :model-value="(valor as { start?: string })?.start ?? ''"
        type="time"
        size="sm"
        @update:model-value="(v: string | number) => mudarSubcampo('start', String(v))"
      />
      <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0 text-dimmed" />
      <UInput
        :model-value="(valor as { end?: string })?.end ?? ''"
        type="time"
        size="sm"
        @update:model-value="(v: string | number) => mudarSubcampo('end', String(v))"
      />
    </div>

    <!-- ──────────────────────────── relações ────────────────────────────── -->
    <div v-else-if="campo.tipo === 'EnRel'" class="flex items-center gap-1.5">
      <USelectMenu
        v-model="relacaoEscolhida"
        :items="opcoesDeRelacao"
        value-key="value"
        size="sm"
        class="min-w-0 flex-1"
        :search-input="{ placeholder: t.pesquisar }"
      />
      <UButton icon="i-lucide-plus" color="neutral" variant="outline" size="sm" :aria-label="t.criar" />
    </div>

    <USelectMenu
      v-else-if="campo.tipo === 'EnRelMulti'"
      v-model="relacoesEscolhidas"
      multiple
      :items="opcoesDeRelacao"
      value-key="value"
      size="sm"
      class="w-full"
      :search-input="{ placeholder: t.pesquisar }"
    />

    <!-- ───────────────────────────── pessoa ─────────────────────────────── -->
    <div v-else-if="campo.tipo === 'EnPerson'" class="rounded-md border border-default p-3">
      <USelectMenu
        v-model="pessoaEscolhida"
        :items="membros.map(m => ({ label: m.nome, value: m.nome }))"
        value-key="value"
        size="sm"
        class="w-full"
      />
      <p class="mt-2 text-xs text-muted">
        {{ t.campos.EnPerson.formulario }}
      </p>
    </div>

    <!-- ──────────────────────────── endereço ────────────────────────────── -->
    <div v-else-if="campo.tipo === 'EnAddress'" class="grid grid-cols-6 gap-2 rounded-md border border-default p-3">
      <UInput
        :model-value="endereco.zip ?? ''"
        size="sm"
        class="col-span-2"
        placeholder="00000-000"
        @update:model-value="(v: string | number) => mudarSubcampo('zip', String(v))"
      />
      <UInput
        :model-value="endereco.street ?? ''"
        size="sm"
        class="col-span-4"
        @update:model-value="(v: string | number) => mudarSubcampo('street', String(v))"
      />
      <UInput
        :model-value="endereco.number ?? ''"
        size="sm"
        class="col-span-1"
        @update:model-value="(v: string | number) => mudarSubcampo('number', String(v))"
      />
      <UInput
        :model-value="endereco.complement ?? ''"
        size="sm"
        class="col-span-2"
        @update:model-value="(v: string | number) => mudarSubcampo('complement', String(v))"
      />
      <UInput
        :model-value="endereco.city ?? ''"
        size="sm"
        class="col-span-2"
        @update:model-value="(v: string | number) => mudarSubcampo('city', String(v))"
      />
      <UInput
        :model-value="endereco.state ?? ''"
        size="sm"
        class="col-span-1"
        @update:model-value="(v: string | number) => mudarSubcampo('state', String(v))"
      />
    </div>

    <!-- ──────────────────────────── arquivos ────────────────────────────── -->
    <div
      v-else-if="campo.tipo === 'uploadFile' || campo.tipo === 'uploadImage' || campo.tipo === 'EnPDF'"
      class="rounded-md border border-dashed border-default p-3 text-center"
    >
      <template v-if="arquivo">
        <div class="flex items-center justify-center gap-2">
          <UIcon :name="campo.icone" class="size-4 text-muted" />
          <span class="truncate text-sm text-highlighted">{{ arquivo.filename }}</span>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="emit('update:modelValue', null)"
          />
        </div>
      </template>
      <template v-else>
        <UButton
          icon="i-lucide-upload"
          :label="t.campos[campo.tipo].rotulo"
          color="neutral"
          variant="outline"
          size="sm"
          @click="simularAnexo"
        />
        <p class="mt-1.5 text-xs text-muted">{{ t.campos[campo.tipo].formulario }}</p>
      </template>
    </div>

    <div
      v-else-if="campo.tipo === 'EnESign'"
      class="flex h-20 items-center justify-center rounded-md border border-dashed border-default text-sm text-muted"
    >
      {{ t.campos.EnESign.formulario }}
    </div>

    <!-- ──────────────────────────── compostos ───────────────────────────── -->
    <div v-else-if="campo.tipo === 'EnRepeater'" class="rounded-md border border-default">
      <div
        v-for="(linha, i) in linhasDoRepetidor"
        :key="i"
        class="flex items-center gap-2 border-b border-default p-2 last:border-b-0"
      >
        <UInput
          :model-value="String(linha.item ?? '')"
          size="sm"
          class="min-w-0 flex-1"
          @update:model-value="(v: string | number) => mudarLinha(i, 'item', String(v))"
        />
        <UInput
          :model-value="Number(linha.quantidade ?? 0)"
          type="number"
          size="sm"
          class="w-20"
          @update:model-value="(v: string | number) => mudarLinha(i, 'quantidade', Number(v))"
        />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" @click="removerLinha(i)" />
      </div>
      <div class="p-2">
        <UButton icon="i-lucide-plus" :label="t.criar" color="neutral" variant="ghost" size="xs" @click="acrescentarLinha" />
      </div>
    </div>

    <div v-else-if="campo.tipo === 'group'" class="space-y-2 rounded-md border border-default p-3">
      <UInput
        :model-value="(valor as Record<string, string>)?.login ?? ''"
        size="sm"
        class="w-full"
        placeholder="login"
        @update:model-value="(v: string | number) => mudarSubcampo('login', String(v))"
      />
      <UInput
        :model-value="(valor as Record<string, string>)?.telefone ?? ''"
        size="sm"
        class="w-full"
        placeholder="+55 11 0000-0000"
        @update:model-value="(v: string | number) => mudarSubcampo('telefone', String(v))"
      />
    </div>

    <div
      v-else
      class="flex items-center gap-2 rounded-md border border-dashed border-default px-3 py-2 text-sm text-muted"
    >
      <UIcon :name="campo.icone" class="size-4 shrink-0" />
      <span>{{ t.campos[campo.tipo].formulario }}</span>
    </div>

    <p class="mt-1 text-xs text-muted">{{ t.campos[campo.tipo].descricao }}</p>
  </div>
</template>
