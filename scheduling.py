import csv
import operator
import os
import pulp

data_directory = os.path.join(os.getcwd(), "data")


def in_data_directory(path):
    return os.path.join(data_directory, path)


def find(iterable, function):
    return next(filter(function, iterable))


# 職員の集合。
with open(in_data_directory("members.csv")) as f:
    members = [
        {"index": index, "name": r["職員名"]} for index, r in enumerate(csv.DictReader(f))
    ]
M = [m["index"] for m in members]
# 日付の集合。
with open(in_data_directory("dates.csv")) as f:
    dates = [
        {"index": index, "name": r["日付"]} for index, r in enumerate(csv.DictReader(f))
    ]
D = [d["index"] for d in dates]
# 勤務の集合。
with open(in_data_directory("kinmus.csv")) as f:
    kinmus = [
        {"index": index, "name": r["勤務名"]} for index, r in enumerate(csv.DictReader(f))
    ]
K = [k["index"] for k in kinmus]
# グループの集合。
with open(in_data_directory("groups.csv")) as f:
    groups = [
        {"index": index, "name": r["グループ名"]}
        for index, r in enumerate(csv.DictReader(f))
    ]
G = [g["index"] for g in groups]
# グループに所属する職員の集合。
with open(in_data_directory("group_members.csv")) as f:
    group_members = [
        {
            "index": index,
            "group_index": find(groups, lambda g: g["name"] == r["グループ名"])["index"],
            "member_index": find(members, lambda m: m["name"] == r["職員名"])["index"],
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
GM = {
    g: [gm["member_index"] for gm in group_members if gm["group_index"] == g] for g in G
}
# 連続禁止勤務並びの集合。
with open(in_data_directory("renzoku_kinshi_kinmus.csv")) as f:
    renzoku_kinshi_kinmus = [
        {
            "index": index,
            "sequence_id": r["並びID"],
            "sequence_number": int(r["並び順"]),
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
P = [
    [
        r["kinmu_index"]
        for r in sorted(
            renzoku_kinshi_kinmus, key=operator.itemgetter("sequence_number")
        )
        if r["sequence_id"] == sequence_id
    ]
    for sequence_id in list(set(r["sequence_id"] for r in renzoku_kinshi_kinmus))
]
# 日付の勤務にグループから割り当てる職員数の下限。
with open(in_data_directory("c1.csv")) as f:
    c1 = [
        {
            "index": index,
            "date_index": find(dates, lambda d: d["name"] == r["日付"])["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "group_index": find(groups, lambda g: g["name"] == r["グループ名"])["index"],
            "min_number_of_assignments": int(r["割り当て職員数下限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C1 = {
    d: {
        k: {
            c["group_index"]: c["min_number_of_assignments"]
            for c in c1
            if c["date_index"] == d and c["kinmu_index"] == k
        }
        for k in list(set(c["kinmu_index"] for c in c1 if c["date_index"] == d))
    }
    for d in list(set(c["date_index"] for c in c1))
}
# 日付の勤務にグループから割り当てる職員数の上限。
with open(in_data_directory("c2.csv")) as f:
    c2 = [
        {
            "index": index,
            "date_index": find(dates, lambda d: d["name"] == r["日付"])["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "group_index": find(groups, lambda g: g["name"] == r["グループ名"])["index"],
            "max_number_of_assignments": int(r["割り当て職員数上限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C2 = {
    d: {
        k: {
            c["group_index"]: c["max_number_of_assignments"]
            for c in c2
            if c["date_index"] == d and c["kinmu_index"] == k
        }
        for k in list(set(c["kinmu_index"] for c in c2 if c["date_index"] == d))
    }
    for d in list(set(c["date_index"] for c in c2))
}
# 職員の勤務の割り当て数の下限。
with open(in_data_directory("c3.csv")) as f:
    c3 = [
        {
            "index": index,
            "member_index": find(members, lambda m: m["name"] == r["職員名"])["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "min_number_of_assignments": int(r["割り当て数下限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C3 = {
    m: {
        c["kinmu_index"]: c["min_number_of_assignments"]
        for c in c3
        if c["member_index"] == m
    }
    for m in list(set(c["member_index"] for c in c3))
}
# 職員の勤務の割り当て数の上限。
with open(in_data_directory("c4.csv")) as f:
    c4 = [
        {
            "index": index,
            "member_index": find(members, lambda m: m["name"] == r["職員名"])["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "max_number_of_assignments": int(r["割り当て数上限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C4 = {
    m: {
        c["kinmu_index"]: c["max_number_of_assignments"]
        for c in c4
        if c["member_index"] == m
    }
    for m in list(set(c["member_index"] for c in c4))
}
# 勤務の連続日数の下限。
with open(in_data_directory("c5.csv")) as f:
    c5 = [
        {
            "index": index,
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "min_number_of_days": int(r["連続日数下限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C5 = {c["kinmu_index"]: c["min_number_of_days"] for c in c5}
# 勤務の連続日数の上限。
with open(in_data_directory("c6.csv")) as f:
    c6 = [
        {
            "index": index,
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "max_number_of_days": int(r["連続日数上限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C6 = {c["kinmu_index"]: c["max_number_of_days"] for c in c6}
# 勤務の間隔日数の下限。
with open(in_data_directory("c7.csv")) as f:
    c7 = [
        {
            "index": index,
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "min_number_of_days": int(r["間隔日数下限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C7 = {c["kinmu_index"]: c["min_number_of_days"] for c in c7}
# 勤務の間隔日数の上限。
with open(in_data_directory("c8.csv")) as f:
    c8 = [
        {
            "index": index,
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "max_number_of_days": int(r["間隔日数上限"]),
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C8 = {c["kinmu_index"]: c["max_number_of_days"] for c in c8}
# 職員の日付に割り当てる勤務。
with open(in_data_directory("c9.csv")) as f:
    c9 = [
        {
            "index": index,
            "member_index": find(members, lambda m: m["name"] == r["職員名"])["index"],
            "date_index": find(dates, lambda d: d["name"] == r["日付"])["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["割り当て勤務名"])["index"],
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C9 = {
    m: {c["date_index"]: c["kinmu_index"] for c in c9 if c["member_index"] == m}
    for m in list(set(c["member_index"] for c in c9))
}
# 職員の日付に割り当てない勤務。
with open(in_data_directory("c10.csv")) as f:
    c10 = [
        {
            "index": index,
            "member_index": find(members, lambda m: m["name"] == r["職員名"])["index"],
            "date_index": find(dates, lambda d: d["name"] == r["日付"])["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["割り当てない勤務名"])["index"],
        }
        for index, r in enumerate(csv.DictReader(f))
    ]
C10 = {
    m: {c["date_index"]: c["kinmu_index"] for c in c10 if c["member_index"] == m}
    for m in list(set(c["member_index"] for c in c10))
}

# 決定変数。
# 職員の日付に勤務が割り当てられているとき1。
x = pulp.LpVariable.dicts("x", (M, D, K), 0, 1, pulp.LpBinary)

problem = pulp.LpProblem("Scheduling", pulp.LpMinimize)

# 目的関数。
problem += sum(
    C1[d][k][g] - sum(x[m][d][k] for m in GM[g])
    for d in D
    if d in C1
    for k in K
    if k in C1[d]
    for g in G
    if g in C1[d][k]
) + sum(
    sum(x[m][d][k] for m in GM[g]) - C2[d][k][g]
    for d in D
    if d in C2
    for k in K
    if k in C2[d]
    for g in G
    if g in C2[d][k]
)

# 各職員の各日付に割り当てる勤務の数は1。
for m in M:
    for d in D:
        problem += sum([x[m][d][k] for k in K]) == 1, ""

for d in D:
    if d not in C1:
        continue
    for k in K:
        if k not in C1[d]:
            continue
        for g in G:
            if g not in C1[d][k]:
                continue
            problem += sum(x[m][d][k] for m in GM[g]) >= C1[d][k][g], ""
for d in D:
    if d not in C2:
        continue
    for k in K:
        if k not in C2[d]:
            continue
        for g in G:
            if g not in C2[d][k]:
                continue
            problem += sum(x[m][d][k] for m in GM[g]) <= C2[d][k][g], ""

for m in M:
    if m not in C3:
        continue
    for k in K:
        if k not in C3[m]:
            continue
        problem += sum(x[m][d][k] for d in D) >= C3[m][k]
for m in M:
    if m not in C4:
        continue
    for k in K:
        if k not in C4[m]:
            continue
        problem += sum(x[m][d][k] for d in D) <= C4[m][k]

for m in M:
    for k in K:
        if k not in C5:
            continue
        for d in D:
            if d - C5[k] not in D:
                continue
            problem += sum(x[m][d - i][k] for i in range(0, C5[k] + 1)) >= C5[k]
for m in M:
    for k in K:
        if k not in C6:
            continue
        for d in D:
            if d - C6[k] not in D:
                continue
            problem += sum(x[m][d - i][k] for i in range(0, C6[k] + 1)) <= C6[k]

for m in M:
    for k in K:
        if k not in C7:
            continue
        for d in D:
            for i in range(2, C7[k] + 1):
                if d - i not in D:
                    continue
                problem += (
                    x[m][d - i][k]
                    - sum(x[m][d - j][k] for j in range(1, i))
                    + x[m][d][k]
                    <= 1
                )
for m in M:
    for k in K:
        if k not in C8:
            continue
        for d in D:
            if d - C8[k] not in D:
                continue
            problem += sum(x[m][d - i][k] for i in range(0, C8[k] + 1)) >= 1

for m in M:
    if m not in C9:
        continue
    for d in D:
        if d not in C9[m]:
            continue
        for k in K:
            if k not in C9[m][d]:
                continue
            problem += x[m][d][k] == 1
for m in M:
    if m not in C10:
        continue
    for d in D:
        if d not in C10[m]:
            continue
        for k in K:
            if k not in C10[m][d]:
                continue
            problem += x[m][d][k] == 0

for m in M:
    for p in P:
        l = len(p) - 1
        for d in D:
            if d - l not in D:
                continue
            problem += sum(x[m][d - l + i][p[i]] for i in range(0, l + 1)) <= l

problem.writeLP("scheduling.lp")

with open("scheduling.txt", "w") as f:
    while True:
        problem.solve()
        print("Status:", pulp.LpStatus[problem.status])
        if pulp.LpStatus[problem.status] != "Optimal":
            break
        lm = max(len(m["name"]) for m in members)
        f.write(" " * lm + "|" + "".join([d["name"][-1:] for d in dates]) + "|\n")
        f.write("-" * lm + "+" + ("-" * len(D)) + "+\n")
        for m in members:
            f.write(m["name"].rjust(lm) + "|")
            for d in D:
                for k in kinmus:
                    if x[m["index"]][d][k["index"]].value() == 1:
                        f.write(k["name"])
                        break
            f.write("|\n")
        f.write("-" * lm + "+" + ("-" * len(D)) + "+\n")
        problem += (
            sum(x[m][d][k] for m in M for d in D for k in K if x[m][d][k].value() == 1)
            <= len(M) * len(D) - 1
        )
        break
