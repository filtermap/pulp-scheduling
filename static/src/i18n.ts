import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  ja: {
    translation: {
      "<KinmuName />の連続日数を{{連続日数上限}}日以下にする":
        "<KinmuName />の連続日数を{{連続日数上限}}日以下にする",
      "<KinmuName />の連続日数を{{連続日数下限}}日以上にする":
        "<KinmuName />の連続日数を{{連続日数下限}}日以上にする",
      "<KinmuName />の間隔日数を{{間隔日数上限}}日以下にする":
        "<KinmuName />の間隔日数を{{間隔日数上限}}日以下にする",
      "<KinmuName />の間隔日数を{{間隔日数下限}}日以上にする":
        "<KinmuName />の間隔日数を{{間隔日数下限}}日以上にする",
      "<MemberName />に<KinmuName />を{{勤務割り当て数上限}}回以下割り当てる":
        "<MemberName />に<KinmuName />を{{勤務割り当て数上限}}回以下割り当てる",
      "<MemberName />に<KinmuName />を{{勤務割り当て数下限}}回以上割り当てる":
        "<MemberName />に<KinmuName />を{{勤務割り当て数下限}}回以上割り当てる",
      "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<KinmuName />に<GroupName />から{{割り当て職員数上限}}人以下の職員を割り当てる":
        "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<KinmuName />に<GroupName />から{{割り当て職員数上限}}人以下の職員を割り当てる",
      "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<KinmuName />に<GroupName />から{{割り当て職員数下限}}人以上の職員を割り当てる":
        "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<KinmuName />に<GroupName />から{{割り当て職員数下限}}人以上の職員を割り当てる",
      "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<MemberName />に<KinmuName />を割り当てない":
        "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<MemberName />に<KinmuName />を割り当てない",
      "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<MemberName />に<KinmuName />を割り当てる":
        "<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<MemberName />に<KinmuName />を割り当てる",
      CSV出力: "CSV出力",
      "pulp-scheduling": "pulp-scheduling",
      "pulp-schedulingの不具合やデータの破損などにより作成できない可能性があります（{{arg0}}）":
        "pulp-schedulingの不具合やデータの破損などにより作成できない可能性があります（{{arg0}}）",
      "pulp-schedulingの不具合や条件の誤りなどにより特定できない可能性があります（{{arg0}}）":
        "pulp-schedulingの不具合や条件の誤りなどにより特定できない可能性があります（{{arg0}}）",
      version: "v0.2.2",
      "{{arg0}}には{{arg1}}より前の日付を入力してください":
        "{{arg0}}には{{arg1}}より前の日付を入力してください",
      "{{arg0}}には{{arg1}}より後の日付を入力してください":
        "{{arg0}}には{{arg1}}より後の日付を入力してください",
      "{{arg0}}の削除": "{{arg0}}の削除",
      "{{arg0}}の形式が正しくありません": "{{arg0}}の形式が正しくありません",
      "{{arg0}}の追加": "{{arg0}}の追加",
      "{{arg0}}を入力してください": "{{arg0}}を入力してください",
      "{{arg0}}を追加できません": "{{arg0}}を追加できません",
      "この{{arg0}}を削除します": "この{{arg0}}を削除します",
      この期間に他の期間からデータと条件をインポートします:
        "この期間に他の期間からデータと条件をインポートします",
      すべての条件: "すべての条件",
      やり直す: "やり直す",
      インポート: "インポート",
      グループ: "グループ",
      グループがありません: "グループがありません",
      グループに所属する職員: "グループに所属する職員",
      グループ名: "グループ名",
      他の期間からデータと条件をインポート:
        "他の期間からデータと条件をインポート",
      他の期間からデータと条件をインポートできません:
        "他の期間からデータと条件をインポートできません",
      以下の勤務表も削除されます: "以下の勤務表も削除されます",
      以下の勤務表内の職員への割り当ても削除されます:
        "以下の勤務表内の職員への割り当ても削除されます",
      以下の条件により勤務表を作成できませんでした:
        "以下の条件により勤務表を作成できませんでした",
      以下の条件も削除されます: "以下の条件も削除されます",
      "作成中...": "作成中...",
      保存: "保存",
      元に戻す: "元に戻す",
      削除: "削除",
      割り当て職員数上限: "割り当て職員数上限",
      割り当て職員数下限: "割り当て職員数下限",
      勤務: "勤務",
      "勤務{{arg0}}": "勤務{{arg0}}",
      勤務がありません: "勤務がありません",
      勤務の連続日数の上限: "勤務の連続日数の上限",
      勤務の連続日数の下限: "勤務の連続日数の下限",
      勤務の間隔日数の上限: "勤務の間隔日数の上限",
      勤務の間隔日数の下限: "勤務の間隔日数の下限",
      勤務割り当て数上限: "勤務割り当て数上限",
      勤務割り当て数下限: "勤務割り当て数下限",
      勤務名: "勤務名",
      勤務表: "勤務表",
      "勤務表{{arg0}}": "勤務表{{arg0}}",
      勤務表を作成できない原因である条件を特定:
        "勤務表を作成できない原因である条件を特定",
      勤務表を作成できない原因である条件を特定できませんでした:
        "勤務表を作成できない原因である条件を特定できませんでした",
      "勤務表を作成できない原因である条件を特定中...":
        "勤務表を作成できない原因である条件を特定中...",
      勤務表を作成できませんでした: "勤務表を作成できませんでした",
      有効: "有効",
      有効な他の期間がありません: "有効な他の期間がありません",
      期間: "期間",
      "期間中のすべての勤務表、職員、勤務、グループ、条件も削除されます":
        "期間中のすべての勤務表、職員、勤務、グループ、条件も削除されます",
      期間中勤務にグループから割り当てる職員数の上限:
        "期間中勤務にグループから割り当てる職員数の上限",
      期間中勤務にグループから割り当てる職員数の下限:
        "期間中勤務にグループから割り当てる職員数の下限",
      期間中職員に割り当てない勤務: "期間中職員に割り当てない勤務",
      期間中職員に割り当てる勤務: "期間中職員に割り当てる勤務",
      条件を満たす勤務表が存在しません: "条件を満たす勤務表が存在しません",
      終了日: "終了日",
      職員: "職員",
      職員がいません: "職員がいません",
      職員が所属するグループ: "職員が所属するグループ",
      職員への勤務の割り当て数の上限: "職員への勤務の割り当て数の上限",
      職員への勤務の割り当て数の下限: "職員への勤務の割り当て数の下限",
      職員名: "職員名",
      自動作成: "自動作成",
      追加: "追加",
      連続日数上限: "連続日数上限",
      連続日数下限: "連続日数下限",
      連続禁止勤務並び: "連続禁止勤務並び",
      選択した期間から次のデータと条件をインポートします:
        "選択した期間から次のデータと条件をインポートします",
      閉じる: "閉じる",
      開始日: "開始日",
      間隔日数上限: "間隔日数上限",
      間隔日数下限: "間隔日数下限",
      "（{{arg0}}未入力）": "（{{arg0}}未入力）",
    },
  },
} as const;

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    lng: "ja",
    resources,
  });

export default i18n;
