<xsl:stylesheet version="1.0" 
  xmlns="http://www.tei-c.org/ns/1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  exclude-result-prefixes="tei">
  <xsl:output method="xml" encoding="UTF-8"/>
  <xsl:strip-space elements="tei:*"/>

  <!-- 
       This script simply preprocesses the edition (edition-i.xml)
       by doing the following:
       * filtering out everything that is not contained in reg tags
       * adding lemma="X" from the text content of the node when it is missing
         (this allows us to save some time in annotating the text)
       * assigning an ID to every w element
  !-->
  
  <!-- this is the identity transform template !-->
  <xsl:template match="/|@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <!-- filter out verses that either have no choice elements !-->
  <xsl:template match="tei:lg[not(tei:choice)] | tei:trailer[not(tei:choice)]"/>

  <!-- filter out the orig (unanalyzed version) of the remaining verses !-->
  <xsl:template match="tei:lg[tei:choice]">
    <xsl:element name="lg">
      <xsl:attribute name="n"><xsl:value-of select="@n"/></xsl:attribute>
      <xsl:apply-templates select="tei:choice/tei:reg"/>
    </xsl:element>
  </xsl:template>

  <!-- now for w elements: !-->
  <xsl:template match="tei:w">
    <xsl:copy>
      <!-- add the lemma, if it is missing !-->
      <xsl:if test=".[not(@lemma)]">
	<xsl:attribute name="lemma"><xsl:value-of select="."/></xsl:attribute>
      </xsl:if>
      <!-- add an ID !-->
      <!-- start with the chapter and verse prefix !-->
      <xsl:variable name="prefix" select="concat(concat(ancestor::tei:div[@type='chapter']/@n,concat('-',ancestor::tei:lg/@n)),'-')"/>
      <!-- now !-->
      <xsl:variable name="first-word">
	<xsl:value-of select="count(./ancestor-or-self::tei:w[parent::tei:s]/preceding-sibling::tei:w)+1"/>
      </xsl:variable>
      <xsl:variable name="second-word">
	<xsl:if test="parent::tei:w/parent::tei:s">
	  <xsl:value-of select="concat('-',count(./ancestor-or-self::tei:w[parent::tei:w/parent::tei:s]/preceding-sibling::tei:w)+1)"/>
	</xsl:if>
      </xsl:variable>
      <xsl:variable name="third-word">
	<xsl:if test="parent::tei:w/parent::tei:w/parent::tei:s">
	  <xsl:value-of select="concat('-',count(./ancestor-or-self::tei:w[parent::tei:w/parent::tei:w/parent::tei:s]/preceding-sibling::tei:w)+1)"/>
	</xsl:if>
      </xsl:variable>
      <xsl:variable name="fourth-word">
	<xsl:if test="parent::tei:w/parent::tei:w/parent::tei:w/parent::tei:s">
	  <xsl:value-of select="concat('-',count(./ancestor-or-self::tei:w[parent::tei:w/parent::tei:w/parent::tei:w/parent::tei:s]/preceding-sibling::tei:w)+1)"/>
	</xsl:if>
      </xsl:variable>
      <xsl:variable name="fifth-word">
	<xsl:if test="parent::tei:w/parent::tei:w/parent::tei:w/parent::tei:w/parent::tei:s">
	  <xsl:value-of select="concat('-',count(./ancestor-or-self::tei:w[parent::tei:w/parent::tei:w/parent::tei:w/parent::tei:w/parent::tei:s]/preceding-sibling::tei:w)+1)"/>
	</xsl:if>
      </xsl:variable>
      <xsl:variable name="id" select="concat(concat(concat(concat(concat($prefix,$first-word),$second-word),$third-word),$fourth-word),$fifth-word)"/>
      <xsl:attribute name="xml:id"><xsl:value-of select="$id"/></xsl:attribute>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
