from django.shortcuts import render
from django.shortcuts import HttpResponse
# Create your views here.

import json
#from image_to_video import translate
#from parse_image import parse_image_code
import os

currentpath = os.getcwd()
path = currentpath+"/area_code.json"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                             'Chrome/63.0.3239.108 Safari/537.36'}
photos=[]



def animation(request):
    if request.method == "POST":
        #获得定格动画的每一帧图片
        images=request.POST.getlist("images[]")
        
        print(images)
        return_json = {'test':'11111'}
        return HttpResponse(json.dumps(return_json), content_type='application/json')
    return render(request,'animation.html')

