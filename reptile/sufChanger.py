#-------------------------------------------------------------------------------
# Name:        ??1
# Purpose:
#
# Author:      Administrator
#
# Created:     29-09-2018
# Copyright:   (c) Administrator 2018
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import site; site.getsitepackages()
from PIL import Image
from glob import glob
import os
#
#??????????????????????????? Android ???????
#1. ????????? Android png ???;
#2. ???? python3 image2webp.py;
#3. ?????? output ????????????? png ????? webp ??;


def image2webp(inputFile, outputFile):
    try:
        image = Image.open(inputFile)
        if image.mode != 'RGBA' and image.mode != 'RGB':
            image = image.convert('RGBA')

        image.save(outputFile, 'WEBP')
        print(inputFile + ' has converted to ' + outputFile)
    except Exception as e:
        print('Error: ' + inputFile + ' converte failed to ' + outputFile)
        print('Reason:')
        print(e)

matchFileList = glob('*.png')
if len(matchFileList) <= 0:
    print("There are no *.png file in this directory (you can run this script in your *png directory)!")
    exit(-1)

outputDir = os.getcwd() + "/output"
for pngFile in matchFileList:
    fileName = pngFile[0:pngFile.index('.')]
    if not os.path.exists(outputDir):
        os.makedirs(outputDir)
    image2webp(pngFile, outputDir + "/" + fileName + ".webp")

print("Converted done! all webp file in the output directory!")
