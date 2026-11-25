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
 *
 * Rodada 6: o rótulo "Exige ação" abre um `UPopover` com o que muda, quem é afetado, o prazo com as
 * 3 fases e os links "Ver na versão" e "Ver o guia", mesmo com a versão fechada. No texto da versão,
 * cada item que exige ação traz "O que fazer" em passos numerados (`ProseOl`).
 *
 * Rodada 7: o padrão da doc do Nuxt. O popover sai: a ação mora no texto, como a seção "Breaking
 * Changes" do post de versão do Nuxt. A seção "Exige ação" fica sempre aberta, fora do texto
 * recolhido, e o rótulo leva até ela. Cada item tem, nesta ordem: o título; o que muda e por quê;
 * quem é afetado; o prazo, as 3 fases e o que acontece depois; "O que fazer" em até 3 passos; o link
 * do guia de migração, que diz o destino. O guia completo é uma página da doc (`_GuiaDeMigracao.vue`).
 * Pesquisa: pesquisa-de-mercado, runs/2026-11-24-deploy-continuo-e-lancamento,
 * evidencias/notas/acao-exige-acao.md.
 *
 * Rodada 9: o guia é a única fonte do "como". Na release ficam o título com o porquê, quem é afetado,
 * "Agir até" e o link do guia.
 *
 * Rodada 10: o rótulo volta a abrir um `UPopover` (chevron), agora curto: o título da mudança,
 * "Agir até" com o porquê e o link "Abrir o guia de migração". Sair da página é escolha da pessoa.
 *
 * Rodada 11: a seção Exige ação sai. A mudança é um item do tipo dela (Novidades, Melhorias), com o
 * rótulo "Exige ação" no item, o porquê, quem é afetado, "Agir até" e o link do guia. A versão volta
 * a ficar toda recolhida; o resumo do rótulo do topo ganha "Ver na versão", que abre e rola até o item.
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
  /** Leva ao item na trilha, com a versão aberta. */
  irPara: [id: string]
  /** Rodada 7: o guia de migração da mudança, na doc. */
  abrirGuia: [mudanca: string]
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
      /** As mudanças que exigem ação, para o resumo do rótulo. Rodada 11: no texto, cada uma fica no tipo dela. */
      acoes: v.itens.filter(e => e.mudanca).map(e => ({ entrada: e, mudanca: mudancaDe(e.mudanca)! })),
      secoes: [
        { chave: 'novidades', titulo: props.t.releases.tipos.novidade, itens: v.itens.filter(e => e.tipo === 'novidade') },
        { chave: 'melhorias', titulo: props.t.releases.tipos.melhoria, itens: v.itens.filter(e => e.tipo === 'melhoria') },
        { chave: 'correcoes', titulo: props.t.releases.tipos.correcao, itens: v.itens.filter(e => e.tipo === 'correcao') },
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
          <!--
            Rodada 10: o rótulo abre um resumo curto de cada mudança, com o link do guia. A pessoa
            escolhe se sai da página; o rótulo nunca leva direto ao guia.
          -->
          <UPopover
            v-if="v.prazo"
            :content="{ side: 'bottom', align: 'start', sideOffset: 8, collisionPadding: 16 }"
            :ui="{ content: 'w-80 p-4 sm:w-96' }"
          >
            <UButton
              color="warning"
              variant="outline"
              size="xs"
              icon="i-lucide-triangle-alert"
              trailing-icon="i-lucide-chevron-down"
              class="cursor-pointer bg-warning/10 text-highlighted hover:bg-warning/20"
              :ui="{ leadingIcon: 'text-warning', trailingIcon: 'text-warning' }"
              :label="`${t.entrada.exigeAcao} · ${t.entrada.agirAte(formatarData(v.prazo, idioma))}`"
              @click.stop
            />

            <template #content="{ close }">
              <div class="flex flex-col gap-4">
                <template v-for="(x, i) in v.acoes" :key="x.entrada.id">
                  <USeparator v-if="i" />
                  <div class="flex flex-col gap-2 text-sm leading-6">
                    <p class="font-semibold text-highlighted">
                      {{ L(x.mudanca.titulo) }}
                    </p>
                    <p class="text-default">
                      <span class="font-semibold text-highlighted">{{ t.releases.agirAteData(dataLonga(x.mudanca.fases.obrigatoria)) }}</span>{{ ' ' }}{{ L(x.mudanca.motivo) }}
                    </p>
                    <div class="-ml-2 flex flex-wrap gap-x-2">
                      <UButton
                        size="xs"
                        color="primary"
                        variant="link"
                        trailing-icon="i-lucide-arrow-down"
                        :label="t.releases.verNaVersao"
                        class="cursor-pointer"
                        @click="close(); emit('irPara', x.entrada.id)"
                      />
                      <UButton
                        size="xs"
                        color="primary"
                        variant="link"
                        trailing-icon="i-lucide-arrow-right"
                        :label="t.releases.abrirGuia"
                        class="cursor-pointer"
                        @click="close(); emit('abrirGuia', x.mudanca.id)"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </UPopover>
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
          <UCollapsible v-if="v.secoes.length" :open="estaAberta(v.id)">
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
                    <div
                      v-for="e in s.itens"
                      :id="e.id"
                      :key="e.id"
                      class="scroll-mt-32 rounded-sm transition-colors duration-500"
                      :class="aceso === e.id ? 'bg-primary/10' : ''"
                    >
                      <ProseP :class="e.mudanca ? 'mb-2' : ''">
                        <a :href="`#${e.id}`" :title="t.entrada.copiarLink" class="group relative rounded-sm text-highlighted outline-primary/25 focus-visible:outline-3">
                          <span class="absolute top-0 -ms-8 hidden rounded-md bg-elevated p-1 text-muted opacity-0 transition group-hover:text-primary group-hover:opacity-100 group-focus:opacity-100 lg:flex" aria-hidden="true">
                            <UIcon :name="icones.hash" class="size-4 shrink-0" />
                          </span>
                          <ProseStrong>{{ tituloDoItem(e) }}</ProseStrong>
                        </a>
                        <!-- Rodada 11: a mudança que exige ação é um item do tipo dela, marcado no próprio item -->
                        <template v-if="e.mudanca">
                          {{ ' ' }}<UBadge
                            color="warning"
                            variant="subtle"
                            size="sm"
                            icon="i-lucide-triangle-alert"
                            :label="t.entrada.exigeAcao"
                            class="align-text-bottom"
                          />
                          {{ ' ' }}{{ L(mudancaDe(e.mudanca)!.motivo) }}
                        </template>
                        <template v-else>
                          {{ ' ' }}{{ L(e.resumo) }}
                          <template v-if="!v.emBreve">
                            {{ ' ' }}<ProseA href="#" @click.prevent="foraDoPrototipo">{{ t.releases.saibaMais }}</ProseA>
                          </template>
                        </template>
                      </ProseP>
                      <template v-if="e.mudanca">
                        <ProseP class="my-2">
                          {{ t.releases.quemEAfetado(L(mudancaDe(e.mudanca)!.quem)) }}{{ ' ' }}<ProseStrong>{{ t.releases.agirAteData(dataLonga(mudancaDe(e.mudanca)!.fases.obrigatoria)) }}</ProseStrong>
                        </ProseP>
                        <ProseP class="mt-2">
                          <ProseA :href="`#guia-${e.mudanca}`" @click.stop.prevent="emit('abrirGuia', e.mudanca)">
                            {{ t.releases.guiaDe(L(mudancaDe(e.mudanca)!.titulo)) }}
                          </ProseA>
                        </ProseP>
                      </template>
                    </div>
                  </template>
                </template>
              </div>
            </template>
          </UCollapsible>

          <!-- Mostrar mais e Mostrar menos ficam acima da linha do rodapé, logo abaixo do texto -->
          <UButton
            v-if="v.secoes.length"
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
