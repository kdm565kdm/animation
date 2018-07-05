from django.shortcuts import render
from django.shortcuts import HttpResponse
# Create your views here.

import json
from image_to_video import Translate
from parse_image import parseImageCode
from init_images_videos_finder import FilesFinders
import os



images=[]
#初始化图片帧与定格动画视频文件夹
finders=FilesFinders()
finders.init_finders()

images_path=finders.get_images_finder()
videos_path=finders.get_videos_finder()


def animation(request):
    
    if request.method == "POST":
        #获得定格动画的每一帧图片
        image=request.POST.get("image",None)
        if(image!=None):
            images.append(image)
        
        else:
            frame=request.POST.get('frame_per_second',None)
            frame=int(frame)
            parse_image=parseImageCode(images,images_path)
            parse_image.parse_base64()
            trans_to_video=Translate(frame,len(images),images_path,videos_path)
            trans_to_video.become_video()
            images.clear()
            #return_json = {'test':'后台打包合成成功！！'}
            return HttpResponse(json.dumps(return_json), content_type='application/json')
        return_json = {'test':'11111'}
        return HttpResponse(json.dumps(return_json), content_type='application/json')
    return render(request,'animation.html')

def upload(request):
    return render(request,'upload.html')
