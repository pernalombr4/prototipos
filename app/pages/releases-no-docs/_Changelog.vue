<script setup lang="ts">
/**
 * PROPOSTA. A trilha da aba Releases é o próprio changelog: o texto de cada versão é lido na linha
 * do tempo, sem abrir outra página. Modelo: o template oficial "Changelog" do Nuxt UI
 * (nuxt-ui-templates/changelog), que põe o texto da versão no `#body` do `UChangelogVersion`.
 * Síntese da pesquisa: pesquisa-de-mercado, runs/2026-11-24-deploy-continuo-e-lancamento,
 * evidencias/notas/changelog-referencias.md, "Proposta para o protótipo".
 *
 * Mantido da página de hoje do `en-docs`: `UChangelogVersions` com `indicator-motion`, 1
 * `UChangelogVersion` por versão, o container `max-w-2xl` e o título `text-2xl`.
 *
 * Rodada 4: o texto em prosa (os componentes Prose do Nuxt UI, os do texto de um post), na ordem
 * Exige ação, Novidades, Melhorias, Correções; no máximo 2 rótulos; sem banner.
 *
 * Rodada 5:
 * - o texto vem fechado (`UCollapsible`); fechada, a versão mostra a data, os rótulos, o título e o
 *   resumo curto. "Mostrar mais", acima da linha do rodapé, abre e fecha;
 * - sem filtros e sem a contagem de versões; sai a página Próximas mudanças: a versão Em breve fica
 *   no topo, e as 3 fases da mudança que quebra entram em 1 frase no texto do item;
 * - cada título tem link, como os títulos de markdown do Nuxt UI e o changelog do Notion: o título
 *   da versão, os subtítulos (`ProseH3` com âncora) e o título de cada item. Passar o mouse mostra o
 *   ícone; clicar copia o link e mostra "Link copiado".
 */
import ProseA from '@nuxt/ui/runtime/components/prose/A.vue'
import ProseH3 from '@nuxt/ui/runtime/components/prose/H3.vue'
import ProseLi from '@nuxt/ui/runtime/components/prose/Li.vue'
import ProseP from '@nuxt/ui/runtime/components/prose/P.vue'
import ProseStrong from '@nuxt/ui/runtime/components/prose/Strong.vue'
import ProseUl from '@nuxt/ui/runtime/components/prose/Ul.vue'
import { mudancaDe, type Entrada } from './mocks'
import { formatarData, type Textos } from './textos'
import { montarVersoes } from './versoes'

const props = defineProps<{
  t: Textos
  estado: 'cheio' | 'vazio' | 'carregando'
  /** Id da versão (`v3-4-0`), do subtítulo ou do item a mostrar: abre a versão, rola até ele e acende. */
  destaque: string | null
}>()

const emit = defineEmits<{
  copiar: [ancora: string]
  verPost: [mes: string]
  assinar: []
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]
const toast = useToast()
/** O mesmo ícone dos títulos de markdown do Nuxt UI (`ProseH3`). */
const icones = useAppConfig().ui.icons

/* ---------------- As versões e o texto de cada uma ---------------- */
/** Em breve no topo; depois da mais nova para a mais antiga, como hoje (date DESC). */
const versoes = computed(() => {
  if (props.estado === 'vazio') return []
  return montarVersoes(props.t, idioma.value)
    .sort((a, b) => Number(b.emBreve) - Number(a.emBreve) || b.data.localeCompare(a.data) || b.versao.localeCompare(a.versao))
    .map(v => ({
      ...v,
      secoes: [
        { chave: 'exige-acao', titulo: props.t.entrada.exigeAcao, itens: v.itens.filter(e => e.mudanca) },
        { chave: 'novidades', titulo: props.t.releases.tipos.novidade, itens: v.itens.filter(e => !e.mudanca && e.tipo === 'novidade') },
        { chave: 'melhorias', titulo: props.t.releases.tipos.melhoria, itens: v.itens.filter(e => !e.mudanca && e.tipo === 'melhoria') },
        { chave: 'correcoes', titulo: props.t.releases.tipos.correcao, itens: v.itens.filter(e => !e.mudanca && e.tipo === 'correcao') },
      ].filter(s => s.itens.length),
    }))
})

/** O título do item, com Beta, acesso antecipado, liberação aos poucos e público no próprio texto. */
function tituloDoItem(e: Entrada) {
  const extras = [
    e.acesso ? props.t.entrada.acesso[e.acesso] : '',
    e.estado === 'liberando' ? (e.todosAte ? props.t.entrada.paraTodosAte(formatarData(e.todosAte, idioma.value)) : props.t.entrada.estado.liberando) : '',
    e.publico === 'alguns' ? props.t.entrada.alguns : '',
  ].filter(Boolean).map(x => x.charAt(0).toLocaleLowerCase(idioma.value) + x.slice(1))
  return extras.length ? `${L(e.titulo)} (${extras.join(', ')}).` : `${L(e.titulo)}.`
}

/** As 3 fases da mudança que quebra, em 1 frase (rodada 5: sai a página Próximas mudanças). */
function fases(e: Entrada) {
  const f = mudancaDe(e.mudanca)!.fases
  return props.t.releases.fasesDaMudanca(dataDaVersao(f['opt-in']), dataDaVersao(f['opt-out']), dataDaVersao(f.obrigatoria))
}

const dataLonga = (iso: string) => formatarData(iso, idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })
/** A data no formato do idioma, em números, sem voltar 1 dia (hoje o site mostra "Dec 7, 2026" para 8 de dezembro). */
const dataDaVersao = (iso: string) => formatarData(iso, idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' })

function foraDoPrototipo() {
  toast.add({ title: props.t.releases.foraDoPrototipo, icon: 'i-lucide-info', color: 'neutral', duration: 2500 })
}

/* ---------------- Abrir e fechar o texto ---------------- */
const abertasNaTela = ref<string[]>([])
const estaAberta = (id: string) => abertasNaTela.value.includes(id)
function alternar(id: string) {
  abertasNaTela.value = estaAberta(id) ? abertasNaTela.value.filter(x => x !== id) : [...abertasNaTela.value, id]
}

/* ---------------- Cada título copia o próprio link ---------------- */
/** Os títulos são links `#<âncora>`: o clique copia o endereço completo, sem pular a página. */
function copiarDoTitulo(ev: MouseEvent) {
  const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
  const ancora = a?.getAttribute('href')?.slice(1)
  if (!ancora) return
  ev.preventDefault()
  emit('copiar', ancora)
}

/* ---------------- Ir até uma versão, um subtítulo ou um item ---------------- */
const aceso = ref<string | null>(null)
let apagar: ReturnType<typeof setTimeout> | undefined
watch(() => props.destaque, async (id) => {
  if (!id) return
  const v = versoes.value.find(x => x.id === id || id.startsWith(`${x.id}-`) || x.itens.some(e => e.id === id))
  if (v && !estaAberta(v.id) && id !== v.id) abertasNaTela.value = [...abertasNaTela.value, v.id]
  await nextTick()
  await new Promise(r => setTimeout(r, 450))
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: id === v?.id ? 'start' : 'center' })
  aceso.value = id
  clearTimeout(apagar)
  apagar = setTimeout(() => { aceso.value = null }, 2600)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div>
    <!-- Acima da lista, na coluna do conteúdo: só o link para assinar -->
    <div class="mx-auto mb-12 flex max-w-2xl items-center justify-end gap-1">
      <UButton
        size="sm"
        color="neutral"
        variant="link"
        icon="i-lucide-bell-plus"
        :label="t.releases.assinar"
        class="cursor-pointer"
        @click="emit('assinar')"
      />
    </div>

    <!-- Carregando -->
    <div v-if="estado === 'carregando'" class="mx-auto flex max-w-2xl flex-col gap-10" aria-busy="true">
      <div v-for="i in 2" :key="i" class="flex flex-col gap-3">
        <USkeleton class="h-7 w-1/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </div>

    <!-- Vazio -->
    <UEmpty
      v-else-if="!versoes.length"
      class="mx-auto max-w-2xl"
      icon="i-lucide-rocket"
      :title="t.releases.vazioTitulo"
      :description="t.releases.vazioTexto"
      variant="naked"
    />

    <!-- A linha do tempo de hoje, com o texto de cada versão no corpo, fechado -->
    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-10 sm:gap-y-14 lg:gap-y-18' }" @click="copiarDoTitulo">
      <UChangelogVersion
        v-for="v in versoes"
        :id="v.id"
        :key="v.versao"
        :description="v.descricao"
        :date="v.data"
        class="scroll-mt-28"
        :ui="{
          container: [
            'max-w-2xl rounded-lg outline-offset-8 transition-[outline-color] duration-500',
            aceso === v.id ? 'outline-2 outline-primary' : 'outline-2 outline-transparent',
          ].join(' '),
          meta: 'flex flex-wrap items-center gap-1.5 mb-2',
          title: 'text-2xl font-bold text-highlighted',
          description: 'text-base text-muted mt-2 leading-relaxed',
          footer: v.emPostDoMes ? 'border-t border-default pt-4 mt-4 flex flex-wrap items-center justify-end gap-2' : 'border-t border-default mt-4',
          dotInner: v.emBreve ? 'size-2 rounded-full bg-dimmed' : undefined,
        }"
      >
        <template #date>
          {{ dataDaVersao(v.data) }}
        </template>

        <!-- No máximo 2 rótulos: o tamanho e o prazo -->
        <template #badge>
          <UBadge color="neutral" variant="subtle" size="sm" :label="v.tamanho" />
          <UBadge
            v-if="v.prazo"
            color="warning"
            variant="outline"
            size="sm"
            icon="i-lucide-triangle-alert"
            class="bg-warning/10 text-highlighted"
            :ui="{ leadingIcon: 'text-warning' }"
            :label="`${t.entrada.exigeAcao} · ${t.entrada.agirAte(formatarData(v.prazo, idioma))}`"
          />
        </template>

        <!-- O título é link, como um título de markdown do Nuxt UI: o ícone # aparece ao passar o mouse -->
        <template #title>
          <a :href="`#${v.id}`" :title="t.entrada.copiarLink" class="group rounded-sm outline-primary/25 focus-visible:outline-3">
            <span class="absolute top-1 -ms-8 hidden rounded-md bg-elevated p-1 text-muted opacity-0 transition group-hover:text-primary group-hover:opacity-100 group-focus:opacity-100 lg:flex" aria-hidden="true">
              <UIcon :name="icones.hash" class="size-4 shrink-0" />
            </span>
            {{ v.titulo }}
          </a>
        </template>

        <!-- O texto da versão, como o texto de um post, fechado por padrão -->
        <template #body>
          <UCollapsible :open="estaAberta(v.id)">
            <template #content>
              <div class="pt-2 text-default">
                <template v-for="s in v.secoes" :key="s.chave">
                  <ProseH3 :id="`${v.id}-${s.chave}`" anchor :ui="{ base: 'text-lg mt-6 mb-2 scroll-mt-32' }">
                    {{ s.titulo }}
                  </ProseH3>

                  <ProseUl v-if="s.chave === 'correcoes'">
                    <ProseLi
                      v-for="e in s.itens"
                      :id="e.id"
                      :key="e.id"
                      class="scroll-mt-32 rounded-sm transition-colors duration-500"
                      :class="aceso === e.id ? 'bg-primary/10' : ''"
                    >
                      {{ L(e.titulo) }}
                    </ProseLi>
                  </ProseUl>

                  <template v-else>
                    <ProseP
                      v-for="e in s.itens"
                      :id="e.id"
                      :key="e.id"
                      class="scroll-mt-32 rounded-sm transition-colors duration-500"
                      :class="aceso === e.id ? 'bg-primary/10' : ''"
                    >
                      <a :href="`#${e.id}`" :title="t.entrada.copiarLink" class="group relative rounded-sm text-highlighted outline-primary/25 focus-visible:outline-3">
                        <span class="absolute top-0 -ms-8 hidden rounded-md bg-elevated p-1 text-muted opacity-0 transition group-hover:text-primary group-hover:opacity-100 group-focus:opacity-100 lg:flex" aria-hidden="true">
                          <UIcon :name="icones.hash" class="size-4 shrink-0" />
                        </span>
                        <ProseStrong>{{ tituloDoItem(e) }}</ProseStrong>
                      </a>{{ ' ' }}{{ L(e.resumo) }}
                      <template v-if="mudancaDe(e.mudanca)">
                        {{ ' ' }}<ProseStrong>{{ t.releases.agirAteData(dataLonga(mudancaDe(e.mudanca)!.fases.obrigatoria)) }}</ProseStrong>{{ ' ' }}{{ fases(e) }}
                      </template>
                      <template v-if="!v.emBreve">
                        {{ ' ' }}<ProseA href="#" @click.prevent="foraDoPrototipo">{{ t.releases.saibaMais }}</ProseA>
                      </template>
                    </ProseP>
                  </template>
                </template>
              </div>
            </template>
          </UCollapsible>

          <!-- Mostrar mais e Mostrar menos ficam acima da linha do rodapé, logo abaixo do texto -->
          <UButton
            size="xs"
            color="neutral"
            variant="link"
            :label="estaAberta(v.id) ? t.releases.mostrarMenos : t.releases.mostrarMais"
            trailing-icon="i-lucide-chevron-down"
            :aria-expanded="estaAberta(v.id)"
            :ui="{ trailingIcon: ['transition-transform duration-200', estaAberta(v.id) ? 'rotate-180' : ''].join(' ') }"
            class="-ml-2 mt-3 cursor-pointer"
            @click="alternar(v.id)"
          />
        </template>

        <!-- Abaixo da linha, só o post de lançamento; sem post, o rodapé é só a linha -->
        <template #footer>
          <UButton
            v-if="v.emPostDoMes"
            size="xs"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
            :label="t.releases.lerPostDeLancamento"
            class="cursor-pointer"
            @click="emit('verPost', v.mes)"
          />
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </div>
</template>
