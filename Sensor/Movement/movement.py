#!/usr/bin/python
import time
from random import randrange
import sys
from array import array
import json
import math

def log(msg):
    sys.stderr.write("[%s]: %s\n" % (__file__, msg))

def out(msg): 
    sys.stdout.write("%s\n" % msg)
  
def main(): 
    while(True):  
        randV = randrange(1, 100)
        move = (randV % 2 > 0)             
        
        t = int(time.time())
        e = ({'bv':move,'n': "http://cscw-bplus-04/motion/pir"})
        ret = {'bt':t, 'e':e}
         
        jsondump = json.dumps(ret) 
        out(jsondump)
        sys.stdout.flush()
        time.sleep(1)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        log("Agent exit")

#{"bt": 1417781055, "e": [{"bv": true, "n": "http://cscw-bplus-04/motion/pir"}]}