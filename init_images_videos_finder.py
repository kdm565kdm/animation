import os
from os import path 


d = path.dirname(__file__)  #返回当前文件所在的目录 
parent_path = os.path.dirname(d) #获得d所在的目录,即d的父级目录
#parent_path  = os.path.dirname(parent_path) ##获得parent_path所在的目录即parent_path的父级目录
#abspath = path.abspath(d) #返回d所在目录规范的绝对路径

class FilesFinders:
    def __init__(self):
        self.images=parent_path+'/animation_images'
        self.videos=parent_path+'/animation_videos'
    def init_finders(self):
        if(os.path.exists(self.images)==False):
            os.makedirs(self.images)
        if(os.path.exists(self.videos)==False):
            os.makedirs(self.videos)
    def get_videos_finder(self):
        return self.videos
    def get_images_finder(self):
        return self.images

