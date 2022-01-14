from PyInstaller.utils.hooks import collect_data_files  # type: ignore

datas = collect_data_files("pulp")
