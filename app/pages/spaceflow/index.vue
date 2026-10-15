<script setup lang="ts">
/**
 * Spaceflow: configuração dos nós.
 *
 * A demanda: repaginar a UX do construtor de fluxos (botões quase invisíveis,
 * informação escondida) e, principalmente, a configuração dentro de cada nó,
 * sem criar função nova e sem mudar a lógica do back-end. O Atraso usa a
 * configuração aprovada no protótipo `no-de-atraso`.
 *
 * A jornada: Configurações › Estrutura › Spaceflow › fluxo 524 › duplo clique
 * num nó. O fluxo de exemplo tem um nó de cada tipo que a paleta oferece.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDasConfiguracoes from '../no-de-atraso/_CascaDasConfiguracoes.vue'
import ModalDoAtraso from '../no-de-atraso/_ModalDoAtraso.vue'
import { textos as textosDoAtraso } from '../no-de-atraso/textos'
import { campoEscolhido } from '../no-de-atraso/espera'
import EditorProposto from './_EditorProposto.vue'
import ModalDoNo from './_ModalDoNo.vue'
import type { ConfiguracaoDoAtraso, No } from './mocks'
import { arestas as arestasIniciais, fluxoConfigurado, fluxoInfo, fluxoNovo, variaveisDoGatilho, workspace } from './mocks'
import { definicoes, l, pendencias as pendenciasDoNo } from './nos'
import { resumir } from './apoio'
import { textos } from './textos'
import { useIdioma } from '~/composables/useIdioma'

definePageMeta({
  titulo: 'Spaceflow: configuração dos nós',
  descricao: 'Repaginada de UX do construtor de fluxos: card com resumo e pendência escrita, saídas com rótulo, botões com texto e os modais dos 17 nós com rótulo curto, instrução sob cada campo e ajuda por opção. Sem função nova.',
  status: 'em-revisao',
  atualizado: '2026-10-15',
  tela: 'Spaceflow › editor e modais dos nós',
})

const t = useTextos(textos)
const tAtraso = useTextos(textosDoAtraso)
const idioma = useIdioma()
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: versão e cenário. Não é proposta.                          *
 * ------------------------------------------------------------------ */
type Versao = 'hoje' | 'proposta'
type Cenario = 'configurado' | 'novo'
const versao = ref<Versao>('proposta')
const cenario = ref<Cenario>('configurado')

/* ---------- o fluxo ---------- */

const nos = ref<No[]>(fluxoConfigurado())
const arestas = ref(structuredClone(arestasIniciais))
const modificados = ref<string[]>([])

watch(cenario, (c) => {
  nos.value = c === 'novo' ? fluxoNovo() : fluxoConfigurado()
  arestas.value = structuredClone(arestasIniciais)
  modificados.value = []
})

/* ---------- o Atraso: o modal aprovado em `no-de-atraso` ---------- */

const configAtraso = computed(() => nos.value.find(n => n.type === 'delay')?.data as unknown as ConfiguracaoDoAtraso | undefined)

function resumoDoAtraso(c: ConfiguracaoDoAtraso): string {
  const p = tAtraso.value.proposta
  if (c.mode === 'duration') {
    const n = Number(c.delay)
    if (!Number.isInteger(n) || n < 1) return ''
    const unidade = c.unit === 'hour' || c.unit === 'day' ? p.unidadeDoDeslocamento(c.unit, n) : tAtraso.value.hoje.unidades[c.unit].toLowerCase()
    return p.resumoTempo(n, unidade)
  }
  const campo = campoEscolhido(c)
  if (!campo) return ''
  const quanto = c.offset_direction === 'on' ? '' : `${c.offset_amount} ${p.unidadeDoDeslocamento(c.offset_unit, c.offset_amount)}`
  const hora = c.time === 'field' || c.offset_unit === 'hour' ? null : c.time
  return p.resumoData(quanto, p.direcoes[c.offset_direction], campo.label ?? campo.refId, hora)
}

function pendenciasDoAtraso(c: ConfiguracaoDoAtraso): string[] {
  if (c.mode === 'duration') return Number.isInteger(Number(c.delay)) && Number(c.delay) >= 1 ? [] : [tAtraso.value.hoje.quantidade]
  return c.date_source ? [] : [tAtraso.value.proposta.dataExata]
}

/* ---------- resumo e pendências de cada card ---------- */

const resumos = computed<Record<string, string>>(() => Object.fromEntries(nos.value.map((n) => {
  if (n.type === 'delay') return [n.id, resumoDoAtraso(n.data as unknown as ConfiguracaoDoAtraso)]
  return [n.id, resumir(n, idioma.value, nos.value)]
})))

const pendencias = computed<Record<string, string[]>>(() => Object.fromEntries(nos.value.map((n) => {
  if (n.type === 'delay') return [n.id, pendenciasDoAtraso(n.data as unknown as ConfiguracaoDoAtraso)]
  const def = definicoes[n.type]
  return [n.id, def ? pendenciasDoNo(def, n.data as Record<string, unknown>).map(p => p.rotulo[idioma.value]) : []]
})))

/* ---------- abrir, salvar, adicionar ---------- */

const noAbertoId = ref<string | null>(null)
const modalAberto = ref(false)
const atrasoAberto = ref(false)
const comPendencias = ref(false)
const noAberto = computed(() => nos.value.find(n => n.id === noAbertoId.value) ?? null)

function abrir(id: string, mostrarPendencias = false) {
  const no = nos.value.find(n => n.id === id)
  if (!no) return
  noAbertoId.value = id
  comPendencias.value = mostrarPendencias
  modalAberto.value = false
  atrasoAberto.value = false
  nextTick(() => {
    if (no.type === 'delay') atrasoAberto.value = true
    else modalAberto.value = true
  })
}

function marcarModificado(id: string) {
  if (!modificados.value.includes(id)) modificados.value.push(id)
}

function salvarNo(id: string, data: Record<string, any>) {
  const no = nos.value.find(n => n.id === id)
  if (!no) return
  no.data = data as No['data']
  marcarModificado(id)
}

const atrasoModelo = computed({
  get: () => configAtraso.value as ConfiguracaoDoAtraso,
  set: (c: ConfiguracaoDoAtraso) => {
    const no = nos.value.find(n => n.type === 'delay')
    if (!no) return
    no.data = c as unknown as No['data']
    marcarModificado(no.id)
  },
})

let seq = 1
function adicionar(tipo: string, x: number, y: number) {
  const def = definicoes[tipo]
  if (!def || def.emBreve || (tipo === 'trigger' && nos.value.some(n => n.type === 'trigger'))) return
  const id = `${tipo}-${seq++}`
  const data: Record<string, any> = tipo === 'delay'
    ? { ...(fluxoNovo().find(n => n.type === 'delay')!.data as object) }
    : { label: def.nome[idioma.value] }
  nos.value.push({ id, type: tipo, position: { x, y }, data } as unknown as No)
  marcarModificado(id)
  toast.add({ title: t.value.paleta.adicionado(def.nome[idioma.value]), icon: 'i-lucide-blocks' })
}

const salvandoVersao = ref(false)
function salvarVersao() {
  if (!modificados.value.length) return
  salvandoVersao.value = true
  setTimeout(() => {
    modificados.value = []
    salvandoVersao.value = false
    toast.add({ title: fluxoInfo.versao.replace(/(\d+)$/, d => String(Number(d) + 1)), description: l('Versão salva.', 'Version saved.', 'Versión guardada.')[idioma.value], icon: 'i-lucide-circle-check', color: 'success' })
  }, 450)
}

const opcoesDeNo = computed(() => nos.value.map(n => ({ label: `${definicoes[n.type]?.nome[idioma.value]} · ${n.data.label}`, value: n.id, icon: definicoes[n.type]?.icone })))
const noDoAndaime = ref<string | undefined>(undefined)
watch(noDoAndaime, (id) => {
  if (id) abrir(id)
  nextTick(() => (noDoAndaime.value = undefined))
})

function reiniciar() {
  versao.value = 'proposta'
  cenario.value = 'configurado'
  nos.value = fluxoConfigurado()
  arestas.value = structuredClone(arestasIniciais)
  modificados.value = []
  modalAberto.value = false
  atrasoAberto.value = false
}


/* ---------- Como é hoje: os prints do develop ---------- */

const prints = import.meta.glob('./evidencias/dev-*.jpg', { eager: true, import: 'default' }) as Record<string, string>
const legendas: Record<string, ReturnType<typeof l>> = {
  'dev-01-canvas': l('Canvas: salvar é um disquete sem texto; adicionar nó é um ícone sem rótulo; o card mostra a descrição genérica do tipo.', 'Canvas: save is an unlabeled floppy icon; add node is an icon with no label; the card shows the type\'s generic description.', 'Lienzo: guardar es un disquete sin texto; agregar nodo es un ícono sin etiqueta; la tarjeta muestra la descripción genérica.'),
  'dev-02-paleta-de-nos': l('Paleta: grupos em inglês e português misturados (Triggers, Ações, I.A.); um grupo aberto por vez.', 'Palette: mixed English and Portuguese group names; one group open at a time.', 'Paleta: grupos en inglés y portugués mezclados; un grupo abierto a la vez.'),
  'dev-03-start-manual': l('Start: ajuda só no "?" do rótulo; nenhuma instrução sob o campo.', 'Start: help only in the label\'s "?"; no instruction under the field.', 'Start: ayuda solo en el "?" de la etiqueta; ninguna instrucción bajo el campo.'),
  'dev-04-aprovacao-modificado-sem-mudar': l('Aprovação: abre já como Modificado sem nenhuma mudança; fechar pede confirmação. O título do modal diz Tarefa.', 'Approval: opens already Modified with no change; closing asks for confirmation. The modal title says Task.', 'Aprobación: abre ya como Modificado sin cambios; cerrar pide confirmación. El título dice Tarea.'),
  'dev-05-email-topo': l('E-mail: provedor, layout e modelo vêm antes do assunto.', 'Email: provider, layout and template come before the subject.', 'Correo: proveedor, diseño y plantilla vienen antes del asunto.'),
  'dev-06-email-para-no-fim': l('E-mail: o destinatário (Para) só aparece depois do corpo.', 'Email: the recipient (To) only shows after the body.', 'Correo: el destinatario (Para) solo aparece después del cuerpo.'),
  'dev-07-crud-atualizar': l('CRUD: "Campos da Ação" é um "+" solto, sem texto.', 'CRUD: "Action fields" is a lone "+" with no text.', 'CRUD: "Campos de la Acción" es un "+" suelto, sin texto.'),
  'dev-08-crud-mostrar-chaves': l('CRUD: o "+" abre um segundo modal, "Mostrar Chaves", com busca em inglês (Search...).', 'CRUD: the "+" opens a second modal, "Show Keys", with an English search box.', 'CRUD: el "+" abre un segundo modal, "Mostrar Claves", con búsqueda en inglés.'),
  'dev-09-crud-campos-da-acao': l('CRUD: os campos escolhidos viram linhas de texto, sem tipo e sem botão de remover.', 'CRUD: the chosen fields become text rows, with no type and no remove button.', 'CRUD: los campos elegidos se vuelven filas de texto, sin tipo ni botón de quitar.'),
  'dev-10-http': l('HTTP: quase sem ajuda; o tipo da credencial fica escondido.', 'HTTP: almost no help; the credential type is hidden.', 'HTTP: casi sin ayuda; el tipo de credencial queda oculto.'),
  'dev-11-condicionais': l('Condicionais: "Ramo Ou" vem antes de "Ramo E"; a regra entre os 2 só aparece no "?".', 'Conditions: "Or branch" comes before "And branch"; the rule between them is only in the "?".', 'Condicionales: "Rama O" viene antes de "Rama Y"; la regla entre las 2 solo está en el "?".'),
}
const galeria = computed(() => Object.entries(prints).sort(([a], [b]) => a.localeCompare(b)).map(([caminho, src]) => {
  const id = caminho.split('/').pop()!.replace('.jpg', '')
  return { id, src, legenda: legendas[id]?.[idioma.value] ?? id }
}))
const printAberto = ref<{ src: string, legenda: string } | null>(null)
</script>

<template>
  <div>
    <CascaDasConfiguracoes :t="tAtraso" :workspace="workspace.nome" :slug="workspace.slug" :fluxo-id="fluxoInfo.id">
      <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <EditorProposto
          v-if="versao === 'proposta'"
          :t="t"
          :i="idioma"
          :nos="nos"
          :arestas="arestas"
          :resumos="resumos"
          :pendencias="pendencias"
          :modificados="modificados"
          :alteracoes="modificados.length"
          @abrir="abrir"
          @adicionar="adicionar"
          @salvar-versao="salvarVersao"
        />

        <!-- Como é hoje: os prints do develop, com o que cada um mostra -->
        <div v-else class="min-h-0 flex-1 overflow-y-auto p-5 pb-24">
          <h2 class="text-base font-semibold text-highlighted">{{ t.andaime.hojeTitulo }}</h2>
          <p class="text-sm text-muted">{{ t.andaime.hojeDescricao }}</p>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <button
              v-for="(p, k) in galeria"
              :key="p.id"
              type="button"
              class="group overflow-hidden rounded-xl border border-default bg-default text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              :style="{ animation: `entrada .3s ease-out ${k * 40}ms backwards` }"
              @click="printAberto = p"
            >
              <img :src="p.src" :alt="p.legenda" class="aspect-video w-full object-cover object-top">
              <p class="p-3 text-sm text-default">{{ p.legenda }}</p>
            </button>
          </div>
        </div>
      </Transition>
    </CascaDasConfiguracoes>

    <ModalDoNo
      v-model:open="modalAberto"
      :t="t"
      :i="idioma"
      :no="noAberto"
      :nos="nos"
      :arestas="arestas"
      :mostrar-pendencias="comPendencias"
      @salvar="salvarNo"
    />

    <ModalDoAtraso
      v-if="configAtraso"
      v-model:open="atrasoAberto"
      v-model:config="atrasoModelo"
      :t="tAtraso"
      versao="proposta"
      :variaveis="variaveisDoGatilho"
      :validar-ao-abrir="comPendencias"
    />

    <UModal :open="!!printAberto" :title="printAberto?.legenda" @update:open="(v: boolean) => { if (!v) printAberto = null }" :ui="{ content: 'max-w-6xl' }">
      <template #body>
        <img v-if="printAberto" :src="printAberto.src" :alt="printAberto.legenda" class="w-full rounded-lg border border-default">
      </template>
    </UModal>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div data-andaime class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.rotulo }} · {{ t.andaime.versao }}</span>
        <UButton
          v-for="v in (['hoje', 'proposta'] as const)"
          :key="v"
          :label="v === 'hoje' ? t.andaime.hoje : t.andaime.proposta"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="versao === v ? 'primary' : 'neutral'"
          :variant="versao === v ? 'solid' : 'subtle'"
          @click="versao = v"
        />
        <template v-if="versao === 'proposta'">
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cenario }}</span>
          <UButton
            v-for="c in (['configurado', 'novo'] as const)"
            :key="c"
            :label="t.andaime[c]"
            size="xs"
            class="transition-transform hover:-translate-y-0.5"
            :color="cenario === c ? 'primary' : 'neutral'"
            :variant="cenario === c ? 'solid' : 'subtle'"
            @click="cenario = c"
          />
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <USelectMenu
            v-model="noDoAndaime"
            :items="opcoesDeNo"
            value-key="value"
            :placeholder="t.andaime.abrirNo"
            icon="i-lucide-mouse-pointer-click"
            size="xs"
            class="w-56"
          />
        </template>
        <UButton :label="t.andaime.reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/spaceflow"
          />
        </span>
      </div>
    </div>
  </div>
</template>
