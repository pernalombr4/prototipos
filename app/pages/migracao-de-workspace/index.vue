<script setup lang="ts">
import CascaDoEnspace from './_CascaDoEnspace.vue'
import ImportarWorkspace from './_ImportarWorkspace.vue'
import { textos } from './textos'
import { estruturaAtual, estruturaDoArquivo, estruturaVazia, workspaceAtual, type Estrutura } from './mocks'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Migração de Workspace',
  descricao: 'Importar a estrutura de outro workspace sem duplicar: arrastar o arquivo, escolher entre adicionar, somar ou substituir e ver o que muda em estrutura, nunca em JSON.',
  status: 'em-revisao',
  atualizado: '2026-10-01',
  tela: 'Configurações › Interface › Casos de Uso',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * A tela, como é hoje. O que muda é o que o botão Importar abre.
 * ------------------------------------------------------------------ */

const exportando = ref(false)
async function exportar() {
  exportando.value = true
  await new Promise(r => setTimeout(r, 900))
  exportando.value = false
  toast.add({ title: t.value.exportadoTitulo, description: t.value.exportadoTexto, icon: 'i-lucide-download', color: 'success' })
}

const importando = ref(false)

/* ------------------------------------------------------------------ *
 * Andaime: os cenários que o protótipo precisa mostrar.
 * ------------------------------------------------------------------ */

type Cenario = 'com-conteudo' | 'vazio' | 'igual'
const cenario = ref<Cenario>('com-conteudo')
const cenarios: { valor: Cenario, rotulo: string }[] = [
  { valor: 'com-conteudo', rotulo: 'Workspace com conteúdo' },
  { valor: 'vazio', rotulo: 'Workspace vazio' },
  { valor: 'igual', rotulo: 'Já igual ao arquivo' },
]

const atual = computed<Estrutura>(() => {
  if (cenario.value === 'vazio') return estruturaVazia
  if (cenario.value === 'igual') return { ...estruturaDoArquivo, workspace: workspaceAtual.nome, exportadoEm: undefined }
  return estruturaAtual
})

const final = ref<'sucesso' | 'falha'>('sucesso')
</script>

<template>
  <CascaDoEnspace :t="t" :workspace="workspaceAtual.nome" :slug="workspaceAtual.slug">
    <div class="min-h-0 flex-1 overflow-y-auto pb-28">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
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

        <!-- Migração de Workspace -->
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
            <!-- Exportar: não muda -->
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

            <!-- O ícone do meio, como no develop -->
            <span
              class="absolute left-1/2 top-1/2 hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-default bg-default text-muted sm:flex"
              aria-hidden="true"
            >
              <UIcon name="i-lucide-file-json" class="size-5" />
            </span>

            <!-- Importar: o texto muda, o botão continua no mesmo lugar -->
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
                class="mx-auto transition-transform hover:-translate-y-0.5"
                @click="importando = true"
              />
            </section>
          </div>
        </UCard>

        <!-- Era "Atenção: categorias já cadastradas serão duplicadas". A proposta tira o motivo do aviso. -->
        <UAlert
          class="mt-6"
          :title="t.avisoTitulo"
          :description="t.avisoTexto"
          color="info"
          variant="subtle"
          icon="i-lucide-shield-check"
        />
      </div>
    </div>

    <ImportarWorkspace v-model:open="importando" :t="t" :atual="atual" :final="final" />

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

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Importação</span>
        <UButton
          v-for="f in [{ valor: 'sucesso', rotulo: 'Termina bem' }, { valor: 'falha', rotulo: 'Falha no meio' }] as const"
          :key="f.valor"
          :label="f.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="final === f.valor ? 'primary' : 'neutral'"
          :variant="final === f.valor ? 'solid' : 'subtle'"
          @click="final = f.valor"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/migracao-de-workspace"
          />
        </span>
      </div>
    </div>
  </CascaDoEnspace>
</template>
