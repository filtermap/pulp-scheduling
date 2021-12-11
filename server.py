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
    scheduling.write_all(all)
    return True


@api.dispatcher.add_method
def solve(all):
    try:
        return scheduling.solve(all)
    except scheduling.UnsolvedException as e:
        raise jsonrpc.exceptions.JSONRPCDispatchException(code=0, message=e.args[0])


@api.dispatcher.add_method
def pursue(all):
    try:
        return scheduling.pursue(all)
    except scheduling.UnpursuedException as e:
        raise jsonrpc.exceptions.JSONRPCDispatchException(code=1, message=e.args[0])


@api.dispatcher.add_method
def download_csv(assignments, members, kinmus):
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
