# Bank-Account-CRUD

## Pré-requisitos

Antes de começar, você vai precisar:
- Versão mais recente do `Docker` e `Docker Compose`.

## Executando o projeto Bank-Account-CRUD

### Para executar o projeto Bank-Account-CRUD, siga estas etapas:
- Dê um git clone no projeto.
- renomeei o arquivo `.env.example` para `.env`
- execute o comando `docker-compose up --build`

## Com o projeto executando no seu docker, é possível seguir dois caminhos para continuar

### Caminho com seed 🌱
 - Execute o comando: `yarn seed`. Este comando irá popular o banco de dados (postgres) com um usuário e uma conta bancária
 - Acesse o Swagger em: `localhost:8080/api`
 - As informações do usuário cadastrado pelo **seed** estão no arquivo: **seed.ts**
 - Faça o seu **login** com os dados do **usuário**
 - Com o **login** feito, pegue a resposta do endpoint `token` e coloque-a no `Authorize` do swagger para acessar as demais rotas protegidas

### Caminho sem seed 🚀
 - Acesse o Swagger em: `localhost:8080/api`
 - Crie sua conta na em: **POST /user**
 - Faça seu login com as informações cadastradas na conta
 - Com o **login** feito, pegue a resposta do endpoint `token` e coloque-a no `Authorize` do swagger para acessar as demais rotas protegidas


## Executando testes
- Execute o comando: `yarn run test`
