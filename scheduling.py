import csv
import operator
import os
import pulp

data_directory = os.path.join(os.getcwd(), "data")


def in_data_directory(path):
    return os.path.join(data_directory, path)


# 職員の集合。
with open(in_data_directory("members.csv")) as f:
    M = [r["職員名"] for r in csv.DictReader(f)]
# 日付の集合。
with open(in_data_directory("dates.csv")) as f:
    D = [r["日付"] for r in csv.DictReader(f)]
# 勤務の集合。
with open(in_data_directory("kinmus.csv")) as f:
    K = [r["勤務名"] for r in csv.DictReader(f)]
# グループの集合。
with open(in_data_directory("groups.csv")) as f:
    G = [r["グループ名"] for r in csv.DictReader(f)]
# グループに所属する職員の集合。
with open(in_data_directory("group_members.csv")) as f:
    group_members = list(csv.DictReader(f))
GM = {
    group_name: [r["職員名"] for r in group_members if r["グループ名"] == group_name]
    for group_name in list(set(r["グループ名"] for r in group_members))
}
# 連続禁止勤務並びの集合。
with open(in_data_directory("renzoku_kinshi_kinmus.csv")) as f:
    renzoku_kinshi_kinmus = list(csv.DictReader(f))
P = [
    [
        r["勤務名"]
        for r in sorted(renzoku_kinshi_kinmus, key=lambda r: int(r["並び順"]))
        if int(r["並びID"]) == sequence_id
    ]
    for sequence_id in list(set(int(r["並びID"]) for r in renzoku_kinshi_kinmus))
]
# 日付の勤務にグループから割り当てる職員数の下限。
with open(in_data_directory("c1.csv")) as f:
    c1_rs = list(csv.DictReader(f))
c1 = {
    date: {
        kinmu_name: {
            r["グループ名"]: int(r["割り当て職員数下限"])
            for r in c1_rs
            if r["日付"] == date and r["勤務名"] == kinmu_name
        }
        for kinmu_name in list(set(r["勤務名"] for r in c1_rs if r["日付"] == date))
    }
    for date in list(set(r["日付"] for r in c1_rs))
}
# 日付の勤務にグループから割り当てる職員数の上限。
with open(in_data_directory("c2.csv")) as f:
    c2_rs = list(csv.DictReader(f))
c2 = {
    date: {
        kinmu_name: {
            r["グループ名"]: int(r["割り当て職員数上限"])
            for r in c2_rs
            if r["日付"] == date and r["勤務名"] == kinmu_name
        }
        for kinmu_name in list(set(r["勤務名"] for r in c2_rs if r["日付"] == date))
    }
    for date in list(set(r["日付"] for r in c2_rs))
}
# 職員の勤務の割り当て数の下限。
with open(in_data_directory("c3.csv")) as f:
    c3_rs = list(csv.DictReader(f))
c3 = {
    member_name: {r["勤務名"]: int(r["割り当て数下限"]) for r in c3_rs if r["職員名"] == member_name}
    for member_name in list(set(r["職員名"] for r in c3_rs))
}
# 職員の勤務の割り当て数の上限。
with open(in_data_directory("c4.csv")) as f:
    c4_rs = list(csv.DictReader(f))
c4 = {
    member_name: {r["勤務名"]: int(r["割り当て数上限"]) for r in c4_rs if r["職員名"] == member_name}
    for member_name in list(set(r["職員名"] for r in c4_rs))
}
# 勤務の連続日数の下限。
with open(in_data_directory("c5.csv")) as f:
    c5 = {r["勤務名"]: int(r["連続日数下限"]) for r in list(csv.DictReader(f))}
# 勤務の連続日数の上限。
with open(in_data_directory("c6.csv")) as f:
    c6 = {r["勤務名"]: int(r["連続日数上限"]) for r in list(csv.DictReader(f))}
# 勤務の間隔日数の下限。
with open(in_data_directory("c7.csv")) as f:
    c7 = {r["勤務名"]: int(r["間隔日数下限"]) for r in list(csv.DictReader(f))}
# 勤務の間隔日数の上限。
with open(in_data_directory("c8.csv")) as f:
    c8 = {r["勤務名"]: int(r["間隔日数上限"]) for r in list(csv.DictReader(f))}
# 職員の日付に割り当てる勤務。
with open(in_data_directory("c9.csv")) as f:
    c9_rs = list(csv.DictReader(f))
c9 = {
    member_name: {r["日付"]: r["割り当て勤務名"] for r in c9_rs if r["職員名"] == member_name}
    for member_name in list(set(r["職員名"] for r in c9_rs))
}
# 職員の日付に割り当てない勤務。
with open(in_data_directory("c10.csv")) as f:
    c10_rs = list(csv.DictReader(f))
c10 = {
    member_name: {r["日付"]: r["割り当てない勤務名"] for r in c10_rs if r["職員名"] == member_name}
    for member_name in list(set(r["職員名"] for r in c10_rs))
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
