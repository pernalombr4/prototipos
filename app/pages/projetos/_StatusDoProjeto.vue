<script setup lang="ts">
/**
 * PROPOSTA (rodada 3): o status do projeto, na Visão geral.
 *
 * Base: as status updates do GitHub Projects e o "Project overview" do Asana. A atualização tem
 * situação, início, fim previsto e um texto; a mais nova aparece no cabeçalho, no painel lateral
 * e no diretório. As anteriores ficam abaixo, recolhidas.
 * Só quem administra o projeto publica. No código, é campo da entidade nova de projeto.
 */
import type { Textos } from './textos'
import { iniciais, pessoa, type Situacao } from './mocks'
import { COR_DA_SITUACAO, ICONE_DA_SITUACAO, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const admin = computed(() => prj.podeAdministrar(p.value))
const atual = computed(() => p.value.atualizacoes[0] ?? null)
const anteriores = computed(() => p.value.atualizacoes.slice(1))
const vendoAnteriores = ref(false)
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)

/* ---------- janela ---------- */
const aberta = ref(false)
const situacao = ref<Situacao>('noPrazo')
const inicio = ref('')
const fim = ref('')
const texto = ref('')
const tentou = ref(false)
const publicando = ref(false)

function abrir() {
  situacao.value = atual.value?.situacao ?? 'noPrazo'
  inicio.value = atual.value?.inicio ?? p.value.criadoEm
  fim.value = atual.value?.fim ?? ''
  texto.value = ''
  tentou.value = false
  aberta.value = true
}

const opcoes = computed(() => (['noPrazo', 'emRisco', 'atrasado', 'concluido'] as const).map(v => ({
  value: v,
  label: props.t.situacao[v],
  icon: ICONE_DA_SITUACAO[v],
  dica: props.t.situacao[`${v}Dica` as const],
})))
const erroFim = computed(() => tentou.value && fim.value && inicio.value && fim.value < inicio.value ? props.t.status.fimAntesDoInicio : undefined)

async function publicar() {
  tentou.value = true
  if (erroFim.value) return
  publicando.value = true
  await new Promise(r => setTimeout(r, 500))
  prj.publicarStatus(props.id, { situacao: situacao.value, inicio: inicio.value, fim: fim.value || inicio.value, texto: texto.value.trim() })
  publicando.value = false
  aberta.value = false
  toast.add({ title: props.t.status.publicado, icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <section class="rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" :class="marca">
    <header class="flex items-center gap-2 border-b border-default px-4 py-3">
      <h2 class="flex-1 text-sm font-semibold text-highlighted">{{ t.status.titulo }}</h2>
      <UButton v-if="admin && atual" :label="t.status.atualizar" icon="i-lucide-megaphone" size="xs" color="neutral" variant="outline" @click="abrir" />
    </header>

    <div v-if="atual" class="flex flex-wrap items-start gap-x-6 gap-y-3 px-4 py-3">
      <div class="flex flex-col gap-1.5">
        <UBadge :label="t.situacao[atual.situacao]" :icon="ICONE_DA_SITUACAO[atual.situacao]" :color="COR_DA_SITUACAO[atual.situacao]" variant="subtle" class="self-start" />
        <span class="flex items-center gap-1 text-xs text-muted"><UIcon name="i-lucide-calendar-range" class="size-3.5" />{{ t.status.periodo(formatarData(atual.inicio), formatarData(atual.fim)) }}</span>
      </div>
      <div class="min-w-0 flex-1">
        <p v-if="atual.texto" class="text-sm text-default">{{ atual.texto }}</p>
        <p class="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <UAvatar size="3xs" :text="iniciais(pessoa(atual.autor)?.nome ?? '')" :alt="pessoa(atual.autor)?.nome" />
          {{ t.status.por(pessoa(atual.autor)?.nome ?? '', formatarData(atual.em)) }}
        </p>
      </div>
      <UButton
        v-if="anteriores.length"
        :label="vendoAnteriores ? t.status.ocultarAnteriores : t.status.anteriores(anteriores.length)"
        :icon="vendoAnteriores ? 'i-lucide-chevron-up' : 'i-lucide-history'"
        size="xs"
        color="neutral"
        variant="outline"
        class="self-center"
        :aria-expanded="vendoAnteriores"
        @click="vendoAnteriores = !vendoAnteriores"
      />
    </div>

    <ul v-if="atual && vendoAnteriores" class="divide-y divide-default border-t border-default animate-[entrada_0.15s_ease-out_both]">
      <li v-for="(a, i) in anteriores" :key="i" class="flex flex-wrap items-start gap-x-4 gap-y-1 px-4 py-2.5">
        <UBadge :label="t.situacao[a.situacao]" :icon="ICONE_DA_SITUACAO[a.situacao]" :color="COR_DA_SITUACAO[a.situacao]" variant="outline" size="sm" />
        <span class="min-w-0 flex-1 text-sm text-toned">{{ a.texto }}</span>
        <span class="text-xs text-muted">{{ t.status.por(pessoa(a.autor)?.nome ?? '', formatarData(a.em)) }}</span>
      </li>
    </ul>

    <div v-if="!atual" class="flex flex-wrap items-center gap-3 px-4 py-4">
      <UIcon name="i-lucide-megaphone" class="size-5 shrink-0 text-muted" />
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-highlighted">{{ t.status.vazio }}</p>
        <p class="text-sm text-muted">{{ t.status.vazioTexto }}</p>
      </div>
      <UButton v-if="admin" :label="t.status.primeira" icon="i-lucide-megaphone" size="sm" color="neutral" variant="outline" @click="abrir" />
    </div>

    <UModal v-model:open="aberta" :title="t.status.janelaTitulo" :description="t.status.janelaDescricao">
      <template #body>
        <form class="space-y-4" @submit.prevent="publicar">
          <UFormField :label="t.status.situacao" required>
            <USelect v-model="situacao" :items="opcoes" class="w-full" :icon="ICONE_DA_SITUACAO[situacao]">
              <template #item-trailing="{ item }">
                <UTooltip :text="(item as any).dica" :content="{ side: 'right' }">
                  <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="(item as any).dica" />
                </UTooltip>
              </template>
            </USelect>
            <p class="mt-1.5 text-sm text-muted">{{ t.situacao[`${situacao}Dica`] }}</p>
          </UFormField>
          <div class="grid gap-3 sm:grid-cols-2">
            <UFormField :label="t.status.inicio">
              <UInput v-model="inicio" type="date" class="w-full" />
            </UFormField>
            <UFormField :label="t.status.fim" :error="erroFim">
              <UInput v-model="fim" type="date" class="w-full" />
            </UFormField>
          </div>
          <UFormField :label="t.status.texto" :help="t.status.textoDica">
            <UTextarea v-model="texto" :rows="3" autoresize class="w-full" maxlength="500" />
          </UFormField>
          <button type="submit" class="hidden" />
        </form>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.status.cancelar" color="neutral" variant="ghost" @click="aberta = false" />
          <UButton :label="t.status.publicar" icon="i-lucide-send" color="primary" :loading="publicando" @click="publicar" />
        </div>
      </template>
    </UModal>
  </section>
</template>
