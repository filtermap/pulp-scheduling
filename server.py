import csv
import io
import os
import sys
import flask
import jsonrpc
import jsonrpc.backend.flask
import scheduling
import settings
import utils

if utils.frozen():
    static_folder = os.path.join(sys._MEIPASS, "static", "build")
else:
    static_folder = os.path.join("static", "build")
app = flask.Flask(__name__, static_folder=static_folder)
api = jsonrpc.backend.flask.api
app.add_url_rule("/api", "api", api.as_view(), methods=["POST"])


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return flask.send_from_directory(app.static_folder, path)
    else:
        return flask.send_from_directory(app.static_folder, "index.html")


@api.dispatcher.add_method
def read_all():
    return scheduling.read_all()


@api.dispatcher.add_method
def write_all(all):
    scheduling.write_members(all["members"])
    scheduling.write_terms(all["terms"])
    scheduling.write_kinmus(all["kinmus"])
    scheduling.write_groups(all["groups"])
    scheduling.write_group_members(all["group_members"], all["groups"], all["members"])
    scheduling.write_c0(all["c0"])
    scheduling.write_c0_kinmus(all["c0_kinmus"], all["kinmus"])
    scheduling.write_c1(all["c1"], all["kinmus"], all["groups"])
    scheduling.write_c2(all["c2"], all["kinmus"], all["groups"])
    scheduling.write_c3(all["c3"], all["members"], all["kinmus"])
    scheduling.write_c4(all["c4"], all["members"], all["kinmus"])
    scheduling.write_c5(all["c5"], all["kinmus"])
    scheduling.write_c6(all["c6"], all["kinmus"])
    scheduling.write_c7(all["c7"], all["kinmus"])
    scheduling.write_c8(all["c8"], all["kinmus"])
    scheduling.write_c9(all["c9"], all["members"], all["kinmus"])
    scheduling.write_c10(all["c10"], all["members"], all["kinmus"])
    scheduling.write_assignments(all["assignments"], all["members"], all["kinmus"])
    return True


@api.dispatcher.add_method
def solve(all):
    try:
        return scheduling.solve(all)
    except scheduling.UnsolvedException as e:
        raise jsonrpc.exceptions.JSONRPCDispatchException(code=0, message=e.args[0])


@api.dispatcher.add_method
def download_csv(roster_id):
    members = scheduling.read_members()
    kinmus = scheduling.read_kinmus()
    assignments = [
        assignment
        for assignment in scheduling.read_assignments(members, kinmus)
        if assignment["roster_id"] == roster_id
    ]
    date_names = sorted(
        list(set([assignment["date_name"] for assignment in assignments])),
        key=lambda date_name: utils.str_to_date(date_name),
    )
    rows = [[""] + date_names] + [
        [member["name"]]
        + [
            utils.find(
                kinmus,
                lambda kinmu: kinmu["index"]
                == utils.find(
                    assignments,
                    lambda assignment: assignment["member_index"] == member["index"]
                    and assignment["date_name"] == date_name,
                )["kinmu_index"],
            )["name"]
            for date_name in date_names
        ]
        for member in members
    ]
    stringIO = io.StringIO()
    writer = csv.writer(stringIO)
    writer.writerows(rows)
    return stringIO.getvalue()


if __name__ == "__main__":
    app.env = "development"
    app.run(host=settings.host, port=settings.port, debug=True)
