<?xml version='1.0' encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output method="html" encoding="UTF-8" indent="yes"/>
 <xsl:strip-space elements="*"/>

 <xsl:template match="/">
  <xsl:apply-templates select="previsions"/>
 </xsl:template>

 <xsl:template match="previsions">
  <div>
   <xsl:apply-templates select="echeance[@hour='6' or @hour='12' or @hour='18']"/>
  </div>
 </xsl:template>
 
 <xsl:template match="echeance[@hour='6']">
  <h1>Météo à 6h à Nancy</h1>
  <p>Pluie :
  <xsl:value-of select="pluie"/></p>
  <p>Risque de neige :
  <xsl:value-of select="risque_neige"/></p>
  <p> Vitesse moyenne du vent :
  <xsl:value-of select="vent_moyen/level"/></p>
  <p>Température : <xsl:value-of select="format-number(temperature/level[@val='2m'] - 273.15, '0.0')"/>°C</p>
 </xsl:template>
 
 <xsl:template match="echeance[@hour='12']">
  <h1>Météo à 12h à Nancy</h1>
  <p>Pluie :
  <xsl:value-of select="pluie"/></p>
  <p>Risque de neige :
  <xsl:value-of select="risque_neige"/></p>
  <p> Vitesse moyenne du vent :
  <xsl:value-of select="vent_moyen/level"/></p>
  <p>Température : <xsl:value-of select="format-number(temperature/level[@val='2m'] - 273.15, '0.0')"/>°C</p>
 </xsl:template>
 
 <xsl:template match="echeance[@hour='18']">
  <h1>Météo à 18h à Nancy</h1>
  <p>Pluie :
  <xsl:value-of select="pluie"/></p>
  <p>Risque de neige :
  <xsl:value-of select="risque_neige"/></p>
  <p> Vitesse moyenne du vent :
  <xsl:value-of select="vent_moyen/level"/></p>
  <p>Température : <xsl:value-of select="format-number(temperature/level[@val='2m'] - 273.15, '0.0')"/>°C</p>
 </xsl:template>
 
</xsl:stylesheet>
