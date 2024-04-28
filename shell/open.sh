#!/bin/bash

cpath=$(pwd)

# 天气模版文件
open "$cpath/天气模版.txt"

# 头条地址
open https://mp.toutiao.com/profile_v4/graphic/articles

# 智普清言（AI）
open https://chatglm.cn/main/detail

# 天气数据图（降水量、气温预报、大风实测等）
open http://wx.nmc.cn/f

# 全国天气预报（搜索城市，查看未来7-40天天气）
open http://www.weather.com.cn/forecast/

# 天气工具（现地址）
# open http://10.0.51.147:8080/hefeng/weather

# 天气工具（跑代码）
cd .. # /Users/dengzemiao/Desktop/GitHub/DZMWeatherTool
open http://localhost:8889/hefeng/weather
npm run serve