---
id: 3
title: "[ROS]ROS机器人操作系统快速上手指南"
created_at: 2024-5-21T00:30:29Z
modified_at: 2024-5-21T00:30:29Z
description: 机器人操作系统学习记录
--- 
（基于Ubuntu 18.04LTS）
### 前言   
本文档于校外培训期间整理，旨在提高ROS集成环境上手的便捷性。   
# Getting Started
在开始前，您需要准备以下材料    
> 1.一台性能不算过于落后的计算机，且CPU支持虚拟化技术   
>  2.一个集成了ROS开发环境的Ubuntu18.04发行版（以Vmdk虚拟磁盘方式下发）       
 > 3.[vm workstation pro](https://www.vmware.com/content/vmware/vmware-published-sites/cn/products/workstation-pro/workstation-pro-evaluation.html.html)虚拟机平台（版本号最好高于16.x）并且将你的虚拟磁盘导入到你的虚拟机中     
## 注意：windows环境下部署Vmware虚拟机平台请在Windows安全管家内关闭内核隔离选项     
# 1.使用SSH命令和小车进行远程连接
  在集成了ROS的系统中（下文简称ROS）SSH命令作用于连接小车的远程终端以对其进行远程调试。    
  一个我们在ros系统中会用到的ssh命令如下代码块中所示  
  ``` 
  ssh -Y wheelrec@xxx.xxx.xxx.xxx
  ```   
命令解读：
> SSH：使用远程主机连接服务   
> -Y ：一个在ROS中被定义的参数，用于唤起机器人视觉窗口   
> wheelrec ：服务主机的用户名（你想目标主机登录目标主机的哪个账户就输入那个用户名）    
> @ ：指定远程主机的IP地址   
> xxx.xxx.xxx.xxx：远程主机的ip地址    
### 实际运用    
在终端中键入SSH命令   
![login.png](https://blog-oss.allenyou.top/image/664b707aa3843.png)   
如上图所示，您需要输入登录密码以访问账户（ROS默认密码为dongguan）
>值得注意的是，在终端中输入密码将不会显示！        

![lgsu.png](https://blog-oss.allenyou.top/image/664b7218a3a1b.png)        

## 可能遇到的故障分析    
Q：在我向小车发起一个登陆后进行下一步操作，但是屏幕上噼里啪啦报了一大堆错并且拒绝了我的连接（参照下图）      
![keygen-R.png](https://blog-oss.allenyou.top/image/664c0e4d4d94a.png)     
A：你的SSH远程主机公钥发生变化所致，解决方案为在你的终端中键入：
```
ssh keygen -R xxx.xxx.xxx.xxx
```   
此命令用于清理原有的公钥，回车后如下图所示      
![od.png](https://blog-oss.allenyou.top/image/664c2fd33d1ed.png)    
随后请尝试重新发起连接，在弹出的：
```
are you sure you want to continue (yes/no)?
```   
下填写：yes即可正常连接至你的远程主机    
# 使用NFS挂载,远程管理小车的功能包目录
在我们使用的ROS环境中NFS已经安装完毕，可以直接使用mount命令进行挂载
```
sudo mount -t nfs 192.168.0.100:/home/wheeltec/wheeltec_robot /mnt
(若你想解除挂载，你将命令行中的“mount”改为“umount”即可)
``` 
解读：
>sudo：以系统管理员身份执行    
 mount：挂载linux系统之外的文件        
 参数“-t” 指定档案系统的型态，通常不必指定。mount会自动选择正确的型态  
 <ip地址>：你小车的ip地址   
 /home/wheelrec/wheeltec_robot /mnt：将小车的/home/wheelrec/wheeltec_robot目录挂在到你虚拟机的/mnt目录下      
 
 在挂载之前，你的mnt目录内容如图所示：   
 ![befmount.png](https://blog-oss.allenyou.top/image/664d83d627442.png)   
 在挂载完成以后，您的/mnt将显示目录/home/wheeltec/wheeltec_robot下的所有文件，打开/mnt目录即可以对小车上的内容进行修改或读写   
 ![aftmount.png](https://blog-oss.allenyou.top/image/664d83d5c2191.png)   
>注意：断开由小车发出的wifi后你将无法查看挂载目录下的所有文件，同时您的文件资源管理器将因为无法查看文件而卡住       
## 配置和安装NFS服务  
NFS,即网络文件系统，他允许网络之间的计算机之间互相共享资源。在使用nfs时，本地nfs客户端可以透明的读写位于远程主机上的文件，就像访问本地的文件一样。如果你的环境并未安装NFS服务，那么你应该使用以下命令配置并安装它
```
sudo apt-get install nfs-kernel-server
```
> apt是基于debian的linux发行版所使用的包管理器，如果你想在RHEL，SUSE linux或者arch linux上安装它，请考虑使用YUM，RPM或者AUR      

![nfsinstall.png](https://blog-oss.allenyou.top/image/664e0cca05868.png)   
输入“y”键继续执行  
![nsfaftinstall.png](https://blog-oss.allenyou.top/image/664e0db610082.png)    
安装完成后通过编辑“/etc/exports”文件添加你想要的共享目录（就是你想挂载的那个文件夹,这里以home/user/Desktop/nfs_test为例）   
```
sudo vim /etc/exports
``` 
在文件的末尾加上这行东西：
```
/home/user/Desktop/nfs_test
```
![exports.png](https://blog-oss.allenyou.top/image/664e123f585ba.png)    
记得保存并退出，随后为你的挂载目录赋予一个更高的执行权限  
```
sudo chmod -R 777 /home/user/Desktop/nfs_test
```   
初次使用NFS服务时需先启动再将其重启  
```
sudo /etc/init.d/nfs-kernel-server start   (启动)
sudo /etc/init.d/nfs-kernel-server restart（重启）
```
完成以上配置后参考上一版块的方式进行连接

# FAQ
Q：我在玩小车视觉识别的时候弹不出那个显示小车摄像机里画面的框框啊    
A：你是不是把ssh屁股后面的参数“-Y”漏掉了     
Q: 我的vim卡死了你说的":wq"参数不能让其保存并退出   
A：试试
```
:q!
```
实在不行就关闭你的终端杀掉vim进程吧（不到万不得已不建议这样做，可能导致你的文件抽风）    
A:我的vim不能键入任何字符    
Q：建议你阅读[这篇博客](https://www.runoob.com/linux/linux-vim.html),对vim文本编辑器使用进行基础学习。