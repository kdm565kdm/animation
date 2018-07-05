import cv2
import os
import shutil
import numpy as np
from PIL import Image, ImageDraw,ImageFont

class Translate:
    def __init__(self,fps,images_len,image_path,video_path):
        self.fps=fps
        self.len=images_len
        self.image_path=image_path+'/'
        self.video_path=video_path+'/test.avi'
    def become_vodeo(self):
        fourcc = cv2.VideoWriter_fourcc('M', 'J', 'P', 'G')
        video_writer = cv2.VideoWriter(self.video_path, fourcc=fourcc, fps=self.fps, frameSize=(1280,720))

        for i in range(1,self.len):
            p = i

            img = cv2.imread(filename=self.image_path+str(p)+'.jpg')


            print(p)
            cv2.waitKey(100)
            video_writer.write(img)

        video_writer.release()
        
        shutil.rmtree(self.image_path)
        os.mkdir(self.image_path)



