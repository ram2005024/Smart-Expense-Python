import datetime


def convertDateToStr(date):
    date_str = datetime.datetime.strptime(date, "%b %Y")
    return date_str
