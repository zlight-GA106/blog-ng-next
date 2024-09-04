---
id: 4
title: "[ROS]部署TR-master，并且使用OCR文字识别函数识别图像中的文字"
created_at: 2024-5-22T21:19:20Z
modified_at: 2024-5-22T21:19:20Z
description: 机器人操作系统学习记录
---  
本文将阐述如何将OCR安装包部署到小车内。并运行软件包自带的`demo.py`示例脚本。同时应用OCR库中的文字识别示例图片中的文字内容
## 第一步：挂载你的小车     
挂载的具体原理在本文中不过多阐述 ，打开终端键入以下命令即可完成挂载
`````
sudo mount -t nfs 192.168.0.100:/home/wheeltec/wheeltec_robot /mnt
`````
![bcc02650bd8a58128b29f65b79188e6.png](https://blog-oss.allenyou.top/image/66667a1a976da.png)

## 第二步：准备前置条件   
### 创建一个文件夹
首先找到`src`目录，在目录下创建一个新文件夹，并将其命名为`ocr_detection1`  
![ocrdecetion.png](https://blog-oss.allenyou.top/image/667034952e426.png)         
然后在`ocr_detection1`目录下创建`scripts`目录        
![scripe.png](https://blog-oss.allenyou.top/image/667035397884e.png)     

## 第三步：复制培训资料文件

将培训资料`Day5`中的赛题培训-培训代码-模块2-`Tr master`中的所有文件复制到`ocr_detection1/scripts`目录中（除docx文档外）
![m2.png](https://blog-oss.allenyou.top/image/66703794721b9.png)

## 第四步：安装TR-master（如果你的机器人已经集成了这个环境即可跳过它）
在存放TR-master文件的目录下打开终端，键入下列命令来安装它
```
sudo python setup.py install
```
![4bb31f92b83b8befd1c70b063760906.png](https://blog-oss.allenyou.top/image/66667a1c60ff2.png)

## 第五步：运行预置的demo.py脚本
安装完成后，回到`scripts`文件夹，输入以下命令运行`demo.py`
   ```bash
   python demo.py
   ```
观察终端输出，你应该会看到打印出的文字内容
    ![0f2f452e741d067b9895e5bf94cb22a.png](https://blog-oss.allenyou.top/image/66667a1c7cbeb.png)
## 第六步：修改示例文件，实现不同的打印内容
使用文本编辑器打开`demo.py`文件（`demo.py`文件在`scripts`文件夹中）

![8b899807b4f6de589eec94824cab3e5.png](https://blog-oss.allenyou.top/image/66667a1db2187.png)
在打开文件后，你看到的源代码将如代码块中所示
`````
# coding: utf-8
# 声明：本代码的编码为UTF-8
import tr
import os
# 导入了两个模块，分别是"tr"和"os"

_BASEDIR = os.path.dirname(os.path.abspath(__file__))
# 获取了当前脚本的绝对路径，并从中提取了目录部分，将其存储在_BASEDIR变量中。这样做便于引用和这个脚本有关的目录，而忽略了绝对路径的限制
def test():
    os.chdir(_BASEDIR) 
    # 更改当前工作目录为脚本所在的目录
    print("recognize", tr.recognize("imgs/line.png"))
    # 调用tr模块的recognize函数，并打印返回的结果。括号内为示例图片的文件名。
    txt = tr.run("imgs/line.png")[0][1] 
    # 调用tr模块的run函数，并假设它返回一个列表的列表。中括号的内容提取了他在第一个列表中的第二个对象（文本内容）

    print(txt)
    # 打印提取的内容
    

if __name__ == "__main__":
    test()
`````  
## 如何修改当前示例的输出文本
首先我们先导入一张示例图片（这里以id_card.png为例）   
![id_card.jpeg](https://blog-oss.allenyou.top/image/66706986987c4.jpeg)   
可以看到图中框选出来的部分有很多文字元素可供识别，想要修改识别的对象，先要找到第10行代码：     
````
txt = tr.run("imgs/line.png")[0][1] 
```` 
如果此时直接运行`demo.py`，将识别第一个对象    
![prc.png](https://blog-oss.allenyou.top/image/66706a197ea50.png)      
   
修改该行代码来更改它的识别对象，如下图所示：
````
txt = tr.run("imgs/line.png")[2][1] 
# 识别图中的第3个对象
````   
保存文件并重新运行`demo.py`      
![na.png](https://blog-oss.allenyou.top/image/66706a6d0ee04.png)     
呃...看起来什么都没有发生   
出现无输出的情况，通常是因为这片区域内没有文本可供识别造成的。更换识别对象就可以解决     
`````
txt = tr.run("imgs/line.png")[3][1]
# 识别第四个对象   
`````
![fa.png](https://blog-oss.allenyou.top/image/66706b355607e.png)  
此时，终端正常打印了对象4中的文字内容    

## 让文本以数字代码形式在终端中打印
修改代码：
````
txt = tr.run("imgs/line.png")[0][0] 
````   
返回终端并再次运行`demo.py`  
![math.png](https://blog-oss.allenyou.top/image/66706c72cd787.png)    
可以看到，文本内容已经变成了数字在终端中被打印。

# 使用OCR来识别车牌（或是带文字的其他内容）
在开始识别之前，你需要准备一张带文字的东西（这里以车牌显示器为例）     
## 第一步：远程登录到小车的终端    
打开你的系统终端，键入以下命令完成登录    
````
ssh -Y wheelrec@192.168.0.100  
````   
>密码为dongguan         
## 第二步：启动你的车载摄像机   
在终端中键入命令，在开启zigbee模块的同时也启动车载摄像机    
````
roslaunch zigbee_signs open_zigbee_cam.launch       
````     
>值得被注意的是，如果你的小车未安装zigbee模块。你仍然可以使用这条命令来启动摄像机    
zigbee模块时由于没有防呆设计，安装时需注意针脚的朝向是否正确。错误的安装会导致模块烧毁！    

![图片1.png](https://blog-oss.allenyou.top/image/667268d3a97c9.png)
## 第三步，执行脚本。将TR-master接入你的OCR中    
在终端键入以下命令来进行接入      
`````
rosrun ocr_detection ocr_detection.py     
`````
拿起你的车牌号显示器，把它对准你的车载摄像机    
![图片2.jpg](https://blog-oss.allenyou.top/image/66726bd1a6e78.jpg)    

你就能在你的终端上看到识别成果了        

![图片5.png](https://blog-oss.allenyou.top/image/66726ca2e51dc.png)


# FAQ
Q：我安装TRmaster的时候报错啊，完全装不上去。换了环境也不行。
![install.png](https://blog-oss.allenyou.top/image/66706d4fe06f4.png)
A：你的命令权限不足，尝试以系统用户执行。可以试试在命令前面加一个`sudo`来确保它有足够的权限     
Q: 我在启动ros小车摄像机节点的时候遇到了以下报错


