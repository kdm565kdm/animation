import cv2
import os
import shutil
import random
import numpy as np
from PIL import Image, ImageDraw,ImageFont
seq = list(range(1,3000000))


class Translate:
    def __init__(self,fps,images_len,image_path,video_path):
        filename = random.sample(seq,900)
        self.fps=fps
        self.len=images_len
        self.image_path=image_path+'/'
        self.video_path=video_path+'/'+str(filename[444])+'.avi'
    def become_video(self):
        fourcc = cv2.VideoWriter_fourcc('M', 'J', 'P', 'G')
        video_writer = cv2.VideoWriter(self.video_path, fourcc=fourcc, fps=self.fps, frameSize=(1280,720))

        for i in range(1,self.len):
            p = i
            img = cv2.imread(filename=self.image_path+str(p)+'.jpg')
            cv2.waitKey(100)
            try:
                video_writer.write(img)
            except:
                print('error in image to video')
                video_writer.release()
        
                shutil.rmtree(self.image_path)
                os.mkdir(self.image_path)
        video_writer.release()
        
        shutil.rmtree(self.image_path)
        os.mkdir(self.image_path)



