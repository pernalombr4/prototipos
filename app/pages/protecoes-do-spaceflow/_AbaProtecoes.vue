<script setup lang="ts">
/**
 * PROPOSTA: a aba Proteções do editor do Spaceflow. Só configuração.
 *
 * - Topo fixo: título, 1 frase, "Restaurar recomendadas" e "Salvar" (sempre à
 *   vista, desabilitado sem alteração). "Descartar" aparece com alteração;
 * - Corpo: os grupos no padrão de página de configurações do Nuxt UI, uma
 *   linha por regra (rótulo e 1 frase à esquerda, controle à direita), com
 *   índice lateral no desktop. Completa tem 7 grupos; o MVP tem 5, e o que ele
 *   não deixa escolher aparece como selo com o valor fixo;
 * - Salvar não cria versão do fluxo: vale a partir da próxima execução.
 *
 * Rodada 2 (pedido dela): saíram os números das últimas 24 horas e o selo
 * "Agiu N vezes" (são dado de execução, não de configuração); os gastos de IA
 * saíram; todo tempo ganhou unidade; o "Salvar" ficou fixo no topo.
 *
 * Tudo em memória. O "salvar" espera 900 ms e devolve sucesso, ou erro no
 * cenário "Erro ao salvar".
 */
import type { SelectMenuItem } from '@nuxt/ui'
import CartaoDeSecao from './_CartaoDeSecao.vue'
import Regra from './_Regra.vue'
import CampoDeDuracao from './_CampoDeDuracao.vue'
import type { Cenario } from './mocks'
import { camposDoWebhook, destinatariosPossiveis } from './mocks'
import type { Campo, EventoDeAviso, Gatilho, PeriodoDoLimite, Protecoes, Secao } from './protecoes'
import { contarDiferencas, FAIXAS, protecoesRecomendadas, secaoIcone, secaoLigada, secoesCompletas, secoesDoMvp, validar } from './protecoes'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  versao: 'completa' | 'mvp'
  gatilho: Gatilho
  cenario: Cenario
  pausado: boolean
  horaDaPausa: string
}>()

const emit = defineEmits<{
  verNoEditor: []
  retomar: []
}>()

/** O que está gravado. O rascunho é a tela; salvar copia o rascunho para cá. */
const salvas = defineModel<Protecoes>({ required: true })
const rascunho = ref<Protecoes>(structuredClone(toRaw(salvas.value)))
watch(salvas, (v) => { rascunho.value = structuredClone(toRaw(v)) })

const toast = useToast()
const p = computed(() => props.t.protecoes)
const mvp = computed(() => props.versao === 'mvp')
const somenteLeitura = computed(() => props.cenario === 'semPermissao')

/* ---------- carregando ---------- */
const carregando = ref(true)
onMounted(() => setTimeout(() => { carregando.value = false }, 450))

/* ---------- grupos visíveis ---------- */
const secoes = computed<Secao[]>(() => mvp.value ? secoesDoMvp : secoesCompletas)
const tituloDaSecao = (s: Secao) => p.value[s].titulo

/* ---------- alterações e validação ---------- */
const alteracoes = computed(() => contarDiferencas(rascunho.value, salvas.value))
const invalidos = computed(() => validar(rascunho.value).filter(e => secoes.value.includes(e.secao)))
function erroDe(campo: Campo, faixa: readonly [number, number]) {
  return invalidos.value.some(e => e.campo === campo) ? p.value.numeroInvalido(faixa[0], faixa[1]) : undefined
}
const estadoDoSalvar = computed(() => {
  if (invalidos.value.length) return { texto: p.value.salvar.invalidos(invalidos.value.length), cor: 'text-error', corIcone: 'text-error', icone: 'i-lucide-circle-alert' }
  if (alteracoes.value) return { texto: p.value.salvar.alteracoes(alteracoes.value), cor: 'text-toned', corIcone: 'text-warning', icone: 'i-lucide-circle-dot' }
  return { texto: p.value.salvar.semAlteracoes, cor: 'text-muted', corIcone: 'text-success', icone: 'i-lucide-check' }
})

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 900))
  salvando.value = false
  if (props.cenario === 'erroAoSalvar') {
    toast.add({ title: p.value.salvar.erro, description: p.value.salvar.erroDesc, icon: 'i-lucide-circle-x', color: 'error' })
    return
  }
  salvas.value = structuredClone(toRaw(rascunho.value))
  toast.add({ title: p.value.salvar.salvo, description: p.value.salvar.salvoDesc, icon: 'i-lucide-check', color: 'success' })
}
function descartar() {
  rascunho.value = structuredClone(toRaw(salvas.value))
}
function restaurar() {
  rascunho.value = protecoesRecomendadas()
  toast.add({ title: p.value.restaurado, description: p.value.restauradoDesc, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
}

/* ---------- índice lateral ---------- */
const secaoAtiva = ref<Secao>('volume')
function irPara(s: Secao) {
  secaoAtiva.value = s
  document.getElementById(`secao-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** O índice acompanha a rolagem: fica ativo o grupo mais alto que está à vista. */
const rolagem = ref<HTMLElement | null>(null)
let observador: IntersectionObserver | undefined
watch(carregando, async (c) => {
  if (c) return
  await nextTick()
  observador = new IntersectionObserver((entradas) => {
    const visivel = entradas.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
    if (visivel) secaoAtiva.value = visivel.target.id.replace('secao-', '') as Secao
  }, { root: rolagem.value, rootMargin: '-25% 0px -55% 0px' })
  for (const s of secoes.value) {
    const el = document.getElementById(`secao-${s}`)
    if (el) observador.observe(el)
  }
})
onBeforeUnmount(() => observador?.disconnect())

/* ---------- opções dos menus ---------- */
const opcoes = <K extends string>(mapa: Record<K, { label: string, description: string }>, recomendado?: K) =>
  (Object.keys(mapa) as K[]).map(valor => ({
    value: valor,
    label: valor === recomendado ? `${mapa[valor].label} (${p.value.recomendado})` : mapa[valor].label,
    description: mapa[valor].description,
  }))

const periodos = computed(() => (['segundo', 'minuto', 'hora', 'dia'] as PeriodoDoLimite[])
  .map(v => ({ value: v, label: p.value.volume.periodos[v] })))

const itensDeDestinatario = computed<SelectMenuItem[][]>(() => [
  [
    { type: 'label', label: p.value.avisos.pessoas },
    ...destinatariosPossiveis.filter(d => d.tipo === 'pessoa').map(d => ({
      value: d.id,
      label: 'papel' in d ? `${d.nome} (${p.value.avisos.dono})` : d.nome,
      icon: 'i-lucide-user-round',
    })),
  ],
  [
    { type: 'label', label: p.value.avisos.cargos },
    ...destinatariosPossiveis.filter(d => d.tipo === 'cargo').map(d => ({ value: d.id, label: d.nome, icon: 'i-lucide-users-round' })),
  ],
])

const itensDeEvento = computed(() => (['segurou', 'pausou', 'cadeia', 'tetoIa'] as EventoDeAviso[])
  .map(e => ({ value: e, label: p.value.avisos.eventosOpcoes[e] })))

function alternarDia(d: number) {
  const dias = rascunho.value.volume.janela.dias
  rascunho.value.volume.janela.dias = dias.includes(d) ? dias.filter(x => x !== d) : [...dias, d].sort()
}

/* ---------- ciclo encontrado no fluxo ---------- */
const ciclo = computed<'nenhum' | 'aberto' | 'resolvido'>(() => {
  if (props.gatilho !== 'itens' && props.gatilho !== 'email') return 'nenhum'
  return rascunho.value.cadeia.ignorarFluxos ? 'resolvido' : 'aberto'
})

/** Largura dos menus de escolha: a mesma em todas as linhas, para os controles alinharem. */
const LARGURA_DO_MENU = 'w-72'
const MENU = { content: 'min-w-80' }
</script>

<template>
  <div ref="rolagem" class="relative min-h-0 flex-1 overflow-y-auto bg-elevated/30">
    <!-- Topo fixo: título e Salvar -->
    <div class="sticky top-0 z-20 border-b border-default bg-default/95 backdrop-blur">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <div class="min-w-0 flex-1">
          <h2 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
            <UIcon name="i-lucide-shield-check" class="size-5 text-primary" />
            {{ p.titulo }}
          </h2>
          <p class="text-sm text-muted max-sm:hidden">{{ p.descricao }}</p>
        </div>
        <div v-if="!somenteLeitura" class="flex flex-wrap items-center gap-2">
          <Transition mode="out-in" enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
            <span :key="estadoDoSalvar.texto" class="mr-1 flex items-center gap-1.5 text-xs" :class="estadoDoSalvar.cor" role="status">
              <UIcon :name="estadoDoSalvar.icone" class="size-3.5" :class="estadoDoSalvar.corIcone" />
              {{ estadoDoSalvar.texto }}
            </span>
          </Transition>
          <UButton :label="p.restaurar" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" size="sm" @click="restaurar" />
          <UButton v-if="alteracoes > 0" :label="p.salvar.descartar" color="neutral" variant="outline" size="sm" :disabled="salvando" @click="descartar" />
          <UButton
            :label="p.salvar.salvar"
            icon="i-lucide-save"
            size="sm"
            :loading="salvando"
            :disabled="alteracoes === 0 || invalidos.length > 0"
            @click="salvar"
          />
        </div>
      </div>
    </div>

    <div class="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6">
      <UAlert
        v-if="somenteLeitura"
        :title="p.semPermissao.titulo"
        :description="p.semPermissao.descricao"
        icon="i-lucide-lock"
        color="neutral"
        variant="subtle"
      />

      <div class="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
        <!-- Índice lateral -->
        <nav class="hidden lg:block" :aria-label="p.indice.titulo">
          <div class="sticky top-28 flex flex-col gap-0.5">
            <p class="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ p.indice.titulo }}</p>
            <button
              v-for="s in secoes"
              :key="s"
              type="button"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
              :class="secaoAtiva === s ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
              :title="tituloDaSecao(s)"
              :aria-current="secaoAtiva === s ? 'location' : undefined"
              @click="irPara(s)"
            >
              <span class="min-w-0 flex-1 truncate">{{ tituloDaSecao(s) }}</span>
              <span
                class="size-1.5 shrink-0 rounded-full transition-colors"
                :class="secaoLigada(rascunho, s, gatilho) ? 'bg-success' : 'bg-(--ui-border-accented)'"
                :aria-label="secaoLigada(rascunho, s, gatilho) ? p.indice.ligada : p.indice.desligada"
              />
            </button>
          </div>
        </nav>

        <div v-if="carregando" class="flex flex-col gap-6" :aria-label="p.carregando" aria-busy="true">
          <USkeleton v-for="n in 3" :key="n" class="h-40 rounded-lg" />
        </div>

        <div v-else class="flex flex-col gap-10">
          <!-- Volume de disparos -->
          <CartaoDeSecao id="secao-volume" :icone="secaoIcone.volume" :titulo="p.volume.titulo" :descricao="p.volume.descricao" :indice="0">
            <Regra v-model="rascunho.volume.limite.ativo" :label="p.volume.limite" :descricao="p.volume.limiteAjuda" :disabled="somenteLeitura" :erro="erroDe('limite', FAIXAS.maximo)">
              <UInputNumber
                v-model="rascunho.volume.limite.maximo"
                :min="FAIXAS.maximo[0]"
                :max="FAIXAS.maximo[1]"
                :increment="false"
                :decrement="false"
                size="sm"
                class="w-20"
                :disabled="somenteLeitura"
                :aria-label="p.volume.limite"
              />
              <span>{{ p.volume.por }}</span>
              <USelect v-if="!mvp" v-model="rascunho.volume.limite.periodo" :items="periodos" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.volume.por" />
              <span v-else>{{ p.volume.periodos.minuto }}</span>
            </Regra>

            <Regra v-if="mvp" :label="p.volume.excedente" :descricao="p.volume.mvpExcedenteAjuda" :fixo="p.volume.mvpExcedente" />
            <Regra v-else :label="p.volume.excedente" :descricao="p.volume.excedenteAjuda">
              <USelect v-model="rascunho.volume.excedente" :items="opcoes(p.volume.excedentes, 'fila')" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura" :aria-label="p.volume.excedente" />
            </Regra>

            <template v-if="!mvp">
              <Regra v-model="rascunho.volume.janela.ativo" :label="p.volume.janela" :descricao="p.volume.janelaAjuda" :disabled="somenteLeitura">
                <USelect v-model="rascunho.volume.janela.modo" :items="opcoes(p.volume.modos)" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura" :aria-label="p.volume.janela" />
              </Regra>
              <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-100" leave-to-class="opacity-0">
                <div v-if="rascunho.volume.janela.ativo && rascunho.volume.janela.modo === 'personalizado'" class="flex flex-wrap items-center justify-end gap-3 py-4">
                  <UFieldGroup size="sm" :aria-label="p.volume.janela">
                    <UButton
                      v-for="(dia, d) in p.volume.dias"
                      :key="d"
                      :label="dia"
                      :color="rascunho.volume.janela.dias.includes(d) ? 'primary' : 'neutral'"
                      :variant="rascunho.volume.janela.dias.includes(d) ? 'soft' : 'outline'"
                      :aria-pressed="rascunho.volume.janela.dias.includes(d)"
                      :disabled="somenteLeitura"
                      @click="alternarDia(d)"
                    />
                  </UFieldGroup>
                  <span class="flex items-center gap-2 text-sm text-toned">
                    {{ p.volume.das }}
                    <UInput v-model="rascunho.volume.janela.inicio" type="time" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.volume.das" />
                    {{ p.volume.as }}
                    <UInput v-model="rascunho.volume.janela.fim" type="time" size="sm" class="w-28" :disabled="somenteLeitura" :aria-label="p.volume.as" />
                  </span>
                </div>
              </Transition>
            </template>
          </CartaoDeSecao>

          <!-- Execuções ao mesmo tempo -->
          <CartaoDeSecao id="secao-simultaneas" :icone="secaoIcone.simultaneas" :titulo="p.simultaneas.titulo" :descricao="p.simultaneas.descricao" :indice="1">
            <Regra v-model="rascunho.simultaneas.ativo" :label="p.simultaneas.limite" :descricao="p.simultaneas.limiteAjuda" :disabled="somenteLeitura" :erro="erroDe('simultaneas', FAIXAS.simultaneas)">
              <UInputNumber
                v-model="rascunho.simultaneas.limite"
                :min="FAIXAS.simultaneas[0]"
                :max="FAIXAS.simultaneas[1]"
                :increment="false"
                :decrement="false"
                size="sm"
                class="w-20"
                :disabled="somenteLeitura"
                :aria-label="p.simultaneas.limite"
              />
              <span>{{ p.simultaneas.aoMesmoTempo }}</span>
            </Regra>

            <Regra v-if="mvp" :label="p.simultaneas.lotado" :descricao="p.simultaneas.mvpLotadoAjuda" :fixo="p.simultaneas.mvpLotado" />
            <template v-else>
              <Regra :label="p.simultaneas.lotado" :descricao="p.simultaneas.lotadoAjuda">
                <USelect v-model="rascunho.simultaneas.lotado" :items="opcoes(p.simultaneas.lotados, 'esperar')" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura || !rascunho.simultaneas.ativo" :aria-label="p.simultaneas.lotado" />
              </Regra>
              <Regra v-if="gatilho === 'itens'" v-model="rascunho.simultaneas.porItem" :label="p.simultaneas.porItem" :descricao="p.simultaneas.porItemAjuda" :disabled="somenteLeitura" />
              <Regra v-model="rascunho.simultaneas.tempoNaFila.ativo" :label="p.simultaneas.tempoNaFila" :descricao="p.simultaneas.tempoNaFilaAjuda" :disabled="somenteLeitura" :erro="erroDe('tempoNaFila', FAIXAS.duracao)">
                <CampoDeDuracao v-model="rascunho.simultaneas.tempoNaFila" :t="t" :rotulo="p.simultaneas.tempoNaFila" :disabled="somenteLeitura" />
              </Regra>
              <Regra v-if="gatilho === 'timer'" :label="p.simultaneas.sobreposicao" :descricao="p.simultaneas.sobreposicaoAjuda">
                <USelect v-model="rascunho.simultaneas.sobreposicao" :items="opcoes(p.simultaneas.sobreposicoes, 'pular')" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura" :aria-label="p.simultaneas.sobreposicao" />
              </Regra>
            </template>
          </CartaoDeSecao>

          <!-- Disparos repetidos (só na Completa) -->
          <CartaoDeSecao v-if="!mvp" id="secao-repetidos" :icone="secaoIcone.repetidos" :titulo="p.repetidos.titulo" :descricao="p.repetidos.descricao" :indice="2">
            <template v-if="gatilho === 'webhook'">
              <Regra v-model="rascunho.repetidos.webhook.ativo" :label="p.repetidos.webhook" :descricao="p.repetidos.webhookAjuda" :disabled="somenteLeitura" :erro="erroDe('webhook', FAIXAS.duracao)">
                <USelect v-model="rascunho.repetidos.webhook.chave" :items="camposDoWebhook" size="sm" class="w-36 font-mono" :disabled="somenteLeitura" :aria-label="p.repetidos.chave" />
                <CampoDeDuracao v-model="rascunho.repetidos.webhook" :t="t" :rotulo="p.repetidos.webhook" :unidades="['minutos', 'horas', 'dias']" :disabled="somenteLeitura" />
              </Regra>
            </template>
            <template v-else-if="gatilho === 'itens'">
              <Regra v-model="rascunho.repetidos.juntarEdicoes.ativo" :label="p.repetidos.juntarEdicoes" :descricao="p.repetidos.juntarEdicoesAjuda" :disabled="somenteLeitura" :erro="erroDe('juntarEdicoes', FAIXAS.duracao)">
                <CampoDeDuracao v-model="rascunho.repetidos.juntarEdicoes" :t="t" :rotulo="p.repetidos.juntarEdicoes" :unidades="['segundos', 'minutos', 'horas']" :disabled="somenteLeitura" />
              </Regra>
              <Regra :label="p.repetidos.redisparo" :descricao="p.repetidos.redisparoAjuda">
                <USelect v-model="rascunho.repetidos.redisparoPorItem" :items="opcoes(p.repetidos.redisparos)" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura" :aria-label="p.repetidos.redisparo" />
              </Regra>
            </template>
            <template v-else-if="gatilho === 'email'">
              <Regra v-model="rascunho.repetidos.emailRepetido.ativo" :label="p.repetidos.emailRepetido" :descricao="p.repetidos.emailRepetidoAjuda" :disabled="somenteLeitura" :erro="erroDe('emailRepetido', FAIXAS.duracao)">
                <CampoDeDuracao v-model="rascunho.repetidos.emailRepetido" :t="t" :rotulo="p.repetidos.emailRepetido" :unidades="['minutos', 'horas', 'dias']" :disabled="somenteLeitura" />
              </Regra>
            </template>
            <p v-else class="flex items-center gap-2 py-4 text-sm text-muted">
              <UIcon name="i-lucide-circle-slash" class="size-4 shrink-0 text-dimmed" />
              {{ p.repetidos.semRepeticao(t.gatilhos[gatilho]) }}
            </p>
          </CartaoDeSecao>

          <!-- Repetição sem fim -->
          <CartaoDeSecao id="secao-cadeia" :icone="secaoIcone.cadeia" :titulo="p.cadeia.titulo" :descricao="p.cadeia.descricao" :indice="3">
            <template v-if="!mvp && ciclo !== 'nenhum'" #aviso>
              <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-100" leave-to-class="opacity-0">
                <UAlert
                  v-if="ciclo === 'aberto'"
                  key="aberto"
                  :description="gatilho === 'email' ? t.ciclos.email : t.ciclos.itens"
                  icon="i-lucide-repeat"
                  color="warning"
                  variant="subtle"
                  orientation="horizontal"
                  :actions="[{ label: t.ciclos.verNoEditor, icon: 'i-lucide-arrow-right', color: 'neutral', variant: 'outline', size: 'xs', onClick: () => emit('verNoEditor') }]"
                />
                <UAlert
                  v-else
                  key="resolvido"
                  :description="gatilho === 'email' ? t.ciclos.resolvidoEmail : t.ciclos.resolvido"
                  icon="i-lucide-shield-check"
                  color="success"
                  variant="subtle"
                />
              </Transition>
            </template>
            <Regra
              v-if="gatilho === 'itens' || gatilho === 'email'"
              v-model="rascunho.cadeia.ignorarFluxos"
              :label="gatilho === 'email' ? p.cadeia.ignorarEmail : p.cadeia.ignorarItens"
              :descricao="gatilho === 'email' ? p.cadeia.ignorarEmailAjuda : p.cadeia.ignorarItensAjuda"
              :disabled="somenteLeitura"
            />
            <Regra v-model="rascunho.cadeia.limite.ativo" :label="p.cadeia.limite" :descricao="p.cadeia.limiteAjuda" :disabled="somenteLeitura" :erro="erroDe('niveis', FAIXAS.niveis)">
              <UInputNumber
                v-model="rascunho.cadeia.limite.niveis"
                :min="FAIXAS.niveis[0]"
                :max="FAIXAS.niveis[1]"
                :increment="false"
                :decrement="false"
                size="sm"
                class="w-20"
                :disabled="somenteLeitura"
                :aria-label="p.cadeia.limite"
              />
              <span>{{ p.cadeia.niveis }}</span>
            </Regra>
          </CartaoDeSecao>

          <!-- Tempo e erros -->
          <CartaoDeSecao id="secao-erros" :icone="secaoIcone.erros" :titulo="p.erros.titulo" :descricao="p.erros.descricao" :indice="4">
            <template v-if="pausado" #aviso>
              <UAlert
                :title="p.erros.pausadoDesde(horaDaPausa)"
                icon="i-lucide-circle-pause"
                color="warning"
                variant="subtle"
                orientation="horizontal"
                :actions="somenteLeitura ? [] : [{ label: t.banner.retomar, icon: 'i-lucide-play', color: 'primary', size: 'xs', onClick: () => emit('retomar') }]"
              />
            </template>
            <Regra v-if="!mvp" v-model="rascunho.erros.tempoMaximo.ativo" :label="p.erros.tempoMaximo" :descricao="p.erros.tempoMaximoAjuda" :disabled="somenteLeitura" :erro="erroDe('tempoMaximo', FAIXAS.duracao)">
              <CampoDeDuracao v-model="rascunho.erros.tempoMaximo" :t="t" :rotulo="p.erros.tempoMaximo" :disabled="somenteLeitura" />
            </Regra>
            <Regra v-model="rascunho.erros.pausarAposErros.ativo" :label="p.erros.pausar" :descricao="p.erros.pausarAjuda" :disabled="somenteLeitura" :erro="erroDe('erros', FAIXAS.erros)">
              <UInputNumber
                v-model="rascunho.erros.pausarAposErros.erros"
                :min="FAIXAS.erros[0]"
                :max="FAIXAS.erros[1]"
                :increment="false"
                :decrement="false"
                size="sm"
                class="w-20"
                :disabled="somenteLeitura"
                :aria-label="p.erros.pausar"
              />
              <span>{{ p.erros.errosSeguidos }}</span>
            </Regra>
            <Regra v-if="mvp" :label="p.erros.duranteAPausa" :descricao="p.erros.mvpDuranteAPausaAjuda" :fixo="p.erros.mvpDuranteAPausa" />
            <Regra v-else :label="p.erros.duranteAPausa" :descricao="p.erros.duranteAPausaAjuda">
              <USelect v-model="rascunho.erros.duranteAPausa" :items="opcoes(p.erros.duranteAPausaOpcoes, 'guardar')" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura || !rascunho.erros.pausarAposErros.ativo" :aria-label="p.erros.duranteAPausa" />
            </Regra>
          </CartaoDeSecao>

          <!-- Custo de IA (só na Completa) -->
          <CartaoDeSecao v-if="!mvp" id="secao-ia" :icone="secaoIcone.ia" :titulo="p.ia.titulo" :descricao="p.ia.descricao" :indice="5">
            <Regra v-model="rascunho.ia.porExecucao.ativo" :label="p.ia.porExecucao" :descricao="p.ia.porExecucaoAjuda" :disabled="somenteLeitura" :erro="erroDe('iaExecucao', FAIXAS.creditos)">
              <UInputNumber v-model="rascunho.ia.porExecucao.creditos" :min="FAIXAS.creditos[0]" :max="FAIXAS.creditos[1]" :increment="false" :decrement="false" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.ia.porExecucao" />
              <span>{{ p.ia.creditos }}</span>
            </Regra>
            <Regra v-model="rascunho.ia.porDia.ativo" :label="p.ia.porDia" :descricao="p.ia.porDiaAjuda" :disabled="somenteLeitura" :erro="erroDe('iaDia', FAIXAS.creditos)">
              <UInputNumber v-model="rascunho.ia.porDia.creditos" :min="FAIXAS.creditos[0]" :max="FAIXAS.creditos[1]" :increment="false" :decrement="false" size="sm" class="w-24" :disabled="somenteLeitura" :aria-label="p.ia.porDia" />
              <span>{{ p.ia.creditos }}</span>
            </Regra>
            <Regra :label="p.ia.noTeto" :descricao="p.ia.noTetoAjuda">
              <USelect v-model="rascunho.ia.noTeto" :items="opcoes(p.ia.noTetoOpcoes, 'aprovar')" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura || !(rascunho.ia.porExecucao.ativo || rascunho.ia.porDia.ativo)" :aria-label="p.ia.noTeto" />
            </Regra>
          </CartaoDeSecao>

          <!-- Avisos -->
          <CartaoDeSecao id="secao-avisos" :icone="secaoIcone.avisos" :titulo="p.avisos.titulo" :descricao="p.avisos.descricao" :indice="6">
            <Regra v-if="mvp" v-model="rascunho.avisos.ativo" :label="p.avisos.mvpAtivo" :descricao="p.avisos.mvpAjuda" :disabled="somenteLeitura" />
            <template v-else>
              <Regra v-model="rascunho.avisos.ativo" :label="p.avisos.ativo" :descricao="p.avisos.ativoAjuda" :disabled="somenteLeitura" />
              <template v-if="rascunho.avisos.ativo">
                <Regra :label="p.avisos.destinatarios" :erro="invalidos.some(e => e.campo === 'destinatarios') ? p.avisos.destinatariosVazio : undefined">
                  <USelectMenu
                    v-model="rascunho.avisos.destinatarios"
                    :items="itensDeDestinatario"
                    value-key="value"
                    multiple
                    :placeholder="p.avisos.destinatariosPlaceholder"
                    size="sm"
                    :class="LARGURA_DO_MENU"
                    :ui="MENU"
                    :disabled="somenteLeitura"
                    :aria-label="p.avisos.destinatarios"
                  />
                </Regra>
                <Regra :label="p.avisos.frequencia">
                  <USelect v-model="rascunho.avisos.frequencia" :items="opcoes(p.avisos.frequencias, 'naHora')" size="sm" :class="LARGURA_DO_MENU" :ui="MENU" :disabled="somenteLeitura" :aria-label="p.avisos.frequencia" />
                </Regra>
                <Regra :label="p.avisos.eventos">
                  <USelectMenu
                    v-model="rascunho.avisos.eventos"
                    :items="itensDeEvento"
                    value-key="value"
                    multiple
                    :search-input="false"
                    :placeholder="p.avisos.eventosPlaceholder"
                    size="sm"
                    :class="LARGURA_DO_MENU"
                    :ui="MENU"
                    :disabled="somenteLeitura"
                    :aria-label="p.avisos.eventos"
                  />
                </Regra>
              </template>
            </template>
          </CartaoDeSecao>
        </div>
      </div>
    </div>
  </div>
</template>
