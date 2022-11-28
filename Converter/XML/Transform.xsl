<?xml version="1.0" encoding="ISO-8859-1" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table id="list">
            <tr>
                <th>Measure From</th>
                <th>Value From</th>
                <th>Measure To</th>
                <th>Value To</th>
            </tr>
            <xsl:for-each select="Values/Value">
                <tr>
                    <td><xsl:value-of select="MeasureFrom" /></td>
                    <td><xsl:value-of select="ValueFrom" /></td>
                    <td><xsl:value-of select="MeasureTo" /></td>
                    <td><xsl:value-of select="ValueTo" /></td>
                </tr>
            </xsl:for-each>
        </table>
    </xsl:template>
</xsl:stylesheet>