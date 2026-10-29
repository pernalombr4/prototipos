<script setup lang="ts">
/**
 * Configuração da Agenda, legível para quem não conhece o modelo de dados (A5 da síntese, T8 do briefing): a
 * categoria pelo nome, o campo pelo rótulo, hora de início e de fim opcionais e a cor numa paleta do tema, no lugar
 * de "Tipo ID: 1314 - created_at - display" e do hexadecimal. Salvar atualiza a grade sem recarregar a tela.
 *
 * Ajuste da rodada 2: o bloco Tarefas liga, para o workspace inteiro, as tarefas atribuídas a cada pessoa na Agenda
 * dela, pelo prazo. Vem ligado.
 */
import type { CorDoCalendario } from '~/components/ux/geometriaDoCalendario'
import { barra } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { type Fonte, estado } from './estado'
import { type Cor, categorias, EU } from './mocks'

const props = defineProps<{ t: Textos, conectando: boolean }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvo: [], conectar: [] }>()

const SEM = 'sem-hora'
const PALETA: Cor[] = ['primary', 'info', 'success', 'warning', 'neutral']

const rascunho = ref<Fonte[]>([])
const tarefas = ref(true)
watch(aberto, (a) => {
  if (!a) return
  rascunho.value = structuredClone(toRaw(estado.fontes))
  tarefas.value = estado.tarefasNaAgenda
})

const linhas = computed(() => categorias.map(c => ({
  categoria: c,
  fonte: rascunho.value.find(f => f.slug === c.slug),
  datas: c.campos.filter(x => x.tipo === 'data').map(x => ({ label: x.rotulo, value: x.chave })),
  horas: [{ label: props.t.config.semHora, value: SEM }, ...c.campos.filter(x => x.tipo === 'hora').map(x => ({ label: x.rotulo, value: x.chave }))],
})))

function ligarFonte(slug: Fonte['slug'], ativa: boolean) {
  const f = rascunho.value.find(x => x.slug === slug)
  if (f) f.ativa = ativa
}

const salvando = ref(false)
function salvar() {
  salvando.value = true
  setTimeout(() => {
    for (const f of rascunho.value) {
      const antes = estado.fontes.find(x => x.slug === f.slug)
      if (f.ativa && !antes?.ativa) estado.camadas[f.slug] = true
    }
    estado.fontes = rascunho.value
    if (tarefas.value && !estado.tarefasNaAgenda) Object.assign(estado.camadas, { tarefas: true, rapidas: true })
    estado.tarefasNaAgenda = tarefas.value
    salvando.value = false
    aberto.value = false
    emit('salvo')
  }, 500)
}

const corDe = (c: CorDoCalendario) => barra[c]
</script>

<template>
  <USlideover v-model:open="aberto" :title="t.config.titulo" :description="t.config.descricao" :ui="{ content: 'max-w-lg', footer: 'justify-end' }">
    <template #body>
      <div class="flex flex-col gap-6">
        <!-- Tarefas -->
        <section class="flex flex-col gap-3">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.config.tarefas }}</h3>
          <div class="flex items-start gap-3 rounded-lg border border-default p-3 transition-colors" :class="tarefas && 'bg-elevated/40'">
            <UIcon name="i-lucide-flag" class="mt-0.5 size-4 text-muted" />
            <div class="flex-1">
              <p class="text-sm font-medium text-highlighted">{{ t.config.tarefasLigadas }}</p>
              <p class="text-xs text-muted">{{ t.config.tarefasTexto }}</p>
            </div>
            <USwitch v-model="tarefas" :aria-label="t.config.tarefasLigadas" />
          </div>
        </section>

        <!-- Fontes do ENSPACE -->
        <section class="flex flex-col gap-3">
          <div>
            <h3 class="text-sm font-semibold text-highlighted">{{ t.config.fontes }}</h3>
            <p class="text-xs text-muted">{{ t.config.fontesTexto }}</p>
          </div>

          <div v-for="l in linhas" :key="l.categoria.slug" class="flex flex-col gap-3 rounded-lg border border-default p-3 transition-colors" :class="l.fonte?.ativa && 'bg-elevated/40'">
            <div class="flex items-center gap-2">
              <UIcon :name="l.categoria.icon!" class="size-4 text-muted" />
              <span class="flex-1 text-sm font-medium text-highlighted">{{ l.categoria.name }}</span>
              <span v-if="!l.fonte" class="text-xs text-muted">{{ t.config.semCampo }}</span>
              <USwitch v-else :model-value="l.fonte.ativa" :aria-label="l.categoria.name" @update:model-value="ligarFonte(l.categoria.slug, $event as boolean)" />
            </div>

            <template v-if="l.fonte?.ativa">
              <UFormField :label="t.config.campo" size="xs">
                <USelect v-model="l.fonte.campo" :items="l.datas" size="sm" class="w-full" />
              </UFormField>
              <div v-if="l.horas.length > 1" class="grid grid-cols-2 gap-2">
                <UFormField :label="t.config.horaInicio" size="xs">
                  <USelect :model-value="l.fonte.horaInicio ?? SEM" :items="l.horas" size="sm" class="w-full" @update:model-value="l.fonte.horaInicio = $event === SEM ? null : $event as string" />
                </UFormField>
                <UFormField :label="t.config.horaFim" size="xs">
                  <USelect :model-value="l.fonte.horaFim ?? SEM" :items="l.horas" size="sm" class="w-full" :disabled="!l.fonte.horaInicio" @update:model-value="l.fonte.horaFim = $event === SEM ? null : $event as string" />
                </UFormField>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-medium text-toned">{{ t.config.cor }}</span>
                <div class="flex gap-1.5" role="radiogroup" :aria-label="t.config.cor">
                  <button
                    v-for="c in PALETA"
                    :key="c"
                    type="button"
                    role="radio"
                    :aria-checked="l.fonte.cor === c"
                    :aria-label="t.config.cores[c]"
                    class="flex size-6 items-center justify-center rounded-full ring-offset-2 ring-offset-(--ui-bg) transition hover:scale-110"
                    :class="[corDe(c), l.fonte.cor === c && 'ring-2 ring-(--ui-border-inverted)']"
                    @click="l.fonte.cor = c"
                  >
                    <UIcon v-if="l.fonte.cor === c" name="i-lucide-check" class="size-3.5 text-inverted" />
                  </button>
                </div>
              </div>
            </template>
          </div>
        </section>

        <!-- Outlook -->
        <section class="flex flex-col gap-2">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.config.outlook }}</h3>
          <div class="flex items-center gap-3 rounded-lg border border-default p-3">
            <UIcon name="i-lucide-calendar" class="size-5 text-info" />
            <p class="flex-1 text-sm" :class="estado.outlook === 'falha' ? 'text-warning' : 'text-toned'">
              {{ estado.outlook === 'conectado' ? t.config.conectadoComo(EU.email!) : estado.outlook === 'falha' ? t.config.semConexao : t.lateral.conectarTexto }}
            </p>
            <UButton v-if="estado.outlook === 'conectado'" :label="t.config.desconectar" color="neutral" variant="outline" size="xs" @click="estado.outlook = 'desconectado'" />
            <UButton v-else :label="estado.outlook === 'falha' ? t.config.tentar : t.config.conectar" color="neutral" variant="outline" size="xs" :loading="conectando" @click="emit('conectar')" />
          </div>
        </section>

        <!-- Horário -->
        <section class="flex flex-col gap-1">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.config.horario }}</h3>
          <p class="text-xs text-muted">{{ t.config.horarioTexto }}</p>
        </section>
      </div>
    </template>

    <template #footer>
      <UButton :label="t.config.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
      <UButton :label="t.config.salvar" :loading="salvando" @click="salvar" />
    </template>
  </USlideover>
</template>
