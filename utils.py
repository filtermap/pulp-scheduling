import sys


def frozen():
    return getattr(sys, "frozen", False)
