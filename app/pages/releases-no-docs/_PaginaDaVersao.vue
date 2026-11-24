<script setup lang="ts">
/**
 * PROPOSTA, rodada 3. A página de 1 versão: o changelog simples dela, que abre ao clicar na versão
 * na trilha da aba Releases. No docs de hoje, esse lugar é o post da versão no Blog (categoria
 * release); na proposta, o Blog fica só com o post mensal, e a lista curta dos itens mora aqui.
 *
 * Base visual do docs: `UContainer` > `UPage` > `UPageHeader` > `UPageBody`. Os itens são
 * `UPageCard` (contorno) dentro de `UPageList`, agrupados por tipo com `USeparator`. Cada item tem âncora
 * (link permanente da página da versão com `#<id do item>`).
 */
import { moduloDe, mudancaDe, postsDaProposta, type Entrada } from './mocks'
import { formatarData, type Textos } from './textos'
import type { Versao } from './versoes'

const props = defineProps<{
  t: Textos
  v: Versao
  /** Id do item a acender, quando se chega pelo link do item. */
  destaque: string | null
}>()

const emit = defineEmits<{
  voltar: []
  copiar: [versao: string, item?: string]
  verMudanca: [id: string]
  verPost: [mes: string]
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]
const data = (iso: string) => formatarData(iso, idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })
const toast = useToast()

const grupos = computed(() => (['novidade', 'melhoria', 'correcao'] as const)
  .map(tipo => ({ tipo, itens: props.v.itens.filter(e => e.tipo === tipo) }))
  .filter(g => g.itens.length))

/** A versão entra no post do mês quando tem item Tier 1 ou 2 e o mês tem post. */
const temPostDoMes = computed(() => !props.v.emBreve && props.v.temDestaque && postsDaProposta.some(p => p.mes === props.v.mes))

const corDoTipo = { novidade: 'primary', melhoria: 'info', correcao: 'neutral' } as const
const temTutorial = (e: Entrada) => !!e.passos?.length || !!e.navegacaoGuiada

function foraDoPrototipo() {
  toast.add({ title: props.t.releases.foraDoPrototipo, icon: 'i-lucide-info', color: 'neutral', duration: 2500 })
}

const aceso = ref<string | null>(null)
watch(() => props.destaque, async (id) => {
  if (!id) return
  await nextTick()
  await new Promise(r => setTimeout(r, 380))
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  aceso.value = id
  setTimeout(() => { if (aceso.value === id) aceso.value = null }, 2600)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <UContainer class="max-w-3xl pb-24">
    <UButton
      color="neutral"
      variant="link"
      icon="i-lucide-arrow-left"
      :label="t.releases.voltar"
      class="mt-6 -ml-2.5 cursor-pointer"
      @click="emit('voltar')"
    />

    <UPage>
      <UPageHeader
        :title="v.titulo"
        :description="v.resumo"
        :links="[
          { label: t.entrada.copiarLink, icon: 'i-lucide-link', color: 'neutral', variant: 'outline', onClick: () => emit('copiar', v.versao) },
        ]"
      >
        <template #headline>
          <div class="flex flex-wrap items-center gap-1.5">
            <UBadge color="neutral" variant="subtle" :label="v.tamanho" />
            <UBadge v-if="v.emBreve" color="neutral" variant="subtle" icon="i-lucide-calendar-clock" :label="t.entrada.estado['em-breve']" />
            <span>{{ data(v.data) }}</span>
          </div>
        </template>
      </UPageHeader>

      <UPageBody>
        <UAlert
          v-if="temPostDoMes"
          color="neutral"
          variant="subtle"
          icon="i-lucide-newspaper"
          :title="t.releases.lerResumoDoMes"
          orientation="horizontal"
          :actions="[{ label: t.blog.lerPost, color: 'neutral', variant: 'outline', trailingIcon: 'i-lucide-arrow-right', onClick: () => emit('verPost', v.mes) }]"
          class="mb-8"
        />

        <div class="flex flex-col gap-8">
          <section v-for="g in grupos" :key="g.tipo" class="flex flex-col gap-2">
            <USeparator :label="`${t.releases.tipos[g.tipo]} · ${g.itens.length}`" />

            <UPageList class="gap-3">
              <UPageCard
                v-for="e in g.itens"
                :id="e.id"
                :key="e.id"
                variant="outline"
                :title="L(e.titulo)"
                :description="L(e.resumo)"
                :highlight="aceso === e.id"
                class="scroll-mt-28"
              >
                <template #header>
                  <div class="flex flex-wrap items-center gap-1.5">
                    <UBadge
                      v-if="mudancaDe(e.mudanca)"
                      color="warning"
                      variant="outline"
                      size="sm"
                      icon="i-lucide-triangle-alert"
                      class="bg-warning/10 text-highlighted"
                      :ui="{ leadingIcon: 'text-warning' }"
                      :label="`${t.entrada.exigeAcao} · ${t.entrada.agirAte(formatarData(mudancaDe(e.mudanca)!.fases.obrigatoria, idioma))}`"
                    />
                    <UBadge :color="corDoTipo[e.tipo]" variant="subtle" size="sm" :label="t.entrada.tipo[e.tipo]" />
                    <UBadge color="neutral" variant="outline" size="sm" :icon="moduloDe(e.modulo).icone" :label="L(moduloDe(e.modulo).nome)" />
                    <UBadge v-if="e.estado === 'liberando'" color="info" variant="subtle" size="sm" icon="i-lucide-loader" :label="e.todosAte ? t.entrada.paraTodosAte(formatarData(e.todosAte, idioma)) : t.entrada.estado.liberando" />
                    <UBadge v-if="e.acesso" color="secondary" variant="subtle" size="sm" icon="i-lucide-flask-conical" :label="t.entrada.acesso[e.acesso]" />
                    <UBadge v-if="e.publico === 'alguns'" color="neutral" variant="subtle" size="sm" icon="i-lucide-users" :label="t.entrada.alguns" />
                  </div>
                </template>

                <template #footer>
                  <div class="-ml-2.5 flex flex-wrap items-center gap-1">
                    <UButton
                      v-if="e.tipo !== 'correcao' && !v.emBreve"
                      size="sm"
                      color="neutral"
                      variant="link"
                      icon="i-lucide-book-open"
                      :label="t.entrada.documentacao"
                      class="cursor-pointer"
                      @click="foraDoPrototipo"
                    />
                    <UButton
                      v-if="temTutorial(e) && !v.emBreve"
                      size="sm"
                      color="neutral"
                      variant="link"
                      icon="i-lucide-circle-play"
                      :label="t.releases.tutorial"
                      class="cursor-pointer"
                      @click="foraDoPrototipo"
                    />
                    <UButton
                      v-if="mudancaDe(e.mudanca)"
                      size="sm"
                      color="neutral"
                      variant="link"
                      icon="i-lucide-list-checks"
                      :ui="{ leadingIcon: 'text-warning' }"
                      :label="t.entrada.verOQueFazer"
                      class="cursor-pointer"
                      @click="emit('verMudanca', mudancaDe(e.mudanca)!.id)"
                    />
                    <UButton
                      size="sm"
                      color="neutral"
                      variant="link"
                      icon="i-lucide-link"
                      :label="t.entrada.copiarLink"
                      class="cursor-pointer"
                      @click="emit('copiar', v.versao, e.id)"
                    />
                  </div>
                </template>
              </UPageCard>
            </UPageList>
          </section>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
