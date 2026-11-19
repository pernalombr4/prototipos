<script setup lang="ts">
/**
 * Spaceflow > Execuções: a execução do fluxo com o nó Assinatura eletrônica, e o editor do nó.
 *
 * Cópia da prévia (print do QA de 18/11/2026): as abas do fluxo, as abas da execução, a faixa com status, duração,
 * "N/M nós executados" e data, os nós quadrados com o nome embaixo e o painel do nó à direita. PROPOSTA (B8):
 * - M32: o card do nó no canvas mostra o desfecho (Assinado, Recusado, Cancelado, Expirado, Erro), não só a cor;
 * - M35 e C48: cancelado no módulo ou recusado, o nó e a execução vão para Erro, com o motivo, quem fez e quando, e o
 *   link "Ver cancelamento", que abre a trilha do envelope;
 * - M25: o painel leva ao envelope e mostra os signatários e a configuração com nomes, não JSON. O JSON fica em "Dados
 *   técnicos", recolhido;
 * - C55: o erro de configuração diz o motivo e o caminho usado, com a dica do caminho certo e o atalho para o editor.
 *
 * O desfecho vem do status do envelope: cancelar o envelope no módulo muda esta tela.
 */
import type { Envelope } from './mocks'
import { ENVELOPE, fluxoPorId, pessoaPorId, provedorPorId } from './mocks'
import type { Desfecho } from './estado'
import { assinados, envelopePorId, estado } from './estado'
import { dataHora } from './formato'
import type { Textos } from './textos'
import Logo from './_Logo.vue'
import EditorDoNo from './_EditorDoNo.vue'

const props = defineProps<{ t: Textos, aba: 'editor' | 'execucoes' }>()
const emit = defineEmits<{ abrirEnvelope: [number], 'update:aba': ['editor' | 'execucoes'] }>()
const f = computed(() => props.t.fluxo)
const loc = computed(() => props.t.locale)
const dh = (iso: string) => dataHora(iso, loc.value)

const envelopeDoDesfecho: Record<Desfecho, number | null> = {
  aguardando: ENVELOPE.adobeEmOrdem, assinado: ENVELOPE.docusignAssinado, recusado: ENVELOPE.docusignRecusado,
  cancelado: ENVELOPE.certisignFluxoCancelado, expirado: ENVELOPE.docusignExpirado, erroProvedor: ENVELOPE.d4signErro, erroConfig: null,
}
const env = computed<Envelope | null>(() => {
  const id = envelopeDoDesfecho[estado.desfecho]
  return id ? envelopePorId(id) ?? null : null
})
/** O desfecho real: o do status do envelope, que pode ter mudado no módulo. */
const desfecho = computed<Desfecho>(() => {
  if (!env.value) return 'erroConfig'
  const s = env.value.status
  return s === 'completed' ? 'assinado' : s === 'rejected' ? 'recusado' : s === 'canceled' ? 'cancelado' : s === 'expired' ? 'expirado' : s === 'error' ? 'erroProvedor' : 'aguardando'
})
const fluxo = computed(() => fluxoPorId.get(env.value?.origem.tipo === 'workflow' ? env.value.origem.fluxo : 1980)!)
const execucao = computed(() => (env.value?.origem.tipo === 'workflow' ? env.value.origem.execucao : 25061))

const emAndamento = computed(() => desfecho.value === 'aguardando')
const sucesso = computed(() => desfecho.value === 'assinado')
const statusExec = computed(() => (emAndamento.value ? 'working' : sucesso.value ? 'completed' : 'error'))
const corExec = computed(() => (emAndamento.value ? 'warning' as const : sucesso.value ? 'success' as const : 'error' as const))
const executados = computed(() => (sucesso.value ? 3 : 2))
const inicio = computed(() => env.value?.created_at ?? '2026-11-18T19:12:00-03:00')
const fim = computed(() => {
  const x = env.value
  if (!x) return '2026-11-18T19:12:01-03:00'
  return x.completed_at ?? x.canceled_at ?? x.eventos.at(-1)!.em
})
const duracao = computed(() => {
  if (emAndamento.value) return '52min'
  const s = Math.max(1, Math.round((new Date(fim.value).getTime() - new Date(inicio.value).getTime()) / 1000))
  return s < 60 ? `${s}s` : s < 3600 ? `${Math.round(s / 60)}min` : `${Math.floor(s / 3600)}h ${Math.round((s % 3600) / 60)}min`
})

const seloDoNo: Record<Desfecho, { chave: string, cor: 'warning' | 'success' | 'error' | 'neutral', icone: string }> = {
  aguardando: { chave: 'aguardando', cor: 'warning', icone: 'i-lucide-hourglass' },
  assinado: { chave: 'assinado', cor: 'success', icone: 'i-lucide-circle-check' },
  recusado: { chave: 'recusado', cor: 'error', icone: 'i-lucide-circle-x' },
  cancelado: { chave: 'cancelado', cor: 'error', icone: 'i-lucide-ban' },
  expirado: { chave: 'expirado', cor: 'error', icone: 'i-lucide-calendar-x' },
  erroProvedor: { chave: 'erro', cor: 'error', icone: 'i-lucide-octagon-alert' },
  erroConfig: { chave: 'erro', cor: 'error', icone: 'i-lucide-octagon-alert' },
}
const corDoQuadrado = { warning: 'bg-warning text-inverted ring-warning/30', success: 'bg-success text-inverted ring-success/30', error: 'bg-error text-inverted ring-error/30', neutral: 'border-2 border-dashed border-accented bg-default text-dimmed ring-transparent' } as const

/* ---------- o resultado, em frase ---------- */
const resultado = computed(() => {
  const m = f.value.msg
  const x = env.value
  const pnome = x ? provedorPorId.get(x.provider)!.nome : ''
  switch (desfecho.value) {
    case 'cancelado': {
      const ev = [...x!.eventos].reverse().find(e => e.tipo === 'canceled')!
      const quem = ev.autor.tipo === 'pessoa' ? pessoaPorId.get(ev.autor.id)!.nome : pnome
      return { cor: 'error' as const, icone: 'i-lucide-ban', titulo: m.cancelado(quem, dh(ev.em)), linhas: ev.motivo ? [props.t.envelope.faixa.motivo(ev.motivo)] : [], link: m.verCancelamento }
    }
    case 'recusado': {
      const pa = x!.participantes.find(p => p.status === 'rejected')!
      return { cor: 'error' as const, icone: 'i-lucide-circle-x', titulo: m.recusado(pa.nome, dh(pa.em!)), linhas: pa.motivo ? [m.motivoInformado(pa.motivo)] : [], link: null }
    }
    case 'expirado': return { cor: 'error' as const, icone: 'i-lucide-calendar-x', titulo: m.expirado(dh(x!.expires_at!)), linhas: [], link: null }
    case 'assinado': return { cor: 'success' as const, icone: 'i-lucide-circle-check', titulo: m.assinado(dh(x!.completed_at!)), linhas: [], link: null }
    case 'erroProvedor': return { cor: 'error' as const, icone: 'i-lucide-octagon-alert', titulo: m.erroProvedor(pnome), linhas: [], link: null }
    case 'erroConfig': return { cor: 'error' as const, icone: 'i-lucide-octagon-alert', titulo: m.erroConfig, linhas: [m.erroConfigDica], link: null }
    default: return { cor: 'warning' as const, icone: 'i-lucide-hourglass', titulo: m.aguardando(assinados(x!), x!.participantes.length), linhas: [], link: null }
  }
})

const configuracao = computed(() => {
  const x = env.value
  const c = f.value.campos
  const cred = estado.credenciais.find(k => k.id === (x?.credential ?? 58))
  return [
    { k: c.credencial, v: cred ? `${provedorPorId.get(cred.provedor)!.nome} · ${cred.nome}` : '' },
    { k: c.documento, v: x?.documento.nome ?? '{{ gerar_arquivo.file }}' },
    { k: c.modo, v: f.value.automatico },
    { k: c.aguardar, v: props.t.geral.sim },
    { k: c.prazo, v: f.value.dias(7) },
    { k: c.seNao, v: f.value.darErro },
  ]
})

const json = computed(() => JSON.stringify({
  envelope_id: env.value?.id ?? null, status: env.value?.status ?? 'error', provider: env.value?.provider ?? 'docusign', credential: env.value?.credential ?? 58,
  signers: env.value?.participantes.map(p => ({ name: p.nome, email: p.email, role: p.papel, order: p.ordem, status: p.status })) ?? [],
}, null, 2))
const tecnicos = computed(() => [{ label: f.value.dadosTecnicos, icon: 'i-lucide-braces', slot: 'json' as const }])

const nos = computed(() => [
  { id: 'inicio', nome: f.value.inicio, icone: 'i-lucide-play', estado: 'success' as const },
  { id: 'assinatura', nome: f.value.assinatura, icone: 'i-lucide-signature', estado: seloDoNo[desfecho.value].cor },
  { id: 'fim', nome: f.value.fim, icone: 'i-lucide-flag', estado: sucesso.value ? 'success' as const : 'neutral' as const },
])
const selecionado = ref<'inicio' | 'assinatura' | 'fim'>('assinatura')
const abasFluxo = computed(() => (['editor', 'execucoes', 'versoes', 'comentarios', 'logs'] as const).map(k => ({ value: k, label: f.value.abas[k] })))
const abaExec = ref('fluxo')
const abasExec = computed(() => (['fluxo', 'detalhes', 'comentarios', 'logs'] as const).map(k => ({ value: k, label: f.value.execAbas[k] })))
const editorAberto = ref(true)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Abas do fluxo (cópia) -->
    <div class="flex items-center gap-4 border-b border-default px-6 pt-3">
      <h1 class="pb-2 text-sm font-semibold text-highlighted">{{ fluxo.nome }}</h1>
      <UTabs :model-value="aba" :items="abasFluxo" :content="false" variant="link" size="sm" color="primary" @update:model-value="(x) => (x === 'editor' || x === 'execucoes') && emit('update:aba', x)" />
    </div>

    <!-- ───────── Editor ───────── -->
    <div v-if="aba === 'editor'" class="flex min-h-0 flex-1">
      <div class="relative flex min-w-0 flex-1 items-center justify-center bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] [background-size:16px_16px]">
        <div class="flex items-start gap-0">
          <template v-for="(n, i) in nos" :key="n.id">
            <button type="button" class="flex w-32 flex-col items-center gap-2 rounded-md p-2 transition-transform hover:-translate-y-0.5" @click="editorAberto = n.id === 'assinatura'">
              <span class="flex size-12 items-center justify-center rounded-lg border-2 border-default bg-default ring-4 ring-transparent" :class="n.id === 'assinatura' && editorAberto && 'border-primary ring-primary/20'">
                <UIcon :name="n.icone" class="size-5 text-highlighted" />
              </span>
              <span class="text-center text-xs font-medium text-highlighted">{{ n.nome }}</span>
            </button>
            <span v-if="i < nos.length - 1" class="mt-8 h-px w-12 border-t-2 border-dashed border-accented" aria-hidden="true" />
          </template>
        </div>
      </div>
      <EditorDoNo v-if="editorAberto" :t="t" @fechar="editorAberto = false" />
    </div>

    <!-- ───────── Execução ───────── -->
    <template v-else>
      <div class="flex flex-wrap items-center gap-4 border-b border-default px-6 py-2">
        <UTabs v-model="abaExec" :items="abasExec" :content="false" variant="pill" size="xs" color="neutral" />
      </div>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-default bg-elevated/40 px-6 py-2 text-xs text-muted">
        <span class="font-medium text-toned">#{{ execucao }}</span>
        <UBadge :label="f.statusExec[statusExec]" :color="corExec" variant="soft" size="sm" />
        <span class="flex items-center gap-1"><UIcon name="i-lucide-timer" class="size-3.5" />{{ duracao }}</span>
        <span>{{ f.nos(executados, 3) }}</span>
        <span class="tabular-nums">{{ dh(inicio) }}</span>
        <span class="ml-auto flex items-center gap-3">
          <span class="flex items-center gap-1.5"><span class="h-0.5 w-5 bg-primary" />{{ f.caminho }}</span>
          <span class="flex items-center gap-1.5"><span class="h-0 w-5 border-t-2 border-dashed border-accented" />{{ f.naoExecutado }}</span>
        </span>
      </div>

      <div class="flex min-h-0 flex-1">
        <!-- Canvas (cópia), com o desfecho no nó -->
        <div class="relative flex min-w-0 flex-1 items-center justify-center bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] [background-size:16px_16px]">
          <div class="flex items-start">
            <template v-for="(n, i) in nos" :key="n.id">
              <button
                type="button"
                class="flex w-36 flex-col items-center gap-2 rounded-md p-2 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-primary"
                :aria-pressed="selecionado === n.id"
                @click="selecionado = n.id"
              >
                <span
                  class="flex size-12 items-center justify-center rounded-lg ring-4 transition-shadow"
                  :class="[corDoQuadrado[n.estado], selecionado === n.id ? 'shadow-md' : '', n.id === 'assinatura' && emAndamento && 'animate-pulse']"
                >
                  <UIcon :name="n.icone" class="size-5" />
                </span>
                <span class="text-center text-xs font-medium text-highlighted">{{ n.nome }}</span>
                <!-- M32: o desfecho escrito no card do nó -->
                <UBadge
                  v-if="n.id === 'assinatura'"
                  :key="desfecho"
                  :label="f.selos[seloDoNo[desfecho].chave]"
                  :icon="seloDoNo[desfecho].icone"
                  :color="seloDoNo[desfecho].cor"
                  variant="soft"
                  size="sm"
                  class="animate-[entrada_.3s_ease-out_both]"
                />
              </button>
              <span
                v-if="i < nos.length - 1"
                class="mt-8 w-12"
                :class="i === 0 || sucesso ? 'h-0.5 bg-primary' : 'h-0 border-t-2 border-dashed border-accented'"
                aria-hidden="true"
              />
            </template>
          </div>
        </div>

        <!-- Painel do nó -->
        <aside class="flex w-[26rem] shrink-0 flex-col overflow-y-auto border-l border-default bg-default" :aria-label="f.assinatura">
          <template v-if="selecionado === 'assinatura'">
            <div class="space-y-1 border-b border-default px-4 py-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-signature" class="size-4 text-muted" />
                <h2 class="font-semibold text-highlighted">{{ f.assinatura }}</h2>
                <UBadge :label="f.statusNo[emAndamento ? 'running' : sucesso ? 'completed' : 'error']" :color="corExec" variant="soft" size="sm" />
              </div>
              <p class="text-xs text-muted">signature</p>
              <p class="text-xs tabular-nums text-muted">{{ f.iniciado }} {{ dh(inicio) }} · {{ f.atualizado }} {{ dh(fim) }}</p>
            </div>

            <div class="space-y-5 px-4 py-4">
              <!-- O resultado em frase -->
              <section class="space-y-2" :aria-label="f.resultado">
                <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ f.resultado }}</p>
                <UAlert :key="desfecho" :color="resultado.cor" :icon="resultado.icone" variant="subtle" :title="resultado.titulo" class="animate-[entrada_.3s_ease-out_both]">
                  <template v-if="resultado.linhas.length" #description>
                    <p v-for="(l, i) in resultado.linhas" :key="i" :class="desfecho === 'erroConfig' && 'font-mono text-xs'">{{ l }}</p>
                  </template>
                  <template v-if="resultado.link || desfecho === 'erroConfig'" #actions>
                    <UButton v-if="resultado.link && env" :label="resultado.link" trailing-icon="i-lucide-arrow-right" color="neutral" variant="outline" size="xs" @click="emit('abrirEnvelope', env.id)" />
                    <UButton v-if="desfecho === 'erroConfig'" :label="f.msg.editarNo" icon="i-lucide-pencil" color="neutral" variant="outline" size="xs" @click="emit('update:aba', 'editor')" />
                  </template>
                </UAlert>
                <p v-if="!emAndamento && !sucesso && desfecho !== 'erroConfig'" class="text-xs text-muted">{{ f.msg.erroSeguiu }}</p>
              </section>

              <!-- M25: o envelope, com link -->
              <section class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ f.envelope }}</p>
                <button
                  v-if="env"
                  type="button"
                  class="group flex w-full items-center gap-3 rounded-md border border-default px-3 py-2.5 text-left transition-colors hover:border-accented hover:bg-elevated/50"
                  @click="emit('abrirEnvelope', env.id)"
                >
                  <Logo :app="env.provider" :nome="provedorPorId.get(env.provider)!.nome" tamanho="sm" class="w-20" />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium text-highlighted">{{ env.title }}</span>
                    <span class="text-xs text-muted">{{ t.status[env.status] }} · {{ assinados(env) }}/{{ env.participantes.length }}</span>
                  </span>
                  <span class="flex items-center gap-1 text-xs font-medium text-primary">{{ f.abrirEnvelope }}<UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                </button>
                <p v-else class="text-sm text-muted">{{ f.semEnvelope }}</p>
              </section>

              <section v-if="env" class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ f.signatarios }}</p>
                <ul class="space-y-1.5">
                  <li v-for="pa in env.participantes" :key="pa.id" class="flex items-center justify-between gap-2 text-sm">
                    <span class="min-w-0 truncate text-toned">{{ pa.ordem }}. {{ pa.nome }} <span class="text-muted">· {{ t.papeis[pa.papel] }}</span></span>
                    <span class="shrink-0 text-xs text-muted">{{ t.statusParticipante[pa.status] }}</span>
                  </li>
                </ul>
              </section>

              <section class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ f.configuracao }}</p>
                <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <template v-for="c in configuracao" :key="c.k">
                    <dt class="text-muted">{{ c.k }}</dt>
                    <dd class="min-w-0 truncate text-toned">{{ c.v }}</dd>
                  </template>
                </dl>
              </section>

              <UAccordion :items="tecnicos" :ui="{ trigger: 'text-xs font-semibold uppercase tracking-wider text-muted' }">
                <template #json>
                  <pre class="max-h-60 overflow-auto rounded-md bg-elevated p-3 font-mono text-xs text-toned">{{ json }}</pre>
                </template>
              </UAccordion>
            </div>
          </template>
          <div v-else class="space-y-1 px-4 py-3">
            <h2 class="font-semibold text-highlighted">{{ nos.find(n => n.id === selecionado)!.nome }}</h2>
            <p class="text-sm text-muted">{{ selecionado === 'inicio' ? f.inicioDesc : f.fimDesc }}</p>
            <UBadge :label="selecionado === 'inicio' || sucesso ? f.ok : f.naoExecutado" :color="selecionado === 'inicio' || sucesso ? 'success' : 'neutral'" variant="soft" size="sm" />
          </div>
        </aside>
      </div>
    </template>
  </div>
</template>
