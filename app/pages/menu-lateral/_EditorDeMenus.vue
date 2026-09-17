<script setup lang="ts">
import FormularioDeMenu from './_FormularioDeMenu.vue'
import { useMenuDoWorkspace, useArraste } from './estado'
import { tiposDeTela, type NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O editor do menu, em `Configurações > Interface > Menus`.
 *
 * Ele edita a MESMA árvore que a barra mostra (`estado.ts`), então o que muda
 * aqui muda lá. E a reordenação é só por arraste: as setinhas saíram na rodada
 * 5, a pedido dela ("a reordenaçao SEMPRE deve ser por drag and drop").
 *
 * O que o arraste faz:
 *   soltar na metade de cima ou de baixo de uma linha  → antes ou depois dela;
 *   soltar no meio de um cabeçalho de seção            → dentro daquela seção.
 *
 * O ENSPACE recusa na hora o que quebra a lógica dele, com o motivo. O destino
 * inválido continua aceitando o arraste em cima: recusar com o motivo ensina a
 * regra, bloquear em silêncio só deixa sem entender.
 *
 * Gravação: nenhuma até o clique em Salvar. O rodapé mostra que há mudança e
 * oferece descartar.
 */
const props = defineProps<{
  t: TextosDaTela
  /** Muda o formulário de seção: só no modelo de trilha existem dois lugares. */
  modelo: 'barra' | 'trilha'
  /** Quando o editor abre vindo do "+ Criar", já abre o formulário certo. */
  abrirFormulario?: 'secao' | 'item' | null
}>()
const aberto = defineModel<boolean>('open', { default: false })
const toast = useToast()

const menu = useMenuDoWorkspace()
const arraste = useArraste()

/** O formulário de criação, nos dois modos. */
const formAberto = ref(false)
const modoDoForm = ref<'secao' | 'item'>('secao')
const secaoDoNovoItem = ref('')

watch(aberto, (v) => {
  if (!v) return
  if (props.abrirFormulario) {
    modoDoForm.value = props.abrirFormulario
    secaoDoNovoItem.value = props.abrirFormulario === 'item' ? (secoesQueRecebem.value[0]?.id ?? '') : ''
    formAberto.value = true
  }
})

function rotuloDe(no: NoDoMenu) {
  if (no.rotulo) return no.rotulo
  const mapa: Record<string, string> = {
    inicio: props.t.inicio,
    inbox: props.t.inbox,
    chatIa: props.t.chatIa,
    tarefas: props.t.tarefas,
    agenda: props.t.agenda,
    spaceflows: props.t.spaceflows,
    documentos: props.t.documentos,
    categorias: props.t.categorias,
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
}

/** Seções que podem receber um item: só as do workspace (regras R1 e R4). */
const secoesQueRecebem = computed(() =>
  menu.rascunho.value
    .filter(n => n.tipo === 'secao')
    .map(n => ({ id: n.id, rotulo: rotuloDe(n), escopo: n.escopo ?? [] })),
)

function abrirForm(modo: 'secao' | 'item', secaoId = '') {
  modoDoForm.value = modo
  secaoDoNovoItem.value = secaoId
  formAberto.value = true
}

function receberCriado(no: NoDoMenu & { lugar?: string, escopo: string[] }) {
  if (no.tipo === 'secao') menu.adicionarSecao(no)
  else menu.adicionarItem(no, secaoDoNovoItem.value || secoesQueRecebem.value[0]?.id || '')
  toast.add({ title: props.t.criada(no.rotulo ?? ''), icon: 'i-lucide-check', color: 'neutral' })
}

/* ------------------------------ o arraste ------------------------------ */

function marcaDe(id: string) {
  return arraste.alvo.value?.id === id ? arraste.alvo.value.posicao : null
}

const recusandoAgora = computed(() => {
  const a = arraste.alvo.value
  if (!a) return false
  return !menu.avaliar(arraste.arrastando.value, a.id, a.posicao).ok
})

function ondeCai(e: DragEvent, comMeio: boolean): 'antes' | 'depois' | 'dentro' {
  const alvo = e.currentTarget as HTMLElement
  const r = alvo.getBoundingClientRect()
  const y = e.clientY - r.top
  if (!comMeio) return y < r.height / 2 ? 'antes' : 'depois'
  if (y < r.height * 0.3) return 'antes'
  if (y > r.height * 0.7) return 'depois'
  return 'dentro'
}

function passar(e: DragEvent, id: string, comMeio: boolean) {
  e.preventDefault()
  arraste.mirar(id, ondeCai(e, comMeio))
}

/**
 * A recusa aparece NA LINHA, não só num toast.
 *
 * Toast some sozinho e passa despercebido no meio de um arraste, que é quando a
 * pessoa está olhando para a lista e não para o canto da tela. A mensagem fica
 * presa no item que não coube até o próximo gesto.
 */
const recusa = ref<{ id: string, motivo: string } | null>(null)

function largar(e: DragEvent, id: string, comMeio: boolean) {
  e.preventDefault()
  const quem = arraste.arrastando.value
  const posicao = ondeCai(e, comMeio)
  arraste.terminar()
  if (!quem) return

  const r = menu.soltar(quem, id, posicao)
  if (r.ok) {
    recusa.value = null
    return
  }

  const motivo = props.t.motivos[r.motivo] ?? ''
  recusa.value = { id: quem, motivo }
  toast.add({ title: motivo, icon: 'i-lucide-ban', color: 'error' })
}

function teclar(e: KeyboardEvent, id: string) {
  if (!e.altKey) return
  if (e.key === 'ArrowUp') { e.preventDefault(); menu.mover(id, -1) }
  if (e.key === 'ArrowDown') { e.preventDefault(); menu.mover(id, 1) }
}

/* ------------------------------ salvar ------------------------------ */

function salvar() {
  menu.salvar()
  toast.add({ title: props.t.menuSalvo, icon: 'i-lucide-check', color: 'neutral' })
}

const opcoesDeTipo = computed(() =>
  tiposDeTela.map(t => ({ label: props.t.tipos[t.id] ?? t.id, value: t.id })),
)

function exigeCategoria(tipoId?: string) {
  return tiposDeTela.find(t => t.id === tipoId)?.exigeCategoria ?? false
}

/*
 * As classes saem inteiras, nunca montadas com interpolação: o Tailwind lê o
 * código-fonte para decidir o que gerar, e `bg-${cor}` não existe no CSS final.
 */
const MARCA_ANTES = 'before:absolute before:inset-x-0 before:-top-px before:z-20 before:h-0.5 before:rounded-full'
const MARCA_DEPOIS = 'after:absolute after:inset-x-0 after:-bottom-px after:z-20 after:h-0.5 after:rounded-full'

function classeDaMarca(id: string, comMeio = false) {
  const m = marcaDe(id)
  if (!m) return ''
  const recusa = recusandoAgora.value

  if (m === 'dentro' && comMeio) {
    return recusa ? 'ring-1 ring-error bg-error/10' : 'ring-1 ring-primary bg-primary/10'
  }
  if (m === 'antes') {
    return `${MARCA_ANTES} ${recusa ? 'before:bg-error' : 'before:bg-primary'}`
  }
  return `${MARCA_DEPOIS} ${recusa ? 'after:bg-error' : 'after:bg-primary'}`
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="props.t.editorTitulo"
    :description="props.t.editorDescricao"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <UButton
          :label="props.t.adicionarSecao"
          icon="i-lucide-folder-plus"
          size="sm"
          color="primary"
          variant="soft"
          @click="abrirForm('secao')"
        />
        <UButton
          :label="props.t.adicionarItem"
          icon="i-lucide-file-plus"
          size="sm"
          color="neutral"
          variant="subtle"
          :disabled="!secoesQueRecebem.length"
          @click="abrirForm('item', secoesQueRecebem[0]?.id)"
        />
        <span class="ml-auto flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-grip-vertical" class="size-3.5 shrink-0" />
          {{ props.t.arrastarDica }}
        </span>
      </div>

      <div class="max-h-[50vh] space-y-1 overflow-y-auto pr-1">
        <template v-for="no in menu.arvoreVisivel.value" :key="no.id">
          <div
            class="relative animate-[entrada_0.2s_ease-out_both] rounded-lg border border-default p-2"
            :class="[arraste.arrastando.value === no.id ? 'opacity-40' : '', classeDaMarca(no.id, no.tipo !== 'destino')]"
          >
            <div
              class="flex items-center gap-2"
              draggable="true"
              @dragstart="arraste.comecar(no.id)"
              @dragover="e => passar(e, no.id, no.tipo !== 'destino')"
              @drop="e => largar(e, no.id, no.tipo !== 'destino')"
              @dragend="arraste.terminar()"
              @keydown="e => teclar(e, no.id)"
            >
              <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0 cursor-grab text-muted" />
              <UIcon :name="no.icone" class="size-4 shrink-0 text-toned" />
              <span class="min-w-0 flex-1 truncate text-sm font-semibold text-highlighted">{{ rotuloDe(no) }}</span>

              <UBadge
                :label="menu.origemDe(no) === 'modulo' ? props.t.seloModulo : menu.origemDe(no) === 'workspace' ? props.t.seloWorkspace : props.t.seloNativo"
                size="sm"
                color="neutral"
                variant="subtle"
                class="shrink-0"
              />

              <UButton
                v-if="no.tipo === 'secao'"
                icon="i-lucide-plus"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="props.t.adicionarItem"
                @click="abrirForm('item', no.id)"
              />
            </div>

            <!-- o escopo da seção, que decide quem enxerga -->
            <p v-if="no.tipo === 'secao'" class="mt-1 flex items-center gap-1.5 pl-6 text-xs text-muted">
              <UIcon name="i-lucide-eye" class="size-3.5 shrink-0" />
              <span v-if="!no.escopo?.length">{{ props.t.escopoTodos }}</span>
              <span v-else>{{ props.t.escopoResumo(no.escopo.length) }}</span>
              <UBadge
                v-if="no.lugar === 'trilha'"
                :label="props.t.ondeTrilha"
                size="sm"
                color="primary"
                variant="subtle"
              />
            </p>

            <p
              v-if="recusa?.id === no.id"
              class="mt-1 flex items-center gap-1.5 pl-6 text-xs font-medium text-error"
            >
              <UIcon name="i-lucide-ban" class="size-3.5 shrink-0" />
              {{ recusa.motivo }}
            </p>

            <!-- nível 2 -->
            <div v-if="no.filhos?.length" class="mt-2 space-y-1 border-l border-default pl-3">
              <div
                v-for="filho in no.filhos"
                :key="filho.id"
                class="relative rounded-md p-1.5"
                :class="[arraste.arrastando.value === filho.id ? 'opacity-40' : 'hover:bg-elevated', classeDaMarca(filho.id)]"
                draggable="true"
                @dragstart="arraste.comecar(filho.id)"
                @dragover="e => passar(e, filho.id, false)"
                @drop="e => largar(e, filho.id, false)"
                @dragend="arraste.terminar()"
                @keydown="e => teclar(e, filho.id)"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0 cursor-grab text-muted" />
                  <UIcon :name="filho.icone" class="size-4 shrink-0 text-toned" />
                  <span class="min-w-0 flex-1 truncate text-sm text-default">{{ rotuloDe(filho) }}</span>

                  <USelect
                    v-if="filho.tipo === 'tela'"
                    v-model="filho.tipoDeTela"
                    :items="opcoesDeTipo"
                    size="xs"
                    class="w-48 shrink-0"
                    :aria-label="props.t.tipoDeTela"
                  />
                  <UBadge
                    v-else
                    :label="props.t.categorias"
                    size="sm"
                    color="neutral"
                    variant="subtle"
                    class="shrink-0"
                  />
                </div>

                <p
                  v-if="filho.tipo === 'tela' && exigeCategoria(filho.tipoDeTela) && !filho.categoriasLigadas"
                  class="mt-1 flex items-center gap-1.5 pl-6 text-xs text-warning"
                >
                  <UIcon name="i-lucide-triangle-alert" class="size-3.5 shrink-0" />
                  {{ props.t.exigeCategoria }}
                </p>
                <p v-else-if="filho.categoriasLigadas" class="mt-1 pl-6 text-xs text-muted">
                  {{ props.t.categoriasLigadas(filho.categoriasLigadas) }}
                </p>

                <p
                  v-if="recusa?.id === filho.id"
                  class="mt-1 flex items-center gap-1.5 pl-6 text-xs font-medium text-error"
                >
                  <UIcon name="i-lucide-ban" class="size-3.5 shrink-0" />
                  {{ recusa.motivo }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>

      <p class="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-keyboard" class="size-3.5 shrink-0" />
        {{ props.t.arrastarTeclado }}
      </p>

      <!-- os dois formulários de criação, em camada sobre o editor -->
      <FormularioDeMenu
        v-model:open="formAberto"
        :t="props.t"
        :modo="modoDoForm"
        :modelo="props.modelo"
        :secoes="secoesQueRecebem"
        @criado="receberCriado"
      />
    </template>

    <template #footer>
      <div class="flex w-full flex-wrap items-center gap-2">
        <p class="min-w-0 flex-1 text-xs" :class="menu.alterado.value ? 'font-medium text-highlighted' : 'text-muted'">
          {{ menu.alterado.value ? props.t.menuAlterado : props.t.semAlteracao }}
        </p>
        <UButton
          :label="props.t.descartar"
          color="neutral"
          variant="ghost"
          :disabled="!menu.alterado.value"
          @click="menu.descartar()"
        />
        <UButton
          :label="props.t.salvar"
          color="primary"
          :disabled="!menu.alterado.value"
          @click="salvar"
        />
      </div>
    </template>
  </UModal>
</template>
