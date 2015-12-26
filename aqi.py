# usr/bin/python3
# coding=utf-8

import requests
import re
import datetime
import time
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter
aqi_url = "http://www.aqistudy.cn/historydata/daydata.php"
city_url = "http://www.aqistudy.cn/historydata/weather.php"
aqi_pattern = "<td align=\"center\">(?P<date>\d{4}-\d{2}-\d{2})</td>\s+<td align=\"center\">(?P<aqi>\d+ )</td>"
city_pattern = "<a href=\"weatherdaydata.php\?city=(?P<city>\w+)\">"


def get_month_data(city, month):
    print("正在抓取{0} {1}的数据...".format(city, month))
    month_data = {}
    params = {"city": city, "month": month}
    r = requests.get(aqi_url, params=params)
    data = re.findall(aqi_pattern, r.text)
    for d in data:
        r_datetime = datetime.datetime.strptime(d[0], "%Y-%m-%d")
        stamp = int(time.mktime(r_datetime.timetuple()))
        month_data[stamp] = int(d[1])
    return month_data


def get_citys():
    r = requests.get(city_url)
    citys = re.findall(city_pattern, r.text)
    return citys


citys = get_citys()
c = Counter(citys)
print(c)
print("共有{0}个城市".format(len(citys)), citys)
f = open("citys.txt", 'w')
for city in citys:
    aqi_data = {}
    executor = ThreadPoolExecutor(max_workers=12)
    futures = {executor.submit(
        get_month_data, city, "2015-{0:02d}".format(x + 1)): x for x in range(12)}

    for future in as_completed(futures):
        try:
            aqi_data.update(future.result())
        except Exception as e:
            print("!!!出现错误!!!", e)

    json.dump(aqi_data, open("{0}.json".format(
        city), 'w'), indent=2, sort_keys=True)
    print("------保存 {0}.json 成功------".format(city))
