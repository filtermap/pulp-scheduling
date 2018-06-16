import os
import pulp
import pandas as pd

data_directory = os.path.join(os.getcwd(), "data")


def in_data_directory(path):
    return os.path.join(data_directory, path)


# 職員の集合。
members_df = pd.read_csv(in_data_directory("members.csv"), dtype={"職員名": str})
M = [r["職員名"] for _, r in members_df.iterrows()]
# 日付の集合。
dates_df = pd.read_csv(in_data_directory("dates.csv"), dtype={"日付": str})
D = [r["日付"] for _, r in dates_df.iterrows()]
# 勤務の集合。
kinmus_df = pd.read_csv(in_data_directory("kinmus.csv"), dtype={"勤務名": str})
K = [r["勤務名"] for _, r in kinmus_df.iterrows()]
# グループの集合。
groups_df = pd.read_csv(in_data_directory("groups.csv"), dtype={"グループ名": str})
G = [r["グループ名"] for _, r in groups_df.iterrows()]
# グループに所属する職員の集合。
group_members_df = pd.read_csv(
    in_data_directory("group_members.csv"), dtype={"グループ名": str, "職員名": str}
)
GM = {
    g: [r["職員名"] for _, r in group_members_df.iterrows()]
    for g, group_members_df in group_members_df.groupby("グループ名")
}
# 連続禁止勤務並びの集合。
renzoku_kinshi_kinmus = pd.read_csv(
    in_data_directory("renzoku_kinshi_kinmus.csv"),
    dtype={"並びID": int, "勤務名": str, "並び順": int},
)
P = [
    [r["勤務名"] for _, r in kinmus.sort_values(by="並び順").iterrows()]
    for _, kinmus in renzoku_kinshi_kinmus.groupby("並びID")
]

# 日付の勤務にグループから割り当てる職員数の下限。
c1_df = pd.read_csv(
    in_data_directory("c1.csv"),
    dtype={"日付": str, "勤務名": str, "グループ名": str, "割り当て職員数下限": int},
)
c1 = {
    d: {
        k: {r["グループ名"]: r["割り当て職員数下限"] for _, r in groups.iterrows()}
        for k, groups in kinmus.groupby("勤務名")
    }
    for d, kinmus in c1_df.groupby("日付")
}
# 日付の勤務にグループから割り当てる職員数の上限。
c2_df = pd.read_csv(
    in_data_directory("c2.csv"),
    dtype={"日付": str, "勤務名": str, "グループ名": str, "割り当て職員数上限": int},
)
c2 = {
    d: {
        k: {r["グループ名"]: r["割り当て職員数上限"] for _, r in groups.iterrows()}
        for k, groups in kinmus.groupby("勤務名")
    }
    for d, kinmus in c2_df.groupby("日付")
}
# 職員の勤務の割り当て数の下限。
c3_df = pd.read_csv(
    in_data_directory("c3.csv"), dtype={"職員名": str, "勤務名": str, "割り当て数下限": int}
)
c3 = {
    s: {r["勤務名"]: r["割り当て数下限"] for _, r in kinmus.iterrows()}
    for s, kinmus in c3_df.groupby("職員名")
}
# 職員の勤務の割り当て数の上限。
c4_df = pd.read_csv(
    in_data_directory("c4.csv"), dtype={"職員名": str, "勤務名": str, "割り当て数上限": int}
)
c4 = {
    s: {r["勤務名"]: r["割り当て数上限"] for _, r in kinmus.iterrows()}
    for s, kinmus in c4_df.groupby("職員名")
}
# 勤務の連続日数の下限。
c5_df = pd.read_csv(in_data_directory("c5.csv"), dtype={"勤務名": str, "連続日数下限": int})
c5 = {r["勤務名"]: r["連続日数下限"] for _, r in c5_df.iterrows()}
# 勤務の連続日数の上限。
c6_df = pd.read_csv(in_data_directory("c6.csv"), dtype={"勤務名": str, "連続日数上限": int})
c6 = {r["勤務名"]: r["連続日数上限"] for _, r in c6_df.iterrows()}
# 勤務の間隔日数の下限。
c7_df = pd.read_csv(in_data_directory("c7.csv"), dtype={"勤務名": str, "間隔日数下限": int})
c7 = {r["勤務名"]: r["間隔日数下限"] for _, r in c7_df.iterrows()}
# 勤務の間隔日数の上限。
c8_df = pd.read_csv(in_data_directory("c8.csv"), dtype={"勤務名": str, "間隔日数上限": int})
c8 = {r["勤務名"]: r["間隔日数上限"] for _, r in c8_df.iterrows()}
# 職員の日付に割り当てる勤務。
c9_df = pd.read_csv(
    in_data_directory("c9.csv"), dtype={"職員名": str, "日付": str, "割り当て勤務名": str}
)
c9 = {
    s: {r["日付"]: r["割り当て勤務名"] for _, r in kinmus.iterrows()}
    for s, kinmus in c9_df.groupby("職員名")
}
# 職員の日付に割り当てない勤務。
c10_df = pd.read_csv(
    in_data_directory("c10.csv"), dtype={"職員名": str, "日付": str, "割り当てない勤務名": str}
)
c10 = {
    s: {r["日付"]: r["割り当てない勤務名"] for _, r in kinmus.iterrows()}
    for s, kinmus in c10_df.groupby("職員名")
}

# 決定変数。
# 職員の日付に勤務が割り当てられているとき1。
x = pulp.LpVariable.dicts("x", (M, D, K), 0, 1, pulp.LpBinary)

problem = pulp.LpProblem("Scheduling", pulp.LpMinimize)

# 目的関数。
problem += sum(
    c1[d][k][g] - sum(x[m][d][k] for m in GM[g])
    for d in D
    if d in c1
    for k in K
    if k in c1[d]
    for g in G
    if g in c1[d][k]
) + sum(
    sum(x[m][d][k] for m in GM[g]) - c2[d][k][g]
    for d in D
    if d in c2
    for k in K
    if k in c2[d]
    for g in G
    if g in c2[d][k]
)

# 各職員の各日付に割り当てる勤務の数は1。
for m in M:
    for d in D:
        problem += sum([x[m][d][k] for k in K]) == 1, ""

for d in D:
    if d not in c1:
        continue
    for k in K:
        if k not in c1[d]:
            continue
        for g in G:
            if g not in c1[d][k]:
                continue
            problem += sum(x[m][d][k] for m in GM[g]) >= c1[d][k][g], ""
for d in D:
    if d not in c2:
        continue
    for k in K:
        if k not in c2[d]:
            continue
        for g in G:
            if g not in c2[d][k]:
                continue
            problem += sum(x[m][d][k] for m in GM[g]) <= c2[d][k][g], ""

for m in M:
    if m not in c3:
        continue
    for k in K:
        if k not in c3[m]:
            continue
        problem += sum(x[m][d][k] for d in D) >= c3[m][k]
for m in M:
    if m not in c4:
        continue
    for k in K:
        if k not in c4[m]:
            continue
        problem += sum(x[m][d][k] for d in D) <= c4[m][k]

for m in M:
    for k in K:
        if k not in c5:
            continue
        for d in D:
            if str(int(d) - c5[k]) not in D:
                continue
            problem += (
                sum(x[m][str(int(d) - i)][k] for i in range(0, c5[k] + 1)) >= c5[k]
            )
for m in M:
    for k in K:
        if k not in c6:
            continue
        for d in D:
            if str(int(d) - c6[k]) not in D:
                continue
            problem += (
                sum(x[m][str(int(d) - i)][k] for i in range(0, c6[k] + 1)) <= c6[k]
            )

for m in M:
    for k in K:
        if k not in c7:
            continue
        for d in D:
            for i in range(2, c7[k] + 1):
                if str(int(d) - i) not in D:
                    continue
                problem += (
                    x[m][str(int(d) - i)][k]
                    - sum(x[m][str(int(d) - j)][k] for j in range(1, i))
                    + x[m][d][k]
                    <= 1
                )
for m in M:
    for k in K:
        if k not in c8:
            continue
        for d in D:
            if str(int(d) - c8[k]) not in D:
                continue
            problem += sum(x[m][str(int(d) - i)][k] for i in range(0, c8[k] + 1)) >= 1

for m in M:
    if m not in c9:
        continue
    for d in D:
        if d not in c9[m]:
            continue
        for k in K:
            if k not in c9[m][d]:
                continue
            problem += x[m][d][k] == 1
for m in M:
    if m not in c10:
        continue
    for d in D:
        if d not in c10[m]:
            continue
        for k in K:
            if k not in c10[m][d]:
                continue
            problem += x[m][d][k] == 0

for m in M:
    for p in P:
        l = len(p) - 1
        for d in D:
            if str(int(d) - l) not in D:
                continue
            problem += (
                sum(x[m][str(int(d) - l + i)][p[i]] for i in range(0, l + 1)) <= l
            )

problem.writeLP("scheduling.lp")

with open("scheduling.txt", "w") as f:
    while True:
        problem.solve()
        print("Status:", pulp.LpStatus[problem.status])
        if pulp.LpStatus[problem.status] != "Optimal":
            break
        lm = max(len(m) for m in M)
        f.write(" " * lm + "|" + "".join([d[-1:] for d in D]) + "|\n")
        f.write("-" * lm + "+" + ("-" * len(D)) + "+\n")
        for m in M:
            f.write(m.rjust(lm) + "|")
            for d in D:
                for k in K:
                    if x[m][d][k].value() == 1:
                        f.write(k)
                        break
            f.write("|\n")
        f.write("-" * lm + "+" + ("-" * len(D)) + "+\n")
        problem += (
            sum(x[m][d][k] for m in M for d in D for k in K if x[m][d][k].value() == 1)
            <= len(M) * len(D) - 1
        )
        break
