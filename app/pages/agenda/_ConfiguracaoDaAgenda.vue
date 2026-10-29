<script setup lang="ts">
/**
 * Configuração da Agenda, legível para quem não conhece o modelo de dados (A5 da síntese, T8 do briefing): a
 * categoria pelo nome, o campo pelo rótulo, hora de início e de fim opcionais e a cor numa paleta do tema, no lugar
 * de "Tipo ID: 1314 - created_at - display" e do hexadecimal. Salvar atualiza a grade sem recarregar a tela.
 *
 * Ajuste da rodada 2: o bloco Tarefas liga, para o workspace inteiro, as tarefas atribuídas a cada pessoa na Agenda
 * dela, pelo prazo. Vem ligado.
 *
 * Modelagem da rodada 2: uma categoria entra por mais de uma data ("Adicionar outra data"), cada data com a data de
 * fim opcional (o item ocupa vários dias) e o campo de pessoa que diz de quem é o item. A data cujo campo saiu do
 * formulário da categoria ganha o aviso e para de aparecer na Agenda até a troca.
 */
import type { CorDoCalendario } from '~/components/ux/geometriaDoCalendario'
import { barra } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { type Fonte, campoSumiu, estado, novaFonte, provedoresEmBreve } from './estado'
import { type Cor, type SlugDaCategoria, categorias, categoriaPorSlug, EU } from './mocks'

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

/** Os campos de data que podem virar fonte: o "Criado em" não entra como nova data. */
const datasLivres = (slug: SlugDaCategoria) => categoriaPorSlug(slug).campos.filter(x => x.tipo === 'data' && x.chave !== 'created_at' && !rascunho.value.some(f => f.slug === slug && f.campo === x.chave))

const linhas = computed(() => categorias.map((c) => {
  const opcoes = (tipo: string) => c.campos.filter(x => x.tipo === tipo).map(x => ({ label: x.rotulo, value: x.chave }))
  const fontes = rascunho.value.filter(f => f.slug === c.slug)
  return {
    categoria: c,
    fontes,
    ativa: fontes.some(f => f.ativa),
    /** Sem fonte e sem campo de data para criar uma: a categoria não entra na Agenda. */
    semCampo: !fontes.length && !datasLivres(c.slug).length,
    datas: opcoes('data'),
    fins: [{ label: props.t.modelo.semFim, value: SEM }, ...opcoes('data')],
    horas: [{ label: props.t.config.semHora, value: SEM }, ...opcoes('hora')],
    pessoas: [{ label: props.t.modelo.semResponsavel, value: SEM }, ...opcoes('pessoa')],
    livres: datasLivres(c.slug).length,
  }
}))

function ligarCategoria(slug: SlugDaCategoria, ativa: boolean) {
  const fontes = rascunho.value.filter(f => f.slug === slug)
  if (!fontes.length && ativa) return outraData(slug)
  fontes.forEach(f => (f.ativa = ativa))
}
function outraData(slug: SlugDaCategoria) {
  const campo = datasLivres(slug)[0]
  if (campo) rascunho.value.push(novaFonte(slug, campo.chave, PALETA[rascunho.value.length % PALETA.length]!))
}
const removerData = (f: Fonte) => (rascunho.value = rascunho.value.filter(x => x !== f))
const semNulo = (v: unknown) => v === SEM ? null : v as string

const salvando = ref(false)
function salvar() {
  salvando.value = true
  setTimeout(() => {
    for (const f of rascunho.value) {
      // O id segue o campo: trocar o campo de data é outra fonte, e a camada dela nasce ligada.
      f.id = `${f.slug}:${f.campo}`
      const antes = estado.fontes.find(x => x.id === f.id)
      if (f.ativa && !antes?.ativa) estado.camadas[f.id] = true
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

          <div v-for="l in linhas" :key="l.categoria.slug" class="flex flex-col gap-3 rounded-lg border border-default p-3 transition-colors" :class="l.ativa && 'bg-elevated/40'">
            <div class="flex items-center gap-2">
              <UIcon :name="l.categoria.icon!" class="size-4 text-muted" />
              <span class="flex-1 text-sm font-medium text-highlighted">{{ l.categoria.name }}</span>
              <UIcon v-if="l.fontes.some(campoSumiu)" name="i-lucide-triangle-alert" class="size-4 text-warning" :aria-label="t.modelo.campoSumiuCurto" />
              <span v-if="l.semCampo" class="text-xs text-muted">{{ t.config.semCampo }}</span>
              <USwitch v-else :model-value="l.ativa" :aria-label="l.categoria.name" @update:model-value="ligarCategoria(l.categoria.slug, $event as boolean)" />
            </div>

            <template v-if="l.ativa">
              <!-- Uma fonte por campo de data -->
              <div v-for="(f, n) in l.fontes" :key="n" class="flex flex-col gap-3" :class="n > 0 && 'border-t border-default pt-3'">
                <UAlert v-if="campoSumiu(f)" color="warning" variant="subtle" icon="i-lucide-triangle-alert" :description="t.modelo.campoSumiu(f.campo, l.categoria.name)" :ui="{ description: 'text-xs' }" />
                <div class="flex items-end gap-2">
                  <UFormField :label="t.config.campo" size="xs" class="flex-1">
                    <USelect v-model="f.campo" :items="l.datas" :placeholder="f.campo" size="sm" class="w-full" />
                  </UFormField>
                  <UFormField v-if="l.datas.length > 1" :label="t.modelo.dataFim" size="xs" class="flex-1">
                    <USelect :model-value="f.campoFim ?? SEM" :items="l.fins.filter(x => x.value !== f.campo)" size="sm" class="w-full" @update:model-value="f.campoFim = semNulo($event)" />
                  </UFormField>
                  <UTooltip v-if="l.fontes.length > 1" :text="t.modelo.removerData">
                    <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="t.modelo.removerData" @click="removerData(f)" />
                  </UTooltip>
                </div>
                <div v-if="l.horas.length > 1 && !f.campoFim" class="grid grid-cols-2 gap-2">
                  <UFormField :label="t.config.horaInicio" size="xs">
                    <USelect :model-value="f.horaInicio ?? SEM" :items="l.horas" size="sm" class="w-full" @update:model-value="f.horaInicio = semNulo($event)" />
                  </UFormField>
                  <UFormField :label="t.config.horaFim" size="xs">
                    <USelect :model-value="f.horaFim ?? SEM" :items="l.horas" size="sm" class="w-full" :disabled="!f.horaInicio" @update:model-value="f.horaFim = semNulo($event)" />
                  </UFormField>
                </div>
                <UFormField v-if="l.pessoas.length > 1" :label="t.modelo.responsavel" size="xs">
                  <USelect :model-value="f.campoResponsavel ?? SEM" :items="l.pessoas" size="sm" class="w-full" @update:model-value="f.campoResponsavel = semNulo($event)" />
                </UFormField>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-medium text-toned">{{ t.config.cor }}</span>
                  <div class="flex gap-1.5" role="radiogroup" :aria-label="t.config.cor">
                    <button
                      v-for="c in PALETA"
                      :key="c"
                      type="button"
                      role="radio"
                      :aria-checked="f.cor === c"
                      :aria-label="t.config.cores[c]"
                      class="flex size-6 items-center justify-center rounded-full ring-offset-2 ring-offset-(--ui-bg) transition hover:scale-110"
                      :class="[corDe(c), f.cor === c && 'ring-2 ring-(--ui-border-inverted)']"
                      @click="f.cor = c"
                    >
                      <UIcon v-if="f.cor === c" name="i-lucide-check" class="size-3.5 text-inverted" />
                    </button>
                  </div>
                </div>
              </div>
              <UButton v-if="l.livres" :label="t.modelo.outraData" icon="i-lucide-plus" color="neutral" variant="outline" size="xs" class="self-start" @click="outraData(l.categoria.slug)" />
            </template>
          </div>
        </section>

        <!-- Calendários externos: o Outlook e o que vem em breve -->
        <section class="flex flex-col gap-2">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.integracoes.calendariosExternos }}</h3>
          <div class="flex items-center gap-3 rounded-lg border border-default p-3">
            <UIcon name="i-simple-icons-microsoftoutlook" class="size-5 text-info" :aria-label="t.config.outlook" />
            <p class="flex-1 text-sm" :class="estado.outlook === 'falha' ? 'text-warning' : 'text-toned'">
              {{ estado.outlook === 'conectado' ? t.config.conectadoComo(EU.email!) : estado.outlook === 'falha' ? t.config.semConexao : t.lateral.conectarTexto }}
            </p>
            <UButton v-if="estado.outlook === 'conectado'" :label="t.config.desconectar" color="neutral" variant="outline" size="xs" @click="estado.outlook = 'desconectado'" />
            <UButton v-else :label="estado.outlook === 'falha' ? t.config.tentar : t.config.conectar" color="neutral" variant="outline" size="xs" :loading="conectando" @click="emit('conectar')" />
          </div>
          <div v-for="p in provedoresEmBreve" :key="p.id" class="flex items-center gap-3 rounded-lg border border-dashed border-default p-3" aria-disabled="true">
            <UIcon :name="p.icone" class="size-5 text-muted" :aria-label="t.integracoes.provedor[p.id]" />
            <p class="flex-1 text-sm text-muted">{{ t.integracoes.google.indisponivel }}</p>
            <UBadge :label="t.integracoes.emBreve" color="neutral" variant="subtle" size="sm" />
            <UButton :label="t.config.conectar" color="neutral" variant="outline" size="xs" disabled />
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
