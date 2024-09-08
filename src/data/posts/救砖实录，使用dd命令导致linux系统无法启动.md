---
id: 7
title: "[修复]使用DD命令导致开发板的linux系统无法正常启动"
created_at: 2024-9-5T22:51:29Z
modified_at: 2024-9-5T22:51:29Z
description: 机器人操作系统学习记录
--- 
## 事故起因
今天在使用dd命令备份学校的NVIDIA jeston nano开发板系统时遇到了奇怪的问题：在使用dd命令备份系统磁盘固件后，开发板无法正常启动进入系统。
## 事故环境
一块4gb运存的NVIDIA jeston nano开发板      
一张用作系统盘的64gb容量内存卡    
ubuntu 18.04 LTS   
一块外置1.0tb磁盘
## 事故经过
在备份磁盘的时候，我一般会执行以下操作：
~~~~~
1.准备一块空闲磁盘
2.格式化为ext4格式
3.挂载
4.创建一个空img文件以供写入备份数据
5.使用dd命令克隆磁盘
~~~~~  
我在笔记本的debian12系统中将自己的硬盘格式化为ext4格式，所以在开发板端直接从挂载磁盘这一步开始执行
```````
sudo fdisk -l #查询开发板挂载磁盘设备的所有分区
sudo mount -t ext4 /dev/sda1 /mnt #将ext4磁盘挂载到/mnt目录下
```````
在挂载磁盘的时候我遇到了一个问题：
`````
mount cant find "/etc/fstab"
`````
在这里我编辑了开发板的fstab文件（如下图）    
![IMG_20240905_162910.jpg](https://blog-oss.allenyou.top/image/66dc409c3e814.jpg)     
在原有的内容下添置了新设备的分区路径，挂载点和文件系统类型
`````
/dev/sda1      /mnt     ext4    defults     0 0
`````   
修改完毕文件后便能正常使用mount挂载命令，此时使用了如下命令备份磁盘内容（fstab文件在修改之初就有备份，完成一切备份工作后将原来的配置文件恢复回了初始状态）
`````
sudo touch /mnt/bf.img #创建了一个0字节的空img文件
sudo dd if=/dev/mmcblk0p1 of=/mnt/bf.img status=progress #在朝img文件写入原盘全盘数据的同时显示烧录进度
`````
在备份完成后我发现磁盘的可启动标志从主分区跑到了外置的/dev/sda1/上，在启动fdisk修改可启动标识无果后。尝试用桌面环境对其进行修改。    
修改完成后我重启了开发板.......什么也没有发生。显示器一直都在显示“无信号”，很显然开发板的系统出现了问题，无法正常启动。     
这一切在重新刷写镜像后恢复了正常
## 问题复现     
### 运行环境：
``````
1.raspberry pi 8gb with raspbian 12（bookworm）
2.64gb内存卡
3.一块外置1.0tb磁盘
```````
### 复现
插入外置硬盘，使用`fdisk -l`查询磁盘信息          
发现内存卡中两个分区的可启动标识不见了，跑到了外置硬盘里面
![屏幕截图 2024-09-07 203338.png](https://blog-oss.allenyou.top/image/66dc48768e661.png)    
为了验证这个猜想是否是导致上文开发板无法正常开机的原因，我重启了树莓派。
![屏幕截图 2024-09-07 204656.png](https://blog-oss.allenyou.top/image/66dc4b677c33b.png)   
树莓派砖了......尝试移除外置移动硬盘再次启动，但这并没有改变什么。
## 故障追溯
上网找一圈+问了GPT4O以后大概得到了一些新的思路（来自chat GPT4o）：
````
"从你的描述和提供的图片来看，问题可能出在Raspberry Pi的启动优先级配置上。Raspberry Pi默认会在插入的设备（包括SD卡和USB硬盘）中寻找启动设备。如果你插入了一个外接硬盘，系统可能会优先尝试从该硬盘启动，这就是为什么你拔掉硬盘后Raspberry Pi无法启动的问题。

你提到硬盘里有一个通过`dd`命令生成的img镜像，可能这个镜像让系统识别为潜在的启动设备，即使它本身并没有有效的启动文件。"
````     
### 故障避免与修复
我修改了`/boot/config.txt`中的启动顺序，来确保Raspberry Pi[总是优先从SD卡启动](https://forums.raspberrypi.com/viewtopic.php?t=364985)。      
在配置文件中的【pi4】配置项中添加以下选项：
`````
boot_order=0xf41
`````
![屏幕截图 2024-09-08 100358.png](https://blog-oss.allenyou.top/image/66dd0632551cf.png)     
重新上电，现在树莓派可以正常从sd卡启动
![屏幕截图 2024-09-08 100644.png](https://blog-oss.allenyou.top/image/66dd06b8a5318.png)
或者编辑`cmdline.txt`来指定启动分区
确保系统指定从SD卡分区启动。比如这样：

```
root=/dev/mmcblk0p1
```
>确保这个参数指定的是你的SD卡分区而不是外置硬盘的分区,否则修改会失效
### 避免
在确认外置硬盘不用作启动盘后，应当使用fdisk删除启动标识符。
`````
sudo fdisk /dev/sda
`````
进入交互式模式以后输入`a`来删除该磁盘的启动标识符
### 通用性解决方案（仅在香橙派尝试过，通用性存疑）   
通过使用分区的UUID，确保启动总是从特定的SD卡分区，而不依赖设备路径。      
首先查找你的SD卡分区的UUID：

```
sudo blkid
```

然后在`/boot/cmdline.txt`中将`root=/dev/mmcblk0p2`替换为：

```
root=UUID=your-uuid-here
```

这种方式能够更加可靠地指定启动分区。