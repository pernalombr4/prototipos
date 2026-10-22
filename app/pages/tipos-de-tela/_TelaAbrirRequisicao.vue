<script setup lang="ts">
/**
 * MÓDULO REQUISIÇÕES · ABRIR REQUISIÇÃO.
 *
 * Substitui o tipo legado Requisições, cujo envio responde HTTP 500 sem nada
 * na tela e sem registro (N4, P0), e que pede de novo o formulário já
 * escolhido.
 *
 * O que muda:
 *   - catálogo de formulários por área, com busca: a pessoa escolhe o que
 *     precisa, não a categoria;
 *   - o formulário restrito a um grupo não aparece para quem não pode abri-lo
 *     ("Aprovar pagamento fora do ciclo" só para Compras);
 *   - todo envio termina em 1 de 3 estados (W4): enviando; enviado com número;
 *     falhou, com o motivo e o que foi preenchido preservado;
 *   - o pedido enviado aparece em Minhas requisições na hora.
 */
import { EU, HOJE, formularios, gruposDe, type Area, type CampoDoFormulario, type FormularioDeRequisicao, type Requisicao } from './mocks'
import { esperar, useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [], acompanhar: [] }>()

const { cenario, perfil, envioFalha, minhas, triagem, semGrupo } = useTiposDeTela()

const area = ref<Area | 'todas'>('todas')
const busca = ref('')

/** Quem gerencia vê como alguém de Compras, para o formulário restrito aparecer. */
const gruposDeQuemUsa = computed(() => {
  if (semGrupo.value) return []
  const meus = gruposDe(EU.id).map(g => g.id)
  return perfil.value === 'gestor' ? [...meus, 12] : meus
})

const disponiveis = computed(() => formularios.filter(f => !f.grupos.length || f.grupos.some(g => gruposDeQuemUsa.value.includes(g))))

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return disponiveis.value
    .filter(f => area.value === 'todas' || f.area === area.value)
    .filter(f => !q || `${f.nome} ${f.descricao}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q))
})

const abas = computed(() => [
  { value: 'todas', label: props.t.abrir.todas },
  ...(['juridico', 'compras', 'ti', 'rh'] as Area[]).map(a => ({
    value: a,
    label: props.t.abrir.areas[a],
    badge: { label: String(disponiveis.value.filter(f => f.area === a).length), color: 'neutral' as const, variant: 'soft' as const },
  })),
])

/* ---------------- o formulário ---------------- */

const escolhido = ref<FormularioDeRequisicao | null>(null)
const respostas = reactive<Record<string, string>>({})
const tentou = ref(false)
type Fase = 'preenchendo' | 'enviando' | 'enviado' | 'falhou'
const fase = ref<Fase>('preenchendo')
const criada = ref<Requisicao | null>(null)

const aberto = computed({
  get: () => !!escolhido.value,
  set: (v) => { if (!v && fase.value !== 'enviando') escolhido.value = null },
})

function escolher(f: FormularioDeRequisicao) {
  for (const k of Object.keys(respostas)) delete respostas[k]
  tentou.value = false
  fase.value = 'preenchendo'
  criada.value = null
  escolhido.value = f
}

function faltando(c: CampoDoFormulario) {
  return tentou.value && c.obrigatorio && !(respostas[c.chave] ?? '').trim()
}

async function enviar() {
  const f = escolhido.value
  if (!f) return
  tentou.value = true
  if (f.campos.some(c => c.obrigatorio && !(respostas[c.chave] ?? '').trim())) return
  fase.value = 'enviando'
  await esperar(1100)
  if (envioFalha.value) {
    fase.value = 'falhou'
    return
  }
  const todos = [...minhas.value, ...triagem.value]
  const numero = Math.max(...todos.map(r => r.id)) + 1
  const agora = new Date(HOJE)
  const r: Requisicao = {
    id: numero,
    numero: `REQ-${numero}`,
    formulario: f.id,
    assunto: respostas.assunto || f.nome,
    solicitante: EU.id,
    responsavel: null,
    etapa: f.triagem ? 'em_triagem' : 'em_atendimento',
    abertaEm: agora,
    atualizadaEm: agora,
    origem: 'formulario',
    respostas: { ...respostas },
    historico: [{ quando: agora, quem: EU.id, oQue: 'abriu' }],
    comentarios: [],
  }
  minhas.value = [r, ...minhas.value]
  // A mesma requisição entra na Triagem do grupo Jurídico: decidir lá muda aqui.
  if (f.triagem && f.area === 'juridico') triagem.value = [r, ...triagem.value]
  criada.value = r
  fase.value = 'enviado'
}

function acompanhar() {
  escolhido.value = null
  emit('acompanhar')
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-circle-plus"
      :titulo="t.abrir.titulo"
      :descricao="t.abrir.descricao"
      :substitui="['Requisições', 'tela nativa escondida Requests']"
      nativo="todos"
      onde="Módulo Requisições: fixo no menu de todo membro. O admin monta o catálogo em Configurações."
    />

    <EstadoDaTela :t="t" :cenario="cenario" forma="cartoes" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty icon="i-lucide-inbox" :title="t.abrir.vazioTitulo" :description="t.abrir.vazioTexto" />
      </template>

      <div class="flex flex-wrap items-center gap-3 border-b border-default px-6 py-3">
        <UTabs v-model="area" :items="abas" :content="false" size="sm" variant="pill" color="neutral" />
        <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.abrir.buscar" size="sm" class="ml-auto w-64" :aria-label="t.abrir.buscar" />
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-6 pb-24">
        <div v-if="!filtrados.length" class="flex justify-center py-16">
          <UEmpty icon="i-lucide-search-x" :title="t.abrir.nenhum" :description="t.abrir.nenhumDica" />
        </div>
        <TransitionGroup
          v-else
          tag="ul"
          class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          appear
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
        >
          <li
            v-for="(f, i) in filtrados"
            :key="f.id"
            class="group relative flex flex-col gap-3 rounded-lg border border-default bg-default p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            :style="{ transitionDelay: `${i * 30}ms` }"
          >
            <div class="flex items-start gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UIcon :name="f.icone" class="size-5" />
              </span>
              <span class="min-w-0 flex-1">
                <!-- Stretched link: o cartão inteiro abre o formulário (regra 25) -->
                <button type="button" class="block text-left text-sm font-medium text-highlighted after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none" @click="escolher(f)">
                  {{ f.nome }}
                </button>
                <span class="mt-0.5 block text-xs text-muted">{{ f.descricao }}</span>
              </span>
            </div>
            <div class="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted">
              <UBadge :label="t.abrir.areas[f.area]" color="neutral" variant="subtle" size="sm" />
              <span class="flex items-center gap-1"><UIcon name="i-lucide-clock" class="size-3.5" />{{ t.abrir.prazo(f.prazoDias) }}</span>
              <span v-if="f.triagem" class="flex items-center gap-1"><UIcon name="i-lucide-list-filter" class="size-3.5" />{{ t.abrir.passaPorTriagem }}</span>
              <span class="ml-auto flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
                <UIcon name="i-lucide-arrow-right" class="size-4" />
              </span>
            </div>
          </li>
        </TransitionGroup>
      </div>
    </EstadoDaTela>

    <!-- O formulário, com os 3 finais do envio -->
    <USlideover v-model:open="aberto" :title="escolhido?.nome ?? ''" :description="escolhido ? `${t.abrir.areas[escolhido.area]} · ${t.abrir.prazo(escolhido.prazoDias)}` : ''" :dismissible="fase !== 'enviando'">
      <template #body>
        <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
          <div v-if="fase === 'enviado' && criada" key="ok" class="flex flex-col items-center gap-4 py-10 text-center" role="status">
            <span class="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
              <UIcon name="i-lucide-check" class="size-7" />
            </span>
            <div>
              <p class="text-base font-semibold text-highlighted">{{ t.abrir.sucessoTitulo(criada.numero) }}</p>
              <p class="mt-1 text-sm text-muted">{{ t.abrir.sucessoTexto }}</p>
              <p v-if="escolhido?.triagem" class="mt-1 text-sm text-muted">{{ t.abrir.sucessoTriagem }}</p>
            </div>
            <div class="flex flex-wrap justify-center gap-2">
              <UButton :label="t.abrir.abrirOutra" color="neutral" variant="outline" @click="escolhido = null" />
              <UButton :label="t.abrir.acompanhar" icon="i-lucide-arrow-right" color="primary" @click="acompanhar" />
            </div>
          </div>

          <form v-else key="form" id="form-requisicao" class="space-y-4" @submit.prevent="enviar">
            <UAlert
              v-if="fase === 'falhou'"
              icon="i-lucide-circle-alert"
              color="error"
              variant="subtle"
              :title="t.abrir.falhaTitulo"
              :description="t.abrir.falhaTexto"
              class="animate-[entrada_.2s_ease-out]"
            />
            <UFormField
              v-for="c in escolhido?.campos ?? []"
              :key="c.chave"
              :label="c.rotulo"
              :required="c.obrigatorio"
              :help="c.ajuda"
              :error="faltando(c) ? t.abrir.campoObrigatorio : undefined"
            >
              <UTextarea v-if="c.tipo === 'textoLongo'" v-model="respostas[c.chave]" :rows="3" autoresize class="w-full" :disabled="fase === 'enviando'" />
              <USelect v-else-if="c.tipo === 'lista'" v-model="respostas[c.chave]" :items="c.opcoes ?? []" :placeholder="t.abrir.selecione" class="w-full" :disabled="fase === 'enviando'" />
              <UInput v-else-if="c.tipo === 'data'" v-model="respostas[c.chave]" type="date" class="w-full" :disabled="fase === 'enviando'" />
              <UInput v-else-if="c.tipo === 'valor'" v-model="respostas[c.chave]" inputmode="decimal" placeholder="R$ 0,00" class="w-full" :disabled="fase === 'enviando'" />
              <UInput v-else v-model="respostas[c.chave]" class="w-full" :disabled="fase === 'enviando'" />
            </UFormField>
          </form>
        </Transition>
      </template>
      <template #footer>
        <div v-if="fase !== 'enviado'" class="flex w-full items-center justify-end gap-2">
          <UButton :label="t.abrir.voltar" color="neutral" variant="ghost" :disabled="fase === 'enviando'" @click="escolhido = null" />
          <UButton
            type="submit"
            form="form-requisicao"
            :label="fase === 'enviando' ? t.abrir.enviando : fase === 'falhou' ? t.comum.tentarDeNovo : t.abrir.enviar"
            :icon="fase === 'falhou' ? 'i-lucide-rotate-cw' : 'i-lucide-send'"
            color="primary"
            :loading="fase === 'enviando'"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
