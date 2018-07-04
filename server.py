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
    terms = scheduling.read_terms()
    kinmus = scheduling.read_kinmus()
    groups = scheduling.read_groups()
    group_members = scheduling.read_group_members()
    renzoku_kinshi_kinmus = scheduling.read_renzoku_kinshi_kinmus()
    c1 = scheduling.read_c1()
    c2 = scheduling.read_c2()
    c3 = scheduling.read_c3()
    c4 = scheduling.read_c4()
    c5 = scheduling.read_c5()
    c6 = scheduling.read_c6()
    c7 = scheduling.read_c7()
    c8 = scheduling.read_c8()
    c9 = scheduling.read_c9()
    c10 = scheduling.read_c10()
    return {
        "members": members,
        "terms": terms,
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
def write_all(all):
    scheduling.write_members(all["members"])
    scheduling.write_terms(all["terms"])
    scheduling.write_kinmus(all["kinmus"])
    scheduling.write_groups(all["groups"])
    scheduling.write_group_members(all["group_members"])
    scheduling.write_renzoku_kinshi_kinmus(all["renzoku_kinshi_kinmus"])
    scheduling.write_c1(all["c1"])
    scheduling.write_c2(all["c2"])
    scheduling.write_c3(all["c3"])
    scheduling.write_c4(all["c4"])
    scheduling.write_c5(all["c5"])
    scheduling.write_c6(all["c6"])
    scheduling.write_c7(all["c7"])
    scheduling.write_c8(all["c8"])
    scheduling.write_c9(all["c9"])
    scheduling.write_c10(all["c10"])
    return True


@api.dispatcher.add_method
def solve():
    return scheduling.solve()


if __name__ == "__main__":
    app.env = "development"
    app.run(host=settings.host, port=settings.port, debug=True)
