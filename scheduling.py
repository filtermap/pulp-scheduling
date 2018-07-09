import csv
import datetime
import operator
import os
import pulp

one_day = datetime.timedelta(days=1)
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


def write_rows(rows, filename, fieldnames):
    with open(in_data_directory(filename), newline="") as f:
        header = next(f)
    with open(in_data_directory(filename), "w", newline="") as f:
        f.write(header)
        csv.DictWriter(f, fieldnames, extrasaction="ignore").writerows(rows)


def read_members():
    """職員の集合。"""
    with open(in_data_directory("members.csv")) as f:
        next(f)
        members = [
            {"index": index, "name": r["職員名"]}
            for index, r in enumerate(csv.DictReader(f, ["職員名"]))
        ]
    return members


def write_members(members):
    write_rows(members, "members.csv", ["name"])


def read_terms():
    """期間の集合。"""
    with open(in_data_directory("terms.csv")) as f:
        next(f)
        terms = [
            {"index": index, "start_date_name": r["開始日"], "stop_date_name": r["終了日"]}
            for index, r in enumerate(csv.DictReader(f, ["開始日", "終了日"]))
        ]
    return terms


def write_terms(terms):
    write_rows(terms, "terms.csv", ["start_date_name", "stop_date_name"])


def read_kinmus():
    """勤務の集合。"""
    with open(in_data_directory("kinmus.csv")) as f:
        next(f)
        kinmus = [
            {"index": index, "name": r["勤務名"]}
            for index, r in enumerate(csv.DictReader(f, ["勤務名"]))
        ]
    return kinmus


def write_kinmus(kinmus):
    write_rows(kinmus, "kinmus.csv", ["name"])


def read_groups():
    """グループの集合。"""
    with open(in_data_directory("groups.csv")) as f:
        next(f)
        groups = [
            {"index": index, "name": r["グループ名"]}
            for index, r in enumerate(csv.DictReader(f, ["グループ名"]))
        ]
    return groups


def write_groups(groups):
    write_rows(groups, "groups.csv", ["name"])


def read_group_members(groups, members):
    """グループに所属する職員の集合。"""
    with open(in_data_directory("group_members.csv")) as f:
        next(f)
        group_members = [
            {
                "index": index,
                "group_index": find(groups, lambda group: group["name"] == r["グループ名"])[
                    "index"
                ],
                "member_index": find(
                    members, lambda member: member["name"] == r["職員名"]
                )["index"],
            }
            for index, r in enumerate(csv.DictReader(f, ["グループ名", "職員名"]))
        ]
    return group_members


def write_group_members(group_members, groups, members):
    rows = [
        {
            "group_name": find(
                groups, lambda group: group["index"] == group_member["group_index"]
            )["name"],
            "member_name": find(
                members, lambda member: member["index"] == group_member["member_index"]
            )["name"],
        }
        for group_member in group_members
    ]
    write_rows(rows, "group_members.csv", ["group_name", "member_name"])


def read_renzoku_kinshi_kinmus(kinmus):
    """連続禁止勤務並びの集合。"""
    with open(in_data_directory("renzoku_kinshi_kinmus.csv")) as f:
        next(f)
        renzoku_kinshi_kinmus = [
            {
                "index": index,
                "sequence_id": r["並びID"],
                "sequence_number": int(r["並び順"]),
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
            }
            for index, r in enumerate(csv.DictReader(f, ["並びID", "勤務名", "並び順"]))
        ]
    return renzoku_kinshi_kinmus


def write_renzoku_kinshi_kinmus(renzoku_kinshi_kinmus, kinmus):
    rows = [
        {
            "sequence_id": renzoku_kinshi_kinmu["sequence_id"],
            "kinmu_name": find(
                kinmus,
                lambda kinmu: kinmu["index"] == renzoku_kinshi_kinmu["kinmu_index"],
            )["name"],
            "sequence_number": renzoku_kinshi_kinmu["sequence_number"],
        }
        for renzoku_kinshi_kinmu in renzoku_kinshi_kinmus
    ]
    write_rows(
        rows,
        "renzoku_kinshi_kinmus.csv",
        ["sequence_id", "kinmu_name", "sequence_number"],
    )


def read_c1(kinmus, groups):
    """期間の勤務にグループから割り当てる職員数の下限。"""
    with open(in_data_directory("c1.csv")) as f:
        next(f)
        c1 = [
            {
                "index": index,
                "start_date_name": r["開始日"],
                "stop_date_name": r["終了日"],
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "group_index": find(groups, lambda group: group["name"] == r["グループ名"])[
                    "index"
                ],
                "min_number_of_assignments": int(r["割り当て職員数下限"]),
            }
            for index, r in enumerate(
                csv.DictReader(f, ["開始日", "終了日", "勤務名", "グループ名", "割り当て職員数下限"])
            )
        ]
    return c1


def write_c1(c1, kinmus, groups):
    rows = [
        {
            "start_date_name": c["start_date_name"],
            "stop_date_name": c["stop_date_name"],
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "group_name": find(
                groups, lambda group: group["index"] == c["group_index"]
            )["name"],
            "min_number_of_assignments": c["min_number_of_assignments"],
        }
        for c in c1
    ]
    write_rows(
        rows,
        "c1.csv",
        [
            "start_date_name",
            "stop_date_name",
            "kinmu_name",
            "group_name",
            "min_number_of_assignments",
        ],
    )


def read_c2(kinmus, groups):
    """日付の勤務にグループから割り当てる職員数の上限。"""
    with open(in_data_directory("c2.csv")) as f:
        next(f)
        c2 = [
            {
                "index": index,
                "start_date_name": r["開始日"],
                "stop_date_name": r["終了日"],
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "group_index": find(groups, lambda group: group["name"] == r["グループ名"])[
                    "index"
                ],
                "max_number_of_assignments": int(r["割り当て職員数上限"]),
            }
            for index, r in enumerate(
                csv.DictReader(f, ["開始日", "終了日", "勤務名", "グループ名", "割り当て職員数上限"])
            )
        ]
    return c2


def write_c2(c2, kinmus, groups):
    rows = [
        {
            "start_date_name": c["start_date_name"],
            "stop_date_name": c["stop_date_name"],
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "group_name": find(
                groups, lambda group: group["index"] == c["group_index"]
            )["name"],
            "max_number_of_assignments": c["max_number_of_assignments"],
        }
        for c in c2
    ]
    write_rows(
        rows,
        "c2.csv",
        [
            "start_date_name",
            "stop_date_name",
            "kinmu_name",
            "group_name",
            "max_number_of_assignments",
        ],
    )


def read_c3(members, kinmus):
    """職員の勤務の割り当て数の下限。"""
    with open(in_data_directory("c3.csv")) as f:
        next(f)
        c3 = [
            {
                "index": index,
                "member_index": find(
                    members, lambda member: member["name"] == r["職員名"]
                )["index"],
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "min_number_of_assignments": int(r["割り当て数下限"]),
            }
            for index, r in enumerate(csv.DictReader(f, ["職員名", "勤務名", "割り当て数下限"]))
        ]
    return c3


def write_c3(c3, members, kinmus):
    rows = [
        {
            "member_name": find(
                members, lambda member: member["index"] == c["member_index"]
            )["name"],
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "min_number_of_assignments": c["min_number_of_assignments"],
        }
        for c in c3
    ]
    write_rows(
        rows, "c3.csv", ["member_name", "kinmu_name", "min_number_of_assignments"]
    )


def read_c4(members, kinmus):
    """職員の勤務の割り当て数の上限。"""
    with open(in_data_directory("c4.csv")) as f:
        next(f)
        c4 = [
            {
                "index": index,
                "member_index": find(
                    members, lambda member: member["name"] == r["職員名"]
                )["index"],
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "max_number_of_assignments": int(r["割り当て数上限"]),
            }
            for index, r in enumerate(csv.DictReader(f, ["職員名", "勤務名", "割り当て数上限"]))
        ]
    return c4


def write_c4(c4, members, kinmus):
    rows = [
        {
            "member_name": find(
                members, lambda member: member["index"] == c["member_index"]
            )["name"],
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "max_number_of_assignments": c["max_number_of_assignments"],
        }
        for c in c4
    ]
    write_rows(
        rows, "c4.csv", ["member_name", "kinmu_name", "max_number_of_assignments"]
    )


def read_c5(kinmus):
    """勤務の連続日数の下限。"""
    with open(in_data_directory("c5.csv")) as f:
        next(f)
        c5 = [
            {
                "index": index,
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "min_number_of_days": int(r["連続日数下限"]),
            }
            for index, r in enumerate(csv.DictReader(f, ["勤務名", "連続日数下限"]))
        ]
    return c5


def write_c5(c5, kinmus):
    rows = [
        {
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "min_number_of_days": c["min_number_of_days"],
        }
        for c in c5
    ]
    write_rows(rows, "c5.csv", ["kinmu_name", "min_number_of_days"])


def read_c6(kinmus):
    """勤務の連続日数の上限。"""
    with open(in_data_directory("c6.csv")) as f:
        next(f)
        c6 = [
            {
                "index": index,
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "max_number_of_days": int(r["連続日数上限"]),
            }
            for index, r in enumerate(csv.DictReader(f, ["勤務名", "連続日数上限"]))
        ]
    return c6


def write_c6(c6, kinmus):
    rows = [
        {
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "max_number_of_days": c["max_number_of_days"],
        }
        for c in c6
    ]
    write_rows(rows, "c6.csv", ["kinmu_name", "max_number_of_days"])


def read_c7(kinmus):
    """勤務の間隔日数の下限。"""
    with open(in_data_directory("c7.csv")) as f:
        next(f)
        c7 = [
            {
                "index": index,
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "min_number_of_days": int(r["間隔日数下限"]),
            }
            for index, r in enumerate(csv.DictReader(f, ["勤務名", "間隔日数下限"]))
        ]
    return c7


def write_c7(c7, kinmus):
    rows = [
        {
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "min_number_of_days": c["min_number_of_days"],
        }
        for c in c7
    ]
    write_rows(rows, "c7.csv", ["kinmu_name", "min_number_of_days"])


def read_c8(kinmus):
    """勤務の間隔日数の上限。"""
    with open(in_data_directory("c8.csv")) as f:
        next(f)
        c8 = [
            {
                "index": index,
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
                "max_number_of_days": int(r["間隔日数上限"]),
            }
            for index, r in enumerate(csv.DictReader(f, ["勤務名", "間隔日数上限"]))
        ]
    return c8


def write_c8(c8, kinmus):
    rows = [
        {
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
            "max_number_of_days": c["max_number_of_days"],
        }
        for c in c8
    ]
    write_rows(rows, "c8.csv", ["kinmu_name", "max_number_of_days"])


def read_c9(members, kinmus):
    """職員の日付に割り当てる勤務。"""
    with open(in_data_directory("c9.csv")) as f:
        next(f)
        c9 = [
            {
                "index": index,
                "member_index": find(
                    members, lambda member: member["name"] == r["職員名"]
                )["index"],
                "start_date_name": r["開始日"],
                "stop_date_name": r["終了日"],
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
            }
            for index, r in enumerate(csv.DictReader(f, ["職員名", "開始日", "終了日", "勤務名"]))
        ]
    return c9


def write_c9(c9, members, kinmus):
    rows = [
        {
            "member_name": find(
                members, lambda member: member["index"] == c["member_index"]
            )["name"],
            "start_date_name": c["start_date_name"],
            "stop_date_name": c["stop_date_name"],
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
        }
        for c in c9
    ]
    write_rows(
        rows,
        "c9.csv",
        ["member_name", "start_date_name", "stop_date_name", "kinmu_name"],
    )


def read_c10(members, kinmus):
    """職員の日付に割り当てない勤務。"""
    with open(in_data_directory("c10.csv")) as f:
        next(f)
        c10 = [
            {
                "index": index,
                "member_index": find(
                    members, lambda member: member["name"] == r["職員名"]
                )["index"],
                "start_date_name": r["開始日"],
                "stop_date_name": r["終了日"],
                "kinmu_index": find(kinmus, lambda kinmu: kinmu["name"] == r["勤務名"])[
                    "index"
                ],
            }
            for index, r in enumerate(csv.DictReader(f, ["職員名", "開始日", "終了日", "勤務名"]))
        ]
    return c10


def write_c10(c10, members, kinmus):
    rows = [
        {
            "member_name": find(
                members, lambda member: member["index"] == c["member_index"]
            )["name"],
            "start_date_name": c["start_date_name"],
            "stop_date_name": c["stop_date_name"],
            "kinmu_name": find(
                kinmus, lambda kinmu: kinmu["index"] == c["kinmu_index"]
            )["name"],
        }
        for c in c10
    ]
    write_rows(
        rows,
        "c10.csv",
        ["member_name", "start_date_name", "stop_date_name", "kinmu_name"],
    )


def solve():
    members = read_members()
    terms = read_terms()
    kinmus = read_kinmus()
    groups = read_groups()
    group_members = read_group_members(groups, members)
    renzoku_kinshi_kinmus = read_renzoku_kinshi_kinmus(kinmus)
    c1 = read_c1(kinmus, groups)
    c2 = read_c2(kinmus, groups)
    c3 = read_c3(members, kinmus)
    c4 = read_c4(members, kinmus)
    c5 = read_c5(kinmus)
    c6 = read_c6(kinmus)
    c7 = read_c7(kinmus)
    c8 = read_c8(kinmus)
    c9 = read_c9(members, kinmus)
    c10 = read_c10(members, kinmus)

    dates = [
        {"index": index, "name": str(date)}
        for term in terms
        for index, date in enumerate(
            date_range(
                str_to_date(term["start_date_name"]),
                str_to_date(term["stop_date_name"]) + one_day,
            )
        )
    ]

    M = [m["index"] for m in members]
    D = [d["index"] for d in dates]
    K = [k["index"] for k in kinmus]
    G = [g["index"] for g in groups]
    GM = {
        g: [
            group_member["member_index"]
            for group_member in group_members
            if group_member["group_index"] == g
        ]
        for g in G
    }
    P = [
        [
            renzoku_kinshi_kinmu["kinmu_index"]
            for renzoku_kinshi_kinmu in sorted(
                renzoku_kinshi_kinmus, key=operator.itemgetter("sequence_number")
            )
            if renzoku_kinshi_kinmu["sequence_id"] == sequence_id
        ]
        for sequence_id in list(
            set(
                renzoku_kinshi_kinmu["sequence_id"]
                for renzoku_kinshi_kinmu in renzoku_kinshi_kinmus
            )
        )
    ]
    C1 = [
        {
            "index": index,
            "date_index": find(dates, lambda date: date["name"] == date_name)["index"],
            "kinmu_index": c["kinmu_index"],
            "group_index": c["group_index"],
            "min_number_of_assignments": c["min_number_of_assignments"],
        }
        for index, (c, date_name) in enumerate(
            (c, str(date))
            for c in c1
            for date in date_range(
                str_to_date(c["start_date_name"]),
                str_to_date(c["stop_date_name"]) + one_day,
            )
        )
    ]
    C2 = [
        {
            "index": index,
            "date_index": find(dates, lambda date: date["name"] == date_name)["index"],
            "kinmu_index": c["kinmu_index"],
            "group_index": c["group_index"],
            "max_number_of_assignments": c["max_number_of_assignments"],
        }
        for index, (c, date_name) in enumerate(
            (c, str(date))
            for c in c2
            for date in date_range(
                str_to_date(c["start_date_name"]),
                str_to_date(c["stop_date_name"]) + one_day,
            )
        )
    ]
    C3 = [
        {
            "index": index,
            "member_index": c["member_index"],
            "kinmu_index": c["kinmu_index"],
            "min_number_of_assignments": c["min_number_of_assignments"],
        }
        for index, c in enumerate(c3)
    ]
    C4 = [
        {
            "index": index,
            "member_index": c["member_index"],
            "kinmu_index": c["kinmu_index"],
            "max_number_of_assignments": c["max_number_of_assignments"],
        }
        for index, c in enumerate(c4)
    ]
    C5 = [
        {
            "index": index,
            "kinmu_index": c["kinmu_index"],
            "min_number_of_days": c["min_number_of_days"],
        }
        for index, c in enumerate(c5)
    ]
    C6 = [
        {
            "index": index,
            "kinmu_index": c["kinmu_index"],
            "max_number_of_days": c["max_number_of_days"],
        }
        for index, c in enumerate(c6)
    ]
    C7 = [
        {
            "index": index,
            "kinmu_index": c["kinmu_index"],
            "min_number_of_days": c["min_number_of_days"],
        }
        for index, c in enumerate(c7)
    ]
    C8 = [
        {
            "index": index,
            "kinmu_index": c["kinmu_index"],
            "max_number_of_days": c["max_number_of_days"],
        }
        for index, c in enumerate(c8)
    ]
    C9 = [
        {
            "index": index,
            "member_index": c["member_index"],
            "date_index": find(dates, lambda date: date["name"] == date_name)["index"],
            "kinmu_index": c["kinmu_index"],
        }
        for index, (c, date_name) in enumerate(
            (c, str(date))
            for c in c9
            for date in date_range(
                str_to_date(c["start_date_name"]),
                str_to_date(c["stop_date_name"]) + one_day,
            )
        )
    ]
    C10 = [
        {
            "index": index,
            "member_index": c["member_index"],
            "date_index": find(dates, lambda date: date["name"] == date_name)["index"],
            "kinmu_index": c["kinmu_index"],
        }
        for index, (c, date_name) in enumerate(
            (c, str(date))
            for c in c10
            for date in date_range(
                str_to_date(c["start_date_name"]),
                str_to_date(c["stop_date_name"]) + one_day,
            )
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
        for c in C1
    ) + sum(
        sum(x[m][c["date_index"]][c["kinmu_index"]] for m in GM[c["group_index"]])
        - c["max_number_of_assignments"]
        for c in C2
    )

    # 各職員の各日付に割り当てる勤務の数は1。
    for m in M:
        for d in D:
            problem += sum([x[m][d][k] for k in K]) == 1

    for m in M:
        for p in P:
            l = len(p) - 1
            for d in D:
                if d - l not in D:
                    continue
                problem += sum(x[m][d - l + i][p[i]] for i in range(0, l + 1)) <= l
    for c in C1:
        problem += (
            sum(x[m][c["date_index"]][c["kinmu_index"]] for m in GM[c["group_index"]])
            >= c["min_number_of_assignments"]
        )
    for c in C2:
        problem += (
            sum(x[m][c["date_index"]][c["kinmu_index"]] for m in GM[c["group_index"]])
            <= c["max_number_of_assignments"]
        )
    for c in C3:
        problem += (
            sum(x[c["member_index"]][d][c["kinmu_index"]] for d in D)
            >= c["min_number_of_assignments"]
        )
    for c in C4:
        problem += (
            sum(x[c["member_index"]][d][c["kinmu_index"]] for d in D)
            <= c["max_number_of_assignments"]
        )
    for c in C5:
        for m in M:
            for d in D:
                if d - 1 not in D:
                    continue
                min_number_of_days = (
                    c["min_number_of_days"] if d - c["min_number_of_days"] >= 0 else d
                )
                problem += (
                    sum(
                        x[m][d - i][c["kinmu_index"]]
                        for i in range(2, min_number_of_days + 1)
                    )
                    - (min_number_of_days - 1) * x[m][d - 1][c["kinmu_index"]]
                    + (min_number_of_days - 1) * x[m][d][c["kinmu_index"]]
                    >= 0
                )
    for c in C6:
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
    for c in C7:
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
    for c in C8:
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
    for c in C9:
        problem += x[c["member_index"]][c["date_index"]][c["kinmu_index"]] == 1
    for c in C10:
        problem += x[c["member_index"]][c["date_index"]][c["kinmu_index"]] == 0

    problem.writeLP("scheduling.lp")

    solved = False
    with open("scheduling.txt", "w") as f:
        while True:
            problem.solve()
            print("Status:", pulp.LpStatus[problem.status])
            if pulp.LpStatus[problem.status] != "Optimal":
                return solved
            solved = True
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
                sum(
                    x[m][d][k]
                    for m in M
                    for d in D
                    for k in K
                    if x[m][d][k].value() == 1
                )
                <= len(M) * len(D) - 1
            )
            return solved


if __name__ == "__main__":
    solve()
