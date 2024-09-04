---
id: 2
title: "[ROS]ROS工作空间的创建与编译"
created_at: 2024-5-21T01:15:18Z
modified_at: 2024-5-21T01:15:18Z
description: 机器人操作系统学习记录
---  
本位旨在建立对ROS工作空间目录体系的认知以提升在操作其他项目的便捷性
## Getting started
### step1.打开你的终端    
>当然你也可以通过组合键“Ctrl+Alt+T”唤起比系统自带终端更好用的“终端终结者”应用来代替终端       
同时在开始前我建议先给你的虚拟机拍摄一个有效快照（以备不时之需）

在终端用户主目录路径（~）下输入以下命令，创建一个工作空间目录“ros_workspace_test”和其下子目录“src”     
（其最终成果如下图所示）：
![mkdir.png](https://blog-oss.allenyou.top/image/664cafeef1e8c.png)
> 温馨提示：善用自动补全（热键为TAB）
创建目录的标准示例如下所示：
```
sudo mkdir <file name>     
```
若你想在创建父目录的同时再创建一个子目录，那么你要在mkdir命令的后面加上“-p”参数，如下所示
```
sudo mkdir -p <file name>/<file name>
```
由于你在键入创建目录命令前使用了“sudo”，系统会要求你提供当前所登录用户的密码，在本次所使用的ROS镜像中密码统一如下：    
>dongguan

>注意：在linux终端中输入密码将不会显示 !   
>“-p”参数用于按需创建中间目录。在本文中用于同时创建"ros_workspace_test"目录和"src"子目录。

## step2
### 将工作空间加权
执行
```
sudo chmod -R 777 ros_workspace_test/
```
![chmod.png](https://blog-oss.allenyou.top/image/664cb9c45994e.png)    
执行该命令后，ros_workspace_test目录以及其所有子目录和文件就被当前用户赋予了完全的读、写和执行权限（rwxrwxrwx）。     

在linux系统中，权限由九个字符分三足表示。“r”代表文件所有者，所属组或其他用户的文件,“w”代表读取和写入，“x”代表执行,“-”代表无权限。完全读写权限(rwxrwxrwx/777)的计算方式如下所示：
```
分割你的权限表达方式：rwx|rwx|rwx
r=4 w=2 x=1
第一组：rwx=4+2+1=7
第二组：rwx=4+2+1=7
第三组：rwx=4+2+1=7
在命令中使用数字表达为“777”
```     
注意：为任何文件/目录赋予权限可以让任何用户都能对该目录及其内容进行修改，这可能会导致安全问题。因此在实际使用中，请谨慎考虑是否需要赋予如此广泛的权限
## step 3
### 编译工作空间
跳转到已创建好的工作空间中
```
cd ros_workspace_test
```
在工作空间目录下输入编译命令，编译将在工作空间创建build与devel子目录
```
catkin_make
```  
编译完成后如下图所示    
![catkinmake.png](https://blog-oss.allenyou.top/image/664cbb272c2ef.png)    

>在ROS下，catkin_make 是一个常用的构建工具，用于编译和构建 ROS 功能包。
编译过程包含检查工作空间的目录结构，配置构建环境，编译功能包，生成构建结果。   
编译成功后，catkin_make 会在工作空间的根目录中生成 build 和 devel 两个目录。   
build 目录：包含编译过程中生成的临时文件和中间结果。    
devel 目录：包含编译后的功能包二进制文件、库文件和脚本等。这些文件是可执行文件和库的最终构建结果。

## step 4
### 将编译完成后的工作空间路径添加到系统环境变量中
```
echo " source ~/ros_workspace_test/devel/setup.bash" >> ~/.bashrc
```
>在官方操作手册中，命令中“ros_workspace_test/”部分存在错误（一些多余的空格）若你使用了官方文档提供的命令内容且后续无法正常运行，请检查你的拼写

# ROS功能包与创建与节点的创建与运行
## step1
### 创建自定义ROS功能包。
进入到工作空间目录中的子目录“src”路径下
```
cd src/
```
创建包名为“ros_pkg”的ROS功能包
```
catkin_create_pkg ros_pkg roscpp rospy std_msgs
```
效果如下图所示
![catkincreate.png](https://blog-oss.allenyou.top/image/664cbb272c2ef.png)    
>catkin_create_pkg 是一个 ROS 命令行工具，用于创建一个新的 ROS 功能包。  
ros_pkg：这是要创建的功能包的名称。可以根据需要选择一个有意义的名称。  
roscpp：这是一个所需的依赖项，表示该功能包将使用 roscpp 库，它是用于 C++ 开发的 ROS 客户端库。  
rospy：这是一个所需的依赖项，表示该功能包将使用 rospy 库，它是用于 Python 开发的 ROS 客户端库。  
std_msgs：这是一个所需的依赖项，表示该功能包将使用 std_msgs 包，它是 ROS 中的标准消息包，包含一些常用的消息类型。
## step2
### 板块一：编写C++源文件 （若你想执行python脚本，则请跳转到第二板块）
在ROS功能包ros_pkg目录中子目录“src”路径下输入以下命令，创建并编辑.cpp文件。
```
gedit ros_cpp.cpp
```
执行该命令后，会弹出编辑器编辑该文件。将代码框中的内容直接复制粘贴进你打开的空文件中：
```
#include "ros/ros.h"            //包含ros头文件
int main(int argc, char *argv[])   //编写ros的main函数
{
ros::init(argc, argv, "node_name_demo1"); //初始化ros节点
ROS_INFO("hello world!");             //输出日志
return 0;
}
```
gedit是一个在桌面环境中运行的文本编辑器，在输入以下命令时文本编辑器可打开命令中所指定的文件。若当前目录下不存在这个文件，gedit将为你自动创建一个空文件供你编辑
```
gedit <filename>
```  
## step2    
### 编辑CamkeList.txt文件   
首先进入工作空间的ros_pkg目录下   
```
cd /home/wheeltec-client/ros_workspace_test/src/ros_pkg/
```
随后使用gedit编辑CMakeLists.txt，命令如上在这里就不过多阐述。
![cmaketxt.png](https://blog-oss.allenyou.top/image/664cc414b7a4c.png)   
打开了“CMakeLists.txt”后在文件末尾加上编译规则和目标链接库：    
编译规则（如下）：
```
add_executable(ros_cpp_node src/ros_cpp.cpp)
```
目标链接库（如下）
```
target_link_libraries(ros_cpp_node ${catkin_LIBRARIES})
```
效果如下图所示

![++.png](https://blog-oss.allenyou.top/image/664cc622a1665.png)  

## step4
### 编译功能包并创建可执行节点   
使用cd命令回到工作空间根目录并再次进行编译    
```
cd ros_workspace_test
```
>你可以使用以下命令进行便捷操作   
```
cd ~        (返回你的/home/user/主文件夹下)
cd ..       （返回上一级）
```
返回工作空间主目录后再次使用catkin_make进行编译
```
catkin_make
```
![cppmake.png](https://blog-oss.allenyou.top/image/664ccc7ad2583.png)  
## step5
### 开启ros master   
在你的终端中键入以下指令   
```
roscore
```
在启动rosmaster后打开一个新终端（也可以使用终端终结者的分屏功能），并进入工作空间目录。  
键入下列命令，运行“ros_cpp_node”节点
```
cd ros_workspace_test
```
启动“ros_cpp_node”节点，并开始执行节点所定义的功能。如下图
```
rosrun ros_pkg ros_cpp_node
```
![cppnode.png](https://blog-oss.allenyou.top/image/664cce87ca408.png)    
若终端打印出“hello world”则成功完成本文内容

## 板块二：在定义完毕的功能包下运行.py脚本  
step1：编写一个py脚本    
```
print('Hello World!')
```
step2：使用已经定义过的ROS节点运行你的py脚本
````
rosrun my_package my_script.py   (定义方式参照官方文档或上文内容)
````  
如果你没有定义你的工作节点，可以尝试以下命令（使用python解释器运行）：
```
python /你工作空间的路径/devel/lib/my_package/my_script.py
```   
如果你的python脚本可以直接执行，可以尝试跳过python解释器：
```
/你工作空间的路径/devel/lib/my_package/my_script.py
```


# FAQ
Q：我在编译时遇到报错说什么rosmaster未设置，我配对上小车以后提示进程冲突要求我杀死一个进程，这怎么办?   
A: 因为这两行ip地址将话题监听器锁定在了小车的范围上，使其无法监听到本机rosmaster发布的话题。将其屏蔽即可解决你的问题。    
打开你的主目录，找到一个名字为“bsahrc”的文件    
![bashrc.png](https://blog-oss.allenyou.top/image/664ccf7af0b93.png)  
看到图中带ip地址的两行，使用#将其注释掉   
重新编译即可解决问题   

Q：我按照教程一步步做，但是还是错了。难道是拼写问题...吗？    
A：自动补全！自动补全！自动补全！  

Q：我并没有对工作空间这个概念有一个很清晰的认知    
A：这是ROS工作空间的目录树状图，包含了下列几乎所有目录。希望它可以加深你的理解。
 ![filesysros.png](https://blog-oss.allenyou.top/image/664cd0b614b98.png)