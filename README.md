# NodePost Backend

**NodePost** é uma plataforma de blogging desenvolvida como parte de um projeto de pós-graduação. O objetivo é fornecer um espaço para que professores da rede pública possam compartilhar suas aulas e conhecimentos.

## Tecnologias

- **Backend**: Node.js, Express, MongoDB
- **DevOps**: Docker, GitHub Actions
- **Frontend**: [Nodepost Frontend](https://github.com/fernandoamaral/nodepost-frontend)

## Como Instalar

### Instalação com Docker Compose

O Docker criará dois containers: um para a aplicação e outro para o banco de dados MongoDB.

```bash
# clone o repositório
git clone https://github.com/fernandoamaral/nodepost-backend.git

# crie o arquivo .env com as credenciais que deseja
cd nodepost-backend; cp .env.example .env

# suba os containers
docker compose up
```

### Instalação com Docker

Opção para utilizar o MongoDB em outro servidor, como o serviço MongoDB Atlas. Lembre-se de alterar a string de conexão e liberar o IP no **Network Access** do Atlas.

```bash
docker run -p 3000:3000 --env MONGO_URI="string_de_conexao" fernandoamaral/nodepost
```

### Instalação sem Docker

Sem o Docker, você precisará instalar o MongoDB ou utilizar o serviço MongoDB Atlas e editar a variável `MONGO_URI` do arquivo `.env` com a string de conexão.

```bash
# clone o repositório
git clone https://github.com/fernandoamaral/nodepost-backend.git

# edite a string de conexão do MongoDB no arquivo .env
cd nodepost-backend
echo 'MONGO_URI="string_de_conexao"' > .env

# rode o projeto
npm install
npm run start
```

## Documentação da API

A documentação Swagger da API poderá ser acessada pelo caminho `/docs`. Também disponibilizamos o acesso através do link https://apinodepost.ddns.net/docs/.

## Testes

A API possui testes automatizados com `Jest` e utiliza o banco de dados MongoDB em memória com a biblioteca `mongodb-memory-server`. Para executar os testes, use o seguinte comando:
```bash
npm run test
```

## CI/CD

Ao realizar o push na branch `main`, o GitHub Actions executará os testes e, caso aprovados, enviará uma nova imagem para o Docker Hub.

Para evitar que um commit realize o deploy, basta adicionar o texto `[skip ci]` ao final da mensagem de commit.

## Deploy

Uma maneira simples de realizar o deploy é utilizando o serviço Render. Seguem as intruções:
1. Selecine a opção **Web Service**.
2. No código de origem, escolha **Existing Image**.
3. Digite a URL `fernandoamaral/nodepost`.
4. Nas variáveis de ambiente, adicione a `MONGO_URI` com a string de conexão do MongoDB Atlas.
5. Clique no botão para realizar o deploy.
