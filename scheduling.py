import csv
import datetime
import operator
import os
import pulp

data_directory = os.path.join(os.getcwd(), "data")


def in_data_directory(path):
    return os.path.join(data_directory, path)


def find(iterable, function):
    return next(filter(function, iterable))


def str_to_date(string, format="%Y/%m/%d"):
    return datetime.datetime.strptime(string, format).date()


def date_range(start_date, stop_date):
    for days in range((stop_date - start_date).days):
        yield start_date + datetime.timedelta(days)


one_day = datetime.timedelta(days=1)

# 職員の集合。
with open(in_data_directory("members.csv")) as f:
    members = [
        {"index": index, "name": r["職員名"]} for index, r in enumerate(csv.DictReader(f))
    ]
M = [m["index"] for m in members]
# 日付の集合。
with open(in_data_directory("dates.csv")) as f:
    dates = [
        {"index": index, "name": str(date)}
        for r in csv.DictReader(f)
        for index, date in enumerate(
            date_range(str_to_date(r["開始日"]), str_to_date(r["終了日"]) + one_day)
        )
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
            "date_index": find(dates, lambda d: d["name"] == str(date))["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "group_index": find(groups, lambda g: g["name"] == r["グループ名"])["index"],
            "min_number_of_assignments": int(r["割り当て職員数下限"]),
        }
        for r in csv.DictReader(f)
        for index, date in enumerate(
            date_range(str_to_date(r["開始日"]), str_to_date(r["終了日"]) + one_day)
        )
    ]
# 日付の勤務にグループから割り当てる職員数の上限。
with open(in_data_directory("c2.csv")) as f:
    c2 = [
        {
            "index": index,
            "date_index": find(dates, lambda d: d["name"] == str(date))["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["勤務名"])["index"],
            "group_index": find(groups, lambda g: g["name"] == r["グループ名"])["index"],
            "max_number_of_assignments": int(r["割り当て職員数上限"]),
        }
        for r in csv.DictReader(f)
        for index, date in enumerate(
            date_range(str_to_date(r["開始日"]), str_to_date(r["終了日"]) + one_day)
        )
    ]
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
# 職員の日付に割り当てる勤務。
with open(in_data_directory("c9.csv")) as f:
    c9 = [
        {
            "index": index,
            "member_index": find(members, lambda m: m["name"] == r["職員名"])["index"],
            "date_index": find(dates, lambda d: d["name"] == str(date))["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["割り当て勤務名"])["index"],
        }
        for r in csv.DictReader(f)
        for index, date in enumerate(
            date_range(str_to_date(r["開始日"]), str_to_date(r["終了日"]) + one_day)
        )
    ]
# 職員の日付に割り当てない勤務。
with open(in_data_directory("c10.csv")) as f:
    c10 = [
        {
            "index": index,
            "member_index": find(members, lambda m: m["name"] == r["職員名"])["index"],
            "date_index": find(dates, lambda d: d["name"] == str(date))["index"],
            "kinmu_index": find(kinmus, lambda k: k["name"] == r["割り当てない勤務名"])["index"],
        }
        for r in csv.DictReader(f)
        for index, date in enumerate(
            date_range(str_to_date(r["開始日"]), str_to_date(r["終了日"]) + one_day)
        )
    ]

# 決定変数。
# 職員の日付に勤務が割り当てられているとき1。
x = pulp.LpVariable.dicts("x", (M, D, K), 0, 1, pulp.LpBinary)

problem = pulp.LpProblem("Scheduling", pulp.LpMinimize)

# 目的関数。
problem += sum(
    c["min_number_of_assignments"]
    - sum(x[m][c["date_index"]][c["kinmu_index"]] for m in GM[c["group_index"]])
    for c in c1
) + sum(
    sum(x[m][c["date_index"]][c["kinmu_index"]] for m in GM[c["group_index"]])
    - c["max_number_of_assignments"]
    for c in c2
)

# 各職員の各日付に割り当てる勤務の数は1。
for m in M:
    for d in D:
        problem += sum([x[m][d][k] for k in K]) == 1

for c in c1:
    problem += (
        sum(x[m][c["date_index"]][c["kinmu_index"]] for m in GM[c["group_index"]])
        >= c["min_number_of_assignments"]
    )
for c in c2:
    problem += (
        sum(x[m][c["date_index"]][c["kinmu_index"]] for m in GM[c["group_index"]])
        <= c["max_number_of_assignments"]
    )

for c in c3:
    problem += (
        sum(x[c["member_index"]][d][c["kinmu_index"]] for d in D)
        >= c["min_number_of_assignments"]
    )
for c in c4:
    problem += (
        sum(x[c["member_index"]][d][c["kinmu_index"]] for d in D)
        <= c["max_number_of_assignments"]
    )

for c in c5:
    for m in M:
        for d in D:
            if d - c["min_number_of_days"] not in D:
                continue
            problem += (
                sum(
                    x[m][d - i][c["kinmu_index"]]
                    for i in range(2, c["min_number_of_days"] + 1)
                )
                - (c["min_number_of_days"] - 1) * x[m][d - 1][c["kinmu_index"]]
                + (c["min_number_of_days"] - 1) * x[m][d][c["kinmu_index"]]
                >= 0
            )
for c in c6:
    for m in M:
        for d in D:
            if d - c["max_number_of_days"] not in D:
                continue
            problem += (
                sum(
                    x[m][d - i][c["kinmu_index"]]
                    for i in range(0, c["max_number_of_days"] + 1)
                )
                <= c["max_number_of_days"]
            )

for c in c7:
    for m in M:
        for d in D:
            for i in range(2, c["min_number_of_days"] + 1):
                if d - i not in D:
                    continue
                problem += (
                    x[m][d - i][c["kinmu_index"]]
                    - sum(x[m][d - j][c["kinmu_index"]] for j in range(1, i))
                    + x[m][d][c["kinmu_index"]]
                    <= 1
                )
for c in c8:
    for m in M:
        for d in D:
            if d - c["max_number_of_days"] not in D:
                continue
            problem += (
                sum(
                    x[m][d - i][c["kinmu_index"]]
                    for i in range(0, c["max_number_of_days"] + 1)
                )
                >= 1
            )

for c in c9:
    problem += x[c["member_index"]][c["date_index"]][c["kinmu_index"]] == 1
for c in c10:
    problem += x[c["member_index"]][c["date_index"]][c["kinmu_index"]] == 0

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
