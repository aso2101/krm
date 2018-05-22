<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xi="http://www.w3.org/2001/XInclude" xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" version="1.0" exclude-result-prefixes="tei xi fn">
  <xsl:output method="html" indent="yes" encoding="UTF-8" version="4.0"/>
  <!-- 
       This stylesheet will go through a MODIFIED version of the
       edition (see lemmas-1.xsl), looking for all analyzed 
       verses, and then it will spit out an HTML file
       (in ajax/lemmas.html) that contains a glossary,
       consisting of: a span with an id for the lemma,
       and a list of the occurrences, including:
         - the form that occurs;
	 - the morphological identification;
	 - the location in the text.
       !-->

  <xsl:variable name="sortOrder">a|ā|i|ī|u|ū|r̥|r̥̄|e|ē|ai|o|ō|au|k|kh|g|gh|ṅ|c|ch|j|jh|ñ|ṭ|ṭh|ḍ|ḍh|ṇ|t|th|d|dh|n|p|ph|b|bh|m|y|r|ṟ|l|v|ś|ṣ|s|h|ḷ|ḻ</xsl:variable>
  <xsl:variable name="interpGrp" select="//tei:interpGrp"/>


  <xsl:template match="/">
    <xsl:element name="div">
      <xsl:element name="h1">Glossary</xsl:element>
      <xsl:element name="div">
	<xsl:attribute name="style">text-align:right</xsl:attribute>
	<xsl:element name="label">
	  <xsl:attribute name="style">display:inline-block;text-align:left;</xsl:attribute>
	  <xsl:text>Search:</xsl:text>
	  <xsl:element name="input">
	    <xsl:attribute name="type">search</xsl:attribute>
	    <xsl:attribute name="class">form-control form-control-sm</xsl:attribute>
	    <xsl:attribute name="name">searchterm</xsl:attribute>
	    <xsl:attribute name="placeholder"></xsl:attribute>
	    <xsl:attribute name="style">display:inline-block;width:auto;margin-left:0.5em;</xsl:attribute>
	  </xsl:element>
	</xsl:element>
      </xsl:element>
      <!-- get all of the lemmas and sort them by alphabetic order !-->
      <!-- right now, i am only grabbing "terminal" words !-->
      <xsl:element name="ul">
	<xsl:attribute name="class">gl</xsl:attribute>
	<xsl:for-each select=".//tei:w[@lemma][not(child::tei:w)]">
	  <xsl:sort order="ascending" select="@lemma"/>
          <xsl:variable name="lemma" select="@lemma"/>
	  <xsl:if test="@lemma[not(.=preceding::tei:*/@lemma)]">
	    <xsl:element name="li">
	      <xsl:element name="span">
		<!-- use the value of @lemma as the KEY !-->
		<xsl:attribute name="id"><xsl:value-of select="@lemma"/></xsl:attribute>
		<xsl:attribute name="class">gl-lemma translit</xsl:attribute>
		<!-- we will fill this in subsequently
		     from the spreadsheet. !-->
		<xsl:text> </xsl:text>
	      </xsl:element>
	      <xsl:element name="span">
		<xsl:attribute name="class">gl-def</xsl:attribute>
		<!-- the definitions are inserted automatically
		     from our spreadsheet !-->
	      </xsl:element>
	      <xsl:element name="span">
		<xsl:attribute name="class">gl-kittel</xsl:attribute>
		<!-- so, too, are the references to Kittel !-->
	      </xsl:element>
	      <xsl:element name="span">
		<xsl:attribute name="class">gl-comment</xsl:attribute>
		<!-- so, too, are any comments we have. !-->
	      </xsl:element>
	      <xsl:element name="ul">
		<xsl:attribute name="class">fa-ul</xsl:attribute>
		<!-- get all of the forms of that lemma !-->
		<xsl:for-each select="//tei:w[@lemma = $lemma]">
		  <xsl:sort order="ascending" select="."/>
		  <xsl:for-each select=".[not(text() = preceding::tei:w/text())]">
		    <xsl:variable name="form" select="./text()"/>
		    <xsl:element name="li">
		      <xsl:element name="i">
			<xsl:attribute name="class">fa-li fa fa-caret-right</xsl:attribute>
		      </xsl:element>
		      <xsl:element name="span">
			<xsl:attribute name="id"><xsl:value-of select="."/></xsl:attribute>
			<xsl:attribute name="class">gl-form translit</xsl:attribute>
			<xsl:value-of select="."/>
			<xsl:if test=".[@ana = '#ibc']">
			  <xsl:text>-</xsl:text>
			</xsl:if>
		      </xsl:element>
		      <xsl:if test="@ana">
			<xsl:call-template name="analysis">
			  <xsl:with-param name="ana" select="@ana"/>
			</xsl:call-template>
		      </xsl:if>
		      <xsl:element name="span">
			<xsl:attribute name="class">gl-ref</xsl:attribute>
			<xsl:for-each select="//tei:w[text() = $form]">
			  <!-- put in a comma and space if necessary !-->
			  <xsl:if test="./preceding::tei:w[text() = $form]">
			    <xsl:text>, </xsl:text>
			  </xsl:if>
			  <xsl:variable name="chapter" select="./ancestor-or-self::tei:div[@type='chapter']/@n"/>
			  <xsl:variable name="verse" select="./ancestor-or-self::tei:lg/@n"/>
			  <xsl:call-template name="reference">
			    <xsl:with-param name="chapter" select="$chapter"/>
			    <xsl:with-param name="verse" select="$verse"/>
			  </xsl:call-template>
			</xsl:for-each>
		      </xsl:element>
		    </xsl:element>
		  </xsl:for-each>
		</xsl:for-each>
	      </xsl:element>
	    </xsl:element>
	  </xsl:if>
	</xsl:for-each>
      </xsl:element>
    </xsl:element>
    <xsl:apply-templates select="$interpGrp"/>
  </xsl:template>

  <xsl:template match="tei:interpGrp">
    <xsl:element name="h4">
      <xsl:text>Tags used in this glossary:</xsl:text>
    </xsl:element>
    <xsl:element name="ul">
      <xsl:attribute name="class">interpgrp</xsl:attribute>
      <xsl:apply-templates select="tei:interp"/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="tei:interp">
    <xsl:element name="li">
      <xsl:element name="span">
	<xsl:attribute name="class">interp-abbrev</xsl:attribute>
	<xsl:value-of select="@xml:id"/>
      </xsl:element>
      <xsl:text> = </xsl:text>
      <xsl:element name="span">
	<xsl:apply-templates/>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <xsl:template match="tei:hi">
    <xsl:element name="i">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <xsl:template name="analysis">
    <xsl:param name="ana"/>
    <xsl:element name="span">
      <xsl:attribute name="class">gl-ana</xsl:attribute>
      <xsl:for-each select="tokenize($ana,'\s')">
	<!-- put in a comma and space if necessary !-->
	<xsl:if test="position() > 1">
	  <xsl:text> </xsl:text>
	</xsl:if>
	<xsl:variable name="tag">
	  <xsl:value-of select="translate(.,'#','')"/>
	</xsl:variable>
	<xsl:variable name="interp">
	  <xsl:value-of select="$interpGrp//tei:interp[@xml:id = $tag]"/>
	</xsl:variable>
	<xsl:element name="a">
	  <xsl:attribute name="href">javascript:void();</xsl:attribute>
	  <xsl:attribute name="class">gl-tag</xsl:attribute>
	  <xsl:attribute name="title">Morphology</xsl:attribute>
	  <xsl:attribute name="data-content"><xsl:value-of select="$interp"/></xsl:attribute>
	  <xsl:value-of select="$tag"/>
	</xsl:element>
      </xsl:for-each>
    </xsl:element>
  </xsl:template>

  <xsl:template name="reference">
    <xsl:param name="chapter"/>
    <xsl:param name="verse"/>
    <xsl:variable name="refstring" select="concat(concat($chapter,'.'),$verse)"/>
    <xsl:variable name="link" select="concat(concat(concat('view.html?c=',$chapter),'&amp;v='),$verse)"/>
    <xsl:element name="a">
      <xsl:attribute name="href"><xsl:value-of select="$link"/></xsl:attribute>
      <xsl:value-of select="$refstring"/>
    </xsl:element>
  </xsl:template>


</xsl:stylesheet>
