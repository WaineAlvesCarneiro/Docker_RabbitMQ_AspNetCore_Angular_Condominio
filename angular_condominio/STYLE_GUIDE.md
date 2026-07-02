STYLE GUIDE - Design System (resumo)
=================================

Objetivo
--------
Documento enxuto com tokens e classes principais para padronizar o frontend.

Tokens (variáveis SCSS / CSS custom properties)
------------------------------------------------
- Cores principais: $primary-500, $primary-600, $danger-500, $success-500
- Espaçamentos: $sp-xxs, $sp-sm, $sp-md, $sp-lg
- Border / radius: $radius-sm, $radius-md
- Tipografia: $font-family-base, $font-size-base

Classes utilitárias / componentes
---------------------------------
- Container
  - .container — área central com padding padrão

- Botões
  - .btn — botão base (padding, border-radius, alinhamento)
  - .btn-primary — variante principal (fundo primário + texto claro)
  - .btn-outline — variante outline (fundo transparente + borda)
  - .btn-danger — ação destrutiva
  - tamanhos: .btn-sm, .btn-md
  - acessibilidade: adicionar aria-label quando apenas ícone

- Formulários
  - .form-container — wrapper de formulários
  - .form-group — grupo de campo (label + input + mensagens)
  - .form-grid — grid responsivo para formulários (duas colunas em desktop)
  - .form-control — inputs, selects e textareas
  - .form-control-checkbox — inputs do tipo checkbox
  - .form-error — mensagem de erro (visível quando inválido)
  - .form-hint — texto auxiliar

- Tabelas e Listagens
  - .itens-table — tabela padrão (thead, th.sortable com .sort-indicator)
  - cabeçalhos ordenáveis: th.sortable, .sorted-asc, .sorted-desc
  - colunas de ação: th.actions, td.actions

- Componentes compartilhados
  - app-select → renderiza <select class="form-control"> e mapeia por índice
  - app-pagination → usa .pagination-container e botões .btn
  - app-table-filters → inputs .form-control e botões .btn
  - modais: .modal-overlay, .modal-content, .modal-header/.modal-body/.modal-footer
  - notificações: .notification-container, .notification-message (.success/.error/.alert)

Acessibilidade
-------------
- Usar aria-label em botões icônicos.
- Fornecer texto alternativo (sr-only) em botões de paginação.
- Spinner marcado aria-hidden="true" quando visual apenas.

Boas práticas
-------------
- Preferir classes do design system em vez de estilos inline.
- Não misturar app-button com botões nativos; converter para .btn caso o projeto já use classes globais.
- Variáveis de cor devem ser alteradas em src/styles/_design_tokens.scss — edite apenas lá.

Exemplos rápidos
----------------
- Botão primário: <button class="btn btn-primary">Salvar</button>
- Input: <input class="form-control" placeholder="Pesquisar" />
- Tabela: <table class="itens-table"> ... </table>

Observações finais
------------------
Este guia é um resumo para acelerar a adoção do design system. Posso gerar uma versão mais completa (exemplos visuais, componentes com html + scss) se desejar.
