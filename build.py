import os
import shutil
import subprocess

if os.path.exists("dist"):
    shutil.rmtree("dist")
subprocess.run(["pyinstaller", "scheduling.spec", "--clean"])
shutil.copytree("data", os.path.join("dist", "data"))
