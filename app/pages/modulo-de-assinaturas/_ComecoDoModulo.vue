<script setup lang="ts">
/**
 * PROPOSTA (M16): o começo do módulo de assinaturas, quando ainda não há envelope.
 *
 * - vazio: nem provedor nem envelope. Não ter provedor não impede de usar o módulo: dá para criar o 1º envelope agora,
 *   que fica como rascunho, e conectar o provedor depois. Por isso "Criar o primeiro envelope" é a ação principal, e
 *   cada provedor aceito é um atalho para a página dele;
 * - semEnvelope: 1 provedor conectado e nenhum envelope. O passo 1 aparece concluído, com o provedor.
 *
 * Nos 2 casos: o que o módulo faz, uma prévia de como o envelope fica, os 3 passos e as outras formas de criar envelope
 * (Spaceflow e fluxo da categoria), com o atalho de cada uma.
 * Hoje a tela vazia tem 1 texto e 1 botão, e sem provedor não leva a lugar nenhum.
 */
import type { ProvedorId } from './mocks'
import { provedores, provedorPorId } from './mocks'
import { credenciaisVisiveis } from './estado'
import type { Textos } from './textos'
import Logo from './_Logo.vue'
import CardDeApp from './_CardDeApp.vue'

const props = defineProps<{ t: Textos, variante: 'vazio' | 'semEnvelope' }>()
const emit = defineEmits<{ novo: [], conectar: [], provedor: [ProvedorId], irFluxo: [], irTarefa: [] }>()
const c = computed(() => props.t.lista.comeco)
const vazio = computed(() => props.variante === 'vazio')

const conectado = computed(() => {
  const cred = credenciaisVisiveis.value[0]
  return cred ? provedorPorId.get(cred.provedor)! : null
})

const passos = computed(() => c.value.passos.map((p, i) => {
  if (i === 0) return { ...p, icone: 'i-lucide-plug', estado: vazio.value ? 'depois' : 'feito', selo: vazio.value ? c.value.passoDepois : c.value.passoFeito(conectado.value?.nome ?? '') }
  if (i === 1) return { ...p, texto: vazio.value ? p.texto : c.value.passo2ComProvedor, icone: 'i-lucide-file-plus-2', estado: 'proximo', selo: c.value.passoProximo }
  return { ...p, icone: 'i-lucide-list-checks', estado: 'futuro', selo: '' }
}))

const previa = computed(() => [
  { nome: 'Ana Ribeiro', ordem: 1, status: c.value.previa.assinou, cor: 'success' as const, variante: 'soft' as const },
  { nome: 'Bruno Lima', ordem: 2, status: c.value.previa.naVez, cor: 'info' as const, variante: 'soft' as const },
  { nome: 'Carla Dias', ordem: 3, status: c.value.previa.naFila, cor: 'neutral' as const, variante: 'outline' as const },
])
const iniciais = (nome: string) => nome.split(' ').map(x => x[0]).join('')
</script>

<template>
  <div class="space-y-10">
    <!-- O que o módulo faz, com a prévia do envelope -->
    <section class="relative animate-[entrada_.35s_ease-out_both] overflow-hidden rounded-2xl border border-default bg-linear-to-br from-primary/10 via-default to-default">
      <div class="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-info/10 blur-3xl" aria-hidden="true" />

      <div class="relative grid items-center gap-10 p-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:p-10">
        <div class="space-y-5">
          <UBadge :label="c.eyebrow" icon="i-lucide-signature" color="primary" variant="subtle" class="rounded-full" />
          <h2 class="max-w-2xl text-2xl font-semibold text-balance text-highlighted lg:text-3xl">
            {{ vazio ? c.vazio.titulo : c.semEnvelope.titulo }}
          </h2>
          <p class="max-w-xl text-base text-pretty text-toned">
            {{ vazio ? c.vazio.texto : c.semEnvelope.texto(conectado?.nome ?? '') }}
          </p>
          <div class="flex flex-wrap items-center gap-3 pt-1">
            <UButton :label="vazio ? c.vazio.criar : c.semEnvelope.criar" icon="i-lucide-plus" size="lg" class="transition-transform hover:-translate-y-0.5" @click="emit('novo')" />
            <UButton v-if="vazio" :label="c.vazio.conectar" icon="i-lucide-plug" color="neutral" variant="outline" size="lg" @click="emit('conectar')" />
            <button
              v-else-if="conectado"
              type="button"
              class="group flex items-center gap-2 rounded-lg border border-default bg-default/70 py-1.5 pl-1.5 pr-3 text-sm transition-colors hover:border-accented focus-visible:outline-2 focus-visible:outline-primary"
              @click="emit('provedor', conectado.id)"
            >
              <Logo :app="conectado.id" :nome="conectado.nome" tamanho="sm" class="px-1.5" />
              <span class="flex items-center gap-1 text-xs font-medium text-success"><span class="size-1.5 rounded-full bg-success" />{{ t.apps.estados.conectado }}</span>
              <UIcon name="i-lucide-arrow-right" class="size-3.5 text-muted transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <p v-if="vazio" class="flex max-w-xl items-start gap-2 text-sm text-muted">
            <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0" />{{ c.vazio.nota }}
          </p>
        </div>

        <!-- Prévia ilustrativa: como o envelope aparece depois de enviado -->
        <div class="relative mx-auto w-full max-w-sm" aria-hidden="true">
          <div class="absolute inset-x-6 -top-3 h-full rotate-3 rounded-xl border border-default bg-elevated/60" />
          <div class="relative animate-[entrada_.45s_ease-out_both] space-y-4 rounded-xl border border-default bg-default p-5 shadow-xl [animation-delay:120ms]">
            <div class="flex items-center gap-3">
              <span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><UIcon name="i-lucide-file-text" class="size-4.5" /></span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-semibold text-highlighted">{{ c.previa.titulo }}</span>
                <span class="block h-1.5 w-20 rounded-full bg-elevated" />
              </span>
              <UBadge :label="c.previa.status" color="info" variant="soft" size="sm" />
            </div>
            <div class="space-y-1.5 rounded-lg bg-elevated/50 p-3">
              <span class="block h-1.5 w-full rounded-full bg-accented/70" />
              <span class="block h-1.5 w-11/12 rounded-full bg-accented/70" />
              <span class="block h-1.5 w-4/5 rounded-full bg-accented/70" />
              <span class="mt-3 flex items-end gap-2 border-b border-dashed border-accented pb-1">
                <UIcon name="i-lucide-signature" class="size-6 text-primary" />
              </span>
            </div>
            <ul class="space-y-2.5">
              <li v-for="(pa, i) in previa" :key="pa.nome" class="flex animate-[entrada_.35s_ease-out_both] items-center gap-2.5" :style="{ animationDelay: `${220 + i * 80}ms` }">
                <UAvatar :text="iniciais(pa.nome)" size="xs" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-medium text-highlighted">{{ pa.nome }}</span>
                  <span class="block text-[11px] text-muted">{{ c.previa.ordem(pa.ordem) }}</span>
                </span>
                <UBadge :label="pa.status" :color="pa.cor" :variant="pa.variante" size="sm" />
              </li>
            </ul>
            <UProgress :model-value="1" :max="3" size="xs" />
          </div>
        </div>
      </div>
    </section>

    <!-- Os 3 passos -->
    <section class="space-y-4" aria-labelledby="titulo-passos">
      <h3 id="titulo-passos" class="font-semibold text-highlighted">{{ c.passosTitulo }}</h3>
      <ol class="grid gap-4 md:grid-cols-3">
        <li
          v-for="(p, i) in passos"
          :key="p.titulo"
          class="relative flex animate-[entrada_.3s_ease-out_both] flex-col gap-3 rounded-xl border bg-default p-5"
          :class="p.estado === 'proximo' ? 'border-primary/40 ring-1 ring-primary/20' : 'border-default'"
          :style="{ animationDelay: `${80 + i * 60}ms` }"
        >
          <span class="flex items-center justify-between gap-2">
            <span
              class="flex size-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
              :class="{ 'bg-success/15 text-success': p.estado === 'feito', 'bg-primary text-inverted': p.estado === 'proximo', 'bg-elevated text-muted': p.estado === 'depois' || p.estado === 'futuro' }"
            >
              <UIcon v-if="p.estado === 'feito'" name="i-lucide-check" class="size-4" />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <UBadge
              v-if="p.selo"
              :label="p.selo"
              size="sm"
              :color="p.estado === 'feito' ? 'success' : p.estado === 'proximo' ? 'primary' : 'neutral'"
              :variant="p.estado === 'depois' ? 'outline' : 'soft'"
            />
          </span>
          <span class="flex items-center gap-2">
            <UIcon :name="p.icone" class="size-4 text-muted" />
            <span class="font-medium text-highlighted">{{ p.titulo }}</span>
          </span>
          <p class="text-sm text-muted">{{ p.texto }}</p>
          <UIcon v-if="i < passos.length - 1" name="i-lucide-chevron-right" class="absolute -right-3.5 top-1/2 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-default text-dimmed md:block" aria-hidden="true" />
        </li>
      </ol>
    </section>

    <!-- Sem provedor: cada provedor aceito é um atalho para a página dele -->
    <section v-if="vazio" class="space-y-4" aria-labelledby="titulo-provedores">
      <div>
        <h3 id="titulo-provedores" class="font-semibold text-highlighted">{{ c.provedoresTitulo }}</h3>
        <p class="text-sm text-muted">{{ c.provedoresTexto }}</p>
      </div>
      <!-- O mesmo card da loja de apps -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CardDeApp
          v-for="(p, i) in provedores"
          :key="p.id"
          :nome="p.nome"
          :descricao="t.apps.descricoes[p.id]!"
          :estado="{ texto: t.apps.limiteCurto(p.limiteMb, p.formatos.join(', ')), tom: 'info' }"
          :rotulo="c.conectar"
          :logo="p.id"
          class="animate-[entrada_.3s_ease-out_both]"
          :style="{ animationDelay: `${120 + i * 40}ms` }"
          @abrir="emit('provedor', p.id)"
        />
      </div>
    </section>

    <!-- As outras portas do módulo -->
    <section class="space-y-4" aria-labelledby="titulo-outras">
      <h3 id="titulo-outras" class="font-semibold text-highlighted">{{ c.outrasTitulo }}</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="(o, i) in [{ ...c.outras.fluxo, icone: 'i-lucide-workflow', ir: () => emit('irFluxo') }, { ...c.outras.categoria, icone: 'i-lucide-layout-grid', ir: () => emit('irTarefa') }]"
          :key="o.titulo"
          class="flex animate-[entrada_.3s_ease-out_both] items-start gap-4 rounded-xl border border-default bg-default p-5"
          :style="{ animationDelay: `${160 + i * 60}ms` }"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated ring-1 ring-default ring-inset"><UIcon :name="o.icone" class="size-5 text-highlighted" /></span>
          <span class="min-w-0 flex-1 space-y-1">
            <span class="block font-medium text-highlighted">{{ o.titulo }}</span>
            <span class="block text-sm text-muted">{{ o.texto }}</span>
            <UButton :label="o.botao" trailing-icon="i-lucide-arrow-right" color="neutral" variant="outline" size="sm" class="mt-2" @click="o.ir" />
          </span>
        </div>
      </div>
    </section>
  </div>
</template>
