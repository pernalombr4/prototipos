/**
 * ANDAIME DE PROTÓTIPO: o app de fora que o botão abre.
 *
 * No produto, o atalho só abre um link (`mailto:`, `https://wa.me/?text=`, `sms:`, a
 * página pública do formulário, o login da Microsoft) e o resto acontece fora
 * do ENSPACE. Aqui a
 * janela `_AppExterno.vue` simula esse app, para o comportamento de cada botão
 * ficar previsível. Não é proposta de tela.
 */
export type AppExterno =
  | { tipo: 'email', url: string, para: string[], cc: string[], assunto: string, corpo: string }
  | { tipo: 'formulario', url: string, formularioId: string }
  | { tipo: 'outlook', url: string }
  /** WhatsApp: com telefone, abre a conversa com ele; sem telefone (link do formulário), a pessoa escolhe a conversa. */
  | { tipo: 'whatsapp', url: string, texto: string, nome: string | null, telefone: string | null }
  /** SMS pelo link `sms:`: o app de mensagens do aparelho, com número e texto prontos. */
  | { tipo: 'sms', url: string, texto: string, nome: string | null, telefone: string | null }
  /** Google Messages Web: o site não aceita número nem texto no link; a pessoa cola o que copiou. */
  | { tipo: 'sms-web', url: string, texto: string, nome: string | null, telefone: string | null }

export function useAppExterno() {
  const app = useState<AppExterno | null>('cnw-app-externo', () => null)

  function abrirApp(a: AppExterno) {
    app.value = structuredClone(a)
  }

  function fechar() {
    app.value = null
  }

  return { app, abrirApp, fechar }
}
