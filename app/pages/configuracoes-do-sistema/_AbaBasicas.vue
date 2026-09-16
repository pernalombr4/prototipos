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
      <div class="grid gap-5 sm:grid-cols-2">
        <UFormField label="Nome" help="Aparece no topo da tela e nos e-mails enviados pelo workspace.">
          <UInput v-model="form.identidade.name" class="w-full" />
        </UFormField>

        <UFormField label="Referência">
          <template #help>
            <span class="flex items-center gap-1">
              Faz parte do endereço e não muda depois de criado.
            </span>
          </template>
          <UInput
            :model-value="form.identidade.reference"
            disabled
            icon="i-lucide-lock"
            class="w-full"
          />
        </UFormField>

        <UFormField class="sm:col-span-2" label="Descrição">
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

        <UFormField
          class="sm:col-span-2"
          label="Marca"
          :help="`O símbolo que identifica o workspace na barra lateral. ${marcas.find(m => m.valor === form.identidade.tipoDeMarca)?.ajuda}`"
        >
          <div class="flex flex-wrap items-center gap-3">
            <div
              class="flex size-12 shrink-0 items-center justify-center rounded-lg border border-default bg-elevated transition-colors"
            >
              <UIcon
                v-if="form.identidade.tipoDeMarca === 'icone'"
                :name="form.identidade.icon || 'lucide:box'"
                class="size-6 text-primary"
              />
              <UIcon v-else name="i-lucide-image" class="size-6 text-muted" />
            </div>

            <div class="flex rounded-lg border border-default p-0.5">
              <button
                v-for="m in marcas"
                :key="m.valor"
                type="button"
                class="rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                :class="form.identidade.tipoDeMarca === m.valor
                  ? 'bg-primary text-inverted'
                  : 'text-muted hover:text-highlighted hover:bg-elevated'"
                :aria-pressed="form.identidade.tipoDeMarca === m.valor"
                @click="form.identidade.tipoDeMarca = m.valor"
              >
                {{ m.rotulo }}
              </button>
            </div>

            <UButton
              v-if="form.identidade.tipoDeMarca === 'icone'"
              label="Trocar ícone"
              icon="i-lucide-shapes"
              size="xs"
              color="neutral"
              variant="subtle"
              class="transition-transform hover:-translate-y-0.5"
            />
            <UButton
              v-else
              label="Enviar imagem"
              icon="i-lucide-upload"
              size="xs"
              color="neutral"
              variant="subtle"
              class="transition-transform hover:-translate-y-0.5"
            />
          </div>
        </UFormField>

        <UFormField class="sm:col-span-2" label="Idioma padrão">
          <template #help>
            <span>
              Vale para os termos nativos da interface. Os textos que
              <strong class="text-toned">você</strong> criou — campos, formulários, ajudas —
              se traduzem em
              <button
                type="button"
                class="text-primary underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="emit('irPara', 'dicionarios')"
              >Dicionários</button>.
            </span>
          </template>
          <USelect v-model="form.identidade.idiomaPadrao" :items="idiomas" class="w-full sm:max-w-xs" />
        </UFormField>
      </div>
    </Secao>

    <!-- 2. COMPORTAMENTO --------------------------------------------- -->
    <Secao
      id="comportamento"
      titulo="Comportamento da interface"
      resumo="O que os membros veem e o que eles podem fazer nas telas do workspace."
      :doc="documentacao.basicas"
      style="animation: entrada .4s ease-out both; animation-delay: 60ms"
    >
      <LinhaDeAjuste
        v-for="a in comportamento"
        :key="a.chave"
        v-model="form.comportamento[a.chave]"
        :ajuste="a"
      />
    </Secao>

    <!-- 3. MÓDULOS ---------------------------------------------------- -->
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

    <!-- 4. ZONA DE PERIGO --------------------------------------------- -->
    <Secao
      id="exclusao"
      titulo="Excluir workspace"
      resumo="A única ação desta tela que não tem volta."
      perigo
      :doc="documentacao.basicas"
      style="animation: entrada .4s ease-out both; animation-delay: 180ms"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <p class="max-w-xl text-sm text-muted">
          Apaga o workspace <strong class="text-toned">{{ form.identidade.name }}</strong> e tudo
          o que existe dentro dele. Não há backup, não há lixeira e não há como restaurar.
        </p>
        <UButton
          label="Excluir workspace"
          icon="i-lucide-trash-2"
          color="error"
          variant="subtle"
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
