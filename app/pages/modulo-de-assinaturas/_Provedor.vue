<script setup lang="ts">
/**
 * A página do provedor, aberta pelo card em Integrações > Apps.
 *
 * PROPOSTA (B3). Hoje a mesma informação aparece até 5 vezes na tela, com textos diferentes (BRIEFING, "Página do
 * provedor"). Aqui cada informação tem 1 lugar:
 * - o topo diz o provedor e 1 estado: pronto para enviar ou falta configurar;
 * - "Configuração" lista só as etapas de quem configura, numeradas, cada uma com o próprio conteúdo: a credencial está
 *   dentro da etapa 1, a URL do webhook dentro da etapa do webhook. O segredo do servidor sai da lista. As etapas são
 *   uma linha do tempo vertical (UTimeline, rodada 3), com a linha que liga uma etapa à outra e sem divisória: a linha
 *   fica verde até a última etapa concluída;
 * - a etapa do webhook da conta só conclui quando o 1º retorno chega (M17): o ENSPACE não confere o portal do provedor;
 * - "O que a <provedor> faz no ENSPACE" diz cada recurso 1 vez, com a consequência. Substitui os selos do topo, o alerta,
 *   "Como se comporta" e "Recursos opcionais";
 * - "Detalhes técnicos" fica recolhido.
 */
import type { Credencial, ProvedorId } from './mocks'
import { provedorPorId } from './mocks'
import { credenciaisVisiveis, credencialPronta, criarCredencial, estado, excluirCredencial } from './estado'
import { dataHora } from './formato'
import type { Textos } from './textos'
import Logo from './_Logo.vue'
import NovaCredencial from './_NovaCredencial.vue'

const props = defineProps<{ t: Textos, provedor: ProvedorId }>()
const emit = defineEmits<{ voltar: [] }>()
const toast = useToast()

const pt = computed(() => props.t.provedor)
const p = computed(() => provedorPorId.get(props.provedor)!)
const loc = computed(() => props.t.locale)
const creds = computed(() => credenciaisVisiveis.value.filter(c => c.provedor === props.provedor))

/* ---------- etapas ---------- */
type EstadoDaEtapa = 'feito' | 'pendente' | 'aguardando'
interface Etapa { chave: 'credencial' | 'cofre' | 'consentimento' | 'webhook', titulo: string, ajuda: string, estado: EstadoDaEtapa }

const etapas = computed<Etapa[]>(() => {
  const lista: Etapa[] = [{ chave: 'credencial', titulo: pt.value.etapaCredencial, ajuda: pt.value.etapaCredencialAjuda(p.value.nome), estado: creds.value.length ? 'feito' : 'pendente' }]
  if (p.value.recursos.includes('cofres')) lista.push({ chave: 'cofre', titulo: pt.value.etapaCofre, ajuda: pt.value.etapaCofreAjuda, estado: creds.value.length && creds.value.every(credencialPronta) ? 'feito' : 'pendente' })
  if (p.value.tipoDeCredencial === 'jwt') lista.push({ chave: 'consentimento', titulo: pt.value.etapaConsentimento, ajuda: pt.value.etapaConsentimentoAjuda, estado: creds.value.length ? 'feito' : 'pendente' })
  if (p.value.webhook === 'conta') lista.push({ chave: 'webhook', titulo: pt.value.etapaWebhook(p.value.nome), ajuda: pt.value.etapaWebhookAjuda(p.value.nome), estado: estado.webhookConfirmado[props.provedor] ? 'feito' : creds.value.length ? 'aguardando' : 'pendente' })
  return lista
})
const feitas = computed(() => etapas.value.filter(e => e.estado === 'feito').length)
const aguardando = computed(() => etapas.value.filter(e => e.estado === 'aguardando').length)
const pronto = computed(() => creds.value.some(credencialPronta))

const corDaEtapa: Record<EstadoDaEtapa, { icone?: string, indicador: string, linha: string, badge: 'success' | 'neutral' | 'warning' }> = {
  feito: { icone: 'i-lucide-check', indicador: 'bg-success text-inverted', linha: 'bg-success', badge: 'success' },
  pendente: { indicador: 'bg-default text-muted ring-1 ring-inset ring-accented', linha: 'bg-accented', badge: 'neutral' },
  aguardando: { icone: 'i-lucide-clock', indicador: 'bg-warning/15 text-warning ring-1 ring-inset ring-warning/40', linha: 'bg-accented', badge: 'warning' },
}
// As etapas na linha do tempo: o indicador mostra o estado (concluída, aguardando) ou o número da etapa pendente.
const linhaDoTempo = computed(() => etapas.value.map((e, i) => ({
  ...e,
  value: e.chave,
  icon: corDaEtapa[e.estado].icone,
  avatar: corDaEtapa[e.estado].icone ? undefined : { text: String(i + 1) },
  ui: { indicator: corDaEtapa[e.estado].indicador, separator: corDaEtapa[e.estado].linha },
})))

/* ---------- credenciais ---------- */
const novaAberta = ref(false)
function salvar(dados: Omit<Credencial, 'id' | 'criadaEm'>) {
  const ligou = criarCredencial(dados)
  toast.add({ title: pt.value.nova.salva, icon: 'i-lucide-check', color: 'success' })
  if (ligou) toast.add({ title: props.t.apps.moduloLigado, description: props.t.apps.moduloLigadoDesc, icon: 'i-lucide-signature', color: 'primary' })
}
const cofres = ['Contratos de fornecedores', 'Recursos humanos', 'Jurídico']
const testando = ref<number | null>(null)
async function testar(c: Credencial) {
  testando.value = c.id
  await new Promise(r => setTimeout(r, 700))
  testando.value = null
  toast.add({ title: pt.value.conexaoOk, description: c.nome, icon: 'i-lucide-plug-zap', color: 'success' })
}
const menuDa = (c: Credencial) => [[
  { label: pt.value.testar, icon: 'i-lucide-plug-zap', onSelect: () => testar(c) },
  ...(c.provedor === 'd4sign' && c.cofre ? [{ label: pt.value.trocarCofre, icon: 'i-lucide-vault', onSelect: () => { c.cofre = null } }] : []),
], [
  { label: pt.value.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirCredencial(c.id) },
]]

/* ---------- webhook ---------- */
const urlVisivel = ref(false)
const url = computed(() => `https://api.enspace.example/webhooks/${props.provedor}/${urlVisivel.value ? 'wsk_7Hq2Lm9Vx4Pa' : '••••••••••••'}`)
const copiado = ref(false)
function copiar() {
  copiado.value = true
  setTimeout(() => (copiado.value = false), 1500)
}

/* ---------- o que o provedor faz ---------- */
const recursos = computed(() => {
  const r = pt.value.recursos
  const tem = (x: string) => p.value.recursos.includes(x as never)
  const linhas = [
    { nome: r.cancelar.nome, sim: tem('cancela'), texto: tem('cancela') ? r.cancelar.sim : r.cancelar.nao, aviso: !tem('cancela') },
    { nome: r.atualizar.nome, sim: tem('consultaStatus'), texto: tem('consultaStatus') ? r.atualizar.sim : r.atualizar.nao },
    { nome: r.reenviar.nome, sim: tem('reenvio'), texto: tem('reenvio') ? r.reenviar.sim : r.reenviar.nao },
    { nome: r.links.nome, sim: tem('links'), texto: tem('links') ? r.links.sim : r.links.nao },
    ...(tem('configurador') ? [{ nome: r.configurador.nome, sim: true, texto: r.configurador.sim }] : []),
    ...(tem('cofres') ? [{ nome: r.cofres.nome, sim: true, texto: r.cofres.sim }] : []),
    { nome: r.webhook.nome, sim: true, texto: p.value.webhook === 'automatico' ? r.webhook.automatico : r.webhook.conta },
  ]
  return linhas
})

const tecnicos = computed(() => [{ label: pt.value.tecnicos, icon: 'i-lucide-code-xml', slot: 'tecnicos' as const }])
const foraDoEscopo = () => toast.add({ title: props.t.geral.foraDoEscopo, description: props.t.geral.foraDoEscopoDesc, icon: 'i-lucide-construction', color: 'neutral' })
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <!-- Topo: o provedor, 1 estado e as ações -->
      <div class="flex flex-wrap items-start gap-4">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :aria-label="t.geral.voltar" @click="emit('voltar')" />
        <div class="min-w-64 flex-1 space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <Logo :app="provedor" :nome="p.nome" tamanho="lg" />
            <UBadge :label="pronto ? pt.pronto : pt.falta" :color="pronto ? 'success' : 'warning'" variant="soft" :icon="pronto ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'" />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-highlighted">{{ p.nome }}</h1>
            <p class="mt-1 max-w-2xl text-sm text-muted">{{ t.apps.descricoes[provedor] }}</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <UButton :label="pt.comoFunciona" icon="i-lucide-circle-help" color="neutral" variant="ghost" @click="foraDoEscopo" />
          <UButton :label="pt.credenciaisRegistradas" icon="i-lucide-key-round" color="neutral" variant="outline" @click="foraDoEscopo" />
          <UButton :label="pt.novaCredencial" icon="i-lucide-plus" @click="novaAberta = true" />
        </div>
      </div>

      <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <!-- Configuração: as etapas de quem configura -->
        <section class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default bg-default" aria-labelledby="titulo-config">
          <header class="flex flex-wrap items-center justify-between gap-2 border-b border-default px-5 py-3">
            <h2 id="titulo-config" class="font-semibold text-highlighted">{{ pt.configuracao }}</h2>
            <span class="text-sm text-muted">{{ pt.progresso(feitas, aguardando, etapas.length) }}</span>
          </header>

          <UTimeline :items="linhaDoTempo" size="sm" class="px-5 pt-5" :ui="{ wrapper: 'min-w-0 pb-7' }">
            <template #wrapper="{ item: e }">
              <div class="min-w-0 space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-medium text-highlighted">{{ e.titulo }}</p>
                    <p class="text-sm text-muted">{{ e.ajuda }}</p>
                  </div>
                  <UBadge :label="pt.estados[e.estado]" :color="corDaEtapa[e.estado].badge" variant="soft" size="sm" class="shrink-0" />
                </div>

                <!-- Etapa 1: as credenciais, dentro da etapa -->
                <template v-if="e.chave === 'credencial'">
                  <p v-if="!creds.length" class="text-sm text-muted">{{ pt.semCredencial }}</p>
                  <ul v-else class="divide-y divide-default rounded-md border border-default">
                    <li v-for="c in creds" :key="c.id" class="flex flex-wrap items-center gap-3 px-3 py-2.5">
                      <UIcon name="i-lucide-key-round" class="size-4 shrink-0 text-muted" />
                      <div class="min-w-40 flex-1">
                        <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-highlighted">
                          {{ c.nome }}
                          <UBadge :label="t.ambientes[c.ambiente]" color="neutral" variant="outline" size="sm" />
                        </p>
                        <p class="text-xs text-muted">{{ pt.criadaEm(dataHora(c.criadaEm, loc)) }}</p>
                      </div>
                      <span v-if="credencialPronta(c)" class="flex items-center gap-1.5 text-xs font-medium text-success">
                        <span class="size-1.5 rounded-full bg-success" />{{ c.cofre ? pt.cofre(c.cofre) : pt.pronta }}
                      </span>
                      <span v-else class="flex items-center gap-1.5 text-xs font-medium text-warning">
                        <span class="size-1.5 rounded-full bg-warning" />{{ pt.semCofre }}
                      </span>
                      <UDropdownMenu :items="menuDa(c)" :content="{ align: 'end' }">
                        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :loading="testando === c.id" :aria-label="t.geral.maisAcoes" />
                      </UDropdownMenu>
                    </li>
                  </ul>
                </template>

                <!-- D4Sign: o cofre de cada credencial -->
                <template v-else-if="e.chave === 'cofre'">
                  <div v-for="c in creds.filter(x => !credencialPronta(x))" :key="c.id" class="flex flex-wrap items-center gap-2">
                    <span class="text-sm text-toned">{{ c.nome }}</span>
                    <USelect :model-value="undefined" :items="cofres" :placeholder="pt.escolherCofre" size="sm" class="w-64" :aria-label="`${pt.escolherCofre}: ${c.nome}`" @update:model-value="(v) => { c.cofre = String(v) }" />
                  </div>
                </template>

                <p v-else-if="e.chave === 'consentimento' && e.estado === 'feito'" class="flex items-center gap-1.5 text-sm text-success">
                  <UIcon name="i-lucide-shield-check" class="size-4" />{{ pt.autorizado }}
                </p>

                <!-- Webhook da conta: a URL e os passos, dentro da etapa -->
                <template v-else-if="e.chave === 'webhook'">
                  <ol class="list-decimal space-y-1 pl-5 text-sm text-toned">
                    <li v-for="passo in pt.webhookPassos(p.nome)" :key="passo">{{ passo }}</li>
                  </ol>
                  <div class="flex items-center gap-2">
                    <UInput :model-value="url" readonly class="min-w-0 flex-1 font-mono" size="sm" :aria-label="pt.etapaWebhook(p.nome)" />
                    <UButton :icon="urlVisivel ? 'i-lucide-eye-off' : 'i-lucide-eye'" :label="urlVisivel ? pt.ocultar : pt.mostrar" color="neutral" variant="outline" size="sm" @click="urlVisivel = !urlVisivel" />
                    <UButton :icon="copiado ? 'i-lucide-check' : 'i-lucide-copy'" :label="copiado ? t.geral.copiado : t.geral.copiar" color="neutral" variant="outline" size="sm" @click="copiar" />
                  </div>
                  <p class="flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-lock" class="size-3.5" />{{ pt.webhookAviso }}</p>
                  <p v-if="estado.webhookConfirmado[provedor]" class="flex items-center gap-1.5 text-sm text-success">
                    <UIcon name="i-lucide-circle-check" class="size-4" />{{ pt.webhookConfirmado(dataHora(estado.webhookConfirmado[provedor]!, loc)) }}
                  </p>
                  <p v-else class="flex items-start gap-1.5 text-sm text-warning">
                    <UIcon name="i-lucide-clock" class="mt-0.5 size-4 shrink-0" />{{ pt.webhookAguardando }}
                  </p>
                </template>
              </div>
            </template>
          </UTimeline>
        </section>

        <!-- O que o provedor faz: cada recurso 1 vez, com a consequência -->
        <div class="space-y-4">
          <section class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default bg-default [animation-delay:60ms]" aria-labelledby="titulo-recursos">
            <h2 id="titulo-recursos" class="border-b border-default px-4 py-3 font-semibold text-highlighted">{{ pt.oQueFaz(p.nome) }}</h2>
            <ul class="divide-y divide-default">
              <li v-for="r in recursos" :key="r.nome" class="flex gap-3 px-4 py-3">
                <UIcon
                  :name="r.sim ? 'i-lucide-circle-check' : r.aviso ? 'i-lucide-triangle-alert' : 'i-lucide-circle-minus'"
                  class="mt-0.5 size-4 shrink-0"
                  :class="r.sim ? 'text-success' : r.aviso ? 'text-warning' : 'text-dimmed'"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium" :class="r.sim || r.aviso ? 'text-highlighted' : 'text-muted'">{{ r.nome }}</p>
                  <p class="text-sm text-muted">{{ r.texto }}</p>
                </div>
              </li>
            </ul>
          </section>

          <UAccordion :items="tecnicos" class="rounded-lg border border-default bg-default px-4" :ui="{ trigger: 'text-sm' }">
            <template #tecnicos>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 pb-4 text-sm">
                <dt class="text-muted">{{ pt.identificador }}</dt><dd class="font-mono text-toned">{{ provedor }}</dd>
                <dt class="text-muted">{{ pt.tipoDeCredencial }}</dt><dd class="text-toned">{{ pt.tiposDeCredencial[p.tipoDeCredencial] }}</dd>
                <dt class="text-muted">{{ pt.ambientes }}</dt><dd class="text-toned">{{ p.ambientes.map(a => t.ambientes[a]).join(', ') }}</dd>
                <dt class="text-muted">{{ pt.registroWebhook }}</dt><dd class="text-toned">{{ p.webhook === 'automatico' ? pt.porEnvelope : pt.porConta }}</dd>
                <dt class="text-muted">{{ pt.segredo }}</dt><dd class="text-toned">{{ pt.configurado }}</dd>
              </dl>
            </template>
          </UAccordion>
        </div>
      </div>
    </div>

    <NovaCredencial v-model:open="novaAberta" :t="t" :provedor="provedor" @salvar="salvar" />
  </div>
</template>
