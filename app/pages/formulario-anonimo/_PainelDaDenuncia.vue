<script setup lang="ts">
/**
 * O painel do item, como o develop abre por "Ver Detalhes" (ev-08): trilho de
 * ícones à esquerda e as pastas em abas no topo (Visão Geral, Comentários, Logs
 * de Auditoria, Tarefas, Anexos e "+4" com Emails Automáticos e as outras).
 *
 * PROPOSTA (contorno do andaime):
 *  - no topo da Visão Geral, o cartão da denúncia anônima: criador anonymous,
 *    hora cheia, protocolo e se a pessoa pediu aviso por e-mail (sem o endereço);
 *  - a pasta "Canal do denunciante", logo depois de Visão Geral: a conversa
 *    com quem denunciou, sem e-mail;
 *  - Logs de Auditoria: "anonymous criou um registro", com a hora cheia;
 *  - Emails Automáticos: o aviso aparece com "Destinatário protegido".
 * Comentários, Tarefas e Anexos ficam como hoje (fora do protótipo).
 */
import type { Textos } from './textos'
import { ANONYMOUS, HOJE, type Situacao, categoria, comite } from './mocks'
import { type AbaDoItem, useFormularioAnonimo, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { denuncias, mensagens, auditoria, emails, itemAberto, abaDoItem, responder } = useFormularioAnonimo()
const marca = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const aberto = computed({
  get: () => itemAberto.value !== null,
  set: (v) => { if (!v) itemAberto.value = null },
})
const denuncia = computed(() => denuncias.value.find(d => d.id === itemAberto.value) ?? null)

/* ---------- datas ---------- */

const formatoDia = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' }))
const formatoHora = computed(() => new Intl.DateTimeFormat(idioma.value, { hour: 'numeric' }))
const formatoMensagem = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
const formatoCompleto = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }))

/** "15/10/2026, 14h": a hora cheia, que é tudo o que o item anônimo guarda. */
function diaEHoraCheia(d: Date) {
  const h = formatoHora.value.format(d)
  return `${formatoDia.value.format(d)}, ${idioma.value === 'en' ? h : `${h}h`}`
}
function haDias(d: Date) {
  return props.t.item.auditoria.haDias(Math.max(0, Math.floor((+HOJE - +d) / 86400000)))
}

/* ---------- abas ---------- */

const abasVisiveis = computed(() => [
  { chave: 'visao' as AbaDoItem, icone: 'i-lucide-layers', proposta: false },
  { chave: 'canal' as AbaDoItem, icone: 'i-lucide-messages-square', proposta: true },
  { chave: 'comentarios' as AbaDoItem, icone: 'i-lucide-message-circle', proposta: false },
  { chave: 'auditoria' as AbaDoItem, icone: 'i-lucide-shield-check', proposta: false },
  { chave: 'tarefas' as AbaDoItem, icone: 'i-lucide-clipboard-check', proposta: false },
  { chave: 'anexos' as AbaDoItem, icone: 'i-lucide-paperclip', proposta: false },
])
const maisAbas = computed(() => [[
  { label: props.t.item.abas.emails, icon: 'i-lucide-mail', onSelect: () => (abaDoItem.value = 'emails') },
  { label: 'Mail Box', icon: 'i-lucide-mailbox', onSelect: () => (abaDoItem.value = 'comentarios') },
  { label: 'Notes', icon: 'i-lucide-notebook-pen', onSelect: () => (abaDoItem.value = 'comentarios') },
  { label: 'Campos', icon: 'i-lucide-list', onSelect: () => (abaDoItem.value = 'comentarios') },
]])

/* ---------- visão geral ---------- */

const situacoes = computed(() => (['nova', 'em_analise', 'aguardando', 'concluida', 'arquivada'] as Situacao[]).map(v => ({ value: v, label: props.t.situacoes[v] })))
const responsaveis = computed(() => [{ value: 0, label: props.t.item.semResponsavel }, ...comite.map(c => ({ value: c.membro.id, label: c.nome }))])

const situacao = ref<Situacao>('nova')
const responsavel = ref(0)
watch(denuncia, (d) => {
  if (!d) return
  situacao.value = d.data.situacao
  responsavel.value = d.data.responsavel ?? 0
}, { immediate: true })

const salvando = ref(false)
async function salvar() {
  const d = denuncia.value
  if (!d) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  d.data.situacao = situacao.value
  d.data.responsavel = responsavel.value || null
  auditoria.value = [{ id: `u${Date.now()}`, itemId: d.id, quem: comite[0]!.membro.id, acao: 'atualizou', quando: new Date(), campos: [{ campo: 'data.situacao', de: '', para: situacao.value }] }, ...auditoria.value]
  salvando.value = false
  toast.add({ title: props.t.item.salvo, icon: 'i-lucide-circle-check', color: 'success' })
}

/* ---------- canal do denunciante ---------- */

const conversa = computed(() => mensagens.value.filter(m => m.itemId === itemAberto.value).sort((a, b) => +a.quando - +b.quando))
watch([itemAberto, abaDoItem], () => {
  if (abaDoItem.value === 'canal' && denuncia.value) denuncia.value.mensagensNovas = 0
})

const resposta = ref('')
const enviando = ref(false)
async function enviarResposta() {
  const d = denuncia.value
  if (!d || !resposta.value.trim()) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 700))
  responder(d.id, 'comite', resposta.value.trim(), comite[0]!.membro.id)
  resposta.value = ''
  enviando.value = false
  toast.add({ title: props.t.item.canal.enviada, icon: 'i-lucide-circle-check', color: 'success' })
}

function nomeDoMembro(id?: number) {
  return comite.find(c => c.membro.id === id)?.nome ?? props.t.item.canal.autor.comite
}

/* ---------- auditoria e e-mails ---------- */

const registros = computed(() => auditoria.value.filter(a => a.itemId === itemAberto.value).sort((a, b) => +b.quando - +a.quando))
function quemNoLog(id: number) {
  return id === ANONYMOUS.id ? { nome: ANONYMOUS.nome, iniciais: '', anonimo: true } : { nome: nomeDoMembro(id), iniciais: comite.find(c => c.membro.id === id)?.iniciais ?? '', anonimo: false }
}
const emailsDoItem = computed(() => emails.value.filter(e => e.itemId === itemAberto.value))
</script>

<template>
  <USlideover v-model:open="aberto" side="right" :close="false" :ui="{ content: 'max-w-4xl', body: 'p-0 sm:p-0' }">
    <template #content>
      <div v-if="denuncia" class="flex h-full">
        <!-- Trilho de ícones (cópia) -->
        <div class="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-default py-3">
          <span class="flex size-8 items-center justify-center rounded-full border border-default"><UIcon name="i-lucide-file" class="size-4 text-primary" /></span>
          <UIcon name="i-lucide-hash" class="size-4 text-toned" />
          <UIcon name="i-lucide-activity" class="size-4 text-toned" />
          <UIcon name="i-lucide-calendar-plus" class="size-4 text-toned" />
          <UButton icon="i-lucide-chevrons-right" color="neutral" variant="outline" size="xs" class="mt-auto rounded-full" :aria-label="t.item.fechar" @click="aberto = false" />
        </div>

        <div class="flex min-w-0 flex-1 flex-col">
          <!-- Abas (cópia + Canal do denunciante) -->
          <div class="flex items-center gap-1 overflow-x-auto border-b border-default px-2 py-1.5">
            <UButton
              v-for="a in abasVisiveis"
              :key="a.chave"
              :icon="a.icone"
              :label="t.item.abas[a.chave]"
              size="xs"
              :color="abaDoItem === a.chave ? 'primary' : 'neutral'"
              :variant="abaDoItem === a.chave ? 'soft' : 'ghost'"
              class="shrink-0"
              :class="a.proposta ? marca : ''"
              @click="abaDoItem = a.chave"
            >
              <template v-if="a.chave === 'canal' && denuncia.mensagensNovas" #trailing>
                <UBadge :label="String(denuncia.mensagensNovas)" color="primary" size="xs" />
              </template>
            </UButton>
            <UDropdownMenu :items="maisAbas" :content="{ align: 'end' }">
              <UButton :label="t.item.mais(4)" trailing-icon="i-lucide-chevron-down" size="xs" :color="abaDoItem === 'emails' ? 'primary' : 'neutral'" :variant="abaDoItem === 'emails' ? 'soft' : 'ghost'" class="ml-auto shrink-0" />
            </UDropdownMenu>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0"
            >
              <!-- Visão Geral -->
              <div v-if="abaDoItem === 'visao'" key="visao" class="flex flex-col gap-5 p-5">
                <!-- PROPOSTA: o cartão da denúncia anônima -->
                <section class="rounded-lg border border-info/30 bg-info/5 p-4" :class="marca">
                  <div class="flex flex-wrap items-center gap-2">
                    <UBadge :label="t.item.anonima" icon="i-lucide-venetian-mask" color="info" variant="subtle" />
                    <span class="font-mono text-sm font-semibold text-highlighted">{{ denuncia.data.protocolo }}</span>
                  </div>
                  <dl class="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt class="text-xs text-muted">{{ t.item.criadoPor }}</dt>
                      <dd class="mt-0.5 flex items-center gap-1.5 text-highlighted">
                        <UAvatar icon="i-lucide-venetian-mask" size="2xs" :ui="{ root: 'bg-info/15', icon: 'text-info' }" />
                        <span class="font-mono">{{ ANONYMOUS.nome }}</span>
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-muted">{{ t.item.recebidaEm }}</dt>
                      <dd class="mt-0.5 flex items-center gap-1 text-highlighted">
                        {{ diaEHoraCheia(denuncia.created_at) }}
                        <UTooltip :text="t.item.horaCheiaAjuda"><UIcon name="i-lucide-clock-alert" class="size-3.5 text-muted" /></UTooltip>
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-muted">{{ t.item.responderAte }}</dt>
                      <dd class="mt-0.5 text-highlighted">{{ formatoDia.format(new Date(`${denuncia.data.retorno_ate}T12:00:00`)) }}</dd>
                    </div>
                  </dl>
                  <p class="mt-3 flex items-start gap-1.5 text-xs text-toned">
                    <UIcon :name="denuncia.data.aviso_por_email ? 'i-lucide-mail-check' : 'i-lucide-mail-x'" class="mt-0.5 size-3.5 shrink-0 text-muted" />
                    {{ denuncia.data.aviso_por_email ? t.item.avisoLigado : t.item.avisoDesligado }}
                  </p>
                </section>

                <!-- Campos do comitê -->
                <div class="grid gap-4 sm:grid-cols-2">
                  <UFormField :label="t.item.situacao">
                    <USelect v-model="situacao" :items="situacoes" class="w-full" />
                  </UFormField>
                  <UFormField :label="t.item.responsavel">
                    <USelect v-model="responsavel" :items="responsaveis" class="w-full" />
                  </UFormField>
                </div>

                <!-- O relato, só leitura -->
                <section>
                  <h3 class="text-sm font-semibold text-highlighted">{{ t.item.camposDoRelato }}</h3>
                  <p class="mb-3 text-xs text-muted">{{ t.item.somenteLeitura }}</p>
                  <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                    <div><dt class="text-xs text-muted">Tipo de ocorrência</dt><dd class="text-highlighted">{{ denuncia.data.tipo }}</dd></div>
                    <div><dt class="text-xs text-muted">Onde aconteceu</dt><dd class="text-highlighted">{{ denuncia.data.area }}</dd></div>
                    <div><dt class="text-xs text-muted">Quando aconteceu</dt><dd class="text-highlighted">{{ denuncia.data.quando ? formatoDia.format(new Date(`${denuncia.data.quando}T12:00:00`)) : '-' }}</dd></div>
                    <div><dt class="text-xs text-muted">Pessoas envolvidas</dt><dd class="text-highlighted">{{ denuncia.data.envolvidos || '-' }}</dd></div>
                    <div><dt class="text-xs text-muted">Alguém mais viu?</dt><dd class="text-highlighted">{{ denuncia.data.testemunhas ?? '-' }}</dd></div>
                    <div>
                      <dt class="text-xs text-muted">Anexos</dt>
                      <dd v-if="denuncia.data.anexos.length" class="flex flex-col gap-1">
                        <span v-for="a in denuncia.data.anexos" :key="a" class="flex items-center gap-1.5 text-highlighted"><UIcon name="i-lucide-paperclip" class="size-3.5 text-muted" />{{ a }}</span>
                        <span class="text-xs text-muted">{{ t.item.anexosLimpos }}</span>
                      </dd>
                      <dd v-else class="text-highlighted">{{ t.item.nenhumAnexo }}</dd>
                    </div>
                    <div class="sm:col-span-2">
                      <dt class="text-xs text-muted">Relato</dt>
                      <dd class="mt-1 whitespace-pre-line rounded-md bg-elevated/60 p-3 text-highlighted">{{ denuncia.data.relato }}</dd>
                    </div>
                  </dl>
                </section>

                <div class="flex justify-end">
                  <UButton icon="i-lucide-save" :label="t.item.salvar" :loading="salvando" @click="salvar" />
                </div>
              </div>

              <!-- PROPOSTA: Canal do denunciante -->
              <div v-else-if="abaDoItem === 'canal'" key="canal" class="flex h-full flex-col p-5">
                <p class="flex items-start gap-1.5 text-xs text-muted">
                  <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
                  <span>{{ t.item.canal.ajuda }} {{ denuncia.data.aviso_por_email ? t.item.canal.comEmail : '' }}</span>
                </p>
                <TransitionGroup tag="ol" class="mt-4 flex flex-col gap-3" enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2">
                  <li v-for="m in conversa" :key="m.id" class="flex" :class="m.autor === 'comite' ? 'justify-end' : 'justify-start'">
                    <div
                      class="max-w-[85%] rounded-lg px-3 py-2"
                      :class="m.autor === 'comite' ? 'bg-primary/10' : m.autor === 'sistema' ? 'bg-elevated' : 'border border-default bg-default'"
                    >
                      <p class="flex items-center gap-1.5 text-xs font-medium text-toned">
                        <UIcon :name="m.autor === 'sistema' ? 'i-lucide-bot' : m.autor === 'comite' ? 'i-lucide-shield' : 'i-lucide-venetian-mask'" class="size-3.5" />
                        {{ m.autor === 'comite' ? nomeDoMembro(m.membro) : t.item.canal.autor[m.autor] }}
                        <span class="font-normal text-muted">· {{ m.autor === 'denunciante' ? diaEHoraCheia(m.quando) : formatoMensagem.format(m.quando) }}</span>
                      </p>
                      <p class="mt-1 whitespace-pre-line text-sm text-highlighted">{{ m.texto }}</p>
                    </div>
                  </li>
                </TransitionGroup>

                <form class="mt-5 flex flex-col gap-2" @submit.prevent="enviarResposta">
                  <UTextarea v-model="resposta" :placeholder="t.item.canal.escreva" :rows="3" autoresize class="w-full" />
                  <div class="flex items-center justify-between gap-3">
                    <p class="flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-triangle-alert" class="size-3.5 text-warning" />{{ t.item.canal.dica }}</p>
                    <UButton type="submit" icon="i-lucide-send" :label="t.item.canal.enviar" :loading="enviando" :disabled="!resposta.trim()" />
                  </div>
                </form>
              </div>

              <!-- Logs de Auditoria (cópia, com anonymous) -->
              <div v-else-if="abaDoItem === 'auditoria'" key="auditoria" class="flex flex-col gap-4 p-5">
                <div v-for="r in registros" :key="r.id" class="flex gap-3">
                  <span class="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full" :class="r.acao === 'criou' ? 'bg-success' : 'bg-warning'">
                    <UIcon :name="r.acao === 'criou' ? 'i-lucide-plus' : 'i-lucide-pencil'" class="size-2.5 text-white" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <UAvatar v-if="quemNoLog(r.quem).anonimo" icon="i-lucide-venetian-mask" size="2xs" :ui="{ root: 'bg-info/15', icon: 'text-info' }" />
                      <span v-else class="text-[10px] font-semibold text-muted">{{ quemNoLog(r.quem).iniciais }}</span>
                      <UBadge :label="r.acao === 'criou' ? t.item.auditoria.criouSelo : t.item.auditoria.atualizouSelo" :color="r.acao === 'criou' ? 'success' : 'warning'" variant="subtle" size="sm" />
                      <span class="ml-auto text-right text-xs text-muted">
                        {{ quemNoLog(r.quem).anonimo ? diaEHoraCheia(r.quando) : formatoCompleto.format(r.quando) }}
                        <span class="block text-[10px] text-dimmed">{{ haDias(r.quando) }}</span>
                      </span>
                    </div>
                    <p class="mt-1 text-sm font-medium text-highlighted" :class="quemNoLog(r.quem).anonimo ? marca : ''">
                      {{ (r.acao === 'criou' ? t.item.auditoria.criou : t.item.auditoria.atualizou)(quemNoLog(r.quem).nome, categoria.name) }}
                    </p>
                    <p v-if="quemNoLog(r.quem).anonimo" class="mt-0.5 flex items-center gap-1 text-xs text-muted"><UIcon name="i-lucide-clock-alert" class="size-3" />{{ t.item.horaCheiaAjuda }}</p>
                    <div v-if="r.campos?.length" class="mt-2 rounded-md border border-default p-2 text-xs">
                      <p class="mb-1 text-muted">{{ t.item.auditoria.camposModificados(r.campos.length) }}</p>
                      <p v-for="c in r.campos" :key="c.campo" class="flex gap-2 font-mono text-[11px] text-toned">
                        <span class="w-40 truncate">{{ c.campo }}</span><span class="text-dimmed">{{ c.de || '-' }}</span><UIcon name="i-lucide-arrow-right" class="size-3 text-dimmed" /><span class="text-highlighted">{{ c.para }}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Emails Automáticos (cópia, com o destinatário protegido) -->
              <div v-else-if="abaDoItem === 'emails'" key="emails" class="p-5">
                <div class="mb-3 flex items-center gap-2">
                  <span class="flex size-7 items-center justify-center rounded-md bg-primary/15"><UIcon name="i-lucide-mail" class="size-4 text-primary" /></span>
                  <span class="text-sm font-medium text-highlighted">{{ t.item.emails.titulo }}</span>
                </div>
                <div class="overflow-x-auto rounded-lg border border-default">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-elevated/60 text-xs text-muted">
                      <tr>
                        <th class="px-3 py-2 font-medium">{{ t.item.emails.col.criadoEm }}</th>
                        <th class="px-3 py-2 font-medium">{{ t.item.emails.col.status }}</th>
                        <th class="px-3 py-2 font-medium">{{ t.item.emails.col.email }}</th>
                        <th class="px-3 py-2 font-medium">{{ t.item.emails.col.copia }}</th>
                        <th class="px-3 py-2 font-medium">{{ t.item.emails.col.assunto }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="e in emailsDoItem" :key="e.id" class="border-t border-default">
                        <td class="px-3 py-2 text-toned">{{ formatoCompleto.format(e.criadoEm) }}</td>
                        <td class="px-3 py-2"><UBadge :label="t.item.emails.enviado" color="success" variant="subtle" size="sm" /></td>
                        <td class="px-3 py-2" :class="marca">
                          <UTooltip :text="t.item.emails.protegidoAjuda">
                            <span class="flex items-center gap-1.5 text-muted"><UIcon name="i-lucide-lock-keyhole" class="size-3.5" />{{ t.item.emails.protegido }}</span>
                          </UTooltip>
                        </td>
                        <td class="px-3 py-2 text-dimmed">-</td>
                        <td class="px-3 py-2 text-highlighted">{{ e.assunto }}</td>
                      </tr>
                      <tr v-if="!emailsDoItem.length">
                        <td colspan="5" class="px-3 py-10 text-center text-sm text-muted">
                          <UIcon name="i-lucide-inbox" class="mx-auto mb-2 block size-6 text-primary" />{{ t.item.emails.vazio }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Pastas fora do protótipo -->
              <div v-else :key="abaDoItem" class="p-5">
                <UEmpty icon="i-lucide-folder-x" :title="t.item.pastaFora" variant="naked" class="my-10" />
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
