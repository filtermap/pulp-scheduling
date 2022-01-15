import csv
import io
import os
import sys
import flask
import jsonrpc  # type: ignore
import jsonrpc.backend.flask  # type: ignore
import src.scheduling as scheduling
import src.settings as settings
import src.utils as utils

if utils.frozen():
    static_folder = os.path.join(sys._MEIPASS, "static", "build")  # type: ignore
else:
    static_folder = os.path.join(os.getcwd(), "static", "build")
app = flask.Flask(__name__, static_folder=static_folder)
api = jsonrpc.backend.flask.api
app.add_url_rule("/api", "api", api.as_view(), methods=["POST"])  # type: ignore


@app.route("/", defaults={"path": ""})  # type: ignore
@app.route("/<path:path>")  # type: ignore
def index(path: str):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):  # type: ignore
        return flask.send_from_directory(app.static_folder, path)  # type: ignore
    else:
        return flask.send_from_directory(app.static_folder, "index.html")  # type: ignore


@api.dispatcher.add_method  # type: ignore
def read_all():
    return scheduling.read_all()


@api.dispatcher.add_method  # type: ignore
def write_all(all: scheduling.All):
    scheduling.write_all(all)
    return True


@api.dispatcher.add_method  # type: ignore
def solve(all: scheduling.All):
    try:
        return scheduling.solve(all)
    except scheduling.UnsolvedException as e:
        raise jsonrpc.exceptions.JSONRPCDispatchException(code=0, message=e.args[0])  # type: ignore


@api.dispatcher.add_method  # type: ignore
def pursue(all: scheduling.DataAndConstraints):
    try:
        return scheduling.pursue(all)
    except scheduling.UnpursuedException as e:
        raise jsonrpc.exceptions.JSONRPCDispatchException(code=1, message=e.args[0])  # type: ignore


@api.dispatcher.add_method  # type: ignore
def download_csv(
    assignments: list[scheduling.NewAssignment],
    members: list[scheduling.Member],
    kinmus: list[scheduling.Kinmu],
):
    date_names = sorted(
        list(set([assignment["date_name"] for assignment in assignments])),
        key=lambda date_name: utils.str_to_date(date_name),
    )
    assignment_member_ids = list(
        set([assignment["member_id"] for assignment in assignments])
    )
    assignment_members = filter(
        lambda member: member["id"] in assignment_member_ids, members
    )
    rows = [[""] + date_names] + [
        [member["name"]]
        + [
            utils.find(
                kinmus,
                lambda kinmu: kinmu["id"]
                == utils.find(
                    assignments,
                    lambda assignment: assignment["member_id"] == member["id"]
                    and assignment["date_name"] == date_name,
                )["kinmu_id"],
            )["name"]
            for date_name in date_names
        ]
        for member in assignment_members
    ]
    stringIO = io.StringIO()
    writer = csv.writer(stringIO)
    writer.writerows(rows)
    return stringIO.getvalue()


if __name__ == "__main__":
    app.env = "development"
    app.run(host=settings.host, port=settings.port, debug=True)
