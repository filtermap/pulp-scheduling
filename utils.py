import datetime
import sys
import typing


def frozen() -> typing.Union[typing.Any, bool]:
    return getattr(sys, "frozen", False)


def find(
    iterable: typing.Iterable[typing.Any],
    function: typing.Callable[[typing.Any], typing.Any],
) -> typing.Any:
    return next(filter(function, iterable))


date_format = "%Y-%m-%d"


def str_to_date(string: str, format: str = date_format) -> datetime.date:
    return datetime.datetime.strptime(string, format).date()


def date_to_str(date: datetime.date, format: str = date_format) -> str:
    return date.strftime(format)


def date_range(
    start_date: datetime.date, stop_date: datetime.date
) -> typing.Iterable[datetime.date]:
    for days in range((stop_date - start_date).days):
        yield start_date + datetime.timedelta(days)
