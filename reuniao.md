## Reunião

> Somos uma biblioteca pequena e gostariamos de controlar a nossa entrada e saída de livros. Queremos cadastrar o usuário que irá pegar o livro emprestado, cadastrar os livros da nossa biblioteca e poder emprestar os livros para qualquer usuário, além de buscar os registros de empréstimos.

## Dados

- Usuario: [nome_completo, CPF, telefone, endereco, email]
- Livro: [nome, quantidade, autor, genero, ISBN]
- Emprestimo: [usuario_id, livro_id, data_retorno, data_devolucao, data_saida]

## UseCases (Regras de negócio)

[] Cadastrar um novo usuário
[] - CPF ou email devem ser únicos

[] Buscar um cadastro de usuário por CPF
[] - Retornar um usuário ou vazio

[] Cadastrar um novo livro
[] - ISBN deve ser único

[] Buscar um livro por nome ou ISBN
[] - Retornar os livros ou vazio

[] Emprestar um livro ao usuario
[] - A data de retorno não pode ser menor que a data de saída
[] - Um usuário não pode estar com mais de um livro com o mesmo ISBN ao mesmo tempo
[] - Um usuário pode estar com mais de um livro com ISBN diferentes ao mesmo tempo
[] - Ao cadastrar um empréstimo, será enviado um email automaticamente informando o nome do livro, nome do usuário, CPF, a data de saída e a data de retorno

[] Devolver o livro emprestado sem multa
[] - Caso o usuário tenha atrasado, será gerada uma multa fixa de R$ 10,00

[] Mostrar todos os empréstimos pendentes, com o nome do livro, nome do usuário, CPF, data de saída e data de retorno. Ordenados pela data de retorno mais antiga

## Estruturas

## UsuariosRepository

[] cadastrar: ({nome_completo, CPF, telefone, endereco, email}) => Promise<void>
[] buscarPorCPF: (CPF) => Promise<Usuario | null>
[] existePorCPF: (CPF) => Promise<boolean>
[] existePorEmail: (email) => Promise<boolean>

## livrosRepository

[] cadastrar: ({ nome, quantidade, autor, genero, ISBN}) => Promise<void>
[] existePorISBN: (ISBN) => Promise<boolean>
[] buscarPorNomeOuISBN: (valor) => Promise<array<Livro>>

## emprestimosRepository

[] emprestar: ({ livro_id, usuario_id, data_saida, data_retorno }) => Promise<void>
[] existeLivroISBNEmprestadoPendenteUsuario: ({usuario_id, livro_id}) => Promise<void>
[] buscarEmprestimoComLivroComUsuarioPorID: (id) => Promise<Emprestimo & {Livro: {nome}, Usuario: {nome_completo, CPF, email}}>
[] devolver: ({ emprestimo_id, data_devolucao }) => Promise<{data_retorno}>
[] buscarPendentesComLivroComUsuario: () => Promise<Emprestimos: {data_saida, data_retorno & Livro: {nome}, Usuario : {nome_completo, CPF}}>
