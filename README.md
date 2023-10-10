# SPC Dashboard

SunFounder Power Control Dashboard

## Install

### Install node on Raspberry Pi

Download and import the Nodesource GPG key
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```

Create deb repository, NODE_MAJOR can be changed depending on the version you need.
```bash
NODE_MAJOR=20
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

Run Update and Install
```bash
sudo apt-get update
sudo apt-get install nodejs node -y
```

### Insall dependency

```bash
npm install
```

## Usage

## 



### 网页打开项目

先在源码文件中输入 `ssh -t xo@192.168.18.17 -p 22` 或者通过 SFTP登录，密码为：123
输入 `cd spc-dashboard/build `和` node main.js`后可以在在网页上输入http://192.168.18.17:34001/进行访问项目，输入http://192.168.18.17:34001/api/v1.0/get-all可以访问数据`

### webpack打包项目

```
npx webpack
```
命令运行完成后，在项目的根目录会自动新建一个 `dist/bundle.js` 文件，创建一个用于发布的文件夹，将 `bundle.js` 复制到新的文件夹中，在新文件夹中创建一个`.html`文件,
`body`添加 <div id="root"></div><script src="./bundle.js"></script> 即可。