<script setup lang="ts">
/**
 * Agenda. Cópia do develop: mês, cabeçalho (Hoje, setas, mês, Visualização,
 * Data, Dia Útil, Dia Não Útil) e o modal "Evento" com os participantes.
 * A grade é montada à mão: o Nuxt UI não tem calendário de eventos e o SDK
 * também não. É a tela de hoje, não componente novo.
 *
 * PROPOSTA: no modal, "Enviar lembrete" (e-mail para todos e WhatsApp ou SMS
 * para cada participante com telefone).
 */
import type { Textos } from './textos'
import { type EventoDaAgenda, HOJE, eventos, itemPorId } from './mocks'
import { useComunicacao, useMarcaDeProposta } from './estado'
import { useAtalhos } from './atalhos'
import AcoesDeContato from './_AcoesDeContato.vue'

const props = defineProps<{ t: Textos }>()

const { abrirItem } = useComunicacao()
const { canaisEm, abrir, config } = useAtalhos()
const marca = useMarcaDeProposta()
const idioma = useIdioma()

/** Outubro de 2026 começa numa quinta. A grade vai de 27/09 a 31/10. */
const dias = computed(() => {
  const inicio = new Date(2026, 8, 27)
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    return d
  })
})

const mesmoDia = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const doDia = (d: Date) => eventos.filter(e => mesmoDia(e.inicio, d)).sort((a, b) => +a.inicio - +b.inicio)

const hora = computed(() => new Intl.DateTimeFormat(idioma.value, { hour: 'numeric', minute: '2-digit' }))
const dataLonga = computed(() => new Intl.DateTimeFormat(idioma.value, { weekday: 'short', day: '2-digit', month: 'short' }))
/** "outubro 2026", como o develop escreve (sem o "de"). */
const nomeDoMes = computed(() => `${new Intl.DateTimeFormat(idioma.value, { month: 'long' }).format(HOJE)} ${HOJE.getFullYear()}`)
const diasDaSemana = computed(() => Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(idioma.value, { weekday: 'short' }).format(new Date(2026, 9, 4 + i)).toUpperCase()))

/* ---------- evento ---------- */

const aberto = ref<EventoDaAgenda | null>(null)
const modal = computed({ get: () => !!aberto.value, set: (v) => { if (!v) aberto.value = null } })
const itemDoEvento = computed(() => itemPorId(aberto.value?.itemId))

const canais = computed(() => canaisEm('agenda'))
const comEmail = computed(() => aberto.value?.participantes.filter(p => p.email) ?? [])
const algumTelefone = computed(() => aberto.value?.participantes.some(p => p.telefone) ?? false)

function textosDoLembrete(e: EventoDaAgenda, nome?: string) {
  if (!config.value.textoInicial) return { assunto: undefined, mensagem: undefined }
  const quando = `${dataLonga.value.format(e.inicio)}, ${hora.value.format(e.inicio)}`
  return {
    assunto: props.t.agenda.assuntoDoLembrete(e.titulo, quando),
    mensagem: props.t.agenda.mensagemDoLembrete(nome?.split(' ')[0] ?? '', e.titulo, quando),
  }
}

function emailParaTodos() {
  const e = aberto.value
  if (!e) return
  abrir('email', null, { varios: comEmail.value.map(p => ({ nome: p.nome ?? null, email: p.email ?? null, telefone: null })), item: itemDoEvento.value, ...textosDoLembrete(e) })
}

function iniciais(p: { nome?: string, email?: string }) {
  const base = p.nome ?? p.email ?? '?'
  return base.split(/[\s.@]/).filter(Boolean).slice(0, 2).map(x => x[0]!.toUpperCase()).join('')
}
</script>

<template>
  <div class="p-4">
    <div class="rounded-lg border border-default">
      <!-- Cabeçalho (cópia) -->
      <div class="flex flex-wrap items-center gap-3 border-b border-default p-3">
        <UButton :label="t.agenda.hoje" color="neutral" variant="outline" />
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" :aria-label="t.agenda.anterior" />
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" :aria-label="t.agenda.proximo" />
        <h1 class="text-xl font-semibold text-highlighted">
          {{ nomeDoMes }}
        </h1>
        <div class="ml-auto flex flex-wrap items-center gap-2">
          <UFormField :label="t.agenda.visualizacao" size="xs">
            <USelect :model-value="'mes'" :items="[{ value: 'mes', label: t.agenda.mes }]" size="sm" class="w-24" />
          </UFormField>
          <UFormField :label="t.agenda.data" size="xs">
            <UInput model-value="05/10/2026" size="sm" class="w-36" trailing-icon="i-lucide-chevron-down" />
          </UFormField>
          <UBadge :label="t.agenda.diaUtil" color="success" variant="soft" />
          <UBadge :label="t.agenda.diaNaoUtil" color="error" variant="soft" />
          <UButton icon="i-lucide-settings" color="primary" variant="ghost" size="sm" :aria-label="t.itens.configurar" />
        </div>
      </div>

      <!-- Grade do mês (cópia) -->
      <div class="grid grid-cols-7 text-center text-xs font-semibold text-toned">
        <div v-for="d in diasDaSemana" :key="d" class="border-b border-r border-default py-2 last:border-r-0">
          {{ d }}
        </div>
      </div>
      <div class="grid grid-cols-7">
        <div
          v-for="(d, i) in dias"
          :key="i"
          class="min-h-28 border-b border-r border-default p-1.5 [&:nth-child(7n)]:border-r-0"
          :class="[d.getDay() === 0 || d.getDay() === 6 ? 'bg-error/5' : '', d.getMonth() !== 9 ? 'text-dimmed' : 'text-toned']"
        >
          <p class="mb-1 text-center text-sm">
            <span
              class="inline-flex size-6 items-center justify-center rounded-full"
              :class="mesmoDia(d, HOJE) ? 'bg-primary font-semibold text-white' : ''"
            >{{ d.getDate() }}</span>
          </p>
          <button
            v-for="e in doDia(d).slice(0, 3)"
            :key="e.id"
            type="button"
            class="mb-1 block w-full truncate rounded px-1.5 py-0.5 text-left text-xs transition hover:-translate-y-px hover:shadow-sm"
            :class="e.inicio < HOJE ? 'bg-warning/15 text-highlighted' : 'border-l-2 border-primary bg-primary/10 text-highlighted'"
            @click="aberto = e"
          >
            {{ hora.format(e.inicio) }} {{ e.titulo }}
          </button>
          <p v-if="doDia(d).length > 3" class="text-center text-xs text-muted">
            {{ t.agenda.mais(doDia(d).length - 3) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal do evento -->
    <UModal v-model:open="modal" :title="t.agenda.evento" :ui="{ content: 'max-w-xl' }">
      <template #body>
        <div v-if="aberto" class="flex flex-col gap-4">
          <!-- Cópia do develop -->
          <div class="grid grid-cols-2 gap-4 rounded-lg border border-default p-4 text-sm">
            <div>
              <p class="font-medium text-highlighted">
                {{ aberto.titulo }}
              </p>
              <p class="text-muted">
                {{ dataLonga.format(aberto.inicio) }} · {{ t.agenda.intervalo(hora.format(aberto.inicio), hora.format(aberto.fim)) }}
              </p>
            </div>
            <div>
              <p class="font-medium text-highlighted">
                {{ aberto.local ?? '-' }}
              </p>
              <p class="text-muted">
                {{ t.agenda.fonte[aberto.fonte] }}
              </p>
            </div>
            <UButton
              v-if="itemDoEvento"
              :label="`${itemDoEvento.reference} · ${itemDoEvento.titulo}`"
              icon="i-lucide-file"
              color="neutral"
              variant="link"
              size="sm"
              class="col-span-2 justify-start p-0"
              @click="abrirItem(itemDoEvento.id); aberto = null"
            />
          </div>

          <div class="rounded-lg border border-default p-4">
            <h3 class="mb-2 text-lg font-semibold text-highlighted">
              {{ t.agenda.participantes }}
            </h3>
            <ul class="flex flex-col gap-2">
              <li v-for="(p, i) in aberto.participantes" :key="i" class="flex items-center gap-3">
                <UAvatar :text="iniciais(p)" size="xs" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm text-highlighted">{{ p.nome ?? p.email }}</span>
                  <span v-if="p.nome" class="block truncate text-xs text-muted">{{ [p.email, p.telefone].filter(Boolean).join(' · ') }}</span>
                </span>
                <!-- PROPOSTA: atalho por participante -->
                <AcoesDeContato
                  v-if="canais.length"
                  :t="t"
                  :destino="{ nome: p.nome ?? null, email: p.email ?? null, telefone: p.telefone ?? null }"
                  :item="itemDoEvento"
                  lugar="agenda"
                  variante="icones"
                  tamanho="xs"
                  :permitir-enspace="!!itemDoEvento"
                  :class="marca"
                  v-bind="textosDoLembrete(aberto, p.nome)"
                />
              </li>
            </ul>
          </div>

          <!-- PROPOSTA: lembrete para todos -->
          <section v-if="canais.length" class="rounded-lg border border-dashed border-default p-4" :class="marca">
            <h3 class="text-xs font-semibold uppercase tracking-wide text-muted">
              {{ t.agenda.enviarLembrete }}
            </h3>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <UButton
                v-if="canais.includes('email')"
                icon="i-lucide-mail"
                :label="t.agenda.emailParaTodos(comEmail.length)"
                color="neutral"
                variant="outline"
                size="sm"
                :disabled="!comEmail.length"
                @click="emailParaTodos"
              />
            </div>
            <p class="mt-2 text-xs text-muted">
              {{ algumTelefone ? t.agenda.ajudaComTelefone : t.agenda.ajudaSemTelefone }}
            </p>
          </section>
        </div>
      </template>
    </UModal>
  </div>
</template>
