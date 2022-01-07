# 勤務表自動作成無料アプリ pulp-scheduling

勤務表を自動で作成する無料アプリです。[PuLP](https://coin-or.github.io/pulp/)を使用しています。 (This is an automatic scheduling app using [PuLP](https://coin-or.github.io/pulp/).)

![Demo video](demo.gif?raw=true)

Windows 上で動作します。 (This app runs on Windows.)

このアプリは開発中です。 (This is still in development.)

改良等のご要望がありましたら是非[メール](mailto:reducefiltermap@gmail.com)や[Twitter](https://twitter.com/filtermap)でお問い合わせください。

## 使用方法 (Usage)

下記のリンクから zip ファイルをダウンロードしてください。 (Download the zipped file from the link below.)

[https://github.com/filtermap/pulp-scheduling/releases/download/v0.2.2/pulp-scheduling-v0.2.2.zip](https://github.com/filtermap/pulp-scheduling/releases/download/v0.2.2/pulp-scheduling-v0.2.2.zip)

zip ファイルを解凍してください。 (Unzip the file.)

解凍後のフォルダの中にある pulp-scheduling.exe を実行してください。 (Execute pulp-scheduling.exe in the unzipped folder.)

## 設定可能な勤務条件 (Available constraints)

1. 連続禁止勤務並び  
   連続してはいけない勤務や休みを設定できます。  
   例：夜勤の次の日は日勤を割り当てない。

2. 期間の勤務にグループから割り当てる職員数の下限  
   ある期間の勤務や休みに割り当てる職員の人数の下限をグループごとに設定できます。  
   例：毎日必ず夜勤に介護士グループから 2 人以上割り当てる。

3. 期間の勤務にグループから割り当てる職員数の上限  
   ある期間の勤務や休みに割り当てる職員の人数の上限をグループごとに設定できます。  
   例：リーダーグループの 2 人が同時に休みにならないようにする（リーダーグループの休みの上限人数を 1 にする）。

4. 職員の勤務の割り当て数の下限  
   職員の勤務や休みの回数の下限を設定できます。  
   例：休みを 8 日以上にする。

5. 職員の勤務の割り当て数の上限  
   職員の勤務や休みの回数の上限を設定できます。  
   例：ある職員には夜勤を割り当てない（0 日にする）。

6. 勤務の連続日数の下限  
   ある勤務や休みを割り当てるとき、連続しなければならない日数を設定できます。

7. 勤務の連続日数の上限  
   ある勤務や休みを割り当てるとき、連続してもよい日数の上限を設定できます。  
   例：夜勤は 2 連続まで、3 連続はしない。

8. 勤務の間隔日数の下限  
   ある勤務や休みを割り当てたとき、次にその勤務や休みを割り当てるまで、空けなければならない日数の下限を設定できます。  
   例：休みと休みの間を 2 日間以上空ける（1 日間空けるという設定は、連続してはいけないという条件なので「連続禁止勤務並び」で設定してください）。

9. 勤務の間隔日数の上限  
   ある勤務や休みを割り当てたとき、次にその勤務や休みを割り当てるまでの日数の上限を設定できます。  
   例：休みと休みの間は 5 日間までとする（連続勤務は 5 日間まで）。

10. 職員の期間に割り当てる勤務  
    あらかじめ割り当てが決まっている勤務や休みを設定できます。  
    例：希望休を取得する。

11. 職員の期間に割り当てない勤務  
    あらかじめ割り当ててはいけない勤務や休みを設定できます。

## 開発者向け説明 (For developers)

### 必要なもの (Requirements)

- [Git for Windows](https://gitforwindows.org/)
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
- [Node v16.13.1 (LTS)](https://nodejs.org/en/blog/release/v16.13.1/)
- [Yarn 1.22.17](https://classic.yarnpkg.com/en/docs/install#windows-stable)
- Windows 10 or later

This app intends to be built with [Microsoft Windows Server 2022 Datacenter](https://github.com/actions/virtual-environments/blob/main/images/win/Windows2022-Readme.md#installed-software).

### パッケージなどのインストール (Install dependencies)

Miniconda に同梱されている Anaconda Prompt を起動して以下のコマンドを実行します。 (Execute commands below with Anaconda Prompt.)

```bat
git clone https://github.com/filtermap/pulp-scheduling.git
cd pulp-scheduling
conda env create
conda activate pulp-scheduling
cd static
yarn install --frozen-lockfile
cd ..
```

### 実行 (Run)

```bat
python main.py
```

### ビルド (Build)

```bat
python build.py
```

## リポジトリ（Repository）

[https://github.com/filtermap/pulp-scheduling](https://github.com/filtermap/pulp-scheduling)

## バージョン (Version)

0.2.2

## お問い合わせ (Contact)

- [Twitter: @filtermap](https://twitter.com/filtermap)
- [Email: reducefiltermap@gmail.com](mailto:reducefiltermap@gmail.com)
