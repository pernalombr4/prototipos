<script setup lang="ts">
/**
 * Pedido 10: Proteção de dados › Continuidade. Tela nova e só de leitura.
 *
 * O compromisso de RTO, redundância e backup segregado se formaliza em contrato
 * (adendo, DPA, política de DR), como fazem Twenty, monday e Atlassian. O que
 * nenhum produto pesquisado mostra, e esta tela mostra: o último backup
 * concluído, a região e a conta do backup, a cópia imutável e o último teste de
 * recuperação. Os números são ilustrativos: o real sai do contrato.
 */
import type { Textos } from './textos'
import { continuidade as c } from './mocks'
import Cabecalho from './_Cabecalho.vue'
import { data, relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const tc = computed(() => props.t.continuidade)
const niveis = ['backup', 'espera', 'ativo'] as const
const baixando = ref<string | null>(null)
function baixar(o: string) {
  baixando.value = o
  setTimeout(() => {
    baixando.value = null
    toast.add({ title: tc.value.adendoBaixado, icon: 'i-lucide-file-check-2', color: 'success' })
  }, 900)
}
</script>

<template>
  <div>
    <Cabecalho :titulo="tc.titulo" :intro="tc.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <UButton :label="tc.adendo" icon="i-lucide-file-down" size="sm" :loading="baixando === 'adendo'" @click="baixar('adendo')" />
      </template>
    </Cabecalho>

    <div class="space-y-4 p-6">
      <UAlert v-if="marcarNovo" icon="i-lucide-flask-conical" color="warning" variant="outline" :description="t.andaime.ilustrativo" />

      <!-- Compromisso -->
      <section class="grid gap-4 lg:grid-cols-[1fr_1fr_2fr]">
        <div class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default bg-default p-4">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ tc.rto }}</p>
          <p class="mt-1 text-3xl font-semibold text-highlighted">{{ c.rtoHoras }}<span class="text-base font-normal text-muted">h</span></p>
          <p class="mt-1 text-xs text-muted">{{ tc.rtoAjuda }}</p>
        </div>
        <div class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default bg-default p-4 [animation-delay:60ms]">
          <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ tc.rpo }}</p>
          <p class="mt-1 text-3xl font-semibold text-highlighted">{{ c.rpoHoras }}<span class="text-base font-normal text-muted">h</span></p>
          <p class="mt-1 text-xs text-muted">{{ tc.rpoAjuda }}</p>
        </div>
        <div class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default bg-default p-4 [animation-delay:120ms]">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ tc.nivel }}</p>
          <ol class="space-y-1.5">
            <li v-for="n in niveis" :key="n" class="flex items-start gap-2 rounded-md p-2" :class="c.nivel === n ? 'bg-primary/10 ring-1 ring-primary/40' : ''">
              <UIcon :name="c.nivel === n ? 'i-lucide-circle-check' : 'i-lucide-circle'" class="mt-0.5 size-4 shrink-0" :class="c.nivel === n ? 'text-primary' : 'text-dimmed'" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium" :class="c.nivel === n ? 'text-highlighted' : 'text-toned'">{{ tc.niveis[n].nome }}</p>
                <p class="text-xs text-muted">{{ tc.niveis[n].ajuda }}</p>
              </div>
              <UBadge v-if="c.nivel === n" :label="tc.contratado" size="sm" />
            </li>
          </ol>
          <p class="mt-2 text-xs text-muted">{{ tc.mudarNivel }}</p>
        </div>
      </section>

      <div class="grid gap-4 lg:grid-cols-3">
        <!-- Onde -->
        <section class="rounded-lg border border-default bg-default p-4">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-map-pin" class="size-4 text-primary" />{{ tc.onde }}</h3>
          <dl class="space-y-3 text-sm">
            <div><dt class="text-xs text-muted">{{ tc.producao }}</dt><dd class="text-highlighted">{{ c.regiaoProducao }}</dd></div>
            <div><dt class="text-xs text-muted">{{ tc.backup }}</dt><dd class="text-highlighted">{{ c.regiaoBackup }}</dd></div>
            <div>
              <dt class="text-xs text-muted">{{ tc.conta }}</dt>
              <dd class="flex items-center gap-1.5 text-highlighted"><UIcon name="i-lucide-split" class="size-4 text-success" />{{ tc.contas[c.contaDoBackup] }}</dd>
              <dd class="text-xs text-muted">{{ tc.contaAjuda }}</dd>
            </div>
            <div>
              <dt class="text-xs text-muted">{{ tc.imutavel }}</dt>
              <dd class="flex items-center gap-1.5 text-highlighted"><UIcon name="i-lucide-lock" class="size-4 text-success" />{{ tc.imutavelValor(c.retencaoImutavelDias) }}</dd>
              <dd class="text-xs text-muted">{{ tc.imutavelAjuda }}</dd>
            </div>
          </dl>
        </section>

        <!-- Backups -->
        <section class="rounded-lg border border-default bg-default p-4">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-database-backup" class="size-4 text-primary" />{{ tc.backups }}</h3>
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <div><dt class="text-xs text-muted">{{ tc.frequencia }}</dt><dd class="text-highlighted">1 h</dd></div>
            <div><dt class="text-xs text-muted">{{ tc.retencao }}</dt><dd class="text-highlighted">{{ tc.retencaoValor(c.retencaoDias) }}</dd></div>
            <div class="col-span-2">
              <dt class="text-xs text-muted">{{ tc.ultimo }}</dt>
              <dd class="flex items-center gap-2 text-highlighted">
                <span class="relative flex size-2.5"><span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" /><span class="relative inline-flex size-2.5 rounded-full bg-success" /></span>
                {{ relativo(c.ultimoBackup, idioma) }}
              </dd>
            </div>
          </dl>
          <p class="mb-1 mt-4 text-xs text-muted">{{ tc.historico }}</p>
          <div class="flex gap-1">
            <UTooltip v-for="(h, i) in c.historico" :key="i" :text="`${relativo(h.quando, idioma)} · ${h.ok ? tc.ok : tc.falhou}`">
              <span class="h-6 flex-1 rounded-sm transition-transform hover:scale-y-110" :class="h.ok ? 'bg-success/70' : 'bg-warning/80'" />
            </UTooltip>
          </div>
        </section>

        <!-- Teste -->
        <section class="rounded-lg border border-default bg-default p-4">
          <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-flask-conical" class="size-4 text-primary" />{{ tc.teste }}</h3>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-xs text-muted">{{ tc.ultimoTeste }}</dt>
              <dd class="text-highlighted">{{ data(c.ultimoTeste.quando, idioma) }}</dd>
              <dd class="flex items-center gap-1.5 text-xs text-success"><UIcon name="i-lucide-circle-check" class="size-3.5" />{{ tc.restaurado(c.ultimoTeste.duracao) }}</dd>
            </div>
            <div><dt class="text-xs text-muted">{{ tc.proximo }}</dt><dd class="text-highlighted">{{ tc.proximoValor }}</dd></div>
          </dl>
          <UButton :label="tc.relatorio" icon="i-lucide-file-down" size="xs" color="neutral" variant="outline" class="mt-4" :loading="baixando === 'relatorio'" @click="baixar('relatorio')" />
        </section>
      </div>
    </div>
  </div>
</template>
