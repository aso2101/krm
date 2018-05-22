#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import io
import sys
import csv
import json
from lxml import etree


f = open(sys.argv[1],'r') # this is glossary.tmp, 
                          # the csv spreadsheet of the google doc.
g = open('../ajax/lemmas.html','r').read()
w = open('../ajax/glossary.csv','w')
j = open('../ajax/glossary.json','w')

glossary = csv.reader(f)
wordList = etree.HTML(g)
entries = {}
newGlossary = csv.writer(w,delimiter=',',quotechar='"',quoting=csv.QUOTE_ALL)


# this traverses lemmas.html, generated from our edition,
# to create a "word list", and it checks each entry in the 
# "word list" against the "glossary" represented by the google
# spreadsheet
for tr in wordList.xpath('//div/ul/li/span/@id'):
    entries[tr] = ['','','','']
    f.seek(0)
    for row in glossary:
        # if the id from the word list (tr)
        # is already in the glossary (row[0])
        if row[0] == tr:
            # keep the entry the same
            # i.e., generate an entry for the new glossary
            # that includes the same lemma (row[1]), meaning (row[2]), and
            # dictionary reference (row[3])
            entries[tr] = [row[1],row[2],row[3],row[4]]


for term in entries:
    entry = entries[term]
    newGlossary.writerow([term,entry[0],entry[1],entry[2],entry[3]])

json.dump(entries,j,ensure_ascii=False)

f.close()
w.close()
