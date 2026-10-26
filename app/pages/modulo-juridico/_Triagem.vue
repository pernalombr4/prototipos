<script setup lang="ts">
/**
 * ANDAIME, não é proposta: a triagem módulo × caso de uso, para quem avalia o protótipo.
 * Em português só, como o resto do andaime. A fonte é o BRIEFING.md, "Módulo ou caso de uso: o critério".
 */
const aberto = defineModel<boolean>('open', { default: false })

const criterio = [
  'Produz um resultado com efeito jurídico (prazo, ciência de intimação, provisão contábil).',
  'A configuração de hoje não produz esse resultado certo.',
  'O motor é igual para todo cliente; só o dado muda por país.',
]

type Fica = 'modulo' | 'caso' | 'plataforma'
const linhas: { area: string, efeito: string, hoje: string, fica: Fica, rotulo: string }[] = [
  { area: 'Contencioso: prazo processual', efeito: 'Sim: prazo perdido', hoje: 'Não: data digitada, em UTC, sem rito nem tribunal', fica: 'modulo', rotulo: 'Módulo: Prazos' },
  { area: 'Contencioso: publicações e intimações', efeito: 'Sim: a ciência abre o prazo', hoje: 'Não: não há captura', fica: 'modulo', rotulo: 'Módulo: Intimações' },
  { area: 'Contencioso: risco e provisão', efeito: 'Sim: balanço (CPC 25)', hoje: 'Não: campo solto, sem data-base nem histórico', fica: 'modulo', rotulo: 'Módulo: Provisão' },
  { area: 'Contencioso: estrutura do processo', efeito: 'Não', hoje: 'Sim: categorias, campos e telas', fica: 'caso', rotulo: 'Caso de uso' },
  { area: 'Contratos', efeito: 'Só na assinatura, que já existe', hoje: 'Sim: modelos, assinadores, Spaceflow', fica: 'caso', rotulo: 'Caso de uso' },
  { area: 'Consultivo', efeito: 'Não', hoje: 'Sim: formulário, triagem, prazo de atendimento', fica: 'caso', rotulo: 'Caso de uso' },
  { area: 'Procurações', efeito: 'Não', hoje: 'Sim: vigência e aviso por gatilho', fica: 'caso', rotulo: 'Caso de uso' },
  { area: 'Societário', efeito: 'Não', hoje: 'Sim: obrigações como itens com gatilho', fica: 'caso', rotulo: 'Caso de uso' },
  { area: 'Pagamentos jurídicos (Brasil)', efeito: 'Não', hoje: 'Sim: categoria, aprovação, centro de custo', fica: 'caso', rotulo: 'Caso de uso' },
  { area: 'Marcas', efeito: 'Não, sem conector', hoje: 'Sim: prazos de 10 anos e 60 dias por gatilho', fica: 'caso', rotulo: 'Caso de uso' },
  { area: 'Canal de denúncias', efeito: 'Sim: anonimato', hoje: 'Não, mas o que falta vale para todo workspace', fica: 'plataforma', rotulo: 'Caso de uso + plataforma' },
  { area: 'Sigilo e barreira por caso', efeito: 'Sim', hoje: 'Não, e vale para todo workspace', fica: 'plataforma', rotulo: 'Plataforma' },
]
const cor: Record<Fica, 'primary' | 'neutral' | 'warning'> = { modulo: 'primary', caso: 'neutral', plataforma: 'warning' }
</script>

<template>
  <USlideover v-model:open="aberto" title="Módulo ou caso de uso" description="A triagem que decidiu o que este protótipo desenha." :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <div class="flex flex-col gap-5">
        <section>
          <p class="mb-2 text-sm text-toned">Uma área vira funcionalidade do módulo só quando as 3 condições valem juntas:</p>
          <ol class="flex flex-col gap-1.5">
            <li v-for="(c, i) in criterio" :key="i" class="flex items-start gap-2 text-sm text-highlighted">
              <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{{ i + 1 }}</span>
              {{ c }}
            </li>
          </ol>
          <p class="mt-3 text-sm text-toned">
            Parou na condição 2: é <strong>caso de uso</strong>, uma configuração salva e replicada pela galeria, sem tela nova.
            Vale para todo workspace: é <strong>plataforma</strong>.
          </p>
        </section>

        <ul class="flex flex-col divide-y divide-default rounded-lg border border-default">
          <li v-for="l in linhas" :key="l.area" class="grid gap-1 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div class="min-w-0">
              <p class="text-sm font-medium text-highlighted">{{ l.area }}</p>
              <p class="text-xs text-muted">Efeito jurídico: {{ l.efeito }}. Configuração resolve: {{ l.hoje }}.</p>
            </div>
            <UBadge :label="l.rotulo" :color="cor[l.fica]" variant="subtle" size="sm" class="justify-self-start sm:justify-self-end" />
          </li>
        </ul>

        <p class="text-xs text-muted">O protótipo desenha só as 3 linhas do módulo. As outras aparecem em Módulo Jurídico › Casos de uso, para mostrar onde cada uma mora.</p>
      </div>
    </template>
  </USlideover>
</template>
