import os
import sys
import flask
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
    members = scheduling.read_members()
    dates = scheduling.read_dates()
    kinmus = scheduling.read_kinmus()
    groups = scheduling.read_groups()
    group_members = scheduling.read_group_members(groups=groups, members=members)
    renzoku_kinshi_kinmus = scheduling.read_renzoku_kinshi_kinmus(kinmus=kinmus)
    c1 = scheduling.read_c1(dates=dates, kinmus=kinmus, groups=groups)
    c2 = scheduling.read_c2(dates=dates, kinmus=kinmus, groups=groups)
    c3 = scheduling.read_c3(members=members, kinmus=kinmus)
    c4 = scheduling.read_c4(members=members, kinmus=kinmus)
    c5 = scheduling.read_c5(kinmus=kinmus)
    c6 = scheduling.read_c6(kinmus=kinmus)
    c7 = scheduling.read_c7(kinmus=kinmus)
    c8 = scheduling.read_c8(kinmus=kinmus)
    c9 = scheduling.read_c9(members=members, dates=dates, kinmus=kinmus)
    c10 = scheduling.read_c10(members=members, dates=dates, kinmus=kinmus)
    return {
        "members": members,
        "dates": dates,
        "kinmus": kinmus,
        "groups": groups,
        "group_members": group_members,
        "renzoku_kinshi_kinmus": renzoku_kinshi_kinmus,
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
    }


@api.dispatcher.add_method
def solve():
    return scheduling.solve()


if __name__ == "__main__":
    app.env = "development"
    app.run(host=settings.host, port=settings.port, debug=True)
