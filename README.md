# Kavirājamārgaṁ Website code

This repository contains the code that is used for a website devoted to the /Kavirājamārgaṁ/ that is currently being edited and translated by Andrew Ollett and Sarah Pierce Taylor. It includes:

* HTML templates for the *glossary*, *index*, and a *viewer* for each individual verse.
* Javascript for each of those pgaes.
* XSLT to render the source XML files into HTML.
* A few Python scripts associated with the *glossary*.

This repository does not yet include our *text data* in the form of transcriptions, translations, and so on.

## Stylesheets

## Javascript

## The glossary

The glossary is generated *semi-automatically* from two resources: the XML file containing the edition, where each verse is analyzed into separate lexemes, and a Google Spreadsheet containing definitions for each lexeme. The script compile.py will generate a JSON file that pulls in the glossary data from these two sources, and that JSON file is the data source for the glossary webpage.
