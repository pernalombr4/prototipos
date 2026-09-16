<script setup lang="ts">
import Secao from './_Secao.vue'
import LinhaDeAjuste from './_LinhaDeAjuste.vue'
import { comportamento, modulos, documentacao, identidade } from './mocks'
import { form } from './estado'

const emit = defineEmits<{ irPara: [aba: string] }>()

const toast = useToast()

/* --------------------------- identidade --------------------------- */

const idiomas = [
  { label: 'Português (Brasil)', value: 'pt-BR' },
  { label: 'Inglês', value: 'en' },
  { label: 'Espanhol', value: 'es' },
]

const LIMITE_DESCRICAO = 280

const marcas = [
  { valor: 'icone' as const, rotulo: 'Ícone', ajuda: 'Um ícone da biblioteca, com a cor do tema.' },
  { valor: 'imagem' as const, rotulo: 'Imagem', ajuda: 'Um arquivo PNG, JPG ou GIF sem animação.' },
]

/** O idioma usa a mesma linha das chaves de ligar/desligar, com outro controle. */
const ajusteDeIdioma = {
  chave: 'idioma_padrao',
  rotulo: 'Idioma padrão',
  descricao: 'Idioma dos termos nativos da interface.',
  detalhe:
    'Trocar aqui não mexe no que você criou. Nomes de categorias, campos, formulários e textos de ajuda se traduzem em Dicionários, um idioma por vez.',
  valor: true,
}

/* ------------------------- zona de perigo ------------------------- */

const confirmandoExclusao = ref(false)
const referenciaDigitada = ref('')
const excluindo = ref(false)

const podeExcluir = computed(() => referenciaDigitada.value.trim() === identidade.reference)

const oQueSePerde = [
  { icone: 'i-lucide-file-text', texto: '1.842 itens, documentos e arquivos' },
  { icone: 'i-lucide-users', texto: '34 membros perdem o acesso' },
  { icone: 'i-lucide-workflow', texto: '12 fluxos de trabalho e 9 formulários' },
  { icone: 'i-lucide-languages', texto: '96 chaves de tradução já preenchidas' },
]

async function excluir() {
  excluindo.value = true
  await new Promise(r => setTimeout(r, 900))
  excluindo.value = false
  confirmandoExclusao.value = false
  referenciaDigitada.value = ''
  toast.add({
    title: 'Nada foi excluído',
    description: 'Isto é um protótipo: a confirmação existe para mostrar o caminho, não para apagar.',
    icon: 'i-lucide-shield-check',
    color: 'neutral',
  })
}
</script>

<template>
  <div class="space-y-5">
    <!-- 1. IDENTIDADE ------------------------------------------------ -->
    <Secao
      id="identidade"
      titulo="Identidade"
      resumo="Como este workspace se chama e se reconhece nas telas e nos e-mails."
      :doc="documentacao.basicas"
      style="animation: entrada .4s ease-out both; animation-delay: 0ms"
    >
      <!--
        Identidade em forma de perfil: o logo colado ao nome, e a referência
        logo abaixo dele. É como Slack ("Name, domain, and icon"), Linear
        ("workspace logo, name and URL") e Notion (General: Name, Icon, Domain)
        agrupam a mesma coisa. Ver PESQUISA.md, "Identidade como perfil".
      -->
      <div class="grid gap-5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <UFormField label="Logo" class="shrink-0">
            <UPopover :content="{ side: 'bottom', align: 'start' }">
              <button
                type="button"
                aria-label="Alterar o logo do workspace"
                class="group relative flex size-16 items-center justify-center rounded-xl border border-default bg-elevated transition-all hover:-translate-y-0.5 hover:border-accented focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <UIcon
                  v-if="form.identidade.tipoDeMarca === 'icone'"
                  :name="form.identidade.icon || 'lucide:box'"
                  class="size-7 text-primary"
                />
                <UIcon v-else name="i-lucide-image" class="size-7 text-muted" />

                <span
                  class="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border border-default bg-default text-muted transition-colors group-hover:text-highlighted"
                >
                  <UIcon name="i-lucide-pencil" class="size-3.5" />
                </span>
              </button>

              <template #content>
                <div class="w-64 p-3">
                  <p class="text-sm font-medium text-highlighted">Logo do workspace</p>
                  <p class="mt-1 text-sm text-muted">
                    O símbolo que identifica este workspace na barra lateral.
                  </p>

                  <div class="mt-3 flex rounded-lg border border-default p-0.5">
                    <button
                      v-for="m in marcas"
                      :key="m.valor"
                      type="button"
                      class="flex-1 rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      :class="form.identidade.tipoDeMarca === m.valor
                        ? 'bg-primary text-inverted'
                        : 'text-muted hover:bg-elevated hover:text-highlighted'"
                      :aria-pressed="form.identidade.tipoDeMarca === m.valor"
                      @click="form.identidade.tipoDeMarca = m.valor"
                    >
                      {{ m.rotulo }}
                    </button>
                  </div>

                  <p class="mt-2 text-xs text-muted">
                    {{ marcas.find(m => m.valor === form.identidade.tipoDeMarca)?.ajuda }}
                  </p>

                  <UButton
                    :label="form.identidade.tipoDeMarca === 'icone' ? 'Escolher ícone' : 'Enviar imagem'"
                    :icon="form.identidade.tipoDeMarca === 'icone' ? 'i-lucide-shapes' : 'i-lucide-upload'"
                    size="sm"
                    color="neutral"
                    variant="subtle"
                    block
                    class="mt-3"
                  />
                </div>
              </template>
            </UPopover>
          </UFormField>

          <div class="grid flex-1 gap-4">
            <UFormField label="Nome" help="Aparece no topo da tela e nos e-mails enviados pelo workspace.">
              <UInput v-model="form.identidade.name" class="w-full sm:max-w-md" />
            </UFormField>

            <UFormField label="Referência" help="Faz parte do endereço e não muda depois de criado.">
              <UInput
                :model-value="form.identidade.reference"
                disabled
                icon="i-lucide-lock"
                class="w-full sm:max-w-sm"
              />
            </UFormField>
          </div>
        </div>

        <UFormField label="Descrição">
          <template #help>
            <span class="flex justify-between gap-4">
              <span>Para que serve este workspace. Quem entra pela primeira vez lê isto.</span>
              <span
                class="tabular-nums"
                :class="(form.identidade.description?.length ?? 0) > LIMITE_DESCRICAO - 30 ? 'text-warning' : 'text-muted'"
              >
                {{ form.identidade.description?.length ?? 0 }} / {{ LIMITE_DESCRICAO }}
              </span>
            </span>
          </template>
          <UTextarea
            v-model="form.identidade.description"
            :maxlength="LIMITE_DESCRICAO"
            :rows="2"
            autoresize
            class="w-full"
          />
        </UFormField>

      </div>
    </Secao>

    <!--
      2 e 3. COMPORTAMENTO E MÓDULOS, LADO A LADO

      Os dois blocos são a mesma coisa em natureza — chaves de ligar/desligar que
      mudam o workspace inteiro —, e cada um sozinho numa faixa de 1.200 px deixa
      meio cartão vazio à direita do controle. Em duas colunas, a coluna passa a
      ter a largura de leitura, o controle fica perto do rótulo e não sobra buraco.

      `items-start` porque os cartões têm alturas diferentes (cinco chaves contra
      três) e esticar o menor só criaria vazio de novo.
    -->
    <div class="grid items-start gap-5 lg:grid-cols-2">
      <Secao
        id="comportamento"
        titulo="Comportamento da interface"
        resumo="O que os membros veem e o que eles podem fazer nas telas do workspace."
        :doc="documentacao.basicas"
        style="animation: entrada .4s ease-out both; animation-delay: 60ms"
      >
        <!--
          O idioma padrão saiu da Identidade e veio para cá. Identidade é
          logo, nome e referência (Slack, Linear e Notion agrupam assim);
          idioma é preferência, e o HubSpot separa uma coisa da outra. Aqui a
          preferência cai no cartão que trata justamente do que os membros
          veem, e usa a mesma linha das chaves, com o controle na mesma coluna.
        -->
        <LinhaDeAjuste :ajuste="ajusteDeIdioma">
          <template #detalhe>
            <UButton
              label="Abrir Dicionários"
              icon="i-lucide-languages"
              size="xs"
              color="neutral"
              variant="subtle"
              class="mt-2"
              @click="emit('irPara', 'dicionarios')"
            />
          </template>

          <template #controle>
            <USelect
              v-model="form.identidade.idiomaPadrao"
              :items="idiomas"
              aria-label="Idioma padrão do workspace"
              class="w-44"
            />
          </template>
        </LinhaDeAjuste>

        <LinhaDeAjuste
          v-for="a in comportamento"
          :key="a.chave"
          v-model="form.comportamento[a.chave]"
          :ajuste="a"
        />
      </Secao>

      <Secao
        id="modulos"
        titulo="Módulos"
        resumo="Funcionalidades opcionais. Ligar um módulo acrescenta telas e campos ao workspace."
        :doc="documentacao.basicas"
        style="animation: entrada .4s ease-out both; animation-delay: 120ms"
      >
        <LinhaDeAjuste
          v-for="m in modulos"
          :key="m.chave"
          v-model="form.modulos[m.chave]"
          :ajuste="m"
        />
      </Secao>
    </div>

    <!-- 4. ZONA DE PERIGO --------------------------------------------- -->
    <Secao
      id="exclusao"
      titulo="Zona de perigo"
      resumo="A única ação desta tela que não tem volta."
      perigo
      :doc="documentacao.basicas"
      style="animation: entrada .4s ease-out both; animation-delay: 180ms"
    >
      <p class="text-sm text-muted">
        Excluir o workspace <strong class="text-toned">{{ form.identidade.name }}</strong> apaga
        tudo o que existe dentro dele, para todos os membros. Não há backup, não há lixeira e não
        há como restaurar.
      </p>

      <!-- O que se perde fica na tela, não só no modal: é o aviso, não o detalhe. -->
      <ul class="mt-4 grid gap-2 sm:grid-cols-2">
        <li
          v-for="(item, i) in oQueSePerde"
          :key="item.texto"
          class="flex items-center gap-2 rounded-md bg-error/5 px-3 py-2 text-sm text-toned"
          :style="`animation: entrada .35s ease-out both; animation-delay: ${180 + i * 50}ms`"
        >
          <UIcon :name="item.icone" class="size-4 shrink-0 text-error" />
          {{ item.texto }}
        </li>
      </ul>

      <div class="mt-4 flex justify-end">
        <UButton
          label="Excluir workspace"
          icon="i-lucide-trash-2"
          color="error"
          class="transition-transform hover:-translate-y-0.5"
          @click="confirmandoExclusao = true"
        />
      </div>
    </Secao>

    <!-- Confirmação em camada, sobre a mesma tela. -->
    <UModal v-model:open="confirmandoExclusao" title="Excluir este workspace?">
      <template #body>
        <p class="text-sm text-muted">
          Você está prestes a apagar <strong class="text-highlighted">{{ form.identidade.name }}</strong>.
          Isso remove, para todos os membros:
        </p>

        <ul class="my-4 space-y-2">
          <li
            v-for="(item, i) in oQueSePerde"
            :key="item.texto"
            class="flex items-center gap-2.5 text-sm text-toned"
            :style="`animation: entrada .3s ease-out both; animation-delay: ${i * 50}ms`"
          >
            <UIcon :name="item.icone" class="size-4 shrink-0 text-error" />
            {{ item.texto }}
          </li>
        </ul>

        <UFormField
          label="Para confirmar, digite a referência do workspace"
          :help="`Referência: ${identidade.reference}`"
        >
          <UInput
            v-model="referenciaDigitada"
            :placeholder="identidade.reference"
            class="w-full"
            autocomplete="off"
          />
        </UFormField>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="ghost"
            @click="confirmandoExclusao = false"
          />
          <UButton
            label="Excluir para sempre"
            color="error"
            :disabled="!podeExcluir"
            :loading="excluindo"
            @click="excluir"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
