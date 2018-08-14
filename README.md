# pulp-scheduling

Automatic Scheduler（勤務表自動作成機）

using Pulp（Pulp使用）

## usage（使用方法）

Download the file from the link below.（下記のリンクからファイルをダウンロードしてください）。

[https://github.com/filtermap/pulp-scheduling/releases/download/v0.1.0/dist.zip](https://github.com/filtermap/pulp-scheduling/releases/download/v0.1.0/dist.zip)

Unzip the file.（ファイルを解凍してください。）

Execute scheduling.exe in the unzipped folder.（解凍後のフォルダの中にあるscheduling.exeを実行してください。）

## for developers（開発者向け説明）

### install（インストール）

```sh
conda env create
conda activate pulp-scheduling
cd static
yarn
cd ..
```

### run（実行）

```sh
python main.py
```

### build（ビルド）

```sh
python build.py
```
