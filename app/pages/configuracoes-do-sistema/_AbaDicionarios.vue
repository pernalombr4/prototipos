<script setup lang="ts">
import { toRaw } from 'vue'
import Secao from './_Secao.vue'
import {
  chavePorId,
  chavesDeTraducao,
  idiomas,
  sobrescritasDoCampo,
  sugestoesDeIa,
  totalDeChaves,
  type ChaveDeTraducao,
} from './mocks'
import {
  form,
  preenchidasNoTotal,
  traducoes,
  traduzir,
} from './estado'

const emit = defineEmits<{ irPara: [aba: string] }>()

const toast = useToast()

/* ------------------------------------------------------------------ *
 * A estrutura que esta tela precisa dizer em voz alta
 *
 * Dentro de uma categoria existem DOIS ramos, e eles são irmãos:
 *
 *   categoria › campo         o texto que o campo tem por definição
 *   categoria › formulário    o texto que o formulário escreve POR CIMA
 *
 * Traduzir o campo **não** traduz o formulário. Se o bloco daquele campo tem
 * instrução própria no formulário, ela continua em português até alguém
 * traduzir a chave do formulário.
 *
 * O desenho anterior mostrava os dois como se fossem o mesmo campo repetido
 * ("Formulários › Cliente › Número"), e isso induzia ao erro: a pessoa
 * traduzia o campo e parava, com a tela ainda em português. O que mudou:
 *
 *  - a árvore à esquerda mostra os dois ramos lado a lado, sempre visíveis;
 *  - a chave de formulário mostra o que o campo diz e oferece **copiar**,
 *    nunca herdar;
 *  - a chave de campo avisa quando existe texto escrito por cima dela;
 *  - o cabeçalho conta quantos textos já traduzidos no campo continuam
 *    aparecendo em português por causa disso.
 *
 * O volume continua sendo o outro problema (PESQUISA.md, rodada 5): 7,4 mil
 * chaves, nada de lista única, tudo em fatias de 50.
 * ------------------------------------------------------------------ */

const POR_PAGINA = 50
const CUSTO_POR_CHAVE = 0.2

/** Leitura sem rastrear: as contas varrem milhares de chaves de uma vez. */
const bruto = toRaw(traducoes)

/* ------------------------------ índices ----------------------------- */

interface Galho {
  label: string
  value: string
  icon?: string
  children?: Galho[]
}

const porNo = new Map<string, ChaveDeTraducao[]>()

function indexar(valor: string, chave: ChaveDeTraducao) {
  const lista = porNo.get(valor) ?? []
  lista.push(chave)
  porNo.set(valor, lista)
}

for (const chave of chavesDeTraducao) {
  indexar(chave.categoria, chave)
  indexar(`${chave.categoria}|${chave.grupo}`, chave)
  if (chave.formulario) indexar(`${chave.categoria}|Formulários|${chave.formulario}`, chave)
}

const categorias = [...new Set(chavesDeTraducao.map(c => c.categoria))]

const formulariosPorCategoria = new Map<string, string[]>()
for (const chave of chavesDeTraducao) {
  if (!chave.formulario) continue
  const lista = formulariosPorCategoria.get(chave.categoria) ?? []
  if (!lista.includes(chave.formulario)) lista.push(chave.formulario)
  formulariosPorCategoria.set(chave.categoria, lista)
}

/** Quanto falta em cada nó da árvore. Refaz quando alguma tradução muda. */
const faltamPorNo = computed(() => {
  void preenchidasNoTotal.value
  const mapa: Record<string, number> = {}
  for (const [valor, chaves] of porNo) {
    let pendentes = 0
    for (const chave of chaves) if (!bruto[chave.id]) pendentes++
    mapa[valor] = pendentes
  }
  return mapa
})

function faltamNoNo(valor: string) {
  return faltamPorNo.value[valor] ?? 0
}

function totalDoNo(valor: string) {
  return porNo.get(valor)?.length ?? 0
}

/* ------------------------------- a árvore ---------------------------- */

const arvore = computed<Galho[]>(() =>
  categorias.map((categoria) => {
    const filhos: Galho[] = []

    if (totalDoNo(`${categoria}|Geral`)) {
      filhos.push({ label: 'Geral', value: `${categoria}|Geral`, icon: 'i-lucide-tag' })
    }
    if (totalDoNo(`${categoria}|Campos`)) {
      filhos.push({ label: 'Campos', value: `${categoria}|Campos`, icon: 'i-lucide-list' })
    }

    const formularios = formulariosPorCategoria.get(categoria) ?? []
    if (formularios.length) {
      filhos.push({
        label: 'Formulários',
        value: `${categoria}|Formulários`,
        icon: 'i-lucide-file-text',
        children: formularios.map(nome => ({
          label: nome,
          value: `${categoria}|Formulários|${nome}`,
          icon: 'i-lucide-corner-down-right',
        })),
      })
    }

    return {
      label: categoria,
      value: categoria,
      children: filhos.length ? filhos : undefined,
    }
  }),
)

const noSelecionado = ref<Galho | undefined>()
const expandidos = ref<string[]>([])

/** O recorte vem da árvore, da busca ou do aviso de texto sobrescrito. */
const modo = ref<'arvore' | 'sobrescritas'>('arvore')

const busca = ref('')
const filtro = ref<'faltam' | 'traduzidas' | 'todas'>('faltam')
const pagina = ref(1)

const idiomaAtual = computed(() => idiomas.find(i => i.codigo === form.dicionarios.idioma))
const faltamNoTotal = computed(() => totalDeChaves - preenchidasNoTotal.value)

function porcento(parte: number, total: number) {
  return total ? Math.round((parte / total) * 100) : 0
}

/* ----------------- o problema que a tela precisa contar --------------- */

/**
 * Textos de formulário sem tradução cujo campo **já está** traduzido.
 * É o caso que faz a pessoa achar que terminou.
 */
const sobrescritasPendentes = computed(() => {
  void preenchidasNoTotal.value
  const lista: ChaveDeTraducao[] = []
  for (const [idDoCampo, sobrescritas] of sobrescritasDoCampo) {
    if (!bruto[idDoCampo]) continue
    for (const chave of sobrescritas) if (!bruto[chave.id]) lista.push(chave)
  }
  return lista
})

/* ------------------------------- o recorte ---------------------------- */

const universo = computed<ChaveDeTraducao[]>(() => {
  if (modo.value === 'sobrescritas') return sobrescritasPendentes.value
  if (noSelecionado.value) return porNo.get(noSelecionado.value.value) ?? []
  return busca.value.trim() ? chavesDeTraducao : []
})

const recorte = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return universo.value.filter((c) => {
    const preenchida = !!traducoes[c.id]
    if (filtro.value === 'faltam' && preenchida) return false
    if (filtro.value === 'traduzidas' && !preenchida) return false
    if (!termo) return true
    return (
      c.original.toLowerCase().includes(termo)
      || c.campo.toLowerCase().includes(termo)
      || (traducoes[c.id] ?? '').toLowerCase().includes(termo)
    )
  })
})

const visiveis = computed(() =>
  recorte.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA),
)

/**
 * As chaves de um mesmo campo andam juntas.
 *
 * Os seis textos de um campo vinham um embaixo do outro, cada um repetindo o
 * nome do campo e o aviso de sobrescrita: seis linhas iguais para dizer uma
 * coisa só. Agrupadas, o nome e o aviso aparecem uma vez, e a lista passa a
 * ter a forma do que ela é: um campo, os textos dele.
 */
interface GrupoDeChaves {
  id: string
  titulo: string
  chaves: ChaveDeTraducao[]
}

const visiveisAgrupadas = computed<GrupoDeChaves[]>(() => {
  const grupos: GrupoDeChaves[] = []
  for (const chave of visiveis.value) {
    const id = `${chave.grupo}|${chave.formulario ?? ''}|${chave.campo}`
    const titulo = chave.campo
      || (chave.grupo === 'Formulários' ? `Formulário ${chave.formulario}` : 'A categoria')
    const ultimo = grupos.at(-1)
    if (ultimo && ultimo.id === id) ultimo.chaves.push(chave)
    else grupos.push({ id, titulo, chaves: [chave] })
  }
  return grupos
})

/** Em quais formulários os textos deste campo foram reescritos. */
function formulariosQueSobrescrevem(grupo: GrupoDeChaves) {
  const nomes = new Set<string>()
  for (const chave of grupo.chaves) {
    for (const sobrescrita of sobrescritasDoCampo.get(chave.id) ?? []) {
      if (sobrescrita.formulario) nomes.add(sobrescrita.formulario)
    }
  }
  return [...nomes]
}

watch([noSelecionado, busca, filtro, modo], () => {
  pagina.value = 1
})

watch(noSelecionado, (no) => {
  if (no) modo.value = 'arvore'
})

/** O caminho do recorte aberto, para o cabeçalho da bancada. */
const caminho = computed(() => {
  if (modo.value === 'sobrescritas') return ['Textos de formulário sem tradução']
  if (noSelecionado.value) return noSelecionado.value.value.split('|')
  return busca.value.trim() ? ['Busca em todas as chaves'] : []
})

/** O recorte aberto é de formulário? É quando a regra precisa ser dita. */
const recorteDeFormulario = computed(() => {
  if (modo.value === 'sobrescritas') return true
  return noSelecionado.value?.value.includes('|Formulários') ?? false
})

function abrirNo(valor: string) {
  const categoria = valor.split('|')[0]!
  expandidos.value = [...new Set([...expandidos.value, categoria, `${categoria}|Formulários`])]
  noSelecionado.value = { label: valor.split('|').at(-1)!, value: valor }
  modo.value = 'arvore'
  busca.value = ''
}

/* ------------------- campo e formulário, lado a lado ------------------ */

/** O que a definição do campo diz para o mesmo texto que o formulário repete. */
function textoDoCampo(chave: ChaveDeTraducao) {
  if (!chave.espelhoNoCampo) return undefined
  const campo = chavePorId.get(chave.espelhoNoCampo)
  if (!campo) return undefined
  return { chave: campo, traducao: traducoes[campo.id] ?? '' }
}

/* ---------------------------- tradução por IA ------------------------- */

const traduzindo = ref<string | null>(null)
const confirmandoIa = ref(false)
const rodandoIa = ref(false)

const alvoDaIa = computed(() => {
  const base = universo.value.length ? recorte.value : chavesDeTraducao
  return base.filter(c => !traducoes[c.id])
})

const custoDaIa = computed(() => Math.ceil(alvoDaIa.value.length * CUSTO_POR_CHAVE))

async function traduzirUma(chave: ChaveDeTraducao) {
  traduzindo.value = chave.id
  await new Promise(r => setTimeout(r, 400))
  traduzindo.value = null
  const sugestao = sugestoesDeIa[chave.original]
  if (sugestao) traduzir(chave.id, sugestao)
}

async function rodarIaEmMassa() {
  rodandoIa.value = true
  const alvo = [...alvoDaIa.value]
  await new Promise(r => setTimeout(r, 1200))
  let feitas = 0
  for (const chave of alvo) {
    const sugestao = sugestoesDeIa[chave.original]
    if (sugestao) {
      traduzir(chave.id, sugestao)
      feitas++
    }
  }
  rodandoIa.value = false
  confirmandoIa.value = false
  toast.add({
    title: `${feitas.toLocaleString('pt-BR')} chaves traduzidas`,
    description: 'Nada foi gravado ainda: use Salvar, na barra de baixo.',
    icon: 'i-lucide-sparkles',
    color: 'neutral',
  })
}
</script>

<template>
  <div class="space-y-5">
    <!-- 1. O ESTADO DO DICIONÁRIO ------------------------------------- -->
    <Secao
      id="traducoes"
      titulo="Dicionários de tradução"
      resumo="Os textos que você criou (categorias, campos, formulários) no idioma de quem lê."
      style="animation: entrada .4s ease-out both"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted">Traduzir para</span>
          <!-- Segmentado de verdade, em vez de botões dentro de uma borda. -->
          <UFieldGroup size="sm">
            <UButton
              v-for="i in idiomas"
              :key="i.codigo"
              :color="form.dicionarios.idioma === i.codigo ? 'primary' : 'neutral'"
              :variant="form.dicionarios.idioma === i.codigo ? 'soft' : 'outline'"
              :aria-pressed="form.dicionarios.idioma === i.codigo"
              @click="form.dicionarios.idioma = i.codigo"
            >
              <span aria-hidden="true">{{ i.bandeira }}</span>
              {{ i.nome }}
            </UButton>
          </UFieldGroup>
        </div>

        <div class="min-w-64 flex-1 sm:max-w-sm">
          <div class="mb-1 flex items-baseline justify-between text-sm">
            <span class="text-muted">
              <strong class="text-highlighted">{{ preenchidasNoTotal.toLocaleString('pt-BR') }}</strong>
              de {{ totalDeChaves.toLocaleString('pt-BR') }} traduzidas
            </span>
            <span class="tabular-nums text-muted">{{ porcento(preenchidasNoTotal, totalDeChaves) }}%</span>
          </div>
          <UProgress :model-value="preenchidasNoTotal" :max="totalDeChaves" size="sm" />
        </div>
      </div>

      <!--
        O aviso que a tela não dava, e que é a razão desta rodada: campo
        traduzido não quer dizer tela traduzida.
      -->
      <UAlert
        v-if="sobrescritasPendentes.length"
        class="mt-5"
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        :title="`${sobrescritasPendentes.length.toLocaleString('pt-BR')} textos continuam em português mesmo com o campo traduzido`"
        description="São blocos de formulário com texto próprio. O formulário escreve por cima do campo, e cada um tem a sua tradução."
        :actions="[{
          label: 'Ver estes textos',
          color: 'neutral',
          variant: 'subtle',
          onClick: () => { modo = 'sobrescritas'; noSelecionado = undefined; filtro = 'faltam'; busca = '' },
        }]"
      />

      <div class="mt-5 flex flex-wrap items-center gap-2">
        <UButton
          label="Traduzir com IA"
          icon="i-lucide-sparkles"
          size="sm"
          color="neutral"
          variant="subtle"
          :disabled="!alvoDaIa.length"
          class="transition-transform hover:-translate-y-0.5"
          @click="confirmandoIa = true"
        />
        <div class="ml-auto flex gap-2">
          <UButton label="Exportar planilha" icon="i-lucide-download" size="sm" color="neutral" variant="ghost" />
          <UButton label="Importar" icon="i-lucide-upload" size="sm" color="neutral" variant="ghost" />
        </div>
      </div>

      <template #rodape>
        <p class="text-xs text-muted">
          Este workspace tem {{ totalDeChaves.toLocaleString('pt-BR') }} chaves. Por isso a tela abre
          na estrutura e não numa lista: nenhuma ferramenta de tradução mostra o conjunto inteiro de
          uma vez.
        </p>
      </template>
    </Secao>

    <!-- 2. A BANCADA --------------------------------------------------- -->
    <Secao
      id="categorias"
      titulo="Onde traduzir"
      resumo="Cada categoria tem dois ramos irmãos: os campos e os formulários. São textos diferentes."
      style="animation: entrada .4s ease-out both; animation-delay: 60ms"
    >
      <div class="grid gap-6 @4xl:grid-cols-[17rem_minmax(0,1fr)]">
        <!-- a estrutura, sempre à vista -->
        <aside class="min-w-0">
          <UInput
            v-model="busca"
            icon="i-lucide-search"
            placeholder="Buscar em todas as chaves"
            size="sm"
            class="mb-3 w-full"
          />

          <p class="mb-1.5 flex items-center justify-between text-xs uppercase tracking-wider text-muted">
            <span>Estrutura</span>
            <span>a traduzir</span>
          </p>

          <div class="max-h-[30rem] overflow-y-auto pe-1">
            <UTree
              v-model="noSelecionado"
              v-model:expanded="expandidos"
              :items="arvore"
              :get-key="(i: Galho) => i.value"
              size="sm"
            >
              <template #item-trailing="{ item }">
                <span
                  class="ms-auto shrink-0 text-[11px] tabular-nums"
                  :class="faltamNoNo((item as Galho).value)
                    ? 'text-muted'
                    : 'text-success-700 dark:text-success-300'"
                >
                  {{ faltamNoNo((item as Galho).value)
                    ? faltamNoNo((item as Galho).value).toLocaleString('pt-BR')
                    : 'ok' }}
                </span>
              </template>
            </UTree>
          </div>
        </aside>

        <!-- o trabalho -->
        <div class="min-w-0">
          <UEmpty
            v-if="!universo.length"
            icon="i-lucide-list-tree"
            title="Escolha por onde começar"
            :description="`Abra uma categoria ao lado, ou busque pelo texto. São ${totalDeChaves.toLocaleString('pt-BR')} chaves: elas não cabem numa lista só.`"
            class="py-12"
          />

          <template v-else>
            <UBreadcrumb
              v-if="caminho.length"
              :items="caminho.map(p => ({ label: p }))"
              class="mb-3"
            />

            <!-- a regra do ramo, dita na hora em que ela importa -->
            <UAlert
              v-if="recorteDeFormulario"
              class="mb-4"
              color="neutral"
              variant="subtle"
              icon="i-lucide-info"
              title="Estes textos são do formulário, não dos campos"
              description="O formulário escreve por cima do campo. Traduzir o campo não traduz aqui, e o que você escrever aqui vale só dentro deste formulário."
            />

            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <UFieldGroup size="xs">
                <UButton
                  v-for="f in [
                    { valor: 'faltam', rotulo: 'A traduzir' },
                    { valor: 'traduzidas', rotulo: 'Traduzidas' },
                    { valor: 'todas', rotulo: 'Todas' },
                  ]"
                  :key="f.valor"
                  :label="f.rotulo"
                  :color="filtro === f.valor ? 'primary' : 'neutral'"
                  :variant="filtro === f.valor ? 'soft' : 'outline'"
                  :aria-pressed="filtro === f.valor"
                  @click="filtro = f.valor as typeof filtro.value"
                />
              </UFieldGroup>

            </div>

            <p v-if="recorte.length" class="mb-3 text-sm text-muted">
              Mostrando {{ ((pagina - 1) * POR_PAGINA + 1).toLocaleString('pt-BR') }}
              a {{ Math.min(pagina * POR_PAGINA, recorte.length).toLocaleString('pt-BR') }}
              de {{ recorte.length.toLocaleString('pt-BR') }} chaves.
            </p>

            <ul v-if="recorte.length" class="divide-y divide-default">
              <li v-for="grupo in visiveisAgrupadas" :key="grupo.id" class="py-5 first:pt-0">
                <!-- o campo, uma vez, com o que a tela precisa dizer sobre ele -->
                <div class="mb-3">
                  <h3 class="flex flex-wrap items-center gap-2 text-sm font-medium text-highlighted">
                    {{ grupo.titulo }}
                    <!-- de qual dos dois ramos este texto é -->
                    <UBadge
                      v-if="grupo.chaves[0]!.grupo === 'Campos'"
                      label="campo"
                      size="sm"
                      color="neutral"
                      variant="subtle"
                    />
                    <UBadge
                      v-else-if="grupo.chaves[0]!.grupo === 'Formulários' && grupo.chaves[0]!.campo"
                      :label="`bloco no formulário ${grupo.chaves[0]!.formulario}`"
                      size="sm"
                      color="primary"
                      variant="subtle"
                    />
                  </h3>

                  <p
                    v-if="formulariosQueSobrescrevem(grupo).length"
                    class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted"
                  >
                    <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />
                    <span>
                      Este campo também tem texto próprio em
                      {{ formulariosQueSobrescrevem(grupo).join(', ') }}, com tradução separada.
                    </span>
                    <UButton
                      v-for="nome in formulariosQueSobrescrevem(grupo)"
                      :key="nome"
                      :label="`Abrir ${nome}`"
                      size="xs"
                      variant="link"
                      class="p-0"
                      @click="abrirNo(`${grupo.chaves[0]!.categoria}|Formulários|${nome}`)"
                    />
                  </p>
                </div>

                <ul class="space-y-3">
                  <li
                    v-for="chave in grupo.chaves"
                    :key="chave.id"
                    class="grid gap-x-4 gap-y-1 @2xl:grid-cols-[6.5rem_minmax(0,1fr)]"
                  >
                    <span class="pt-1.5 text-xs uppercase tracking-wider text-muted">
                      {{ chave.tipo }}
                    </span>

                    <div class="min-w-0">
                      <p class="mb-1 truncate text-sm text-toned" :title="chave.original">
                        {{ chave.original }}
                      </p>

                      <div class="flex items-center gap-2">
                        <UInput
                          :model-value="traducoes[chave.id]"
                          :placeholder="`Escreva em ${idiomaAtual?.nome}`"
                          :aria-label="`Tradução de ${chave.original}`"
                          size="sm"
                          class="w-full"
                          @update:model-value="(v: string | number) => traduzir(chave.id, String(v))"
                        />
                        <UTooltip text="Sugerir tradução com IA">
                          <UButton
                            icon="i-lucide-sparkles"
                            size="xs"
                            color="neutral"
                            variant="ghost"
                            :loading="traduzindo === chave.id"
                            :aria-label="`Sugerir tradução para ${chave.original}`"
                            @click="traduzirUma(chave)"
                          />
                        </UTooltip>
                      </div>

                      <!-- o que o campo diz, quando a chave é do formulário -->
                      <p
                        v-if="textoDoCampo(chave)"
                        class="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted"
                      >
                        <template v-if="textoDoCampo(chave)!.traducao">
                          <span class="truncate">
                            No campo:
                            <span class="text-toned">{{ textoDoCampo(chave)!.traducao }}</span>
                          </span>
                        </template>
                        <span v-else>No campo, este texto também está sem tradução.</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>

            <UEmpty
              v-else
              :icon="filtro === 'faltam' ? 'i-lucide-party-popper' : 'i-lucide-search-x'"
              :title="filtro === 'faltam' ? 'Tudo traduzido aqui' : 'Nenhuma chave neste recorte'"
              :description="filtro === 'faltam'
                ? `Todo este recorte já tem texto em ${idiomaAtual?.nome}.`
                : 'Tente outro termo ou outro status.'"
              class="py-10"
            />

            <div v-if="recorte.length > POR_PAGINA" class="mt-5 flex justify-center">
              <UPagination
                v-model:page="pagina"
                :total="recorte.length"
                :items-per-page="POR_PAGINA"
                :sibling-count="1"
              />
            </div>
          </template>
        </div>
      </div>
    </Secao>

    <!-- IA em massa: o custo antes do clique --------------------------- -->
    <UModal v-model:open="confirmandoIa" title="Traduzir com inteligência artificial">
      <template #body>
        <p class="text-sm text-muted">
          A IA vai traduzir
          <strong class="text-highlighted">{{ alvoDaIa.length.toLocaleString('pt-BR') }} chaves</strong>
          que faltam
          <template v-if="universo.length">neste recorte</template>
          <template v-else>no workspace inteiro</template>, para {{ idiomaAtual?.nome }}.
        </p>

        <div class="mt-4 rounded-lg bg-elevated/60 px-3 py-2.5">
          <p class="text-sm text-muted">
            Custo estimado:
            <strong class="text-highlighted">{{ custoDaIa.toLocaleString('pt-BR') }} en-credits</strong>.
            <button
              type="button"
              class="text-primary-700 underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:text-primary-300"
              @click="emit('irPara', 'cobranca')"
            >Ver o saldo</button>
          </p>
        </div>

        <UAlert
          class="mt-4"
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Revise depois"
          description="Tradução automática erra em termo do seu negócio. Nada é gravado até você usar o Salvar da barra de baixo."
        />
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancelar" color="neutral" variant="ghost" @click="confirmandoIa = false" />
          <UButton
            :label="`Traduzir ${alvoDaIa.length.toLocaleString('pt-BR')} chaves`"
            :loading="rodandoIa"
            @click="rodarIaEmMassa"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
