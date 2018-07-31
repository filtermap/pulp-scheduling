import csv
import datetime
import operator
import os
import pulp
import utils


class UnsolvedException(Exception):
    pass


one_day = datetime.timedelta(days=1)
data_directory = os.path.join(os.getcwd(), "data")


def in_data_directory(path):
    return os.path.join(data_directory, path)


def write_rows(rows, filename, fieldnames):
    with open(in_data_directory(filename), newline="") as f:
        header = next(f)
    with open(in_data_directory(filename), "w", newline="") as f:
        f.write(header)
        csv.DictWriter(f, fieldnames, extrasaction="ignore").writerows(rows)


members_filename = "members.csv"
member_attribute_names = ["id", "is_enabled", "name"]


def read_members():
    with open(in_data_directory(members_filename)) as f:
        next(f)
        members = [
            {**r, "id": int(r["id"]), "is_enabled": int(r["is_enabled"]) != 0}
            for r in csv.DictReader(f, member_attribute_names)
        ]
    return members


def write_members(members):
    rows = [
        {**member, "is_enabled": 1 if member["is_enabled"] else 0} for member in members
    ]
    write_rows(rows, members_filename, member_attribute_names)


terms_filename = "terms.csv"
term_attribute_names = ["id", "start_date_name", "stop_date_name"]


def read_terms():
    with open(in_data_directory(terms_filename)) as f:
        next(f)
        terms = [
            {**r, "id": int(r["id"])} for r in csv.DictReader(f, term_attribute_names)
        ]
    return terms


def write_terms(terms):
    write_rows(terms, terms_filename, term_attribute_names)


kinmus_filename = "kinmus.csv"
kinmu_attribute_names = ["id", "is_enabled", "name"]


def read_kinmus():
    with open(in_data_directory(kinmus_filename)) as f:
        next(f)
        kinmus = [
            {**r, "id": int(r["id"]), "is_enabled": int(r["is_enabled"]) != 0}
            for r in csv.DictReader(f, kinmu_attribute_names)
        ]
    return kinmus


def write_kinmus(kinmus):
    rows = [
        {**kinmu, "is_enabled": 1 if kinmu["is_enabled"] else 0} for kinmu in kinmus
    ]
    write_rows(rows, kinmus_filename, kinmu_attribute_names)


groups_filename = "groups.csv"
group_attribute_names = ["id", "is_enabled", "name"]


def read_groups():
    with open(in_data_directory(groups_filename)) as f:
        next(f)
        groups = [
            {**r, "id": int(r["id"]), "is_enabled": int(r["is_enabled"]) != 0}
            for r in csv.DictReader(f, group_attribute_names)
        ]
    return groups


def write_groups(groups):
    rows = [
        {**group, "is_enabled": 1 if group["is_enabled"] else 0} for group in groups
    ]
    write_rows(rows, groups_filename, group_attribute_names)


group_members_filename = "group_members.csv"
group_member_attribute_names = ["id", "group_id", "member_id"]


def read_group_members():
    with open(in_data_directory(group_members_filename)) as f:
        next(f)
        group_members = [
            {
                **r,
                "id": int(r["id"]),
                "group_id": int(r["group_id"]),
                "member_id": int(r["member_id"]),
            }
            for r in csv.DictReader(f, group_member_attribute_names)
        ]
    return group_members


def write_group_members(group_members):
    write_rows(group_members, group_members_filename, group_member_attribute_names)


c0_filename = "c0.csv"
c0_attribute_names = ["id", "is_enabled"]


def read_c0():
    with open(in_data_directory(c0_filename)) as f:
        next(f)
        c0 = [
            {**r, "id": int(r["id"]), "is_enabled": int(r["is_enabled"]) != 0}
            for r in csv.DictReader(f, c0_attribute_names)
        ]
    return c0


def write_c0(c0):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c0]
    write_rows(rows, c0_filename, c0_attribute_names)


c0_kinmus_filename = "c0_kinmus.csv"
c0_kinmu_attribute_names = ["id", "c0_id", "sequence_number", "kinmu_id"]


def read_c0_kinmus():
    with open(in_data_directory(c0_kinmus_filename)) as f:
        next(f)
        c0_kinmus = [
            {
                **r,
                "id": int(r["id"]),
                "c0_id": int(r["c0_id"]),
                "sequence_number": int(r["sequence_number"]),
                "kinmu_id": int(r["kinmu_id"]),
            }
            for r in csv.DictReader(f, c0_kinmu_attribute_names)
        ]
    return c0_kinmus


def write_c0_kinmus(c0_kinmus):
    write_rows(c0_kinmus, c0_kinmus_filename, c0_kinmu_attribute_names)


c1_filename = "c1.csv"
c1_attribute_names = [
    "id",
    "is_enabled",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
    "group_id",
    "min_number_of_assignments",
]


def read_c1():
    with open(in_data_directory(c1_filename)) as f:
        next(f)
        c1 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "group_id": int(r["group_id"]),
                "min_number_of_assignments": int(r["min_number_of_assignments"]),
            }
            for r in csv.DictReader(f, c1_attribute_names)
        ]
    return c1


def write_c1(c1):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c1]
    write_rows(rows, c1_filename, c1_attribute_names)


c2_filename = "c2.csv"
c2_attribute_names = [
    "id",
    "is_enabled",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
    "group_id",
    "max_number_of_assignments",
]


def read_c2():
    with open(in_data_directory(c2_filename)) as f:
        next(f)
        c2 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "group_id": int(r["group_id"]),
                "max_number_of_assignments": int(r["max_number_of_assignments"]),
            }
            for r in csv.DictReader(f, c2_attribute_names)
        ]
    return c2


def write_c2(c2):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c2]
    write_rows(rows, c2_filename, c2_attribute_names)


c3_filename = "c3.csv"
c3_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "kinmu_id",
    "min_number_of_assignments",
]


def read_c3():
    with open(in_data_directory(c3_filename)) as f:
        next(f)
        c3 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
                "min_number_of_assignments": int(r["min_number_of_assignments"]),
            }
            for r in csv.DictReader(f, c3_attribute_names)
        ]
    return c3


def write_c3(c3):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c3]
    write_rows(rows, c3_filename, c3_attribute_names)


c4_filename = "c4.csv"
c4_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "kinmu_id",
    "max_number_of_assignments",
]


def read_c4():
    with open(in_data_directory(c4_filename)) as f:
        next(f)
        c4 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
                "max_number_of_assignments": int(r["max_number_of_assignments"]),
            }
            for r in csv.DictReader(f, c4_attribute_names)
        ]
    return c4


def write_c4(c4):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c4]
    write_rows(rows, c4_filename, c4_attribute_names)


c5_filename = "c5.csv"
c5_attribute_names = ["id", "is_enabled", "kinmu_id", "min_number_of_days"]


def read_c5():
    with open(in_data_directory(c5_filename)) as f:
        next(f)
        c5 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "min_number_of_days": int(r["min_number_of_days"]),
            }
            for r in csv.DictReader(f, c5_attribute_names)
        ]
    return c5


def write_c5(c5):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c5]
    write_rows(rows, c5_filename, c5_attribute_names)


c6_filename = "c6.csv"
c6_attribute_names = ["id", "is_enabled", "kinmu_id", "max_number_of_days"]


def read_c6():
    with open(in_data_directory(c6_filename)) as f:
        next(f)
        c6 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "max_number_of_days": int(r["max_number_of_days"]),
            }
            for r in csv.DictReader(f, c6_attribute_names)
        ]
    return c6


def write_c6(c6):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c6]
    write_rows(rows, c6_filename, c6_attribute_names)


c7_filename = "c7.csv"
c7_attribute_names = ["id", "is_enabled", "kinmu_id", "min_number_of_days"]


def read_c7():
    with open(in_data_directory(c7_filename)) as f:
        next(f)
        c7 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "min_number_of_days": int(r["min_number_of_days"]),
            }
            for r in csv.DictReader(f, c7_attribute_names)
        ]
    return c7


def write_c7(c7):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c7]
    write_rows(rows, c7_filename, c7_attribute_names)


c8_filename = "c8.csv"
c8_attribute_names = ["id", "is_enabled", "kinmu_id", "max_number_of_days"]


def read_c8():
    with open(in_data_directory(c8_filename)) as f:
        next(f)
        c8 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "max_number_of_days": int(r["max_number_of_days"]),
            }
            for r in csv.DictReader(f, c8_attribute_names)
        ]
    return c8


def write_c8(c8):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c8]
    write_rows(rows, c8_filename, c8_attribute_names)


c9_filename = "c9.csv"
c9_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
]


def read_c9():
    with open(in_data_directory(c9_filename)) as f:
        next(f)
        c9 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
            }
            for r in csv.DictReader(f, c9_attribute_names)
        ]
    return c9


def write_c9(c9):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c9]
    write_rows(rows, c9_filename, c9_attribute_names)


c10_filename = "c10.csv"
c10_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
]


def read_c10():
    with open(in_data_directory(c10_filename)) as f:
        next(f)
        c10 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
            }
            for r in csv.DictReader(f, c10_attribute_names)
        ]
    return c10


def write_c10(c10):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in c10]
    write_rows(rows, c10_filename, c10_attribute_names)


rosters_filename = "rosters.csv"
roster_attribute_names = ["id"]


def read_rosters():
    with open(in_data_directory("rosters.csv")) as f:
        next(f)
        rosters = [
            {**r, "id": int(r["id"])} for r in csv.DictReader(f, roster_attribute_names)
        ]
    return rosters


def write_rosters(rosters):
    write_rows(rosters, rosters_filename, roster_attribute_names)


assignments_filename = "assignments.csv"
assignment_attribute_names = ["id", "roster_id", "date_name", "member_id", "kinmu_id"]


def read_assignments():
    with open(in_data_directory(assignments_filename)) as f:
        next(f)
        assignments = [
            {
                **r,
                "id": int(r["id"]),
                "roster_id": int(r["roster_id"]),
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
            }
            for r in csv.DictReader(f, assignment_attribute_names)
        ]
    return assignments


def write_assignments(assignments):
    write_rows(assignments, assignments_filename, assignment_attribute_names)


def read_all():
    members = read_members()
    terms = read_terms()
    kinmus = read_kinmus()
    groups = read_groups()
    group_members = read_group_members()
    c0 = read_c0()
    c0_kinmus = read_c0_kinmus()
    c1 = read_c1()
    c2 = read_c2()
    c3 = read_c3()
    c4 = read_c4()
    c5 = read_c5()
    c6 = read_c6()
    c7 = read_c7()
    c8 = read_c8()
    c9 = read_c9()
    c10 = read_c10()
    rosters = read_rosters()
    assignments = read_assignments()
    return {
        "members": members,
        "terms": terms,
        "kinmus": kinmus,
        "groups": groups,
        "group_members": group_members,
        "c0": c0,
        "c0_kinmus": c0_kinmus,
        "c1": c1,
        "c2": c2,
        "c3": c3,
        "c4": c4,
        "c5": c5,
        "c6": c6,
        "c7": c7,
        "c8": c8,
        "c9": c9,
        "c10": c10,
        "rosters": rosters,
        "assignments": assignments,
    }


def x_to_new_assignments(x, dates, members, kinmus):
    return [
        {"date_name": date["name"], "member_id": member["id"], "kinmu_id": kinmu["id"]}
        for date in dates
        for member in members
        for kinmu in kinmus
        if x[member["id"]][date["index"]][kinmu["id"]].value() == 1
    ]


def solve(all):
    members = all["members"]
    terms = all["terms"]
    kinmus = all["kinmus"]
    groups = all["groups"]
    group_members = all["group_members"]
    c0 = all["c0"]
    c0_kinmus = all["c0_kinmus"]
    c1 = all["c1"]
    c2 = all["c2"]
    c3 = all["c3"]
    c4 = all["c4"]
    c5 = all["c5"]
    c6 = all["c6"]
    c7 = all["c7"]
    c8 = all["c8"]
    c9 = all["c9"]
    c10 = all["c10"]
    dates = [
        {"index": index, "name": utils.date_to_str(date)}
        for term in terms
        for index, date in enumerate(
            utils.date_range(
                utils.str_to_date(term["start_date_name"]),
                utils.str_to_date(term["stop_date_name"]) + one_day,
            )
        )
    ]

    M = [m["id"] for m in members]
    D = [d["index"] for d in dates]
    K = [k["id"] for k in kinmus]
    G = [g["id"] for g in groups]
    GM = {
        g: [
            group_member["member_id"]
            for group_member in group_members
            if group_member["group_id"] == g
        ]
        for g in G
    }
    C0 = [
        [
            c_kinmu["kinmu_id"]
            for c_kinmu in sorted(c0_kinmus, key=operator.itemgetter("sequence_number"))
            if c_kinmu["c0_id"] == c0_id
        ]
        for c0_id in [c["id"] for c in c0]
    ]
    C1 = [
        {
            "date_index": utils.find(dates, lambda date: date["name"] == date_name)[
                "index"
            ],
            "kinmu_id": c["kinmu_id"],
            "group_id": c["group_id"],
            "min_number_of_assignments": c["min_number_of_assignments"],
        }
        for c, date_name in [
            (c, utils.date_to_str(date))
            for c in c1
            for date in utils.date_range(
                utils.str_to_date(c["start_date_name"]),
                utils.str_to_date(c["stop_date_name"]) + one_day,
            )
        ]
    ]
    C2 = [
        {
            "date_index": utils.find(dates, lambda date: date["name"] == date_name)[
                "index"
            ],
            "kinmu_id": c["kinmu_id"],
            "group_id": c["group_id"],
            "max_number_of_assignments": c["max_number_of_assignments"],
        }
        for (c, date_name) in [
            (c, utils.date_to_str(date))
            for c in c2
            for date in utils.date_range(
                utils.str_to_date(c["start_date_name"]),
                utils.str_to_date(c["stop_date_name"]) + one_day,
            )
        ]
    ]
    C3 = c3
    C4 = c4
    C5 = c5
    C6 = c6
    C7 = c7
    C8 = c8
    C9 = [
        {
            "member_id": c["member_id"],
            "date_index": utils.find(dates, lambda date: date["name"] == date_name)[
                "index"
            ],
            "kinmu_id": c["kinmu_id"],
        }
        for (c, date_name) in [
            (c, utils.date_to_str(date))
            for c in c9
            for date in utils.date_range(
                utils.str_to_date(c["start_date_name"]),
                utils.str_to_date(c["stop_date_name"]) + one_day,
            )
        ]
    ]
    C10 = [
        {
            "member_id": c["member_id"],
            "date_index": utils.find(dates, lambda date: date["name"] == date_name)[
                "index"
            ],
            "kinmu_id": c["kinmu_id"],
        }
        for (c, date_name) in [
            (c, utils.date_to_str(date))
            for c in c10
            for date in utils.date_range(
                utils.str_to_date(c["start_date_name"]),
                utils.str_to_date(c["stop_date_name"]) + one_day,
            )
        ]
    ]

    # 決定変数。
    # 職員の日付に勤務が割り当てられているとき1。
    x = pulp.LpVariable.dicts("x", (M, D, K), 0, 1, pulp.LpBinary)

    problem = pulp.LpProblem("Scheduling", pulp.LpMinimize)

    # 目的関数。
    problem += sum(
        c["min_number_of_assignments"]
        - sum(x[m][c["date_index"]][c["kinmu_id"]] for m in GM[c["group_id"]])
        for c in C1
    ) + sum(
        sum(x[m][c["date_index"]][c["kinmu_id"]] for m in GM[c["group_id"]])
        - c["max_number_of_assignments"]
        for c in C2
    )

    # 各職員の各日付に割り当てる勤務の数は1。
    for m in M:
        for d in D:
            problem += sum([x[m][d][k] for k in K]) == 1

    for m in M:
        for c in C0:
            l = len(c) - 1
            for d in D:
                if d - l not in D:
                    continue
                problem += sum(x[m][d - l + i][c[i]] for i in range(0, l + 1)) <= l
    for c in C1:
        problem += (
            sum(x[m][c["date_index"]][c["kinmu_id"]] for m in GM[c["group_id"]])
            >= c["min_number_of_assignments"]
        )
    for c in C2:
        problem += (
            sum(x[m][c["date_index"]][c["kinmu_id"]] for m in GM[c["group_id"]])
            <= c["max_number_of_assignments"]
        )
    for c in C3:
        problem += (
            sum(x[c["member_id"]][d][c["kinmu_id"]] for d in D)
            >= c["min_number_of_assignments"]
        )
    for c in C4:
        problem += (
            sum(x[c["member_id"]][d][c["kinmu_id"]] for d in D)
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
                        x[m][d - i][c["kinmu_id"]]
                        for i in range(2, min_number_of_days + 1)
                    )
                    - (min_number_of_days - 1) * x[m][d - 1][c["kinmu_id"]]
                    + (min_number_of_days - 1) * x[m][d][c["kinmu_id"]]
                    >= 0
                )
    for c in C6:
        for m in M:
            for d in D:
                if d - c["max_number_of_days"] not in D:
                    continue
                problem += (
                    sum(
                        x[m][d - i][c["kinmu_id"]]
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
                        x[m][d - i][c["kinmu_id"]]
                        - sum(x[m][d - j][c["kinmu_id"]] for j in range(1, i))
                        + x[m][d][c["kinmu_id"]]
                        <= 1
                    )
    for c in C8:
        for m in M:
            for d in D:
                if d - c["max_number_of_days"] not in D:
                    continue
                problem += (
                    sum(
                        x[m][d - i][c["kinmu_id"]]
                        for i in range(0, c["max_number_of_days"] + 1)
                    )
                    >= 1
                )
    for c in C9:
        problem += x[c["member_id"]][c["date_index"]][c["kinmu_id"]] == 1
    for c in C10:
        problem += x[c["member_id"]][c["date_index"]][c["kinmu_id"]] == 0

    problem.solve(pulp.solvers.PULP_CBC_CMD(msg=True))
    status = pulp.LpStatus[problem.status]
    print("Status:", status)
    if status != "Optimal":
        raise UnsolvedException(status)
    return x_to_new_assignments(x, dates, members, kinmus)


if __name__ == "__main__":
    print(solve(read_all()))
