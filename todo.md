# Atualização com referência do Instagram

- [x] Acessar o perfil público compartilhado da Sâmia Lima e identificar logo, retratos e fotos de trabalho reutilizáveis.
- [x] Registrar URLs, contexto e limitações de uso dos assets selecionados.
- [x] Baixar/copiar apenas os assets necessários para `/home/ubuntu/webdev-static-assets/` e otimizar formatos quando possível.
- [x] Substituir no site a logo gerada e as imagens editoriais temporárias pelos assets reais selecionados.
- [x] Validar contraste, crop, acessibilidade, desktop e mobile.
- [x] Salvar novo checkpoint e entregar a versão atualizada.

## Ajuste de enquadramento do hero

- [x] Reduzir o zoom do background e reposicionar a foto para exibir mais da Sâmia.
- [x] Validar contraste e leitura dos textos no novo enquadramento em desktop e mobile.
- [x] Salvar um checkpoint da correção e entregar a atualização.

## Correção da foto de Capacitação

- [x] Substituir a foto incorreta por um asset confirmado da Sâmia Lima.
- [x] Ajustar o enquadramento para preservar a imagem inteira em desktop e mobile.
- [x] Validar a seção e salvar um checkpoint da correção.

## Preparação para GitHub e Vercel

- [x] Revisar e ajustar scripts e configuração para build/deploy na Vercel.
- [x] Adicionar documentação de instalação, build, deploy e variáveis de ambiente.
- [x] Validar o build e a estrutura de SPA.
- [x] Criar e enviar o repositório privado para o GitHub.

## Correção dos botões do hero

- [x] Corrigir o alinhamento e o espaçamento interno do botão dourado.
- [x] Garantir que os dois CTAs não se sobreponham em desktop e mobile.
- [x] Validar o hero e salvar um checkpoint da correção.

## Correção da marca

- [x] Separar o nome Samia Lima da assinatura profissional no bloco de marca.
- [x] Ajustar alinhamento, largura e espaçamento em desktop e mobile.
- [x] Validar o resultado e salvar um checkpoint da correção.

## Remoção de assinatura duplicada

- [x] Remover a assinatura repetida do bloco de marca.
- [x] Conferir o nome SAMIA LIMA e o header em desktop e mobile.
- [x] Validar, enviar ao GitHub e salvar um checkpoint.

## Ajuste final do espaçamento da marca

- [x] Descer a assinatura profissional para longe do sobrenome LIMA.
- [x] Validar o espaço em desktop e mobile.
- [x] Enviar a correção e salvar um checkpoint.

## Animações do hero

- [x] Aplicar fade-in suave à chamada “Especialista em terapia capilar avançada”.
- [x] Melhorar a transição de hover dos botões principais.
- [x] Validar redução de movimento, desktop/mobile e salvar checkpoint.

## Ajuste de enquadramento mobile da hero

- [x] Afastar a foto e deslocá-la para a direita no mobile.
- [x] Validar rosto, texto e composição em mobile e desktop.
- [x] Enviar a correção e salvar um checkpoint.

## Fade-in da imagem da hero no mobile

- [x] Aplicar fade-in suave apenas ao asset da hero em mobile.
- [x] Validar que o enquadramento e a redução de movimento continuam corretos.
- [x] Enviar a correção e salvar um checkpoint.

## Academy e área de membros

- [x] Migrar o projeto estático para a base full-stack com autenticação e banco de dados.
- [x] Criar entidades de alunos, assinaturas, cursos, módulos, aulas, materiais e progresso.
- [x] Implementar área protegida para alunos autenticados e controle de acesso de assinantes.
- [x] Criar dashboard Academy com cursos, progresso e materiais exclusivos.
- [x] Criar tela de detalhe do curso, módulos, aulas e marcação de conclusão.
- [x] Definir gestão inicial de conteúdo e acesso administrativo.
- [x] Validar autenticação, proteção de dados, estados vazios, responsividade e build.
- [x] Salvar checkpoint e entregar a nova área de membros.

## Completar Academy após validação de lacunas

- [x] Criar tabela e entidade de módulos da Academy e refletir módulos na API e UI.
- [x] Inserir conteúdo inicial realista da Academy no banco, com curso, módulos, aulas e materiais.
- [x] Implementar fluxo operacional de ativação de assinatura para o administrador/owner.
- [x] Retornar progresso por aula, exibir concluídas e permitir marcar/desmarcar com feedback persistente.
- [x] Validar no navegador o fluxo autenticado de assinante com login real; estados públicos/protegidos, curso bloqueado e responsividade já foram verificados.

## Completar gestão administrativa e materiais

- [x] Criar painel administrativo inicial para ativar assinaturas e editar o catálogo da Academy.
- [x] Vincular materiais exclusivos a URLs/arquivos acessíveis e exibir o estado de disponibilidade corretamente.
- [x] Validar o fluxo operacional de ativação de assinatura dentro do produto com controle de acesso admin.

## Edição real do catálogo e validação autenticada

- [x] Adicionar procedimentos admin para criar e editar cursos, módulos e aulas.
- [x] Adicionar formulários de catálogo ao painel administrativo.
- [x] Validar autorização admin e fluxo completo de assinatura e acesso do aluno em sessão autenticada real.

## Edição completa de módulos e aulas

- [x] Adicionar mutations admin para editar módulos e aulas.
- [x] Adicionar controles de edição correspondentes ao painel.
- [x] Validar novamente build, testes e autorização admin.

## Validação final das mutations admin

- [x] Adicionar testes para garantir que adminUpdateModule e adminUpdateLesson retornam FORBIDDEN para usuário comum.
- [x] Adicionar testes de sucesso das mutations adminUpdateModule e adminUpdateLesson para admin.
- [x] Validar em navegador uma sessão autenticada de admin e aluno, exercendo edição e persistência.
- [x] Validar fluxo autenticado de aluno assinante: ativar assinatura, acessar curso e marcar aula com persistência confirmada no banco.
