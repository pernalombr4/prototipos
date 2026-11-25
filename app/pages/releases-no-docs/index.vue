<script setup lang="ts">
/**
 * A comunicação das releases no docs.enspace.io: abas Blog e Releases.
 *
 * A demanda: com deploy contínuo, o número da versão deixa de marcar o lançamento. A aba Releases
 * vira o changelog lido na própria trilha (o texto de cada versão, fechado por padrão), e o Blog fica
 * com o post mensal. O que exige ação do cliente vai como rótulo e seção no texto da versão, com o
 * prazo e as 3 fases. Feed RSS e inscrição por e-mail entram só como interface.
 * Proposta da pesquisa de mercado de 2026-11-24 (deploy contínuo e lançamento), seção 5.
 *
 * Uma porta só: as telas se navegam por dentro, pela barra do topo (Blog, Releases). O andaime troca
 * entre "Hoje" e "Proposta".
 *
 * 100% front-end: o conteúdo vem do `mocks.ts` desta pasta. Nada de rede.
 */
import Assinar from './_Assinar.vue'
import CascaDoDocs from './_CascaDoDocs.vue'
import Changelog from './_Changelog.vue'
import GuiaDeMigracao from './_GuiaDeMigracao.vue'
import HeroDaSecao from './_HeroDaSecao.vue'
import ListaDoBlog from './_ListaDoBlog.vue'
import PostDoMes from './_PostDoMes.vue'
import ReleasesHoje from './_ReleasesHoje.vue'
import { entradas, linkPermanente, mudancas, postsDaProposta, postsDeHoje } from './mocks'
import { textos } from './textos'
import { ancoraDaVersao } from './versoes'

import briefingMd from './BRIEFING.md?raw'
import decisoesMd from './DECISOES.md?raw'
import pesquisaMd from './PESQUISA.md?raw'

definePageMeta({
  titulo: 'Releases no docs',
  descricao: 'O changelog lido na própria trilha da aba Releases, com o que exige ação e o prazo, e o post mensal no Blog.',
  status: 'em-revisao',
  atualizado: '2026-11-24',
  tela: 'docs.enspace.io, abas Blog e Releases',
})

const t = useTextos(textos)
const idioma = useIdioma()
const toast = useToast()

/* ---------------- Andaime ---------------- */
const versao = ref<'hoje' | 'proposta'>('proposta')
const estado = ref<'cheio' | 'vazio' | 'carregando'>('cheio')
const estadosPossiveis = ['cheio', 'vazio', 'carregando'] as const

/* ---------------- Navegação por dentro ---------------- */
const secao = ref<'blog' | 'releases'>('releases')
const postAberto = ref<string | null>(null)
/** Id da versão (`v3-4-0`) ou do item a mostrar na trilha. Rodada 4: não há mais página da versão. */
const destaque = ref<string | null>(null)
const assinarAberto = ref(false)
/** Rodada 7: o guia de migração aberto (id da mudança), como página da doc. */
const guiaAberto = ref<string | null>(null)
const route = useRoute()
/** A seção do topo acesa: o guia mora em Docs ou em Dev. */
const secaoDaCasca = computed(() => (guiaAberto.value ? mudancas.find(m => m.id === guiaAberto.value)!.guia.secao : secao.value))

const post = computed(() => postsDaProposta.find(p => p.id === postAberto.value))

const topo = () => window.scrollTo({ top: 0, behavior: 'smooth' })

function irParaReleases() {
  versao.value = 'proposta'
  secao.value = 'releases'
  postAberto.value = null
  guiaAberto.value = null
}

function irSecao(s: 'blog' | 'releases') {
  secao.value = s
  postAberto.value = null
  guiaAberto.value = null
  topo()
}

/** Rodada 7: o link do guia, no item que exige ação, abre a página do guia na doc. */
function abrirGuia(id: string) {
  if (!mudancas.some(m => m.id === id)) return
  guiaAberto.value = id
  history.replaceState(null, '', `#guia-${id}`)
  topo()
}

/** O anterior e o próximo do guia (`UContentSurround`) navegam pela âncora `#guia-<id>`. */
watch(() => route.hash, (h) => {
  if (h.startsWith('#guia-')) abrirGuia(h.slice(6))
})

/** O link de um título do guia: o endereço vem pronto do guia. */
async function copiarEndereco(url: string, ancora: string) {
  history.replaceState(null, '', `#${ancora}`)
  try { await navigator.clipboard.writeText(url) }
  catch { /* sem permissão: o toast ainda mostra o endereço */ }
  toast.add({ title: t.value.entrada.linkCopiado, description: url, icon: 'i-lucide-link', color: 'success', duration: 3000 })
}

/** Leva à âncora na trilha: a versão (`v3-4-0`) ou o item (o id dele). */
async function irPara(id: string) {
  irParaReleases()
  history.replaceState(null, '', `#${id}`)
  destaque.value = null
  await nextTick()
  destaque.value = id
}

/** Do post do mês: o item, na trilha. */
function verEntrada(id: string) {
  irPara(id)
}

/** Rodada 5: sai a página Próximas mudanças. A mudança leva ao item que exige ação, na trilha. */
function verMudanca(id: string) {
  const e = entradas.find(x => x.mudanca === id)
  if (e) irPara(e.id)
}

function verPost(mes: string) {
  const p = postsDaProposta.find(x => x.mes === mes)
  if (!p) return
  secao.value = 'blog'
  postAberto.value = p.id
  topo()
}

function abrirPost(id: string) {
  if (versao.value === 'hoje') {
    toast.add({ title: t.value.blog.postForaDoPrototipo, icon: 'i-lucide-info', color: 'neutral', duration: 2500 })
    return
  }
  postAberto.value = id
  topo()
}

function verChangelog() {
  irParaReleases()
  topo()
}

/** O link de um título (versão, subtítulo ou item): copia o endereço e põe a âncora na barra do navegador. */
async function copiar(ancora: string) {
  const url = linkPermanente(idioma.value, ancora)
  history.replaceState(null, '', `#${ancora}`)
  try { await navigator.clipboard.writeText(url) }
  catch { /* sem permissão: o toast ainda mostra o endereço */ }
  toast.add({ title: t.value.entrada.linkCopiado, description: url, icon: 'i-lucide-link', color: 'success', duration: 3000 })
}

/** Quem chega pelo link permanente cai na versão ou no item, com o destaque aceso. */
onMounted(() => {
  const id = decodeURIComponent(location.hash.slice(1))
  // Trocar a vista durante a hidratação quebra a transição: o guia abre quando o Nuxt fica pronto.
  if (id.startsWith('guia-')) return onNuxtReady(() => abrirGuia(id.slice(5)))
  if (entradas.some(e => e.id === id || id === ancoraDaVersao(e.versao) || id.startsWith(`${ancoraDaVersao(e.versao)}-`))) irPara(id)
})

watch(versao, () => {
  postAberto.value = null
  guiaAberto.value = null
})

const hero = computed(() => {
  if (secao.value === 'blog') return { titulo: t.value.hero.blogTitulo, descricao: t.value.hero.blogDescricao }
  // Rodada 2: a proposta mantém o topo de hoje ("Versões do ENSPACE").
  return { titulo: t.value.hero.releasesHojeTitulo, descricao: t.value.hero.releasesHojeDescricao }
})

/** A chave da vista: muda a vista, a transição roda. */
const vista = computed(() => `${versao.value}-${secao.value}-${postAberto.value ?? 'lista'}-${guiaAberto.value ?? ''}`)
</script>

<template>
  <CascaDoDocs :t="t" :secao-ativa="secaoDaCasca" @secao="irSecao">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div :key="vista" class="overflow-x-clip pb-40">
        <!-- Rodada 7: GUIA DE MIGRAÇÃO, uma página da doc -->
        <GuiaDeMigracao
          v-if="guiaAberto"
          :id="guiaAberto"
          :t="t"
          @abrir="abrirGuia"
          @ir-para="irPara"
          @copiar="copiarEndereco"
        />

        <!-- POST MENSAL ABERTO (proposta) -->
        <PostDoMes
          v-else-if="secao === 'blog' && post"
          :t="t"
          :post="post"
          @voltar="postAberto = null"
          @ver-entrada="verEntrada"
          @ver-mudanca="verMudanca"
          @ver-changelog="verChangelog"
          @assinar="assinarAberto = true"
        />

        <!-- RELEASES: a mesma árvore do en-docs (UPage > hero > UPageBody > UContainer) -->
        <UPage v-else-if="secao === 'releases'" class="overflow-x-hidden">
          <HeroDaSecao :title="hero.titulo" :description="hero.descricao" />

          <UPageBody>
            <!-- hoje -->
            <ReleasesHoje v-if="versao === 'hoje'" :t="t" :estado="estado" />

            <!-- proposta: a linha do tempo de hoje, com o texto de cada versão -->
            <UContainer v-else>
              <Changelog
                :t="t"
                :estado="estado"
                :destaque="destaque"
                @copiar="copiar"
                @ver-post="verPost"
                @ir-para="irPara"
                @abrir-guia="abrirGuia"
                @assinar="assinarAberto = true"
              />
            </UContainer>
          </UPageBody>
        </UPage>

        <!-- BLOG (fica como está) -->
        <template v-else>
          <HeroDaSecao :title="hero.titulo" :description="hero.descricao" />

          <UPageBody>
            <ListaDoBlog
              :t="t"
              :modo="versao"
              :posts="versao === 'hoje' ? postsDeHoje : postsDaProposta"
              :estado="estado"
              @abrir="abrirPost"
            />
          </UPageBody>
        </template>
      </div>
    </Transition>

    <Assinar v-model:open="assinarAberto" :t="t" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <template #andaime>
      <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
        <div class="flex flex-wrap items-center gap-2 px-4 py-3">
          <span class="mr-1 text-xs font-semibold tracking-wider text-muted uppercase">{{ t.andaime.versao }}</span>
          <UButton
            v-for="v in (['hoje', 'proposta'] as const)"
            :key="v"
            :label="t.andaime[v]"
            size="xs"
            class="cursor-pointer transition-transform hover:-translate-y-0.5"
            :color="versao === v ? 'primary' : 'neutral'"
            :variant="versao === v ? 'solid' : 'subtle'"
            @click="versao = v"
          />

          <span class="mr-1 ml-3 text-xs font-semibold tracking-wider text-muted uppercase">{{ t.andaime.estado }}</span>
          <UButton
            v-for="e in estadosPossiveis"
            :key="e"
            :label="t.andaime.estados[e]"
            size="xs"
            class="cursor-pointer transition-transform hover:-translate-y-0.5"
            :color="estado === e ? 'primary' : 'neutral'"
            :variant="estado === e ? 'solid' : 'subtle'"
            @click="estado = e"
          />

          <ControlesDePrototipo class="ml-auto" />

          <span class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold tracking-wider text-muted uppercase">{{ t.andaime.porTras }}</span>
            <PainelDeContexto
              :briefing="briefingMd"
              :pesquisa="pesquisaMd"
              :decisoes="decisoesMd"
              repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/releases-no-docs"
            />
          </span>
        </div>
      </div>
    </template>
  </CascaDoDocs>
</template>
