---
id: 8
title: "[ROS]基于TR-master和ocr的车牌识别（代码解析）"
created_at: 2024-9-10T16:23:29Z
modified_at: 2024-9-10T16:23:29Z
description: 机器人操作系统学习记录
--- 
## 部署和快速上手
在完成tr的部署后，使用以下命令打开摄像头节点：
> 只有在打开摄像头节点后rqt图像预览工具才可正常使用
````
roslaunch usb_cam usb_cam-test.launch
````
使用下列命令查看摄像头画面：
```
rqt_image_view
```
> 注意：在使用tr接入摄像头节点的命令时不能查看摄像头画面，因为摄像头被占用。     
如果你直接将tr接入摄像头画面的话，ocr不会识别文字到控制台，你需要修改ocr所在功能包下的`ocr_detection.py`文件来达到识别图片中文字的目的，就像下面的内容一样。
## 代码解析和识读
```
#!/usr/bin/env python  
# coding=utf-8  
  
import rospy  # ROS的Python客户端库  
from cv_bridge import CvBridge, CvBridgeError  # 用于ROS图像消息与OpenCV图像之间的转换  
import cv2  # OpenCV库，用于图像处理  
from sensor_msgs.msg import Image  # ROS中图像消息的类型  
import numpy as np  # NumPy库，用于数组和矩阵操作  
import os  # 用于与操作系统交互，如获取文件路径  
import tr  # 部署的tr库
"""
导入必要的库
"""  
class Image_Morphological_Processing:  
    def __init__(self):  
        self.bridge = CvBridge()  # 创建CvBridge对象，用于图像转换  
        self.image_sub = rospy.Subscriber("/camera/rgb/image_raw", Image, self.callback)  # 订阅ROS中的图像消息  
          
        self.opened_dir = os.path.dirname(os.path.abspath(__file__))  # 获取当前脚本文件所在的目录路径  
    
    def convert_to_bgr(self, image):  
        # 将灰度图像转换为BGR图像（但这里通常不需要，因为输入应该是BGR）  
        # 注意：这个函数名可能会误导，因为它实际上是将灰度图转换为彩色图  
        return cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)  
  
    def callback(self, data):  
        try:  
            # 将ROS图像消息转换为OpenCV图像  
            cv_image = self.bridge.imgmsg_to_cv2(data, "bgr8")  
        except CvBridgeError as e:  
            # 如果转换失败，打印错误信息  
            print(e)  
            return  
  
        # 将BGR图像转换为灰度图像  
        gray_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)  
  
        # tr.run接受灰度图像并返回某种形式的处理结果  
        txt = tr.run(gray_image)  
  
        # 遍历处理结果并打印（假设每行是一个元组，其中第二个元素是需要打印的字符串）  
        for row in txt:  
            if row[1] is not "":  
                print(row[1])  
  
# 主程序入口  
if __name__ == '__main__':  
    # 初始化ROS节点  
    rospy.init_node("Image_Morphological_Processing")  
    # 打印日志信息  
    rospy.loginfo("Image_Morphological_Processing node started")  
    # 创建Image_Morphological_Processing类的实例  
    ia = Image_Morphological_Processing()  
    # 进入ROS循环，等待回调函数被调用  
    rospy.spin()
```
## 功能的实现区域识读
````
for row in txt:  
            if row[1] is not "":  #“[]”中的数字代表了识别的对象，从0开始计数，现在是第二个对象。如果你想修改识别对象，修改中括号中的地址即可
                print(row[1]) #打印识别的对象，打印对象需要与识别对象一致  
````