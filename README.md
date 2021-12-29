# strawhatsec

## CTF

* [HTB](ctf/htb/README.md)

Docker

* [Burp Suite](docker/burpsuite/README.md)
* lab
* [Metasploit](docker/metasploit/README.md)
* [Nessus](docker/nessus/README.md)
* [reverse](docker/reverse/README.md)
* [wordlists](docker/wordlists/README.md)

TODO
* update makefile `scripts/do_apply.sh` (fix issue with lazy expression doctl)

## How to contribute

### Setup

* [Docusaurus](https://docusaurus.io) v2
* [nvm](https://github.com/nvm-sh/nvm)
* [Yarn](https://classic.yarnpkg.com/lang/en)

Install Node.js with `nvm`

```bash
# install or update nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# list all LTS
nvm ls-remote --lts

# install node + npm (LTS)
nvm install 16 --lts

# verify installation
node --version # v16.13.1
npm --version # v8.1.2
```

Install Yarn

```bash
# install classic stable
npm install --global yarn

# verify installation
yarn --version # v1.22.15
```

Generate skeleton

```bash
# from root folder
npx create-docusaurus@latest website classic
```

Upgrade to Yarn v2

```bash
corepack enable

# update project to latest
cd website/
yarn set version stable
echo "nodeLinker: pnp" > .yarnrc.yml
yarn install
yarn dlx @yarnpkg/doctor

# verify installation + update .gitignore
yarn --version # v3.1.1
```

Configure `nvm`

```bash
# use default version (see .nvmrc)
echo "v16" > website/.nvmrc
cd website/
nvm use
```

### Development

Starts local site with livereload

```bash
# http://localhost:3000
make site-start
```

### Deployment

* [gh-pages](https://docusaurus.io/docs/deployment#deploying-to-github-pages)
* [GitHub Action](https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-docusaurus)

Manual deployment

```bash
# serves artifacts locally
make site-deploy-local

# deploys manually on gh-pages
make site-deploy-gh-manual
```

Every time that a tag starting with `v` is pushed, then a deployment is triggered on GitHub