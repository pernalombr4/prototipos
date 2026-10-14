/**
 * A MOLDURA ÚNICA DAS JANELAS (rodada 20).
 *
 * "ha inconsistencias no modelo de modal que aparece ao botar pra personalizar
 *  o menu ou ao botar pra criar seçao ou criar menu/item de menu. unifique a
 *  ideia" (Mikaela, 13/10/2026).
 *
 * Na junção das duas linhas de trabalho havia sete larguras de janela para o
 * mesmo tipo de tarefa (md, lg, xl, 2xl, 3xl, sm) e três jeitos de rodapé.
 * Agora a largura sai do TIPO de janela, e não de quem escreveu cada uma:
 *
 *   formulario  criar, renomear, importar, usar um caso: preencher e confirmar;
 *   camada      ver e arrumar o menu inteiro ou uma lista grande.
 *
 * Três exceções, declaradas no DECISOES.md, porque a moldura serve ao conteúdo:
 * a Central de casos de uso (galeria, ocupa a tela), o menu nativo de hoje
 * (réplica em tamanho real) e a busca (paleta de comandos).
 *
 * As classes ficam escritas por inteiro aqui: o Tailwind lê o código-fonte e
 * não gera classe montada por interpolação.
 */
export const MOLDURA = {
  /*
   * Formulario abre SEMPRE por cima de camada: o editor chama o "Criar menu"
   * por cima de si, a Central chama o "Usar", o Personalizar chama o "Criar
   * secao". Sem a camada propria, quem foi montado antes ficava embaixo, e o
   * formulario aberto pelo editor nascia escondido atras dele.
   */
  formulario: 'max-w-lg z-[60]',
  sobreposicao: 'z-[60]',
  camada: 'max-w-3xl',
} as const
