<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xi="http://www.w3.org/2001/XInclude" xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:fn="http://www.w3.org/2005/xpath-functions" version="1.0" exclude-result-prefixes="tei xi fn">
  <xsl:output method="html" indent="no" encoding="UTF-8" version="4.0"/>

  <!-- APP !-->
  <xsl:template match="tei:app">
    <xsl:element name="li">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  
  <!-- FOREIGN !-->
  <xsl:template match="tei:foreign">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="tei:hi">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- ITEM !-->
  <!-- in the list of parallels !-->
  <xsl:template match="tei:item">
    <xsl:element name="li">
      <xsl:element name="span">
	<xsl:attribute name="class">quotation-string</xsl:attribute>
	<xsl:apply-templates select="tei:label"/>
	<xsl:if test="tei:bibl">
	  <xsl:apply-templates select="tei:bibl"/>
	</xsl:if>
      </xsl:element>
      <xsl:apply-templates select="tei:p"/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:item/tei:label">
    <xsl:element name="span">
      <xsl:attribute name="class">quotation-type</xsl:attribute>
      <xsl:apply-templates/>
      <xsl:text> </xsl:text>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:item/tei:bibl">
    <xsl:apply-templates select="tei:ref"/>
    <xsl:if test="tei:bibl">
      <xsl:text> </xsl:text>
      <xsl:element name="span">
	<xsl:attribute name="class">quotation-biblio</xsl:attribute>
	<xsl:apply-templates select="tei:bibl"/>
      </xsl:element>
    </xsl:if>
  </xsl:template>
  <xsl:template match="tei:item/tei:bibl/tei:bibl">
    <!-- this is a bibliographic reference for the specific
	 edition of the text. !-->
    <xsl:if test="./preceding-sibling::tei:bibl">
      <xsl:text>; </xsl:text>
    </xsl:if>
    <xsl:apply-templates select="./tei:ref"/>
    <xsl:apply-templates select="./tei:citedRange"/>
  </xsl:template>
  <xsl:template match="tei:item/tei:bibl//tei:citedRange">
    <!--<xsl:if test="./preceding-sibling::tei:citedRange">!-->
    <xsl:text>, </xsl:text>
    <!--</xsl:if>!-->
    <xsl:if test="@type='page'">
      <xsl:choose>
	<xsl:when test="@from">
	  <xsl:text>pp. </xsl:text>
	</xsl:when>
	<xsl:otherwise>
	  <xsl:text>p. </xsl:text>
	</xsl:otherwise>
      </xsl:choose>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:template>

  <!-- LEM !-->
  <xsl:template match="tei:lem">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>lem</xsl:text>
      </xsl:attribute>
      <xsl:element name="span">
	<xsl:attribute name="class">
	  <xsl:text>lem-text</xsl:text>
	</xsl:attribute>
	<xsl:apply-templates/>
      </xsl:element>
      <xsl:if test="@wit">
	<xsl:text> </xsl:text>
	<xsl:call-template name="siglum">
	  <xsl:with-param name="siglum" select="@wit"/>
	</xsl:call-template>
      </xsl:if>
      <xsl:if test="@type='conj'">
	<xsl:text> </xsl:text>
	<xsl:element name="span">
	  <xsl:attribute name="class">
	    <xsl:text>rdg-comment</xsl:text>
	  </xsl:attribute>
	  <xsl:text>conj. </xsl:text>
	</xsl:element>
	<xsl:if test="@source">
	  <xsl:text> </xsl:text>
	  <xsl:call-template name="siglum">
	    <xsl:with-param name="siglum" select="@source"/>
	  </xsl:call-template>
	</xsl:if>
	<xsl:if test="@resp">
	  <xsl:text> </xsl:text>
	  <xsl:call-template name="siglum">
	    <xsl:with-param name="siglum" select="@resp"/>
	  </xsl:call-template>
	</xsl:if>
      </xsl:if>
    </xsl:element>
  </xsl:template>


  <!-- LISTAPP !-->
  <xsl:template match="tei:listApp">
    <xsl:element name="h4">
      <xsl:text>Apparatus</xsl:text>
    </xsl:element>
    <xsl:element name="ul">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- NOTE[@TYPE=APPARATUS] !-->
  <xsl:template match="tei:note[@type='apparatus']">
    <xsl:element name="div">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- NOTE[@TYPE=PARALLELS] !-->
  <xsl:template match="tei:note[@type='parallels']">
    <xsl:element name="div">
      <xsl:element name="h4">
	<xsl:text>Parallels</xsl:text>
      </xsl:element>
      <xsl:element name="ul">
	<xsl:apply-templates/>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <xsl:template match="tei:note[not(@type='apparatus') and not(@type='parallels')]">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>app-note</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>


  <xsl:template match="tei:rdg">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>rdg</xsl:text>
      </xsl:attribute>
      <xsl:element name="span">
	<xsl:attribute name="class">
	  <xsl:text>rdg-text</xsl:text>
	</xsl:attribute>
	<xsl:apply-templates/>
      </xsl:element>
      <xsl:if test="@type='conj'">
	<xsl:text> </xsl:text>
	<xsl:element name="span">
	  <xsl:attribute name="class">
	    <xsl:text>rdg-comment</xsl:text>
	  </xsl:attribute>
	  <xsl:text>conj.</xsl:text>
	</xsl:element>
	<xsl:if test="@resp">
	  <xsl:text> </xsl:text>
	  <xsl:call-template name="siglum">
	    <xsl:with-param name="siglum" select="@resp"/>
	  </xsl:call-template>
	</xsl:if>
      </xsl:if>
      <xsl:if test="@wit">
	<xsl:text> </xsl:text>
	<xsl:call-template name="siglum">
	  <xsl:with-param name="siglum" select="@wit"/>
	</xsl:call-template>
      </xsl:if>
      <xsl:if test="@source">
	<xsl:text> </xsl:text>
	<xsl:call-template name="siglum">
	  <xsl:with-param name="siglum" select="@source"/>
	</xsl:call-template>
      </xsl:if>
      <xsl:choose>
	<xsl:when test="./following-sibling::tei:rdg">
	  <xsl:text>; </xsl:text>
	</xsl:when>
	<xsl:when test="not(following-sibling::tei:rdg)">
	  <xsl:text>. </xsl:text>
	</xsl:when>
	<xsl:otherwise/>
      </xsl:choose>
    </xsl:element>
  </xsl:template>

  <xsl:template name="siglum">
    <xsl:param name="siglum"/>
    <xsl:if test="string-length($siglum)">
      <xsl:choose>
	<xsl:when test="substring-after($siglum,' ')">
	  <xsl:call-template name="createToolTip">
	    <xsl:with-param name="text" select="translate(substring-before($siglum,' '),'#','')"/>
	  </xsl:call-template>
	  <xsl:call-template name="siglum"> 
	    <xsl:with-param name="siglum" select="substring-after($siglum,' ')" /> 
	  </xsl:call-template>    
	</xsl:when>
	<xsl:otherwise>
	  <xsl:call-template name="createToolTip">
	    <xsl:with-param name="text" select="translate($siglum,'#','')"/>
	  </xsl:call-template>
	</xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <xsl:template name="createToolTip">
    <xsl:param name="text"/>
    <xsl:element name="a">
      <xsl:attribute name="href">
	<xsl:text>javascript:void();</xsl:text>
      </xsl:attribute>
      <xsl:attribute name="data-toggle">
	<xsl:text>tooltip</xsl:text>
      </xsl:attribute>
      <!-- maybe have it point to a 'sources' page !-->
      <xsl:choose>
	<xsl:when test="$text = 'A' or $text = 'B' or $text = 'C'">
	  <xsl:attribute name="class">
	    <xsl:text>app-tooltip siglum-ms</xsl:text>
	  </xsl:attribute>
	  <xsl:attribute name="title">
	    <xsl:choose>
	      <xsl:when test="$text = 'A'">
		<xsl:text>Kuvempu Institute K125</xsl:text>
	      </xsl:when>
	      <xsl:when test="$text = 'B'">
		<xsl:text>Kuvempu Institute K110</xsl:text>
	      </xsl:when>
	      <xsl:when test="$text = 'C'">
		<xsl:text>GOML K1250</xsl:text>
	      </xsl:when>
	    </xsl:choose>
	  </xsl:attribute>
	</xsl:when>
	<xsl:when test="$text = 'P' or $text = 'M' or $text = 'S' or $text = 'K' or $text = 'V'">
	  <xsl:attribute name="class">
	    <xsl:text>app-tooltip siglum-ed</xsl:text>
	  </xsl:attribute>
	  <xsl:attribute name="title">
	    <xsl:choose>
	      <xsl:when test="$text = 'P'">
		<xsl:text>Pathak</xsl:text>
	      </xsl:when>
	      <xsl:when test="$text = 'M'">
		<xsl:text>Aiyangar and Rao, Madras Edition</xsl:text>
	      </xsl:when>
	      <xsl:when test="$text = 'S'">
		<xsl:text>Seetharamaiah</xsl:text>
	      </xsl:when>
	      <xsl:when test="$text = 'K'">
		<xsl:text>K. Krishna Murthy</xsl:text>
	      </xsl:when>
	      <xsl:when test="$text = 'V'">
		<xsl:text>T.V. Venkatachala Sastry</xsl:text> 
	      </xsl:when>
	    </xsl:choose>
	  </xsl:attribute>
	</xsl:when>
      </xsl:choose>
      <xsl:value-of select="$text"/>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>
