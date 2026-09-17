<script setup lang="ts">
import Ajuda from './_Ajuda.vue'
import Secao from './_Secao.vue'
import LinhaDeAjuste from './_LinhaDeAjuste.vue'
import UxSeletorDeIcones from '~/components/ux/UxSeletorDeIcones.vue'
import { comportamento, modulos, documentacao, fusos, identidade, moedas } from './mocks'
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


/* ----------------------------- o logo ----------------------------- */

const escolhendoIcone = ref(false)
const enviandoImagem = ref(false)

/**
 * O arquivo escolhido vira uma URL de objeto, que e o que o `<img>` mostra
 * sem servidor nenhum. Trocar de arquivo libera a URL anterior: sem isso,
 * cada troca deixa um blob preso na memoria da aba.
 */
const arquivoDoLogo = ref<File | null>(null)

watch(arquivoDoLogo, (arquivo) => {
  if (form.identidade.logoImagem) URL.revokeObjectURL(form.identidade.logoImagem)
  form.identidade.logoImagem = arquivo ? URL.createObjectURL(arquivo) : null
})

/**
 * O produto guarda o ícone no formato do iconify (`colecao:nome`). O seletor
 * trabalha só com o nome, então a coleção entra e sai aqui.
 */
const iconeEscolhido = computed({
  get: () => (form.identidade.icon ?? '').replace(/^lucide:/, ''),
  set: (nome: string) => {
    form.identidade.icon = `lucide:${nome}`
  },
})

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
                <img
                  v-else-if="form.identidade.logoImagem"
                  :src="form.identidade.logoImagem"
                  alt=""
                  class="size-full rounded-xl object-cover"
                >
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
                    v-if="form.identidade.tipoDeMarca === 'icone'"
                    label="Escolher ícone"
                    icon="i-lucide-shapes"
                    size="sm"
                    color="neutral"
                    variant="subtle"
                    block
                    class="mt-3"
                    @click="escolhendoIcone = true"
                  />
                  <UButton
                    v-else
                    :label="form.identidade.logoImagem ? 'Trocar imagem' : 'Enviar imagem'"
                    icon="i-lucide-upload"
                    size="sm"
                    color="neutral"
                    variant="subtle"
                    block
                    class="mt-3"
                  @click="enviandoImagem = true"
                  />
                </div>
              </template>
            </UPopover>
          </UFormField>

          <div class="grid flex-1 gap-4 sm:grid-cols-2">
            <UFormField>
              <template #label>
                <span class="flex items-center gap-1">
                  Nome
                  <Ajuda titulo="Nome">
                    Aparece no topo da tela e nos e-mails enviados pelo workspace.
                  </Ajuda>
                </span>
              </template>
              <UInput v-model="form.identidade.name" class="w-full" />
            </UFormField>

            <UFormField>
              <template #label>
                <span class="flex items-center gap-1">
                  Referência
                  <Ajuda titulo="Referência">
                    É o nome curto do workspace no endereço: aparece na URL e no que as
                    integrações usam para achar este workspace.
                  </Ajuda>
                </span>
              </template>

              <!--
                Este é o único campo da tela que não tem volta, e a regra continua
                embaixo dele, em amarelo, em vez de ir para o "?": aviso de
                irreversibilidade não pode depender de a pessoa ter curiosidade.
                Mesma faixa do risco das linhas de ajuste, para a tela ter um jeito
                só de avisar.
              -->
              <template #help>
                <span class="flex items-start gap-1.5 rounded-md bg-warning/10 px-2.5 py-1.5 text-xs text-warning-700 dark:text-warning-300">
                  <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-3.5 shrink-0" />
                  <span>Não pode ser alterado depois de criado.</span>
                </span>
              </template>

              <UInput
                :model-value="form.identidade.reference"
                disabled
                icon="i-lucide-lock"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!--
          Aqui a instrução foi para o "?", mas o contador **fica**: ele não é
          instrução, é estado, e muda enquanto se digita.
        -->
        <UFormField>
          <template #label>
            <span class="flex items-center gap-1">
              Descrição
              <Ajuda titulo="Descrição">
                Para que serve este workspace. Quem entra pela primeira vez lê isto.
              </Ajuda>
            </span>
          </template>
          <template #help>
            <span
              class="block text-right tabular-nums"
              :class="(form.identidade.description?.length ?? 0) > LIMITE_DESCRICAO - 30 ? 'text-warning' : 'text-muted'"
            >
              {{ form.identidade.description?.length ?? 0 }} / {{ LIMITE_DESCRICAO }}
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
      2. PADRÕES DO WORKSPACE

      O "Account Defaults" do HubSpot, com o nome do objeto que existe aqui:
      o que vale quando ninguém escolheu nada. Identidade é quem o workspace
      é; padrão é como ele se comporta por omissão, e uma coisa não mora
      dentro da outra (PESQUISA.md, rodada 4).

      Três campos do mesmo tipo pedem grade de campos, não linhas de ajuste:
      cada um ocupa um terço e a seção não fica com meia largura vazia.
    -->
    <Secao
      id="padroes"
      titulo="Padrões do workspace"
      resumo="O que vale quando ninguém escolheu nada: idioma, fuso e moeda."
      :doc="documentacao.basicas"
      style="animation: entrada .4s ease-out both; animation-delay: 40ms"
    >
      <!--
        A instrução de cada campo saiu de baixo dele e foi para o "?" do rótulo.
        Eram três parágrafos permanentes para dúvidas que a pessoa tem uma vez,
        e eles dobravam a altura de uma seção que são três selects.
      -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <UFormField>
          <template #label>
            <span class="flex items-center gap-1">
              Idioma padrão
              <Ajuda titulo="Idioma padrão">
                Vale para os termos nativos da interface. O que
                <strong class="text-toned">você</strong> criou se traduz em
                <button
                  type="button"
                  class="text-primary underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  @click="emit('irPara', 'dicionarios')"
                >Dicionários</button>.
              </Ajuda>
            </span>
          </template>
          <USelect v-model="form.padroes.idioma" :items="idiomas" class="w-full" />
        </UFormField>

        <UFormField>
          <template #label>
            <span class="flex items-center gap-1">
              Fuso horário
              <Ajuda titulo="Fuso horário">
                Base de toda data e hora do workspace: prazo, SLA e Agenda.
              </Ajuda>
            </span>
          </template>
          <USelect v-model="form.padroes.fuso" :items="fusos" class="w-full" />
        </UFormField>

        <UFormField>
          <template #label>
            <span class="flex items-center gap-1">
              Moeda
              <Ajuda titulo="Moeda">
                Símbolo e formato dos campos de valor. Não converte o que já foi digitado.
              </Ajuda>
            </span>
          </template>
          <USelect v-model="form.padroes.moeda" :items="moedas" class="w-full" />
        </UFormField>
      </div>
    </Secao>

    <!--
      3 e 4. COMPORTAMENTO E MÓDULOS, UM ABAIXO DO OUTRO

      Já foram duas colunas dentro de um cartão só, na rodada 13, e quebrou: a
      `LinhaDeAjuste` mede o CONTAINER, não a coluna. Num cartão de 1.160 px ela
      entra no modo largo, reserva 40rem para o rótulo e manda a chave para fora
      da coluna, por cima da coluna vizinha.

      Empilhado, cada bloco tem a largura do cartão, a linha volta a funcionar e
      Módulos continua sendo o que é: outro assunto, com outro título.
    -->
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

    <!-- O seletor de ícone, para uma biblioteca de 50 mil -->
    <UModal
      v-model:open="escolhendoIcone"
      title="Escolher o ícone do workspace"
      description="A busca aceita português e ignora acento: procure por contrato, balança, caminhão."
      :ui="{ content: 'sm:max-w-xl' }"
    >
      <template #body>
        <UxSeletorDeIcones v-model="iconeEscolhido" />
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Fechar" color="neutral" variant="ghost" @click="escolhendoIcone = false" />
          <UButton label="Usar este ícone" @click="escolhendoIcone = false" />
        </div>
      </template>
    </UModal>

    <!--
      O envio do logo usa o campo de arquivo do Nuxt UI, que já é clicável e
      área de arraste ao mesmo tempo. Nada sobe: o arquivo vira uma URL de
      objeto no próprio navegador, que morre no reload (regra 4).
    -->
    <UModal
      v-model:open="enviandoImagem"
      title="Enviar o logo do workspace"
      description="Clique para escolher um arquivo ou arraste-o para cá."
      :ui="{ content: 'sm:max-w-lg' }"
    >
      <template #body>
        <UFileUpload
          v-model="arquivoDoLogo"
          accept="image/png,image/jpeg,image/gif,image/svg+xml"
          icon="i-lucide-image-up"
          label="Arraste a imagem ou clique para escolher"
          description="PNG, JPG, GIF ou SVG, até 2 MB. O melhor resultado vem de uma imagem quadrada."
          class="min-h-48 w-full"
        />

        <!--
          A prévia do campo mostra a imagem grande, e o X dele já remove. O que
          falta ali é o tamanho de verdade: na barra lateral o logo tem 64 px e
          é cortado em quadrado. É isso, e só isso, que este bloco acrescenta.
        -->
        <div
          v-if="form.identidade.logoImagem"
          class="mt-4 flex items-center gap-3 rounded-lg border border-default bg-elevated/60 px-3 py-2.5"
        >
          <img
            :src="form.identidade.logoImagem"
            alt=""
            class="size-10 shrink-0 rounded-lg object-cover"
          >
          <div class="min-w-0">
            <p class="text-sm font-medium text-highlighted">
              No tamanho em que vai aparecer
            </p>
            <p class="truncate text-sm text-muted">
              {{ arquivoDoLogo?.name ?? 'Imagem enviada' }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Fechar" color="neutral" variant="ghost" @click="enviandoImagem = false" />
          <UButton
            label="Usar esta imagem"
            :disabled="!form.identidade.logoImagem"
            @click="enviandoImagem = false"
          />
        </div>
      </template>
    </UModal>

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
