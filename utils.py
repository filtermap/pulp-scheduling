import datetime
import sys


def frozen():
    return getattr(sys, "frozen", False)


def find(iterable, function):
    return next(filter(function, iterable))


def str_to_date(string, format="%Y/%m/%d"):
    return datetime.datetime.strptime(string, format).date()
