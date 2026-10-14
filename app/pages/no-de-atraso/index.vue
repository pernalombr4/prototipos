<script setup lang="ts">
/**
 * Nó de Atraso que espera até uma data do item.
 *
 * A demanda: um contrato é criado, o fluxo começa e o Atraso precisa esperar
 * até 30 dias antes da data de vencimento, que é um campo do item. Hoje o nó
 * só aceita quantidade e unidade fixas.
 *
 * A jornada: Configurações › Estrutura › Spaceflow › fluxo 524 › clique duas
 * vezes no nó Atraso. O modal abre sozinho ao entrar, para a revisão começar
 * pelo que está em discussão.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDasConfiguracoes from './_CascaDasConfiguracoes.vue'
import EditorDoSpaceflow from './_EditorDoSpaceflow.vue'
import ModalDoAtraso from './_ModalDoAtraso.vue'
import type { ConfiguracaoDoAtraso } from './mocks'
import { configuracaoDoCliente, configuracaoNova, fluxo, variaveisDoGatilho, workspace } from './mocks'
import { campoEscolhido } from './espera'
import { textos } from './textos'

definePageMeta({
  titulo: 'Nó de Atraso com data de referência',
  descricao: 'O nó Atraso do Spaceflow ganha a data de referência: retoma a execução 30 dias antes do vencimento, configurado sem fórmula e com simulação nos itens da categoria.',
  status: 'em-revisao',
  atualizado: '2026-10-14',
  tela: 'Spaceflow › nó Atraso',
})

const t = useTextos(textos)

/* ------------------------------------------------------------------ *
 * ANDAIME: versão e cenário. Não é proposta.                          *
 * ------------------------------------------------------------------ */
type Versao = 'hoje' | 'proposta'
type Cenario = 'cliente' | 'novo' | 'erro' | 'semCampos'

const versao = ref<Versao>('proposta')
const cenario = ref<Cenario>('cliente')
const cenarios: { valor: Cenario, rotulo: string }[] = [
  { valor: 'cliente', rotulo: 'Caso do cliente' },
  { valor: 'novo', rotulo: 'Nó novo' },
  { valor: 'erro', rotulo: 'Salvar sem campo' },
  { valor: 'semCampos', rotulo: 'Sem variável' },
]

function configDoCenario(c: Cenario): ConfiguracaoDoAtraso {
  if (versao.value === 'hoje') return configuracaoNova()
  if (c === 'cliente') return configuracaoDoCliente()
  if (c === 'novo') return configuracaoNova()
  return { ...configuracaoNova(), mode: 'until_date' }
}

const config = ref<ConfiguracaoDoAtraso>(configuracaoDoCliente())
const variaveis = computed(() => cenario.value === 'semCampos' ? [] : variaveisDoGatilho)
const modalAberto = ref(false)

/** Reabre do zero: se a aba abriu em segundo plano, o modal pode ter ficado "aberto" sem aparecer. */
function abrirNo() {
  modalAberto.value = false
  nextTick(() => { modalAberto.value = true })
}

function aplicar() {
  modalAberto.value = false
  config.value = configDoCenario(cenario.value)
  nextTick(() => { modalAberto.value = true })
}
watch([versao, cenario], aplicar)
onMounted(() => setTimeout(() => { modalAberto.value = true }, 500))

/* ---------- o card do Atraso no canvas ---------- */

const configValida = computed(() => {
  const c = config.value
  if (c.mode === 'duration') return Number.isInteger(Number(c.delay)) && Number(c.delay) >= 1
  return !!c.date_source
})

const descricaoDoAtraso = computed(() => {
  const c = config.value
  const p = t.value.proposta
  if (versao.value === 'hoje') return t.value.nos.atraso.descricao
  if (!configValida.value) return p.resumoVazio
  if (c.mode === 'duration') {
    const n = Number(c.delay)
    const unidade = c.unit === 'hour' || c.unit === 'day'
      ? p.unidadeDoDeslocamento(c.unit, n)
      : t.value.hoje.unidades[c.unit].toLowerCase()
    return p.resumoTempo(n, unidade)
  }
  const campo = campoEscolhido(c)!
  const quanto = c.offset_direction === 'on' ? '' : `${c.offset_amount} ${p.unidadeDoDeslocamento(c.offset_unit, c.offset_amount)}`
  const hora = c.time === 'field' || c.offset_unit === 'hour' ? null : c.time
  return p.resumoData(quanto, p.direcoes[c.offset_direction], campo.label ?? campo.refId, hora)
})

const estadoDoAtraso = computed<'ok' | 'modificado' | 'erro'>(() => {
  if (versao.value === 'hoje') return config.value.delay === '' ? 'erro' : 'modificado'
  return configValida.value ? 'modificado' : 'erro'
})

function reiniciar() {
  versao.value = 'proposta'
  cenario.value = 'cliente'
  aplicar()
}
</script>

<template>
  <div>
    <CascaDasConfiguracoes :t="t" :workspace="workspace.nome" :slug="workspace.slug" :fluxo-id="fluxo.id">
      <EditorDoSpaceflow
        :t="t"
        :descricao-do-atraso="descricaoDoAtraso"
        :resumo-proposto="versao === 'proposta' && configValida"
        :estado-do-atraso="estadoDoAtraso"
        @abrir-atraso="abrirNo"
      />
    </CascaDasConfiguracoes>

    <ModalDoAtraso
      :key="`${versao}-${cenario}`"
      v-model:open="modalAberto"
      v-model:config="config"
      :t="t"
      :versao="versao"
      :variaveis="variaveis"
      :validar-ao-abrir="cenario === 'erro'"
    />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · versão</span>
        <UButton
          v-for="v in (['hoje', 'proposta'] as const)"
          :key="v"
          :label="v === 'hoje' ? 'Como é hoje' : 'Proposta'"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="versao === v ? 'primary' : 'neutral'"
          :variant="versao === v ? 'solid' : 'subtle'"
          @click="versao = v"
        />
        <template v-if="versao === 'proposta'">
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Cenário</span>
          <UButton
            v-for="c in cenarios"
            :key="c.valor"
            :label="c.rotulo"
            size="xs"
            class="transition-transform hover:-translate-y-0.5"
            :color="cenario === c.valor ? 'primary' : 'neutral'"
            :variant="cenario === c.valor ? 'solid' : 'subtle'"
            @click="cenario = c.valor"
          />
        </template>
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <UButton label="Abrir o nó" icon="i-lucide-mouse-pointer-click" size="xs" color="neutral" variant="outline" @click="abrirNo" />
        <UButton label="Reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/no-de-atraso"
          />
        </span>
      </div>
    </div>
  </div>
</template>
