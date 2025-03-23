# Teresina Wiki

- ### Seja bem vindo ao repositório do site Teresina Wiki.

- **Instalar e rodar com o live-server no VsCode**

- Procure pela extensão `Live server` no menu de extensões do Vs.
- Clique instalar. Depois de instalada, agora vamos clonar esse pasta do repositório:
- abra o terminal/cmd, navegue até onde deseja salvar a pasta.
  ```shell
  git clone -n https://github.com/macielalves/macielalves.github.io.git
  ```
- Navegue para dentro de macielalves.gihub.io:
  ```shell
  cd macielalves.github.io
  ```
- Após, execute o seguinte comando para baixar somente a pasta `teresina-wiki`:

  ```shell
  git checkout HEAD teresina-wiki
  ```

- Navegue até a subpasta e abra o VsCode nela:
  ```shell
  cd ./teresina-wiki
  code .
  ```
  Agora com o live-server instalado e o repositório em mãos, clique com o botão direito do mouse (padrão), clique em `Open with Live Server`. E após, ele deve solicitar para abrir no navegador. Caso não abra automaticamente, no seu browser digite `localhost:5500` ou `127.0.0.1:5500`.
