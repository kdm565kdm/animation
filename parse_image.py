import base64
import re

def filePutContents(file, content):
    with open(file, 'wb') as fp:
        fp.write(content)
def re_get_base64(data):
    result = re.match( r'data:image/jpeg;base64,(.*)', data)
    return result.group(1)


class parseImageCode:
    def __init__(self,images,path):
        self.path=path
        self.images=images
        self.len=len(images)
    def parse_base64(self):
        i=0
        for i in range(i,self.len):
            p=i
            path=self.path+'/'+str(p)+'.jpg'
            data=self.images[i]
            data=re_get_base64(data)
            pictureData=base64.b64decode(data)
            filePutContents(path, pictureData)


