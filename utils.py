import datetime
import sys


def frozen():
    return getattr(sys, "frozen", False)


def find(iterable, function):
    return next(filter(function, iterable))


date_format = "%Y-%m-%d"


def str_to_date(string, format=date_format):
    return datetime.datetime.strptime(string, format).date()


def date_to_str(date, format=date_format):
    return date.strftime(format)


def date_range(start_date, stop_date):
    for days in range((stop_date - start_date).days):
        yield start_date + datetime.timedelta(days)
