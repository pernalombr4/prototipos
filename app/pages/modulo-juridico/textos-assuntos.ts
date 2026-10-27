/**
 * A copy da rodada 5 (o processo como assunto e o assunto principal) nos três idiomas do ENSPACE. Texto novo,
 * escrito para ir ao produto, em registro formal. Fica à parte, como as rodadas 3 e 4.
 *
 * Nomes de categoria, de campo e de opção de lista ficam em português nos três idiomas: são dado do workspace. A chave
 * nativa (`matter.parent_matter`) é igual em todo idioma. Sem travessão em nada que aparece na tela (regra 33).
 */
import type { Idioma } from '~/composables/useIdioma'

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios)

/* ================================================================== *
 * Português                                                           *
 * ================================================================== */

const pt = {
  ligacao: {
    heranca: 'A categoria escolhida passa a ser do tipo Processo, que é um tipo de Assunto. Os campos de assunto valem também para a categoria Assuntos; os campos de processo valem só para esta categoria.',
    grupos: { processo: 'Campos de processo', assunto: 'Campos de assunto' },
    grupoAssunto: 'Valem também para a categoria Assuntos.',
    chave: 'Chave nativa. Não muda quando o rótulo do campo muda.',
    naoUsar: 'Não usar',
    assuntoAjuda: 'Agrupa processos de uma mesma disputa em um item de Assuntos. Quem não agrupa deixa sem.',
  },
  processo: {
    assuntoPrincipal: 'Assunto principal',
    semAssunto: 'Sem assunto principal',
    abrir: 'Abrir o assunto',
  },
  assunto: {
    campos: {
      tipo: 'Tipo', area: 'Área', responsavel: 'Responsável', areaDaEmpresa: 'Área da empresa', entidade: 'Empresa do grupo',
      centroDeCusto: 'Centro de custo', abertura: 'Aberto em',
    },
    dados: 'Dados do assunto',
    processos: 'Processos deste assunto',
    processosAjuda: 'Os processos que apontam para este assunto no campo Assunto principal.',
    resumo: {
      processos: (n: number) => `${n} ${plural(n, 'processo', 'processos')}`,
      valorDaCausa: 'Valor da causa somado',
      estimado: 'Estimado somado',
      proximoPrazo: 'Próximo prazo',
    },
    vazio: 'Nenhum processo neste assunto',
    vazioDesc: 'Adicione um processo, ou escolha este assunto no campo Assunto principal do processo.',
    adicionar: 'Adicionar processo',
    buscar: 'Buscar pelo número ou pela parte',
    tirar: 'Tirar do assunto',
    toastAdicionado: (processo: string, assunto: string) => `${processo} adicionado a ${assunto}.`,
    toastTirado: (processo: string) => `${processo} saiu do assunto.`,
  },
  lista: {
    colunas: { assunto: 'Assunto', tipo: 'Tipo', responsavel: 'Responsável', processos: 'Processos', estimado: 'Estimado somado' },
  },
}

export type TextosAssuntos = typeof pt

/* ================================================================== *
 * English                                                             *
 * ================================================================== */

const en: TextosAssuntos = {
  ligacao: {
    heranca: 'The selected category becomes a Case category, which is a type of Matter. Matter fields also apply to the Assuntos category; case fields apply only to this category.',
    grupos: { processo: 'Case fields', assunto: 'Matter fields' },
    grupoAssunto: 'Also apply to the Assuntos category.',
    chave: 'Native key. It does not change when the field label changes.',
    naoUsar: 'Do not use',
    assuntoAjuda: 'Groups the cases of the same dispute under an item in Assuntos. Leave it empty if you do not group cases.',
  },
  processo: {
    assuntoPrincipal: 'Parent matter',
    semAssunto: 'No parent matter',
    abrir: 'Open the matter',
  },
  assunto: {
    campos: {
      tipo: 'Type', area: 'Practice area', responsavel: 'Owner', areaDaEmpresa: 'Business unit', entidade: 'Group company',
      centroDeCusto: 'Cost center', abertura: 'Opened on',
    },
    dados: 'Matter details',
    processos: 'Cases in this matter',
    processosAjuda: 'The cases that point to this matter in the Parent matter field.',
    resumo: {
      processos: (n: number) => `${n} ${plural(n, 'case', 'cases')}`,
      valorDaCausa: 'Total claim amount',
      estimado: 'Total estimate',
      proximoPrazo: 'Next deadline',
    },
    vazio: 'No cases in this matter',
    vazioDesc: 'Add a case, or select this matter in the Parent matter field of the case.',
    adicionar: 'Add case',
    buscar: 'Search by number or party',
    tirar: 'Remove from matter',
    toastAdicionado: (processo: string, assunto: string) => `${processo} added to ${assunto}.`,
    toastTirado: (processo: string) => `${processo} removed from the matter.`,
  },
  lista: {
    colunas: { assunto: 'Matter', tipo: 'Type', responsavel: 'Owner', processos: 'Cases', estimado: 'Total estimate' },
  },
}

/* ================================================================== *
 * Español                                                             *
 * ================================================================== */

const es: TextosAssuntos = {
  ligacao: {
    heranca: 'La categoría elegida pasa a ser del tipo Proceso, que es un tipo de Asunto. Los campos de asunto valen también para la categoría Assuntos; los campos de proceso valen solo para esta categoría.',
    grupos: { processo: 'Campos de proceso', assunto: 'Campos de asunto' },
    grupoAssunto: 'Valen también para la categoría Assuntos.',
    chave: 'Clave nativa. No cambia cuando cambia la etiqueta del campo.',
    naoUsar: 'No usar',
    assuntoAjuda: 'Agrupa los procesos de una misma disputa en un ítem de Assuntos. Si no agrupa procesos, déjelo vacío.',
  },
  processo: {
    assuntoPrincipal: 'Asunto principal',
    semAssunto: 'Sin asunto principal',
    abrir: 'Abrir el asunto',
  },
  assunto: {
    campos: {
      tipo: 'Tipo', area: 'Área', responsavel: 'Responsable', areaDaEmpresa: 'Área de la empresa', entidade: 'Empresa del grupo',
      centroDeCusto: 'Centro de costo', abertura: 'Abierto el',
    },
    dados: 'Datos del asunto',
    processos: 'Procesos de este asunto',
    processosAjuda: 'Los procesos que apuntan a este asunto en el campo Asunto principal.',
    resumo: {
      processos: (n: number) => `${n} ${plural(n, 'proceso', 'procesos')}`,
      valorDaCausa: 'Valor de la causa sumado',
      estimado: 'Estimado sumado',
      proximoPrazo: 'Próximo plazo',
    },
    vazio: 'Ningún proceso en este asunto',
    vazioDesc: 'Agregue un proceso, o elija este asunto en el campo Asunto principal del proceso.',
    adicionar: 'Agregar proceso',
    buscar: 'Buscar por número o por parte',
    tirar: 'Quitar del asunto',
    toastAdicionado: (processo: string, assunto: string) => `${processo} agregado a ${assunto}.`,
    toastTirado: (processo: string) => `${processo} salió del asunto.`,
  },
  lista: {
    colunas: { assunto: 'Asunto', tipo: 'Tipo', responsavel: 'Responsable', processos: 'Procesos', estimado: 'Estimado sumado' },
  },
}

export const textosAssuntos: Record<Idioma, TextosAssuntos> = { 'pt-BR': pt, en, es }
