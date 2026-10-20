<script setup lang="ts">
import CascaDoEnspace from './_CascaDoEnspace.vue'
import GaleriaDeCasos from './_GaleriaDeCasos.vue'
import UsarCaso from './_UsarCaso.vue'
import CriarCaso from './_CriarCaso.vue'
import { textos } from './textos'
import { casosDeUso, umCaso, workspaceAtual, type CasoDeUso } from './mocks'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Galeria de casos de uso',
  descricao: 'Os casos de uso de Configurações > Interface > Casos de Uso numa vitrine com destaques, filtros, áreas, busca e detalhe, abaixo da Migração de Workspace, que não muda. Criar um caso a partir do workspace e escolher se ele fica só no workspace ou na galeria do ENSPACE.',
  status: 'em-revisao',
  atualizado: '2026-10-20',
  tela: 'Configurações › Interface › Casos de Uso',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * A parte de cima, como é hoje. Nada aqui é proposta.
 * ------------------------------------------------------------------ */

const exportando = ref(false)
async function exportar() {
  exportando.value = true
  await new Promise(r => setTimeout(r, 900))
  exportando.value = false
  toast.add({ title: t.value.exportadoTitulo, description: t.value.exportadoTexto, icon: 'i-lucide-download', color: 'success' })
}

/* ------------------------------------------------------------------ *
 * A galeria. O "Usar caso de uso" abre a confirmação.
 * ------------------------------------------------------------------ */

const usando = ref<CasoDeUso | null>(null)

/* Rodada 3: criar caso de uso a partir do workspace. */
const fonte = ref<'destaques' | 'workspace' | 'enspace'>('destaques')
const criando = ref(false)
const criados = ref<CasoDeUso[]>([])

function criado(caso: CasoDeUso) {
  criados.value = [caso, ...criados.value]
  fonte.value = 'workspace'
  toast.add({
    title: caso.publicado ? t.value.casoPublicado(caso.nome) : t.value.casoSalvo(caso.nome),
    description: caso.publicado ? t.value.casoPublicadoTexto : t.value.casoSalvoTexto,
    icon: caso.publicado ? 'i-lucide-globe' : 'i-lucide-package-plus',
    color: 'success',
  })
}

function usado(caso: CasoDeUso) {
  usando.value = null
  toast.add({ title: t.value.usadoTitulo(caso.nome), description: t.value.usadoTexto, icon: 'i-lucide-circle-check', color: 'success' })
}

/* ------------------------------------------------------------------ *
 * Andaime: os cenários que o protótipo precisa mostrar.
 * ------------------------------------------------------------------ */

type Cenario = 'cheio' | 'hoje' | 'carregando' | 'erro' | 'sem-permissao'
const cenario = ref<Cenario>('cheio')
const cenarios: { valor: Cenario, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Catálogo cheio' },
  { valor: 'hoje', rotulo: '1 caso, como hoje' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'sem-permissao', rotulo: 'Sem permissão' },
]

const casos = computed(() => (cenario.value === 'hoje' ? umCaso : [...criados.value, ...casosDeUso]))
const estado = computed(() => (cenario.value === 'carregando' ? 'carregando' : cenario.value === 'erro' ? 'erro' : 'pronto'))

async function tentarDeNovo() {
  cenario.value = 'carregando'
  await new Promise(r => setTimeout(r, 1200))
  cenario.value = 'cheio'
}
</script>

<template>
  <CascaDoEnspace :t="t" :workspace="workspaceAtual.nome" :slug="workspaceAtual.slug">
    <div class="min-h-0 flex-1 overflow-y-auto pb-28">
      <div class="px-3 py-8 sm:px-3">
        <div class="mx-auto max-w-3xl px-1">
          <!-- Cabeçalho: cópia do develop. O logo é texto no protótipo. -->
          <header class="text-center">
            <p class="text-6xl font-black tracking-tight text-primary" aria-hidden="true">
              EN
            </p>
            <h1 class="mt-4 text-2xl font-semibold text-highlighted">
              {{ t.titulo }}
            </h1>
            <p class="mx-auto mt-2 max-w-3xl text-sm text-muted">
              {{ t.subtitulo }}
            </p>
          </header>

          <!-- Migração de Workspace: cópia do develop, não muda -->
          <UCard class="mt-8" :ui="{ header: 'py-3', body: 'p-0 sm:p-0' }">
            <template #header>
              <div class="flex items-center gap-3">
                <span class="flex size-9 items-center justify-center rounded-md bg-elevated text-toned">
                  <UIcon name="i-lucide-folder-sync" class="size-5" />
                </span>
                <div>
                  <p class="text-sm font-medium text-highlighted">
                    {{ t.migracaoTitulo }}
                  </p>
                  <p class="text-sm text-muted">
                    {{ t.migracaoDescricao }}
                  </p>
                </div>
              </div>
            </template>

            <div class="relative grid sm:grid-cols-2">
              <section class="flex flex-col gap-4 p-5 sm:pr-10">
                <div class="flex items-center gap-3">
                  <span class="flex size-9 items-center justify-center rounded-md bg-elevated text-toned">
                    <UIcon name="i-lucide-download" class="size-5" />
                  </span>
                  <div>
                    <p class="text-sm font-medium text-highlighted">
                      {{ t.exportarTitulo }}
                    </p>
                    <p class="text-sm text-muted">
                      {{ t.exportarSub }}
                    </p>
                  </div>
                </div>
                <p class="flex-1 text-center text-sm text-muted">
                  {{ t.exportarTexto }}
                </p>
                <UButton
                  :label="t.exportarBotao"
                  icon="i-lucide-download"
                  variant="outline"
                  class="mx-auto"
                  :loading="exportando"
                  @click="exportar"
                />
              </section>

              <span
                class="absolute left-1/2 top-1/2 hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-default bg-default text-muted sm:flex"
                aria-hidden="true"
              >
                <UIcon name="i-lucide-file-json" class="size-5" />
              </span>

              <section class="flex flex-col gap-4 border-t border-default p-5 sm:border-l sm:border-t-0 sm:pl-10">
                <div class="flex items-center gap-3">
                  <span class="flex size-9 items-center justify-center rounded-md bg-elevated text-toned">
                    <UIcon name="i-lucide-upload" class="size-5" />
                  </span>
                  <div>
                    <p class="text-sm font-medium text-highlighted">
                      {{ t.importarTitulo }}
                    </p>
                    <p class="text-sm text-muted">
                      {{ t.importarSub }}
                    </p>
                  </div>
                </div>
                <p class="flex-1 text-center text-sm text-muted">
                  {{ t.importarTexto }}
                </p>
                <UButton
                  :label="t.importarBotao"
                  icon="i-lucide-upload"
                  variant="outline"
                  class="mx-auto"
                />
              </section>
            </div>
          </UCard>

          <!-- Atenção: cópia do develop, não muda -->
          <div class="mt-6 rounded-lg border border-warning/40 bg-warning/5 px-4 py-3 text-center text-sm text-warning-600 dark:text-warning-400">
            <p class="flex items-center justify-center gap-1.5 font-medium">
              <UIcon name="i-lucide-triangle-alert" class="size-4" />
              {{ t.avisoTitulo }}
            </p>
            <p class="mt-1">
              {{ t.avisoTexto }}
            </p>
          </div>
        </div>

        <!-- ═══════════ A PROPOSTA: a galeria, no lugar do bloco "General" ═══════════ -->
        <div class="mt-9">
          <GaleriaDeCasos
            v-model:fonte="fonte"
            :t="t"
            :casos="casos"
            :estado="estado"
            :pode-usar="cenario !== 'sem-permissao'"
            @usar="usando = $event"
            @criar="criando = true"
            @tentar-de-novo="tentarDeNovo"
          />
        </div>
      </div>
    </div>

    <UsarCaso :t="t" :caso="usando" @fechar="usando = null" @usado="usado" />
    <CriarCaso v-model:open="criando" :t="t" @criado="criado" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Protótipo · cenário
        </span>
        <UButton
          v-for="c in cenarios"
          :key="c.valor"
          :label="c.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="cenario === c.valor ? 'primary' : 'neutral'"
          :variant="cenario === c.valor ? 'solid' : 'subtle'"
          @click="cenario = c.valor"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/galeria-de-casos-de-uso"
          />
        </span>
      </div>
    </div>
  </CascaDoEnspace>
</template>
