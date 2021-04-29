import os
import shutil
import subprocess

project_root_directory = os.path.dirname(os.path.abspath(__file__))

os.chdir(os.path.join(project_root_directory, "static"))
subprocess.run("npm run build", shell=True)

os.chdir(project_root_directory)
if os.path.exists("dist"):
    shutil.rmtree("dist")
subprocess.run("pyinstaller main.spec --clean", shell=True)
shutil.copytree("data", os.path.join("dist", "data"), copy_function=copy)
shutil.copy("README.md", "dist")
