<script setup lang="ts">
/**
 * A comunicação das releases no docs.enspace.io: abas Blog e Releases.
 *
 * A demanda: com deploy contínuo, o número da versão deixa de marcar o lançamento. A aba Releases
 * vira changelog por item, o Blog fica com o post mensal, e uma página "Próximas mudanças" reúne o
 * que exige ação do cliente, com prazo. Feed RSS e inscrição por e-mail entram só como interface.
 * Proposta da pesquisa de mercado de 2026-11-24 (deploy contínuo e lançamento), seção 5.
 *
 * Uma porta só: as 3 telas se navegam por dentro, pela barra do topo (Blog, Releases) e pelas abas
 * da aba Releases (Changelog, Próximas mudanças). O andaime troca entre "Hoje" e "Proposta".
 *
 * 100% front-end: o conteúdo vem do `mocks.ts` desta pasta. Nada de rede.
 */
import Assinar from './_Assinar.vue'
import CascaDoDocs from './_CascaDoDocs.vue'
import Changelog from './_Changelog.vue'
import HeroDaSecao from './_HeroDaSecao.vue'
import ListaDoBlog from './_ListaDoBlog.vue'
import PostDoMes from './_PostDoMes.vue'
import ProximasMudancas from './_ProximasMudancas.vue'
import ReleasesHoje from './_ReleasesHoje.vue'
import { entradas, linkPermanente, postsDaProposta, postsDeHoje } from './mocks'
import { textos } from './textos'
import { ancoraDaVersao } from './versoes'

import briefingMd from './BRIEFING.md?raw'
import decisoesMd from './DECISOES.md?raw'
import pesquisaMd from './PESQUISA.md?raw'

definePageMeta({
  titulo: 'Releases no docs',
  descricao: 'Changelog por item na aba Releases, post mensal no Blog e a página Próximas mudanças, com o que exige ação e o prazo.',
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
const aba = ref<'changelog' | 'proximas'>('changelog')
const postAberto = ref<string | null>(null)
/** Id da versão (`v3-4-0`) ou do item a mostrar na trilha. Rodada 4: não há mais página da versão. */
const destaque = ref<string | null>(null)
const destaqueMudanca = ref<string | null>(null)
const assinarAberto = ref(false)

const post = computed(() => postsDaProposta.find(p => p.id === postAberto.value))

const topo = () => window.scrollTo({ top: 0, behavior: 'smooth' })

function irParaReleases(a: 'changelog' | 'proximas') {
  versao.value = 'proposta'
  secao.value = 'releases'
  postAberto.value = null
  aba.value = a
}

/** Rodada 2: Changelog e Próximas mudanças trocam por link discreto acima da lista, sem abas. */
function irAba(a: 'changelog' | 'proximas') {
  irParaReleases(a)
  topo()
}

function irSecao(s: 'blog' | 'releases') {
  secao.value = s
  postAberto.value = null
  topo()
}

/** Leva à âncora na trilha: a versão (`v3-4-0`) ou o item (o id dele). */
async function irPara(id: string) {
  irParaReleases('changelog')
  history.replaceState(null, '', `#${id}`)
  destaque.value = null
  await nextTick()
  destaque.value = id
}

/** Do post do mês e de Próximas mudanças: o item, na trilha. */
function verEntrada(id: string) {
  irPara(id)
}

async function verMudanca(id: string) {
  irParaReleases('proximas')
  destaqueMudanca.value = null
  await nextTick()
  destaqueMudanca.value = id
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
  irAba('changelog')
}

/** O link permanente da versão: copia o endereço e põe a âncora na barra do navegador. */
async function copiar(v: string) {
  const url = linkPermanente(idioma.value, v)
  history.replaceState(null, '', `#${ancoraDaVersao(v)}`)
  try { await navigator.clipboard.writeText(url) }
  catch { /* sem permissão: o toast ainda mostra o endereço */ }
  toast.add({ title: t.value.entrada.linkCopiado, description: url, icon: 'i-lucide-link', color: 'success', duration: 3000 })
}

/** Quem chega pelo link permanente cai na versão ou no item, com o destaque aceso. */
onMounted(() => {
  const id = decodeURIComponent(location.hash.slice(1))
  if (entradas.some(e => e.id === id || ancoraDaVersao(e.versao) === id)) irPara(id)
})

watch(versao, () => {
  postAberto.value = null
  aba.value = 'changelog'
})

const hero = computed(() => {
  if (secao.value === 'blog') return { titulo: t.value.hero.blogTitulo, descricao: t.value.hero.blogDescricao }
  // Rodada 3: em Próximas mudanças, o título da página vai no hero, em vez de um 2º título abaixo dele.
  if (versao.value === 'proposta' && aba.value === 'proximas') return { titulo: t.value.proximas.titulo, descricao: t.value.proximas.descricao }
  // Rodada 2: a proposta mantém o topo de hoje ("Versões do ENSPACE").
  return { titulo: t.value.hero.releasesHojeTitulo, descricao: t.value.hero.releasesHojeDescricao }
})

/** A chave da vista: muda a vista, a transição roda. */
const vista = computed(() => `${versao.value}-${secao.value}-${postAberto.value ?? 'lista'}-${aba.value}`)
</script>

<template>
  <CascaDoDocs :t="t" :secao-ativa="secao" @secao="irSecao">
    <Transition
      mode="out-in"
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div :key="vista" class="overflow-x-clip pb-40">
        <!-- POST MENSAL ABERTO (proposta) -->
        <PostDoMes
          v-if="secao === 'blog' && post"
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

            <!-- proposta: a linha do tempo de hoje com rótulos e filtros, e Próximas mudanças -->
            <UContainer v-else>
              <Changelog
                v-if="aba === 'changelog'"
                :t="t"
                :estado="estado"
                :destaque="destaque"
                @copiar="copiar"
                @ver-mudanca="verMudanca"
                @ver-post="verPost"
                @ir-proximas="irAba('proximas')"
                @assinar="assinarAberto = true"
              />
              <ProximasMudancas
                v-else
                :t="t"
                :estado="estado"
                :destaque="destaqueMudanca"
                @ver-entrada="verEntrada"
                @voltar="irAba('changelog')"
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
