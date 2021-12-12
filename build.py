import os
import shutil
import subprocess

version = "v0.2.0"

project_root_directory = os.path.dirname(os.path.abspath(__file__))

os.chdir(os.path.join(project_root_directory, "static"))
subprocess.run("npm run build", shell=True)
os.chdir(project_root_directory)

distribution_directory = f"pulp-scheduling-{version}"

if os.path.exists(distribution_directory):
    shutil.rmtree(distribution_directory)
subprocess.run(
    f"pyinstaller main.spec --clean --distpath {distribution_directory}", shell=True
)

shutil.copytree(
    "data", os.path.join(distribution_directory, "data"), copy_function=shutil.copy
)

os.chdir(os.path.join(project_root_directory, "static"))
subprocess.run("npm run readme", shell=True)
os.chdir(project_root_directory)

shutil.copy("demo.gif", distribution_directory)
