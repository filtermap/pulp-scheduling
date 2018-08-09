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


constraints0_filename = "constraints0.csv"
constraint0_attribute_names = ["id", "is_enabled"]


def read_constraints0():
    with open(in_data_directory(constraints0_filename)) as f:
        next(f)
        constraints0 = [
            {**r, "id": int(r["id"]), "is_enabled": int(r["is_enabled"]) != 0}
            for r in csv.DictReader(f, constraint0_attribute_names)
        ]
    return constraints0


def write_constraints0(constraints0):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints0]
    write_rows(rows, constraints0_filename, constraint0_attribute_names)


constraint0_kinmus_filename = "constraint0_kinmus.csv"
constraint0_kinmu_attribute_names = [
    "id",
    "constraint0_id",
    "sequence_number",
    "kinmu_id",
]


def read_constraint0_kinmus():
    with open(in_data_directory(constraint0_kinmus_filename)) as f:
        next(f)
        constraint0_kinmus = [
            {
                **r,
                "id": int(r["id"]),
                "constraint0_id": int(r["constraint0_id"]),
                "sequence_number": int(r["sequence_number"]),
                "kinmu_id": int(r["kinmu_id"]),
            }
            for r in csv.DictReader(f, constraint0_kinmu_attribute_names)
        ]
    return constraint0_kinmus


def write_constraint0_kinmus(constraint0_kinmus):
    write_rows(
        constraint0_kinmus,
        constraint0_kinmus_filename,
        constraint0_kinmu_attribute_names,
    )


constraints1_filename = "constraints1.csv"
constraint1_attribute_names = [
    "id",
    "is_enabled",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
    "group_id",
    "min_number_of_assignments",
]


def read_constraints1():
    with open(in_data_directory(constraints1_filename)) as f:
        next(f)
        constraints1 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "group_id": int(r["group_id"]),
                "min_number_of_assignments": int(r["min_number_of_assignments"]),
            }
            for r in csv.DictReader(f, constraint1_attribute_names)
        ]
    return constraints1


def write_constraints1(constraints1):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints1]
    write_rows(rows, constraints1_filename, constraint1_attribute_names)


constraints2_filename = "constraints2.csv"
constraint2_attribute_names = [
    "id",
    "is_enabled",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
    "group_id",
    "max_number_of_assignments",
]


def read_constraints2():
    with open(in_data_directory(constraints2_filename)) as f:
        next(f)
        constraints2 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "group_id": int(r["group_id"]),
                "max_number_of_assignments": int(r["max_number_of_assignments"]),
            }
            for r in csv.DictReader(f, constraint2_attribute_names)
        ]
    return constraints2


def write_constraints2(constraints2):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints2]
    write_rows(rows, constraints2_filename, constraint2_attribute_names)


constraints3_filename = "constraints3.csv"
constraint3_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "kinmu_id",
    "min_number_of_assignments",
]


def read_constraints3():
    with open(in_data_directory(constraints3_filename)) as f:
        next(f)
        constraints3 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
                "min_number_of_assignments": int(r["min_number_of_assignments"]),
            }
            for r in csv.DictReader(f, constraint3_attribute_names)
        ]
    return constraints3


def write_constraints3(constraints3):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints3]
    write_rows(rows, constraints3_filename, constraint3_attribute_names)


constraints4_filename = "constraints4.csv"
constraint4_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "kinmu_id",
    "max_number_of_assignments",
]


def read_constraints4():
    with open(in_data_directory(constraints4_filename)) as f:
        next(f)
        constraints4 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
                "max_number_of_assignments": int(r["max_number_of_assignments"]),
            }
            for r in csv.DictReader(f, constraint4_attribute_names)
        ]
    return constraints4


def write_constraints4(constraints4):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints4]
    write_rows(rows, constraints4_filename, constraint4_attribute_names)


constraints5_filename = "constraints5.csv"
constraint5_attribute_names = ["id", "is_enabled", "kinmu_id", "min_number_of_days"]


def read_constraints5():
    with open(in_data_directory(constraints5_filename)) as f:
        next(f)
        constraints5 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "min_number_of_days": int(r["min_number_of_days"]),
            }
            for r in csv.DictReader(f, constraint5_attribute_names)
        ]
    return constraints5


def write_constraints5(constraints5):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints5]
    write_rows(rows, constraints5_filename, constraint5_attribute_names)


constraints6_filename = "constraints6.csv"
constraint6_attribute_names = ["id", "is_enabled", "kinmu_id", "max_number_of_days"]


def read_constraints6():
    with open(in_data_directory(constraints6_filename)) as f:
        next(f)
        constraints6 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "max_number_of_days": int(r["max_number_of_days"]),
            }
            for r in csv.DictReader(f, constraint6_attribute_names)
        ]
    return constraints6


def write_constraints6(constraints6):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints6]
    write_rows(rows, constraints6_filename, constraint6_attribute_names)


constraints7_filename = "constraints7.csv"
constraint7_attribute_names = ["id", "is_enabled", "kinmu_id", "min_number_of_days"]


def read_constraints7():
    with open(in_data_directory(constraints7_filename)) as f:
        next(f)
        constraints7 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "min_number_of_days": int(r["min_number_of_days"]),
            }
            for r in csv.DictReader(f, constraint7_attribute_names)
        ]
    return constraints7


def write_constraints7(constraints7):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints7]
    write_rows(rows, constraints7_filename, constraint7_attribute_names)


constraints8_filename = "constraints8.csv"
constraint8_attribute_names = ["id", "is_enabled", "kinmu_id", "max_number_of_days"]


def read_constraints8():
    with open(in_data_directory(constraints8_filename)) as f:
        next(f)
        constraints8 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "kinmu_id": int(r["kinmu_id"]),
                "max_number_of_days": int(r["max_number_of_days"]),
            }
            for r in csv.DictReader(f, constraint8_attribute_names)
        ]
    return constraints8


def write_constraints8(constraints8):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints8]
    write_rows(rows, constraints8_filename, constraint8_attribute_names)


constraints9_filename = "constraints9.csv"
constraint9_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
]


def read_constraints9():
    with open(in_data_directory(constraints9_filename)) as f:
        next(f)
        constraints9 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
            }
            for r in csv.DictReader(f, constraint9_attribute_names)
        ]
    return constraints9


def write_constraints9(constraints9):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints9]
    write_rows(rows, constraints9_filename, constraint9_attribute_names)


constraints10_filename = "constraints10.csv"
constraint10_attribute_names = [
    "id",
    "is_enabled",
    "member_id",
    "start_date_name",
    "stop_date_name",
    "kinmu_id",
]


def read_constraints10():
    with open(in_data_directory(constraints10_filename)) as f:
        next(f)
        constraints10 = [
            {
                **r,
                "id": int(r["id"]),
                "is_enabled": int(r["is_enabled"]) != 0,
                "member_id": int(r["member_id"]),
                "kinmu_id": int(r["kinmu_id"]),
            }
            for r in csv.DictReader(f, constraint10_attribute_names)
        ]
    return constraints10


def write_constraints10(constraints10):
    rows = [{**c, "is_enabled": 1 if c["is_enabled"] else 0} for c in constraints10]
    write_rows(rows, constraints10_filename, constraint10_attribute_names)


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
    constraints0 = read_constraints0()
    constraint0_kinmus = read_constraint0_kinmus()
    constraints1 = read_constraints1()
    constraints2 = read_constraints2()
    constraints3 = read_constraints3()
    constraints4 = read_constraints4()
    constraints5 = read_constraints5()
    constraints6 = read_constraints6()
    constraints7 = read_constraints7()
    constraints8 = read_constraints8()
    constraints9 = read_constraints9()
    constraints10 = read_constraints10()
    rosters = read_rosters()
    assignments = read_assignments()
    return {
        "members": members,
        "terms": terms,
        "kinmus": kinmus,
        "groups": groups,
        "group_members": group_members,
        "constraints0": constraints0,
        "constraint0_kinmus": constraint0_kinmus,
        "constraints1": constraints1,
        "constraints2": constraints2,
        "constraints3": constraints3,
        "constraints4": constraints4,
        "constraints5": constraints5,
        "constraints6": constraints6,
        "constraints7": constraints7,
        "constraints8": constraints8,
        "constraints9": constraints9,
        "constraints10": constraints10,
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


def solve(all_):
    members = all_["members"]
    enabled_members = [member for member in members if member["is_enabled"]]
    enabled_member_ids = [member["id"] for member in enabled_members]
    terms = all_["terms"]
    kinmus = all_["kinmus"]
    enabled_kinmus = [kinmu for kinmu in kinmus if kinmu["is_enabled"]]
    enabled_kinmu_ids = [kinmu["id"] for kinmu in enabled_kinmus]
    groups = all_["groups"]
    enabled_groups = [group for group in groups if group["is_enabled"]]
    enabled_group_ids = [group["id"] for group in enabled_groups]
    group_members = all_["group_members"]
    enabled_group_members = [
        group_member
        for group_member in group_members
        if group_member["group_id"] in enabled_group_ids
        and group_member["member_id"] in enabled_member_ids
    ]
    constraints0 = all_["constraints0"]
    constraint0_kinmus = all_["constraint0_kinmus"]
    enabled_constraints0 = [
        constraint
        for constraint in constraints0
        if constraint["is_enabled"]
        and all(
            constraint0_kinmu["kinmu_id"] in enabled_kinmu_ids
            for constraint0_kinmu in constraint0_kinmus
            if constraint0_kinmu["constraint0_id"] == constraint["id"]
        )
    ]
    constraints1 = all_["constraints1"]
    enabled_constraints1 = [
        constraint
        for constraint in constraints1
        if constraint["is_enabled"]
        and constraint["kinmu_id"] in enabled_kinmu_ids
        and constraint["group_id"] in enabled_group_ids
    ]
    constraints2 = all_["constraints2"]
    enabled_constraints2 = [
        constraint
        for constraint in constraints2
        if constraint["is_enabled"]
        and constraint["kinmu_id"] in enabled_kinmu_ids
        and constraint["group_id"] in enabled_group_ids
    ]
    constraints3 = all_["constraints3"]
    enabled_constraints3 = [
        constraint
        for constraint in constraints3
        if constraint["is_enabled"]
        and constraint["member_id"] in enabled_member_ids
        and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
    constraints4 = all_["constraints4"]
    enabled_constraints4 = [
        constraint
        for constraint in constraints4
        if constraint["is_enabled"]
        and constraint["member_id"] in enabled_member_ids
        and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
    constraints5 = all_["constraints5"]
    enabled_constraints5 = [
        constraint
        for constraint in constraints5
        if constraint["is_enabled"] and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
    constraints6 = all_["constraints6"]
    enabled_constraints6 = [
        constraint
        for constraint in constraints6
        if constraint["is_enabled"] and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
    constraints7 = all_["constraints7"]
    enabled_constraints7 = [
        constraint
        for constraint in constraints7
        if constraint["is_enabled"] and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
    constraints8 = all_["constraints8"]
    enabled_constraints8 = [
        constraint
        for constraint in constraints8
        if constraint["is_enabled"] and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
    constraints9 = all_["constraints9"]
    enabled_constraints9 = [
        constraint
        for constraint in constraints9
        if constraint["is_enabled"]
        and constraint["member_id"] in enabled_member_ids
        and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
    constraints10 = all_["constraints10"]
    enabled_constraints10 = [
        constraint
        for constraint in constraints10
        if constraint["is_enabled"]
        and constraint["member_id"] in enabled_member_ids
        and constraint["kinmu_id"] in enabled_kinmu_ids
    ]
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

    M = [m["id"] for m in enabled_members]
    D = [d["index"] for d in dates]
    K = [k["id"] for k in enabled_kinmus]
    G = [g["id"] for g in enabled_groups]
    GM = {
        g: [
            group_member["member_id"]
            for group_member in enabled_group_members
            if group_member["group_id"] == g
        ]
        for g in G
    }
    C0 = [
        [
            c_kinmu["kinmu_id"]
            for c_kinmu in sorted(
                constraint0_kinmus, key=operator.itemgetter("sequence_number")
            )
            if c_kinmu["constraint0_id"] == constraint0_id
        ]
        for constraint0_id in [c["id"] for c in enabled_constraints0]
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
            for c in enabled_constraints1
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
            for c in enabled_constraints2
            for date in utils.date_range(
                utils.str_to_date(c["start_date_name"]),
                utils.str_to_date(c["stop_date_name"]) + one_day,
            )
        ]
    ]
    C3 = enabled_constraints3
    C4 = enabled_constraints4
    C5 = enabled_constraints5
    C6 = enabled_constraints6
    C7 = enabled_constraints7
    C8 = enabled_constraints8
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
            for c in enabled_constraints9
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
            for c in enabled_constraints10
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
    return x_to_new_assignments(x, dates, enabled_members, enabled_kinmus)


if __name__ == "__main__":
    print(solve(read_all()))
