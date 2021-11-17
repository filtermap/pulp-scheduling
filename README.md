# 勤務表自動作成無料アプリ pulp-scheduling

勤務表を自動で作成する無料アプリです。[PuLP](https://pythonhosted.org/PuLP/)を使用しています。 (This is an automatic scheduling app using [PuLP](https://pythonhosted.org/PuLP/).)

![Demo video](demo.gif?raw=true)

このアプリは開発中です。 (This is still in development.)

改良等のご要望がありましたら是非[メール](mailto:reducefiltermap@gmail.com)や[Twitter](https://twitter.com/filtermap)で[お問い合わせ](https://github.com/filtermap/pulp-scheduling#%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B-contact)ください。

## 使用方法 (Usage)

下記のリンクからzipファイルをダウンロードしてください。 (Download the zipped file from the link below.)

[https://github.com/filtermap/pulp-scheduling/releases/download/v0.1.9/pulp-scheduling-v0.1.9.zip](https://github.com/filtermap/pulp-scheduling/releases/download/v0.1.9/pulp-scheduling-v0.1.9.zip)

zipファイルを解凍してください。 (Unzip the file.)

解凍後のフォルダの中にあるscheduling.exeを実行してください。 (Execute scheduling.exe in the unzipped folder.)

## 設定可能な勤務条件 (Available conditions)

1. 連続禁止勤務並び<br>連続してはいけない勤務や休みを設定できます。<br>例：夜勤の次の日は日勤を割り当てない。

2. 期間の勤務にグループから割り当てる職員数の下限<br>ある期間の勤務や休みに割り当てる職員の人数の下限をグループごとに設定できます。<br>例：毎日必ず夜勤に介護士グループから2人以上割り当てる。

3. 期間の勤務にグループから割り当てる職員数の上限<br>ある期間の勤務や休みに割り当てる職員の人数の上限をグループごとに設定できます。<br>例：リーダーグループの2人が同時に休みにならないようにする（リーダーグループの休みの上限人数を1にする）。

4. 職員の勤務の割り当て数の下限<br>職員の勤務や休みの回数の下限を設定できます。<br>例：休みを8日以上にする。

5. 職員の勤務の割り当て数の上限<br>職員の勤務や休みの回数の上限を設定できます。<br>例：ある職員には夜勤を割り当てない（0日にする）。

6. 勤務の連続日数の下限<br>ある勤務や休みを割り当てるとき、連続しなければならない日数を設定できます。

7. 勤務の連続日数の上限<br>ある勤務や休みを割り当てるとき、連続してもよい日数の上限を設定できます。<br>例：夜勤は2連続まで、3連続はしない。

8. 勤務の間隔日数の下限<br>ある勤務や休みを割り当てたとき、次にその勤務や休みを割り当てるまで、空けなければならない日数の下限を設定できます。<br>例：休みと休みの間を2日間以上空ける（1日間空けるという設定は、連続してはいけないという条件なので「連続禁止勤務並び」で設定してください）。

9. 勤務の間隔日数の上限<br>ある勤務や休みを割り当てたとき、次にその勤務や休みを割り当てるまでの日数の上限を設定できます。<br>例：休みと休みの間は5日間までとする（連続勤務は5日間まで）。

10. 職員の期間に割り当てる勤務<br>あらかじめ割り当てが決まっている勤務や休みを設定できます。<br>例：希望休を取得する。

11. 職員の期間に割り当てない勤務<br>あらかじめ割り当ててはいけない勤務や休みを設定できます。

## 開発者向け説明 (For developers)

### 必要なもの (System requirements)

- [Git for Windows](https://gitforwindows.org/)
- [Miniconda https://docs.conda.io/en/latest/miniconda.html](https://docs.conda.io/en/latest/miniconda.html)
- [Node.js, npm https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- [Installation | Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)
- Windows 10 Pro or Home
- プログラミングと Python と TypeScript と上記ツールの使い方に関する知識 (Knowledge to use tools above and skills for programming)

### パッケージなどのインストール (Install dependencies)

Miniconda に同梱されている Anaconda Prompt を起動して以下のコマンドを実行します。 (Execute commands below with Anaconda Prompt.)

```sh
git clone https://github.com/filtermap/pulp-scheduling.git
cd pulp-scheduling
conda env create
conda activate pulp-scheduling
cd static
yarn install --frozen-lockfile
cd ..
```

### 実行 (Run)

```sh
# at the root directory of pulp-scheduling
python main.py
```

### ビルド (Build)

```sh
# at the root directory of pulp-scheduling
python build.py
```

## リポジトリ（Repository）

[https://github.com/filtermap/pulp-scheduling](https://github.com/filtermap/pulp-scheduling)

## バージョン (Version)

0.1.9

## お問い合わせ (Contact)

- [Twitter: @filtermap](https://twitter.com/filtermap)
- [Email: reducefiltermap@gmail.com](mailto:reducefiltermap@gmail.com)
