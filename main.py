import multiprocessing
import os
import signal
import subprocess
import types
import typing
import webbrowser
import psutil
import tkinter
import tkinter.font
import tornado.ioloop
import tornado.wsgi
import tornado.httpserver
import settings
import utils


def run_server() -> None:
    if utils.frozen():
        import server

        container = tornado.wsgi.WSGIContainer(server.app)
        http_server = tornado.httpserver.HTTPServer(container)
        http_server.listen(settings.port, address=settings.host)
        tornado.ioloop.IOLoop.current().start()
    else:
        subprocess.run("python server.py", shell=True)


def run_development_static() -> None:
    project_root_directory = os.path.dirname(os.path.abspath(__file__))
    os.chdir(os.path.join(project_root_directory, "static"))
    subprocess.run("npm start", shell=True)


def browser_opener(url: str) -> typing.Callable[[], None]:
    def open_browser():
        webbrowser.open_new_tab(url)

    return open_browser


# http://psutil.readthedocs.io/en/latest/#kill-process-tree
def kill_proc_tree(
    pid: int,
    sig: signal.Signals = signal.SIGTERM,
    include_parent: bool = True,
    timeout: typing.Optional[float] = None,
    on_terminate: typing.Optional[typing.Callable[[psutil.Process], None]] = None,
) -> tuple[list[psutil.Process], list[psutil.Process]]:
    """Kill a process tree (including grandchildren) with signal
    "sig" and return a (gone, still_alive) tuple.
    "on_terminate", if specified, is a callback function which is
    called as soon as a child terminates.
    """
    assert pid != os.getpid(), "won't kill myself"
    parent = psutil.Process(pid)
    children = parent.children(recursive=True)
    if include_parent:
        children.append(parent)
    for p in children:
        try:
            p.send_signal(sig)
        except psutil.NoSuchProcess:
            pass
    gone, alive = psutil.wait_procs(children, timeout=timeout, callback=on_terminate)
    return (gone, alive)


if __name__ == "__main__":
    multiprocessing.freeze_support()
    server_process = multiprocessing.Process(target=run_server)
    server_process.start()
    processes = [server_process]

    if utils.frozen():
        url = f"http://{settings.host}:{settings.port}"
    else:
        url = f"http://{settings.host}:{settings.development_static_port}"

    open_browser = browser_opener(url)

    if utils.frozen():
        open_browser()
    else:
        development_static_process = multiprocessing.Process(
            target=run_development_static
        )
        development_static_process.start()
        processes.append(development_static_process)

    root = tkinter.Tk()
    root.title("pulp-scheduling")

    def terminate_all():
        for process in processes:
            if process.is_alive():
                kill_proc_tree(typing.cast(int, process.pid))
        root.destroy()

    root.protocol("WM_DELETE_WINDOW", terminate_all)
    frame = tkinter.Frame(root)
    frame.pack()
    font = tkinter.font.Font(size=12)
    open_browser_button = tkinter.Button(
        frame, command=open_browser, text="新しい画面を開く。", font=font
    )
    open_browser_button.pack(fill="x")
    terminate_button = tkinter.Button(
        frame, command=terminate_all, text="終了する。", font=font
    )
    terminate_button.pack(fill="x")

    def handler(signal_number: int, stack_frame: typing.Optional[types.FrameType]):
        terminate_all()

    signal.signal(signal.SIGINT, handler)
    signal.signal(signal.SIGTERM, handler)

    root.mainloop()
